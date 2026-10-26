/**
 * Wat per organisatie verschilt — het naamvoorvoegsel, dat van de CA-policies en de plek van de
 * CA-repo — uit IntuneTemplate/_organisation.json. Geen script noemt een voorvoegsel letterlijk: zo
 * kan een kopie van deze repo met scripts/set-organisation.js een eigen voorvoegsel krijgen.
 */

const fs = require("fs");
const path = require("path");

const ORGANISATION_PATH = path.resolve(__dirname, "..", "..", "IntuneTemplate", "_organisation.json");

function readOrganisation(file = ORGANISATION_PATH) {
  const org = JSON.parse(fs.readFileSync(file, "utf8"));
  if (typeof org.prefix !== "string" || !org.prefix.endsWith(" - ")) {
    throw new Error(`${file}: "prefix" moet een tekst zijn die eindigt op " - " (nu: ${JSON.stringify(org.prefix)})`);
  }
  if (org.caPrefix != null && (typeof org.caPrefix !== "string" || !org.caPrefix.endsWith(" - "))) {
    throw new Error(`${file}: "caPrefix" moet een tekst zijn die eindigt op " - " (nu: ${JSON.stringify(org.caPrefix)})`);
  }
  return { prefix: org.prefix, caPrefix: org.caPrefix || null, caRepoUrl: org.caRepoUrl || null };
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * "CA - " -> "CA__", "CXNM - STANDARD - " -> "CXNM__STANDARD__": de vorm in de bestandsnaam van een
 * CA-template. Dezelfde regel als filePrefixOf in de CA-Policies-repo, die de bestanden zo noemt.
 */
const caFileForm = (caPrefix) =>
  caPrefix.split(" - ").filter(Boolean).map((part) => part.trim().replace(/\s+/g, "_")).join("__") + "__";

/**
 * Een CA-naam herken je aan het voorvoegsel met een nummer van vier cijfers erachter, in de
 * weergavevorm (`CA - 1090 - BLOCK - …`) en in de bestandsvorm (`CA__1090__BLOCK__…`). Zonder
 * dat nummer zou het voorvoegsel ook gewone tekst raken.
 */
const caNamePatterns = (caPrefix) => [
  { re: new RegExp(`${escapeRegExp(caPrefix)}(?=\\d{4} - )`, "g"), form: (p) => p },
  { re: new RegExp(`${escapeRegExp(caFileForm(caPrefix))}(?=\\d{4}__)`, "g"), form: caFileForm },
];

const { prefix: PREFIX, caRepoUrl: CA_REPO_URL } = readOrganisation();

/** `<prefix>PLATFORM - D/U - Item`; groep 1 is het platform, 2 de scope, 3 het item. */
const DISPLAY_NAME_RE = new RegExp(`^${escapeRegExp(PREFIX)}(WIN|MAC|IOS|AND) - ([DU]) - (.+)$`);

/** De naam zonder voorvoegsel, voor tabellen waar het voorvoegsel alleen ruis is. */
const stripPrefix = (name) => (name.startsWith(PREFIX) ? name.slice(PREFIX.length) : name);

module.exports = { ORGANISATION_PATH, PREFIX, CA_REPO_URL, DISPLAY_NAME_RE, stripPrefix, readOrganisation, escapeRegExp, caFileForm, caNamePatterns };
