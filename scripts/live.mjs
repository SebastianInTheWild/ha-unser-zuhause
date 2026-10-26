// Live-Prüfung im echten Home Assistant (Chromium per Playwright).
// Aufruf: node scripts/live.mjs <Prüfskript.mjs>  – das Prüfskript exportiert default async (page, env) => {}
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);
const url = env.HA_URL.replace(/\/$/, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && console.log(`[${m.type()}]`, m.text().slice(0, 300)));
page.on("pageerror", (e) => console.log("[pageerror]", e.message, (e.stack || "").split(/\n/).slice(1, 4).join(" | ")));
await page.addInitScript(
  ({ url, token }) => {
    localStorage.setItem("hassTokens", JSON.stringify({
      access_token: token, token_type: "Bearer", expires_in: 1e9, hassUrl: url, clientId: `${url}/`,
      expires: Date.now() + 1e12, refresh_token: "",
    }));
  },
  { url, token: env.HA_TOKEN },
);
try {
  const check = await import(pathToFileURL(process.argv[2]).href);
  await check.default(page, { url });
} finally {
  await browser.close();
}
