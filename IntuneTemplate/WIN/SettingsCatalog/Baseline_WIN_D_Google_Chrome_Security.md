<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Google_Chrome_Security.en.md) · [Français](Baseline_WIN_D_Google_Chrome_Security.fr.md)

# [Baseline] - WIN - D - Google Chrome Security

Legt de beveiliging van Google Chrome vast op het niveau van Edge: Safe Browsing aan en niet te omzeilen, kwaadaardige downloads geblokkeerd, certificaatfouten niet weg te klikken, en geen bedrijfsgegevens naar een persoonlijk Google-account.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Google Chrome-beleid in de settings catalog (chromeintunev1, chromeintunev141) — waarden gekozen naar de Edge-tegenhanger in deze baseline; ids, opties en bereik geverifieerd tegen DCv2/Settings in pl4nty/intune-change-tracking |
| Bestand | [`Baseline_WIN_D_Google_Chrome_Security.json`](Baseline_WIN_D_Google_Chrome_Security.json) |

> Safe Browsing op standaard (1) en niet op enhanced (2): enhanced stuurt elke bezochte URL naar Google. Downloadrestrictie 4 is 'kwaadaardige downloads blokkeren', dezelfde waarde als in Edge. De wachtwoordmanager gaat uit omdat Edge de beheerde wachtwoordmanager is; Chrome slaat geen nieuwe wachtwoorden meer op, al opgeslagen wachtwoorden blijven volgens Google werken. Extensies staan in een eigen policy (Google Chrome Extensions), net als bij Edge; BlockExternalExtensions staat wél hier, omdat het alleen extensies raakt die andere software via het register installeert. ApplicationBoundEncryptionEnabled staat in de catalogus in de namespace chromeintunev141, de rest op chromeintunev1. Firefox heeft geen settings catalog-definities: zie IntuneTemplate/WIN/Remediations/firefox-policies.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.12 Voorkomen van datalekken<br>A.8.23 Webfiltering<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden<br>art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>9.6 Block Unnecessary File Types<br>10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05<br>PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 17

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~safebrowsing_safebrowsingprotectionlevel` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~safebrowsing_safebrowsingprotectionlevel_safebrowsingprotectionlevel` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_disablesafebrowsingproceedanyway` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_sslerroroverrideallowed` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_downloadrestrictions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_downloadrestrictions_downloadrestrictions` | 4 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_dnsoverhttpsmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_dnsoverhttpsmode_dnsoverhttpsmode` | off |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_quicallowed` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_remotedebuggingallowed` | 0 |
| `device_vendor_msft_policy_config_chromeintunev141~policy~googlechrome_applicationboundencryptionenabled` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_browsersignin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_browsersignin_browsersignin` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_syncdisabled` | 1 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~passwordmanager_passwordmanagerenabled` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome_importsavedpasswords` | 0 |
| `device_vendor_msft_policy_config_chromeintunev1~policy~googlechrome~extensions_blockexternalextensions` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
