// Lädt die Strategy und das Karten-Paket (../ha-unser-zuhause-cards) als Dashboard-Resourcen in Home Assistant hoch.
// Zugangsdaten aus .env (nicht im Git): HA_URL, HA_TOKEN, optional HA_RESOURCE_ID / HA_CARDS_RESOURCE_ID.
// Aufruf: npm run deploy  (führt vorher die Tests aus)
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const envFile = `${root}.env`;
if (!existsSync(envFile)) {
  console.error("✘ .env fehlt. Vorlage: .env.example kopieren und HA_TOKEN eintragen.");
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(envFile, "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith("#") && l.includes("="))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
if (!env.HA_URL || !env.HA_TOKEN) {
  console.error("✘ HA_URL und HA_TOKEN müssen in .env stehen.");
  process.exit(1);
}

// Zwei Dateien: Karten-Paket und Strategy (eigene Resource je Datei)
const targets = [
  {
    name: "Karten",
    file: `${root}../ha-unser-zuhause-cards/dist/unser-zuhause-cards.js`,
    versionRe: /UZ_CARDS_VERSION = "([^"]+)"/,
    id: env.HA_CARDS_RESOURCE_ID,
    marker: "UZ_CARDS_VERSION",
  },
  {
    name: "Strategy",
    file: `${root}dist/unser-zuhause-strategy.js`,
    versionRe: /UZ_VERSION = "([^"]+)"/,
    id: env.HA_RESOURCE_ID,
    marker: "ll-strategy-dashboard-unser-zuhause",
  },
];

// Minimaler WebSocket-Client für die HA-API
const ws = new WebSocket(`${env.HA_URL.replace(/^http/, "ws").replace(/\/$/, "")}/api/websocket`);
let nextId = 1;
const pending = new Map();
const call = (msg) =>
  new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, ...msg }));
  });
const authed = new Promise((resolve, reject) => {
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.type === "auth_required") ws.send(JSON.stringify({ type: "auth", access_token: env.HA_TOKEN }));
    else if (msg.type === "auth_ok") resolve();
    else if (msg.type === "auth_invalid") reject(new Error("Token ungültig"));
    else if (msg.type === "result" && pending.has(msg.id)) {
      const p = pending.get(msg.id);
      pending.delete(msg.id);
      msg.success ? p.resolve(msg.result) : p.reject(new Error(msg.error?.message || "Fehler"));
    }
  };
  ws.onerror = () => reject(new Error(`Keine Verbindung zu ${env.HA_URL}`));
});

// Inline-Resource erkennen: per ID aus .env, sonst am Inhalt
const decode = (r) => {
  const m = String(r.url).match(/^data:[^,]*;base64,(.*)$/);
  return m ? Buffer.from(m[1], "base64").toString("utf8") : "";
};
const isOurs = (t) => (r) => (t.id ? r.id === t.id : decode(r).includes(t.marker));

try {
  await authed;
  for (const t of targets) {
    if (!existsSync(t.file)) throw new Error(`${t.name}: ${t.file} fehlt`);
    const code = readFileSync(t.file, "utf8");
    const version = code.match(t.versionRe)?.[1] ?? "?";
    const url = `data:text/javascript;base64,${Buffer.from(code, "utf8").toString("base64")}`;
    const ours = (await call({ type: "lovelace/resources" })).find(isOurs(t));
    if (ours) await call({ type: "lovelace/resources/update", resource_id: ours.id, res_type: "module", url });
    else await call({ type: "lovelace/resources/create", res_type: "module", url });
    // Kontrolle: Inhalt der Resource in HA = lokale Datei
    const check = (await call({ type: "lovelace/resources" })).find((r) => decode(r) === code);
    if (!check) throw new Error(`${t.name}: Inhalt in HA weicht von der lokalen Datei ab`);
    console.log(`✔ ${t.name} v${version} hochgeladen (${Buffer.byteLength(code)} Bytes, Resource ${check.id})`);
  }
  console.log("Browser mit Strg+Shift+R neu laden.");
  ws.close();
} catch (err) {
  console.error(`✘ Deploy fehlgeschlagen: ${err.message}`);
  ws.close();
  process.exit(1);
}
