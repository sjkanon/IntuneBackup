<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Microsoft Edge DNS over HTTPS Automatic

Legt in Edge DNS over HTTPS vast op 'automatisch': Edge versleutelt DNS-verzoeken zodra de ingestelde DNS-server DoH ondersteunt en valt anders terug op gewone DNS, zonder dat de gebruiker het kan uitzetten.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-202-DMicrosoftEdgeDNSOverHTTPSAutomatic` |
| Bron | Microsoft Edge-beleid DnsOverHttpsMode (Edge 83+) — waarden geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.json`](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.json) |

> **Alternatief van [Baseline] - WIN - D - Microsoft Edge DNS over HTTPS Secure** — beide zetten `dnsoverhttpsmode` op een andere waarde; wijs er één toe. Defender Network Protection (fase 1, Defender Antivirus) inspecteert verkeer van Edge via SmartScreen en blijft dus werken; voor browsers van derden steunt Network Protection op DNS/TLS-inspectie, en Microsoft adviseert daar DoH en QUIC in die browser uit te zetten — dat valt buiten deze Edge-policy.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Netwerkbeveiliging<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptografie en versleuteling<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 3.10 Encrypt Sensitive Data in Transit<br>4.9 Configure Trusted DNS Servers on Enterprise Assets |
| NIST CSF 2.0 | PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode_dnsoverhttpsmode` | automatic |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
