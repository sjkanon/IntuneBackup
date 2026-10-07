#!/usr/bin/env node
/**
 * Mirrors this repo to a second clone — the same content, its own history.
 *
 * Intended for a clone that pushes to a *different* remote than `origin` (an internal copy
 * next to the public repo). A mirror via `git push --force` would overwrite the history on
 * that side; this script only brings the *files* in line and makes a regular commit of that.
 * The target clone thus keeps its own log, its own workflow runs and its own branches.
 *
 * What goes along is exactly what is in git here — `git ls-files`, so not what `.gitignore`
 * keeps out. That is the whole point: `local/` contains deployment copies *with* secrets, and
 * a mirror that copies from disk instead of from the index would carry those to a second
 * remote. Files that are *gone* here are removed there too — but only if they are in git on
 * the other side; whatever was created locally there is left alone. Files that someone committed
 * on the other side (not in a mirror commit) and that never existed here — a colleague's CIPP
 * "Save", say — are kept and listed with `=`; remove those there by hand if they should go.
 *
 * The target clone is not pushed without `--push`, and the source working tree does not have
 * to be clean — but a mirror of uncommitted changes is a mirror of something that can still
 * change here, so it warns about that.
 *
 * The target keeps its own organisation: if its IntuneTemplate/_organisation.json has a different
 * prefix or CA URL than here, set-organisation.js runs there after copying, so the mirror gets the
 * content from here under its own names. `--prefix` and `--ca-url` set (or change) that the first
 * time; after that it is in the target's own _organisation.json.
 *
 * Usage:
 *   node scripts/sync-mirror.js <target-dir>              # copy and commit
 *   node scripts/sync-mirror.js <target-dir> --dry-run    # only show what would happen
 *   node scripts/sync-mirror.js <target-dir> --push       # and push the target clone
 *   node scripts/sync-mirror.js <target-dir> --message "…"
 *   node scripts/sync-mirror.js <target-dir> --prefix "Contoso - " --ca-url https://…/blob/main/
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");
const ORGANISATION_REL = "IntuneTemplate/_organisation.json";

function git(cwd, args) {
  return execFileSync("git", ["-C", cwd, ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

/** Wat er in git zit, als relatieve paden met `/`. `-z` omdat bestandsnamen spaties hebben. */
function trackedFiles(repo) {
  return git(repo, ["ls-files", "-z"]).split("\0").filter(Boolean);
}

