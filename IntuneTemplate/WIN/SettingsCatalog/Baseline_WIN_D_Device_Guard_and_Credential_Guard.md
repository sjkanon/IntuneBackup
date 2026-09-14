<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Device Guard and Credential Guard

Zet virtualisatie-gebaseerde beveiliging, Credential Guard en geheugenintegriteit aan, zodat inloggegevens in een afgeschermd deel van het geheugen staan. Vraagt een herstart en kan oude stuurprogramma's blokkeren.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard` |
| Bron | OpenIntuneBaseline Windows v4.0 — SC - Device Security - U - Device Guard, Credential Guard and HVCI |
| Bestand | [`Baseline_WIN_D_Device_Guard_and_Credential_Guard.json`](Baseline_WIN_D_Device_Guard_and_Credential_Guard.json) |

> OIB wijst deze aan gebruikers toe om een herstart midden in Autopilot te vermijden; alle 8 instellingen zijn device-scoped, dus hier D. Houd er rekening mee dat de eerste toepassing een herstart vraagt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.7 Bescherming tegen malware |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.AA-01<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 8

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_deviceguard_configuresystemguardlaunch` | 1 |
| `device_vendor_msft_policy_config_deviceguard_lsacfgflags` | 1 |
| `device_vendor_msft_policy_config_deviceguard_enablevirtualizationbasedsecurity` | 1 |
| `device_vendor_msft_policy_config_deviceguard_machineidentityisolation` | 0 |
| `device_vendor_msft_policy_config_deviceguard_requireplatformsecurityfeatures` | 3 |
| `device_vendor_msft_policy_config_localsecurityauthority_configurelsaprotectedprocess` | 1 |
| `device_vendor_msft_policy_config_virtualizationbasedtechnology_hypervisorenforcedcodeintegrity` | 1 |
| `device_vendor_msft_policy_config_virtualizationbasedtechnology_requireuefimemoryattributestable` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
