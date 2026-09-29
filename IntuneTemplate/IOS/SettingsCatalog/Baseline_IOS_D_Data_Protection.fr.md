<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_IOS_D_Data_Protection.md) · [English](Baseline_IOS_D_Data_Protection.en.md) · **Français**

# [Baseline] - IOS - D - Data Protection

Sépare les données de l'entreprise des applications personnelles sur chaque appareil inscrit : les documents des applications gérées ne s'ouvrent pas dans des applications non gérées, AirDrop est considéré comme non géré, les applications gérées ne se synchronisent pas avec iCloud, les applications personnelles ne lisent pas les contacts professionnels et les sauvegardes locales sont chiffrées.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | UniFy iOS/iPadOS Baseline v1.2 — SC - Data Protection - BYOD/Corporate et SC - iCloud & Storage - BYOD/Corporate (CIS Apple iOS/iPadOS 26 Benchmark v1.0.0) ; fusionnés en une seule policy pour tous les appareils inscrits, car chaque clé fonctionne aussi sans supervision et avec l'inscription utilisateur |
| Fichier | [`Baseline_IOS_D_Data_Protection.json`](Baseline_IOS_D_Data_Protection.json) |

> La demande prévoyait une 'Data Protection BYOD' distincte. C'est devenu une seule policy : les mêmes clés avec les mêmes valeurs dans une variante BYOD et une variante Corporate représenteraient une double maintenance, et [Baseline] - IOS - D - Restrictions Corporate ne contient que ce qui nécessite la supervision. Contacts : allowunmanagedtoreadmanagedcontacts=false (les applications personnelles ne lisent pas les contacts professionnels, comme la valeur par défaut d'Apple mais de façon explicite), mais allowmanagedtowriteunmanagedcontacts=**true** — avec la séparation open-in activée, Outlook ne peut sinon pas écrire de contacts dans l'application Contacts et l'utilisateur ne voit aucun nom lors d'un appel entrant ; c'est la même raison pour laquelle contactSyncBlocked est volontairement désactivé dans App Protection. allowopenfromunmanagedtomanaged et requiremanagedpasteboard volontairement pas : les photos de la bibliothèque personnelle restent partageables avec les applications professionnelles (voir ANALYSE.md). Non repris d'UniFy BYOD : allowscreenshot=false (captures d'écran désactivées sur l'ensemble de l'appareil personnel ; App Protection les bloque déjà dans les applications gérées), allowcloudprivaterelay=false et forceairplayoutgoingrequestspairingpassword (vie privée/confort, pas de séparation des données).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Prévention de la fuite de données<br>A.8.24 Utilisation de la cryptographie<br>A.8.1 Terminaux finaux des utilisateurs |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs<br>art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists<br>3.11 Encrypt Sensitive Data at Rest |
| NIST CSF 2.0 | PR.DS-01<br>PR.DS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 7

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowopenfrommanagedtounmanaged` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowunmanagedtoreadmanagedcontacts` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmanagedtowriteunmanagedcontacts` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceairdropunmanaged` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmanagedappscloudsync` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceencryptedbackup` | true |

---

Retour à la [vue d'ensemble iOS/iPadOS](../README.fr.md) · [README principal](../../../README.fr.md)
