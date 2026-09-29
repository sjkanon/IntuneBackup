/**
 * The generated documentation in three languages: Dutch (the source), English and French.
 *
 * Two kinds of text, two routes:
 *
 *   fixed text from a script     lives as { nl, en, fr } in that script itself, next to where
 *                                it is used — a separate key table would make you look up
 *                                what is actually written for every sentence.
 *   text from the data           `doel`, `note`, `faseWaarom` in _manifest.json, the titles and
 *                                explanations in _controls.json and _licenties.json. That stays
 *                                Dutch in the data; the translation lives in
 *                                IntuneTemplate/_i18n/<lang>.json, with the Dutch text as the
 *                                key.
 *
 * Keying on the Dutch text and not on policy + field is deliberate: if someone changes a
 * `doel`, the old translation no longer matches and drops out, instead of silently continuing
 * to translate a sentence that is no longer there. The text then appears in Dutch in the
 * English document and the script reports it as missing — visible, not wrong.
 *
 * `--missend` on generate-docs.js and generate-compliance.js prints those missing texts as
 * JSON, ready to be translated and put into _i18n/<lang>.json.
 */

const fs = require("fs");
const path = require("path");

const LANGS = ["nl", "en", "fr"];
const LANG_NAMES = { nl: "Nederlands", en: "English", fr: "Français" };
const I18N_DIR = path.resolve(__dirname, "..", "..", "IntuneTemplate", "_i18n");

/** `README.md` -> `README.en.md`; Nederlands houdt de naam zonder achtervoegsel. */
function variantPath(file, lang) {
  if (lang === "nl") return file;
  return file.replace(/\.md$/, `.${lang}.md`);
}

/** Een link naar een .md, eventueel met anker, naar de variant in dezelfde taal. */
function localizeLink(link, lang) {
  const [file, anchor] = link.split("#");
  if (!/\.md$/.test(file)) return link;
  return variantPath(file, lang) + (anchor !== undefined ? `#${anchor}` : "");
}

/** De taalbalk bovenaan elk document. `fileName` is de Nederlandse bestandsnaam, zonder map. */
function languageBar(fileName, lang) {
  return LANGS.map((l) => (l === lang ? `**${LANG_NAMES[l]}**` : `[${LANG_NAMES[l]}](${variantPath(fileName, l)})`)).join(" · ");
}

class Translator {
  constructor(lang) {
    this.lang = lang;
    this.missing = new Set();
    this.texts = {};
    if (lang !== "nl") {
      const file = path.join(I18N_DIR, `${lang}.json`);
      if (fs.existsSync(file)) this.texts = JSON.parse(fs.readFileSync(file, "utf8")).teksten || {};
    }
  }

  /** Vaste tekst: `{ nl, en, fr }` of een functie die er een teruggeeft. */
  t(variants) {
    const value = variants[this.lang];
    return value === undefined ? variants.nl : value;
  }

  /** Tekst uit de data: de vertaling uit _i18n/<taal>.json, of het Nederlands met een melding. */
  d(text) {
    if (this.lang === "nl" || text === undefined || text === null || text === "") return text;
    const hit = this.texts[text];
    if (typeof hit === "string") return hit;
    this.missing.add(text);
    return text;
  }

  link(target) {
    return localizeLink(target, this.lang);
  }
}

/**
 * Meldt de ontbrekende vertalingen na een run. Met `--missend` als JSON op stdout (per taal een
 * object met de Nederlandse tekst als sleutel en een lege waarde), anders als één regel per taal.
 */
function reportMissing(translators, argv, script) {
  const dump = argv.includes("--missend");
  const out = {};
  for (const tr of translators) {
    if (tr.lang === "nl" || tr.missing.size === 0) continue;
    if (dump) out[tr.lang] = Object.fromEntries([...tr.missing].map((m) => [m, ""]));
    else console.warn(`Let op: ${tr.missing.size} tekst(en) zonder vertaling in _i18n/${tr.lang}.json — die staan in het Nederlands in de ${tr.lang}-documenten. Lijst: node scripts/${script} --missend`);
  }
  if (dump) process.stdout.write(JSON.stringify(out, null, 2) + "\n");
}

module.exports = { LANGS, LANG_NAMES, variantPath, localizeLink, languageBar, Translator, reportMissing };
