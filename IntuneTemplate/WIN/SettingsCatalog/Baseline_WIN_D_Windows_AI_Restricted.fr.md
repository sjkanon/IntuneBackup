<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_AI_Restricted.md) · [English](Baseline_WIN_D_Windows_AI_Restricted.en.md) · **Français**

# CXNM - Standard - WIN - D - Windows AI Restricted

Désactive Recall et Click To Do : Windows ne fait alors aucune capture de ce qui se passe à l'écran et ne les analyse pas non plus.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | baseline propre — comparaison avec IntuneAdmin/IntuneBaselines, août 2026 |
| Fichier | [`Baseline_WIN_D_Windows_AI_Restricted.json`](Baseline_WIN_D_Windows_AI_Restricted.json) |

> **Alternative à CXNM - Standard - WIN - D - Windows AI Permitted.** Celle-ci définit les trois mêmes paramètres sur la valeur opposée ; affecter les deux provoque un Conflict, après quoi Intune n'en applique aucune. C'est la variante que la baseline déploie par défaut.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.5.34 Protection de la vie privée et des DCP<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.12 Prévention de la fuite de données |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| NIST CSF 2.0 | PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_windowsai_allowrecallenablement` | 0 |
| `device_vendor_msft_policy_config_windowsai_disableaidataanalysis` | 1 |
| `device_vendor_msft_policy_config_windowsai_disableclicktodo` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
