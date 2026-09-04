#!/usr/bin/env node
/**
 * Rapporteert hoe ver de OS-ondergrenzen in IntuneTemplate/ achterlopen op de n-1-versie van
 * elk platform, met endoflife.date als bron.
 *
 * **Exitcode altijd 0.** Dit is een rapportage, geen poort. `check-scope.js` blokkeert omdat
 * een scope-fout fóút is; een verouderde ondergrens is een besluit dat wacht. Zou dit script
 * CI laten falen, dan verhoogt iemand het getal om de build groen te krijgen — en dat is
 * precies het besluit dat een mens hoort te nemen. Een waarde in deze repo is namelijk niet
 * altijd een actualiteitsdoel: WIN 10.0.22621 en MAC 14.0 zijn *capaciteitsvloeren* die uit
 * andere policies in de baseline volgen (Account Lockout, Administrator Protection,
 * declaratief updatebeleid), en die mogen niet meebewegen met n-1. IOS 16.0 en AND 12.0 zijn
 * OIB-conventie en dus wél kandidaat. Dit script zegt niet welke van de twee een waarde is;
 * het laat alleen de afstand zien.
 *
 * Drie dingen die niet vanzelf goed gaan bij het afleiden van n-1, alle drie gemeten:
 *
 *  1. **Windows staat er dubbel in.** Elke feature-update heeft een `-e`-cyclus
 *     (Enterprise/Education) en een `-w`-cyclus (consument): zelfde build, andere einddatum.
 *     Positie 0 en 1 zijn dus dezelfde release en "n-1" levert **n** op. Er wordt daarom eerst
 *     ontdubbeld op de build (`latest.name`).
 *  2. **Android geeft geen `latest`.** Alle cycli hebben `latest: null`; daar is `cycle` de
 *     enige bruikbare waarde. Voor Windows is dat juist uitsluitend `latest`.
 *  3. **Apple telt in jaartallen.** iOS ging van 18 naar 26, macOS van 15 naar 26. n-1
 *     *rekenen* geeft 25 en die bestaat niet — n-1 is een pósitie in de lijst, nooit een som.
 *
 * De API is v1, niet de platte v0-array die her en der rondgaat: v1 heeft een expliciete
 * `schema_version`, en dat is het enige haakje waarmee dit script kan merken dát de bron van
 * vorm veranderd is in plaats van er stilletjes iets verkeerds uit af te leiden. Begint die
 * niet met "1.", dan wordt er voor dat platform géén n-1 gerapporteerd.
 *
 * Welke bestanden meetellen volgt uit het **veld**, niet uit de bestandsnaam: voor iOS en
 * Android bestaat er geen aparte OS Version-policy en zit de ondergrens in Device Health.
 * Het platform volgt uit het platformwoord in `@odata.type`, niet uit een vaste lijst
 * typenamen — er bestaan vier Android-compliancetypes en een klanttenant kan elk ervan
 * hebben.
 *
 * Gebruik:
 *   node scripts/check-osversion.js
 */

const fs = require("fs");
const path = require("path");
const { readTemplates, PATCH_FIELDS, versionFloors } = require("./lib/templates");

const REPO_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(REPO_ROOT, "IntuneTemplate");
const MANIFEST_PATH = path.join(TEMPLATE_DIR, "_manifest.json");

/** Waar de Android-patchdatum vandaan komt: de eerste van de maand, zes maanden terug. */
const PATCH_MONTHS_BACK = 6;

/**
 * Platformwoord in `@odata.type` -> endoflife.date-product. Windows vóór de rest: de andere
 * woorden komen niet in `windows10CompliancePolicy` voor, maar de volgorde maakt dat expliciet.
 */
const PRODUCTS = [
  { platform: "WIN", match: "windows", product: "windows" },
  { platform: "MAC", match: "macos", product: "macos" },
  { platform: "AND", match: "android", product: "android" },
  { platform: "IOS", match: "ios", product: "ios" },
];

