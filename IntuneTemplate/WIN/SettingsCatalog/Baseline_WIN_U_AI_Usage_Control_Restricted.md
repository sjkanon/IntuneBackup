<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - AI Usage Control Restricted

Blokkeert in Edge de AI-diensten die het beleid niet heeft goedgekeurd. Microsoft Copilot blijft uitdrukkelijk bereikbaar.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-139-UAIUsageControl` |
| Bron | ISO/IEC 27001:2022 A.5.10, A.5.19 en A.8.1, NIS2 art. 21(2)(d) — mechanisme uit de bestaande Edge-policy |
| Bestand | [`Baseline_WIN_U_AI_Usage_Control_Restricted.json`](Baseline_WIN_U_AI_Usage_Control_Restricted.json) |

> ISMP22 verbiedt alle AI-tools behalve Microsoft Copilot, Copilot Pro en GitHub Copilot voor ontwikkelaars; op dit moment houdt niets een gebruiker tegen. LET OP bij uitrol: [Baseline] - WIN - U - Microsoft Edge User Experience zet dezelfde blokkeerlijst. Twee toegewezen policies met een verschillende lijst leveren een conflict op, waarna Intune er géén toepast. Neem deze lijst dus over in die policy, of haal 'm daar weg — niet allebei toewijzen. De vier bestaande regels voor de Store-website staan hier al in, zodat deze lijst compleet is. Een URL-blokkeerlijst is bovendien frictie, geen grens: hij werkt niet op een telefoon en niet op een privéapparaat. De robuustere variant is de categorie Generative AI in Defender Web Content Filtering; dat staat in het Defender-portaal, niet in deze repo. **Alternatief van [Baseline] - WIN - U - AI Usage Control Permitted**, die dezelfde blokkeerlijst zet zónder de AI-diensten. Allebei toewijzen levert een Conflict op, en dan wordt er niets geblokkeerd — ook de Store-regels niet.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_urlblocklist_urlblocklistdesc` | https://apps.microsoft.com, https://apps.microsoft.com/*, apps.microsoft.com, apps.microsoft.com/*, chatgpt.com, chat.openai.com, gemini.google.com, claude.ai, perplexity.ai, chat.deepseek.com, chat.mistral.ai, grok.com, poe.com, character.ai |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
