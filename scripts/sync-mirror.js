#!/usr/bin/env node
/**
 * Spiegelt deze repo naar een tweede clone — dezelfde inhoud, een eigen geschiedenis.
 *
 * Bedoeld voor een clone die naar een ándere remote pusht dan `origin` (een interne kopie
 * naast de publieke repo). Een spiegel via `git push --force` zou de geschiedenis van die
 * kant overschrijven; dit script zet alleen de bestánden gelijk en maakt daar een gewone
 * commit van. De doelclone houdt zo zijn eigen log, zijn eigen workflowruns en zijn eigen
 * branches.
 *
 * Wat meegaat is precies wat hier in git zit — `git ls-files`, dus niet wat `.gitignore`
 * buiten de deur houdt. Dat is het hele punt: `local/` bevat uitrolkopieën mét geheimen, en
 * een spiegel die van de schijf kopieert in plaats van uit de index zou die meenemen naar een
 * tweede remote. Bestanden die hier wég zijn, gaan daar ook weg — maar alleen als ze aan de
 * andere kant in git staan; wat daar lokaal is aangemaakt blijft met rust.
 *
 * De doelclone wordt niet gepusht zonder `--push`, en de werkmap van de bron hoeft niet schoon
 * te zijn — maar een spiegel van ongecommitte wijzigingen is een spiegel van iets dat hier nog
 * kan veranderen, dus daar waarschuwt hij voor.
 *
 * Gebruik:
 *   node scripts/sync-mirror.js <doelmap>              # kopieer en commit
 *   node scripts/sync-mirror.js <doelmap> --dry-run    # laat alleen zien wat er zou gebeuren
 *   node scripts/sync-mirror.js <doelmap> --push       # en push de doelclone
 *   node scripts/sync-mirror.js <doelmap> --message "…"
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const REPO_ROOT = path.resolve(__dirname, "..");

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
  const opts = { target: null, dryRun: false, push: false, message: null };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--push") opts.push = true;
    else if (arg === "--message") opts.message = argv[++i];
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

const removed = target.filter((rel) => !sourceSet.has(rel));
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

const head = git(REPO_ROOT, ["rev-parse", "--short", "HEAD"]).trim();
const subject = git(REPO_ROOT, ["log", "-1", "--format=%s"]).trim();
const message = opts.message || `Spiegel van IntuneBackup ${head}\n\n${subject}`;

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
