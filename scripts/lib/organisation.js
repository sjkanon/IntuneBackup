/**
 * Wat per organisatie verschilt — het naamvoorvoegsel en de plek van de CA-repo — uit
 * IntuneTemplate/_organisation.json. Geen script noemt het voorvoegsel letterlijk: zo kan een
 * kopie van deze repo met scripts/set-organisation.js een eigen voorvoegsel krijgen.
 */

const fs = require("fs");
const path = require("path");

const ORGANISATION_PATH = path.resolve(__dirname, "..", "..", "IntuneTemplate", "_organisation.json");

function readOrganisation(file = ORGANISATION_PATH) {
  const org = JSON.parse(fs.readFileSync(file, "utf8"));
  if (typeof org.prefix !== "string" || !org.prefix.endsWith(" - ")) {
    throw new Error(`${file}: "prefix" moet een tekst zijn die eindigt op " - " (nu: ${JSON.stringify(org.prefix)})`);
  }
  return { prefix: org.prefix, caRepoUrl: org.caRepoUrl || null };
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const { prefix: PREFIX, caRepoUrl: CA_REPO_URL } = readOrganisation();

/** `<prefix>PLATFORM - D/U - Item`; groep 1 is het platform, 2 de scope, 3 het item. */
const DISPLAY_NAME_RE = new RegExp(`^${escapeRegExp(PREFIX)}(WIN|MAC|IOS|AND) - ([DU]) - (.+)$`);

/** De naam zonder voorvoegsel, voor tabellen waar het voorvoegsel alleen ruis is. */
const stripPrefix = (name) => (name.startsWith(PREFIX) ? name.slice(PREFIX.length) : name);

module.exports = { ORGANISATION_PATH, PREFIX, CA_REPO_URL, DISPLAY_NAME_RE, stripPrefix, readOrganisation, escapeRegExp };
