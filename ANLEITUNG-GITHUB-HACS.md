# Anleitung: Auf GitHub veröffentlichen und über HACS einbinden

## 1. Was in diesem Ordner liegt

```
ha-unser-zuhause/
├── dist/
│   └── unser-zuhause-strategy.js   ← die Strategy (einzige Datei, die HA lädt)
├── .github/
│   └── workflows/
│       ├── validate.yml            ← prüft bei jedem Push, ob das Repo HACS-tauglich ist
│       └── release.yml             ← hängt die JS-Datei an jedes Release an
├── hacs.json                       ← sagt HACS, welche Datei geladen wird
├── README.md                       ← wird in HACS als Beschreibung angezeigt
├── LICENSE                         ← MIT-Lizenz
└── ANLEITUNG-GITHUB-HACS.md        ← diese Anleitung
```

`node_modules`, `test`, `scripts`, `package*.json` und `.env` brauchst du nur für die Tests auf deinem PC. `.env` enthält deinen Token und darf **nie** hochgeladen werden.

## 2. Repository auf GitHub anlegen

1. Auf <https://github.com/new> gehen
2. Bei **Owner** die Organisation **SebastianInTheWild** wählen (nicht dein persönliches Konto) – alle Links in den Repos zeigen auf `github.com/SebastianInTheWild/…`. Das gilt für alle vier Repos.
3. Name: `ha-unser-zuhause` (oder ein anderer Name, der Dateiname in `hacs.json` bleibt gleich)
4. **Public** wählen. HACS kann nur öffentliche Repositories laden.
5. Kein README, keine .gitignore, keine Lizenz anhaken, die liegen schon hier
6. **Create repository**

## 3. Dateien hochladen

### Variante A: im Browser (ohne Git)

1. Im neuen, leeren Repo auf **uploading an existing file** klicken
2. Den **Inhalt** des Ordners `ha-unser-zuhause` per Drag & Drop hineinziehen, also `dist`, `.github`, `hacs.json`, `README.md`, `LICENSE` und diese Anleitung, nicht den Ordner selbst.
   Der Ordner `.github` ist im Windows-Explorer eventuell ausgeblendet: Ansicht → Einblenden → **Ausgeblendete Elemente**.
3. Unten **Commit changes**

### Variante B: mit Git (PowerShell im Ordner `ha-unser-zuhause`)

```powershell
git init
git add .
git commit -m "Erste Version"
git branch -M main
git remote add origin https://github.com/SebastianInTheWild/ha-unser-zuhause.git
git push -u origin main
```

## 4. Repository für HACS vorbereiten

Auf der GitHub-Seite des Repos:

1. Rechts bei **About** auf das Zahnrad klicken
   - **Description** eintragen, z. B. „Dashboard-Strategy für Home Assistant“
   - **Topics**: `home-assistant`, `hacs`, `lovelace`, `dashboard`
2. Reiter **Actions**: Der Workflow **Validate** sollte grün werden. Wird er rot, steht in den Details, was fehlt. Meist sind es Beschreibung oder Topics.

## 5. Release erstellen

HACS installiert immer das neueste Release.

1. Rechts **Releases** → **Create a new release**
2. **Choose a tag** → `v1.0.0` eintippen → „Create new tag“
3. Titel `v1.0.0`, kurz beschreiben, **Publish release**
4. Der Workflow **Release** hängt `unser-zuhause-strategy.js` automatisch an

Für jede neue Version:

1. In `dist/unser-zuhause-strategy.js` oben `UZ_VERSION` hochzählen
2. Hochladen oder pushen
3. Neues Release mit passendem Tag erstellen, z. B. `v1.0.1`

HACS zeigt dir danach ein Update an.

## 6. In Home Assistant über HACS einbinden

1. HACS öffnen → oben rechts ⋮ → **Benutzerdefinierte Repositories**
2. Repository: `https://github.com/SebastianInTheWild/ha-unser-zuhause`, Typ: **Dashboard** → **Hinzufügen**
3. In HACS nach „Unser Zuhause“ suchen → **Herunterladen**
4. HACS legt die Dashboard-Resource `/hacsfiles/ha-unser-zuhause/unser-zuhause-strategy.js` selbst an

## 7. Alte Inline-Resource entfernen (wichtig)

