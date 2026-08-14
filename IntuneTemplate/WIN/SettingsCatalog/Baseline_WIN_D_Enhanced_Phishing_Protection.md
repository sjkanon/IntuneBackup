<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Enhanced Phishing Protection

Waarschuwt zodra een gebruiker zijn werkwachtwoord intypt op een phishingsite, hergebruikt in een app of opslaat in een tekstbestand.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-024-Smartscreen` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - D - Enhanced Phishing Protection |
| Bestand | [`Baseline_WIN_D_Enhanced_Phishing_Protection.json`](Baseline_WIN_D_Enhanced_Phishing_Protection.json) |

> Opvolger van de SmartScreen-policy (checkId 024 blijft). Vier van de zes oude instellingen staan hier, de twee shell-SmartScreen-instellingen in Security Hardening.

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_webthreatdefense_notifymalicious` | 1 |
| `device_vendor_msft_policy_config_webthreatdefense_notifypasswordreuse` | 1 |
| `device_vendor_msft_policy_config_webthreatdefense_notifyunsafeapp` | 1 |
| `device_vendor_msft_policy_config_webthreatdefense_serviceenabled` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
