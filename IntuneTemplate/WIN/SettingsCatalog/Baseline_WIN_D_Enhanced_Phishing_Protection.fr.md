<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Enhanced_Phishing_Protection.md) · [English](Baseline_WIN_D_Enhanced_Phishing_Protection.en.md) · **Français**

# [Baseline] - WIN - D - Enhanced Phishing Protection

Avertit dès qu'un utilisateur saisit son mot de passe professionnel sur un site d'hameçonnage, le réutilise dans une application ou l'enregistre dans un fichier texte.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-024-Smartscreen` |
| Source | OpenIntuneBaseline Windows v4.0 — SC - Device Security - D - Enhanced Phishing Protection |
| Fichier | [`Baseline_WIN_D_Enhanced_Phishing_Protection.json`](Baseline_WIN_D_Enhanced_Phishing_Protection.json) |

> Successeur de la policy SmartScreen (le checkId 024 est conservé). Quatre des six anciens paramètres sont ici, les deux paramètres SmartScreen du shell sont dans Security Hardening.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.23 Filtrage web |
| NIS2 art. 21(2) | art. 21(2)(g) pratiques de base en matière de cyberhygiène et formation à la cybersécurité<br>art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | PR.AA-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_webthreatdefense_notifymalicious` | 1 |
| `device_vendor_msft_policy_config_webthreatdefense_notifypasswordreuse` | 1 |
| `device_vendor_msft_policy_config_webthreatdefense_notifyunsafeapp` | 1 |
| `device_vendor_msft_policy_config_webthreatdefense_serviceenabled` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
