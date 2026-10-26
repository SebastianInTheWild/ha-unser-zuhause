// Dashboard-Strategy "unser-zuhause" (Bubble-Card-Design wie "Übersicht")
// Autor: SebastianInTheWild · MIT-Lizenz
// Nutzung: strategy: { type: custom:unser-zuhause, ... }  – Optionen siehe DEFAULTS
// Benötigt (HACS): „Unser Zuhause – Karten“ (uz-*-Karten), Integration „Unser Zuhause“,
//                  Bubble Card, search-card, trash-card, evcc-card

const UZ_VERSION = "1.0.0";

// Neutrale Standardwerte (keine installationsspezifischen Entitäten).
// Alle Einstellungen der Nutzer stehen in der Dashboard-Konfiguration und bleiben bei Updates erhalten.
const DEFAULTS = {
  title: "Unser Zuhause",
  icon: "mdi:home-heart",
  show_clock: true,
  show_search: true,
  // Header Reihe 1: Personen (leer = alle person.*-Entitäten)
  persons: [],
  persons_only_home: true,
  // Header Reihe 2: weitere Badges; badge_actions = Aktion beim Antippen je Badge
  // z. B. { "switch.licht": { action: "toggle" }, "sensor.x": { action: "navigate", navigation_path: "#uz-lichter" } }
  badges: [],
  badge_actions: {},
  badge_names: {}, // eigene Namen je Badge, z. B. { "sensor.aussen_temperatur": "Draußen" } (leer = Name der Entität)
  lights_entity: "",
  covers_entity: "",
  windows_entity: "",
  house_mode_entity: "", // leer = Hausmodus der Integration
  extra_tiles: [],
  favorites: [],
  // Startseite „Unser Zuhause“
  show_greeting: true, // Begrüßung mit Hintergrund nach Tageszeit und Wetter
  weekly_review: "sunday", // Wochenrückblick in der Begrüßung: sunday (sonntags, montags bis 12 Uhr) | always | off
  show_alerts: true, // „Was ist los?“ – nur sichtbar, wenn etwas zu tun ist
  alert_battery: 15, // Batterien unter diesem Wert melden (0 = aus)
  scenes: [], // Szenen-Leiste: Szenen, Skripte, Automationen, Schalter
  scene_all_off: true, // Knopf „Alles aus“ (alle Lichter)
  running_devices: [], // „Läuft gerade“: Geräte (Läuft-Sensor, Betriebszustand oder Leistung in W)
  running_battery: "", // Akku-Füllstand (leer = aus Energie-Einstellungen)
  running_battery_power: "", // Akku-Leistung mit Vorzeichen (+ entladen, − laden)
  person_tiles: [], // Personen-Kacheln (leer = Personen mit Benutzerkonto)
  home_camera: "", // Kamera-Vorschau auf der Startseite (leer = aus)
  // Wetter in "Unser Zuhause" (ohne Wetter-Entität nicht angezeigt)
  weather_entity: "",
  weather_title: "Wetter",
  weather_badges: [], // z. B. Außentemperatur, Luftfeuchte, Wind
  weather_forecast_type: "hourly", // hourly | daily | twice_daily
  weather_forecast_slots: 5,
  show_clock_weather: false, // custom:clock-weather-card (HACS)
  clock_weather_temperature: "",
  clock_weather_humidity: "",
  show_horizon: false, // custom:horizon-card (HACS): Sonne und Mond
  // Müll (ohne Kalender wird das Modul nicht angezeigt)
  show_trash: true,
  trash_calendar: "",
  trash_days: 30, // so viele Tage in die Zukunft
  // Energie: Tageswerte aus dem Standard-Energie-Dashboard (Einstellungen → Energie)
  energy_entity: "",
  energy_cards: ["now", "day"], // now = aktuelle Werte, day = heute; Reihenfolge = Anzeige
  // Einstellungen der Energiekarten (wie im Editor der Karte uz-energy-now-card / uz-energy-day-card)
  energy_card: {},
  // EVCC (mkshb/hass-evcc-card): eine Karte je gewählter Ansicht
  show_evcc: true,
  evcc_modes: ["loadpoint"],
  evcc_loadpoint: "",
  evcc_size: "",
  evcc_options: {},
  // Module: Titel/Icons ("Unser Zuhause" nutzt title/icon)
  energy_title: "Energie",
  energy_icon: "mdi:lightning-bolt",
  evcc_title: "EVCC",
  evcc_icon: "mdi:ev-station",
  trash_title: "Müll",
  trash_icon: "mdi:trash-can-outline",
  // Eigene Module: [{ key, title, icon, cards: [ ...Karten-YAML... ] }]
  custom_modules: [],
  // Eigene Bubble-Card-Pop-ups: [{ key, name, icon, hash, entity, entities: [...], cards: [...] }]
  // Öffnen über die Adresse (hash), z. B. Badge-Aktion "navigate" mit navigation_path "#uz-garten"
  custom_popups: [],
  // Raster: Zeilen × Spalten mit Modul-Schlüsseln, "" = leere Zelle (Platzhalter)
  // z. B. [["home", "energy", "evcc"], ["floor:eg", "", "floor:og"]]; leer = automatisch
  grid: [],
  show_batteries: true, // Unterseite „Batterien“ (nur wenn Batterie-Geräte vorhanden)
  battery_tile: true, // Kachel „Batterien“ in Unser Zuhause
  battery_title: "Batterien",
  battery_soon: 30, // Abschnitt „Bald“ auf der Batterie-Seite unter diesem Wert
  show_cameras: true, // Unterseite „Kameras“ (nur wenn Kameras vorhanden)
  camera_tile: true, // Kachel „Kameras“ in Unser Zuhause
  // Weitere Kacheln in Unser Zuhause, die andere Dashboards öffnen:
  // [{ title, subtitle, icon, color, path: "/dashboard-x", users: [user_id, …] (leer = alle) }]
  home_links: [],
  camera_title: "Kameras",
  cameras: [], // leer = alle Kameras (ohne Ausschluss-Label)
  camera_columns: 2,
  camera_live: true,
  camera_aspect: "16:9",
  camera_motion: true, // Bewegung/Personen an Kachel und Live-Bild hervorheben
  // Unterseite „Energie“ (Verlauf, Autarkie, Geräte); Kachel unten im Energie-Modul
  show_energy_page: true,
  energy_page_title: "Energie",
  // Tablet-Ansicht: große Uhr, Hausmodus, Kameras; für diese Benutzer die Startseite
  tablet_users: [],
  tablet_title: "Tablet",
  tablet_cameras: [], // leer = die ersten 4 Kameras
  show_system: true, // Unterseite „System“ mit Serverzustand
  system_tile: true, // Kachel in „Unser Zuhause“, öffnet die System-Seite
  system_title: "System",
  system_icon: "mdi:server",
  // leer = automatisch (System Monitor, Global Health Score)
  system_score: "",
  system_cpu: "",
  system_ram: "",
  system_disk: "",
  system_download: "",
  system_upload: "",
  system_router_download: "",
  system_router_upload: "",
  system_speedtest_download: "",
  system_speedtest_upload: "",
  hidden_modules: ["evcc", "trash"], // Müll und EVCC erst nach Bedarf ins Layout ziehen
  // Design
  theme: "",
  background_image: "",
  background_opacity: 30,
  collapsible: true,
  collapse_on_mobile: true,
  // Räume
  hidden_floors: [],
  hidden_areas: [],
  group_by_floors: true,
  exclude_label: "",
};

const WINDOW_CLASSES = ["window", "door", "opening", "garage_door"];
const HIDDEN_COVER_CLASSES = ["garage", "gate"];
const FIXED_MODULES = ["home", "energy", "evcc", "trash"];

const popupHash = (areaId) => `#uz-${areaId.replace(/_/g, "-")}`;
const withDefaults = (config) => ({ ...DEFAULTS, ...config });

// Sensoren der Integration „Unser Zuhause“ (custom_components/unser_zuhause), gefunden über die Registry
const UZ_INTEGRATION = "unser_zuhause";
const integrationEntity = (hass, key) =>
  Object.values(hass?.entities || {}).find((e) => e.platform === UZ_INTEGRATION && e.translation_key === key)?.entity_id;
const hasIntegration = (hass) => Object.values(hass?.entities || {}).some((e) => e.platform === UZ_INTEGRATION);
// Leere Felder = Sensor der Integration
const STATUS_SENSORS = {
  lights_entity: "lights_on",
  covers_entity: "covers_open",
  windows_entity: "openings_open",
  house_mode_entity: "house_mode",
};
const statusEntity = (hass, cfg, field) => cfg[field] || integrationEntity(hass, STATUS_SENSORS[field]);

// Ausschluss-Label an der Entität oder ihrem Gerät
function isExcluded(hass, entityId, label) {
  if (!label) return false;
  const entry = hass.entities[entityId];
  if (!entry) return false;
  return Boolean(
    entry.labels?.includes(label) || hass.devices[entry.device_id]?.labels?.includes(label)
  );
}

// Sichtbare, nicht-diagnostische Entitäten je Bereich (ohne Ausschluss-Label)
function entitiesByArea(hass, excludeLabel) {
  const result = {};
  for (const entry of Object.values(hass.entities)) {
    if (entry.hidden || entry.entity_category) continue;
    if (isExcluded(hass, entry.entity_id, excludeLabel)) continue;
    const state = hass.states[entry.entity_id];
    if (!state) continue;
    const areaId = entry.area_id || hass.devices[entry.device_id]?.area_id;
    if (!areaId) continue;
    (result[areaId] ||= []).push(state);
  }
  return result;
}

function classify(states) {
  const domain = (d) => states.filter((s) => s.entity_id.startsWith(`${d}.`));
  const withClass = (d, classes) =>
    domain(d).filter((s) => classes.includes(s.attributes.device_class));
  return {
    temperature: withClass("sensor", ["temperature"]),
    humidity: withClass("sensor", ["humidity"]),
    climate: domain("climate"),
    lights: domain("light"),
    switches: domain("switch"),
    covers: domain("cover").filter(
      (s) => !HIDDEN_COVER_CLASSES.includes(s.attributes.device_class)
    ),
    windows: withClass("binary_sensor", WINDOW_CLASSES),
  };
}

// Bevorzugt den in den Bereichseinstellungen hinterlegten Sensor
const primarySensor = (area, list, key) =>
  area[`${key}_entity_id`] || list[0]?.entity_id;

const navigate = (path) => ({ action: "navigate", navigation_path: path });
const areaAction = (action, areaId) => ({
  action: "perform-action",
  perform_action: action,
  target: { area_id: areaId },
});

const separator = (name, icon, subButtons = []) => ({
  type: "custom:bubble-card",
  card_type: "separator",
  name,
  icon,
  sub_button: subButtons,
});

const inlineTile = (entity, features = [], extra = {}) => ({
  type: "tile",
  entity,
  vertical: false,
  features_position: "inline",
  ...(features.length ? { features } : {}),
  ...extra,
});

const stateSub = (entity) => ({
  entity,
  show_state: true,
  show_icon: true,
  show_background: false,
});

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);

// ---------- Module & Layout ----------

const visibleAreas = (hass, cfg) =>
  Object.values(hass.areas)
    .filter((a) => !(cfg.hidden_areas || []).includes(a.area_id))
    .filter((a) => !(cfg.hidden_floors || []).includes(a.floor_id))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));

// Alle verfügbaren Module mit Anzeigename (gemeinsam für Strategy und Editor)
function moduleCatalog(hass, cfg) {
  const list = [
    { key: "home", name: cfg.title || "Unser Zuhause", icon: cfg.icon },
    { key: "energy", name: cfg.energy_title, icon: cfg.energy_icon },
    { key: "evcc", name: cfg.evcc_title, icon: cfg.evcc_icon },
    { key: "trash", name: cfg.trash_title, icon: cfg.trash_icon },
  ];
  const areas = visibleAreas(hass, cfg);
  if (cfg.group_by_floors) {
    Object.values(hass.floors || {})
      .filter((f) => !(cfg.hidden_floors || []).includes(f.floor_id))
      .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
      .forEach((f) => list.push({ key: `floor:${f.floor_id}`, name: f.name, icon: f.icon || "mdi:home-floor-0" }));
    if (areas.some((a) => !a.floor_id || !hass.floors?.[a.floor_id])) {
      list.push({ key: "floor:_rest", name: "Weitere Räume", icon: "mdi:home" });
    }
  } else {
    list.push({ key: "rooms", name: "Räume", icon: "mdi:floor-plan" });
  }
  (Array.isArray(cfg.custom_modules) ? cfg.custom_modules : [])
    .filter((m) => m?.key)
    .forEach((m) => list.push({ key: `custom:${m.key}`, name: m.title || m.key, icon: m.icon || "mdi:puzzle" }));
  return list;
}

// Standard-Raster: feste Module in Zeile 1, Etagen/eigene Module in den Zeilen darunter
function defaultGrid(keys) {
  const top = FIXED_MODULES.filter((k) => keys.includes(k));
  const rest = keys.filter((k) => !FIXED_MODULES.includes(k));
  const cols = Math.max(top.length, 1);
  const rows = [top];
  for (let i = 0; i < rest.length; i += cols) rows.push(rest.slice(i, i + cols));
  return rows.map((r) => [...r, ...Array(cols - r.length).fill("")]);
}

// Gespeichertes Raster bereinigen: alle Zeilen gleich breit, unbekannte Module raus,
// neue Module in die erste freie Zelle (sonst neue Zeile)
function normalizeGrid(cfg, keys) {
  const hidden = (cfg.hidden_modules || []).filter((k) => keys.includes(k));
  const shown = keys.filter((k) => !hidden.includes(k));
  if (!Array.isArray(cfg.grid) || !cfg.grid.length) return { rows: defaultGrid(shown), hidden };
  const seen = new Set();
  const cols = Math.max(...cfg.grid.map((r) => (Array.isArray(r) ? r.length : 0)), 1);
  const rows = cfg.grid.map((r) => {
    const row = (Array.isArray(r) ? r : []).map((k) => (shown.includes(k) && !seen.has(k) && seen.add(k) ? k : ""));
    return [...row, ...Array(cols - row.length).fill("")];
  });
  for (const k of shown.filter((key) => !seen.has(key))) {
    const free = rows.find((r) => r.includes(""));
    if (free) free[free.indexOf("")] = k;
    else rows.push([k, ...Array(cols - 1).fill("")]);
  }
  return { rows, hidden };
}

// ---------- Modul: Unser Zuhause ----------

function headerCards(cfg) {
  const statusTile = (entity, icon, hash) => ({
    type: "tile",
    entity,
    icon,
    name: " ",
    vertical: false,
    state_content: "state",
    tap_action: navigate(hash),
    icon_tap_action: navigate(hash),
  });
  const status = [
    cfg.lights_entity && statusTile(cfg.lights_entity, "mdi:lightbulb-on-outline", "#uz-lichter"),
    cfg.covers_entity && statusTile(cfg.covers_entity, "mdi:window-shutter-open", "#uz-rollos"),
  ].filter(Boolean);

  return [
    { type: "heading", heading: cfg.title, icon: cfg.icon, heading_style: "title" },
    ...(cfg.show_greeting
      ? [{
          type: "custom:uz-greeting-card",
          ...(cfg.weather_entity ? { weather: cfg.weather_entity } : {}),
          ...(cfg.lights_entity ? { lights: cfg.lights_entity } : {}),
          ...(cfg.windows_entity ? { windows: cfg.windows_entity } : {}),
          ...(cfg._windowsCount ? { windows_count: cfg._windowsCount } : {}),
          ...(cfg.trash_calendar ? { trash_calendar: cfg.trash_calendar } : {}),
          weekly_review: cfg.weekly_review,
          ...(cfg._energyStats ? { energy: cfg._energyStats } : {}),
          grid_options: { columns: "full" },
        }]
      : []),
    ...(cfg.show_clock
      ? [{ type: "clock", clock_size: "small", show_seconds: false, grid_options: { columns: "full" } }]
      : []),
    // Hausmodus direkt unter der Uhr, gleich breit; Auswahl rechts in der Kachel wie im Simon42-Dashboard
    ...(cfg.house_mode_entity
      ? [{
          type: "tile",
          entity: cfg.house_mode_entity,
          ...(cfg.house_mode_from_integration ? { name: "Hausmodus" } : {}),
          hide_state: true,
          vertical: false,
          features: [{ type: "select-options" }],
          features_position: "inline",
          grid_options: { columns: "full" },
        }]
      : []),
    ...((cfg.scenes || []).length || cfg.scene_all_off
      ? [{ type: "custom:uz-scene-bar", items: cfg.scenes || [], all_off: Boolean(cfg.scene_all_off && cfg.lights_entity), grid_options: { columns: "full" } }]
      : []),
    ...(cfg.show_alerts
      ? [{
          type: "custom:uz-alerts-card",
          ...(cfg.windows_entity ? { windows: cfg.windows_entity } : {}),
          ...(cfg.house_mode_entity ? { house_mode: cfg.house_mode_entity } : {}),
          ...(cfg.camera_motion && cfg._cameras?.length ? { cameras: cfg._cameras } : {}),
          battery_threshold: Number(cfg.alert_battery ?? 15),
          ...(cfg._batteryPage ? { battery_path: BATTERY_PATH } : {}),
          grid_options: { columns: "full" },
        }]
      : []),
    ...(cfg.show_search ? [{ type: "custom:search-card" }] : []),
    ...(status.length ? [{ type: "horizontal-stack", cards: status }] : []),
    ...(cfg.extra_tiles || []).map((e) => ({ type: "tile", entity: e, vertical: false })),
    ...(cfg.windows_entity
      ? [{ type: "tile", entity: cfg.windows_entity, name: "Fenster & Türen", vertical: false, tap_action: navigate("#uz-fenster") }]
      : []),
    ...((cfg.running_devices || []).length || (cfg._battery && cfg._batteryPower)
      ? [{
          type: "custom:uz-running-card",
          devices: cfg.running_devices || [],
          ...(cfg._battery && cfg._batteryPower ? { battery: cfg._battery, battery_power: cfg._batteryPower } : {}),
          grid_options: { columns: "full" },
        }]
      : []),
    ...(cfg._personTiles?.length ? [{ type: "custom:uz-person-card", entities: cfg._personTiles, grid_options: { columns: "full" } }] : []),
    ...(cfg._systemTile ? [cfg._systemTile] : []),
    ...(cfg.home_camera
      ? [{
          type: "custom:uz-camera-preview",
          camera: cfg.home_camera,
          ...(cfg.camera_motion && cfg._cameras?.length ? { cameras: cfg._cameras } : {}),
          path: CAMERA_PATH,
          grid_options: { columns: "full" },
        }]
      : []),
    ...(cfg._cameraTile ? [cfg._cameraTile] : []),
    ...(cfg._batteryPage && cfg.battery_tile
      ? [{
          type: "custom:uz-link-tile",
          title: cfg.battery_title,
          icon: "mdi:battery-heart-variant",
          color: "#22c55e",
          path: BATTERY_PATH,
          batteries: Number(cfg.alert_battery ?? 15),
          grid_options: { columns: "full" },
        }]
      : []),
    ...(Array.isArray(cfg.home_links) ? cfg.home_links : [])
      .filter((l) => l?.path)
      .map((l) => ({
        type: "custom:uz-link-tile",
        title: l.title || l.path,
        ...(l.subtitle ? { subtitle: l.subtitle } : {}),
        icon: l.icon || "mdi:view-dashboard-outline",
        color: l.color || "var(--primary-color)",
        path: (l.embed !== false && cfg._embedded?.[l.path]?.path) || l.path,
        grid_options: { columns: "full" },
        // nur für bestimmte Benutzer sichtbar
        ...(Array.isArray(l.users) && l.users.length ? { visibility: [{ condition: "user", users: l.users }] } : {}),
      })),
    ...weatherCards(cfg),
  ];
}

