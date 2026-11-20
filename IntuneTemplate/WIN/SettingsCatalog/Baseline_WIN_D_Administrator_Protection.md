<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Administrator_Protection.en.md) · [Français](Baseline_WIN_D_Administrator_Protection.fr.md)

# [Baseline] - WIN - D - Administrator Protection

Houdt UAC op de klassieke Admin Approval Mode, zodat Administrator Protection het LAPS-account niet breekt, en legt vast hoe de prompt zich gedraagt zodra Administrator Protection weer aan mag. Windows 11 24H2 en hoger.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | OpenIntuneBaseline Windows v4.0.1 — SC - Device Security - D - Administrator Protection |
| Bestand | [`Baseline_WIN_D_Administrator_Protection.json`](Baseline_WIN_D_Administrator_Protection.json) |

> Sinds november 2026 (OIB v4.0.1, issue #264) staat Type of Admin Approval Mode op 1 (Legacy) in plaats van 2 (Administrator protection). Sinds de beveiligingsupdate van oktober 2026 is Administrator Protection echt actief, en dat geeft problemen met LAPS — Microsoft noemt het zelf onder Troubleshooting op Learn. Deze baseline beheert het lokale beheerdersaccount met LAPS (wlapsadmin), dus LAPS wint. Weer naar 2 zodra Microsoft het LAPS-probleem oplost; volg OIB #264. Windows 11 24H2 en hoger; op oudere builds doet de instelling niets.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.2 Speciale toegangsrechten |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts |
| NIST CSF 2.0 | PR.AA-05 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_behavioroftheelevationpromptforadministratorprotection` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_useraccountcontrol_typeofadminapprovalmode` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
