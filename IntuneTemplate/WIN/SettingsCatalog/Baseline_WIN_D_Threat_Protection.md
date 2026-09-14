<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Threat Protection

Haalt de lokale ontsnappingsroutes uit de malwarebescherming weg: gebruikers kunnen Exploit Protection niet overrulen, de cloudrapportage niet lokaal uitzetten, en DLL-kaping wordt moeilijker.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-136-DThreatProtection` |
| Bron | ISO/IEC 27001:2022 A.8.7 en A.8.8, NIS2 art. 21(2)(e) — instellingen uit CIS v4 Windows 11 L1 |
| Bestand | [`Baseline_WIN_D_Threat_Protection.json`](Baseline_WIN_D_Threat_Protection.json) |

> LSA-bescherming stond al in [Baseline] - WIN - D - Device Guard and Credential Guard; wat ontbrak zijn de lokale overrides. Malwarebescherming hoort niet door de eindgebruiker te wijzigen te zijn, en dit waren de plekken waar dat wél kon; het blokkeren van eigen exploit-protectioninstellingen staat sinds OpenIntuneBaseline v4.0 in [Baseline] - WIN - D - Defender Additional Configuration. SafeDllSearchMode is de oudste en nog steeds de goedkoopste verdediging tegen DLL-kaping.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features<br>10.6 Centrally Manage Anti-Malware Software |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_admx_microsoftdefenderantivirus_spynet_localsettingoverridespynetreporting` | 0 |
| `device_vendor_msft_policy_config_admx_mss-legacy_pol_mss_safedllsearchmode` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
