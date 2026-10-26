// Lokale Tests der Strategy ohne Home Assistant: simuliertes DOM (happy-dom) + nachgebautes hass.
// Aufruf: npm test
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { Window } from "happy-dom";

const win = new Window({ url: "http://localhost/" });
Object.assign(globalThis, {
  window: win,
  document: win.document,
  HTMLElement: win.HTMLElement,
  customElements: win.customElements,
  CustomEvent: win.CustomEvent,
  Event: win.Event,
  localStorage: win.localStorage,
});
// HA-Helfer zum Erzeugen von Unterkarten (hier: Platzhalter-Elemente mit der Konfiguration)
win.loadCardHelpers = async () => ({
  createCardElement: (config) => {
    const el = document.createElement("div");
    el.config = config;
    return el;
  },
});

// Wie in HA: Karten-Paket und Strategy als getrennte Module (eigener Gültigkeitsbereich je Datei)
const load = (url, name) =>
  vm.runInThisContext(`(() => {\n${readFileSync(fileURLToPath(new URL(url, import.meta.url)), "utf8")}\n})();`, { filename: name });
load("../../ha-unser-zuhause-cards/dist/unser-zuhause-cards.js", "unser-zuhause-cards.js");
load("../dist/unser-zuhause-strategy.js", "unser-zuhause-strategy.js");

// ---------- Testgerüst ----------
let failed = 0;
const check = (name, ok, info = "") => {
  if (!ok) failed++;
  console.log(`${ok ? "✔" : "✘"} ${name}${!ok && info ? `  → ${info}` : ""}`);
};
const tick = () => new Promise((r) => setTimeout(r, 0));
const flatCards = (cards) => cards.flatMap((c) => [c, ...flatCards(c.cards || [])]);

// ---------- Nachgebautes hass (Struktur wie die echte Installation) ----------
const st = (entity_id, state, attributes = {}) => ({ entity_id, state, attributes, last_updated: "t0" });
const states = {};
const add = (s) => (states[s.entity_id] = s);
[
  st("person.sebastian", "home"), st("person.christina", "not_home"), st("person.astrid", "home"),
  st("sensor.anwesende_personen", "2"), st("input_boolean.sebastian_anwesenheit_dumy", "off"),
  st("device_tracker.hamm", "home"), st("sensor.angeschaltete_lichter", "1"), st("sensor.offene_rollos", "12"),
  st("binary_sensor.fenster_und_turen", "off"), st("input_select.anwesenheit", "Zuhause"),
  st("calendar.awido_online", "off"), st("sensor.daily_consumed_energy", "26.7", { unit_of_measurement: "kWh" }),
  st("sensor.electricity_maps_anteil_fossiler_brennstoffe_im_netz", "61.78", { unit_of_measurement: "%" }),
  st("light.wz", "on", { friendly_name: "Wohnzimmer Licht" }),
  st("light.versteckt", "on"),
  st("sensor.wz_temp", "21.5", { device_class: "temperature", unit_of_measurement: "°C" }),
  st("cover.wz", "open", { device_class: "shutter" }),
  st("binary_sensor.wz_fenster", "off", { device_class: "window" }),
  st("switch.wz_diagnose", "on"),
  st("light.bad", "off"), st("light.speicher", "off"),
  // Energie (Zähler in kWh, Leistung in W)
  st("sensor.strom_one_8855996755_1_8_0", "1000", { unit_of_measurement: "kWh" }),
  st("sensor.strom_one_8855996755_2_8_0", "500", { unit_of_measurement: "kWh" }),
  st("sensor.daily_pv_generation", "24.5", { unit_of_measurement: "kWh" }),
  st("sensor.daily_battery_discharge", "7.1", { unit_of_measurement: "kWh" }),
  st("sensor.daily_battery_charge", "9.6", { unit_of_measurement: "kWh" }),
  st("sensor.wasser_8342459685_wasserverbrauch_insgesamt", "155.3", { unit_of_measurement: "m³" }),
  st("sensor.wasser_8342459685_wasserdurchfluss", "0", { unit_of_measurement: "L/min" }),
  st("sensor.garage_gesamtenergie", "100", { unit_of_measurement: "kWh" }),
  st("sensor.shellypro3em_841fe8917860_energy", "100", { unit_of_measurement: "kWh" }),
  st("sensor.import_power", "0", { unit_of_measurement: "W" }),
  st("sensor.export_power", "1200", { unit_of_measurement: "W" }),
  st("sensor.total_dc_power", "3.5", { unit_of_measurement: "kW" }),
  st("sensor.battery_charging_power", "800", { unit_of_measurement: "W" }),
  st("sensor.battery_discharging_power", "0", { unit_of_measurement: "W" }),
  st("sensor.battery_level", "55", { unit_of_measurement: "%" }),
  st("sensor.evcc_hamm_charge_power", "0", { unit_of_measurement: "W" }),
  st("sensor.shellypro3em_841fe8917860_power", "450", { unit_of_measurement: "W" }),
  // Leistung mit Vorzeichen aus dem Energie-Dashboard: Einspeisung 1,2 kW, Akku lädt 800 W
  st("sensor.grid_net_power", "-1200", { unit_of_measurement: "W" }),
  st("sensor.battery_net_power", "-0.8", { unit_of_measurement: "kW" }),
  // Sensoren der Integration „Unser Zuhause“
  st("sensor.unser_zuhause_lichter_an", "3"), st("sensor.unser_zuhause_offene_rollos", "2"),
  st("binary_sensor.unser_zuhause_fenster_turen", "on", { device_class: "opening" }),
  st("select.unser_zuhause_hausmodus", "anwesend", { options: ["anwesend", "abwesend"] }),
  // System
  st("sensor.system_ha_global_health_score", "82", { unit_of_measurement: "%", hardware_score: 93, application_score: 75 }),
  st("sensor.processor_use", "42", { unit_of_measurement: "%" }),
  st("sensor.memory_use_percent", "80.1", { unit_of_measurement: "%" }),
  st("sensor.disk_use_percent_config", "49.5", { unit_of_measurement: "%" }),
  st("sensor.system_monitor_eingehender_netzwerkdurchsatz_enp6s18", "0.2", { unit_of_measurement: "MB/s" }),
  st("sensor.system_monitor_ausgehender_netzwerkdurchsatz_enp6s18", "0.1", { unit_of_measurement: "MB/s" }),
  st("sensor.system_monitor_network_throughput_in_hassio", "0", { unit_of_measurement: "MB/s" }),
  st("sensor.last_boot", "2026-09-28T13:18:23+00:00", { device_class: "timestamp" }),
  st("sensor.backup_letztes_erfolgreiches_automatisches_backup", "2026-10-15T02:59:04+00:00", { device_class: "timestamp" }),
  st("update.home_assistant_core_update", "off", { title: "Home Assistant Core" }),
  st("sensor.speedtest_download", "12.65", { unit_of_measurement: "Mbit/s" }),
  st("sensor.speedtest_upload", "13.17", { unit_of_measurement: "Mbit/s" }),
  st("sensor.speedtest_ping", "99", { unit_of_measurement: "ms" }),
].forEach(add);

const integrationOptions = { exclude_label: "no_dboard", exclude_entities: [], cover_classes: ["shutter"], opening_classes: ["window", "door"] };
const integrationCalls = [];
const systemFixture = {
  repairs: [{ domain: "spook", issue_id: "lovelace_unknown", severity: "warning", ignored: false }],
  log: [{ level: "ERROR", name: "x", message: ["a"] }, { level: "WARNING", name: "y", message: ["b"] }],
};
const ent = (entity_id, area_id, extra = {}) => ({ entity_id, area_id, device_id: null, labels: [], ...extra });
const hass = {
  states,
  locale: { language: "de" },
  formatEntityState: (s) => s.state,
  floors: {
    eg: { floor_id: "eg", name: "EG", level: 0 },
    og: { floor_id: "og", name: "OG", level: 1 },
    speicher: { floor_id: "speicher", name: "Speicher", level: 2 },
    temp: { floor_id: "temp", name: "Temp", level: 50 },
  },
  areas: {
    wohnzimmer: { area_id: "wohnzimmer", name: "Wohnzimmer", floor_id: "eg", icon: "mdi:sofa" },
    kuche: { area_id: "kuche", name: "Küche", floor_id: "eg" },
    bad: { area_id: "bad", name: "Bad", floor_id: "og" },
    speicher: { area_id: "speicher", name: "Speicher", floor_id: "speicher" },
    buro: { area_id: "buro", name: "Büro", floor_id: "temp" },
    haderschen: { area_id: "haderschen", name: "Haderschen", floor_id: null },
  },
  devices: {},
  entities: {
    "light.wz": ent("light.wz", "wohnzimmer"),
    "light.versteckt": ent("light.versteckt", "wohnzimmer", { labels: ["no_dboard"] }),
    "sensor.wz_temp": ent("sensor.wz_temp", "wohnzimmer"),
    "cover.wz": ent("cover.wz", "wohnzimmer"),
    "binary_sensor.wz_fenster": ent("binary_sensor.wz_fenster", "wohnzimmer"),
    "switch.wz_diagnose": ent("switch.wz_diagnose", "wohnzimmer", { entity_category: "diagnostic" }),
    "light.bad": ent("light.bad", "bad"),
    "light.speicher": ent("light.speicher", "speicher"),
    "sensor.unser_zuhause_lichter_an": ent("sensor.unser_zuhause_lichter_an", null, { platform: "unser_zuhause", translation_key: "lights_on" }),
    "sensor.unser_zuhause_offene_rollos": ent("sensor.unser_zuhause_offene_rollos", null, { platform: "unser_zuhause", translation_key: "covers_open" }),
    "sensor.system_ha_global_health_score": ent("sensor.system_ha_global_health_score", null, { platform: "haghs" }),
    "sensor.processor_use": ent("sensor.processor_use", null, { platform: "systemmonitor", translation_key: "processor_use" }),
    "sensor.memory_use_percent": ent("sensor.memory_use_percent", null, { platform: "systemmonitor", translation_key: "memory_use_percent" }),
    "sensor.disk_use_percent_config": ent("sensor.disk_use_percent_config", null, { platform: "systemmonitor", translation_key: "disk_use_percent" }),
    "sensor.system_monitor_network_throughput_in_hassio": ent("sensor.system_monitor_network_throughput_in_hassio", null, { platform: "systemmonitor", translation_key: "throughput_network_in" }),
    "sensor.system_monitor_eingehender_netzwerkdurchsatz_enp6s18": ent("sensor.system_monitor_eingehender_netzwerkdurchsatz_enp6s18", null, { platform: "systemmonitor", translation_key: "throughput_network_in" }),
    "sensor.system_monitor_ausgehender_netzwerkdurchsatz_enp6s18": ent("sensor.system_monitor_ausgehender_netzwerkdurchsatz_enp6s18", null, { platform: "systemmonitor", translation_key: "throughput_network_out" }),
    "sensor.last_boot": ent("sensor.last_boot", null, { platform: "systemmonitor", translation_key: null }),
    "sensor.backup_letztes_erfolgreiches_automatisches_backup": ent("sensor.backup_letztes_erfolgreiches_automatisches_backup", null, { platform: "backup", translation_key: "last_successful_automatic_backup" }),
    "sensor.speedtest_download": ent("sensor.speedtest_download", null, { platform: "speedtestdotnet", translation_key: "download" }),
    "sensor.speedtest_upload": ent("sensor.speedtest_upload", null, { platform: "speedtestdotnet", translation_key: "upload" }),
    "sensor.speedtest_ping": ent("sensor.speedtest_ping", null, { platform: "speedtestdotnet", translation_key: "ping" }),
    "select.unser_zuhause_hausmodus": ent("select.unser_zuhause_hausmodus", null, { platform: "unser_zuhause", translation_key: "house_mode" }),
    "sensor.unser_zuhause_energie_coach": ent("sensor.unser_zuhause_energie_coach", null, { platform: "unser_zuhause", translation_key: "energy_coach" }),
    "binary_sensor.unser_zuhause_fenster_turen": ent("binary_sensor.unser_zuhause_fenster_turen", null, { platform: "unser_zuhause", translation_key: "openings_open" }),
  },
  // Echte Energie-Konfiguration der Installation (gekürzt)
  callWS: async (msg) => {
    if (msg.type === "energy/get_prefs") {
      return {
        energy_sources: [
          { type: "solar", stat_energy_from: "sensor.daily_pv_generation", stat_rate: "sensor.total_dc_power" },
          { type: "battery", stat_energy_from: "sensor.daily_battery_discharge", stat_energy_to: "sensor.daily_battery_charge", stat_rate: "sensor.battery_net_power" },
          { type: "water", stat_energy_from: "sensor.wasser_8342459685_wasserverbrauch_insgesamt", stat_rate: "sensor.wasser_8342459685_wasserdurchfluss" },
          { type: "grid", stat_energy_from: "sensor.strom_one_8855996755_1_8_0", stat_energy_to: "sensor.strom_one_8855996755_2_8_0", stat_rate: "sensor.grid_net_power" },
        ],
        device_consumption: [
          { stat_consumption: "sensor.garage_gesamtenergie", name: "Wallbox" },
          { stat_consumption: "sensor.shellypro3em_841fe8917860_energy", name: "Heizung" },
          { stat_consumption: "sensor.busylight_energy", name: "Busylight" },
        ],
      };
    }
    if (msg.type === "recorder/statistics_during_period") {
      // 3 Wochen, je Statistik gleiche Werte: PV 70, Kauf 40, Verkauf 20, Akku raus 30 / rein 32 → Verbrauch 88
      const per = { "sensor.daily_pv_generation": 70, "sensor.strom_one_8855996755_1_8_0": 40, "sensor.strom_one_8855996755_2_8_0": 20,
        "sensor.daily_battery_discharge": 30, "sensor.daily_battery_charge": 32 };
      const start = new Date(msg.start_time).getTime();
      return Object.fromEntries(msg.statistic_ids.map((id) => [id, [0, 1, 2].map((w) => ({ start: start + w * 7 * 86400000, change: per[id] ?? 0 }))]));
    }
    if (msg.type === "recorder/statistic_during_period") {
      const day = {
        "sensor.strom_one_8855996755_1_8_0": 12.6, "sensor.strom_one_8855996755_2_8_0": 7.9,
        "sensor.daily_pv_generation": 24.5, "sensor.daily_battery_discharge": 7.1, "sensor.daily_battery_charge": 9.6,
        "sensor.wasser_8342459685_wasserverbrauch_insgesamt": 0.025, "sensor.garage_gesamtenergie": 0,
        "sensor.shellypro3em_841fe8917860_energy": 13.2,
      };
      return { change: day[msg.statistic_id] ?? 0 };
    }
    if (msg.type === "lovelace/config" && msg.url_path === "dashboard-heizung") return {
      views: [{ title: "Heizung", path: "heizung", type: "sections", sections: [{ type: "grid", cards: [{ type: "heading", heading: "Status" }] }] }],
    };
    if (msg.type === "lovelace/config" && msg.url_path === "dashboard-strategie") return { strategy: { type: "original-states" } };
    // WebSocket der Integration „Unser Zuhause“
    if (msg.type === "lovelace/dashboards/list") return [
      { url_path: "dashboard-heizung", title: "Heizung", icon: "mdi:heat-pump", mode: "storage" },
      { url_path: "dashboard-garten", title: "Garten", icon: "mdi:flower", mode: "storage" },
    ];
    if (msg.type === "config/auth/list") return [
      { id: "u-seb", name: "Sebastian", system_generated: false, is_active: true },
      { id: "u-chr", name: "Christina", system_generated: false, is_active: true },
      { id: "u-sys", name: "Supervisor", system_generated: true, is_active: true },
    ];
    if (msg.type === "repairs/list_issues") return { issues: systemFixture.repairs };
    if (msg.type === "system_log/list") return systemFixture.log;
    if (msg.type === "unser_zuhause/get_options") {
      return {
        house_modes_file: "/config/unser_zuhause/hausmodus.txt",
        options: integrationOptions,
        cover_classes: ["shutter", "blind", "garage", "other"],
        opening_classes: ["window", "door"],
      };
    }
    if (msg.type === "unser_zuhause/set_options") {
      integrationCalls.push(msg);
      return { options: msg };
    }
    throw new Error(`unbekannt: ${msg.type}`);
  },
};