// Verknüpfte Dashboards als Unterseiten von „Unser Zuhause“ einbetten: Unterseiten haben den Zurück-Pfeil.
// Inhalt kommt bei jedem Laden frisch aus dem verknüpften Dashboard. Strategie-Dashboards, YAML ohne Zugriff
// oder Fehler → normaler Link wie bisher.
async function embedLinkedDashboards(hass, links) {
  const out = {};
  for (const l of Array.isArray(links) ? links : []) {
    if (!l?.path || l.embed === false || out[l.path]) continue;
    const [url, viewPath] = String(l.path).replace(/^\//, "").split("/");
    if (!url || !String(l.path).startsWith("/")) continue;
    try {
      const conf = await hass.callWS({ type: "lovelace/config", url_path: url });
      if (!Array.isArray(conf?.views) || !conf.views.length || conf.strategy) continue;
      const slug = `extern-${url.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
      const views = conf.views
        .filter((v) => !v.strategy)
        .map((v, i) => ({ ...v, path: i ? `${slug}-${v.path || i}` : slug, subview: true }));
      if (!views.length) continue;
      const target = viewPath ? views[conf.views.findIndex((v) => v.path === viewPath)] : undefined;
      out[l.path] = { path: (target || views[0]).path, views };
    } catch (e) {
      // kein Zugriff oder Dashboard fehlt: bleibt ein normaler Link
    }
  }
  return out;
}

// Wetter wie im Dashboard "Übersicht": Überschrift mit Badges, Vorhersage, optional Uhr-Wetter und Sonne/Mond
function weatherCards(cfg) {
  if (!cfg.weather_entity) return [];
  return [
    {
      type: "heading",
      heading: cfg.weather_title,
      heading_style: "title",
      icon: "mdi:sun-thermometer-outline",
      badges: (cfg.weather_badges || []).map((entity) => ({ type: "entity", entity, show_state: true, show_icon: true })),
    },
    {
      type: "weather-forecast",
      entity: cfg.weather_entity,
      show_current: false,
      show_forecast: true,
      forecast_type: cfg.weather_forecast_type || "hourly",
      forecast_slots: Number(cfg.weather_forecast_slots) || 5,
    },
    ...(cfg.show_clock_weather
      ? [{
          type: "custom:clock-weather-card",
          entity: cfg.weather_entity,
          ...(cfg.clock_weather_temperature ? { temperature_sensor: cfg.clock_weather_temperature } : {}),
          ...(cfg.clock_weather_humidity ? { humidity_sensor: cfg.clock_weather_humidity } : {}),
          hide_today_section: true,
        }]
      : []),
    ...(cfg.show_horizon
      ? [{
          type: "custom:horizon-card",
          fields: { sunrise: true, sunset: true, dawn: false, noon: false, dusk: false, moonrise: true, moonset: true, moon_phase: true },
        }]
      : []),
  ];
}

const FAVORITE_FEATURES = {
  light: [{ type: "light-brightness" }],
  cover: [{ type: "cover-position" }],
  climate: [{ type: "target-temperature" }],
  media_player: [{ type: "media-player-volume-slider" }],
  switch: [{ type: "toggle" }],
  input_boolean: [{ type: "toggle" }],
  fan: [{ type: "toggle" }],
};

function favoriteCards(entities) {
  if (!entities.length) return [];
  return [
    { type: "heading", heading: "Favoriten", icon: "mdi:star" },
    ...entities.map((e) => inlineTile(e, FAVORITE_FEATURES[e.split(".")[0]] || [])),
  ];
}

// ---------- Modul: Energie ----------

const DEVICE_ICONS = { wallbox: "mdi:car-electric", heizung: "mdi:heat-pump-outline", auto: "mdi:car", gas: "mdi:fire" };

// Liest die Quellen aus dem Standard-Energie-Dashboard (energy/get_prefs)
function energySources(prefs) {
  const src = (type) => (prefs?.energy_sources || []).filter((s) => s.type === type);
  const grid = src("grid")[0];
  return {
    gridFrom: grid?.stat_energy_from ?? grid?.flow_from?.[0]?.stat_energy_from,
    gridTo: grid?.stat_energy_to ?? grid?.flow_to?.[0]?.stat_energy_to,
    // Leistung mit Vorzeichen (HA: positiv = Netzbezug bzw. Entladen)
    gridRate: grid?.stat_rate ?? grid?.power?.[0]?.stat_rate,
    batteryRate: src("battery")[0]?.stat_rate,
    solar: src("solar")[0]?.stat_energy_from,
    solarRate: src("solar")[0]?.stat_rate,
    batteryOut: src("battery")[0]?.stat_energy_from,
    batteryIn: src("battery")[0]?.stat_energy_to,
    batterySoc: src("battery")[0]?.stat_soc,
    water: src("water")[0]?.stat_energy_from,
    waterRate: src("water")[0]?.stat_rate,
    devices: prefs?.device_consumption || [],
  };
}

// Einstellungen der Energiekarten. Ältere Konfigurationen (einzelne Felder) werden übernommen.
function energyCardConfig(cfg) {
  if (cfg.energy_card && typeof cfg.energy_card === "object" && Object.keys(cfg.energy_card).length) {
    return cfg.energy_card;
  }
  const legacy = {
    devices: cfg.energy_devices,
    device_power: cfg.power_devices,
    show_water: cfg.show_water,
    fossil_entity: cfg.fossil_entity,
    power_grid_in: cfg.power_grid_in,
    power_grid_out: cfg.power_grid_out,
    power_solar: cfg.power_solar,
    power_battery_in: cfg.power_battery_in,
    power_battery_out: cfg.power_battery_out,
    extra: cfg.energy_extra,
  };
  return Object.fromEntries(Object.entries(legacy).filter(([, v]) => v !== undefined && v !== ""));
}

function energyModuleCards(cfg, prefs) {
  const s = energySources(prefs);
  const hasSources = Boolean(s.gridFrom || s.solar || s.batteryOut);
  // Auswahl und Reihenfolge der Karten: now = aktuelle Werte, day = heute
  const choice = Array.isArray(cfg.energy_cards) ? cfg.energy_cards : ["now", "day"];
  const card = energyCardConfig(cfg);
  const diagrams = hasSources
    ? choice
        .filter((k) => k === "now" || k === "day")
        .map((k) => ({ ...card, type: k === "now" ? "custom:uz-energy-now-card" : "custom:uz-energy-day-card" }))
    : [];
  if (!diagrams.length && !cfg.energy_entity) return [];
  return [
    {
      type: "heading",
      heading: cfg.energy_title,
      heading_style: "title",
      icon: cfg.energy_icon,
      badges: cfg.energy_entity ? [{ type: "entity", entity: cfg.energy_entity, show_state: true }] : [],
    },
    ...diagrams,
    ...(cfg.show_energy_page && hasSources
      ? [{
          type: "custom:uz-link-tile",
          title: "Verlauf & Bilanz",
          subtitle: "Autarkie, Eigenverbrauch, Geräte",
          icon: "mdi:chart-areaspline",
          color: "#eab308",
          path: ENERGY_PATH,
          grid_options: { columns: "full" },
        }]
      : []),
  ];
}

// ---------- Unterseite „Energie“ ----------

const ENERGY_PATH = "energie";

// Hintergrund/Theme wie die Hauptseite
const viewLook = (cfg) => ({
  ...(cfg.theme ? { theme: cfg.theme } : {}),
  ...(cfg.background_image
    ? { background: { image: cfg.background_image, opacity: cfg.background_opacity ?? 30, size: "cover" } }
    : {}),
});

// Jetzt / Heute mit den eigenen Karten, darunter HAs Energie-Karten (Zeitraum wählbar)
function energyView(cfg, prefs) {
  const s = energySources(prefs);
  const card = energyCardConfig(cfg);
  const heading = (heading, icon) => ({ type: "heading", heading, icon, heading_style: "title" });
  const soc = card.battery_soc || s.batterySoc;
  const half = { grid_options: { columns: 6 } };
  // Bericht des Energie-Coaches (Agent, Sensor der Integration) oben über die ganze Breite, sobald es einen gibt
  const coach = cfg._energyCoach;
  const coachSection = coach
    ? [{
        type: "grid",
        column_span: 3,
        visibility: [
          { condition: "state", entity: coach, state_not: "unknown" },
          { condition: "state", entity: coach, state_not: "unavailable" },
        ],
        cards: [
          heading("Energie-Coach", "mdi:lightning-bolt-circle"),
          {
            type: "markdown",
            grid_options: { columns: "full" },
            content:
              `### {{ state_attr('${coach}', 'title') }}\n{{ state_attr('${coach}', 'message') }}\n\n` +
              `<small>Stand: {{ as_timestamp(states('${coach}')) | timestamp_custom('%d.%m.%Y %H:%M') }}</small>`,
          },
        ],
      }]
    : [];
  const sections = [
    ...coachSection,
    { type: "grid", cards: [heading("Jetzt", "mdi:flash"), { ...card, type: "custom:uz-energy-now-card" }] },
    { type: "grid", cards: [heading("Heute", "mdi:calendar-today"), { ...card, type: "custom:uz-energy-day-card" }] },
    {
      type: "grid",
      cards: [
        heading("Bilanz", "mdi:scale-balance"),
        { type: "energy-date-selection", grid_options: { columns: "full" } },
        { type: "energy-self-sufficiency-gauge", ...half },
        ...(s.solar ? [{ type: "energy-solar-consumed-gauge", ...half }] : []),
        ...(s.gridTo ? [{ type: "energy-grid-neutrality-gauge", ...half }] : []),
        { type: "energy-carbon-consumed-gauge", ...half },
        ...(soc
          ? [{
              type: "tile", entity: soc, name: "Akku", icon: "mdi:home-battery", vertical: false,
              features: [{ type: "trend-graph", hours_to_show: 24 }], features_position: "bottom", grid_options: { columns: "full" },
            }]
          : []),
      ],
    },
    {
      type: "grid",
      column_span: 3,
      cards: [
        heading("Verlauf", "mdi:chart-bar"),
        { type: "energy-usage-graph", grid_options: { columns: "full" } },
        ...(s.solar ? [{ type: "energy-solar-graph", grid_options: { columns: "full" } }] : []),
      ],
    },
    // Verbrauch, PV, Kauf und Verkauf je Kalenderwoche (Karte rechnet den Verbrauch aus den Flüssen)
    ...(cfg._energyStats
      ? [{
          type: "grid",
          column_span: 3,
          cards: [
            heading("Pro Woche", "mdi:calendar-week"),
            { type: "custom:uz-energy-weeks-card", energy: cfg._energyStats, weeks: 12, grid_options: { columns: "full" } },
          ],
        }]
      : []),
    ...(s.devices.length
      ? [{
          type: "grid",
          column_span: 3,
          cards: [heading("Geräte", "mdi:devices"), { type: "energy-devices-graph", grid_options: { columns: "full" } }],
        }]
      : []),
  ];
  return {
    title: cfg.energy_page_title || cfg.energy_title,
    path: ENERGY_PATH,
    icon: cfg.energy_icon,
    subview: true,
    type: "sections",
    max_columns: 3,
    ...viewLook(cfg),
    sections,
  };
}

// ---------- Modul: EVCC ----------

// Karten des EVCC-Moduls. Ohne eigene Kartenliste: aus den früheren Einstellungen (eine Karte je Ansicht).
function evccCardsConfig(cfg) {
  if (Array.isArray(cfg.evcc_cards)) return cfg.evcc_cards;
  const modes = cfg.evcc_modes?.length ? cfg.evcc_modes : ["loadpoint"];
  return modes.map((mode) => ({
    type: "custom:evcc-card",
    mode,
    ...(cfg.evcc_loadpoint ? { loadpoint: cfg.evcc_loadpoint } : {}),
    ...(cfg.evcc_size ? { size: cfg.evcc_size } : {}),
    ...(cfg.evcc_options && typeof cfg.evcc_options === "object" ? cfg.evcc_options : {}),
  }));
}

function evccModuleCards(cfg) {
  if (!cfg.show_evcc) return [];
  const cards = evccCardsConfig(cfg);
  if (!cards.length) return [];
  return [{ type: "heading", heading: cfg.evcc_title, heading_style: "title", icon: cfg.evcc_icon }, ...cards];
}

// ---------- Modul: Müll ----------

// Karten des Müll-Moduls. Ohne eigene Kartenliste: Müll-Karte wie im Dashboard "Übersicht".
function trashCardsConfig(cfg) {
  if (Array.isArray(cfg.trash_cards)) return cfg.trash_cards;
  if (!cfg.trash_calendar) return [];
  return [{
    type: "custom:trash-card",
    entities: [cfg.trash_calendar],
    event_grouping: true,
    drop_todayevents_from: "23:59:59",
    next_days: Number(cfg.trash_days) || 30,
    pattern: [
      { icon: "mdi:flower", color: "lime", type: "organic", pattern: "Bioabfalltonne", label: "Bioabfalltonne" },
      { icon: "mdi:newspaper", color: "blue", type: "paper", pattern: "Papiertonne", label: "Papier Tonne" },
      { icon: "mdi:recycle-variant", color: "amber", type: "recycle", pattern: "Gelbe Tonne", label: "Gelbe Tonne" },
      { icon: "mdi:trash-can-outline", color: "grey", type: "waste", pattern: "Restabfalltonne", label: "Restmüll" },
      { icon: "mdi:dump-truck", color: "purple", type: "others" },
      { label: "Grünschnitt", icon: "mdi:tree", color: "light-green", type: "custom", pattern: "Grünschnitt" },
      { label: "Weihnachtsbäume", icon: "mdi:pine-tree", color: "green", type: "custom", pattern: "Weihnachts" },
    ],
    day_style: "counter",
    alignment_style: "left",
    color_mode: "icon",
    items_per_row: 1,
    refresh_rate: 720,
    with_label: true,
    full_size: false,
    hide_time_range: false,
    use_summary: false,
    filter_events: true,
  }];
}

function trashModuleCards(cfg) {
  if (!cfg.show_trash) return [];
  const cards = trashCardsConfig(cfg);
  if (!cards.length) return [];
  return [{ type: "heading", icon: cfg.trash_icon, heading: cfg.trash_title, heading_style: "title" }, ...cards];
}

// ---------- Popups ----------