Bisher wird die Strategy als eingebettete Resource geladen, die Claude angelegt hat. Nach der HACS-Installation entfernst du sie, damit nicht zwei Versionen gleichzeitig laden:

1. Einstellungen → Dashboards → ⋮ oben rechts → **Ressourcen**
2. Den Eintrag vom Typ **JavaScript-Modul** mit `data:`-Adresse löschen. Der HACS-Eintrag `/hacsfiles/...` bleibt.
3. Browser mit Strg+Shift+R neu laden. In der Companion-App: Einstellungen → Companion App → **Frontend-Cache zurücksetzen**.

Dein Dashboard „Unser Zuhause“ und alle Einstellungen bleiben erhalten. Sie stehen in der Dashboard-Konfiguration, nicht in der Datei.

## 7b. Karten-Paket (drittes Repository)

Die Karten liegen im Ordner `ha-unser-zuhause-cards` und bekommen ein eigenes Repository, genau wie die Strategy:

1. Öffentliches Repository `ha-unser-zuhause-cards` anlegen
2. Hochladen: `dist`, `.github`, `hacs.json`, `README.md`, `LICENSE`, `.gitignore`
3. Beschreibung, Topics und Release `v1.0.0` wie in Schritt 4 und 5
4. In HACS: `https://github.com/SebastianInTheWild/ha-unser-zuhause-cards`, Typ **Dashboard**
5. Nach der Installation die eingebettete Resource mit dem Inhalt `UZ_CARDS_VERSION` entfernen (wie in Schritt 7)

## 8. Integration „Unser Zuhause“ (zweites Repository)

Die Integration liegt im Ordner `ha-unser-zuhause-integration`. Sie braucht ein eigenes Repository, weil HACS pro Repository nur einen Typ erlaubt. Installiere sie **vor** der Strategy.

1. Auf <https://github.com/new> ein öffentliches Repository `ha-unser-zuhause-integration` anlegen
2. Den Inhalt des Ordners hochladen:
   - mit hochladen: `custom_components`, `tests`, `.github`, `hacs.json`, `README.md`, `LICENSE`, `pytest.ini`, `.gitignore`
   - **nicht** hochladen: den Ordner `.venv` und die Datei `overrides.txt`. Die brauchst du nur für die Tests auf deinem PC.
3. Beschreibung und Topics setzen wie in Schritt 4. Release `v1.0.0` anlegen wie in Schritt 5.
4. In HACS: ⋮ → **Benutzerdefinierte Repositories** → `https://github.com/SebastianInTheWild/ha-unser-zuhause-integration`, Typ **Integration**
5. „Unser Zuhause“ herunterladen und Home Assistant **neu starten**
6. Einstellungen → Geräte & Dienste → **Integration hinzufügen** → „Unser Zuhause“

Mit Git (PowerShell im Ordner `ha-unser-zuhause-integration`):

```powershell
git init
git add .
git commit -m "Erste Version"
git branch -M main
git remote add origin https://github.com/SebastianInTheWild/ha-unser-zuhause-integration.git
git push -u origin main
```

## 8b. Automationen als Blueprints (viertes Repository)

Ordner `ha-unser-zuhause-blueprints` – kein HACS nötig, Blueprints werden direkt aus GitHub importiert.

1. Neues **öffentliches** Repository `ha-unser-zuhause-blueprints` anlegen und den Inhalt des Ordners hochladen
   (die Struktur `blueprints/automation/unser_zuhause/…` muss erhalten bleiben, sonst stimmen die Import-Links nicht)
2. Der Workflow „Validate“ prüft die Blueprints bei jedem Hochladen
3. Fertig: Die Knöpfe **Blueprint importieren** in der README funktionieren, sobald das Repo öffentlich ist

Mit Git (PowerShell im Ordner `ha-unser-zuhause-blueprints`):

```powershell
git init
git add .
git commit -m "Erste Version"
git branch -M main
git remote add origin https://github.com/SebastianInTheWild/ha-unser-zuhause-blueprints.git
git push -u origin main
```

## 9. Später: in die offizielle HACS-Liste (optional)

Damit andere das Repo ohne „Benutzerdefinierte Repositories“ finden, kannst du es bei <https://github.com/hacs/default> einreichen. Voraussetzungen:

- Validate-Workflow grün
- mindestens ein Release
- Beschreibung und Topics gesetzt

Für ein privates Dashboard ist das nicht nötig.
