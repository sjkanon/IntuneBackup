<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Cryptography.md) · [English](Baseline_WIN_D_Cryptography.en.md) · **Français**

# [Baseline] - WIN - D - Cryptography

Impose que Microsoft Edge n'établisse pas de connexions en dessous de TLS 1.2, même si un serveur le propose.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | ISO/IEC 27001:2022 A.8.24, NIS2 art. 21(2)(h) — paramètre issu de CIS v3 Microsoft Edge L1 |
| Fichier | [`Baseline_WIN_D_Cryptography.json`](Baseline_WIN_D_Cryptography.json) |

> Les politiques courantes exigent TLS 1.2 ou supérieur pour les services web et cloud. La pile WinINet est déjà correctement configurée (Internet Explorer Legacy), mais Edge lui-même acceptait jusqu'à présent ce que le serveur proposait. Attention : les systèmes internes qui ne parlent que TLS 1.0/1.1 deviennent de ce fait inaccessibles — c'est précisément pourquoi il s'agit d'une policy pilote.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.10 Encrypt Sensitive Data in Transit |
| NIST CSF 2.0 | PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_microsoft_edge~policy~microsoft_edge_sslversionmin_sslversionmin` | tls1.2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