// Hausweite Popups für die Status-Kacheln
function globalPopups(areas, classified) {
  const all = (key) =>
    areas.flatMap((a) => classified[a.area_id][key].map((s) => ({ area: a, state: s })));
  const popup = (hash, name, icon, cards) => ({
    type: "custom:bubble-card",
    card_type: "pop-up",
    hash,
    button_type: "name",
    name,
    icon,
    sub_button: { main: [], bottom: [] },
    cards,
  });
  const named = ({ area, state }) => `${area.name}: ${state.attributes.friendly_name || state.entity_id}`;

  return [
    popup("#uz-lichter", "Eingeschaltete Lichter", "mdi:lightbulb-on-outline", [
      separator("Lichter", "mdi:lamps-outline", [
        { icon: "mdi:led-variant-off", tap_action: { action: "perform-action", perform_action: "light.turn_off", target: { entity_id: "all" } } },
      ]),
      ...all("lights").map((x) =>
        inlineTile(x.state.entity_id, [{ type: "light-brightness" }], {
          name: named(x),
          state_content: "last_changed",
          visibility: [{ condition: "state", entity: x.state.entity_id, state: "on" }],
        })
      ),
    ]),
    popup("#uz-rollos", "Offene Rollos", "mdi:window-shutter-open", [
      separator("Rollos", "mdi:window-shutter"),
      ...all("covers").map((x) =>
        inlineTile(x.state.entity_id, [{ type: "cover-position" }], {
          name: named(x),
          visibility: [{ condition: "state", entity: x.state.entity_id, state_not: "closed" }],
        })
      ),
    ]),
    popup("#uz-fenster", "Offene Fenster & Türen", "mdi:window-open-variant", [
      separator("Fenster & Türen", "mdi:window-open-variant"),
      ...all("windows").map((x) =>
        inlineTile(x.state.entity_id, [], {
          name: named(x),
          visibility: [{ condition: "state", entity: x.state.entity_id, state: "on" }],
        })
      ),
    ]),
  ];
}

// Adresse eines eigenen Pop-ups (immer mit führendem #)
const customPopupHash = (p) => {
  const hash = String(p.hash || "").trim();
  if (!hash) return `#uz-${p.key}`;
  return hash.startsWith("#") ? hash : `#${hash}`;
};

// Eigene Pop-ups: ausgewählte Entitäten als Kacheln (Regler je nach Typ) + freie Karten
function customPopups(hass, cfg) {
  return (Array.isArray(cfg.custom_popups) ? cfg.custom_popups : [])
    .filter((p) => p?.key)
    .map((p) => ({
      type: "custom:bubble-card",
      card_type: "pop-up",
      hash: customPopupHash(p),
      name: p.name || "Pop-up",
      icon: p.icon || "mdi:window-maximize",
      ...(p.entity ? { entity: p.entity, button_type: "state" } : { button_type: "name" }),
      sub_button: { main: [], bottom: [] },
      cards: [
        ...(Array.isArray(p.entities) ? p.entities : [])
          .filter((e) => !isExcluded(hass, e, cfg.exclude_label))
          .map((e) => inlineTile(e, FAVORITE_FEATURES[e.split(".")[0]] || [])),
        ...(Array.isArray(p.cards) ? p.cards : []),
      ],
    }));
}

// ---------- Module: Etagen/Räume ----------

function roomButton(area, c) {
  const temp = primarySensor(area, c.temperature, "temperature");
  const hum = primarySensor(area, c.humidity, "humidity");
  const hash = popupHash(area.area_id);
  return {
    type: "custom:bubble-card",
    card_type: "button",
    button_type: "name",
    name: area.name,
    icon: area.icon || "mdi:texture-box",
    tap_action: navigate(hash),
    button_action: { tap_action: navigate(hash) },
    sub_button: [temp, hum].filter(Boolean).map(stateSub),
    grid_options: { columns: 12 },
  };
}

function roomPopup(area, c) {
  const temp = primarySensor(area, c.temperature, "temperature");
  const hum = primarySensor(area, c.humidity, "humidity");
  const cards = [];

  if (c.temperature.length || c.humidity.length || c.climate.length) {
    cards.push(separator("Klima", "mdi:thermometer"));
    cards.push(...c.climate.map((s) => inlineTile(s.entity_id, [{ type: "target-temperature" }])));
    cards.push(
      ...[...c.temperature, ...c.humidity].map((s) => ({
        type: "tile",
        entity: s.entity_id,
        vertical: false,
        features: [{ type: "trend-graph", hours_to_show: 24 }],
      }))
    );
  }

  if (c.lights.length || c.switches.length) {
    cards.push(
      separator("Lampen & Schalter", "mdi:lamps-outline",
        c.lights.length
          ? [
              { icon: "mdi:led-on", tap_action: areaAction("light.turn_on", area.area_id) },
              { icon: "mdi:led-variant-off", tap_action: areaAction("light.turn_off", area.area_id) },
            ]
          : [])
    );
    cards.push(
      ...c.lights.map((s) =>
        inlineTile(s.entity_id, [{ type: "light-brightness" }], { state_content: "last_changed" })
      ),
      ...c.switches.map((s) => inlineTile(s.entity_id, [{ type: "toggle" }]))
    );
  }

  if (c.covers.length || c.windows.length) {
    cards.push(
      separator("Rollos & Fenster", "mdi:window-shutter",
        c.covers.length
          ? [
              { icon: "mdi:arrow-up-bold-circle-outline", tap_action: areaAction("cover.open_cover", area.area_id) },
              { icon: "mdi:arrow-down-bold-circle-outline", tap_action: areaAction("cover.close_cover", area.area_id) },
            ]
          : [])
    );
    cards.push(
      ...c.covers.map((s) => inlineTile(s.entity_id, [{ type: "cover-position" }])),
      ...c.windows.map((s) => inlineTile(s.entity_id))
    );
  }

  return {
    type: "custom:bubble-card",
    card_type: "pop-up",
    hash: popupHash(area.area_id),
    button_type: "name",
    name: area.name,
    icon: area.icon || "mdi:texture-box",
    sub_button: { main: [temp, hum].filter(Boolean).map(stateSub), bottom: [] },
    cards,
  };
}

// Liefert { "floor:<id>" | "floor:_rest" | "rooms": [heading, ...Raum-Buttons] }
function roomModules(hass, cfg, areas, classified) {
  const button = (a) => roomButton(a, classified[a.area_id]);
  const block = (name, icon, list) => [{ type: "heading", heading: name, icon }, ...list.map(button)];
  if (!cfg.group_by_floors) return { rooms: block("Räume", "mdi:floor-plan", areas) };
  const result = {};
  Object.values(hass.floors || {}).forEach((f) => {
    const list = areas.filter((a) => a.floor_id === f.floor_id);
    if (list.length) {
      result[`floor:${f.floor_id}`] = block(f.name, f.icon || "mdi:home-floor-" + Math.max(0, Math.min(3, f.level ?? 0)), list);
    }
  });
  const loose = areas.filter((a) => !a.floor_id || !hass.floors?.[a.floor_id]);
  if (loose.length) result["floor:_rest"] = block("Weitere Räume", "mdi:home", loose);
  return result;
}

// ---------- System: Zustand des Home-Assistant-Servers ----------
// Quellen: System Monitor (CPU, RAM, Speicher, Netzwerk), Backup, Updates, Reparaturen, Protokoll
// und optional „Home Assistant Global Health Score“ (Integration haghs).

const SYSTEM_PATH = "system";

// Entität einer Integration über Plattform und interne Kennung finden (leer = automatisch)
const platformEntity = (hass, platform, key, prefer) => {
  const list = Object.values(hass?.entities || {}).filter(
    (e) => e.platform === platform && (key === undefined || e.translation_key === key) && !e.hidden,
  );
  return (prefer ? list.find(prefer) : undefined)?.entity_id ?? list[0]?.entity_id;
};
// Netzwerk: die echte Netzwerkkarte, nicht lo/docker/hassio/Thread
const realInterface = (e) => !/_(lo|docker\d*|hassio|wpan\d*|veth\w*)$/.test(e.entity_id);

function systemEntities(hass, cfg) {
  const pick = (field, fallback) => cfg[field] || fallback;
  const disks = Object.values(hass?.entities || {}).filter((e) => e.platform === "systemmonitor" && e.translation_key === "disk_use_percent");
  return {
    score: pick("system_score", platformEntity(hass, "haghs")),
    cpu: pick("system_cpu", platformEntity(hass, "systemmonitor", "processor_use")),
    ram: pick("system_ram", platformEntity(hass, "systemmonitor", "memory_use_percent")),
    // Bevorzugt das Dateisystem mit der Konfiguration
    disk: pick("system_disk", (disks.find((e) => /config/.test(e.entity_id)) || disks[0])?.entity_id),
    download: pick("system_download", platformEntity(hass, "systemmonitor", "throughput_network_in", realInterface)),
    upload: pick("system_upload", platformEntity(hass, "systemmonitor", "throughput_network_out", realInterface)),
    boot: Object.values(hass?.entities || {}).find(
      (e) => e.platform === "systemmonitor" && (e.translation_key === "last_boot" || /last_boot|betriebszeit/.test(e.entity_id)),
    )?.entity_id,
    speedDown: pick("system_speedtest_download", platformEntity(hass, "speedtestdotnet", "download")),
    speedUp: pick("system_speedtest_upload", platformEntity(hass, "speedtestdotnet", "upload")),
    speedPing: platformEntity(hass, "speedtestdotnet", "ping"),
    routerDown: pick("system_router_download", platformEntity(hass, "fritz", "kb_s_received")),
    routerUp: pick("system_router_upload", platformEntity(hass, "fritz", "kb_s_sent")),
    routerIp: platformEntity(hass, "fritz", "external_ip"),
    routerUptime: platformEntity(hass, "fritz", "connection_uptime"),
    backupLast: platformEntity(hass, "backup", "last_successful_automatic_backup"),
    backupNext: platformEntity(hass, "backup", "next_scheduled_automatic_backup"),
    backupState: platformEntity(hass, "backup", "backup_manager_state"),
  };
}

// Kachel im Modul „Unser Zuhause“
const systemTileCard = (cfg, ent) => ({
  type: "custom:uz-system-status-card",
  mode: "tile",
  title: cfg.system_title,
  ...ent,
  grid_options: { columns: "full" },
});

// Unterseite „System“ (subview: kein Reiter in der Kopfzeile, Zurück-Pfeil)
function systemView(cfg, ent) {
  const heading = (heading, icon) => ({ type: "heading", heading, icon, heading_style: "title" });
  const trendTile = (entity, name, icon) => ({
    type: "tile", entity, name, icon, vertical: false,
    features: [{ type: "trend-graph", hours_to_show: 24 }], features_position: "bottom",
  });
  const section = (cards) => ({ type: "grid", cards: cards.filter(Boolean) });
  const sections = [
    section([
      heading("Zustand", "mdi:heart-pulse"),
      { type: "custom:uz-system-status-card", mode: "full", title: cfg.system_title, ...ent, grid_options: { columns: "full" } },
    ]),
    section([
      heading("Auslastung", "mdi:speedometer"),
      ent.cpu && trendTile(ent.cpu, "Prozessor", "mdi:cpu-64-bit"),
      ent.ram && trendTile(ent.ram, "Arbeitsspeicher", "mdi:memory"),
      ent.disk && {
        type: "tile", entity: ent.disk, name: "Speicherplatz", icon: "mdi:harddisk", vertical: false,
        features: [{ type: "bar-gauge", min: 0, max: 100 }], features_position: "bottom",
      },
      ent.boot && { type: "tile", entity: ent.boot, name: "Läuft seit", icon: "mdi:timer-outline", vertical: false },
    ]),
    section([
      heading("Internet", "mdi:web"),
      ent.routerDown && trendTile(ent.routerDown, "Router ↓ jetzt", "mdi:download"),
      ent.routerUp && trendTile(ent.routerUp, "Router ↑ jetzt", "mdi:upload"),
      ent.speedDown && trendTile(ent.speedDown, "Speedtest ↓", "mdi:speedometer"),
      ent.speedUp && trendTile(ent.speedUp, "Speedtest ↑", "mdi:speedometer-medium"),
      ent.speedPing && { type: "tile", entity: ent.speedPing, name: "Ping", icon: "mdi:timer-sand", vertical: false },
      ent.routerUptime && { type: "tile", entity: ent.routerUptime, name: "Online seit", icon: "mdi:web-clock", vertical: false },
      ent.routerIp && { type: "tile", entity: ent.routerIp, name: "Externe IP", icon: "mdi:ip-network-outline", vertical: false },
      !ent.routerDown && !ent.speedDown && {
        type: "markdown",
        content: "Für Werte vom Router die Integration **FRITZ!Box Tools** einrichten, für die Leitungsgeschwindigkeit **Speedtest.net**.",
      },
    ]),
    section([
      heading("Server-Netzwerk", "mdi:lan"),
      ent.download && trendTile(ent.download, "Download", "mdi:download-network-outline"),
      ent.upload && trendTile(ent.upload, "Upload", "mdi:upload-network-outline"),
      !ent.download && !ent.upload && {
        type: "markdown",
        content: "Für Download und Upload im System Monitor die Sensoren **Eingehender/Ausgehender Netzwerkdurchsatz** deiner Netzwerkkarte aktivieren.",
      },
    ]),
    (ent.backupLast || ent.backupNext) && section([
      heading("Backups", "mdi:backup-restore"),
      ent.backupLast && { type: "tile", entity: ent.backupLast, name: "Letztes Backup", icon: "mdi:check-circle-outline", vertical: false },
      ent.backupNext && { type: "tile", entity: ent.backupNext, name: "Nächstes Backup", icon: "mdi:calendar-clock", vertical: false },
      ent.backupState && { type: "tile", entity: ent.backupState, name: "Backup-Status", icon: "mdi:backup-restore", vertical: false },
    ]),
    {
      type: "grid",
      column_span: 3,
      cards: [
        heading("Zombies", "mdi:ghost-outline"),
        { type: "custom:uz-zombie-card", ignore_label: cfg.system_ignore_label || "haghs_ignore", grid_options: { columns: "full" } },
      ],
    },
  ].filter(Boolean);
  return {
    title: cfg.system_title,
    path: SYSTEM_PATH,
    icon: cfg.system_icon,
    subview: true,
    type: "sections",
    max_columns: 3,
    ...(cfg.theme ? { theme: cfg.theme } : {}),
    ...(cfg.background_image
      ? { background: { image: cfg.background_image, opacity: cfg.background_opacity ?? 30, size: "cover" } }
      : {}),
    sections,
  };
}

// Verpackt ein Modul (erste Karte = heading) in eine einklappbare Karte
function collapsibleCards(cfg, key, cards) {
  if (!cfg.collapsible || cards[0]?.type !== "heading") return cards;
  const [head, ...rest] = cards;
  return [{
    type: "custom:uz-collapsible-card",
    key,
    title: head.heading,
    icon: head.icon,
    state_entity: head.badges?.find((b) => b.type === "entity")?.entity,
    collapse_on_mobile: cfg.collapse_on_mobile,
    cards: rest,
  }];
}

// ---------- Batterien ----------

const BATTERY_PATH = "batterien";

// Gibt es Geräte mit Batterie? (gleiche Regeln wie die Karte: Gerät, nicht versteckt, keine Handys/SoC)
function hasBatteryDevices(hass) {
  return Object.values(hass.states || {}).some((s) => {
    if (s.attributes?.device_class !== "battery" || /soc/.test(s.entity_id)) return false;
    const reg = hass.entities?.[s.entity_id];
    return Boolean(reg?.device_id && !reg.hidden && reg.platform !== "mobile_app");
  });
}

function batteryView(cfg) {
  return {
    title: cfg.battery_title,
    path: BATTERY_PATH,
    icon: "mdi:battery-heart-variant",
    subview: true,
    type: "sections",
    max_columns: 2,
    ...(cfg.theme ? { theme: cfg.theme } : {}),
    ...(cfg.background_image
      ? { background: { image: cfg.background_image, opacity: cfg.background_opacity ?? 30, size: "cover" } }
      : {}),
    sections: [{
      type: "grid",
      column_span: 2,
      cards: [{
        type: "custom:uz-battery-card",
        title: cfg.battery_title,
        threshold: Number(cfg.alert_battery ?? 15),
        soon: Number(cfg.battery_soon ?? 30),
        grid_options: { columns: "full" },
      }],
    }],
  };
}

// ---------- Kameras ----------

const CAMERA_PATH = "kameras";

// Ausgewählte Kameras (leer = alle sichtbaren, ohne Ausschluss-Label)
function cameraList(hass, cfg) {
  const chosen = Array.isArray(cfg.cameras) ? cfg.cameras.filter((c) => (typeof c === "string" ? c : c?.entity)) : [];
  if (chosen.length) return chosen;
  return Object.keys(hass.states)
    .filter((id) => id.startsWith("camera.") && !hass.entities?.[id]?.hidden && !isExcluded(hass, id, cfg.exclude_label))
    .sort();
}

function cameraView(cfg, cameras) {
  return {
    title: cfg.camera_title,
    path: CAMERA_PATH,
    icon: "mdi:cctv",
    subview: true,
    type: "panel",
    ...(cfg.theme ? { theme: cfg.theme } : {}),
    ...(cfg.background_image
      ? { background: { image: cfg.background_image, opacity: cfg.background_opacity ?? 30, size: "cover" } }
      : {}),
    cards: [{
      type: "custom:uz-camera-grid-card",
      cameras,
      columns: cfg.camera_columns,
      live: cfg.camera_live,
      aspect_ratio: cfg.camera_aspect,
      highlight_motion: cfg.camera_motion,
    }],
  };
}

// ---------- Tablet-Ansicht ----------
// Große Uhr, Hausmodus, Status und Kameras. Für die gewählten Benutzer die erste Seite,
// für alle anderen eine Unterseite (Adresse …/tablet), damit sie sich prüfen lässt.

const TABLET_PATH = "tablet";

const personBadges = (cfg) =>
  cfg.persons.map((entity) => ({
    type: "entity",
    entity,
    show_name: true,
    show_state: false,
    show_icon: true,
    show_entity_picture: true,
    ...(cfg.persons_only_home ? { visibility: [{ condition: "state", entity, state: "home" }] } : {}),
  }));

