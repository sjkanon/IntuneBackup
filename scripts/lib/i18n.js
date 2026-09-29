/**
 * De gegenereerde documentatie in drie talen: Nederlands (de bron), Engels en Frans.
 *
 * Twee soorten tekst, twee routes:
 *
 *   vaste tekst uit een script   staat als { nl, en, fr } in dat script zelf, naast de plek waar
 *                                hij gebruikt wordt — een aparte sleutelstabel zou je bij elke
 *                                zin laten zoeken wat er eigenlijk staat.
 *   tekst uit de data            `doel`, `note`, `faseWaarom` in _manifest.json, de titels en
 *                                toelichtingen in _controls.json en _licenties.json. Die blijft
 *                                Nederlands in de data; de vertaling staat in
 *                                IntuneTemplate/_i18n/<taal>.json, met de Nederlandse tekst als
 *                                sleutel.
 *
 * Sleutelen op de Nederlandse tekst en niet op policy + veld is bewust: wijzigt iemand een
 * `doel`, dan past de oude vertaling niet meer en valt hij weg in plaats van dat hij stilzwijgend
 * een zin blijft vertalen die er niet meer staat. De tekst komt dan in het Nederlands in het
 * Engelse document en het script meldt hem als ontbrekend — zichtbaar, niet fout.
 *
 * `--missend` bij generate-docs.js en generate-compliance.js drukt die ontbrekende teksten af als
 * JSON, klaar om te vertalen en in _i18n/<taal>.json te zetten.
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