function parseArgs(argv) {
  const opts = { target: null, dryRun: false, push: false, message: null, prefix: undefined, caUrl: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--push") opts.push = true;
    else if (arg === "--message") opts.message = argv[++i];
    else if (arg === "--prefix") opts.prefix = argv[++i];
    else if (arg === "--ca-url") opts.caUrl = argv[++i];
    else if (arg === "--no-ca-url") opts.caUrl = null;
    else if (arg.startsWith("--")) {
      console.error(`Onbekende optie: ${arg}`);
      process.exit(2);
    } else if (opts.target === null) opts.target = arg;
    else {
      console.error(`Te veel argumenten: ${arg}`);
      process.exit(2);
    }
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

if (!opts.target) {
  console.error("Gebruik: node scripts/sync-mirror.js <doelmap> [--dry-run] [--push] [--message \"…\"]");
  process.exit(2);
}

const targetRoot = path.resolve(opts.target);

if (!fs.existsSync(path.join(targetRoot, ".git"))) {
  console.error(`Geen git-clone op ${targetRoot}.`);
  process.exit(1);
}
if (path.resolve(targetRoot) === REPO_ROOT) {
  console.error("Doelmap is deze repo zelf.");
  process.exit(1);
}

const dirty = git(REPO_ROOT, ["status", "--porcelain"]).trim();
if (dirty) {
  console.warn("Let op: de werkmap hier is niet schoon. De spiegel krijgt de huidige bestanden,");
  console.warn("ook wat nog niet gecommit is.\n");
}

/** prefix en caRepoUrl van een clone, of null als die nog geen _organisation.json heeft. */
function organisationOf(root) {
  const file = path.join(root, ORGANISATION_REL);
  if (!fs.existsSync(file)) return null;
  const org = JSON.parse(fs.readFileSync(file, "utf8"));
  return { prefix: org.prefix, caRepoUrl: org.caRepoUrl || null };
}

// Vóór het kopiëren lezen: daarna staat er de versie van hier.
const sourceOrg = organisationOf(REPO_ROOT);
const targetOrg = organisationOf(targetRoot) || sourceOrg;
const wantedOrg = {
  prefix: opts.prefix ?? targetOrg.prefix,
  caRepoUrl: opts.caUrl === undefined ? targetOrg.caRepoUrl : opts.caUrl,
};
const convert = wantedOrg.prefix !== sourceOrg.prefix || wantedOrg.caRepoUrl !== sourceOrg.caRepoUrl;
if (convert) {
  console.log(`De spiegel houdt voorvoegsel "${wantedOrg.prefix}" en CA-URL ${wantedOrg.caRepoUrl || "(geen)"};`);
  console.log("de lijst hieronder is vóór die omzetting, dus ruimer dan wat er uiteindelijk verandert.\n");
}

const source = trackedFiles(REPO_ROOT);
const sourceSet = new Set(source);
const target = trackedFiles(targetRoot);

const added = [];
const changed = [];
for (const rel of source) {
  const from = path.join(REPO_ROOT, rel);
  const to = path.join(targetRoot, rel);
  if (!fs.existsSync(to)) {
    added.push(rel);
  } else if (!fs.readFileSync(from).equals(fs.readFileSync(to))) {
    changed.push(rel);
  } else {
    continue;
  }
  if (!opts.dryRun) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
  }
}

/**
 * Bestanden die de doelclone zelf heeft toegevoegd: het laatste toevoegen gebeurde niet in een
 * spiegelcommit, en hier heeft het pad nooit in git gestaan. Dat is werk van daar — een CIPP-"Save"
 * van een collega — en dat haalt de spiegel niet weg. Wat hier ooit bestond en hier verdwenen is,
 * gaat daar wel weg, ook als iemand het daar ooit met de hand toevoegde.
 */
function foreignFiles(candidates) {
  if (!candidates.length) return new Set();
  const everHere = new Set(git(REPO_ROOT, ["log", "--all", "--format=", "--name-only", "-z"]).split(/[\0\n]/).filter(Boolean));
  const addedBy = new Map();
  let subject = null;
  // Nieuwste eerst: de eerste keer dat een pad langskomt, is de laatste keer dat het werd toegevoegd.
  for (const line of git(targetRoot, ["log", "--diff-filter=A", "--format=%x01%s", "--name-only"]).split("\n")) {
    if (line.startsWith("\x01")) subject = line.slice(1);
    else if (line && !addedBy.has(line)) addedBy.set(line, subject);
  }
  return new Set(
    candidates.filter((rel) => !everHere.has(rel) && addedBy.has(rel) && !addedBy.get(rel).startsWith("Spiegel van ")),
  );
}

const missingHere = target.filter((rel) => !sourceSet.has(rel));
const foreign = foreignFiles(missingHere);
const removed = missingHere.filter((rel) => !foreign.has(rel));
for (const rel of removed) {
  const victim = path.join(targetRoot, rel);
  if (opts.dryRun || !fs.existsSync(victim)) continue;
  fs.rmSync(victim);
  // Mappen bestaan in git niet los van hun inhoud; een leeggelopen map laten staan is rommel.
  let dir = path.dirname(victim);
  while (dir !== targetRoot && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    fs.rmdirSync(dir);
    dir = path.dirname(dir);
  }
}

for (const rel of added) console.log(`+ ${rel}`);
for (const rel of changed) console.log(`~ ${rel}`);
for (const rel of removed) console.log(`- ${rel}`);
for (const rel of foreign) console.log(`= ${rel}  (alleen daar, door iemand daar toegevoegd: blijft staan)`);

const total = added.length + changed.length + removed.length;
console.log(
  `\n${source.length} bestanden in git hier; ${added.length} toegevoegd, ` +
    `${changed.length} gewijzigd, ${removed.length} verwijderd in ${targetRoot}.`
);

if (opts.dryRun) {
  console.log("Dry run — er is niets geschreven.");
  process.exit(0);
}
if (total === 0) {
  console.log("De spiegel liep al gelijk.");
  process.exit(0);
}

if (convert) {
  const args = [path.join(targetRoot, "scripts", "set-organisation.js"), "--prefix", wantedOrg.prefix];
  if (wantedOrg.caRepoUrl) args.push("--ca-url", wantedOrg.caRepoUrl);
  else args.push("--no-ca-url");
  // Wat alleen daar staat, heeft het voorvoegsel van daar al; set-organisation zou daarop weigeren.
  for (const rel of foreign) args.push("--leave", rel);
  console.log("\nOmzetten naar de organisatie van de spiegel (set-organisation.js daar):");
  execFileSync(process.execPath, args, { cwd: targetRoot, stdio: ["ignore", "ignore", "inherit"] });
  const left = git(targetRoot, ["status", "--porcelain"]).trim();
  console.log(left ? `${left.split("\n").length} wijziging(en) over na de omzetting.` : "Na de omzetting is er niets meer anders.");
}

const head = git(REPO_ROOT, ["rev-parse", "--short", "HEAD"]).trim();
const subject = git(REPO_ROOT, ["log", "-1", "--format=%s"]).trim();
const message = opts.message || `Spiegel van ${path.basename(REPO_ROOT)} ${head}\n\n${subject}`;

git(targetRoot, ["add", "-A"]);
if (!git(targetRoot, ["status", "--porcelain"]).trim()) {
  // Kan: alleen bestanden die daar toch al genegeerd werden.
  console.log("Niets te committen in de doelclone.");
  process.exit(0);
}
git(targetRoot, ["commit", "-m", message]);
console.log(`Gecommit in ${targetRoot}: ${git(targetRoot, ["log", "-1", "--format=%h %s"]).trim()}`);

if (opts.push) {
  process.stdout.write(git(targetRoot, ["push"]));
  console.log("Gepusht.");
} else {
  console.log("Nog niet gepusht — draai met --push, of push daar zelf.");
}
