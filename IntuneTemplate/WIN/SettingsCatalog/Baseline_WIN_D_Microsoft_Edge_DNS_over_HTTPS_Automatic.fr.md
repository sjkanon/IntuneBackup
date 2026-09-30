<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.md) · [English](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.en.md) · **Français**

# CXNM - Standard - WIN - D - Microsoft Edge DNS over HTTPS Automatic

Fixe DNS over HTTPS dans Edge sur « automatique » : Edge chiffre les requêtes DNS dès que le serveur DNS configuré prend en charge DoH et se rabat sinon sur le DNS classique, sans que l'utilisateur puisse le désactiver.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Policy Microsoft Edge DnsOverHttpsMode (Edge 83+) — valeurs vérifiées par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.json`](Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.json) |

> **Alternative à CXNM - Standard - WIN - D - Microsoft Edge DNS over HTTPS Secure** — les deux définissent `dnsoverhttpsmode` sur une valeur différente ; affectez-en une seule. Defender Network Protection (phase 1, Defender Antivirus) inspecte le trafic d'Edge via SmartScreen et continue donc de fonctionner ; pour les navigateurs tiers, Network Protection s'appuie sur l'inspection DNS/TLS, et Microsoft conseille d'y désactiver DoH et QUIC — cela sort du cadre de cette policy Edge.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Sécurité des réseaux<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptographie et chiffrement<br>art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| CIS Controls v8.1 | 3.10 Encrypt Sensitive Data in Transit<br>4.9 Configure Trusted DNS Servers on Enterprise Assets |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edgev83diff~policy~microsoft_edge_dnsoverhttpsmode_dnsoverhttpsmode` | automatic |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