function tabletView(cfg, cameras, prefs, isTabletUser) {
  const s = energySources(prefs);
  const cams = (Array.isArray(cfg.tablet_cameras) && cfg.tablet_cameras.length ? cfg.tablet_cameras : cameras).slice(0, 6);
  const big = (entity, name, icon, extra = {}) => ({ type: "tile", entity, name, icon, vertical: false, grid_options: { columns: 6, rows: 2 }, ...extra });
  const left = [
    { type: "clock", clock_size: "large", show_seconds: false, grid_options: { columns: "full", rows: 2 } },
    cfg.house_mode_entity && {
      type: "tile",
      entity: cfg.house_mode_entity,
      ...(cfg.house_mode_from_integration ? { name: "Hausmodus" } : {}),
      hide_state: true,
      vertical: false,
      features: [{ type: "select-options" }],
      features_position: "inline",
      grid_options: { columns: "full", rows: 2 },
    },
    cfg.lights_entity && big(cfg.lights_entity, "Lichter an", "mdi:lightbulb-on-outline", { tap_action: navigate("#uz-lichter") }),
    cfg.windows_entity && big(cfg.windows_entity, "Fenster & Türen", undefined, { tap_action: navigate("#uz-fenster") }),
    cfg.covers_entity && big(cfg.covers_entity, "Rollos offen", "mdi:window-shutter-open", { tap_action: navigate("#uz-rollos") }),
    cfg.weather_entity && {
      type: "weather-forecast", entity: cfg.weather_entity, show_current: true, show_forecast: true, forecast_type: "daily",
      forecast_slots: 5, grid_options: { columns: "full" },
    },
    (s.gridFrom || s.solar || s.batteryOut) && { ...energyCardConfig(cfg), type: "custom:uz-energy-now-card" },
  ].filter(Boolean);
  const sections = [
    { type: "grid", cards: left },
    cams.length && {
      type: "grid",
      column_span: 2,
      cards: [{
        type: "custom:uz-camera-grid-card",
        cameras: cams,
        columns: 2,
        live: cfg.camera_live,
        aspect_ratio: cfg.camera_aspect,
        highlight_motion: cfg.camera_motion,
        grid_options: { columns: "full" },
      }],
    },
  ].filter(Boolean);
  return {
    title: cfg.tablet_title,
    path: TABLET_PATH,
    icon: "mdi:tablet",
    type: "sections",
    max_columns: 3,
    ...(isTabletUser ? {} : { subview: true }),
    ...viewLook(cfg),
    badges: personBadges(cfg),
    sections,
  };
}

// ---------- Strategy ----------

class UnserZuhauseStrategy extends HTMLElement {
  static async generate(config, hass) {
    const base = withDefaults(config);
    let prefs;
    try {
      prefs = await hass.callWS({ type: "energy/get_prefs" });
    } catch (e) {
      prefs = undefined; // Energie-Dashboard nicht eingerichtet
    }
    const embedded = await embedLinkedDashboards(hass, base.home_links);
    const visible = (list) => (list || []).filter((e) => !isExcluded(hass, e, base.exclude_label));
    const visibleOne = (e) => (e && !isExcluded(hass, e, base.exclude_label) ? e : undefined);
    const allPersons = Object.keys(hass.states).filter((e) => e.startsWith("person."));
    const cfg = {
      ...base,
      persons: visible(base.persons?.length ? base.persons : allPersons),
      badges: visible(base.badges).filter((e) => !e.startsWith("person.")),
      extra_tiles: visible(base.extra_tiles),
      favorites: visible(base.favorites),
      lights_entity: visibleOne(statusEntity(hass, base, "lights_entity")),
      covers_entity: visibleOne(statusEntity(hass, base, "covers_entity")),
      windows_entity: visibleOne(statusEntity(hass, base, "windows_entity")),
      house_mode_entity: visibleOne(statusEntity(hass, base, "house_mode_entity")),
      house_mode_from_integration: !base.house_mode_entity, // Name ohne Gerätepräfix „Unser Zuhause“
      _embedded: embedded,
    };
    cfg._windowsCount = integrationEntity(hass, "openings_count");
    cfg._energyCoach = integrationEntity(hass, "energy_coach");
    // Personen-Kacheln: gewählte, sonst Personen mit Benutzerkonto
    cfg._personTiles = visible(
      base.person_tiles?.length ? base.person_tiles : cfg.persons.filter((p) => hass.states[p]?.attributes?.user_id),
    );
    {
      const src = energySources(prefs);
      const card = energyCardConfig(cfg);
      cfg._battery = cfg.running_battery || card.battery_soc || src.batterySoc;
      cfg._batteryPower = cfg.running_battery_power || src.batteryRate;
      // Summen für den Wochenrückblick
      const stats = { solar: src.solar, grid_in: src.gridFrom, grid_out: src.gridTo, battery_in: src.batteryIn, battery_out: src.batteryOut };
      const used = Object.fromEntries(Object.entries(stats).filter(([, v]) => v));
      cfg._energyStats = Object.keys(used).length ? used : undefined;
    }
    const sysEnt = systemEntities(hass, cfg);
    if (cfg.show_system && cfg.system_tile) cfg._systemTile = systemTileCard(cfg, sysEnt);
    cfg._batteryPage = Boolean(cfg.show_batteries && hasBatteryDevices(hass));
    const cameras = cameraList(hass, cfg);
    cfg._cameras = cfg.show_cameras ? cameras.map((c) => (typeof c === "string" ? c : c.entity)) : [];
    if (cfg.show_cameras && cameras.length && cfg.camera_tile) {
      cfg._cameraTile = {
        type: "custom:uz-link-tile",
        title: cfg.camera_title,
        subtitle: `${cameras.length} ${cameras.length === 1 ? "Kamera" : "Kameras"} · Live-Bilder`,
        icon: "mdi:cctv",
        color: "#0ea5e9",
        path: CAMERA_PATH,
        ...(cfg.camera_motion ? { cameras } : {}),
        grid_options: { columns: "full" },
      };
    }
    const byArea = entitiesByArea(hass, cfg.exclude_label);
    const areas = visibleAreas(hass, cfg);
    const classified = {};
    for (const a of areas) classified[a.area_id] = classify(byArea[a.area_id] || []);

    // Karten je Modul; alles außer "Unser Zuhause" einklappbar
    const modules = {
      home: [...headerCards(cfg), ...favoriteCards(cfg.favorites)],
      energy: collapsibleCards(cfg, "energie", energyModuleCards(cfg, prefs)),
      evcc: collapsibleCards(cfg, "evcc", evccModuleCards(cfg)),
      trash: collapsibleCards(cfg, "muell", trashModuleCards(cfg)),
    };
    Object.entries(roomModules(hass, cfg, areas, classified)).forEach(([key, cards]) => {
      modules[key] = collapsibleCards(cfg, key, cards);
    });
    (Array.isArray(cfg.custom_modules) ? cfg.custom_modules : [])
      .filter((m) => m?.key && Array.isArray(m.cards))
      .forEach((m) => {
        const heading = { type: "heading", heading: m.title || m.key, icon: m.icon || "mdi:puzzle", heading_style: "title" };
        modules[`custom:${m.key}`] = collapsibleCards(cfg, `custom-${m.key}`, [heading, ...m.cards]);
      });

    // Raster: jede Zelle ist ein Abschnitt. Die Abschnitte fließen zeilenweise,
    // jede Zeile ist so hoch wie ihr höchstes Modul. Leere Zellen = Platzhalter.
    const { rows } = normalizeGrid(cfg, moduleCatalog(hass, cfg).map((m) => m.key));
    const columns = rows[0]?.length || 1;
    const cells = rows.flat();
    const sections = cells.map((key) => {
      const cards = key ? modules[key] || [] : [];
      return { type: "grid", cards: cards.length ? cards : [{ type: "custom:uz-spacer-card" }] };
    });
    // Popups sind unsichtbar, bis sie geöffnet werden; sie hängen an "Unser Zuhause"
    const popups = [
      ...globalPopups(areas, classified),
      ...areas.map((a) => roomPopup(a, classified[a.area_id])),
      ...customPopups(hass, cfg),
    ];
    const homeIndex = cells.indexOf("home");
    sections[homeIndex >= 0 ? homeIndex : 0].cards.push(...popups);

    // Tablet: für die gewählten Benutzer erste Seite, sonst Unterseite
    const tabletUsers = Array.isArray(cfg.tablet_users) ? cfg.tablet_users : [];
    const isTabletUser = Boolean(hass.user?.id && tabletUsers.includes(hass.user.id));
    const tablet = tabletUsers.length ? tabletView(cfg, cameras, prefs, isTabletUser) : undefined;
    const s = energySources(prefs);
    const hasEnergy = Boolean(s.gridFrom || s.solar || s.batteryOut);

    return {
      views: [
        ...(tablet && isTabletUser ? [tablet] : []),
        {
          title: cfg.title,
          path: "zuhause",
          icon: cfg.icon,
          type: "sections",
          max_columns: columns,
          ...(cfg.theme ? { theme: cfg.theme } : {}),
          ...(cfg.background_image
            ? { background: { image: cfg.background_image, opacity: cfg.background_opacity ?? 30, size: "cover" } }
            : {}),
          // Header Reihe 1: Personen mit Bild (optional nur anwesende)
          badges: personBadges(cfg),
          // Header zentriert; Reihe 2: weitere Badges als eigene Badge-Leiste
          header: {
            layout: "center",
            badges_position: "top",
            ...(cfg.badges.length
              ? { card: { type: "custom:uz-badge-row", entities: cfg.badges, actions: cfg.badge_actions || {}, names: cfg.badge_names || {} } }
              : {}),
          },
          sections,
        },
        ...(cfg.show_system ? [systemView(cfg, sysEnt)] : []),
        ...(cfg.show_cameras && cameras.length ? [cameraView(cfg, cameras)] : []),
        ...(cfg._batteryPage ? [batteryView(cfg)] : []),
        ...(cfg.show_energy_page && hasEnergy ? [energyView(cfg, prefs)] : []),
        ...(tablet && !isTabletUser ? [tablet] : []),
        ...Object.values(embedded).flatMap((e) => e.views),
      ],
    };
  }

  static async getConfigElement() {
    return document.createElement("unser-zuhause-strategy-editor");
  }
}

// ---------- Editor (Dashboard bearbeiten → Strategy-Einstellungen) ----------

const sensor = (name) => ({ name, selector: { entity: { domain: "sensor" } } });

// ---------- Karten-Editor wie auf normalen Dashboards ----------
// Öffnet die Dialoge von Home Assistant selbst: "Karte hinzufügen" (Kartenauswahl, Suche, "Nach Entität")
// und danach den Karten-Editor mit Vorschau – mit dem Editor, den der Entwickler der Karte mitliefert.
// Dafür hängt eine unsichtbare Dashboard-Ansicht (hui-view) mit den Karten des Moduls im Editor;
// ihre Speicherung landet nicht im Dashboard, sondern als Kartenliste im Modul.

const waitDefined = (tag, ms = 5000) =>
  Promise.race([
    customElements.whenDefined(tag),
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);

async function createStackEditor() {
  try {
    const helpers = await window.loadCardHelpers?.();
    helpers?.createCardElement?.({ type: "vertical-stack", cards: [] }); // lädt die Stapel-Karte samt Editor
    await waitDefined("hui-vertical-stack-card");
    return await customElements.get("hui-vertical-stack-card").getConfigElement();
  } catch (e) {
    return null; // Rückfall: Karten als YAML
  }
}

const CARD_EDITOR_STYLE = `
  .uz-cards { display: flex; flex-direction: column; gap: 6px; }
  .uz-card-row {
    display: flex; align-items: center; gap: 10px; padding: 8px 6px 8px 12px; border-radius: 10px; cursor: pointer;
    border: 1px solid var(--divider-color); background: var(--card-background-color);
  }
  .uz-card-row:hover { border-color: var(--primary-color); }
  .uz-card-row > ha-icon { --mdc-icon-size: 22px; color: var(--secondary-text-color); flex: none; }
  .uz-card-text { flex: 1; min-width: 0; }
  .uz-card-name { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .uz-card-sub { font-size: 12px; color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .uz-card-btn {
    border: none; background: transparent; color: var(--secondary-text-color); cursor: pointer;
    width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex: none;
  }
  .uz-card-btn:hover { background: var(--secondary-background-color); }
  .uz-card-btn[disabled] { opacity: .3; cursor: default; }
  .uz-card-btn.danger { color: var(--error-color, #db4437); }
  .uz-card-btn ha-icon { --mdc-icon-size: 20px; }
  .uz-cards-empty { font-size: 13px; color: var(--secondary-text-color); padding: 4px 2px; }
  .uz-add-card {
    display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; height: 36px; padding: 0 14px; border-radius: 18px;
    border: 1px solid var(--primary-color); background: transparent; color: var(--primary-color); cursor: pointer; font-size: 14px; font-weight: 500;
  }
  .uz-add-card ha-icon { --mdc-icon-size: 18px; }
`;

const cardTitle = (card) => {
  const type = String(card?.type || "");
  const custom = (window.customCards || []).find((c) => `custom:${c.type}` === type || c.type === type);
  if (custom?.name) return custom.name;
  const plain = type.replace(/^custom:/, "").replace(/[-_]/g, " ");
  return plain ? plain.charAt(0).toUpperCase() + plain.slice(1) : "Karte";
};

const cardSubtitle = (card, hass) => {
  const entity = card?.entity || (Array.isArray(card?.entities) ? card.entities.map((e) => e?.entity || e).find(Boolean) : undefined);
  const parts = [];
  if (card?.title || card?.name) parts.push(card.title || card.name);
  if (typeof entity === "string") parts.push(hass?.states?.[entity]?.attributes?.friendly_name || entity);
  if (card?.mode) parts.push(card.mode);
  if (Array.isArray(card?.cards)) parts.push(`${card.cards.length} Karten`);
  return parts.join(" · ");
};

// Meldet Änderungen als "cards-changed" (nicht config-changed, damit der Dashboard-Dialog sie nicht abfängt)
class UzCardsEditor extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    if (this._view) this._view.hass = hass;
    if (this._inner) this._inner.hass = hass;
  }

  set lovelace(lovelace) {
    this._lovelace = lovelace;
    if (this._inner) this._inner.lovelace = lovelace;
  }

  // Nur von außen gesetzte, geänderte Karten übernehmen
  set cards(cards) {
    const list = Array.isArray(cards) ? cards : [];
    const json = JSON.stringify(list);
    if (json === this._json) return;
    this._json = json;
    this._cards = list;
    this._renderList();
    if (this._inner?.setConfig) this._inner.setConfig({ type: "vertical-stack", cards: list });
    else if (this._fallback) this._fallback.data = { cards: list };
  }

  connectedCallback() {
    if (this._started) return;
    this._started = true;
    this.innerHTML = `<style>${CARD_EDITOR_STYLE}</style>
      <div class="uz-cards"></div>
      <button class="uz-add-card" type="button"><ha-icon icon="mdi:plus"></ha-icon>Karte hinzufügen</button>
      <div class="uz-dialog-host" style="display:none"></div>`;
    this._list = this.querySelector(".uz-cards");
    this._list.addEventListener("click", (ev) => this._onListClick(ev));
    this.querySelector(".uz-add-card").addEventListener("click", () => this._openCreate());
    this._renderList();
    this._createDialogHost().then((ok) => {
      if (!ok) this._useStackEditor();
    });
  }

  // Unsichtbare Dashboard-Ansicht, über die HA seine Karten-Dialoge öffnet
  async _createDialogHost() {
    try {
      await waitDefined("hui-view");
    } catch (e) {
      return false;
    }
    const view = document.createElement("hui-view");
    this._viewConfig = { title: "Unser Zuhause", cards: [] };
    const config = { views: [this._viewConfig] };
    this._fakeLovelace = {
      config,
      rawConfig: config,
      editMode: false,
      mode: "storage",
      urlPath: null,
      locale: this._hass?.locale,
      enableFullEditMode: () => {},
      setEditMode: () => {},
      saveConfig: async (newConfig) => {
        const cards = newConfig?.views?.[0]?.cards;
        if (Array.isArray(cards)) this._changed(cards);
      },
      deleteConfig: async () => {},
      showToast: () => {},
    };
    view.hass = this._hass;
    view.narrow = false;
    view.index = 0;
    view.lovelace = this._fakeLovelace;
    this.querySelector(".uz-dialog-host").append(view);
    this._view = view;
    return true;
  }

  // Die Ansicht liest die Karten erst beim Öffnen eines Dialogs (kein Neuaufbau der unsichtbaren Karten)
  _dispatchToView(type, detail) {
    if (!this._view) return false;
    this._viewConfig.cards = (this._cards || []).map((c) => ({ ...c }));
    // Layout-Ansicht der View (card-mod & Co. hängen eigene Elemente daneben)
    const children = [...this._view.children];
    const target = children.find((c) => /-view$/.test(c.localName)) || children.find((c) => c.localName !== "card-mod") || this._view;
    target.dispatchEvent(new CustomEvent(type, { detail }));
    return true;
  }

  _openCreate() {
    if (!this._dispatchToView("ll-create-card", {})) this._useStackEditor();
  }

  _openEdit(index) {
    if (!this._dispatchToView("ll-edit-card", { path: [0, index] })) this._useStackEditor();
  }

  _onListClick(ev) {
    const btn = ev.target.closest("[data-act]");
    const row = ev.target.closest(".uz-card-row");
    if (!row) return;
    const index = Number(row.dataset.index);
    const cards = [...(this._cards || [])];
    if (!btn) {
      this._openEdit(index);
      return;
    }
    ev.stopPropagation();
    const act = btn.dataset.act;
    if (act === "up" && index > 0) [cards[index - 1], cards[index]] = [cards[index], cards[index - 1]];
    else if (act === "down" && index < cards.length - 1) [cards[index + 1], cards[index]] = [cards[index], cards[index + 1]];
    else if (act === "remove") cards.splice(index, 1);
    else if (act === "edit") return this._openEdit(index);
    else return;
    this._changed(cards);
    this._renderList();
  }

  _renderList() {
    if (!this._list) return;
    const cards = this._cards || [];
    this._list.innerHTML = cards.length
      ? cards
          .map((card, i) => `
            <div class="uz-card-row" data-index="${i}" title="Karte bearbeiten">
              <ha-icon icon="mdi:card-outline"></ha-icon>
              <div class="uz-card-text">
                <div class="uz-card-name">${esc(cardTitle(card))}</div>
                <div class="uz-card-sub">${esc(cardSubtitle(card, this._hass))}</div>
              </div>
              <button class="uz-card-btn" type="button" data-act="up" title="Nach oben"${i === 0 ? " disabled" : ""}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
              <button class="uz-card-btn" type="button" data-act="down" title="Nach unten"${i === cards.length - 1 ? " disabled" : ""}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
              <button class="uz-card-btn" type="button" data-act="edit" title="Bearbeiten"><ha-icon icon="mdi:pencil"></ha-icon></button>
              <button class="uz-card-btn danger" type="button" data-act="remove" title="Karte entfernen"><ha-icon icon="mdi:delete-outline"></ha-icon></button>
            </div>`)
          .join("")
      : `<div class="uz-cards-empty">Noch keine Karten.</div>`;
  }

  // Rückfall, falls die Dialoge von HA nicht verfügbar sind: Stapel-Editor bzw. YAML
  _useStackEditor() {
    if (this._stackStarted) return;
    this._stackStarted = true;
    this.querySelector(".uz-add-card")?.remove();
    this._list?.remove();
    this._list = undefined;
    createStackEditor().then((inner) => {
      if (inner) {
        this._inner = inner;
        inner.hass = this._hass;
        inner.lovelace = this._lovelace || { config: { views: [] }, mode: "storage", editMode: true };
        inner.setConfig({ type: "vertical-stack", cards: this._cards || [] });
        inner.addEventListener("config-changed", (ev) => {
          ev.stopPropagation();
          this._changed(ev.detail.config?.cards || []);
        });
        this.append(inner);
      } else {
        const form = document.createElement("ha-form");
        form.hass = this._hass;
        form.schema = [{ name: "cards", selector: { object: {} } }];
        form.computeLabel = () => "Karten (YAML-Liste)";
        form.data = { cards: this._cards || [] };
        form.addEventListener("value-changed", (ev) => {
          ev.stopPropagation();
          this._changed(Array.isArray(ev.detail.value.cards) ? ev.detail.value.cards : []);
        });
        this._fallback = form;
        this.append(form);
      }
    });
  }

  _changed(cards) {
    this._json = JSON.stringify(cards);
    this._cards = cards;
    this._renderList();
    this.dispatchEvent(new CustomEvent("cards-changed", { detail: { cards }, bubbles: true, composed: true }));
  }
}

