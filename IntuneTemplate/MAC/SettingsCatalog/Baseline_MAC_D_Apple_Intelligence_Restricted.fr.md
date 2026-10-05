<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Apple_Intelligence_Restricted.md) · [English](Baseline_MAC_D_Apple_Intelligence_Restricted.en.md) · **Français**

# [Baseline] - MAC - D - Apple Intelligence Restricted

Désactive les fonctions Apple Intelligence qui font traiter du texte, des e-mails, des notes, des pages web ou des images par un modèle de langage ou les envoient à un service d'IA externe, et maintient la dictée sur l'appareil.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.5.1.1–2.5.1.4 et 2.18.1 (mSCP branch tahoe) ; ids et valeurs identiques à OpenIntuneBaseline macOS v2.0 beta — SC - Device Security - D - Restrictions, sauf les résumés Safari (OIB : activés, ici désactivés) |
| Fichier | [`Baseline_MAC_D_Apple_Intelligence_Restricted.json`](Baseline_MAC_D_Apple_Intelligence_Restricted.json) |

> **Alternative à [Baseline] - MAC - D - Apple Intelligence Permitted** — celle-ci définit les mêmes douze paramètres sur la valeur opposée. Affecter les deux produit un Conflict, et alors aucune des deux ne fait quoi que ce soit. Vérifié : [Baseline] - MAC - D - Restrictions (OpenIntuneBaseline macOS v1.0) ne définit aucun de ces douze ids, et aucun autre template non plus. Siri y est déjà désactivé (allowAssistant), donc l'intégration ChatGPT via Siri était déjà en grande partie fermée ; cette policy ferme aussi l'intégration dans Writing Tools et la connexion à un service externe. Clés de profil (com.apple.applicationaccess) et non DDM : en septembre 2026, Apple marque les douze clés comme dépréciées à partir de 26.4, au profit des configurations déclaratives com.apple.configuration.intelligence.settings et com.apple.configuration.external-intelligence.settings (dans Intune : intelligencesettings_* et externalintelligencesettings_*, qui existent aussi pour macOS). Les clés de profil sont néanmoins conservées, et cela a été calculé plutôt que reporté : ces configurations DDM n'existent qu'à partir de macOS 26.4 et Apple ne les autorise qu'avec une inscription supervisée, alors que ce payload fonctionne aussi sur macOS 15 et sur un Mac que l'utilisateur a inscrit lui-même. Convertir maintenant laisserait justement Apple Intelligence sans restriction sur 15.x et sur 26.0 à 26.3, ce qui serait une régression. Chez Apple, déprécié ne veut pas dire supprimé : les clés fonctionnent encore, et mSCP et OpenIntuneBaseline v2.0 beta utilisent les mêmes. Basculer dès que le parc est en 26.4 ou plus et inscrit via ADE ; convertir alors toute la policy et ne pas mélanger les deux formes. La conversion est un pour un : intelligencesettings_allowwritingtools, _allowgenmoji, _allowimageplayground, _allowappleintelligencereport et _forceondeviceonlydictation, les résumés sous intelligencesettings_apps_mail, _apps_notes et _apps_safari, et externalintelligencesettings_enabled et _allowsignin. DDM peut en outre faire ce que ce payload ne peut pas (AllowImageWand, AllowVisualIntelligence, AllowPersonalizedHandwritingResults, ForceOnDeviceOnlyTranslation, Apps/Calendar), et c'est un nouveau choix, pas une partie de la conversion. [Baseline] - IOS - D - Apple Intelligence Restricted est déjà déclaratif ; il n'y avait pas de couverture de versions plus anciennes à perdre. Selon Apple, allowMailSummary ne bloque que le résumé manuel d'un e-mail, pas les résumés automatiques. Qui souhaite autoriser l'intégration ChatGPT, mais uniquement avec l'espace de travail professionnel de l'organisation, utilise allowedExternalIntelligenceWorkspaceIDs — spécifique à l'organisation, donc non inclus. Apple Intelligence ne fonctionne que sur les Mac avec Apple silicon et macOS 15.1 ou ultérieur ; sur les autres Mac, les paramètres sont sans effet. Tous sont aussi valables sur iOS/iPadOS ; cette policy est uniquement pour macOS. Écart délibéré par rapport à OpenIntuneBaseline v2.0 beta : celle-ci laisse allowSafariSummary à true ; ici false, car une page web résumée peut être une page intranet ou SharePoint. Le rapport Apple Intelligence (allowAppleIntelligenceReport) est désactivé, comme dans OIB.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Utilisation correcte de l'information et des autres actifs associés<br>A.8.12 Prévention de la fuite de données<br>A.5.34 Protection de la vie privée et des DCP |
| NIS2 art. 21(2) | art. 21(2)(d) sécurité de la chaîne d'approvisionnement |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.DS-02<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 13

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowappleintelligencereport` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrations` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrationssignin` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowgenmoji` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowimageplayground` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsmartreplies` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscription` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscriptionsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowsafarisummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowwritingtools` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceondeviceonlydictation` | true |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