// Gespeicherte Dashboard-Einstellungen des Nutzers (Stand 2026-10-12)
const userConfig = {
  type: "custom:unser-zuhause",
  hidden_areas: ["haderschen", "uberall_und_nirgends", "tanken"],
  badges: ["sensor.anwesende_personen", "input_boolean.sebastian_anwesenheit_dumy", "device_tracker.hamm"],
  badge_actions: { "input_boolean.sebastian_anwesenheit_dumy": { action: "toggle" } },
  lights_entity: "sensor.angeschaltete_lichter", covers_entity: "sensor.offene_rollos",
  windows_entity: "binary_sensor.fenster_und_turen", extra_tiles: ["input_select.anwesenheit"],
  trash_calendar: "calendar.awido_online", energy_entity: "sensor.daily_consumed_energy",
  show_evcc: true, hidden_floors: ["temp"], exclude_label: "no_dboard",
  persons: ["person.astrid", "person.sebastian", "person.christina"], persons_only_home: false,
  energy_cards: ["now", "day"],
  energy_card: {
    devices: ["Wallbox", "Heizung"],
    device_power: { Wallbox: "sensor.evcc_hamm_charge_power", Heizung: "sensor.shellypro3em_841fe8917860_power" },
    fossil_entity: "sensor.electricity_maps_anteil_fossiler_brennstoffe_im_netz",
    power_grid_in: "sensor.import_power", power_grid_out: "sensor.export_power", power_solar: "sensor.total_dc_power",
    power_battery_in: "sensor.battery_charging_power", power_battery_out: "sensor.battery_discharging_power",
    battery_soc: "sensor.battery_level", show_water: true,
  },
  hidden_modules: [],
  grid: [["home", "energy", "trash", "evcc"], ["floor:eg", "floor:og", "floor:speicher", ""]],
  weather_entity: "weather.forecast_home",
  weather_badges: ["sensor.weather_station_ausenmodul_temperature"],
  show_clock_weather: true, clock_weather_temperature: "sensor.eve_weather_ba94_temperature",
  show_horizon: true,
  trash_days: 14,
};

// ---------- 1. Strategy mit den Nutzer-Einstellungen ----------
console.log("\n— Strategy (deine Einstellungen)");
const Strategy = customElements.get("ll-strategy-dashboard-unser-zuhause");
check("Strategy ist registriert", !!Strategy);
const view = (await Strategy.generate(userConfig, hass)).views[0];
check("4 Spalten", view.max_columns === 4, view.max_columns);
check("8 Zellen (2 Zeilen × 4)", view.sections.length === 8, view.sections.length);
check("Header zentriert", view.header?.layout === "center");
check("Header Reihe 1: 3 Personen", view.badges.length === 3);
const row2 = view.header?.card;
check("Header Reihe 2: Badge-Leiste mit 3 Badges", row2?.type === "custom:uz-badge-row" && row2.entities.length === 3);
check("Header Reihe 2: Aktion toggle übergeben", row2?.actions?.["input_boolean.sebastian_anwesenheit_dumy"]?.action === "toggle");
const energy = flatCards(view.sections[1].cards).filter((c) => /uz-energy-(now|day)-card$/.test(c.type || ""));
check("Energie: eigene Karten Aktuell + Heute", energy.map((c) => c.type).join(",") === "custom:uz-energy-now-card,custom:uz-energy-day-card");
check("Energie: Karten tragen nur ihre eigenen Einstellungen", energy[0]?.battery_soc === "sensor.battery_level" && !energy[0]?.grid);
// Ältere Konfiguration mit Einzelfeldern wird übernommen
const legacy = (await Strategy.generate({ ...userConfig, energy_card: undefined, energy_devices: ["Wallbox"], power_grid_in: "sensor.import_power" }, hass)).views[0];
const legacyCard = flatCards(legacy.sections[1].cards).find((c) => c.type === "custom:uz-energy-day-card");
check("Ältere Energie-Einstellungen werden übernommen", legacyCard?.devices?.[0] === "Wallbox" && legacyCard?.power_grid_in === "sensor.import_power");
check("Müll in Zelle 3", flatCards(view.sections[2].cards).some((c) => c.type === "custom:trash-card"));
check("Müll: Vorschau 14 Tage", flatCards(view.sections[2].cards).find((c) => c.type === "custom:trash-card")?.next_days === 14);
const homeTypes = view.sections[0].cards.map((c) => c.type);
check("Wetter in Unser Zuhause (Vorhersage, Uhr-Wetter, Sonne/Mond)",
  ["weather-forecast", "custom:clock-weather-card", "custom:horizon-card"].every((t) => homeTypes.includes(t)), homeTypes.join(","));
check("Wetter-Überschrift mit Badge",
  view.sections[0].cards.find((c) => c.heading === "Wetter")?.badges?.[0]?.entity === "sensor.weather_station_ausenmodul_temperature");
check("EVCC in Zelle 4", flatCards(view.sections[3].cards).some((c) => c.type === "custom:evcc-card"));
check("Leere Zelle = Platzhalter", view.sections[7].cards[0]?.type === "custom:uz-spacer-card");
const popups = view.sections[0].cards.filter((c) => c.card_type === "pop-up").map((c) => c.hash);
check("Popups hängen an Unser Zuhause", popups.includes("#uz-wohnzimmer") && popups.includes("#uz-lichter"));
const wz = view.sections[0].cards.find((c) => c.hash === "#uz-wohnzimmer");
const wzEntities = flatCards(wz?.cards || []).map((c) => c.entity).filter(Boolean);
check("Label no_dboard blendet aus", !wzEntities.includes("light.versteckt"));
check("Diagnose-Entitäten ausgeblendet", !wzEntities.includes("switch.wz_diagnose"));
check("Ausgeblendete Etage (Temp) fehlt", !popups.includes("#uz-buro"));

// ---------- 2. Neutrale Datei ohne Einstellungen ----------
console.log("\n— Strategy (ohne Einstellungen, wie frisch aus HACS)");
const plain = (await Strategy.generate({ type: "custom:unser-zuhause" }, hass)).views[0];
check("Läuft ohne Einstellungen", plain.sections.length > 0);
check("Keine Entitäten aus DEFAULTS", !JSON.stringify(plain).includes("anwesende_personen"));
check("Personen automatisch (alle person.*)", plain.badges.length === 3);
check("Ohne Wetter-Entität kein Wetter", !JSON.stringify(plain).includes("weather-forecast"));
const plainCards = flatCards(plain.sections.flatMap((s) => s.cards));
check("Müll und EVCC nicht im Standard-Layout", !plainCards.some((c) => c.type === "custom:trash-card" || c.type === "custom:evcc-card"));
check("Status-Kacheln aus der Integration „Unser Zuhause“",
  ["sensor.unser_zuhause_lichter_an", "sensor.unser_zuhause_offene_rollos", "binary_sensor.unser_zuhause_fenster_turen"].every((e) => plainCards.some((c) => c.entity === e)));
const homeCards = flatCards(plain.sections[0].cards);
const clockAt = homeCards.findIndex((c) => c.type === "clock");
const modeCard = homeCards.find((c) => c.entity === "select.unser_zuhause_hausmodus");
check("Hausmodus direkt unter der Uhr, gleich breit",
  homeCards[clockAt + 1] === modeCard && modeCard?.grid_options?.columns === "full" && homeCards[clockAt].grid_options?.columns === "full");
check("Hausmodus wie im Simon42-Dashboard: Auswahl in der Kachel, kurzer Name",
  modeCard?.features?.[0]?.type === "select-options" && modeCard.features_position === "inline" && modeCard.hide_state === true && modeCard.name === "Hausmodus");
check("Eigene Sensoren haben Vorrang vor der Integration", !JSON.stringify(view).includes("unser_zuhause_lichter_an"));
check("Energie automatisch aus Energie-Dashboard", flatCards(plain.sections.flatMap((s) => s.cards)).some((c) => c.type === "custom:uz-energy-day-card"));

// ---------- 2b. System-Seite ----------
console.log("\n— System");
const waitSys = async () => { for (let i = 0; i < 5; i++) await tick(); };
const sysViews = (await Strategy.generate(userConfig, hass)).views;
const sysView = sysViews[1];
check("Zweite Seite „System“ als Unterseite (kein Reiter)", sysView?.path === "system" && sysView.subview === true);
const sysCards = flatCards(sysView.sections.flatMap((x) => x.cards));
check("System: CPU, RAM, Speicher, Betriebszeit",
  ["sensor.processor_use", "sensor.memory_use_percent", "sensor.disk_use_percent_config", "sensor.last_boot"].every((e) => sysCards.some((c) => c.entity === e)));
