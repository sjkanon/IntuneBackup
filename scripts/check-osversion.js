#!/usr/bin/env node
/**
 * Reports how far the OS minimums in IntuneTemplate/ lag behind the n-1 version of each
 * platform, using endoflife.date as the source.
 *
 * **Exit code always 0.** This is a report, not a gate. `check-scope.js` blocks because a
 * scope error is *wrong*; an outdated minimum is a decision waiting to be made. If this script
 * failed CI, someone would bump the number to get the build green — and that is exactly the
 * decision a human is supposed to make. A value in this repo is not always a currency target:
 * WIN 10.0.22621 and MAC 14.0 are *capability floors* that follow from other policies in the
 * baseline (Account Lockout, Administrator Protection, declarative update policy), and they
 * must not move along with n-1. IOS 16.0 and AND 12.0 are OIB convention and therefore *are*
 * candidates. This script does not say which of the two a value is; it only shows the gap.
 *
 * Three things that do not come out right by themselves when deriving n-1, all three measured:
 *
 *  1. **Windows is listed twice.** Every feature update has an `-e` cycle
 *     (Enterprise/Education) and a `-w` cycle (consumer): same build, different end date.
 *     Positions 0 and 1 are therefore the same release and "n-1" yields **n**. So the list is
 *     first deduplicated on the build (`latest.name`).
 *  2. **Android has no `latest`.** All cycles have `latest: null`; there `cycle` is the only
 *     usable value. For Windows, on the contrary, only `latest` is.
 *  3. **Apple counts in years.** iOS went from 18 to 26, macOS from 15 to 26. *Computing* n-1
 *     gives 25, which does not exist — n-1 is a *position* in the list, never a subtraction.
 *
 * The API is v1, not the flat v0 array that circulates here and there: v1 has an explicit
 * `schema_version`, and that is the only hook this script has to notice *that* the source has
 * changed shape instead of silently deriving something wrong from it. If it does not start
 * with "1.", no n-1 is reported for that platform.
 *
 * Which files count follows from the **field**, not from the file name: for iOS and Android
 * there is no separate OS Version policy and the minimum lives in Device Health. The platform
 * follows from the platform word in `@odata.type`, not from a fixed list of type names —
 * there are four Android compliance types and a customer tenant can have any of them.
 *
 * Usage:
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

/** "11-24h2-e", "11-24h2-w", "11-24h2-e-lts", "11-24h2-iot-lts" -> allemaal "11-24h2". */
function featureUpdateOf(cycle) {
  return String(cycle).replace(/-(e|w|iot)?-?lts$/, "").replace(/-(e|w)$/, "");
}

/**
 * De twee aannames onder deze afleiding, bij elke run opnieuw getoetst in plaats van
 * aangenomen. Ze zijn allebei afgeleid uit één momentopname van endoflife.date (2026-09-04)
 * en kunnen dus verlopen zonder dat iemand het merkt — en dan geeft dit script niet een fout
 * maar een verkeerd getal, wat erger is.
 *
 *  1. **Ontdubbelen op build klopt alleen als (E) en (W) dezelfde build dragen.** Zo staat het
 *     er vandaag: dezelfde feature-update, twee cycli, één `latest`, andere einddatum. Gaan ze
 *     ooit uiteenlopen, dan levert het ontdubbelen twee sporten voor één feature-update op en
 *     is n-1 weer n — precies de fout die de ontdubbeling moest wegnemen.
 *  2. **n-1 is sport 1, dus de lijst moet aflopend zijn.** De API levert nieuwste eerst; is
 *     dat niet meer zo, dan is "positie 1" niet meer n-1 en klopt de hele tabel niet.
 *
 * Toetst bewust alleen de top van de ladder: daar hangt n-1 vanaf. Verder terug staan er
 * cycli met een eigen ritme (LTSC, IoT) waar "aflopend" niets meer betekent.
 */
function ladderWarnings(platform, releases, ladder) {
  const warnings = [];

  if (platform === "WIN") {
    const buildsPerUpdate = new Map();
    for (const r of releases) {
      const build = r.latest && r.latest.name;
      if (!build) continue;
      const key = featureUpdateOf(r.name);
      if (!buildsPerUpdate.has(key)) buildsPerUpdate.set(key, new Set());
      buildsPerUpdate.get(key).add(build);
    }
    for (const [update, builds] of buildsPerUpdate) {
      if (builds.size > 1) {
        warnings.push(`feature-update ${update} draagt meer dan één build (${[...builds].join(", ")}) — ontdubbelen op build klopt hier niet meer, n-1 kan een editie te hoog uitvallen`);
      }
    }
  }

  const [first, second] = ladder;
  if (first && second) {
    const rank = (entry) => (platform === "WIN" ? Number(String(entry.key).split(".").pop()) : parseFloat(entry.key));
    const a = rank(first);
    const b = rank(second);
    if (Number.isFinite(a) && Number.isFinite(b) && a <= b) {
      warnings.push(`de lijst staat niet nieuwste-eerst (${first.key} vóór ${second.key}) — n-1 is dan niet sport 1 en de afstanden kloppen niet`);
    }
  }
  return warnings;
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
  const aannames = [];
  await Promise.all(
    needed.map(async (product) => {
      const platform = PRODUCTS.find((p) => p.product === product).platform;
      try {
        const releases = await fetchReleases(product);
        const ladder = buildLadder(platform, releases);
        for (const w of ladderWarnings(platform, releases, ladder)) aannames.push({ product, message: w });
        ladders.set(product, ladder);
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

  if (aannames.length > 0) {
    console.error("");
    for (const a of aannames) console.error(`  LET OP  endoflife.date/${a.product}: ${a.message}`);
    console.error("  De afleiding staat nog, maar de aanname eronder niet meer — controleer de n-1 met de hand");
    console.error("  voordat je een waarde verhoogt, en pas buildLadder() aan.");
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
