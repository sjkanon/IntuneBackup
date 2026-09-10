<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Microsoft Outlook Cached Mode Off

Zet Outlook in Online mode en verbiedt het aanmaken van een OST-bestand, zodat er geen mailbox-inhoud op de schijf van het apparaat landt.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-161-UMicrosoftOutlookCachedModeOff` |
| Bron | eigen baseline |
| Bestand | [`Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.json`](Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.json) |

> Voor een gedeeld of kiosk-apparaat waar het profiel niet bewaard wordt, en voor wie geen mailinhoud op de schijf wil hebben. De prijs is hoog: zonder OST werkt Outlook niet offline, is zoeken een serverzoekopdracht, en merkt de gebruiker elke hapering in de verbinding. Op een laptop hoort deze variant niet. Geldt alleen voor klassieke Outlook (de Win32-app uit Microsoft 365 Apps); het nieuwe Outlook voor Windows leest deze ADMX-instellingen niet en heeft geen OST. De bekende schuif **hoeveelheid e-mail offline bewaren** (3 maanden / 12 maanden / alles, registerwaarde `SyncWindowSetting`) zit *niet* in de settings catalog: de ingeste `outlk16v2`-ADMX kent onder *Cached Exchange Mode* achttien instellingen en die schuif is er geen van. Wie die wil zetten, kan dat alleen via een eigen ADMX-import of de Office Cloud Policy Service — buiten deze baseline dus.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings~l_cachedexchangemode_l_configurecachedexchangemode` | 0 |
| `user_vendor_msft_policy_config_outlk16v2~policy~l_microsoftofficeoutlook~l_toolsaccounts~l_exchangesettings_l_ostcreation` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