check("System: Download/Upload der echten Netzwerkkarte (nicht hassio)",
  sysCards.some((c) => c.entity === "sensor.system_monitor_eingehender_netzwerkdurchsatz_enp6s18" && c.name === "Download") &&
  sysCards.some((c) => c.entity === "sensor.system_monitor_ausgehender_netzwerkdurchsatz_enp6s18" && c.name === "Upload"));
check("Internet: Speedtest Download, Upload, Ping",
  ["sensor.speedtest_download", "sensor.speedtest_upload", "sensor.speedtest_ping"].every((e) => sysCards.some((c) => c.entity === e)));
const withFritz = {
  ...hass,
  entities: {
    ...hass.entities,
    "sensor.fritz_box_7590_download_durchsatz": { entity_id: "sensor.fritz_box_7590_download_durchsatz", platform: "fritz", translation_key: "kb_s_received", labels: [] },
    "sensor.fritz_box_7590_upload_durchsatz": { entity_id: "sensor.fritz_box_7590_upload_durchsatz", platform: "fritz", translation_key: "kb_s_sent", labels: [] },
  },
};
const fritzCards = flatCards((await Strategy.generate(userConfig, withFritz)).views[1].sections.flatMap((x) => x.cards));
check("Internet: Router-Durchsatz der FRITZ!Box, sobald eingerichtet",
  fritzCards.some((c) => c.entity === "sensor.fritz_box_7590_download_durchsatz") && fritzCards.some((c) => c.entity === "sensor.fritz_box_7590_upload_durchsatz"));
check("System: Backups", sysCards.some((c) => c.entity === "sensor.backup_letztes_erfolgreiches_automatisches_backup"));
check("System: Zustandskarte mit Global Health Score",
  sysCards.some((c) => c.type === "custom:uz-system-status-card" && c.mode === "full" && c.score === "sensor.system_ha_global_health_score"));
const homeSys = flatCards(sysViews[0].sections.flatMap((x) => x.cards)).find((c) => c.type === "custom:uz-system-status-card");
check("Kachel „System“ in Unser Zuhause", homeSys?.mode === "tile" && homeSys.grid_options?.columns === "full");
check("System abschaltbar", !(await Strategy.generate({ ...userConfig, show_system: false }, hass)).views.some((v) => v.path === "system"));

const sysCard = document.createElement("uz-system-status-card");
document.body.append(sysCard);
sysCard.setConfig({ ...homeSys });
sysCard.hass = hass;
await waitSys();
const tileColor = () => sysCard.shadowRoot.querySelector("ha-card")?.style.getPropertyValue("--c");
check("Farbindex orange bei Reparatur", tileColor() === "#f59e0b", tileColor());
check("Kachel nennt die Gründe (ohne Protokollfehler)", /1 Reparatur/.test(sysCard.shadowRoot.textContent) && !/Protokoll/.test(sysCard.shadowRoot.textContent));
systemFixture.repairs = [];
await sysCard._poll();
check("Fehler im Protokoll ändern die Farbe nicht", tileColor() === "#22c55e", tileColor());
systemFixture.log = [];
await sysCard._poll();
check("Farbindex grün, wenn alles in Ordnung", tileColor() === "#22c55e" && sysCard.shadowRoot.textContent.includes("82"));
const lowScore = { ...hass, states: { ...hass.states, "sensor.system_ha_global_health_score": st("sensor.system_ha_global_health_score", "55") } };
sysCard.hass = lowScore;
check("Farbindex rot bei Score unter 60", tileColor() === "#ef4444");
const withUpdate = { ...hass, states: { ...hass.states, "update.home_assistant_core_update": st("update.home_assistant_core_update", "on", { title: "Home Assistant Core" }) } };
sysCard.hass = withUpdate;
check("Update steht an → orange", tileColor() === "#f59e0b" && /1 Update/.test(sysCard.shadowRoot.textContent));
const pushed = [];
const realPush = win.history.pushState.bind(win.history);
win.history.pushState = (a, b, path) => pushed.push(path);
sysCard.shadowRoot.getElementById("go").click();
win.history.pushState = realPush;
check("Klick öffnet die System-Seite", pushed.at(-1)?.endsWith("/system"), pushed.at(-1));
const fullCard = document.createElement("uz-system-status-card");
document.body.append(fullCard);
fullCard.setConfig({ ...homeSys, mode: "full" });
fullCard.hass = withUpdate;
await waitSys();
check("Zustandskarte: Score-Ring, Teil-Scores und Updates",
  !!fullCard.shadowRoot.querySelector("svg.ring") && fullCard.shadowRoot.textContent.includes("Hardware 93") &&
  fullCard.shadowRoot.textContent.includes("Home Assistant Core"));

// ---------- 2c. Zombies ----------
console.log("\n— Zombies");
check("System-Seite: Bereich Zombies", JSON.stringify(sysView).includes("custom:uz-zombie-card"));
{
  const old = new Date(Date.now() - 60 * 60000).toISOString();
  const fresh = new Date().toISOString();
  const zs = (entity_id, state, last_changed = old) => ({ entity_id, state, attributes: { friendly_name: entity_id }, last_changed });
  const zStates = {
    "sensor.cam_a": zs("sensor.cam_a", "unavailable"),
    "sensor.cam_b": zs("sensor.cam_b", "unknown"),
    "sensor.beacon": zs("sensor.beacon", "unavailable"),
    "sensor.yaml_alt": zs("sensor.yaml_alt", "unavailable"),
    "sensor.neu": zs("sensor.neu", "unavailable", fresh), // noch in der Schonfrist
    "sensor.ok": zs("sensor.ok", "21"),
    "button.x": zs("button.x", "unknown"), // keine Zombie-Domain
    "sensor.ignoriert": zs("sensor.ignoriert", "unavailable"),
    "sensor.deaktiviert": zs("sensor.deaktiviert", "unavailable"),
  };
  const zReg = [
    { entity_id: "sensor.cam_a", platform: "eufy_sdk", config_entry_id: "e1", device_id: "d1", labels: [] },
    { entity_id: "sensor.cam_b", platform: "eufy_sdk", config_entry_id: "e1", device_id: "d1", labels: [] },
    { entity_id: "sensor.beacon", platform: "ibeacon", config_entry_id: "e2", device_id: "d2", labels: [] },
    { entity_id: "sensor.yaml_alt", platform: "template", config_entry_id: null, device_id: null, labels: [] },
    { entity_id: "sensor.ignoriert", platform: "matter", config_entry_id: "e3", device_id: "d3", labels: [] },
    { entity_id: "sensor.deaktiviert", platform: "matter", config_entry_id: "e3", device_id: "d3", labels: [], disabled_by: "user" },
  ];
  const zDevs = [
    { id: "d1", name: "Kamera Garten", labels: [] },
    { id: "d2", name: "Fremder Beacon", labels: [] },
    { id: "d3", name: "Lampe", labels: ["haghs_ignore"] },
  ];
  const zEntries = [
    { entry_id: "e1", title: "eufy bridge", state: "loaded" },
    { entry_id: "e2", title: "iBeacon Tracker", state: "loaded", supports_remove_device: true },
    { entry_id: "e4", title: "ZHA", state: "loaded", supports_remove_device: true },
    { entry_id: "e5", title: "Mosquitto broker", state: "loaded", supports_remove_device: false },
    { entry_id: "e3", title: "Matter", state: "loaded" },
  ];
  const calls = [];
  const zHass = {
    states: zStates,
    callWS: async (msg) => {
      calls.push(msg);
      if (msg.type === "config/entity_registry/list") return zReg;
      if (msg.type === "config/device_registry/list") return zDevs;
      if (msg.type === "config_entries/get") return zEntries;
      if (msg.type === "config/label_registry/list") return [{ label_id: "haghs_ignore" }];
      if (msg.type === "config/device_registry/update") {
        zDevs.find((d) => d.id === msg.device_id).labels = msg.labels;
        return {};
      }
      if (msg.type === "config/device_registry/remove_config_entry") {
        if (msg.device_id === "d4") throw new Error("Failed to remove device entry, rejected by integration");
        zReg.splice(0, zReg.length, ...zReg.filter((e) => e.device_id !== msg.device_id));
        delete zStates["sensor.beacon"];
        return {};
      }
      if (msg.type === "config/entity_registry/remove") {
        zReg.splice(0, zReg.length, ...zReg.filter((e) => e.entity_id !== msg.entity_id));
        delete zStates[msg.entity_id];
        return {};
      }
      return {};
    },
  };
  const zc = document.createElement("uz-zombie-card");
  document.body.append(zc);
  zc.setConfig({ ignore_label: "haghs_ignore" });
  zc.hass = zHass;
  await waitSys();
  const head = () => zc.shadowRoot.querySelector(".head .t")?.textContent || "";
  const groupKeys = () => [...zc.shadowRoot.querySelectorAll(".row.g")].map((r) => r.dataset.g);
  check("Zombies gezählt (Schonfrist, Domains, Label, Deaktivierte beachtet)", head().startsWith("4 Zombies"), head());
  check("Gruppiert nach Integration, größte zuerst", groupKeys()[0] === "eufy_sdk" && groupKeys().length === 3, groupKeys().join());
  zc.shadowRoot.querySelector('.row.g[data-g="eufy_sdk"]').click();
  check("Aufklappen zeigt Geräte mit Entitäten", zc.shadowRoot.textContent.includes("Kamera Garten") && zc.shadowRoot.querySelectorAll(".ents a").length === 2);
  zc.shadowRoot.querySelector('[data-act="ignore"][data-g="eufy_sdk"]:not([data-d])').click();
  await waitSys();
  check("Ignorieren setzt das Label am Gerät", zDevs[0].labels.includes("haghs_ignore") && head().startsWith("2 Zombies"), head());
  const delBtn = () => zc.shadowRoot.querySelector('[data-act="delete"][data-g="ibeacon"]:not([data-d])');
  const before = calls.length;
  delBtn().click();
  await waitSys();
  check("Löschen fragt erst nach", delBtn().textContent.includes("Wirklich löschen?") && !calls.slice(before).some((c) => /remove/.test(c.type)));
  delBtn().click();
  await waitSys();
  check("Zweiter Klick löscht das Gerät", calls.some((c) => c.type === "config/device_registry/remove_config_entry" && c.device_id === "d2") && head().startsWith("1 Zombie"), head());
  zc.shadowRoot.querySelector('[data-act="delete"][data-g="template"]:not([data-d])').click();
  zc.shadowRoot.querySelector('[data-act="delete"][data-g="template"]:not([data-d])').click();
  await waitSys();
  check("YAML-Reste ohne Gerät: Entität wird entfernt", calls.some((c) => c.type === "config/entity_registry/remove" && c.entity_id === "sensor.yaml_alt") && head().startsWith("0 Zombies"), head());

  // Neue Zombies: ZHA lehnt Löschen ab, MQTT kann keine Geräte löschen
  Object.assign(zStates, {
    "sensor.zha_a": zs("sensor.zha_a", "unavailable"),
    "sensor.mqtt_a": zs("sensor.mqtt_a", "unavailable"),
    "sensor.mqtt_b": zs("sensor.mqtt_b", "unavailable"),
  });
  zReg.push(
    { entity_id: "sensor.zha_a", platform: "zha", config_entry_id: "e4", device_id: "d4", labels: [] },
    { entity_id: "sensor.mqtt_a", platform: "mqtt", config_entry_id: "e5", device_id: "d5", labels: [] },
    { entity_id: "sensor.mqtt_b", platform: "mqtt", config_entry_id: "e5", device_id: "d6", labels: [] },
  );
  zDevs.push({ id: "d4", name: "Zigbee-Lampe", labels: [] }, { id: "d5", name: "Thermometer A", labels: [] }, { id: "d6", name: "Thermometer B", labels: [] });
  zc.shadowRoot.querySelector('[data-act="refresh"]').click();
  await waitSys();
  check("Neu laden findet neue Zombies", head().startsWith("3 Zombies"), head());
  const nCalls = calls.length;
  zc.shadowRoot.querySelector('[data-act="delete"][data-g="zha"]:not([data-d])').click();
  zc.shadowRoot.querySelector('[data-act="delete"][data-g="zha"]:not([data-d])').click();
  await waitSys();
  check("Abgelehntes Löschen wird klar gemeldet (keine stillen Ersatz-Löschungen)",
    zc.shadowRoot.querySelector(".msg")?.textContent.includes("Zigbee-Lampe") &&
    !calls.slice(nCalls).some((c) => c.type === "config/entity_registry/remove"));
  // Mehrfachauswahl: ganze MQTT-Gruppe per Kästchen, dann Löschen über die Leiste
  zc.shadowRoot.querySelector('[data-sel="group"][data-g="mqtt"]').click();
  check("Kästchen an der Integration wählt alle ihre Geräte", zc.shadowRoot.querySelector(".bar")?.textContent.includes("2 Geräte ausgewählt"));
  zc.shadowRoot.querySelector('.row.g[data-g="mqtt"] .txt').click();
  zc.shadowRoot.querySelector('[data-sel="mqtt::d6"]').click();
  check("Einzelnes Gerät abwählen", zc.shadowRoot.querySelector(".bar")?.textContent.includes("1 Gerät ausgewählt"));
  const nCalls2 = calls.length;
  zc.shadowRoot.querySelector('.bar [data-act="delete"]').click();
  zc.shadowRoot.querySelector('.bar [data-act="delete"]').click();
  await waitSys();
  check("Auswahl löschen: Integration ohne Geräte-Löschen → Entitäten werden entfernt, ohne Fehlversuch",
    calls.slice(nCalls2).some((c) => c.type === "config/entity_registry/remove" && c.entity_id === "sensor.mqtt_a") &&
    !calls.slice(nCalls2).some((c) => c.type === "config/device_registry/remove_config_entry") &&
    !calls.slice(nCalls2).some((c) => c.entity_id === "sensor.mqtt_b") && !zc.shadowRoot.querySelector(".bar"));
  zc.shadowRoot.querySelector('[data-sel="group"][data-g="mqtt"]').click();
  zc.shadowRoot.querySelector('[data-sel="group"][data-g="zha"]').click();
  zc.shadowRoot.querySelector('.bar [data-act="ignore"]').click();
  await waitSys();
  check("Auswahl über mehrere Integrationen auf einmal ignorieren",
    zDevs.find((d) => d.id === "d4").labels.includes("haghs_ignore") && zDevs.find((d) => d.id === "d6").labels.includes("haghs_ignore") && head().startsWith("0 Zombies"), head());
  const nonAdmin = document.createElement("uz-zombie-card");
  document.body.append(nonAdmin);
  nonAdmin.setConfig({});
  nonAdmin.hass = { states: {}, callWS: async () => { throw new Error("unauthorized"); } };
  await waitSys();
  check("Ohne Admin-Rechte nur ein Hinweis", nonAdmin.shadowRoot.textContent.includes("Nur für Administratoren"));
}

