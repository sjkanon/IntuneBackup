<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Microsoft Edge DNS over HTTPS Secure

Dwingt in Edge DNS over HTTPS af zonder terugval: elk DNS-verzoek gaat versleuteld naar de opgegeven DoH-resolver, en zonder die resolver lost Edge niets op.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-203-DMicrosoftEdgeDNSOverHTTPSSecure` |
| Bron | Microsoft Edge-beleid DnsOverHttpsMode en DnsOverHttpsTemplates (Edge 83+) — waarden geverifieerd tegen de settings catalog-definities |
| Bestand | [`Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.json`](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.json) |

> Vul `DOH-RESOLVER-INVULLEN` met de host van de resolver; meerdere templates scheiden met een spatie. **Alternatief van [Baseline] - WIN - D - Microsoft Edge DNS over HTTPS Automatic** — wijs er één toe. Captive portals (hotel-wifi) kunnen niet meer laden tot de gebruiker verbonden is; test dat vooraf.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Netwerkbeveiliging<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptografie en versleuteling<br>art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| CIS Controls v8.1 | 3.10 Encrypt Sensitive Data in Transit<br>4.9 Configure Trusted DNS Servers on Enterprise Assets |
| NIST CSF 2.0 | PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode_dnsoverhttpsmode` | secure |
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpstemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpstemplates_dnsoverhttpstemplates` | https://DOH-RESOLVER-INVULLEN/dns-query{?dns} |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