if (!customElements.get("uz-cards-editor")) {
  customElements.define("uz-cards-editor", UzCardsEditor);
}

// ---------- Editor: Dashboards in „Unser Zuhause“ verknüpfen (home_links) ----------
// Meldet Änderungen als "links-changed" mit { links }.

const LINK_COLORS = [
  { value: "#f97316", label: "Orange" },
  { value: "#ef4444", label: "Rot" },
  { value: "#eab308", label: "Gelb" },
  { value: "#22c55e", label: "Grün" },
  { value: "#14b8a6", label: "Türkis" },
  { value: "#0ea5e9", label: "Blau" },
  { value: "#8b5cf6", label: "Lila" },
  { value: "#ec4899", label: "Pink" },
  { value: "var(--primary-color)", label: "Theme-Farbe" },
];

const LINKS_STYLE = `
  .lk-list { display: flex; flex-direction: column; gap: 6px; }
  .lk-row { display: flex; align-items: center; gap: 10px; padding: 8px 6px 8px 10px; border-radius: 12px;
    border: 1px solid var(--divider-color); background: var(--card-background-color); }
  .lk-row.open { border-color: var(--primary-color); }
  .lk-bubble { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex: none;
    background: color-mix(in srgb, var(--c) 18%, transparent); color: var(--c); }
  .lk-bubble ha-icon { --mdc-icon-size: 18px; }
  .lk-text { flex: 1; min-width: 0; }
  .lk-t { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lk-s { font-size: 12px; color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .lk-btn { border: none; background: transparent; color: var(--secondary-text-color); cursor: pointer; width: 32px; height: 32px;
    border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex: none; }
  .lk-btn:hover { background: var(--secondary-background-color); }
  .lk-btn[disabled] { opacity: .3; cursor: default; }
  .lk-btn.danger { color: var(--error-color, #db4437); }
  .lk-btn.confirm { background: var(--error-color, #db4437); color: #fff; }
  .lk-btn ha-icon { --mdc-icon-size: 20px; }
  .lk-form { padding: 4px 4px 12px; }
  .lk-add { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; height: 36px; padding: 0 14px; border-radius: 18px;
    border: 1px solid var(--primary-color); background: transparent; color: var(--primary-color); cursor: pointer; font-size: 14px; font-weight: 500; }
  .lk-add ha-icon { --mdc-icon-size: 18px; }
  .lk-empty { font-size: 13px; color: var(--secondary-text-color); padding: 4px 2px; }
`;

class UzLinksEditor extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    if (!this._loaded) this._load();
  }

  set links(links) {
    const list = Array.isArray(links) ? links : [];
    const json = JSON.stringify(list);
    if (json === this._json) return;
    this._json = json;
    this._links = list;
    this._render();
  }

  connectedCallback() {
    if (this._started) return;
    this._started = true;
    this.innerHTML = `<style>${LINKS_STYLE}</style>
      <div class="lk-list"></div>
      <button class="lk-add" type="button"><ha-icon icon="mdi:plus"></ha-icon>Dashboard verknüpfen</button>`;
    this._list = this.querySelector(".lk-list");
    this._list.addEventListener("click", (ev) => this._onClick(ev));
    this.querySelector(".lk-add").addEventListener("click", () => this._add());
    this._render();
  }

  // Dashboards und Benutzer für die Auswahl (nur für Administratoren lesbar)
  async _load() {
    if (!this._hass) return;
    this._loaded = true;
    const [dashboards, users] = await Promise.all([
      this._hass.callWS({ type: "lovelace/dashboards/list" }).catch(() => []),
      this._hass.callWS({ type: "config/auth/list" }).catch(() => []),
    ]);
    this._dashboards = dashboards.filter((d) => d.mode !== "yaml" || d.url_path);
    this._users = users.filter((u) => !u.system_generated && u.is_active !== false);
    this._formSig = undefined;
    this._render();
  }

  _dashboard(path) {
    const p = String(path || "").replace(/^\//, "").split("/")[0];
    return (this._dashboards || []).find((d) => d.url_path === p);
  }

  _userNames(ids) {
    if (!Array.isArray(ids) || !ids.length) return "alle";
    return ids.map((id) => (this._users || []).find((u) => u.id === id)?.name || "?").join(", ");
  }

  _changed(links) {
    this._links = links;
    this._json = JSON.stringify(links);
    this._render();
    this.dispatchEvent(new CustomEvent("links-changed", { detail: { links }, bubbles: true, composed: true }));
  }

  _add() {
    const used = new Set((this._links || []).map((l) => l.path));
    const d = (this._dashboards || []).find((x) => !used.has(`/${x.url_path}`));
    const link = d
      ? { title: d.title, icon: d.icon || "mdi:view-dashboard-outline", color: "#0ea5e9", path: `/${d.url_path}`, users: [] }
      : { title: "Dashboard", icon: "mdi:view-dashboard-outline", color: "#0ea5e9", path: "", users: [] };
    this._open = (this._links || []).length;
    this._changed([...(this._links || []), link]);
  }

  _onClick(ev) {
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const links = [...(this._links || [])];
    const act = btn.dataset.act;
    if (act === "edit") {
      this._open = this._open === i ? undefined : i;
      this._formSig = undefined;
      this._render();
      return;
    }
    if (act === "up" && i > 0) [links[i - 1], links[i]] = [links[i], links[i - 1]];
    else if (act === "down" && i < links.length - 1) [links[i + 1], links[i]] = [links[i], links[i + 1]];
    else if (act === "remove") {
      // zweiter Klick löscht
      if (this._confirm !== i) {
        this._confirm = i;
        clearTimeout(this._confirmTimer);
        this._confirmTimer = setTimeout(() => {
          this._confirm = undefined;
          this._render();
        }, 10000);
        this._render();
        return;
      }
      this._confirm = undefined;
      links.splice(i, 1);
      if (this._open === i) this._open = undefined;
    } else return;
    this._changed(links);
  }

  _schema() {
    const dashOptions = (this._dashboards || []).map((d) => ({ value: `/${d.url_path}`, label: `${d.title} (/${d.url_path})` }));
    const userOptions = (this._users || []).map((u) => ({ value: u.id, label: u.name }));
    return [
      { name: "path", selector: { select: { mode: "dropdown", custom_value: true, options: dashOptions } } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "title", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
        ],
      },
      { name: "subtitle", selector: { text: {} } },
      { name: "color", selector: { select: { mode: "dropdown", options: LINK_COLORS } } },
      { name: "users", selector: { select: { multiple: true, mode: "list", options: userOptions } } },
      { name: "embed", default: true, selector: { boolean: {} } },
    ];
  }

  _render() {
    if (!this._list) return;
    const links = this._links || [];
    const sig = JSON.stringify([links, this._open, this._confirm, !!this._dashboards]);
    if (sig === this._sig) return;
    this._sig = sig;
    const keepForm = this._form && this._open !== undefined ? this._form : undefined;
    if (keepForm) keepForm.remove();
    this._list.innerHTML = links.length
      ? links
          .map((l, i) => `
            <div class="lk-row${this._open === i ? " open" : ""}" style="--c:${esc(l.color || "var(--primary-color)")}">
              <span class="lk-bubble"><ha-icon icon="${esc(l.icon || "mdi:view-dashboard-outline")}"></ha-icon></span>
              <span class="lk-text">
                <span class="lk-t" style="display:block">${esc(l.title || l.path || "Dashboard")}</span>
                <span class="lk-s" style="display:block">${esc(l.path || "keine Adresse")} · sichtbar für ${esc(this._userNames(l.users))}</span>
              </span>
              <button class="lk-btn" type="button" data-act="up" data-i="${i}" title="Nach oben"${i === 0 ? " disabled" : ""}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
              <button class="lk-btn" type="button" data-act="down" data-i="${i}" title="Nach unten"${i === links.length - 1 ? " disabled" : ""}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
              <button class="lk-btn" type="button" data-act="edit" data-i="${i}" title="Bearbeiten"><ha-icon icon="mdi:pencil"></ha-icon></button>
              <button class="lk-btn danger${this._confirm === i ? " confirm" : ""}" type="button" data-act="remove" data-i="${i}" title="${this._confirm === i ? "Nochmal klicken zum Löschen" : "Entfernen"}"><ha-icon icon="mdi:${this._confirm === i ? "delete-alert" : "delete-outline"}"></ha-icon></button>
            </div>
            ${this._open === i ? `<div class="lk-form" data-form="${i}"></div>` : ""}`)
          .join("")
      : `<div class="lk-empty">Noch keine Dashboards verknüpft.</div>`;
    if (this._open === undefined || !links[this._open]) return;
    const slot = this._list.querySelector(`[data-form="${this._open}"]`);
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        path: "Dashboard (oder eigene Adresse, z. B. /dashboard-heizung)",
        title: "Titel",
        icon: "Symbol",
        subtitle: "Untertitel (optional)",
        color: "Farbe",
        users: "Sichtbar für (leer = alle)",
        embed: "Als Unterseite öffnen (mit Zurück-Pfeil)",
      })[s.name] ?? s.name;
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        const v = ev.detail.value;
        const old = this._links[this._open];
        const next = { ...old, ...v };
        // Dashboard gewechselt: Titel und Symbol übernehmen, wenn sie noch vom alten Dashboard stammen
        if (v.path !== old.path) {
          const before = this._dashboard(old.path);
          const after = this._dashboard(v.path);
          if (after && (!old.title || old.title === before?.title)) next.title = after.title;
          if (after?.icon && (!old.icon || old.icon === before?.icon || old.icon === "mdi:view-dashboard-outline")) next.icon = after.icon;
        }
        if (!next.subtitle) delete next.subtitle;
        const links2 = [...this._links];
        links2[this._open] = next;
        this._changed(links2);
      });
    }
    this._form.hass = this._hass;
    const formSig = JSON.stringify([this._open, !!this._dashboards, (this._users || []).length]);
    if (formSig !== this._formSig) {
      this._formSig = formSig;
      this._form.schema = this._schema();
    }
    this._form.data = { users: [], embed: true, ...links[this._open] };
    slot.append(this._form);
  }
}

if (!customElements.get("uz-links-editor")) {
  customElements.define("uz-links-editor", UzLinksEditor);
}

// Je Badge in Reihe 2 eine Aktion beim Antippen (Daten unter badge_actions.<entity_id>)
const badgeActionSchema = (badges) =>
  badges.length
    ? [{
        type: "expandable",
        name: "badge_actions",
        title: "Header Reihe 2: Aktionen beim Antippen",
        icon: "mdi:gesture-tap",
        schema: badges.map((entity) => ({ name: entity, selector: { ui_action: {} } })),
      }]
    : [];

// Je Badge in Reihe 2 ein eigener Name (Daten unter badge_names.<entity_id>, leer = Name der Entität)
const badgeNameSchema = (badges) =>
  badges.length
    ? [{
        type: "expandable",
        name: "badge_names",
        title: "Header Reihe 2: eigene Namen",
        icon: "mdi:rename-outline",
        schema: badges.map((entity) => ({ name: entity, selector: { text: {} } })),
      }]
    : [];

// Seiten des Einstellungsmenüs: Startseite mit Bereichen, jeder Bereich eine eigene Seite
const EDITOR_PAGES = {
  layout: {
    title: "Layout",
    icon: "mdi:view-grid-outline",
    color: "#3b82f6",
    group: "Aufbau",
    info: "Lege fest, welches Modul wo steht. Ziehe ein Modul in eine andere Zelle oder tippe es an und dann auf das Ziel.",
  },
  modules: {
    title: "Module & Pop-ups",
    icon: "mdi:puzzle-outline",
    color: "#8b5cf6",
    group: "Aufbau",
    info: "Tippe auf ein Modul, um Inhalt und Aussehen einzustellen. Eigene Module und Pop-ups legst du hier an.",
  },
  cameras: {
    title: "Kameras",
    icon: "mdi:cctv",
    color: "#0ea5e9",
    group: "Aufbau",
    info: "Seite mit den Live-Bildern deiner Kameras. Auswahl und Anordnung per Ziehen oder Antippen – wie beim Layout.",
  },
  batteries: {
    title: "Batterien",
    icon: "mdi:battery-heart-variant",
    color: "#22c55e",
    group: "Aufbau",
    info: "Seite mit allen Batterie-Geräten: was jetzt gewechselt werden muss, welche Batterien nötig sind (Battery Notes) und eine Kachel in „Unser Zuhause“.",
  },
  system: {
    title: "System",
    icon: "mdi:server",
    color: "#10b981",
    group: "Aufbau",
    info: "Seite mit dem Zustand deines Home-Assistant-Servers und eine farbige Kachel in „Unser Zuhause“, die sie öffnet.",
  },
  tablet: {
    title: "Tablet",
    icon: "mdi:tablet",
    color: "#6366f1",
    group: "Aufbau",
    info: "Eigene Startseite für ein Wandtablet: große Uhr, Hausmodus, Status und Kameras. Gilt für die gewählten Benutzer.",
  },
  header: {
    title: "Kopfzeile",
    icon: "mdi:page-layout-header",
    color: "#14b8a6",
    group: "Darstellung",
    info: "Ganz oben im Dashboard: Personen in der ersten Reihe, weitere Infos (Badges) in der zweiten.",
  },
  rooms: {
    title: "Räume & Etagen",
    icon: "mdi:floor-plan",
    color: "#f59e0b",
    group: "Darstellung",
    info: "Räume kommen automatisch aus deinen Bereichen. Hier legst du fest, was angezeigt wird.",
  },
  design: {
    title: "Design",
    icon: "mdi:palette-outline",
    color: "#ec4899",
    group: "Darstellung",
    info: "Farben, Hintergrundbild und ob sich Module einklappen lassen.",
  },
};