// ---------- 2d. Kameras ----------
console.log("\n— Kameras");
{
  const camHass = {
    ...hass,
    states: {
      ...hass.states,
      "camera.garten": st("camera.garten", "streaming", { friendly_name: "Garten" }),
      "camera.hof": st("camera.hof", "idle", { friendly_name: "Hof" }),
      "camera.garage": st("camera.garage", "unavailable", { friendly_name: "Garage" }),
    },
  };
  const camViews = (await Strategy.generate(userConfig, camHass)).views;
  const camView = camViews.find((v) => v.path === "kameras");
  check("Unterseite „Kameras“ (Panel, ohne Reiter)", camView?.subview === true && camView.type === "panel");
  check("Ohne Auswahl: alle Kameras", JSON.stringify(camView.cards[0].cameras) === JSON.stringify(["camera.garage", "camera.garten", "camera.hof"]));
  const camTile = flatCards(camViews[0].sections.flatMap((x) => x.cards)).find((c) => c.type === "custom:uz-link-tile");
  check("Kachel „Kameras“ in Unser Zuhause mit Anzahl", camTile?.path === "kameras" && camTile.subtitle.startsWith("3 Kameras"));
  const homeOrder = flatCards(camViews[0].sections[0].cards).map((c) => c.type);
  check("Kachel steht unter der System-Kachel", homeOrder.indexOf("custom:uz-link-tile") === homeOrder.indexOf("custom:uz-system-status-card") + 1);
  const chosen = (await Strategy.generate({ ...userConfig, cameras: ["camera.hof", { entity: "camera.garten", wide: true }], camera_columns: 3 }, camHass)).views.find((v) => v.path === "kameras");
  check("Eigene Auswahl, Reihenfolge und Spalten werden übernommen",
    chosen.cards[0].cameras[0] === "camera.hof" && chosen.cards[0].cameras[1].wide === true && chosen.cards[0].columns === 3);
  const linkView = (await Strategy.generate({ ...userConfig, home_links: [{ title: "Heizung", icon: "mdi:heat-pump", path: "/dashboard-heizung", users: ["u1"] }] }, camHass)).views[0];
  const links = flatCards(linkView.sections[0].cards).filter((c) => c.type === "custom:uz-link-tile");
  check("Link-Kachel zu anderem Dashboard, nur für bestimmte Benutzer, unter der Kamera-Kachel",
    links[1]?.path === "extern-dashboard-heizung" && links[1].visibility?.[0]?.users?.[0] === "u1" && links[0].path === "kameras");
  check("Ohne Kameras keine Seite und keine Kachel",
    !(await Strategy.generate(userConfig, hass)).views.some((v) => v.path === "kameras"));

  // Karte: Name oben, Live-Bild darunter
  const grid = document.createElement("uz-camera-grid-card");
  document.body.append(grid);
  grid.setConfig({ cameras: ["camera.hof", { entity: "camera.garten", wide: true }, "camera.garage"], columns: 2, live: true });
  grid.hass = camHass;
  await waitSys();
  const tiles = [...grid.shadowRoot.querySelectorAll(".tile")];
  check("Je Kamera eine Kachel in gewählter Reihenfolge mit Namen",
    tiles.map((t) => t.querySelector(".name").textContent).join() === "Hof,Garten,Garage");
  check("Darunter das Live-Bild (picture-entity, camera_view live)",
    tiles[0].querySelector(".img > *")?.config?.type === "picture-entity" && tiles[0].querySelector(".img > *").config.camera_view === "live");
  check("Breite Kamera über 2 Spalten", tiles[1].classList.contains("wide"));
  check("Nicht erreichbare Kamera grau markiert", tiles[2].querySelector(".dot").classList.contains("off") && !tiles[0].querySelector(".dot").classList.contains("off"));
  const firstImg = tiles[0].querySelector(".img > *");
  grid.hass = { ...camHass };
  await waitSys();
  check("Neue Zustände starten den Stream nicht neu (Bild-Element bleibt)", grid.shadowRoot.querySelector(".tile .img > *") === firstImg);

  // Bewegung/Person am selben Gerät wie die Kamera
  const motionHass = (motion, person) => ({
    ...camHass,
    entities: {
      ...camHass.entities,
      "camera.hof": ent("camera.hof", null, { device_id: "dev-hof" }),
      "binary_sensor.hof_motion": ent("binary_sensor.hof_motion", null, { device_id: "dev-hof" }),
      "binary_sensor.hof_person": ent("binary_sensor.hof_person", null, { device_id: "dev-hof" }),
      "binary_sensor.hof_tuer": ent("binary_sensor.hof_tuer", null, { device_id: "dev-hof" }),
    },
    states: {
      ...camHass.states,
      "binary_sensor.hof_motion": st("binary_sensor.hof_motion", motion, { device_class: "motion" }),
      "binary_sensor.hof_person": st("binary_sensor.hof_person", person, {}),
      "binary_sensor.hof_tuer": st("binary_sensor.hof_tuer", "on", { device_class: "door" }),
    },
  });
  grid.hass = motionHass("off", "off");
  const hofTile = () => grid.shadowRoot.querySelector(".tile");
  check("Ohne Bewegung keine Hervorhebung (Türkontakt zählt nicht)", !hofTile().classList.contains("active") && hofTile().querySelector(".act").hidden);
  grid.hass = motionHass("on", "off");
  check("Bewegung: Bild eingerahmt, Hinweis „Bewegung“", hofTile().classList.contains("active") && hofTile().querySelector(".act").textContent === "Bewegung");
  grid.hass = motionHass("on", "on");
  check("Person hat Vorrang (rot)", hofTile().querySelector(".act").textContent === "Person" && hofTile().style.getPropertyValue("--act") === "#ef4444");
  check("Hervorheben ändert das Live-Bild nicht", grid.shadowRoot.querySelector(".tile .img > *") === firstImg);
  const camLink = document.createElement("uz-link-tile");
  document.body.append(camLink);
  camLink.setConfig({ title: "Kameras", subtitle: "3 Kameras", icon: "mdi:cctv", path: "kameras", cameras: ["camera.hof", "camera.garten"] });
  camLink.hass = motionHass("off", "off");
  check("Kamera-Kachel ruhig ohne Bewegung", camLink.shadowRoot.textContent.includes("3 Kameras") && !camLink.shadowRoot.querySelector(".alert"));
  camLink.hass = motionHass("on", "off");
  check("Kamera-Kachel meldet Bewegung mit Kameraname", !!camLink.shadowRoot.querySelector(".alert") && camLink.shadowRoot.textContent.includes("Bewegung: Hof"));
  const motionCfg = (await Strategy.generate(userConfig, camHass)).views;
  check("Strategy gibt der Kamera-Kachel die Kameras mit",
    flatCards(motionCfg[0].sections.flatMap((x) => x.cards)).find((c) => c.path === "kameras")?.cameras?.length === 3 &&
    motionCfg.find((v) => v.path === "kameras").cards[0].highlight_motion === true);
  check("Hervorhebung abschaltbar",
    !flatCards((await Strategy.generate({ ...userConfig, camera_motion: false }, camHass)).views[0].sections.flatMap((x) => x.cards)).find((c) => c.path === "kameras")?.cameras);

  // Editor: Anordnung per Ziehen/Antippen, breit, entfernen
  const camEd = document.createElement("uz-camera-grid-card-editor");
  document.body.append(camEd);
  const camChanges = [];
  camEd.addEventListener("config-changed", (e) => camChanges.push(e.detail.config));
  camEd.hass = camHass;
  camEd.setConfig({ cameras: ["camera.hof", "camera.garten", "camera.garage"], columns: 2 });
  const camNames = () => [...camEd.querySelectorAll(".cam .n")].map((n) => n.textContent).join();
  check("Editor zeigt die Anordnung als Raster", camNames() === "Hof,Garten,Garage");
  const camDrop = new win.Event("drop", { bubbles: true });
  camDrop.dataTransfer = { getData: () => "2" };
  camEd.querySelectorAll(".cam")[0].dispatchEvent(camDrop);
  check("Ziehen verschiebt die Kamera", JSON.stringify(camChanges.at(-1)?.cameras) === JSON.stringify(["camera.garage", "camera.hof", "camera.garten"]));
  camEd.setConfig(camChanges.at(-1));
  camEd.querySelectorAll(".cam")[2].click();
  camEd.querySelectorAll(".cam")[0].click();
  check("Antippen + Ziel antippen verschiebt (Handy)", JSON.stringify(camChanges.at(-1)?.cameras) === JSON.stringify(["camera.garten", "camera.garage", "camera.hof"]));
  camEd.setConfig(camChanges.at(-1));
  camEd.querySelector('button[data-act="wide"][data-idx="0"]').click();
  check("⇔ macht eine Kamera breit", camChanges.at(-1).cameras[0]?.wide === true && camChanges.at(-1).cameras[0].entity === "camera.garten");
  camEd.setConfig(camChanges.at(-1));
  camEd.querySelector('button[data-act="remove"][data-idx="2"]').click();
  check("✕ entfernt eine Kamera", camChanges.at(-1).cameras.length === 2);
  check("Karte in der Kartenauswahl", win.customCards.some((c) => c.type === "uz-camera-grid-card"));

  // ---------- 2e. Energie-Seite ----------
  console.log("\n— Energie-Seite");
  const eViews = (await Strategy.generate(userConfig, hass)).views;
  const eView = eViews.find((v) => v.path === "energie");
  const eCards = eView ? flatCards(eView.sections.flatMap((x) => x.cards)) : [];
  check("Unterseite „Energie“ ohne Reiter", eView?.subview === true && eView.type === "sections");
  check("Jetzt, Heute, Autarkie, Verlauf",
    ["custom:uz-energy-now-card", "custom:uz-energy-day-card", "energy-date-selection", "energy-self-sufficiency-gauge", "energy-usage-graph"]
      .every((t) => eCards.some((c) => c.type === t)));
  const eTile = flatCards(eViews[0].sections.flatMap((x) => x.cards)).find((c) => c.path === "energie");
  check("Kachel „Verlauf & Bilanz“ im Energie-Modul", eTile?.type === "custom:uz-link-tile");
  const coachSec = eView?.sections[0];
  check("Energie-Coach oben, über die ganze Breite, nur mit Bericht sichtbar",
    coachSec?.column_span === 3 && coachSec.visibility?.some((v) => v.state_not === "unknown") &&
      coachSec.cards.some((c) => c.type === "markdown" && c.content.includes("sensor.unser_zuhause_energie_coach")));
  const wkCard = eCards.find((c) => c.type === "custom:uz-energy-weeks-card");
  check("Energie-Seite: Diagramm „Pro Woche“ mit den Energie-Statistiken", wkCard?.energy?.solar === "sensor.daily_pv_generation" && wkCard.weeks === 12);
  const wc = document.createElement("uz-energy-weeks-card");
  document.body.append(wc);
  wc.setConfig({ ...wkCard, weeks: 3 });
  wc.hass = hass;
  await new Promise((r) => setTimeout(r, 50));
  const wcText = wc.shadowRoot?.textContent || "";
  const titles = [...(wc.shadowRoot?.querySelectorAll("rect title") || [])].map((t) => t.textContent);
  check("Wochen-Diagramm: Verbrauch, PV, Kauf, Verkauf als Balken je Woche",
    ["Verbrauch", "PV", "Kauf", "Verkauf"].every((l) => wcText.includes(l)) && titles.length === 12 &&
      titles.some((t) => t.includes("Verbrauch: 88 kWh")) && titles.some((t) => t.includes("Verkauf: 20 kWh")), titles.slice(0, 4).join(" | "));
  check("Wochen-Diagramm: Durchschnitt ohne laufende Woche", wcText.includes("⌀ 88 kWh") && wcText.includes("jetzt"));
  const linkCfg = { ...userConfig, home_links: [
    { title: "Heizung", path: "/dashboard-heizung" },
    { title: "Strategie", path: "/dashboard-strategie" },
    { title: "Extern ohne Unterseite", path: "/dashboard-heizung", embed: false },
  ] };
  const lViews = (await Strategy.generate(linkCfg, hass)).views;
  const lTiles = flatCards(lViews[0].sections.flatMap((x) => x.cards)).filter((c) => c.type === "custom:uz-link-tile" && c.title !== "Verlauf & Bilanz");
  const sub = lViews.find((v) => v.path === "extern-dashboard-heizung");
  check("Verknüpftes Dashboard als Unterseite (mit Zurück-Pfeil)",
    sub?.subview === true && sub.sections?.[0]?.cards?.[0]?.heading === "Status" && lTiles.find((t) => t.title === "Heizung")?.path === "extern-dashboard-heizung");
  check("Strategie-Dashboard und „embed: false“ bleiben normale Links",
    lTiles.find((t) => t.title === "Strategie")?.path === "/dashboard-strategie" && lTiles.find((t) => t.title === "Extern ohne Unterseite")?.path === "/dashboard-heizung");
  check("Energie-Seite abschaltbar", !(await Strategy.generate({ ...userConfig, show_energy_page: false }, hass)).views.some((v) => v.path === "energie"));

  // ---------- 2f. Tablet ----------
  console.log("\n— Tablet");
  const tabCfg = { ...userConfig, tablet_users: ["u-tab"] };
  const asTablet = (await Strategy.generate(tabCfg, { ...camHass, user: { id: "u-tab" } })).views;
  check("Tablet-Benutzer: Tablet ist die erste Seite", asTablet[0]?.path === "tablet" && !asTablet[0].subview && asTablet[1]?.path === "zuhause");
  const tabCards = flatCards(asTablet[0].sections.flatMap((x) => x.cards));
  check("Tablet: große Uhr, Hausmodus, Kameras",
    tabCards.some((c) => c.type === "clock" && c.clock_size === "large") &&
    tabCards.some((c) => c.type === "custom:uz-camera-grid-card" && c.cameras.length === 3));
  const asOther = (await Strategy.generate(tabCfg, { ...camHass, user: { id: "u-seb" } })).views;
  check("Andere Benutzer: Startseite bleibt, Tablet als Unterseite", asOther[0].path === "zuhause" && asOther.find((v) => v.path === "tablet")?.subview === true);
  check("Ohne Tablet-Benutzer keine Tablet-Seite", !(await Strategy.generate(userConfig, camHass)).views.some((v) => v.path === "tablet"));
}

