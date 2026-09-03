<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Access Control

Toont vóór het aanmelden een waarschuwing dat het systeem alleen voor geautoriseerde gebruikers is, en verbergt de laatst aangemelde gebruikersnaam.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-123-DAccessControl` |
| Bron | ISO/IEC 27001:2022 A.5.15 en A.8.5, NIS2 art. 21(2)(i), EASA Part-IS IS.I.OR.245 — instellingen uit CIS v4 Windows 11 L1 |
| Bestand | [`Baseline_WIN_D_Access_Control.json`](Baseline_WIN_D_Access_Control.json) |

> ISMP02 eist de eerste twee letterlijk: een algemene waarschuwing bij het aanmelden, en geen systeem- of gebruikersidentificatie vóór een geslaagde aanmelding. De banner is juridisch relevant bij misbruik; pas de tekst aan op de eigen organisatienaam vóór uitrol. Het verbergen van de laatste gebruikersnaam is merkbaar voor gebruikers — die moeten voortaan hun volledige naam typen — dus communiceer die vóór je 'm toewijst. De drie andere instellingen sluiten de aanmeldroutes af die het beleid niet noemt als goedgekeurde methode: het beeldwachtwoord, de oude convenience-PIN (níet de Windows Hello-PIN, die blijft werken) en de beveiligingsvragen voor lokale accounts — dat laatste omdat ISMP02 identiteitsverificatie bij een reset eist, en beveiligingsvragen dat juist omzeilen.

## Instellingen — 6

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_messagetitleforusersattemptingtologon` | Toegang uitsluitend voor geautoriseerde gebruikers |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_messagetextforusersattemptingtologon` | Dit systeem en de gegevens erop zijn eigendom van de organisatie en zijn uitsluitend bestemd voor geautoriseerd gebruik., Gebruik wordt gelogd en gecontroleerd. Onbevoegd gebruik kan leiden tot disciplinaire maatregelen en strafrechtelijke vervolging., Door verder te gaan verklaart u kennis te hebben genomen van het informatiebeveiligingsbeleid. |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_donotdisplaylastsignedin` | 1 |
| `device_vendor_msft_policy_config_credentialproviders_blockpicturepassword` | 1 |
| `device_vendor_msft_policy_config_credentialproviders_allowpinlogon` | 0 |
| `device_vendor_msft_policy_config_admx_credui_nolocalpasswordresetquestions` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