// Formulare der einfachen Seiten (Kopfzeile, Räume, Design)
const PAGE_SCHEMAS = {
  batteries: () => [
    { name: "show_batteries", selector: { boolean: {} } },
    { name: "battery_tile", selector: { boolean: {} } },
    { name: "battery_title", selector: { text: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "alert_battery", selector: { number: { min: 0, max: 50, step: 5, mode: "slider", unit_of_measurement: "%" } } },
        { name: "battery_soon", selector: { number: { min: 0, max: 80, step: 5, mode: "slider", unit_of_measurement: "%" } } },
      ],
    },
  ],
  cameras: () => [
    { name: "show_cameras", selector: { boolean: {} } },
    { name: "camera_tile", selector: { boolean: {} } },
    { name: "camera_title", selector: { text: {} } },
  ],
  tablet: (badges, users = []) => [
    { name: "tablet_users", selector: { select: { multiple: true, mode: "list", options: users.map((u) => ({ value: u.id, label: u.name })) } } },
    { name: "tablet_title", selector: { text: {} } },
    { name: "tablet_cameras", selector: { entity: { multiple: true, reorder: true, filter: { domain: "camera" } } } },
  ],
  system: () => [
    { name: "show_system", selector: { boolean: {} } },
    { name: "system_tile", selector: { boolean: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "system_title", selector: { text: {} } },
        { name: "system_icon", selector: { icon: {} } },
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Sensoren (leer = automatisch)",
      icon: "mdi:tune-variant",
      schema: [
        "system_score", "system_cpu", "system_ram", "system_disk", "system_download", "system_upload",
        "system_router_download", "system_router_upload", "system_speedtest_download", "system_speedtest_upload",
      ].map(sensor),
    },
  ],
  header: (badges = []) => [
    // reorder: Einträge per Drag & Drop sortierbar
    { name: "persons", selector: { entity: { multiple: true, reorder: true, filter: { domain: "person" } } } },
    { name: "persons_only_home", selector: { boolean: {} } },
    { name: "badges", selector: { entity: { multiple: true, reorder: true } } },
    ...badgeNameSchema(badges),
    ...badgeActionSchema(badges),
  ],
  rooms: () => [
    { name: "group_by_floors", selector: { boolean: {} } },
    { name: "hidden_floors", selector: { floor: { multiple: true } } },
    { name: "hidden_areas", selector: { area: { multiple: true } } },
    { name: "exclude_label", selector: { label: {} } },
  ],
  design: () => [
    { name: "theme", selector: { theme: {} } },
    { name: "background_image", selector: { text: {} } },
    { name: "background_opacity", selector: { number: { min: 0, max: 100, step: 5, mode: "slider" } } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "collapsible", selector: { boolean: {} } },
        { name: "collapse_on_mobile", selector: { boolean: {} } },
      ],
    },
  ],
};

