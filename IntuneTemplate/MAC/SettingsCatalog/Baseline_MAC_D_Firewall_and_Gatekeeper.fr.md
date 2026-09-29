<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Firewall_and_Gatekeeper.md) · [English](Baseline_MAC_D_Firewall_and_Gatekeeper.en.md) · **Français**

# [Baseline] - MAC - D - Firewall and Gatekeeper

Active le pare-feu macOS et fait en sorte que Gatekeeper n'autorise que les logiciels signés par un développeur identifié.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-039-MACDFirewallAndGatekeeper` |
| Source | OpenIntuneBaseline macOS v1.0 — Firewall - D - Gatekeeper |
| Fichier | [`Baseline_MAC_D_Firewall_and_Gatekeeper.json`](Baseline_MAC_D_Firewall_and_Gatekeeper.json) |

> Pare-feu et mode furtif activés (CIS Apple macOS 26 L1 2.2.1, 2.2.2), Gatekeeper activé avec App Store et développeurs identifiés (2.6.5). « Bloquer toutes les connexions entrantes » est volontairement désactivé — cela casse la réception AirPlay et le partage d'écran ; depuis septembre 2026, la policy de conformité ne l'exige plus non plus. Depuis septembre 2026, Gatekeeper peut proposer d'envoyer à Apple un fichier malveillant bloqué (enablexprotectmalwareupload, override). Le blocage du contournement via le Finder (com.apple.systempolicy.managed DisableOverride) ne se trouve pas ici mais dans [Baseline] - MAC - D - Restrictions Hardening : c'est un autre payload qu'OIB v1.0 ne fournit pas, et un override ne peut pas ajouter un nouveau groupe de payload.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.20 Sécurité des réseaux<br>A.8.7 Protection contre les programmes malveillants<br>A.8.19 Installation de logiciels sur des systèmes opérationnels |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.5 Implement and Manage a Firewall on End-User Devices<br>2.5 Allowlist Authorized Software<br>10.1 Deploy and Maintain Anti-Malware Software |
| NIST CSF 2.0 | PR.IR-01<br>PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 9

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.security.firewall_com.apple.security.firewall` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_blockallincoming` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_enablefirewall` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_enablelogging` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.security.firewall_enablestealthmode` | true |
| `com.apple.systempolicy.control_com.apple.systempolicy.control` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.control_allowidentifieddevelopers` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.control_enableassessment` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.control_enablexprotectmalwareupload` | true |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
