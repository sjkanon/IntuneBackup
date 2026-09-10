<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Outlook Cached Mode Default

Zet alleen Cached Exchange Mode aan en laat de rest op de standaard van Outlook staan — gedeelde mappen worden dus wél meegecachet.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-159-UMicrosoftOutlookCachedModeDefault` |
| Bron | eigen baseline |
| Bestand | [`Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.json`](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.json) |

> De lichtste van de drie varianten: één instelling, geen uitspraak over gedeelde mappen. Past waar gebruikers offline in een gedeelde mailbox moeten kunnen werken en de schijfruimte geen probleem is. Geldt alleen voor klassieke Outlook (de Win32-app uit Microsoft 365 Apps); het nieuwe Outlook voor Windows leest deze ADMX-instellingen niet en heeft geen OST. De bekende schuif **hoeveelheid e-mail offline bewaren** (3 maanden / 12 maanden / alles, registerwaarde `SyncWindowSetting`) zit *niet* in de settings catalog: de ingeste `outlk16v2`-ADMX kent onder *Cached Exchange Mode* achttien instellingen en die schuif is er geen van. Wie die wil zetten, kan dat alleen via een eigen ADMX-import of de Office Cloud Policy Service — buiten deze baseline dus.

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_configurecachedexchangemode` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
