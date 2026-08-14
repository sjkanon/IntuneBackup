<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Device Guard and Credential Guard

Zet virtualisatie-gebaseerde beveiliging, Credential Guard en geheugenintegriteit aan, zodat inloggegevens in een afgeschermd deel van het geheugen staan. Vraagt een herstart en kan oude stuurprogramma's blokkeren.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-065-DDeviceGuardAndCredentialGuard` |
| Bron | OpenIntuneBaseline Windows v3.8 — SC - Device Security - U - Device Guard, Credential Guard and HVCI |
| Bestand | [`Baseline_WIN_D_Device_Guard_and_Credential_Guard.json`](Baseline_WIN_D_Device_Guard_and_Credential_Guard.json) |

> OIB wijst deze aan gebruikers toe om een herstart midden in Autopilot te vermijden; alle 8 instellingen zijn device-scoped, dus hier D. Houd er rekening mee dat de eerste toepassing een herstart vraagt.

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