// ---------- 2g. Startseite: Begrüßung, Hinweise, Läuft gerade, Szenen, Personen, Vorschau ----------
console.log("\n— Startseite-Karten");
{
  const homeCards = (v) => flatCards(v.sections.flatMap((x) => x.cards));
  const hv = (await Strategy.generate({
    ...userConfig, scenes: ["scene.film"], running_devices: ["binary_sensor.trockner_running"], person_tiles: ["person.a"], home_camera: "camera.tuer",
  }, hass)).views[0];
  const hc = homeCards(hv).map((c) => c.type);
  check("Begrüßung, Szenen, Hinweise, Läuft gerade, Personen, Vorschau in Unser Zuhause",
    ["custom:uz-greeting-card", "custom:uz-scene-bar", "custom:uz-alerts-card", "custom:uz-running-card", "custom:uz-person-card", "custom:uz-camera-preview"]
      .every((t) => hc.includes(t)), hc.join());
  check("Begrüßung direkt unter der Überschrift", hc.indexOf("custom:uz-greeting-card") === hc.indexOf("heading") + 1);
  const off = homeCards((await Strategy.generate({ ...userConfig, show_greeting: false, show_alerts: false, scene_all_off: false }, hass)).views[0]).map((c) => c.type);
  check("Alles abschaltbar", !off.includes("custom:uz-greeting-card") && !off.includes("custom:uz-alerts-card") && !off.includes("custom:uz-scene-bar") && !off.includes("custom:uz-camera-preview"));

  const H = (states, extra = {}) => ({ ...hass, user: { name: "Sebastian Schmalzbauer", is_admin: true }, states: { ...hass.states, ...states }, ...extra });

  // Begrüßung
  const gr = document.createElement("uz-greeting-card");
  document.body.append(gr);
  gr.setConfig({ weather: "weather.home", lights: "sensor.l", windows: "binary_sensor.w" });
  gr.hass = H({
    "weather.home": st("weather.home", "rainy", { temperature: 12.5, temperature_unit: "°C" }),
    "sun.sun": st("sun.sun", "above_horizon", { elevation: 30, rising: false }),
    "sensor.l": st("sensor.l", "2"),
    "binary_sensor.w": st("binary_sensor.w", "on"),
  });
  const gt = gr.shadowRoot.textContent;
  check("Begrüßung mit Vornamen und Datum", /(Guten (Morgen|Tag|Abend)|Gute Nacht), Sebastian/.test(gt) && /\d+\. \w+/.test(gt), gt.slice(0, 80));
  check("Chips: Temperatur, Lichter, Fenster offen", gt.includes("12,5 °C") && gt.includes("2 Lichter an") && gt.includes("Fenster offen"));
  check("Regen: grauer Hintergrund mit Regen-Effekt", gr.shadowRoot.querySelector(".fx.rain") && gr.shadowRoot.innerHTML.includes("#334155"));
  gr.hass = H({ "weather.home": st("weather.home", "clear-night", { temperature: 5 }), "sun.sun": st("sun.sun", "below_horizon", { elevation: -20 }) });
  check("Nacht: dunkler Hintergrund mit Sternen", !!gr.shadowRoot.querySelector(".fx.stars"));

  // Wochenrückblick
  const greet = flatCards(hv.sections.flatMap((x) => x.cards)).find((c) => c.type === "custom:uz-greeting-card");
  check("Strategy gibt der Begrüßung die Energie-Summen mit",
    greet.energy?.solar === "sensor.daily_pv_generation" && greet.energy.grid_in === "sensor.strom_one_8855996755_1_8_0" && greet.weekly_review === "sunday");
  const wk = document.createElement("uz-greeting-card");
  document.body.append(wk);
  wk.setConfig({ ...greet, weekly_review: "always" });
  wk.hass = H({});
  await waitSys();
  const wt = wk.shadowRoot.textContent;
  // Testwerte: PV 24,5 · Bezug 12,6 · Einspeisung 7,9 · Akku 7,1 raus / 9,6 rein → Verbrauch 26,7, Autarkie 53 %
  check("Wochenrückblick: PV, Verbrauch, Autarkie, Einspeisung",
    wt.includes("Wochenrückblick") && wt.includes("24,5 kWh") && wt.includes("26,7 kWh") && wt.includes("53 %") && wt.includes("7,9 kWh"), wt.replace(/\s+/g, " ").slice(-200));
  const wkOff = document.createElement("uz-greeting-card");
  document.body.append(wkOff);
  wkOff.setConfig({ ...greet, weekly_review: "off" });
  wkOff.hass = H({});
  await waitSys();
  check("Wochenrückblick abschaltbar", !wkOff.shadowRoot.textContent.includes("Wochenrückblick"));

  // Was ist los?
  const al = document.createElement("uz-alerts-card");
  const alHost = document.createElement("hui-card");
  document.body.append(alHost);
  alHost.append(al);
  al.setConfig({ windows: "binary_sensor.w", house_mode: "select.hm", battery_threshold: 15 });
  al.hass = H({ "binary_sensor.w": st("binary_sensor.w", "off"), "select.hm": st("select.hm", "anwesend") });
  check("Nichts zu tun → Karte samt Hülle unsichtbar", alHost.style.display === "none");
  const lowBatt = {
    entities: {
      ...hass.entities,
      "sensor.btn_battery": ent("sensor.btn_battery", null, { device_id: "d1" }),
      "sensor.btn_battery_plus": ent("sensor.btn_battery_plus", null, { device_id: "d1" }),
      "sensor.min_soc": ent("sensor.min_soc", null, { device_id: "d2" }),
    },
    devices: { d1: { id: "d1", name: "Taster Flur" }, d2: { id: "d2", name: "WR" } },
  };
  al.hass = H({
    "binary_sensor.w": st("binary_sensor.w", "on"), "select.hm": st("select.hm", "abwesend"),
    "sensor.btn_battery": st("sensor.btn_battery", "3", { device_class: "battery" }),
    "sensor.btn_battery_plus": st("sensor.btn_battery_plus", "3", { device_class: "battery" }),
    "sensor.min_soc": st("sensor.min_soc", "5", { device_class: "battery" }),
  }, lowBatt);
  const at = al.shadowRoot.textContent;
  check("Hinweis: Fenster offen bei Abwesend", alHost.style.display === "" && at.includes("Fenster offen, obwohl niemand zu Hause ist"));
  check("Batterie je Gerät nur einmal, ohne SoC-Einstellungen", at.includes("1 Batterie fast leer") && at.includes("Taster Flur 3 %"));

  // Batterien: Battery Notes (Typ, Anzahl, Knopf), Handys ausgenommen, eigene Seite
  const battHass = H({
    "sensor.btn_battery": st("sensor.btn_battery", "3", { device_class: "battery" }),
    "sensor.btn_battery_plus": st("sensor.btn_battery_plus", "3", { device_class: "battery", battery_type: "CR2032", battery_quantity: 1, battery_type_and_quantity: "CR2032", battery_low: true, battery_last_replaced: "2026-01-27T13:47:14+00:00" }),
    "sensor.rain_battery_plus": st("sensor.rain_battery_plus", "24", { device_class: "battery", battery_type: "AAA", battery_quantity: 2, battery_type_and_quantity: "2× AAA", battery_low: false }),
    "sensor.temp_battery": st("sensor.temp_battery", "90", { device_class: "battery" }),
    "sensor.phone_battery": st("sensor.phone_battery", "4", { device_class: "battery" }),
    "button.btn_battery_replaced": st("button.btn_battery_replaced", "unknown"),
    "sensor.wind_battery_plus": st("sensor.wind_battery_plus", "unavailable", { device_class: "battery" }),
    "sensor.wind_battery_type": st("sensor.wind_battery_type", "4× AA", { battery_type: "AA", battery_quantity: 4 }),
  }, {
    entities: {
      ...hass.entities,
      "sensor.btn_battery": ent("sensor.btn_battery", null, { device_id: "d1" }),
      "sensor.btn_battery_plus": ent("sensor.btn_battery_plus", null, { device_id: "d1", platform: "battery_notes" }),
      "button.btn_battery_replaced": ent("button.btn_battery_replaced", null, { device_id: "d1", platform: "battery_notes" }),
      "sensor.rain_battery_plus": ent("sensor.rain_battery_plus", null, { device_id: "d3", platform: "battery_notes" }),
      "sensor.temp_battery": ent("sensor.temp_battery", "buero", { device_id: "d4" }),
      "sensor.phone_battery": ent("sensor.phone_battery", null, { device_id: "d5", platform: "mobile_app" }),
      "sensor.wind_battery_plus": ent("sensor.wind_battery_plus", null, { device_id: "d6", platform: "battery_notes" }),
      "sensor.wind_battery_type": ent("sensor.wind_battery_type", null, { device_id: "d6", platform: "battery_notes" }),
    },
    devices: { d1: { id: "d1", name: "Taster Flur" }, d3: { id: "d3", name: "Regenmesser" }, d4: { id: "d4", name: "Thermometer" }, d5: { id: "d5", name: "iPhone" }, d6: { id: "d6", name: "Windmesser" } },
  });
  const bc = document.createElement("uz-battery-card");
  document.body.append(bc);
  bc.setConfig({ threshold: 15, soon: 30 });
  const pressed = [];
  bc.hass = { ...battHass, callService: (d, s, data) => pressed.push([d, s, data.entity_id]) };
  const bt = bc.shadowRoot.textContent.replace(/\s+/g, " ");
  check("Batterie-Seite: leer, bald, Einkaufsliste, Handy ausgenommen",
    bt.includes("Jetzt wechseln") && bt.includes("Bald (unter 30 %)") && bt.includes("Einkaufsliste: 1× CR2032") && !bt.includes("iPhone") && bt.includes("Alle anzeigen (1 in Ordnung)"), bt.slice(0, 300));
  const types = [...bc.shadowRoot.querySelectorAll(".type")].map((t) => t.textContent);
  check("Benötigte Batterien je Gerät (Typ fehlt ohne Battery Notes)", types.includes("1× CR2032") && types.includes("2× AAA"), types.join(","));
  check("Nicht erreichbar: Typ aus dem Typ-Sensor, ohne doppelte Anzahl", types.includes("4× AA") && !types.some((t) => /×.*×/.test(t)), types.join(","));
  bc.shadowRoot.getElementById("toggle").click();
  check("Alle anzeigen klappt „In Ordnung“ auf, ohne Typ → „Typ fehlt“",
    bc.shadowRoot.textContent.includes("In Ordnung") && [...bc.shadowRoot.querySelectorAll(".type.none")].length === 1);
  const rep = () => bc.shadowRoot.querySelector(".rep");
  rep().click();
  check("Gewechselt: erst nachfragen", rep().textContent === "Wirklich?" && !pressed.length);
  rep().click();
  check("Gewechselt: zweiter Klick drückt Knopf von Battery Notes", pressed[0]?.join() === "button,press,button.btn_battery_replaced");

  const tile = document.createElement("uz-link-tile");
  document.body.append(tile);
  tile.setConfig({ title: "Batterien", path: "batterien", batteries: 15 });
  tile.hass = battHass;
  check("Kachel zählt leere Batterien", tile.shadowRoot.textContent.includes("1 Batterie wechseln"));

  al.setConfig({ battery_threshold: 15, battery_path: "batterien" });
  al.hass = battHass;
  check("„Was ist los?“ nennt Batterietyp, ohne Handy", al.shadowRoot.textContent.includes("Taster Flur 3 % (1× CR2032)") && !al.shadowRoot.textContent.includes("iPhone"));

  const gen = await Strategy.generate({ ...userConfig, badges: ["sensor.daily_pv_generation"], badge_names: { "sensor.daily_pv_generation": "PV heute" } }, battHass);
  const bView = gen.views.find((v) => v.path === "batterien");
  check("Strategy: Unterseite „Batterien“ mit Karte und Kachel",
    bView?.subview && bView.sections[0].cards[0].type === "custom:uz-battery-card" &&
    flatCards(gen.views[0].sections.flatMap((x) => x.cards)).some((c) => c.type === "custom:uz-link-tile" && c.path === "batterien"));
  check("Strategy: Batterie-Seite abschaltbar",
    !(await Strategy.generate({ ...userConfig, show_batteries: false }, battHass)).views.some((v) => v.path === "batterien"));
  const rowCfg = gen.views[0].header.card;
  check("Header Reihe 2 bekommt eigene Namen", rowCfg?.names?.["sensor.daily_pv_generation"] === "PV heute");
  const br = document.createElement("uz-badge-row");
  document.body.append(br);
  br.setConfig(rowCfg);
  br.hass = battHass;
  check("Badge zeigt eigenen Namen statt Entitätsname", br.shadowRoot.querySelector(".name")?.textContent === "PV heute");

  // Läuft gerade
  const rn = document.createElement("uz-running-card");
  const rnHost = document.createElement("hui-card");
  document.body.append(rnHost);
  rnHost.append(rn);
  rn.setConfig({ devices: ["binary_sensor.trockner_running", "sensor.bosch_dishwasher_betriebszustand", "sensor.wp_power"], battery: "sensor.soc", battery_power: "sensor.bp" });
  const runStates = (tr, dw, wp, bp) => H({
    "binary_sensor.trockner_running": st("binary_sensor.trockner_running", tr),
    "sensor.bosch_dishwasher_betriebszustand": st("sensor.bosch_dishwasher_betriebszustand", dw),
    "sensor.wp_power": st("sensor.wp_power", wp, { unit_of_measurement: "W", friendly_name: "Wärmepumpe Leistung" }),
    "sensor.soc": st("sensor.soc", "64"),
    "sensor.bp": st("sensor.bp", bp, { unit_of_measurement: "W" }),
  });
  rn.hass = runStates("off", "ready", "2", "10");
  check("Läuft nichts → unsichtbar", rnHost.style.display === "none");
  rn.hass = runStates("on", "run", "1200", "-1500");
  const rt = rn.shadowRoot.textContent;
  check("Trockner, Spülmaschine, Wärmepumpe, Akku mit bewegtem Symbol",
    ["Trockner", "Spülmaschine", "Wärmepumpe", "Akku lädt"].every((n) => rt.includes(n)) && rt.includes("1,5 kW") &&
    !!rn.shadowRoot.querySelector('ha-icon.a-spinfast[icon="mdi:tumble-dryer"]') && !!rn.shadowRoot.querySelector('ha-icon[icon="mdi:battery-charging-60"]'));

  // Szenen-Leiste
  const sb = document.createElement("uz-scene-bar");
  document.body.append(sb);
  const calls = [];
  sb.setConfig({ items: ["scene.film", "script.nacht"], all_off: true });
  sb.hass = H({ "scene.film": st("scene.film", "x", { friendly_name: "Filmabend" }) }, { callService: async (...a) => calls.push(a) });
  const btns = [...sb.shadowRoot.querySelectorAll("button")];
  check("Szenen-Leiste: Szenen + „Alles aus“", btns.map((b) => b.textContent.trim()).join() === "Filmabend,script.nacht,Alles aus");
  btns[0].click();
  btns[2].click();
  await tick();
  check("Antippen startet Szene bzw. schaltet alle Lichter aus",
    calls[0]?.[0] === "scene" && calls[0][2].entity_id === "scene.film" && calls[1]?.[0] === "light" && calls[1][2].entity_id === "all");

  // Personen
  const pc = document.createElement("uz-person-card");
  document.body.append(pc);
  pc.setConfig({ entities: ["person.a", "person.b"] });
  const ago = (min) => new Date(Date.now() - min * 60000).toISOString();
  pc.hass = H({
    "person.a": { ...st("person.a", "home", { friendly_name: "Sebastian" }), last_changed: ago(185) },
    "person.b": { ...st("person.b", "not_home", { friendly_name: "Christina Muster" }), last_changed: ago(20) },
  });
  const pt = pc.shadowRoot.textContent;
  check("Personen: „Zuhause seit 3 Std.“ / „Unterwegs seit 20 Min.“ + Initialen", pt.includes("Zuhause seit 3 Std.") && pt.includes("Unterwegs seit 20 Min.") && pt.includes("CM"));

  // Kamera-Vorschau wechselt bei Bewegung
  const pv = document.createElement("uz-camera-preview");
  document.body.append(pv);
  pv.setConfig({ camera: "camera.tuer", cameras: ["camera.tuer", "camera.hof"], hold: 30 });
  const pvH = (motion) => H({
    "camera.tuer": st("camera.tuer", "idle", { friendly_name: "Haustür" }),
    "camera.hof": st("camera.hof", "idle", { friendly_name: "Hof" }),
    "binary_sensor.hof_person": st("binary_sensor.hof_person", motion),
  }, { entities: { ...hass.entities, "camera.hof": ent("camera.hof", null, { device_id: "dh" }), "binary_sensor.hof_person": ent("binary_sensor.hof_person", null, { device_id: "dh" }) } });
  pv.hass = pvH("off");
  await waitSys();
  check("Vorschau zeigt die Hauptkamera live", pv.shadowRoot.querySelector(".n").textContent === "Haustür" && pv.shadowRoot.querySelector(".img > *")?.config?.camera_view === "live");
  pv.hass = pvH("on");
  await waitSys();
  check("Person an anderer Kamera → Vorschau wechselt mit Hinweis", pv.shadowRoot.querySelector(".n").textContent === "Hof" && pv.shadowRoot.querySelector(".act").textContent === "Person");
  pv.hass = pvH("off");
  await waitSys();
  check("Danach bleibt das Bild noch kurz bei der Kamera", pv.shadowRoot.querySelector(".n").textContent === "Hof");
  pv.disconnectedCallback();
}

