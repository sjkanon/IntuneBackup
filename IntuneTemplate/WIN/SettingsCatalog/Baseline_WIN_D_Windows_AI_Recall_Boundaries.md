<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows AI Recall Boundaries

Begrenst Recall wanneer die is toegestaan: geen momentopnamen van de beheerportalen en de wachtwoordkluis, hoogstens 30 dagen bewaren, hoogstens 10 GB, en gebruikers kunnen hun Recall-gegevens niet exporteren.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-150-DWindowsAIRecallBoundaries` |
| Bron | Policy CSP WindowsAI (SetDenyAppListForRecall, SetDenyUriListForRecall, SetMaximumStorageDurationForRecallSnapshots, SetMaximumStorageSpaceForRecallSnapshots, AllowRecallExport); waarden geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_WIN_D_Windows_AI_Recall_Boundaries.json`](Baseline_WIN_D_Windows_AI_Recall_Boundaries.json) |

> **De app-lijst is bewust onvolledig.** Wat erin staat is wat overal verdedigbaar is — een RDP-sessie toont het scherm van een ander systeem, een wachtwoordkluis toont wachtwoorden. Vul aan met de programma's die in deze omgeving gevoelige gegevens tonen: het HR-pakket, het dossiersysteem, de bankomgeving. Namen mogen een uitvoerbaar bestand zijn (`app.exe`) of een AUMID voor Store-apps. Let op dat de bewaartermijn van 30 dagen niets zegt over verwijderingsplichten: staat er een persoonsgegeven in de index, dan valt die index onder dezelfde regels als de bron. Exporteren staat standaard al uit; het staat hier expliciet zodat het een besluit is en geen toevalligheid.

## Instellingen — 5

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_windowsai_setdenyapplistforrecall` | mstsc.exe, KeePass.exe, KeePassXC.exe, 1Password.exe, Bitwarden.exe |
| `device_vendor_msft_policy_config_windowsai_setdenyurilistforrecall` | https://login.microsoftonline.com, https://entra.microsoft.com, https://portal.azure.com, https://admin.microsoft.com, https://intune.microsoft.com, https://security.microsoft.com, https://compliance.microsoft.com, https://myaccount.microsoft.com, https://mysignins.microsoft.com |
| `device_vendor_msft_policy_config_windowsai_setmaximumstoragedurationforrecallsnapshots` | 30 |
| `device_vendor_msft_policy_config_windowsai_setmaximumstoragespaceforrecallsnapshots_v2` | device_vendor_msft_policy_config_windowsai_setmaximumstoragespaceforrecallsnapshots_10240 |
| `device_vendor_msft_policy_config_windowsai_allowrecallexport` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
