<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - AI Usage Control Permitted

Houdt de Edge-blokkeerlijst voor de Store-website in stand, maar laat de AI-diensten er uitdrukkelijk buiten.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-149-UAIUsageControlPermitted` |
| Bron | Tegenhanger van de Restricted-variant: dezelfde blokkeerlijst zonder de AI-domeinen |
| Bestand | [`Baseline_WIN_U_AI_Usage_Control_Permitted.json`](Baseline_WIN_U_AI_Usage_Control_Permitted.json) |

> **Alternatief van [Baseline] - WIN - U - AI Usage Control Restricted.** Een URL-blokkeerlijst is sowieso frictie en geen grens: hij werkt niet op een telefoon en niet op een privéapparaat. Wie AI-gebruik echt wil sturen doet dat met de categorie Generative AI in Defender Web Content Filtering — dat staat in het Defender-portaal, niet in deze repo.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc` | https://apps.microsoft.com, https://apps.microsoft.com/*, apps.microsoft.com, apps.microsoft.com/* |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