// ---------- 3. Eigenes Modul erscheint automatisch ----------
console.log("\n— Eigenes Modul");
const withCustom = {
  ...userConfig,
  custom_modules: [{ key: "garten", title: "Garten", icon: "mdi:flower", cards: [{ type: "tile", entity: "light.wz" }] }],
};
const v3 = (await Strategy.generate(withCustom, hass)).views[0];
const gartenCell = v3.sections.findIndex((s) => flatCards(s.cards).some((c) => c.title === "Garten"));
check("Neues Modul landet automatisch in der ersten freien Zelle", gartenCell === 7, gartenCell);

// ---------- 3b. Eigene Pop-ups ----------
console.log("\n— Eigene Pop-ups");
const withPopup = {
  ...userConfig,
  custom_popups: [{
    key: "garten", name: "Garten", icon: "mdi:flower", hash: "uz-garten", entity: "light.wz",
    entities: ["light.wz", "cover.wz", "light.versteckt"], cards: [{ type: "markdown", content: "Hallo" }],
  }],
};
const v4 = (await Strategy.generate(withPopup, hass)).views[0];
const garten = v4.sections[0].cards.find((c) => c.hash === "#uz-garten");
check("Pop-up wird erzeugt (Adresse ohne # ergänzt)", !!garten);
check("Pop-up: Entität in der Kopfzeile", garten?.entity === "light.wz" && garten?.button_type === "state");
check("Pop-up: Licht mit Helligkeitsregler, Rollo mit Position",
  garten?.cards?.find((c) => c.entity === "light.wz")?.features?.[0]?.type === "light-brightness" &&
  garten?.cards?.find((c) => c.entity === "cover.wz")?.features?.[0]?.type === "cover-position");
check("Pop-up: Label no_dboard blendet aus", !garten?.cards?.some((c) => c.entity === "light.versteckt"));
check("Pop-up: eigene YAML-Karten angehängt", garten?.cards?.at(-1)?.type === "markdown");

