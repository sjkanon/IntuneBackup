<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - AND - U - Corporate AI Restricted

Voorkomt op fully managed en corporate-owned Android-toestellen dat scherminhoud naar een assistent-app gaat (zoals Gemini of Circle to Search) en dat apps functies aan AI-agenten aanbieden.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-179-ANDUCorporateAIRestricted` |
| Bron | UniFy Android Enterprise Baseline v1.5.1 — AND - SC - DR - DEV - General-Settings (assistcontentpolicy) en Applications (appfunctions), Fully-Managed en Corp-Work-Profile - v1.5 |
| Bestand | [`Baseline_AND_U_Corporate_AI_Restricted.json`](Baseline_AND_U_Corporate_AI_Restricted.json) |

> **Bewust geen Permitted-tegenhanger** zoals bij Windows AI: voor `assistcontentpolicy` betekent `_false` "Intune verandert niets" en niet "expliciet toegestaan", dus een Permitted-variant zou geen besluit vastleggen. Wie de assistenten toestaat, wijst deze policy gewoon niet toe. Microsoft 365 Copilot binnen de Microsoft-apps valt hier niet onder; die volgt App Protection. Op toestellen onder Android 16 doet `appfunctions` niets.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Aanvaardbaar gebruik<br>A.5.34 Privacy en bescherming van persoonsgegevens<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 3.13 Deploy a Data Loss Prevention Solution |
| NIST CSF 2.0 | PR.DS-10 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.android.devicerestrictionpolicy.assistcontentpolicy` | true |
| `com.android.devicerestrictionpolicy.appfunctions` | true |

---

Terug naar het [Android-overzicht](../README.md) · [hoofd-README](../../../README.md)
