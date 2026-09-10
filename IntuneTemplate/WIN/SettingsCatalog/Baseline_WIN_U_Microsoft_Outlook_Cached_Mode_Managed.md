<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Outlook Cached Mode Managed

Zet Cached Exchange Mode aan voor de eigen mailbox en houdt alles wat gedeeld is erbuiten: gedeelde mailmappen, gedeelde agenda's en Public Folder Favorites worden niet naar het OST-bestand gekopieerd.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-160-UMicrosoftOutlookCachedModeManaged` |
| Bron | eigen baseline |
| Bestand | [`Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.json`](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.json) |

> Eén van drie varianten op dezelfde as — wijs er één toe, nooit twee: deze, Cached Mode Default (alleen cached mode aan) of Cached Mode Off (Online mode). De eigen mailbox wordt gecachet, zodat Outlook offline werkt en zoeken lokaal gaat. Wat eraan gedeeld hangt niet: een gedeelde mailbox die aan het profiel wordt toegevoegd is de belangrijkste oorzaak van OST-bestanden van tientallen gigabytes, en online lezen is daar geen praktisch verlies. Let op de polariteit van de twee gedeelde-map-instellingen, die tegen elkaar in loopt: *Disable shared mail folder caching* op **Enabled** schrijft `cacheothersmail=0`, en *Download shared non-mail folders* op **Disabled** schrijft `downloadsharedfolders=0`. Beide nullen betekenen niet cachen. Geldt alleen voor klassieke Outlook (de Win32-app uit Microsoft 365 Apps); het nieuwe Outlook voor Windows leest deze ADMX-instellingen niet en heeft geen OST. De bekende schuif **hoeveelheid e-mail offline bewaren** (3 maanden / 12 maanden / alles, registerwaarde `SyncWindowSetting`) zit *niet* in de settings catalog: de ingeste `outlk16v2`-ADMX kent onder *Cached Exchange Mode* achttien instellingen en die schuif is er geen van. Wie die wil zetten, kan dat alleen via een eigen ADMX-import of de Office Cloud Policy Service — buiten deze baseline dus.

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_configurecachedexchangemode` | 1 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_cachedexchangemodefilecachedexchangemode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_cachedexchangemodefilecachedexchangemode_l_selectcachedexchangemodefornewprofiles` | 2 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_outlookoptions~l_delegates_l_cacheothersmail` | 1 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_downloadshardnonmailfolders` | 0 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_downloadpublicfolderfavorites` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