// ---------- 4. Energiekarte ----------
console.log("\n— Energiekarte");
const settle = async () => { for (let i = 0; i < 5; i++) await tick(); };
const valueTexts = (el) => [...el.shadowRoot.querySelectorAll(".val, .sub")].map((t) => t.textContent);
const { type: _t, ...cardConfig } = energy[1];
const card = document.createElement("uz-energy-day-card");
document.body.appendChild(card);
card.setConfig(cardConfig);
card.hass = hass;
await settle();
const flow1 = card.shadowRoot.querySelector(".flow");
const texts = valueTexts(card);
check("Heute: Quellen selbst aus dem Energie-Dashboard geladen", texts.includes("↓ 12,6 kWh") && texts.includes("24,5 kWh"), texts.join(" | "));
check("Heute: Wallbox + Heizung rechts am Haus",
  [...card.shadowRoot.querySelectorAll(".lbl")].map((l) => l.textContent).join(",").includes("Wallbox,Heizung"));
check("Wasser in Litern", texts.includes("25 L"), texts.join(" | "));
check("Icons als HTML (kein foreignObject, wie Power Flow Card Plus)",
  card.shadowRoot.querySelectorAll(".node ha-icon").length >= 5 && !card.shadowRoot.querySelector("foreignObject"));
check("Schrift skaliert mit der Kartenbreite (cqw)", card.shadowRoot.querySelector("style").textContent.includes("cqw"));
const activeDay = [...card.shadowRoot.querySelectorAll("path.line")].filter((p) => !p.getAttribute("class").includes("idle")).length;
check("Heute: Wege mit Energie animiert, Wallbox (0 kWh) grau", activeDay > 0 && card.shadowRoot.querySelectorAll("path.idle").length >= 1);
card._lastRender = 0;
card.hass = { ...hass };
check("Kein Neuaufbau bei Aktualisierung (kein Schwarzblitzen)", card.shadowRoot.querySelector(".flow") === flow1);
check("Legende mit Anteilen", /PV \d+ %/.test(card.shadowRoot.getElementById("legend")?.textContent || ""));

const { type: _t2, ...nowConfig } = energy[0];
const now = document.createElement("uz-energy-now-card");
now.setConfig(nowConfig);
now.hass = hass;
await settle();
const nowTexts = valueTexts(now);
check("Aktuell: PV in kW", nowTexts.includes("3,50 kW"), nowTexts.join(" | "));
check("Aktuell: Akkustand in der Batterie", nowTexts.includes("55 %"), nowTexts.join(" | "));
const batteryIcon = [...now.shadowRoot.querySelectorAll(".node")].find((n) => n.querySelector(".lbl")?.textContent === "Batterie")
  ?.querySelector("ha-icon")?.getAttribute("icon");
check("Aktuell: Batterie-Icon passt zum Ladestand", batteryIcon === "mdi:battery-60", batteryIcon);
const dots = [...now.shadowRoot.querySelectorAll("circle[id^=d]")].filter((d) => d.style.display !== "none").length;
check("Aktuell: nur Wege mit Leistung haben Punkte", dots >= 2 && dots < now.shadowRoot.querySelectorAll("circle[id^=d]").length, dots);
const bare = document.createElement("uz-energy-now-card");
bare.setConfig({});
bare.hass = hass;
await settle();
const bareTexts = valueTexts(bare);
check("Aktuell ohne eigene Sensoren: Netz und Batterie aus dem Energie-Dashboard",
  bareTexts.some((t) => t.includes("1,20 kW")) && bareTexts.some((t) => t.includes("800 W")), bareTexts.join(" | "));
check("Karten stehen im Kartenauswahl-Dialog",
  ["uz-energy-now-card", "uz-energy-day-card"].every((t) => win.customCards?.some((c) => c.type === t)));

// ---------- 4b. Editor der Energiekarten ----------
console.log("\n— Editor der Energiekarten");
const cardEditor = document.createElement("uz-energy-flow-card-editor");
const cardChanges = [];
cardEditor.addEventListener("config-changed", (e) => cardChanges.push(e.detail.config));
cardEditor.hass = hass;
cardEditor.setConfig({ type: "custom:uz-energy-now-card" });
await settle();
const sectionRows = () => [...cardEditor.querySelectorAll(".row")];
check("Übersicht mit Bereichen (Netz, PV, Batterie, …)", sectionRows().map((r) => r.dataset.id).join(",") === "grid,solar,battery,water,devices,extra,display");
sectionRows().find((r) => r.dataset.id === "battery").click();
const subForm = cardEditor.querySelector("ha-form");
check("Unterseite Batterie mit Akkustand", JSON.stringify(subForm.schema).includes("battery_soc") && !!cardEditor.querySelector(".back"));
subForm.dispatchEvent(new win.CustomEvent("value-changed", { detail: { value: { ...subForm.data, battery_soc: "sensor.battery_level" } } }));
check("Änderung wird als Kartenkonfiguration gemeldet", cardChanges.at(-1)?.battery_soc === "sensor.battery_level" && cardChanges.at(-1)?.type === "custom:uz-energy-now-card");
cardEditor.querySelector(".back").click();
check("Zurück zur Übersicht, Kurzinfo aktualisiert",
  sectionRows().find((r) => r.dataset.id === "battery")?.querySelector(".secondary")?.textContent.includes("Akkustand"));
sectionRows().find((r) => r.dataset.id === "devices").click();
check("Geräte zur Auswahl aus dem Energie-Dashboard", JSON.stringify(cardEditor.querySelector("ha-form").schema).includes("Busylight"));

// ---------- 5. Badge-Leiste: Aktionen ----------
console.log("\n— Header Reihe 2");
const row = document.createElement("uz-badge-row");
row.setConfig(row2);
row.hass = hass;
const fired = [];
row.addEventListener("hass-action", (e) => fired.push(e.detail));
row.shadowRoot.querySelectorAll(".badge").forEach((b) => b.click());
check("3 Badges gezeichnet", row.shadowRoot.querySelectorAll(".badge").length === 3);
check("Schalter-Badge löst toggle aus", fired.some((d) => d.config.entity === "input_boolean.sebastian_anwesenheit_dumy" && d.config.tap_action.action === "toggle"));
check("Ohne Aktion: Details anzeigen", fired.some((d) => d.config.entity === "sensor.anwesende_personen" && d.config.tap_action.action === "more-info"));

// ---------- 6. Editor ----------
console.log("\n— Editor");
const editor = document.createElement("unser-zuhause-strategy-editor");
const changes = [];
editor.addEventListener("config-changed", (e) => changes.push(e.detail.config));
editor.hass = hass;
editor.setConfig(withCustom);
document.body.append(editor);
await tick();

// Navigation wie ein Nutzer: Startseite → Bereich → Modul, Zurück-Pfeil
const visible = (sel) => [...editor.querySelectorAll(sel)].find((el) => !el.closest("[hidden]"));
const goHome = () => { for (let i = 0; i < 3 && visible(".uz-back"); i++) visible(".uz-back").click(); };
const go = (page) => { goHome(); editor.querySelector(`.uz-home [data-page="${page}"]`).click(); };
const items = () => [...editor.querySelectorAll(".items .item")];
const openItem = (id) => { go("modules"); editor.querySelector(`.items [data-open="${id}"]`).click(); };
const itemPage = () => visible(".uz-item-page");
const title = () => visible(".uz-top-title")?.textContent;

check("Startseite: Bereiche in zwei Gruppen",
  [...editor.querySelectorAll(".uz-home [data-page]")].map((b) => b.dataset.page).join() === "layout,modules,cameras,batteries,system,tablet,header,rooms,design" &&
  [...editor.querySelectorAll(".uz-group-label")].map((l) => l.textContent).join() === "Aufbau,Darstellung");
check("Startseite: Kurzinfo je Bereich", editor.querySelector('.uz-home [data-page="layout"] .uz-row-sub')?.textContent.includes("Spalten"));
check("Startseite ohne Zurück-Pfeil, nur sie sichtbar", !visible(".uz-back") && editor.querySelector(".layout").hidden);

go("layout");
check("Layout öffnet eigene Seite mit Zurück-Pfeil", title() === "Layout" && !!visible(".uz-back") && editor.querySelector(".uz-home").hidden);
check("Raster mit 8 Zellen", editor.querySelectorAll(".cell").length === 8);
check("Eigenes Modul als Baustein im Layout-Editor", [...editor.querySelectorAll(".chip")].some((c) => c.textContent.includes("Garten")));
goHome();
check("Zurück zur Startseite", title() === "Einstellungen" && !editor.querySelector(".uz-home").hidden);

go("header");
const form = () => editor.querySelector("ha-form.uz-form");
const headerSchema = JSON.stringify(form().schema);
check("Kopfzeile: Personen, Badges und Aktionen je Badge", ["persons", "badges", "badge_actions", "ui_action"].every((n) => headerSchema.includes(n)));
check("Kopfzeile: eigener Name je Badge", headerSchema.includes("badge_names") && headerSchema.includes("Header Reihe 2: eigene Namen"));
go("batteries");
check("Batterien: eigene Einstellungsseite", ["show_batteries", "battery_tile", "alert_battery", "battery_soon"].every((n) => JSON.stringify(form().schema).includes(n)));
go("header");
check("Keine YAML-Felder für Module/Energie im Menü",
  !headerSchema.includes('"cards"') && !headerSchema.includes("power_grid_in") && !headerSchema.includes("evcc_modes"));
const nHeader = changes.length;
form().dispatchEvent(new win.CustomEvent("value-changed", { detail: { value: { ...form().data, persons_only_home: true } } }));
check("Kopfzeile: Änderung wird gespeichert", changes.length === nHeader + 1 && changes.at(-1).persons_only_home === true);
go("rooms");
check("Räume & Etagen: eigenes Formular", JSON.stringify(form().schema).includes("hidden_floors") && !JSON.stringify(form().schema).includes("badges"));
go("design");
check("Design: Theme und Einklappen", JSON.stringify(form().schema).includes("theme") && JSON.stringify(form().schema).includes("collapsible"));

// hui-view als Attrappe – verhält sich wie HA 2026.10: Ereignisse an der Layout-Ansicht öffnen
// "Karte hinzufügen" bzw. den Karten-Editor; gespeichert wird über lovelace.saveConfig.
const dialogs = [];
customElements.define("hui-view", class extends win.HTMLElement {
  set lovelace(lovelace) {
    this._lovelace = lovelace;
    if (this.firstElementChild) return;
    const layout = document.createElement("hui-masonry-view");
    layout.addEventListener("ll-create-card", () =>
      dialogs.push({ tag: "hui-dialog-create-card", path: [this.index], lovelaceConfig: this._lovelace.config,
        pick: (card) => this._lovelace.saveConfig({ views: [{ ...this._lovelace.config.views[0], cards: [...this._lovelace.config.views[0].cards, card] }] }) }));
    layout.addEventListener("ll-edit-card", (ev) => {
      const i = ev.detail.path[1];
      const cards = this._lovelace.config.views[this.index].cards;
      dialogs.push({ tag: "hui-dialog-edit-card", cardConfig: cards[i],
        saveCardConfig: (c) => this._lovelace.saveConfig({ views: [{ cards: cards.map((x, j) => (j === i ? c : x)) }] }) });
    });
    this.append(layout, document.createElement("card-mod")); // card-mod hängt sich wie im echten HA dahinter
  }
  get lovelace() { return this._lovelace; }
});
const cardRows = () => [...(itemPage()?.querySelectorAll(".uz-card-row") || [])];
const addCardButton = () => itemPage()?.querySelector(".uz-add-card");

go("modules");
check("Liste „Module & Pop-ups“: Unser Zuhause, Energie, EVCC, Müll, eigene Module",
  items().map((i) => i.dataset.id).join(",") === "home:home,energy:energy,evcc:evcc,trash:trash,module:garten",
  items().map((i) => i.dataset.id).join(","));
check("Sichtbare Module ohne Markierung „ausgeblendet“", !editor.querySelector('.items [data-id="evcc:evcc"] .uz-pill'));

openItem("home:home");
await settle();
check("Modul öffnet eigene Seite mit seinem Namen", title() === "Unser Zuhause" && editor.querySelector(".uz-modules").hidden);
const homeForm = itemPage().querySelector(".item-body > ha-form");
const homeFields = JSON.stringify(homeForm?.schema);
check("Unser Zuhause: Status-Kacheln, Wetter und Favoriten im eigenen Menüpunkt",
  ["lights_entity", "windows_entity", "house_mode_entity", "weather_entity", "favorites", "show_clock"].every((n) => homeFields.includes(n)));
