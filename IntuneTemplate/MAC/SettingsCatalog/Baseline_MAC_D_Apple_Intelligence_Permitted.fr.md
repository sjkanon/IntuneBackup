<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Apple_Intelligence_Permitted.md) · [English](Baseline_MAC_D_Apple_Intelligence_Permitted.en.md) · **Français**

# CXNM - Standard - MAC - D - Apple Intelligence Permitted

Autorise explicitement les mêmes fonctions Apple Intelligence : Writing Tools, résumés dans Mail, Notes et Safari, Genmoji, Image Playground, l'intégration d'IA externe et la dictée via les serveurs d'Apple.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — image miroir de CXNM - Standard - MAC - D - Apple Intelligence Restricted ; ids issus d'OpenIntuneBaseline macOS v2.0 beta et de CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 (mSCP branch tahoe) |
| Fichier | [`Baseline_MAC_D_Apple_Intelligence_Permitted.json`](Baseline_MAC_D_Apple_Intelligence_Permitted.json) |

> **Alternative à CXNM - Standard - MAC - D - Apple Intelligence Restricted.** Celle-ci définit les mêmes douze paramètres sur la valeur opposée ; affecter les deux produit un Conflict, après quoi Intune n'en applique aucune. forceOnDeviceOnlyDictation est ici à false : la dictée peut passer par les serveurs d'Apple. Limiter l'intégration ChatGPT à l'espace de travail professionnel de l'organisation est possible avec allowedExternalIntelligenceWorkspaceIDs ; spécifique à l'organisation, donc non inclus. Siri reste désactivé via CXNM - Standard - MAC - D - Restrictions (allowAssistant) ; qui souhaite l'intégration externe via Siri doit aussi reconsidérer cette décision. Cette clé est dépréciée depuis macOS 26.4 au profit de DDM sirisettings_enabled ; la raison de son maintien est expliquée dans la note de Restrictions.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.8.1 Terminaux finaux des utilisateurs<br>A.5.34 Protection de la vie privée et des DCP |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 13

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowappleintelligencereport` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrations` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrationssignin` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowgenmoji` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowimageplayground` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsmartreplies` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscription` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscriptionsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowsafarisummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowwritingtools` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceondeviceonlydictation` | false |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