/**
 * De Android-beveiligingspatchdatum heeft geen n-1 bij endoflife.date — daar is de basislijn
 * de kalender: de eerste van de maand, zes maanden terug. De afstand is dan het aantal
 * maanden dat de ingestelde datum ouder is dan die basislijn.
 */
function patchBaseline(now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - PATCH_MONTHS_BACK, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

/** Hele maanden tussen twee yyyy-MM-dd-datums; null als er geen datum in staat. */
function monthsBetween(from, to) {
  const a = /^(\d{4})-(\d{2})/.exec(from);
  const b = /^(\d{4})-(\d{2})/.exec(to);
  if (!a || !b) return null;
  return (Number(b[1]) - Number(a[1])) * 12 + (Number(b[2]) - Number(a[2]));
}

function platformOf(odataType) {
  const type = String(odataType || "").toLowerCase();
  return PRODUCTS.find((p) => type.includes(p.match)) || null;
}

async function fetchReleases(product) {
  const url = `https://endoflife.date/api/v1/products/${product}/`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} gaf HTTP ${response.status}`);
  const body = await response.json();

  // Het enige haakje dat een vormverandering aan de bron zichtbaar maakt.
  const schema = String(body.schema_version || "");
  if (!schema.startsWith("1.")) {
    throw new Error(`schema_version is "${schema || "(afwezig)"}", verwacht 1.x — de bron is van vorm veranderd, n-1 wordt niet afgeleid`);
  }

  const releases = (body.result && body.result.releases) || [];
  if (releases.length < 2) throw new Error(`${releases.length} release(s) terug — te weinig om n-1 uit af te leiden`);
  return releases;
}

/**
 * Van releaselijst naar ladder: nieuwste eerst, één sport per release.
 *
 * Windows loopt over de build (`latest.name`) en wordt daarop ontdubbeld — anders zijn sport 0
 * en 1 dezelfde feature-update in twee edities. Apple en Android lopen over `cycle`; bij
 * Android is dat verplicht want `latest` is er leeg.
 */
function buildLadder(platform, releases) {
  if (platform !== "WIN") {
    return releases.map((r) => ({ key: r.name, label: r.name, cycle: r.name }));
  }
  const seen = new Set();
  const ladder = [];
  for (const r of releases) {
    const build = r.latest && r.latest.name;
    if (!build || seen.has(build)) continue;
    seen.add(build);
    ladder.push({ key: build, label: `${build} (${r.name})`, cycle: r.name });
  }
  return ladder;
}

/**
 * De productlijn van een sport, uit de cyclusnaam ("11-22h2-e" -> "11") en niet uit de build:
 * Windows 10 en 11 rapporteren allebei een versie die met 10.0 begint.
 */
function lineOf(entry) {
  return String(entry.cycle).split("-")[0];
}

function rungFor(platform, ladder, value) {
  const exact = ladder.findIndex((e) => e.key === value);
  if (exact !== -1) return exact;
  if (platform === "WIN") return -1; // een build is een build; geen major-benadering
  const major = String(value).split(".")[0];
  return ladder.findIndex((e) => e.key === major);
}

/**
 * Afstand tellen op de ladder. Voor Windows telt dat alleen bínnen dezelfde productlijn: de
 * lijst van endoflife.date staat op releasedatum, dus Windows 10 22H2 (19045, oktober 2022)
 * staat tússen Windows 11 23H2 en Windows 11 22H2 in. Doortellen over die grens heen levert
 * een afstand die niets betekent — 22621 zou dan 4 sporten van 26200 liggen terwijl het er in
 * de Windows 11-lijn 3 zijn: 22H2 -> 23H2 -> 24H2 -> 25H2.
 */
function measure(platform, ladder, value) {
  const anchor = ladder[1]; // n-1 is een positie, nooit een som
  const scale = platform === "WIN" ? ladder.filter((e) => lineOf(e) === lineOf(anchor)) : ladder;
  const anchorAt = scale.findIndex((e) => e.key === anchor.key);
  const currentAt = rungFor(platform, scale, value);

  if (currentAt === -1) {
    const elders = rungFor(platform, ladder, value) !== -1;
    return {
      anchor: anchor.label,
      distance: "?",
      note: elders
        ? `"${value}" hoort bij een andere productlijn dan n-1 (${lineOf(anchor)}) — niet op één schaal te tellen`
        : `"${value}" komt niet voor in de releaselijst van endoflife.date`,
    };
  }
  return { anchor: anchor.label, distance: currentAt - anchorAt, note: null };
}

/** Positief = zoveel sporten áchter n-1. 0 = precies op n-1. Negatief = strenger dan n-1. */
function formatDistance(distance, platform) {
  if (distance === "?") return "?";
  if (distance === 0) return "op n-1";
  const n = Math.abs(distance);
  const unit = platform === "WIN" ? (n === 1 ? "feature-update" : "feature-updates") : n === 1 ? "major" : "majors";
  return distance < 0 ? `${n} ${unit} strenger` : `${n} ${unit} achter`;
}

/**
 * De `soort` uit `ondergrens` in _manifest.json — het antwoord op de enige vraag die deze
 * tabel eigenlijk stelt: mag dit getal mee omhoog? Een capaciteitsvloer mag dat niet, hoe ver
 * hij ook achterloopt; die staat er omdat een andere policy in de baseline hem nodig heeft.
 * `check-scope.js` bewaakt dat elke gezette ondergrens zo'n regel heeft, dus een "?" hier
 * betekent dat het manifest en de templates uit elkaar lopen.
 */
function soortenByTarget() {
  if (!fs.existsSync(MANIFEST_PATH)) return new Map();
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  const map = new Map();
  for (const p of manifest.policies || []) {
    for (const rule of p.ondergrens || []) map.set(`${p.target} ${rule.veld}`, rule.soort);
  }
  return map;
}

function collectRows(templates) {
  const soorten = soortenByTarget();
  const rows = [];
  for (const t of templates) {
    const platform = platformOf(t.raw["@odata.type"]);
    for (const { veld, waarde } of versionFloors(t.raw)) {
      rows.push({
        platform: platform ? platform.platform : "?",
        product: platform ? platform.product : null,
        file: path.relative(REPO_ROOT, t.filePath).split(path.sep).join("/"),
        baseName: t.baseName,
        field: veld,
        value: waarde,
        soort: soorten.get(`${t.baseName} ${veld}`) || "?",
        odataType: t.raw["@odata.type"],
      });
    }
  }
  const order = PRODUCTS.map((p) => p.platform);
  return rows.sort((a, b) => order.indexOf(a.platform) - order.indexOf(b.platform) || a.baseName.localeCompare(b.baseName));
}

function printTable(rows) {
  const cols = [
    { key: "platform", head: "PLATFORM" },
    { key: "file", head: "BESTAND" },
    { key: "field", head: "VELD" },
    { key: "value", head: "HUIDIG" },
    { key: "anchor", head: "N-1" },
    { key: "distance", head: "AFSTAND" },
    { key: "soort", head: "SOORT" },
  ];
  const widths = cols.map((c) => Math.max(c.head.length, ...rows.map((r) => String(r[c.key]).length)));
  const line = (cells) => ("  " + cells.map((cell, i) => String(cell).padEnd(widths[i])).join("  ")).trimEnd();

  console.log(line(cols.map((c) => c.head)));
  for (const row of rows) console.log(line(cols.map((c) => row[c.key])));
}

async function main() {
  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`IntuneTemplate/ niet gevonden op ${TEMPLATE_DIR}`);
    return;
  }

  const rows = collectRows(readTemplates(TEMPLATE_DIR));
  if (rows.length === 0) {
    console.log("Geen enkele policy zet een OS-ondergrens — niets te rapporteren.");
    return;
  }

  const needed = [...new Set(rows.map((r) => r.product).filter(Boolean))];
  const ladders = new Map();
  const failures = [];
  await Promise.all(
    needed.map(async (product) => {
      const platform = PRODUCTS.find((p) => p.product === product).platform;
      try {
        ladders.set(product, buildLadder(platform, await fetchReleases(product)));
      } catch (error) {
        failures.push({ product, message: error.message });
      }
    })
  );

  const notes = [];
  for (const row of rows) {
    if (PATCH_FIELDS.has(row.field)) {
      const baseline = patchBaseline();
      const months = monthsBetween(row.value, baseline);
      row.anchor = baseline;
      row.distance = months === null ? "?" : months === 0 ? "op de basislijn" : months > 0 ? `${months} maand${months === 1 ? "" : "en"} ouder` : `${-months} maand${-months === 1 ? "" : "en"} strenger`;
      if (months === null) notes.push(`${row.baseName}: "${row.value}" is geen yyyy-MM-dd-datum — afstand niet te bepalen.`);
      continue;
    }
    if (!row.product) {
      row.anchor = "?";
      row.distance = "?";
      notes.push(`${row.baseName}: geen platform af te leiden uit "${row.odataType}".`);
      continue;
    }
    const ladder = ladders.get(row.product);
    if (!ladder) {
      row.anchor = "?";
      row.distance = "?";
      continue;
    }
    const { anchor, distance, note } = measure(row.platform, ladder, row.value);
    row.anchor = anchor;
    row.distance = formatDistance(distance, row.platform);
    if (note) notes.push(`${row.baseName}: ${note}`);
  }

  console.log("OS-ondergrenzen tegen n-1 (bron: endoflife.date API v1, positioneel afgeleid)\n");
  printTable(rows);

  if (failures.length > 0) {
    console.error("");
    for (const f of failures) console.error(`  FOUT  endoflife.date/${f.product}: ${f.message}`);
    console.error("  Voor die platforms staat er een ? in de kolommen N-1 en AFSTAND.");
  }

  if (notes.length > 0) {
    console.log("");
    for (const note of notes) console.log(`  - ${note}`);
  }

  console.log("\nAfstand is een positie op de ladder, geen som. Bij Windows wordt eerst ontdubbeld op build");
  console.log("(elke feature-update staat er als -e en -w in) en alleen binnen dezelfde productlijn geteld.");
  console.log(`Een patchdatum heeft geen n-1 bij endoflife.date; daar is de basislijn de kalender — de eerste van`);
  console.log(`de maand, ${PATCH_MONTHS_BACK} maanden terug (nu ${patchBaseline()}).`);
  console.log("\nDit rapport blokkeert niets. SOORT zegt of een waarde mee omhoog mág: een capaciteitsvloer volgt");
  console.log("uit een andere policy in de baseline en mag niet meebewegen met n-1, hoe ver hij ook achterloopt;");
  console.log("een actualiteitsdoel mag dat wel. Verhogen blijft een besluit, dus een PR.");
}

// `process.exitCode` en niet `process.exit()`: dat laatste breekt de nog openstaande
// keep-alive sockets van `fetch` af terwijl libuv ze nog vasthoudt, en dat eindigt op Windows
// in een assertion (`!(handle->flags & UV_HANDLE_CLOSING)`) met exitcode 127 — precies de
// niet-nul die dit script nooit hoort te geven. Zo loopt de event loop gewoon leeg.
main()
  .catch((error) => {
    // Ook een onverwachte fout blijft exit 0: dit is een rapportage, geen poort.
    console.error(`check-osversion.js liep vast: ${error && error.stack ? error.stack : error}`);
  })
  .finally(() => {
    process.exitCode = 0;
  });
