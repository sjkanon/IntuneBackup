<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Windows Component Hardening

Zet zeven kleine CIS-gaten dicht in Windows-onderdelen: geen automatische aanmelding, geen NTP-server, geen doorwerken op een ander apparaat, geen opsomming van lokale gebruikers, beschermde modus voor het shellprotocol, geen WinRT-toegang vanuit gehoste inhoud en geen upgrade-aanbod via de Store.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-206-DWindowsComponentHardening` |
| Bron | CIS v4 Windows 11 L1 (IntuneAdmin CISv4-profielen) — instance-structuren overgenomen uit IntuneAdmin, waarden geverifieerd tegen de settings catalog-definities; 'Enumerate local users' wijkt bewust af van de IntuneAdmin-waarde |
| Bestand | [`Baseline_WIN_D_Windows_Component_Hardening.json`](Baseline_WIN_D_Windows_Component_Hardening.json) |

> **Bewuste afwijking van de bron:** IntuneAdmin zet 'Enumerate local users on domain-joined computers' op `_1` (Enabled), CIS L1 18.9.28.x eist Disabled; hier `_0`. Drie van deze profielen (NTP-server, Store-upgradeaanbod, WinRT hosted content) zijn in de CIS-benchmark zelf mogelijk L2; ze zijn opgenomen omdat IntuneAdmin ze als L1 levert en ze geen functionaliteit van een werkplek raken. Overlap gecontroleerd: `hideexclusionsfromlocaladmins` staat in Defender Additional Configuration (andere id), verbonden gebruikers verbergen in Logon Hardening (andere id). Defender-uitsluitingen verbergen voor gewone gebruikers (CIS) staat hier bewust niet in: OpenIntuneBaseline v4.0 heeft die instelling geschrapt omdat 'Hide Exclusions From Local Admins' in [Baseline] - WIN - D - Defender Additional Configuration hem al dekt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Configuratiebeheer<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 9

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_autoadminlogon` | 0 |
| `device_vendor_msft_policy_config_admx_w32time_w32time_policy_enable_ntpserver` | 0 |
| `device_vendor_msft_policy_config_admx_grouppolicy_enablecdp` | 0 |
| `device_vendor_msft_policy_config_windowslogon_enumeratelocalusersondomainjoinedcomputers` | 0 |
| `device_vendor_msft_policy_config_admx_windowsexplorer_shellprotocolprotectedmodetitle_2` | 0 |
| `device_vendor_msft_policy_config_admx_appxruntime_appxruntimeblockhostedappaccesswinrt` | 1 |
| `device_vendor_msft_policy_config_admx_windowsstore_disableosupgrade_2` | 1 |
| `device_vendor_msft_policy_config_admx_grouppolicy_disablebackgroundpolicy` | 0 |
| `device_vendor_msft_policy_config_admx_terminalserver_ts_temp_delete` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
