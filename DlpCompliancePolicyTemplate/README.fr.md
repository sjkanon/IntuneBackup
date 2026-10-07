[Nederlands](README.md) · [English](README.en.md) · **Français**

# DlpCompliancePolicyTemplate/

**Templates DLP** CIPP : la prévention des pertes de données Microsoft Purview pour Exchange,
SharePoint et OneDrive. Déployés par la baseline [`Purview-DLP.json`](../BaselineTemplate/README.fr.md#purview-dlpjson--fuites-de-données).

| Fichier | Stratégie | Stage |
|---|---|---|
| [`DLP_Personal_Data_NL_Notify.json`](DLP_Personal_Data_NL_Notify.json) | `[Baseline] - DLP - Personal Data NL - Notify` | 1 · Melden |
| [`DLP_Personal_Data_BE_Notify.json`](DLP_Personal_Data_BE_Notify.json) | `[Baseline] - DLP - Personal Data BE - Notify` | 1 · Melden |
| [`DLP_Financial_Notify.json`](DLP_Financial_Notify.json) | `[Baseline] - DLP - Financial - Notify` | 1 · Melden |
| [`DLP_Personal_Data_NL_Block.json`](DLP_Personal_Data_NL_Block.json) | `[Baseline] - DLP - Personal Data NL - Block` | 2 · Blokkeren |
| [`DLP_Personal_Data_BE_Block.json`](DLP_Personal_Data_BE_Block.json) | `[Baseline] - DLP - Personal Data BE - Block` | 2 · Blokkeren |
| [`DLP_Financial_Block.json`](DLP_Financial_Block.json) | `[Baseline] - DLP - Financial - Block` | 2 · Blokkeren |

Chaque fichier est une ligne de table CIPP (`PartitionKey: DlpCompliancePolicyTemplate`), générée
par [`scripts/generate-dlp-templates.js`](../scripts/generate-dlp-templates.js) à partir de
[`scripts/lib/purview-dlp.js`](../scripts/lib/purview-dlp.js). Les modifications se font là, pas ici.

## Contenu et origine

| Type d'informations sensibles | Confiance | « Quelques » | « En masse » |
|---|---|---|---|
| Netherlands Citizen's Service (BSN) Number | High | 1–4 | 5+ |
| Netherlands Passport Number | Medium | 1–9 | 10+ |
| Netherlands Driver's License Number | Medium | 1–9 | 10+ |
| Netherlands Tax Identification Number | High | 1–9 | 10+ |
| Belgium National Number | Medium | 1–4 | 5+ |
| Belgium Passport Number | Medium | 1–9 | 10+ |
| Belgium Driver's License Number | Medium | 1–9 | 10+ |
| Credit Card Number | High | 1–9 | 10+ |
| EU Debit Card Number | High | 1–9 | 10+ |
| International Banking Account Number (IBAN) | High | — | 20+ |

- **La structure de Microsoft.** Chaque template financier ou de confidentialité intégré à Purview
  a une règle pour 1 à 9 correspondances (notifier) et une pour 10+ (bloquer et signaler), toutes
  deux sur « partagé hors de l'organisation ». Il n'existe pas de template néerlandais ni belge ; ces
  types ne figurent que dans *GDPR Enhanced*, avec 27 types d'adresses européennes et des
  classifieurs entraînables — bien trop de bruit pour une petite entreprise.
- **`maxcount -1` au lieu des 500 de Microsoft**, comme dans
  [kingsrule50/m365-purview-data-protection](https://github.com/kingsrule50/m365-purview-data-protection) :
  sinon un fichier contenant 501 numéros de carte échappe à la règle de masse.
- **La confiance selon la définition de chaque type.** Un BSN n'est reconnu qu'avec sa somme de
  contrôle *et* un mot-clé comme *bsn* ou *burgerservicenummer* ; le passeport et le permis de
  conduire atteignent au plus Medium, High ne se déclencherait donc jamais. Un IBAN est High sur
  sa seule somme de contrôle — chaque facture en porte un — il ne compte donc qu'en masse (un
  export de paie ou SEPA). Le numéro de TVA (et le numéro d'entreprise belge) est volontairement
  absent : il figure par la loi sur chaque facture.
- **Les trois types belges atteignent au plus Medium.** Le numéro de registre national n'est
  Medium qu'avec sa somme de contrôle *et* un mot-clé (*identiteitskaart*, *numéro national*,
  *carte d'identité* …) ; la somme de contrôle seule donne Low, trop lâche pour un numéro qui
  commence par une date de naissance. Attention : *rijksregisternummer* ne figure pas
  dans la liste de mots-clés de Microsoft ; un document flamand qui n'utilise que ce mot n'est donc
  pas reconnu.
- **Le BSN compte en masse dès 5** : l'autorité néerlandaise de protection des données traite le
  BSN plus strictement que les autres numéros. Le **numéro de registre national** belge reçoit le
  même seuil : en Belgique, c'est aussi le numéro fiscal et de sécurité sociale, celui qui ouvre tout.
- **Les conseils belges sont bilingues** (nl / fr) : les tenants belges comptent les deux groupes
  linguistiques. Les conseils Financial sont uniquement en néerlandais.

Introuvable : un dépôt public, d'un MVP ou d'un autre, qui déploie la DLP avec des types
néerlandais ou belges. La structure vient de Microsoft, les seuils sont justifiés ci-dessus.

## Déploiement séparé

1. CIPP → **Tools → Community Repos** → ce dépôt → le fichier → **Import** (ou la synchronisation
   habituelle des templates : ces fichiers portent une `RowKey` et sont écrits directement).
2. **Security → Compliance → DLP Templates** → le template → **Deploy**.

Un tenant sans la baseline peut donc ne recevoir que les stratégies Notify.