// Felder je Eintrag im Bereich "Module & Pop-ups" (Karten bearbeitet der Karten-Editor darunter)
const titleIcon = (title, icon) => ({
  type: "grid",
  name: "",
  schema: [
    { name: title, selector: { text: {} } },
    { name: icon, selector: { icon: {} } },
  ],
});
const ITEM_SCHEMAS = {
  home: () => [
    titleIcon("title", "icon"),
    {
      type: "grid",
      name: "",
      schema: [
        { name: "show_clock", selector: { boolean: {} } },
        { name: "show_search", selector: { boolean: {} } },
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Begrüßung, Hinweise & Szenen",
      icon: "mdi:hand-wave-outline",
      schema: [
        {
          type: "grid",
          name: "",
          schema: [
            { name: "show_greeting", selector: { boolean: {} } },
            { name: "show_alerts", selector: { boolean: {} } },
          ],
        },
        {
          name: "weekly_review",
          selector: { select: { mode: "dropdown", options: [
            { value: "sunday", label: "Sonntags (montags bis 12 Uhr: letzte Woche)" },
            { value: "always", label: "Immer" },
            { value: "off", label: "Aus" },
          ] } },
        },
        { name: "scenes", selector: { entity: { multiple: true, reorder: true, filter: { domain: ["scene", "script", "automation", "switch", "input_boolean", "button"] } } } },
        { name: "scene_all_off", selector: { boolean: {} } },
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Läuft gerade, Personen & Kamera",
      icon: "mdi:play-circle-outline",
      schema: [
        { name: "running_devices", selector: { entity: { multiple: true, reorder: true } } },
        sensor("running_battery"),
        sensor("running_battery_power"),
        { name: "person_tiles", selector: { entity: { multiple: true, reorder: true, filter: { domain: "person" } } } },
        { name: "home_camera", selector: { entity: { domain: "camera" } } },
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Status-Kacheln",
      icon: "mdi:lightbulb-group-outline",
      schema: [
        { name: "lights_entity", selector: { entity: {} } },
        { name: "covers_entity", selector: { entity: {} } },
        { name: "windows_entity", selector: { entity: {} } },
        { name: "house_mode_entity", selector: { entity: { domain: ["select", "input_select"] } } },
        { name: "extra_tiles", selector: { entity: { multiple: true, reorder: true } } },
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Wetter",
      icon: "mdi:weather-partly-cloudy",
      schema: [
        { name: "weather_entity", selector: { entity: { domain: "weather" } } },
        { name: "weather_title", selector: { text: {} } },
        { name: "weather_badges", selector: { entity: { multiple: true, reorder: true } } },
        {
          type: "grid",
          name: "",
          schema: [
            {
              name: "weather_forecast_type",
              selector: {
                select: {
                  mode: "dropdown",
                  options: [
                    { value: "hourly", label: "Stündlich" },
                    { value: "daily", label: "Täglich" },
                    { value: "twice_daily", label: "Zweimal täglich" },
                  ],
                },
              },
            },
            { name: "weather_forecast_slots", selector: { number: { min: 1, max: 12, step: 1, mode: "box" } } },
          ],
        },
        { name: "show_clock_weather", selector: { boolean: {} } },
        sensor("clock_weather_temperature"),
        sensor("clock_weather_humidity"),
        { name: "show_horizon", selector: { boolean: {} } },
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Favoriten",
      icon: "mdi:star",
      schema: [{ name: "favorites", selector: { entity: { multiple: true, reorder: true } } }],
    },
  ],
  energy: () => [
    titleIcon("energy_title", "energy_icon"),
    {
      name: "energy_cards",
      selector: {
        select: {
          multiple: true, reorder: true, mode: "list",
          options: [{ value: "now", label: "Aktuelle Werte" }, { value: "day", label: "Energie heute" }],
        },
      },
    },
    sensor("energy_entity"),
    { name: "show_energy_page", selector: { boolean: {} } },
  ],
  evcc: () => [titleIcon("evcc_title", "evcc_icon"), { name: "show_evcc", selector: { boolean: {} } }],
  trash: () => [titleIcon("trash_title", "trash_icon"), { name: "show_trash", selector: { boolean: {} } }],
  module: () => [titleIcon("title", "icon")],
  popup: () => [
    titleIcon("name", "icon"),
    { name: "hash", selector: { text: {} } },
    { name: "entity", selector: { entity: {} } },
    { name: "entities", selector: { entity: { multiple: true, reorder: true } } },
  ],
};

const CLASS_LABELS = {
  shutter: "Rollladen", blind: "Jalousie", shade: "Rollo", curtain: "Vorhang", awning: "Markise", window: "Fenster",
  garage: "Garagentor", gate: "Tor", door: "Tür", damper: "Klappe", other: "Ohne Geräteklasse",
  garage_door: "Garagentor", opening: "Öffnung",
};
const integrationSchema = (res) => {
  const options = (list) => (list || []).map((value) => ({ value, label: CLASS_LABELS[value] || value }));
  return [
    { name: "exclude_label", selector: { label: {} } },
    { name: "exclude_entities", selector: { entity: { multiple: true, filter: { domain: ["light", "cover", "binary_sensor", "person"] } } } },
    { name: "cover_classes", selector: { select: { multiple: true, mode: "list", options: options(res.cover_classes) } } },
    { name: "opening_classes", selector: { select: { multiple: true, mode: "list", options: options(res.opening_classes) } } },
  ];
};
const INTEGRATION_LABELS = {
  exclude_label: "Ausschluss-Label (Entitäten/Geräte damit zählen nicht)",
  exclude_entities: "Diese Entitäten nicht mitzählen",
  cover_classes: "Diese Rollo-Arten zählen als offen",
  opening_classes: "Diese Kontakte zählen als Fenster oder Tür",
};

const LABELS = {
  show_cameras: "Kamera-Seite anzeigen",
  show_energy_page: "Seite „Verlauf & Bilanz“ (Autarkie, Verlauf, Geräte) mit Kachel im Modul",
  tablet_users: "Benutzer mit Tablet-Startseite (z. B. der Benutzer des Wandtablets)",
  tablet_title: "Titel",
  tablet_cameras: "Kameras auf dem Tablet (leer = die ersten Kameras, höchstens 6)",
  camera_tile: "Kachel „Kameras“ in Unser Zuhause",
  camera_title: "Titel",
  show_system: "System-Seite anzeigen",
  system_tile: "Kachel „System“ in Unser Zuhause (Farbe zeigt den Zustand)",
  system_title: "Titel",
  system_icon: "Icon",
  system_score: "Global Health Score",
  system_cpu: "Prozessor (%)",
  system_ram: "Arbeitsspeicher (%)",
  system_disk: "Speicherplatz (%)",
  system_download: "Download (Netzwerkdurchsatz)",
  system_upload: "Upload (Netzwerkdurchsatz)",
  system_router_download: "Router: Download jetzt (z. B. FRITZ!Box)",
  system_router_upload: "Router: Upload jetzt",
  system_speedtest_download: "Speedtest: Download",
  system_speedtest_upload: "Speedtest: Upload",
  title: "Titel",
  icon: "Icon",
  name: "Name",
  hash: "Adresse zum Öffnen (z. B. #uz-garten, für Badge-Aktion „Navigieren“)",
  entity: "Entität in der Kopfzeile (optional)",
  entities: "Entitäten als Kacheln (mit passenden Reglern)",
  energy_title: "Titel",
  energy_icon: "Icon",
  evcc_title: "Titel",
  evcc_icon: "Icon",
  trash_title: "Titel",
  trash_icon: "Icon",
  show_clock: "Uhr anzeigen",
  show_greeting: "Begrüßung (Hintergrund nach Tageszeit & Wetter)",
  show_alerts: "„Was ist los?“ (nur wenn etwas zu tun ist)",
  weekly_review: "Wochenrückblick in der Begrüßung (PV, Verbrauch, Autarkie)",
  alert_battery: "Batterie leer unter (gilt auch für „Was ist los?“)",
  show_batteries: "Batterie-Seite anzeigen",
  battery_tile: "Kachel „Batterien“ in Unser Zuhause",
  battery_title: "Titel",
  battery_soon: "„Bald wechseln“ unter",
  scenes: "Szenen-Leiste: Szenen, Skripte … (per Ziehen sortierbar)",
  scene_all_off: "Knopf „Alles aus“ (alle Lichter)",
  running_devices: "„Läuft gerade“: Geräte (Läuft-Sensor, Betriebszustand oder Leistung)",
  running_battery: "Akku-Füllstand (leer = aus Energie-Einstellungen)",
  running_battery_power: "Akku-Leistung mit Vorzeichen (+ entladen, − laden)",
  person_tiles: "Personen-Kacheln (leer = Personen mit Benutzerkonto)",
  home_camera: "Kamera-Vorschau auf der Startseite (wechselt bei Bewegung)",
  show_search: "Suche anzeigen",
  persons: "Header Reihe 1: Personen (leer = alle) – per Ziehen sortierbar",
  persons_only_home: "Nur anwesende Personen anzeigen",
  badges: "Header Reihe 2: weitere Badges – per Ziehen sortierbar",
  lights_entity: "Eingeschaltete Lichter (leer = Sensor der Integration)",
  covers_entity: "Offene Rollos (leer = Sensor der Integration)",
  windows_entity: "Fenster & Türen (leer = Sensor der Integration)",
  house_mode_entity: "Hausmodus (leer = Hausmodus der Integration)",
  extra_tiles: "Weitere Kacheln in Unser Zuhause",
  favorites: "Eigene Entitäten zum Steuern",
  energy_cards: "Angezeigte Karten (Reihenfolge per Ziehen)",
  energy_entity: "Täglicher Energieverbrauch (Wert in der Überschrift)",
  show_evcc: "Modul anzeigen",
  show_trash: "Modul anzeigen",
  theme: "Theme (Farben, Rundungen …)",
  background_image: "Hintergrundbild (z. B. /local/hintergrund.jpg)",
  background_opacity: "Deckkraft Hintergrundbild (%)",
  collapsible: "Module einklappbar (außer Unser Zuhause)",
  collapse_on_mobile: "Auf dem Handy anfangs eingeklappt",
  weather_entity: "Wetter-Entität (leer = kein Wetter)",
  weather_title: "Überschrift",
  weather_badges: "Badges neben der Überschrift (z. B. Außentemperatur, Wind)",
  weather_forecast_type: "Vorhersage",
  weather_forecast_slots: "Anzahl Einträge",
  show_clock_weather: "Uhr-Wetter-Karte anzeigen (clock-weather-card)",
  clock_weather_temperature: "Uhr-Wetter: Temperatursensor",
  clock_weather_humidity: "Uhr-Wetter: Luftfeuchtesensor",
  show_horizon: "Sonne und Mond anzeigen (horizon-card)",
  hidden_floors: "Ausgeblendete Etagen",
  hidden_areas: "Ausgeblendete Bereiche",
  group_by_floors: "Nach Etagen gruppieren",
  exclude_label: "Entitäten mit diesem Label ausblenden",
};

// Raster-Editor und Modul-Liste
const LAYOUT_STYLE = `
  unser-zuhause-strategy-editor { display: block; --uz-radius: 16px; }
  .uz-top { display: flex; align-items: flex-start; gap: 12px; margin: 4px 0 16px; }
  .uz-top-icon {
    width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex: none;
    background: var(--uz-c, var(--primary-color)); color: #fff;
  }
  .uz-top-icon ha-icon { --mdc-icon-size: 22px; }
  .uz-top-text { flex: 1; min-width: 0; }
  .uz-top-title { font-size: 18px; font-weight: 600; line-height: 1.3; }
  .uz-top-info { font-size: 13px; color: var(--secondary-text-color); margin-top: 2px; line-height: 1.4; }
  .uz-back {
    width: 40px; height: 40px; border-radius: 50%; border: none; background: var(--secondary-background-color);
    color: var(--primary-text-color); cursor: pointer; display: flex; align-items: center; justify-content: center; flex: none;
  }
  .uz-back:hover { filter: brightness(0.95); }
  .uz-group-label {
    font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
    color: var(--secondary-text-color); margin: 20px 4px 8px;
  }
  .uz-list {
    display: flex; flex-direction: column; border-radius: var(--uz-radius); overflow: hidden;
    background: var(--card-background-color, var(--ha-card-background)); border: 1px solid var(--divider-color);
  }
  .uz-row, .item-head {
    display: flex; align-items: center; gap: 14px; padding: 12px 14px; cursor: pointer; border: none; width: 100%;
    background: transparent; color: inherit; font: inherit; text-align: left;
  }
  .uz-row + .uz-row, .item + .item, .item + .uz-sub-label, .uz-sub-label + .item { border-top: 1px solid var(--divider-color); }
  .uz-row:hover, .item-head:hover { background: var(--secondary-background-color); }
  .uz-bubble {
    width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex: none;
    background: color-mix(in srgb, var(--uz-c, var(--primary-color)) 16%, transparent); color: var(--uz-c, var(--primary-color));
  }
  .uz-bubble ha-icon { --mdc-icon-size: 20px; }
  .uz-row-text, .item-text { flex: 1; min-width: 0; }
  .uz-row-title, .item-name { font-weight: 500; font-size: 15px; }
  .uz-row-sub, .item-type {
    font-size: 13px; color: var(--secondary-text-color); margin-top: 1px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .chev { color: var(--secondary-text-color); --mdc-icon-size: 20px; flex: none; }
  .uz-pill {
    font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 10px; flex: none;
    background: var(--secondary-background-color); color: var(--secondary-text-color);
  }
  .uz-sub-label { font-size: 12px; font-weight: 600; color: var(--secondary-text-color); padding: 10px 14px 6px; }
  .uz-footer { text-align: center; font-size: 12px; color: var(--secondary-text-color); margin: 20px 0 4px; }
  .uz-page[hidden] { display: none !important; }
  .add-buttons { display: flex; gap: 8px; flex-wrap: wrap; margin: 0 0 14px; }
  .add-module {
    display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 18px; cursor: pointer;
    border: 1px solid var(--primary-color); background: transparent; color: var(--primary-color); font-size: 14px; font-weight: 500;
  }
  .add-module ha-icon { --mdc-icon-size: 18px; }

  /* Layout */
  .layout-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
  .uz-stepper {
    display: inline-flex; align-items: center; gap: 4px; padding: 4px; border-radius: 20px;
    background: var(--secondary-background-color); font-size: 14px;
  }
  .uz-stepper .lbl { padding: 0 6px 0 8px; color: var(--secondary-text-color); }
  .uz-stepper .val { min-width: 18px; text-align: center; font-weight: 600; }
  .layout-head button {
    width: 30px; height: 30px; border-radius: 50%; border: none; cursor: pointer; font-size: 18px; line-height: 1;
    background: var(--card-background-color); color: var(--primary-text-color);
  }
  .grid { display: grid; gap: 8px; }
  .cell, .pool {
    border: 2px dashed var(--divider-color); border-radius: 12px; padding: 8px; min-height: 52px;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: border-color .15s, background .15s;
  }
  .cell.over, .pool.over, .picking .cell:hover, .picking .pool:hover {
    border-color: var(--primary-color); background: color-mix(in srgb, var(--primary-color) 8%, transparent);
  }
  .picking .cell, .picking .pool { cursor: pointer; }
  .empty { font-size: 12px; color: var(--secondary-text-color); }
  .pool { margin-top: 12px; flex-wrap: wrap; justify-content: flex-start; }
  .pool-title { font-size: 12px; color: var(--secondary-text-color); margin-right: 4px; }
  .chip {
    display: flex; align-items: center; gap: 6px; padding: 8px 10px; border-radius: 10px; cursor: grab;
    background: var(--card-background-color); box-shadow: 0 1px 3px rgba(0,0,0,.12); font-size: 13px; font-weight: 500;
    user-select: none; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .chip.picked { outline: 2px solid var(--primary-color); }
  .chip ha-icon { --mdc-icon-size: 18px; color: var(--primary-color); flex: none; }
  .hint { font-size: 12px; color: var(--secondary-text-color); margin-top: 10px; line-height: 1.4; }

  /* Seite eines Moduls */
  .item-body { display: block; }
  .uz-danger {
    margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--divider-color);
    display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  }
  .uz-danger-text { font-size: 13px; color: var(--secondary-text-color); }
  .delete {
    display: inline-flex; align-items: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: 18px; cursor: pointer;
    border: 1px solid var(--error-color, #db4437); background: transparent; color: var(--error-color, #db4437); font-size: 14px;
  }
  .delete ha-icon { --mdc-icon-size: 18px; color: inherit; }
  .delete.confirm { background: var(--error-color, #db4437); color: #fff; }
  .body-hint { font-size: 13px; color: var(--secondary-text-color); margin: 8px 0 12px; line-height: 1.4; }
  .body-hint.error { color: var(--error-color, #db4437); }
  .integration-box, .links-box { margin-top: 20px; padding: 14px; border: 1px solid var(--divider-color); border-radius: var(--uz-radius); }
  .integration-title { display: flex; align-items: center; gap: 8px; font-weight: 600; }
  .integration-title ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
  uz-cards-editor, uz-energy-flow-card-editor { display: block; margin-top: 8px; }
`;

class UnserZuhauseStrategyEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    // HA liefert laufend neue Zustände: nur beim ersten Mal alles aufbauen, danach nur weiterreichen
    if (first || !this._form) this._render();
    else this._passHass();
  }

  set lovelace(lovelace) {
    this._lovelace = lovelace;
    if (this._itemBody?.cardsEditor) this._itemBody.cardsEditor.lovelace = lovelace;
  }

  _passHass() {
    if (this._form) this._form.hass = this._hass;
    const b = this._itemBody;
    if (b) {
      if (b.form) b.form.hass = this._hass;
      if (b.cardsEditor) b.cardsEditor.hass = this._hass;
      if (b.energyEditor) b.energyEditor.hass = this._hass;
      if (b.integrationForm) b.integrationForm.hass = this._hass;
      if (b.linksEditor) b.linksEditor.hass = this._hass;
    }
  }

  _modules() {
    return Array.isArray(this._config?.custom_modules) ? this._config.custom_modules : [];
  }

  _popups() {
    return Array.isArray(this._config?.custom_popups) ? this._config.custom_popups : [];
  }

  _emit(patch) {
    this._config = { ...this._config, ...patch };
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
    this._refresh();
  }

  // Alles Sichtbare an die aktuelle Konfiguration anpassen (ohne offene Eingaben neu aufzubauen)
  _refresh() {
    this._syncForm();
    this._renderLayout();
    this._renderItems();
    this._renderHome();
    this._showPage();
  }

  _syncForm() {
    if (!this._form) return;
    const page = PAGE_SCHEMAS[this._page] ? this._page : undefined;
    if (page) {
      const badges = Array.isArray(this._config.badges) ? this._config.badges : [];
      // Schema nur bei Änderung neu setzen, sonst klappen offene Bereiche beim Tippen zu
      if (page === "tablet" && !this._usersLoading) {
        this._usersLoading = true;
        this._hass.callWS({ type: "config/auth/list" })
          .then((list) => (this._users = list.filter((u) => !u.system_generated && u.is_active !== false)))
          .catch(() => (this._users = []))
          .then(() => this._syncForm());
      }
      const schemaKey = JSON.stringify([page, badges, (this._users || []).length]);
      if (schemaKey !== this._schemaKey) {
        this._schemaKey = schemaKey;
        this._form.schema = PAGE_SCHEMAS[page](badges, this._users || []);
      }
      this._form.data = withDefaults(this._config);
    }
    this._syncItemBody();
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._page = this._page || "home";
      const style = document.createElement("style");
      style.textContent = LAYOUT_STYLE;

      this._topEl = document.createElement("div");
      this._topEl.className = "uz-top";
      this._topEl.addEventListener("click", (ev) => {
        if (ev.target.closest?.(".uz-back")) this._go(this._page.startsWith("item:") ? "modules" : "home");
      });

      this._homeEl = document.createElement("div");
      this._homeEl.className = "uz-page uz-home";
      this._homeEl.addEventListener("click", (ev) => {
        const row = ev.target.closest?.("[data-page]");
        if (row) this._go(row.dataset.page);
      });

      this._layoutEl = document.createElement("div");
      this._layoutEl.className = "uz-page layout";

      // Module & Pop-ups: Hinzufügen + Liste; ein Klick öffnet die Seite des Moduls
      this._modulesEl = document.createElement("div");
      this._modulesEl.className = "uz-page uz-modules";
      const add = document.createElement("button");
      add.className = "add-module";
      add.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>Eigenes Modul`;
      add.onclick = () => {
        const key = `modul_${Date.now().toString(36)}`;
        this._page = `item:module:${key}`;
        this._emit({ custom_modules: [...this._modules(), { key, title: "Neues Modul", icon: "mdi:puzzle", cards: [] }] });
      };
      const addPopup = document.createElement("button");
      addPopup.className = "add-module add-popup";
      addPopup.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>Pop-up`;
      addPopup.onclick = () => {
        const key = `popup_${Date.now().toString(36)}`;
        this._page = `item:popup:${key}`;
        this._emit({
          custom_popups: [
            ...this._popups(),
            { key, name: "Neues Pop-up", icon: "mdi:window-maximize", hash: `#uz-${key}`, entity: "", entities: [], cards: [] },
          ],
        });
      };
      const buttons = document.createElement("div");
      buttons.className = "add-buttons";
      buttons.append(add, addPopup);
      this._itemsEl = document.createElement("div");
      this._itemsEl.className = "uz-list items";
      this._itemsEl.addEventListener("click", (ev) => this._onItemsClick(ev));
      this._modulesEl.append(buttons, this._itemsEl);

      // Seite eines Moduls / Pop-ups (Inhalt baut _buildItemBody)
      this._itemPageEl = document.createElement("div");
      this._itemPageEl.className = "uz-page uz-item-page";

      // Kopfzeile, Räume, Design: ein Formular, Felder je nach Seite
      this._form = document.createElement("ha-form");
      this._form.className = "uz-page uz-form";
      this._cameraEditor = document.createElement("uz-camera-grid-card-editor");
      this._cameraEditor.className = "uz-page uz-camera-editor";
      this._cameraEditor.addEventListener("config-changed", (ev) => {
        ev.stopPropagation(); // Karten-, nicht Dashboard-Konfiguration
        const c = ev.detail.config;
        this._emit({
          cameras: c.cameras || [], camera_columns: c.columns, camera_live: c.live, camera_aspect: c.aspect_ratio,
          camera_motion: c.highlight_motion !== false,
        });
      });
      this._form.schema = []; // ha-form braucht immer eine Liste (Felder setzt _syncForm je Seite)
      // Aktions- und Namensfelder heißen wie die Entität: dann deren Anzeigenamen zeigen
      this._form.computeLabel = (s) =>
        LABELS[s.name] ?? this._hass?.states[s.name]?.attributes?.friendly_name ?? s.name;
      this._form.addEventListener("value-changed", (ev) => this._emit(ev.detail.value));

      this.append(style, this._topEl, this._homeEl, this._layoutEl, this._modulesEl, this._itemPageEl, this._form);
    }
    this._form.hass = this._hass;
    this._refresh();
  }

  // ---------- Navigation ----------

  _go(page) {
    this._page = page;
    this._pick = undefined;
    this._refresh();
    this._topEl?.scrollIntoView?.({ block: "nearest" });
  }

  _showPage() {
    if (!this._topEl) return;
    const page = this._page || "home";
    const isItem = page.startsWith("item:");
    const itemId = isItem ? page.slice(5) : undefined;
    const row = isItem ? this._itemRows().find((r) => `${r.kind}:${r.key}` === itemId) : undefined;
    if (isItem && !row) {
      // Eintrag gelöscht oder unbekannt: zurück zur Liste
      this._page = "modules";
      return this._showPage();
    }
    this._homeEl.hidden = page !== "home";
    this._layoutEl.hidden = page !== "layout";
    this._modulesEl.hidden = page !== "modules";
    this._itemPageEl.hidden = !isItem;
    this._form.hidden = !PAGE_SCHEMAS[page];
    if (this._cameraEditor) {
      this._cameraEditor.hidden = page !== "cameras";
      if (page === "cameras") {
        if (!this._cameraEditor.isConnected) this.append(this._cameraEditor);
        const cfg = withDefaults(this._config);
        this._cameraEditor.hass = this._hass;
        this._cameraEditor.setConfig?.({
          cameras: cfg.cameras || [],
          columns: cfg.camera_columns,
          live: cfg.camera_live,
          aspect_ratio: cfg.camera_aspect,
          highlight_motion: cfg.camera_motion,
        });
      }
    }

    if (isItem) {
      if (!this._itemBody || this._itemBody.id !== itemId) {
        this._buildItemBody(itemId);
        this._itemPageEl.replaceChildren(this._itemBody.el);
        this._syncItemBody();
      }
      this._syncDelete();
    } else if (this._itemBody) {
      this._itemBody = undefined;
      this._itemPageEl.replaceChildren();
    }

    const meta = isItem
      ? { title: row.name, info: row.type, icon: row.icon, color: EDITOR_PAGES.modules.color }
      : page === "home"
        ? { title: "Einstellungen", info: "Tippe auf einen Bereich, um ihn anzupassen.", icon: withDefaults(this._config).icon || "mdi:home-heart" }
        : EDITOR_PAGES[page];
    const signature = JSON.stringify([page, meta]);
    if (signature === this._topSignature) return;
    this._topSignature = signature;
    this._topEl.innerHTML = `
      ${page === "home" ? "" : `<button class="uz-back" title="Zurück"><ha-icon icon="mdi:arrow-left"></ha-icon></button>`}
      <div class="uz-top-icon" style="--uz-c:${esc(meta.color || "var(--primary-color)")}"><ha-icon icon="${esc(meta.icon)}"></ha-icon></div>
      <div class="uz-top-text">
        <div class="uz-top-title">${esc(meta.title)}</div>
        <div class="uz-top-info">${esc(meta.info)}</div>
      </div>`;
  }

  // Kurzinfo je Bereich auf der Startseite
  _summary(page) {
    const cfg = withDefaults(this._config);
    if (page === "layout") {
      const catalog = moduleCatalog(this._hass, cfg);
      const { rows, hidden } = normalizeGrid(cfg, catalog.map((m) => m.key));
      return [`${rows[0]?.length || 1} Spalten`, `${rows.length} Zeilen`, hidden.length ? `${hidden.length} ausgeblendet` : ""]
        .filter(Boolean).join(" · ");
    }
    if (page === "modules") {
      const names = this._itemRows().filter((r) => r.kind !== "popup").map((r) => r.name);
      const popups = this._popups().length;
      return [names.slice(0, 3).join(", ") + (names.length > 3 ? ` +${names.length - 3}` : ""), popups ? `${popups} ${popups === 1 ? "Pop-up" : "Pop-ups"}` : ""]
        .filter(Boolean).join(" · ");
    }
    if (page === "header") {
      const persons = (cfg.persons || []).length;
      const badges = (cfg.badges || []).length;
      return [persons ? `${persons} ${persons === 1 ? "Person" : "Personen"}` : "Alle Personen", `${badges} ${badges === 1 ? "Badge" : "Badges"}`].join(" · ");
    }
    if (page === "rooms") {
      const floors = (cfg.hidden_floors || []).length;
      const areas = (cfg.hidden_areas || []).length;
      return [
        cfg.group_by_floors ? "Nach Etagen" : "Alle Räume zusammen",
        floors ? `${floors} ${floors === 1 ? "Etage" : "Etagen"} ausgeblendet` : "",
        areas ? `${areas} ${areas === 1 ? "Raum" : "Räume"} ausgeblendet` : "",
      ].filter(Boolean).join(" · ");
    }
    if (page === "batteries") {
      if (!cfg.show_batteries) return "Aus";
      return ["Seite an", cfg.battery_tile ? "Kachel in Unser Zuhause" : "", `leer unter ${Number(cfg.alert_battery ?? 15)} %`].filter(Boolean).join(" · ");
    }
    if (page === "cameras") {
      if (!cfg.show_cameras) return "Aus";
      const n = this._hass ? cameraList(this._hass, cfg).length : 0;
      const chosen = (cfg.cameras || []).length;
      return [`${n} ${n === 1 ? "Kamera" : "Kameras"}`, chosen ? "eigene Auswahl" : "alle", `${cfg.camera_columns} Spalten`].join(" · ");
    }
    if (page === "system") {
      if (!cfg.show_system) return "Aus";
      const score = this._hass?.states?.[systemEntities(this._hass, cfg).score]?.state;
      return ["Seite an", cfg.system_tile ? "Kachel in Unser Zuhause" : "", score && !isNaN(parseFloat(score)) ? `Score ${Math.round(parseFloat(score))}` : ""]
        .filter(Boolean).join(" · ");
    }
    if (page === "tablet") {
      const n = (cfg.tablet_users || []).length;
      return n ? `${n} ${n === 1 ? "Benutzer" : "Benutzer"} · Adresse …/${TABLET_PATH}` : "Aus";
    }
    if (page === "design") {
      return [cfg.theme || "Standard-Theme", cfg.collapsible ? "Module einklappbar" : ""].filter(Boolean).join(" · ");
    }
    return "";
  }

  _renderHome() {
    if (!this._homeEl) return;
    const groups = {};
    Object.entries(EDITOR_PAGES).forEach(([id, p]) => (groups[p.group] ||= []).push({ id, ...p, sub: this._summary(id) }));
    const signature = JSON.stringify(groups);
    if (signature === this._homeSignature) return;
    this._homeSignature = signature;
    this._homeEl.innerHTML = `
      ${Object.entries(groups)
        .map(([group, pages]) => `
          <div class="uz-group-label">${esc(group)}</div>
          <div class="uz-list">
            ${pages
              .map((p) => `
                <button class="uz-row" data-page="${p.id}" style="--uz-c:${p.color}">
                  <span class="uz-bubble"><ha-icon icon="${p.icon}"></ha-icon></span>
                  <span class="uz-row-text">
                    <span class="uz-row-title" style="display:block">${esc(p.title)}</span>
                    <span class="uz-row-sub" style="display:block">${esc(p.sub)}</span>
                  </span>
                  <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
                </button>`)
              .join("")}
          </div>`)
        .join("")}
      <div class="uz-footer">Unser Zuhause · v${UZ_VERSION}</div>`;
  }

  // ---------- Module & Pop-ups ----------

  _itemRows() {
    const cfg = withDefaults(this._config);
    return [
      { kind: "home", key: "home", icon: cfg.icon, name: cfg.title, type: "Uhr, Hausmodus, Status, Wetter, Favoriten" },
      { kind: "energy", key: "energy", icon: cfg.energy_icon, name: cfg.energy_title, type: "Energiefluss aktuell und heute" },
      { kind: "evcc", key: "evcc", icon: cfg.evcc_icon, name: cfg.evcc_title, type: "Karten der Wallbox (EVCC)" },
      { kind: "trash", key: "trash", icon: cfg.trash_icon, name: cfg.trash_title, type: "Abholtermine aus dem Kalender" },
      ...this._modules().map((m) => ({
        kind: "module", key: m.key, icon: m.icon || "mdi:puzzle", name: m.title || m.key,
        type: `Eigenes Modul · ${(m.cards || []).length} Karten`,
      })),
      ...this._popups().map((p) => ({
        kind: "popup", key: p.key, icon: p.icon || "mdi:window-maximize", name: p.name || p.key,
        type: `Pop-up · öffnet mit ${customPopupHash(p)}`,
      })),
    ];
  }

  _renderItems() {
    if (!this._itemsEl) return;
    const rows = this._itemRows();
    const cfg = withDefaults(this._config);
    const { hidden } = normalizeGrid(cfg, moduleCatalog(this._hass, cfg).map((m) => m.key));
    const isHidden = (r) => hidden.includes(r.kind === "module" ? `custom:${r.key}` : r.key);
    // Nur neu aufbauen, wenn sich etwas geändert hat (stabile Elemente, kein verlorener Klick)
    const signature = JSON.stringify([rows, hidden]);
    if (signature === this._itemsSignature) return;
    this._itemsSignature = signature;
    const row = (r) => `
      <div class="item" data-id="${esc(`${r.kind}:${r.key}`)}">
        <button class="item-head" data-open="${esc(`${r.kind}:${r.key}`)}" style="--uz-c:${EDITOR_PAGES.modules.color}">
          <span class="uz-bubble"><ha-icon icon="${esc(r.icon)}"></ha-icon></span>
          <span class="item-text">
            <span class="item-name" style="display:block">${esc(r.name)}</span>
            <span class="item-type" style="display:block">${esc(r.type)}</span>
          </span>
          ${r.kind !== "popup" && isHidden(r) ? `<span class="uz-pill">ausgeblendet</span>` : ""}
          <ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>`;
    const modules = rows.filter((r) => r.kind !== "popup");
    const popups = rows.filter((r) => r.kind === "popup");
    this._itemsEl.innerHTML = `
      ${modules.map(row).join("")}
      ${popups.length ? `<div class="uz-sub-label">Pop-ups</div>${popups.map(row).join("")}` : ""}`;
  }

  _onItemsClick(ev) {
    const head = ev.target.closest?.("[data-open]");
    if (head) this._go(`item:${head.dataset.open}`);
  }

  // Löschen am Ende der Seite eines eigenen Moduls / Pop-ups
  _syncDelete() {
    const b = this._itemBody;
    if (!b || (b.kind !== "module" && b.kind !== "popup")) return;
    if (!b.deleteBtn) {
      const zone = document.createElement("div");
      zone.className = "uz-danger";
      zone.innerHTML = `<span class="uz-danger-text">${b.kind === "module" ? "Modul" : "Pop-up"} mit allen Karten entfernen</span>`;
      const btn = document.createElement("button");
      btn.className = "delete";
      btn.dataset.kind = b.kind;
      btn.dataset.key = b.key;
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._onDelete(btn);
      });
      zone.append(btn);
      b.el.append(zone);
      b.deleteBtn = btn;
    }
    const ask = this._pendingDelete === b.id;
    b.deleteBtn.classList.toggle("confirm", ask);
    const label = ask ? "Wirklich löschen?" : "Löschen";
    if (b.deleteBtn.dataset.label !== label) {
      b.deleteBtn.dataset.label = label;
      b.deleteBtn.innerHTML = `<ha-icon icon="mdi:delete-outline"></ha-icon><span>${label}</span>`;
    }
  }

  // Erster Klick: nachfragen (10 s), zweiter Klick: löschen
  _onDelete(btn) {
    const { kind, key } = btn.dataset;
    const id = `${kind}:${key}`;
    clearTimeout(this._pendingTimer);
    if (this._pendingDelete !== id) {
      this._pendingDelete = id;
      this._pendingTimer = setTimeout(() => {
        this._pendingDelete = undefined;
        this._syncDelete();
      }, 10000);
      this._syncDelete();
      return;
    }
    this._pendingDelete = undefined;
    this._page = "modules";
    if (kind === "module") {
      const moduleKey = `custom:${key}`;
      this._emit({
        custom_modules: this._modules().filter((m) => m.key !== key),
        // Zelle im Raster freigeben
        grid: (this._config.grid || []).map((row) => (row || []).map((k) => (k === moduleKey ? "" : k))),
        hidden_modules: (withDefaults(this._config).hidden_modules || []).filter((k) => k !== moduleKey),
      });
    } else {
      this._emit({ custom_popups: this._popups().filter((p) => p.key !== key) });
    }
  }

  // Einstellungen eines Eintrags: Formular (Titel, Icon …) + Karten-Editor
  _buildItemBody(id) {
    const [kind, key] = id.split(/:(.*)/s);
    const el = document.createElement("div");
    el.className = "item-body";
    const body = { id, kind, key, el };

    const form = document.createElement("ha-form");
    form.computeLabel = (s) => LABELS[s.name] ?? s.name;
    form.schema = ITEM_SCHEMAS[kind]();
    form.hass = this._hass;
    form.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      this._itemChanged(body, ev.detail.value);
    });
    el.append(form);
    body.form = form;

    if (kind === "home") {
      const hint = document.createElement("div");
      hint.className = "body-hint";
      hint.textContent = hasIntegration(this._hass)
        ? "Lichter, Rollos und Fenster & Türen kommen aus der Integration „Unser Zuhause“, solange die Felder leer sind. Welche Geräte mitzählen, stellst du ganz unten unter „Sensoren der Integration“ ein."
        : "Die Integration „Unser Zuhause“ ist nicht installiert. Ohne sie fehlen die Status-Kacheln, solange du hier keine eigenen Sensoren wählst. Installation: HACS → Integrationen → „Unser Zuhause“.";
      el.insertBefore(hint, form);
      // Weitere Dashboards als Kacheln (z. B. Heizung), je Benutzer sichtbar
      const linksBox = document.createElement("div");
      linksBox.className = "links-box";
      linksBox.innerHTML = '<div class="integration-title"><ha-icon icon="mdi:view-dashboard-variant-outline"></ha-icon>Dashboards verknüpfen</div>' +
        '<div class="body-hint">Jede Verknüpfung erscheint als Kachel unter „Kameras“ und öffnet das Dashboard. Mit „Sichtbar für“ zeigst du sie nur bestimmten Benutzern.</div>';
      const linksEditor = document.createElement("uz-links-editor");
      linksEditor.hass = this._hass;
      linksEditor.addEventListener("links-changed", (ev) => {
        ev.stopPropagation();
        this._emit({ home_links: ev.detail.links });
      });
      linksBox.append(linksEditor);
      body.el.append(linksBox);
      body.linksEditor = linksEditor;
      this._buildIntegrationSettings(body);
    } else if (kind === "energy") {
      // Eigener Editor der Energiekarten (wie auf jedem Dashboard)
      const energyEditor = document.createElement("uz-energy-flow-card-editor");
      energyEditor.addEventListener("config-changed", (ev) => {
        ev.stopPropagation(); // Karten-, nicht Strategy-Konfiguration
        const { type, ...card } = ev.detail.config;
        this._emit({ energy_card: card });
      });
      energyEditor.hass = this._hass;
      el.append(energyEditor);
      body.energyEditor = energyEditor;
    } else {
      const hint = document.createElement("div");
      hint.className = "body-hint";
      hint.textContent = kind === "evcc"
        ? "„Karte hinzufügen“ öffnet die Kartenauswahl wie auf einem normalen Dashboard. Antippen einer EVCC-Karte öffnet den Editor des Entwicklers."
        : kind === "trash"
          ? "„Karte hinzufügen“ öffnet die Kartenauswahl wie auf einem normalen Dashboard. Antippen der Müll-Karte öffnet den Editor des Entwicklers."
          : "„Karte hinzufügen“ öffnet die Kartenauswahl wie auf einem normalen Dashboard. Antippen einer Karte öffnet ihren Editor.";
      const cardsEditor = document.createElement("uz-cards-editor");
      cardsEditor.hass = this._hass;
      cardsEditor.lovelace = this._lovelace;
      cardsEditor.addEventListener("cards-changed", (ev) => {
        ev.stopPropagation();
        this._cardsChanged(body, ev.detail.cards);
      });
      el.append(hint, cardsEditor);
      body.cardsEditor = cardsEditor;
    }
    this._itemBody = body;
  }

  // Einstellungen der Integration (gespeichert in der Integration, nicht im Dashboard)
  _buildIntegrationSettings(body) {
    const box = document.createElement("div");
    box.className = "integration-box";
    box.hidden = true;
    box.innerHTML = `<div class="integration-title"><ha-icon icon="mdi:puzzle-check-outline"></ha-icon>Sensoren der Integration</div>
      <div class="body-hint">Änderungen hier werden sofort in der Integration gespeichert.</div>`;
    const form = document.createElement("ha-form");
    const error = document.createElement("div");
    error.className = "body-hint error";
    form.hass = this._hass;
    form.computeLabel = (s) => INTEGRATION_LABELS[s.name] ?? s.name;
    form.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      const value = ev.detail.value;
      form.data = value;
      error.textContent = "";
      Promise.resolve(
        this._hass?.callWS({
          type: "unser_zuhause/set_options",
          exclude_label: value.exclude_label || "",
          exclude_entities: value.exclude_entities || [],
          cover_classes: value.cover_classes || [],
          opening_classes: value.opening_classes || [],
        }),
      ).catch((err) => {
        error.textContent = `Speichern fehlgeschlagen: ${err?.message || err}`;
      });
    });
    form.schema = []; // erst nach dem Laden befüllen (ha-form braucht immer eine Liste)
    box.append(form, error);
    body.el.append(box);
    body.integrationForm = form;
    Promise.resolve(this._hass?.callWS({ type: "unser_zuhause/get_options" }))
      .then((res) => {
        if (!res?.options) return;
        form.schema = integrationSchema(res);
        form.data = res.options;
        if (res.house_modes_file) {
          const modes = document.createElement("div");
          modes.className = "body-hint";
          modes.textContent = `Hausmodus: Die Modi stehen in ${res.house_modes_file} (ein Modus pro Zeile, wird automatisch übernommen).`;
          box.insertBefore(modes, form);
        }
        box.hidden = false;
      })
      .catch(() => {}); // Integration nicht installiert: der Hinweis oben genügt
  }

  _syncItemBody() {
    const b = this._itemBody;
    if (!b) return;
    const cfg = withDefaults(this._config);
    const popup = b.kind === "popup" ? this._popups().find((p) => p.key === b.key) : undefined;
    const mod = b.kind === "module" ? this._modules().find((m) => m.key === b.key) : undefined;
    if (b.kind === "popup" && popup) {
      b.form.data = { name: popup.name || "", icon: popup.icon || "", hash: customPopupHash(popup), entity: popup.entity || "", entities: popup.entities || [] };
    } else if (b.kind === "module" && mod) {
      b.form.data = { title: mod.title || "", icon: mod.icon || "" };
    } else {
      b.form.data = cfg;
    }
    if (b.energyEditor) b.energyEditor.setConfig(energyCardConfig(cfg));
    if (b.linksEditor) b.linksEditor.links = cfg.home_links;
    if (b.cardsEditor) {
      b.cardsEditor.cards =
        b.kind === "evcc" ? evccCardsConfig(cfg)
        : b.kind === "trash" ? trashCardsConfig(cfg)
        : (popup || mod)?.cards || [];
    }
  }

  _itemChanged(body, value) {
    if (body.kind === "module") {
      this._emit({ custom_modules: this._modules().map((m) => (m.key === body.key ? { ...m, title: value.title, icon: value.icon } : m)) });
    } else if (body.kind === "popup") {
      this._emit({
        custom_popups: this._popups().map((p) =>
          p.key === body.key
            ? { ...p, name: value.name, icon: value.icon, hash: value.hash, entity: value.entity || "", entities: value.entities || [] }
            : p
        ),
      });
    } else {
      const flat = (list) => list.flatMap((x) => (x.schema && !x.name ? flat(x.schema) : [x]));
      const fields = flat(ITEM_SCHEMAS[body.kind]()).map((x) => x.name);
      this._emit(Object.fromEntries(fields.map((f) => [f, value[f]])));
    }
  }

  _cardsChanged(body, cards) {
    if (body.kind === "evcc") this._emit({ evcc_cards: cards });
    else if (body.kind === "trash") this._emit({ trash_cards: cards });
    else if (body.kind === "module") {
      this._emit({ custom_modules: this._modules().map((m) => (m.key === body.key ? { ...m, cards } : m)) });
    } else if (body.kind === "popup") {
      this._emit({ custom_popups: this._popups().map((p) => (p.key === body.key ? { ...p, cards } : p)) });
    }
  }

  // ---------- Raster-Editor ----------

  _renderLayout() {
    if (!this._layoutEl || !this._hass) return;
    const cfg = withDefaults(this._config);
    const catalog = moduleCatalog(this._hass, cfg);
    const byKey = Object.fromEntries(catalog.map((m) => [m.key, m]));
    const { rows, hidden } = normalizeGrid(cfg, catalog.map((m) => m.key));
    const cols = rows[0]?.length || 1;
    const chip = (k, from) =>
      byKey[k]
        ? `<div class="chip" draggable="true" data-key="${esc(k)}" data-from="${from}"><ha-icon icon="${esc(byKey[k].icon)}"></ha-icon>${esc(byKey[k].name)}</div>`
        : "";
    // Nur bei echten Änderungen neu aufbauen (sonst bricht ein laufendes Ziehen ab)
    const signature = JSON.stringify([rows, hidden, catalog]);
    if (signature === this._layoutSignature) return;
    this._layoutSignature = signature;
    this._layoutEl.innerHTML = `
      <div class="layout-head">
        <span class="uz-stepper"><span class="lbl">Spalten</span>
          <button data-act="col-" title="Spalte entfernen">−</button><span class="val">${cols}</span><button data-act="col+" title="Spalte hinzufügen">+</button></span>
        <span class="uz-stepper"><span class="lbl">Zeilen</span>
          <button data-act="row-" title="Zeile entfernen">−</button><span class="val">${rows.length}</span><button data-act="row+" title="Zeile hinzufügen">+</button></span>
      </div>
      <div class="grid" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr))">
        ${rows
          .map((row, r) =>
            row
              .map((k, c) => `<div class="cell" data-cell="${r},${c}">${k ? chip(k, `${r},${c}`) : '<span class="empty">leer</span>'}</div>`)
              .join("")
          )
          .join("")}
      </div>
      <div class="pool" data-cell="pool"><span class="pool-title">Ausgeblendet</span>${hidden.map((k) => chip(k, "pool")).join("")}</div>
      <div class="hint">Leere Zellen sind Platzhalter. Jede Zeile ist so hoch wie ihr höchstes Modul.
        Auf dem Handy stehen die Zellen zeilenweise untereinander. Ein Modul unter „Ausgeblendet“ erscheint nicht im Dashboard.</div>`;

    const commit = (newRows, newHidden) => this._emit({ grid: newRows, hidden_modules: newHidden });
    const copy = () => rows.map((r) => [...r]);
    // Module aus entfernten Zellen wandern in freie Zellen, sonst in "Ausgeblendet"
    const rehome = (grid, keys, hid) => {
      keys.filter(Boolean).forEach((k) => {
        const free = grid.find((r) => r.includes(""));
        if (free) free[free.indexOf("")] = k;
        else hid.push(k);
      });
    };
    const actions = {
      "col+": () => commit(copy().map((r) => [...r, ""]), hidden),
      "col-": () => {
        if (cols < 2) return;
        const grid = copy();
        const removed = grid.map((r) => r.pop());
        const hid = [...hidden];
        rehome(grid, removed, hid);
        commit(grid, hid);
      },
      "row+": () => commit([...copy(), Array(cols).fill("")], hidden),
      "row-": () => {
        if (rows.length < 2) return;
        const grid = copy();
        const removed = grid.pop();
        const hid = [...hidden];
        rehome(grid, removed, hid);
        commit(grid, hid);
      },
    };
    this._layoutEl.querySelectorAll("[data-act]").forEach((b) => (b.onclick = actions[b.dataset.act]));

    const move = (key, from, target) => {
      const grid = copy();
      let hid = hidden.filter((k) => k !== key);
      const at = (pos) => pos.split(",").map(Number);
      // Quelle leeren
      if (from !== "pool") {
        const [r, c] = at(from);
        grid[r][c] = "";
      }
      if (target === "pool") {
        hid.push(key);
      } else {
        const [r, c] = at(target);
        const occupant = grid[r][c];
        grid[r][c] = key;
        // Belegte Zielzelle: Module tauschen (aus "Ausgeblendet" kommend → Verdrängtes ausblenden)
        if (occupant) {
          if (from !== "pool") {
            const [fr, fc] = at(from);
            grid[fr][fc] = occupant;
          } else {
            hid = [...hid, occupant];
          }
        }
      }
      this._pick = undefined;
      commit(grid, hid);
    };

    this._layoutEl.querySelectorAll(".chip").forEach((el) => {
      el.addEventListener("dragstart", (ev) => ev.dataTransfer.setData("text/plain", `${el.dataset.key}|${el.dataset.from}`));
    });
    // Antippen (Handy): Modul wählen, dann Ziel antippen
    const setPick = (pick) => {
      this._pick = pick;
      this._layoutEl.classList.toggle("picking", !!pick);
      this._layoutEl.querySelectorAll(".chip").forEach((c) =>
        c.classList.toggle("picked", !!pick && c.dataset.key === pick.key));
    };
    this._layoutEl.onclick = (ev) => {
      const chip = ev.target.closest?.(".chip");
      const zone = ev.target.closest?.(".cell, .pool");
      if (chip && (!this._pick || this._pick.key === chip.dataset.key)) {
        setPick(this._pick ? undefined : { key: chip.dataset.key, from: chip.dataset.from });
        return;
      }
      if (this._pick && zone && zone.dataset.cell !== this._pick.from) move(this._pick.key, this._pick.from, zone.dataset.cell);
    };
    setPick(this._pick && byKey[this._pick.key] ? this._pick : undefined);
    this._layoutEl.querySelectorAll(".cell, .pool").forEach((zone) => {
      zone.addEventListener("dragover", (ev) => {
        ev.preventDefault();
        zone.classList.add("over");
      });
      zone.addEventListener("dragleave", () => zone.classList.remove("over"));
      zone.addEventListener("drop", (ev) => {
        ev.preventDefault();
        const [key, from] = ev.dataTransfer.getData("text/plain").split("|");
        if (!key) return;
        move(key, from, zone.dataset.cell);
      });
    });
  }
}

// Doppelt geladen (z. B. HACS + alte Resource)? Dann nicht erneut registrieren.
if (!customElements.get("unser-zuhause-strategy-editor")) {
  customElements.define("unser-zuhause-strategy-editor", UnserZuhauseStrategyEditor);
}
if (!customElements.get("ll-strategy-dashboard-unser-zuhause")) {
  customElements.define("ll-strategy-dashboard-unser-zuhause", UnserZuhauseStrategy);
  console.info(`%c UNSER-ZUHAUSE %c v${UZ_VERSION} `, "background:#03a9f4;color:#fff", "");
}
