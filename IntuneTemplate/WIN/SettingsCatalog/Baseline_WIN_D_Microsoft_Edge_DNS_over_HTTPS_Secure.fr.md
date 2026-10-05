<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.md) · [English](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.en.md) · **Français**

# [Baseline] - WIN - D - Microsoft Edge DNS over HTTPS Secure

Impose DNS over HTTPS dans Edge sans repli : chaque requête DNS part chiffrée vers le résolveur DoH indiqué, et sans ce résolveur Edge ne résout rien.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Policy Microsoft Edge DnsOverHttpsMode et DnsOverHttpsTemplates (Edge 83+) — valeurs vérifiées par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.json`](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.json) |

> Remplacez `DOH-RESOLVER-INVULLEN` par l'hôte du résolveur ; séparez plusieurs templates par une espace. **Alternative à [Baseline] - WIN - D - Microsoft Edge DNS over HTTPS Automatic** — affectez-en une seule. Les portails captifs (Wi-Fi d'hôtel) ne peuvent plus se charger tant que l'utilisateur n'est pas connecté ; testez-le au préalable.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Sécurité des réseaux<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptographie et chiffrement<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| CIS Controls v8.1 | 3.10 Encrypt Sensitive Data in Transit<br>4.9 Configure Trusted DNS Servers on Enterprise Assets |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode_dnsoverhttpsmode` | secure |
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpstemplates` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpstemplates_dnsoverhttpstemplates` | https://DOH-RESOLVER-INVULLEN/dns-query{?dns} |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