check("Unser Zuhause: Hinweis auf die Integration", itemPage().querySelector(".body-hint")?.textContent.includes("Integration"));
const intBox = itemPage().querySelector(".integration-box");
const intBoxText = () => intBox?.textContent || "";
check("Hinweis auf die Textdatei der Hausmodi", intBoxText().includes("/config/unser_zuhause/hausmodus.txt"));
check("Einstellungen der Integration werden geladen", intBox && !intBox.hidden && intBox.querySelector("ha-form").data.exclude_label === "no_dboard");
const intForm = intBox.querySelector("ha-form");
intForm.dispatchEvent(new win.CustomEvent("value-changed", { detail: { value: { ...intForm.data, cover_classes: ["shutter", "garage"] } } }));
await settle();
check("Änderung wird in der Integration gespeichert (nicht im Dashboard)",
  integrationCalls.at(-1)?.cover_classes?.join() === "shutter,garage" && integrationCalls.at(-1)?.exclude_label === "no_dboard");
const nHome = changes.length;
homeForm.dispatchEvent(new win.CustomEvent("value-changed", { detail: { value: { ...homeForm.data, title: "Daheim" } } }));
check("Unser Zuhause: Titel ändern", changes.length === nHome + 1 && changes.at(-1).title === "Daheim");
await settle();
const linksEd = itemPage().querySelector("uz-links-editor");
check("Unser Zuhause: Bereich „Dashboards verknüpfen“", !!linksEd && itemPage().textContent.includes("Dashboards verknüpfen"));
linksEd.querySelector(".lk-add").click();
check("Dashboard verknüpfen: erstes Dashboard mit Titel und Symbol",
  changes.at(-1).home_links?.[0]?.path === "/dashboard-heizung" && changes.at(-1).home_links[0].title === "Heizung" && changes.at(-1).home_links[0].icon === "mdi:heat-pump");
const lkForm = linksEd.querySelector(".lk-form ha-form");
check("Auswahl aus deinen Dashboards und Benutzern (ohne Systembenutzer)",
  JSON.stringify(lkForm.schema).includes("/dashboard-garten") && JSON.stringify(lkForm.schema).includes("Christina") && !JSON.stringify(lkForm.schema).includes("Supervisor"));
lkForm.dispatchEvent(new win.CustomEvent("value-changed", { detail: { value: { ...lkForm.data, path: "/dashboard-garten", users: ["u-seb"] } } }));
check("Dashboard wechseln übernimmt Titel/Symbol, Sichtbarkeit nur für Sebastian",
  changes.at(-1).home_links[0].title === "Garten" && changes.at(-1).home_links[0].icon === "mdi:flower" && changes.at(-1).home_links[0].users[0] === "u-seb");
check("Liste zeigt, für wen die Kachel sichtbar ist", linksEd.querySelector(".lk-s").textContent.includes("Sebastian"));
const lkDel = () => linksEd.querySelector('[data-act="remove"]');
lkDel().click();
check("Verknüpfung löschen fragt erst nach", changes.at(-1).home_links.length === 1 && lkDel().classList.contains("confirm"));
lkDel().click();
check("Zweiter Klick löscht die Verknüpfung", changes.at(-1).home_links.length === 0);
check("Seitentitel folgt dem neuen Namen", title() === "Daheim");
check("Fest eingebaute Module haben keinen Löschen-Button", !itemPage().querySelector(".delete"));
visible(".uz-back").click();
check("Zurück vom Modul führt zur Modul-Liste", title() === "Module & Pop-ups");

openItem("energy:energy");
const embedded = itemPage().querySelector("uz-energy-flow-card-editor");
check("Energie öffnet den Editor der Energiekarten", !!embedded);
const changesBefore = changes.length;
embedded?.dispatchEvent(new win.CustomEvent("config-changed", {
  detail: { config: { type: "custom:uz-energy-now-card", battery_soc: "sensor.battery_level" } }, bubbles: true, composed: true,
}));
check("Karten-Einstellungen landen in energy_card, Dialog bekommt nur die Strategy-Konfiguration",
  changes.length === changesBefore + 1 && changes.at(-1).energy_card?.battery_soc === "sensor.battery_level" &&
  !changes.at(-1).energy_card.type && changes.at(-1).type !== "custom:uz-energy-now-card");

openItem("module:garten");
await settle();
check("Eigenes Modul: Karten als Liste wie auf dem Dashboard",
  cardRows().length === 1 && cardRows()[0].textContent.includes("Tile") && !!addCardButton());
addCardButton().click();
const createDialog = dialogs.at(-1);
check("„Karte hinzufügen“ öffnet den Dialog von HA (Kartenauswahl)",
  createDialog?.tag === "hui-dialog-create-card" && createDialog.lovelaceConfig.views[0].cards[0]?.entity === "light.wz");
const n0 = changes.length;
await createDialog.pick({ type: "custom:evcc-card", mode: "site" });
check("Im Dialog gewählte Karte landet im Modul (ohne Störung des Dialogs)",
  changes.length === n0 + 1 && changes.at(-1).custom_modules.find((m) => m.key === "garten").cards.length === 2);
check("Neue Karte erscheint in der Liste", cardRows().length === 2);
cardRows()[1].click();
const editDialog = dialogs.at(-1);
check("Antippen einer Karte öffnet den Karten-Editor von HA", editDialog?.tag === "hui-dialog-edit-card" && editDialog.cardConfig.mode === "site");
await editDialog.saveCardConfig({ type: "custom:evcc-card", mode: "stats" });
check("Änderung im Karten-Editor wird gespeichert", changes.at(-1).custom_modules.find((m) => m.key === "garten").cards[1].mode === "stats");
cardRows()[1].querySelector('[data-act="up"]').click();
check("Karte nach oben verschieben", changes.at(-1).custom_modules.find((m) => m.key === "garten").cards[0].mode === "stats");
cardRows()[0].querySelector('[data-act="remove"]').click();
check("Karte entfernen", changes.at(-1).custom_modules.find((m) => m.key === "garten").cards.length === 1);
check("Geöffneter Editor übersteht setConfig", (editor.setConfig(changes.at(-1)), cardRows().length === 1));

openItem("evcc:evcc");
await settle();
check("EVCC: bisherige Karten in der Liste", cardRows().length > 0 && cardRows()[0].textContent.toLowerCase().includes("evcc"));
cardRows()[0].click();
check("EVCC-Karte öffnet den Editor (vom Entwickler)", dialogs.at(-1)?.cardConfig?.type === "custom:evcc-card");
addCardButton().click();
await dialogs.at(-1).pick({ type: "custom:evcc-card", mode: "stats" });
check("EVCC: Änderungen in evcc_cards", changes.at(-1).evcc_cards?.at(-1)?.mode === "stats");
const v5 = (await Strategy.generate({ ...changes.at(-1), show_evcc: true, hidden_modules: [] }, hass)).views[0];
check("Strategy nutzt die EVCC-Karten aus dem Editor", JSON.stringify(v5).includes('"mode":"stats"'));

openItem("trash:trash");
await settle();
cardRows()[0]?.click();
check("Müll: Müll-Karte öffnet ihren Editor", dialogs.at(-1)?.cardConfig?.type === "custom:trash-card", JSON.stringify(dialogs.at(-1)?.cardConfig));

go("layout");
editor.querySelector('[data-act="col+"]').click();
check("Spalte hinzufügen → 5 Spalten", changes.at(-1)?.grid?.[0]?.length === 5);
// Ziehen: Modul aus Zelle (0,0) in leere Zelle (1,4)
const fromKey = changes.at(-1).grid[0][0];
const drop = new win.Event("drop", { bubbles: true });
drop.dataTransfer = { getData: () => `${fromKey}|0,0` };
editor.querySelector('[data-cell="1,4"]').dispatchEvent(drop);
const g = changes.at(-1)?.grid;
check("Modul per Ziehen verschoben", g?.[1]?.[4] === fromKey && g?.[0]?.[0] === "", JSON.stringify(g));
// Antippen (Handy): Modul wählen, dann Ziel
editor.querySelector(`.chip[data-key="${fromKey}"]`).click();
check("Antippen markiert das Modul", editor.querySelector(`.chip[data-key="${fromKey}"]`).classList.contains("picked") && editor.querySelector(".layout").classList.contains("picking"));
editor.querySelector('[data-cell="0,0"]').click();
check("Antippen des Ziels verschiebt das Modul", changes.at(-1)?.grid?.[0]?.[0] === fromKey && changes.at(-1)?.grid?.[1]?.[4] === "");
editor.querySelector(`.chip[data-key="${fromKey}"]`).click();
editor.querySelector('[data-cell="pool"]').click();
check("Antippen von „Ausgeblendet“ blendet aus", changes.at(-1)?.hidden_modules?.includes(fromKey));
editor.querySelector(`.chip[data-key="${fromKey}"]`).click();
editor.querySelector('[data-cell="0,0"]').click();
check("… und wieder einblenden", changes.at(-1)?.grid?.[0]?.[0] === fromKey && !changes.at(-1)?.hidden_modules?.includes(fromKey));

go("modules");
editor.querySelector(".add-module").click();
check("Modul hinzufügen legt neues Modul an", changes.at(-1)?.custom_modules?.length === 2);
check("Neues Modul ist gleich zum Bearbeiten geöffnet", title() === "Neues Modul" && !!itemPage());
go("layout");
check("Neues Modul erscheint sofort im Layout-Editor", [...editor.querySelectorAll(".chip")].some((c) => c.textContent.includes("Neues Modul")));
go("modules");
editor.querySelector(".add-popup").click();
const newPopup = changes.at(-1)?.custom_popups?.[0];
check("Pop-up hinzufügen legt Pop-up mit Adresse an", !!newPopup && newPopup.hash === `#uz-${newPopup.key}`);
const popupForm = itemPage().querySelector(".item-body ha-form");
popupForm?.dispatchEvent(new win.CustomEvent("value-changed", { detail: { value: { ...popupForm.data, name: "Garage" } } }));
check("Pop-up umbenennen", changes.at(-1)?.custom_popups?.[0]?.name === "Garage");
check("Pop-ups in eigener Gruppe der Liste", (() => { go("modules"); return editor.querySelector(".uz-sub-label")?.textContent === "Pop-ups"; })());
openItem(`popup:${newPopup.key}`);
const popupDelete = () => itemPage()?.querySelector(".delete");
check("Löschen-Button am Ende der Seite des Pop-ups", !!popupDelete() && popupDelete().dataset.kind === "popup");
const before = changes.length;
popupDelete().click();
// HA liefert zwischendurch neue Zustände und ruft setConfig erneut auf (wie im echten Editor)
editor.hass = { ...hass };
editor.setConfig(changes.at(-1));
check("Erster Klick fragt nach, löscht noch nicht", changes.length === before && popupDelete().textContent.includes("Wirklich löschen?"));
check("Rückfrage übersteht neue Zustände und setConfig", popupDelete().classList.contains("confirm"));
const sameButton = popupDelete();
editor.setConfig(changes.at(-1));
check("Button bleibt beim Neuzeichnen dasselbe Element (Klick geht nicht verloren)", popupDelete() === sameButton);
popupDelete().click();
check("Zweiter Klick löscht das Pop-up", changes.at(-1)?.custom_popups?.length === 0);
check("Nach dem Löschen zurück in der Liste", title() === "Module & Pop-ups");
openItem("module:garten");
itemPage().querySelector('.delete[data-key="garten"]').click();
itemPage().querySelector('.delete[data-key="garten"]').click();
check("Modul löschen gibt seine Rasterzelle frei",
  !changes.at(-1)?.custom_modules?.some((m) => m.key === "garten") &&
  !JSON.stringify(changes.at(-1)?.grid).includes("custom:garten"));

// Ohne zweiten Klick: nach 10 s wieder "Löschen" (Timer wird hier abgefangen statt abgewartet)
const realTimeout = globalThis.setTimeout;
let timer;
globalThis.setTimeout = (fn, ms) => (ms === 10000 && (timer = { fn, ms }), 1);
go("modules");
editor.querySelector(".add-popup").click();
popupDelete().click();
const asked = popupDelete().textContent.includes("Wirklich löschen?");
timer?.fn();
globalThis.setTimeout = realTimeout;
check("Ohne Bestätigung nach 10 s zurück auf „Löschen“",
  asked && timer?.ms === 10000 && popupDelete().textContent.includes("Löschen") && !popupDelete().classList.contains("confirm"));

console.log(failed ? `\n${failed} Test(s) fehlgeschlagen` : "\nAlle Tests bestanden");
await win.happyDOM.abort();
process.exit(failed ? 1 : 0);
