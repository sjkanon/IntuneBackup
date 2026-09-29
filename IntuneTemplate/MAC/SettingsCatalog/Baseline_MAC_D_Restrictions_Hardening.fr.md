<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Restrictions_Hardening.md) · [English](Baseline_MAC_D_Restrictions_Hardening.en.md) · **Français**

# [Baseline] - MAC - D - Restrictions Hardening

Complète les restrictions macOS par cinq mesures qu'OpenIntuneBaseline macOS v1.0 ne définit pas : pas de profils de configuration ni de certificats installés manuellement, pas de contournement de Gatekeeper via le Finder, pas de données de diagnostic envoyées à Apple, pas de résultats internet dans Spotlight et pas de mise en cache de contenu.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-199-MACDRestrictionsHardening` |
| Source | OpenIntuneBaseline macOS v2.0 beta — SC - Device Security - D - Restrictions et D - Gatekeeper (mêmes valeurs) ; CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.6.3.1 (données de diagnostic) |
| Fichier | [`Baseline_MAC_D_Restrictions_Hardening.json`](Baseline_MAC_D_Restrictions_Hardening.json) |

> Une policy propre et non une extension de [Baseline] - MAC - D - Restrictions ou Firewall and Gatekeeper, parce que celles-ci proviennent d'OpenIntuneBaseline v1.0 : des ids supplémentaires y sont bien conservés lors d'un import, mais une policy distincte rend visible quel choix nous est propre et peut recevoir sa propre phase. Aucun des cinq ids ne figure dans un autre template. com.apple.applicationaccess est donc fourni dans deux profils ; macOS combine les payloads de restriction et la valeur la plus stricte l'emporte — pas de conflit, et check-scope.js ne le signale volontairement pas chez Apple. Si OpenIntuneBaseline macOS v2.0 est importé, OIB définit lui-même ces cinq paramètres dans Restrictions et Gatekeeper ; retirez-les alors d'ici, sinon ils figurent en double. enablexprotectmalwareupload (Gatekeeper peut proposer d'envoyer à Apple un fichier malveillant bloqué) ne se trouve pas ici mais en override dans Firewall and Gatekeeper, parce qu'OIB v1.0 définit déjà ce paramètre. Volontairement non repris d'OIB v2.0 beta Restrictions : allowFindMyDevice, allowTimeMachineBackup=false, allowPasswordAutoFill=false et les autres choix que l'analyse précédente avait déjà rejetés.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration<br>A.8.19 Installation de logiciels sur des systèmes opérationnels<br>A.5.34 Protection de la vie privée et des DCP |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités<br>art. 21(2)(g) pratiques de base en matière de cyberhygiène et formation à la cybersécurité |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>2.5 Allowlist Authorized Software<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.PS-01<br>PR.PS-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 7

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowcontentcaching` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowdiagnosticsubmission` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowspotlightinternetresults` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowuiconfigurationprofileinstallation` | false |
| `com.apple.systempolicy.managed_com.apple.systempolicy.managed` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.systempolicy.managed_disableoverride` | true |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
