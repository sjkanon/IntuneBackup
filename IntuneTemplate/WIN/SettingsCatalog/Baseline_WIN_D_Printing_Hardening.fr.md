<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Printing_Hardening.md) · [English](Baseline_WIN_D_Printing_Hardening.en.md) · **Français**

# CXNM - Standard - WIN - D - Printing Hardening

Active Windows Protected Print, interdit aux utilisateurs standard d'installer des pilotes d'imprimante pour une imprimante partagée et ferme l'impression via HTTP.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS v4 Windows 11 L1 et la Microsoft Security Baseline — paramètres repris d'IntuneAdmin, valeurs vérifiées par rapport aux définitions du settings catalog. |
| Fichier | [`Baseline_WIN_D_Printing_Hardening.json`](Baseline_WIN_D_Printing_Hardening.json) |

> Windows Protected Print requiert Windows 11 24H2 ou ultérieur et abandonne les imprimantes qui n'ont pas de pilote Mopria — en pratique, les imprimantes réseau plus anciennes et les imprimantes d'étiquettes. Inventoriez le parc d'imprimantes avant d'affecter largement ; sur une flotte sans imprimantes propres, c'est sans coût. Les deux autres paramètres sont sûrs sans condition. Chevauchement vérifié (septembre 2026) : `printers_configurewindowsprotectedprint` ne figure que dans cette policy ; CXNM - Standard - WIN - D - Printing définit vingt autres ids d'imprimante (Point and Print, RPC, RedirectionGuard, installation de pilotes réservée aux administrateurs) et n'entre pas en conflit. ANALYSE.md cite encore Protected Print comme « volontairement non repris » — ce n'est plus exact : il est ici, en phase 2.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.19 Installation de logiciels sur des systèmes opérationnels<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>2.3 Address Unauthorized Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_printers_configurewindowsprotectedprint` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_devices_preventusersfrominstallingprinterdriverswhenconnectingtosharedprinters` | 1 |
| `device_vendor_msft_policy_config_connectivity_diableprintingoverhttp` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
