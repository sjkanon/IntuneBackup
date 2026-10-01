<!-- Généré par scripts/generate-compliance.js — ne pas modifier à la main. -->

[Nederlands](COMPLIANCE.md) · [English](COMPLIANCE.en.md) · **Français**

# Référentiel de conformité et justification

Comment cette baseline met en œuvre l'**ISO/IEC 27001:2022 Annexe A**, **NIS2 (directive 2022/2555,
art. 21, paragraphe 2)**, les **CIS Controls v8.1** et le **NIST CSF 2.0** — et ce que l'organisation doit
régler elle-même en plus. Destiné à un RSSI, un DPO ou un auditeur. Tout ce qui suit est dérivé du champ
`controls` de [`IntuneTemplate/_manifest.json`](../IntuneTemplate/_manifest.json) et du vocabulaire de
[`IntuneTemplate/_controls.json`](../IntuneTemplate/_controls.json).

**À lire d'abord.** Ce document indique ce que la *baseline* impose, pas ce que fait un *tenant*. La présence
et l'application des policies dans un tenant se démontrent par les rapports Intune : l'affectation
et le statut par appareil de chaque policy citée ci-dessous.

| Statut | Signification |
|---|---|
| ● Couvert (phase 1) | au moins une policy en phase 1 impose ou vérifie la mesure |
| ◐ Seulement pilote, en attente ou groupe dédié | la policy existe, mais se trouve en phase 2, 3 ou 4 : pas encore sur tous les appareils |
| ▢ Organisationnel | ne peut pas être mis en œuvre par une politique de terminal ou d'identité : processus, personnes, physique ou autre domaine technique |
| ○ Aucune mesure technique dans la baseline | réalisable techniquement, mais cette baseline ne le fait pas (ou seulement avec une alternative en phase 5) |

> **Conditional Access n'est volontairement pas inclus** (`--no-ca`). La MFA (NIS2 (j)) et les conditions d'accès reposent en grande partie sur CA ; la justification correspondante se trouve dans le dépôt CA.
## Sommaire

1. [Résumé](#résumé)
2. [ISO/IEC 27001:2022 Annexe A](#isoiec-270012022-annexe-a)
3. [NIS2 art. 21, paragraphe 2](#nis2-art-21-paragraphe-2)
4. [CIS Controls v8.1](#cis-controls-v81)
5. [NIST CSF 2.0](#nist-csf-20)
6. [Choix de l'organisation et risques résiduels](#choix-de-lorganisation-et-risques-résiduels)
7. [Ce qu'une licence apporterait](#ce-quune-licence-apporterait)
8. [Déclaration d'applicabilité — point de départ](#déclaration-dapplicabilité--point-de-départ)
9. [Contrôle du mappage](#contrôle-du-mappage)

## Résumé

### Policies par phase — 197 policies Intune

Seule la phase 1 est affectée à tous les appareils ou utilisateurs et compte comme imposée. Le reste
n'est volontairement pas encore déployé ; la raison pour chaque policy figure dans [Choix de l'organisation et risques résiduels](#choix-de-lorganisation-et-risques-résiduels).

| Phase | Windows | macOS | iOS/iPadOS | Android | Total |
|---|---:|---:|---:|---:|---:|
| 1 — Immédiat | 80 | 19 | 1 | 1 | **101** |
| 2 — Pilote | 28 | 9 | – | 2 | **39** |
| 3 — En attente d'un prérequis | 5 | 3 | 8 | 10 | **26** |
| 4 — Groupe dédié | 7 | 4 | 4 | 1 | **16** |
| 5 — Ne pas déployer | 12 | 2 | 1 | – | **15** |
| **Total** | **132** | **37** | **14** | **14** | **197** |

Affectées selon `_assignments.json` : 101 (doit être égal à la phase 1 : 101).


### ISO/IEC 27001:2022 Annexe A — 93 mesures

Colonnes : si, selon le vocabulaire, la mesure peut être mise en œuvre par une politique de terminal/d'identité.

| Status | Technique (10) | Partiel (37) | Organisationnel (46) | Total |
|---|---:|---:|---:|---:|
| ● Couvert (phase 1) | 10 | 21 | 0 | **31** |
| ◐ Seulement pilote, en attente ou groupe dédié | 0 | 3 | 1 | **4** |
| ▢ Organisationnel | 0 | 0 | 45 | **45** |
| ○ Aucune mesure technique dans la baseline | 0 | 13 | 0 | **13** |

### NIS2 art. 21(2)

Nombre de policies qui mettent en œuvre le point sur le plan technique. Aucun point n'est réglé par la seule technique : voir pour chaque point ce qui est nécessaire sur le plan organisationnel.

| Point | Intune phase 1 | CA active | Pilote, en attente, groupe dédié |
|---|---:|---:|---:|
| [(a)](#art-212a-politiques-relatives-à-lanalyse-des-risques-et-à-la-sécurité-des-systèmes-dinformation) politiques relatives à l'analyse des risques et à la sécurité des systèmes d'information | 0 | s.o. | 0 |
| [(b)](#art-212b-gestion-des-incidents) gestion des incidents | 8 | s.o. | 6 |
| [(c)](#art-212c-continuité-des-activités-et-gestion-des-crises) continuité des activités et gestion des crises | 6 | s.o. | 2 |
| [(d)](#art-212d-sécurité-de-la-chaîne-dapprovisionnement) sécurité de la chaîne d'approvisionnement | 2 | s.o. | 5 |
| [(e)](#art-212e-sécurité-de-lacquisition-du-développement-et-de-la-maintenance-des-réseaux-et-des-systèmes-dinformation-y-compris-le-traitement-des-vulnérabilités) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités | 48 | s.o. | 35 |
| [(f)](#art-212f-évaluation-de-lefficacité) évaluation de l'efficacité | 13 | s.o. | 2 |
| [(g)](#art-212g-pratiques-de-base-en-matière-de-cyberhygiène-et-formation-à-la-cybersécurité) pratiques de base en matière de cyberhygiène et formation à la cybersécurité | 1 | s.o. | 2 |
| [(h)](#art-212h-cryptographie-et-chiffrement) cryptographie et chiffrement | 8 | s.o. | 7 |
| [(i)](#art-212i-sécurité-des-ressources-humaines-politiques-de-contrôle-daccès-et-gestion-des-actifs) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs | 22 | s.o. | 37 |
| [(j)](#art-212j-authentification-à-plusieurs-facteurs-et-communications-sécurisées) authentification à plusieurs facteurs et communications sécurisées | 3 | s.o. | 7 |

### CIS Controls v8.1 et NIST CSF 2.0

Safeguards CIS réalisables techniquement (safeguards de processus, de documentation et de formation non comptés) : **IG1 16 sur 36** couverts, **IG1+IG2 36 sur 94**, **IG1–IG3 37 sur 111**.

| Fonction NIST CSF 2.0 | Couvert | Seulement préparé | Sous-catégories pertinentes |
|---|---:|---:|---:|
| GV Govern (gouverner) | 0 | 0 | 8 |
| ID Identify (identifier) | 0 | 2 | 7 |
| PR Protect (protéger) | 15 | 0 | 18 |
| DE Detect (détecter) | 2 | 1 | 6 |
| RS Respond (répondre) | 1 | 0 | 7 |
| RC Recover (rétablir) | 1 | 0 | 5 |

## ISO/IEC 27001:2022 Annexe A

Norme : ISO/IEC 27001:2022 Annex A — NEN-EN-ISO/IEC 27001:2023 (+A1:2024 ne modifie pas l'Annex A). Les titres sont traduits de la norme néerlandaise. **Réalisable** indique si la
mesure peut être mise en œuvre par une politique de terminal ou d'identité ; **Statut** indique ce que cette baseline en fait aujourd'hui.

### 5 Mesures organisationnelles

| Mesure | Réalisable | Statut | Phase 1 | Autres | Ce qui reste nécessaire sur le plan organisationnel |
|---|---|---|---:|---:|---|
| **A.5.1** Politiques de sécurité de l'information | organisationnel | ▢ Organisationnel | – | – | Définir la politique de sécurité de l'information et les politiques spécifiques à une thématique (notamment endpoint, accès et IA), les faire approuver par la direction et les réviser périodiquement. |
| **A.5.2** Fonctions et responsabilités liées à la sécurité de l'information | organisationnel | ▢ Organisationnel | – | – | Désigner et consigner le propriétaire de la baseline, le CISO et les rôles d'administration (administration Intune, Entra et Defender). |
| **A.5.3** Séparation des tâches | partiel | ○ Aucune mesure technique dans la baseline | – | – | Séparation entre qui modifie les policies, qui les approuve (revue de PR) et qui accorde les exceptions ; mettre en place le RBAC Entra/Intune et PIM — hors du périmètre de cette baseline. |
| **A.5.4** Responsabilités de la direction | organisationnel | ▢ Organisationnel | – | – | La direction pilote la conformité de manière démontrable (NIS2 art. 20 : les organes de direction approuvent les mesures et suivent une formation). |
| **A.5.5** Contacts avec les autorités | organisationnel | ▢ Organisationnel | – | – | Consigner les points de contact avec le CSIRT/NCSC, l'autorité de supervision et l'autorité de protection des données (AP), y compris les délais de notification. |
| **A.5.6** Contacts avec des groupes d'intérêt spécifiques | organisationnel | ▢ Organisationnel | – | – | Organiser la participation aux ISAC, aux concertations sectorielles et aux avis des fournisseurs. |
| **A.5.7** Renseignements sur les menaces | partiel | ○ Aucune mesure technique dans la baseline | – | – | Faire évaluer les renseignements sur les menaces (Defender, Entra ID Protection, NCSC) et les traduire en ajustements de la baseline. |
| **A.5.8** Sécurité de l'information dans la gestion de projet | organisationnel | ▢ Organisationnel | – | – | Intégrer des exigences de sécurité dans les projets, par exemple lors du déploiement de nouveaux appareils ou de nouvelles plateformes. |
| [**A.5.9** Inventaire des informations et autres actifs associés](#a59-inventaire-des-informations-et-autres-actifs-associés) | partiel | ◐ Seulement pilote, en attente ou groupe dédié | – | 3 | Intune fournit l'inventaire des appareils ; la propriété, l'inventaire des informations et le contrôle périodique de leur exhaustivité relèvent de l'organisationnel. |
| [**A.5.10** Utilisation correcte de l'information et des autres actifs associés](#a510-utilisation-correcte-de-linformation-et-des-autres-actifs-associés) | partiel | ● Couvert (phase 1) | 3 | 11 | Définir et communiquer les règles d'utilisation (y compris l'IA et l'usage privé) ; la technique n'en impose qu'une partie. |
| **A.5.11** Restitution des actifs | partiel | ○ Aucune mesure technique dans la baseline | – | – | Processus de départ : restitution des appareils, retire/wipe dans Intune, blocage du compte. |
| **A.5.12** Classification des informations | organisationnel | ▢ Organisationnel | – | – | Définir un schéma de classification ; les étiquettes techniques (Purview) sont hors du périmètre de cette baseline. |
| **A.5.13** Marquage des informations | organisationnel | ▢ Organisationnel | – | – | Procédure et outils de marquage (étiquettes de confidentialité Purview) — hors du périmètre de cette baseline. |
| [**A.5.14** Transfert des informations](#a514-transfert-des-informations) | partiel | ● Couvert (phase 1) | 1 | 1 | Règles de transfert d'informations avec des tiers (messagerie, liens de partage, comptes invités) ; la technique restreint les canaux sur l'appareil. |
| [**A.5.15** Contrôle d'accès](#a515-contrôle-daccès) | technique | ● Couvert (phase 1) | 3 | 9 | Établir une politique d'accès (qui peut accéder à quoi, dans quelles conditions) ; Conditional Access et les policies d'appareil l'appliquent. |
| [**A.5.16** Gestion des identités](#a516-gestion-des-identités) | partiel | ● Couvert (phase 1) | 2 | – | Relier le cycle de vie des identités (arrivées, mobilités, départs) aux RH ; enregistrer les comptes partagés et de service. |
| [**A.5.17** Informations d'authentification](#a517-informations-dauthentification) | technique | ● Couvert (phase 1) | 12 | 19 | Former les utilisateurs à la gestion des mots de passe, codes PIN et codes de récupération ; processus de délivrance des codes d'accès temporaires. |
| **A.5.18** Droits d'accès | partiel | ○ Aucune mesure technique dans la baseline | – | – | Attribution, revue périodique (access reviews) et révocation des droits ; CA applique des conditions mais ne revoit pas les droits. |
| [**A.5.19** Sécurité de l'information dans les relations avec les fournisseurs](#a519-sécurité-de-linformation-dans-les-relations-avec-les-fournisseurs) | organisationnel | ◐ Seulement pilote, en attente ou groupe dédié | – | 2 | Politique fournisseurs et évaluation des risques (y compris Microsoft, services d'IA, outils d'assistance à distance) ; la technique ne peut que bloquer les services non approuvés. |
| **A.5.20** La sécurité de l'information dans les accords conclus avec les fournisseurs | organisationnel | ▢ Organisationnel | – | – | Inclure dans les contrats les exigences de sécurité, les accords de sous-traitance (traitement des données) et les droits d'audit. |
| **A.5.21** Gestion de la sécurité de l'information dans la chaîne d'approvisionnement TIC | organisationnel | ▢ Organisationnel | – | – | Exigences relatives aux produits et services TIC de la chaîne ; évaluer la provenance des logiciels et des mises à jour. |
| **A.5.22** Surveillance, révision et gestion des changements des services fournisseurs | organisationnel | ▢ Organisationnel | – | – | Suivre les changements chez Microsoft et les fournisseurs (Message Center, feuilles de route) et les revoir périodiquement. |
| **A.5.23** Sécurité de l'information dans l'utilisation de services en nuage | partiel | ○ Aucune mesure technique dans la baseline | – | – | Processus d'acquisition, d'utilisation et de sortie des services cloud ; CA et les restrictions de tenant en appliquent une partie. |
| **A.5.24** Planification et préparation de la gestion des incidents liés à la sécurité de l'information | organisationnel | ▢ Organisationnel | – | – | Plan de réponse aux incidents avec rôles, procédures opérationnelles (notamment isoler l'appareil, révoquer le compte) et obligation de notification (NIS2 art. 23). |
| **A.5.25** Évaluation des événements liés à la sécurité de l'information et prise de décision | partiel | ○ Aucune mesure technique dans la baseline | – | – | Processus de tri et critères définissant un « incident » ; Defender fournit les signaux. |
| **A.5.26** Réponse aux incidents liés à la sécurité de l'information | partiel | ○ Aucune mesure technique dans la baseline | – | – | Exécution du plan de réponse ; les actions techniques (isoler, effacer, révoquer les sessions) doivent avoir été exercées. |
| **A.5.27** Tirer des enseignements des incidents liés à la sécurité de l'information | organisationnel | ▢ Organisationnel | – | – | Retours d'expérience après incident et leur traduction en modifications de la baseline. |
| **A.5.28** Collecte des preuves | partiel | ○ Aucune mesure technique dans la baseline | – | – | Procédure forensique et durées de conservation ; la journalisation et l'EDR fournissent les éléments, la garantie de la chaîne de traçabilité est organisationnelle. |
| [**A.5.29** Sécurité de l'information durant une perturbation](#a529-sécurité-de-linformation-durant-une-perturbation) | partiel | ● Couvert (phase 1) | 2 | – | Planifier le niveau de sécurité en situation de crise (procédures d'urgence, comptes break-glass). |
| [**A.5.30** Préparation des TIC pour la continuité d'activité](#a530-préparation-des-tic-pour-la-continuité-dactivité) | partiel | ● Couvert (phase 1) | 2 | – | BIA, objectifs de reprise (RTO/RPO) et tests de continuité périodiques. |
| **A.5.31** Exigences légales, statutaires, réglementaires et contractuelles | organisationnel | ▢ Organisationnel | – | – | Tenir un registre des lois et réglementations applicables (NIS2/loi sur la cybersécurité, RGPD). |
| **A.5.32** Droits de propriété intellectuelle | organisationnel | ▢ Organisationnel | – | – | Gestion des licences et règles d'utilisation des logiciels et des contenus. |
| [**A.5.33** Protection des enregistrements](#a533-protection-des-enregistrements) | partiel | ◐ Seulement pilote, en attente ou groupe dédié | – | 1 | Définir les durées de conservation et la protection des enregistrements (politique de rétention, conservation des journaux). |
| [**A.5.34** Protection de la vie privée et des DCP](#a534-protection-de-la-vie-privée-et-des-dcp) | partiel | ● Couvert (phase 1) | 4 | 10 | Responsabilité RGPD : registre des traitements, AIPD pour la télémétrie, la surveillance et les fonctions d'IA, concertation avec le DPO et le comité social et économique. |
| **A.5.35** Révision indépendante de la sécurité de l'information | organisationnel | ▢ Organisationnel | – | – | Audit interne ou revue externe à intervalles planifiés. |
| **A.5.36** Conformité aux politiques, règles et normes de sécurité de l'information | partiel | ○ Aucune mesure technique dans la baseline | – | – | Revoir périodiquement la conformité ; les compliance policies et le reporting de conformité d'Intune fournissent la mesure, la revue et le suivi sont organisationnels. |
| **A.5.37** Procédures d'exploitation documentées | organisationnel | ▢ Organisationnel | – | – | Documenter les procédures d'administration (déploiement, exceptions, restauration) ; la documentation générée dans ce dépôt en fait partie. |

### 6 Mesures liées aux personnes

| Mesure | Réalisable | Statut | Phase 1 | Autres | Ce qui reste nécessaire sur le plan organisationnel |
|---|---|---|---:|---:|---|
| **A.6.1** Sélection des candidats | organisationnel | ▢ Organisationnel | – | – | Vérification des antécédents (extrait de casier judiciaire) proportionnée au risque de la fonction. |
| **A.6.2** Termes et conditions du contrat de travail | organisationnel | ▢ Organisationnel | – | – | Inclure les obligations de sécurité dans les conditions d'emploi. |
| **A.6.3** Sensibilisation, enseignement et formation en sécurité de l'information | organisationnel | ▢ Organisationnel | – | – | Programme de sensibilisation et formation (hameçonnage, mots de passe, usage de l'IA) ; également pour les organes de direction (NIS2 art. 20(2)). |
| **A.6.4** Processus disciplinaire | organisationnel | ▢ Organisationnel | – | – | Procédure formelle en cas de violation de la politique. |
| **A.6.5** Responsabilités après la fin ou le changement d'un emploi | partiel | ○ Aucune mesure technique dans la baseline | – | – | Processus de départ : révoquer les accès, restituer l'appareil ou l'effacer de manière sélective, confidentialité après le départ. |
| **A.6.6** Accords de confidentialité ou de non-divulgation | organisationnel | ▢ Organisationnel | – | – | Rédiger des accords de confidentialité et les faire signer. |
| **A.6.7** Travail à distance | partiel | ○ Aucune mesure technique dans la baseline | – | – | Politique de télétravail (lieu, écrans, réseaux) ; la technique protège l'appareil et l'accès. |
| **A.6.8** Déclaration des événements liés à la sécurité de l'information | organisationnel | ▢ Organisationnel | – | – | Mettre en place un canal de signalement pour les collaborateurs et le faire connaître. |

### 7 Mesures physiques

| Mesure | Réalisable | Statut | Phase 1 | Autres | Ce qui reste nécessaire sur le plan organisationnel |
|---|---|---|---:|---:|---|
| **A.7.1** Périmètres de sécurité physique | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité : définir les zones physiques. |
| **A.7.2** Les entrées physiques | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité : contrôle d'accès aux bâtiments et aux locaux. |
| **A.7.3** Sécurisation des bureaux, des salles et des installations | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité. |
| **A.7.4** Surveillance de la sécurité physique | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité : vidéosurveillance, suivi des alarmes. |
| **A.7.5** Protection contre les menaces physiques et environnementales | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité. |
| **A.7.6** Travail dans les zones sécurisées | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité. |
| [**A.7.7** Bureau propre et écran vide](#a77-bureau-propre-et-écran-vide) | technique | ● Couvert (phase 1) | 5 | 5 | Définir des règles de bureau propre pour le papier et les supports ; l'écran vide est imposé techniquement. |
| **A.7.8** Emplacement et protection du matériel | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité. |
| [**A.7.9** Sécurité des actifs hors des locaux](#a79-sécurité-des-actifs-hors-des-locaux) | partiel | ● Couvert (phase 1) | 2 | 5 | Règles pour l'emport du matériel, le fait de le laisser sans surveillance et la déclaration de perte ; le chiffrement et l'effacement à distance sont techniques. |
| [**A.7.10** Supports de stockage](#a710-supports-de-stockage) | partiel | ● Couvert (phase 1) | 1 | 3 | Politique relative aux supports amovibles et à la destruction sécurisée. |
| **A.7.11** Services supports | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité. |
| **A.7.12** Sécurité du câblage | organisationnel | ▢ Organisationnel | – | – | Hors du domaine endpoint/identité. |
| **A.7.13** Maintenance du matériel | organisationnel | ▢ Organisationnel | – | – | Maintenance et réparation par des personnes autorisées, avec des accords sur les données présentes sur l'appareil. |
| **A.7.14** Élimination ou recyclage sécurisé(e) du matériel | partiel | ○ Aucune mesure technique dans la baseline | – | – | Procédure de mise au rebut et de réutilisation (wipe/Autopilot Reset, certificat de destruction). |

### 8 Mesures technologiques

| Mesure | Réalisable | Statut | Phase 1 | Autres | Ce qui reste nécessaire sur le plan organisationnel |
|---|---|---|---:|---:|---|
| [**A.8.1** Terminaux finaux des utilisateurs](#a81-terminaux-finaux-des-utilisateurs) | technique | ● Couvert (phase 1) | 19 | 34 | Politique relative aux appareils professionnels et personnels (BYOD), enregistrement et règles d'utilisation. |
| [**A.8.2** Droits d'accès privilégiés](#a82-droits-daccès-privilégiés) | technique | ● Couvert (phase 1) | 6 | 3 | Processus d'attribution et de revue périodique des droits d'administration (PIM, access reviews). |
| [**A.8.3** Restriction d'accès à l'information](#a83-restriction-daccès-à-linformation) | partiel | ● Couvert (phase 1) | 1 | 1 | Matrice d'autorisations et droits sur les données (SharePoint/Teams) — en grande partie hors de cette baseline. |
| **A.8.4** Accès aux codes source | organisationnel | ▢ Organisationnel | – | – | Uniquement en cas de développement logiciel interne : gérer l'accès aux dépôts et aux outils de développement. |
| [**A.8.5** Authentification sécurisée](#a85-authentification-sécurisée) | technique | ● Couvert (phase 1) | 10 | 23 | Établir une politique d'authentification (quelles méthodes, exceptions, break-glass). |
| [**A.8.6** Dimensionnement](#a86-dimensionnement) | partiel | ● Couvert (phase 1) | 3 | – | Planification des capacités pour le réseau, les licences et le stockage. |
| [**A.8.7** Protection contre les programmes malveillants](#a87-protection-contre-les-programmes-malveillants) | technique | ● Couvert (phase 1) | 26 | 18 | Sensibilisation des utilisateurs et suivi des détections (la norme cite explicitement les deux). |
| [**A.8.8** Gestion des vulnérabilités techniques](#a88-gestion-des-vulnérabilités-techniques) | partiel | ● Couvert (phase 1) | 11 | 13 | Processus de gestion des vulnérabilités : suivre les sources, évaluer le risque, fixer des délais de correction, enregistrer les exceptions. |
| [**A.8.9** Gestion de la configuration](#a89-gestion-de-la-configuration) | partiel | ● Couvert (phase 1) | 18 | 10 | Ce dépôt est la configuration de référence ; la revue des modifications (PR) et le suivi des écarts dans le tenant restent un processus. |
| **A.8.10** Suppression des informations | partiel | ○ Aucune mesure technique dans la baseline | – | – | Politique de conservation et de suppression ; l'effacement sélectif et le wipe sont des outils techniques. |
| [**A.8.11** Masquage des données](#a811-masquage-des-données) | partiel | ◐ Seulement pilote, en attente ou groupe dédié | – | 1 | Politique définissant quand les données sont masquées ou pseudonymisées — principalement au niveau applicatif. |
| [**A.8.12** Prévention de la fuite de données](#a812-prévention-de-la-fuite-de-données) | partiel | ● Couvert (phase 1) | 13 | 13 | Politique DLP et classification ; Purview DLP est hors de cette baseline, les restrictions d'appareil et d'application y contribuent. |
| [**A.8.13** Sauvegarde des informations](#a813-sauvegarde-des-informations) | partiel | ● Couvert (phase 1) | 3 | – | Politique de sauvegarde des données M365 et tests de restauration périodiques ; la synchronisation OneDrive n'est pas une sauvegarde complète. |
| **A.8.14** Redondance des moyens de traitement de l'information | organisationnel | ▢ Organisationnel | – | – | Redondance des services et de l'infrastructure — hors du domaine endpoint/identité. |
| [**A.8.15** Journalisation](#a815-journalisation) | partiel | ● Couvert (phase 1) | 6 | 2 | Collecter, protéger, conserver et analyser les journaux de manière centralisée (SIEM/Defender XDR) ; la baseline ne règle que ce que l'appareil journalise. |
| [**A.8.16** Activités de surveillance](#a816-activités-de-surveillance) | partiel | ● Couvert (phase 1) | 4 | 8 | Suivi des alertes 24 h/24 et 7 j/7 ou pendant les heures de bureau, avec des critères d'escalade. |
| [**A.8.17** Synchronisation des horloges](#a817-synchronisation-des-horloges) | technique | ● Couvert (phase 1) | 2 | 1 | Définir une source de temps approuvée. |
| [**A.8.18** Utilisation de programmes utilitaires à privilèges](#a818-utilisation-de-programmes-utilitaires-à-privilèges) | partiel | ● Couvert (phase 1) | 1 | 3 | Registre des outils d'administration et d'assistance à distance autorisés et des personnes habilitées à les utiliser. |
| [**A.8.19** Installation de logiciels sur des systèmes opérationnels](#a819-installation-de-logiciels-sur-des-systèmes-opérationnels) | technique | ● Couvert (phase 1) | 10 | 8 | Processus d'approbation et de mise à disposition des logiciels (catalogue Company Portal). |
| [**A.8.20** Sécurité des réseaux](#a820-sécurité-des-réseaux) | partiel | ● Couvert (phase 1) | 13 | 13 | L'infrastructure réseau (pare-feu, Wi-Fi, VPN) est en grande partie hors de cette baseline. |
| [**A.8.21** Sécurité des services réseau](#a821-sécurité-des-services-réseau) | partiel | ● Couvert (phase 1) | 1 | 5 | Définir et surveiller les exigences relatives aux services et fournisseurs réseau. |
| **A.8.22** Cloisonnement des réseaux | organisationnel | ▢ Organisationnel | – | – | La segmentation réseau relève de l'infrastructure et ne peut pas être mise en place via des policies endpoint/identité. |
| [**A.8.23** Filtrage web](#a823-filtrage-web) | technique | ● Couvert (phase 1) | 3 | 4 | Définir les catégories et les exceptions (Defender Web Content Filtering dans le portail Defender). |
| [**A.8.24** Utilisation de la cryptographie](#a824-utilisation-de-la-cryptographie) | partiel | ● Couvert (phase 1) | 9 | 8 | Politique cryptographique et gestion des clés (qui a accès aux clés de récupération, rotation). |
| **A.8.25** Cycle de vie de développement sécurisé | organisationnel | ▢ Organisationnel | – | – | Uniquement en cas de développement interne. |
| **A.8.26** Exigences de sécurité des applications | organisationnel | ▢ Organisationnel | – | – | Exigences de sécurité lors du développement ou de l'acquisition d'applications. |
| **A.8.27** Principes d'ingénierie et d'architecture des systèmes sécurisés | organisationnel | ▢ Organisationnel | – | – | Définir les principes d'architecture (zero trust). |
| **A.8.28** Codage sécurisé | organisationnel | ▢ Organisationnel | – | – | Uniquement en cas de développement interne. |
| **A.8.29** Tests de sécurité dans le développement et l'acceptation | organisationnel | ▢ Organisationnel | – | – | Uniquement en cas de développement interne ; pour la baseline elle-même : la phase pilote (phase 2). |
| **A.8.30** Développement externalisé | organisationnel | ▢ Organisationnel | – | – | Uniquement en cas de développement externalisé. |
| **A.8.31** Séparation des environnements de développement, de test et de production | organisationnel | ▢ Organisationnel | – | – | Tenant de test ou groupe pilote à côté de la production. |
| [**A.8.32** Gestion des changements](#a832-gestion-des-changements) | partiel | ● Couvert (phase 1) | 2 | 4 | Définir et suivre une procédure de changement (revue de PR, phase pilote, communication) ; les anneaux de mise à jour en sont le volet technique. |
| **A.8.33** Informations de test | organisationnel | ▢ Organisationnel | – | – | Uniquement en cas de développement ou de tests internes. |
| **A.8.34** Protection des systèmes d'information en cours d'audit et de test | organisationnel | ▢ Organisationnel | – | – | Planifier les audits et les tests d'intrusion et les coordonner avec la direction responsable. |

### Mesures par contrôle

Toutes les policies par mesure, avec leur phase. La phase 5 est une alternative non déployée et ne compte pas pour le statut.

#### A.5.9 Inventaire des informations et autres actifs associés

- [`WIN - D - Enrollment Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.fr.md) (phase 2)
- [`MAC - D - Enrollment Profile Administrator User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.fr.md) (phase 4)
- [`MAC - D - Enrollment Profile Standard User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.fr.md) (phase 4)

#### A.5.10 Utilisation correcte de l'information et des autres actifs associés

- [`WIN - D - AI Tooling`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.fr.md) (phase 1)
- [`WIN - D - Windows AI Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.fr.md) (phase 1)
- [`WIN - U - Copilot`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Copilot.fr.md) (phase 1)
- [`AND - U - Corporate AI Restricted`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.fr.md) (phase 2)
- [`MAC - D - Apple Intelligence Restricted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.fr.md) (phase 2)
- [`MAC - D - Login Window`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.fr.md) (phase 2)
- [`WIN - D - Windows AI Features Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.fr.md) (phase 2)
- [`WIN - U - AI Usage Control Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.fr.md) (phase 2)
- [`IOS - D - Apple Intelligence Restricted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.fr.md) (phase 3)
- [`IOS - D - Apple Intelligence Permitted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.fr.md) (phase 5)
- [`MAC - D - Apple Intelligence Permitted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.fr.md) (phase 5)
- [`WIN - D - Windows AI Features Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.fr.md) (phase 5)
- [`WIN - D - Windows AI Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.fr.md) (phase 5)
- [`WIN - U - AI Usage Control Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.fr.md) (phase 5)

#### A.5.14 Transfert des informations

- [`MAC - D - Restrictions`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.fr.md) (phase 1)
- [`WIN - U - Microsoft Teams`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.fr.md) (phase 2)

#### A.5.15 Contrôle d'accès

- [`MAC - D - Accounts and Login`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.fr.md) (phase 1)
- [`WIN - D - Microsoft Accounts`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.fr.md) (phase 1)
- [`WIN - D - User Rights`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.fr.md) (phase 1)
- [`WIN - D - Access Control`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.fr.md) (phase 2)
- [`WIN - D - Account Lockout`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.fr.md) (phase 2)
- [`WIN - D - Enrollment Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.fr.md) (phase 2)
- [`WIN - D - Logon Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.fr.md) (phase 2)
- [`WIN - D - Remote Access Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.fr.md) (phase 2)
- [`WIN - U - Microsoft Teams`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.fr.md) (phase 2)
- [`IOS - U - Compliance Defender for Endpoint`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`IOS - U - Compliance Device Health`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md) (phase 3)
- [`WIN - U - Compliance Defender for Endpoint Risk`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md) (phase 3)

#### A.5.16 Gestion des identités

- [`MAC - D - Platform SSO`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.fr.md) (phase 1)
- [`WIN - D - Microsoft Accounts`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.fr.md) (phase 1)

#### A.5.17 Informations d'authentification

- [`MAC - D - Microsoft Edge Password Management`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.fr.md) (phase 1)
- [`MAC - D - Platform SSO`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.fr.md) (phase 1)
- [`MAC - U - Compliance Password`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) (phase 1)
- [`WIN - D - Device Lock`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.fr.md) (phase 1)
- [`WIN - D - Enhanced Phishing Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.fr.md) (phase 1)
- [`WIN - D - Legacy Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.fr.md) (phase 1)
- [`WIN - D - Login and Lock Screen`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.fr.md) (phase 1)
- [`WIN - D - Passwordless`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.fr.md) (phase 1)
- [`WIN - D - Settings Sync`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.fr.md) (phase 1)
- [`WIN - D - Windows LAPS`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.fr.md) (phase 1)
- [`WIN - U - Microsoft Edge Password Management`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Password_Management.fr.md) (phase 1)
- [`WIN - U - Windows User Experience`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.fr.md) (phase 1)
- [`MAC - D - Passcode and Screen Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.fr.md) (phase 2)
- [`MAC - D - Recovery Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.fr.md) (phase 2)
- [`WIN - D - Access Control`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.fr.md) (phase 2)
- [`WIN - D - Account Lockout`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.fr.md) (phase 2)
- [`WIN - D - Device Guard and Credential Guard`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md) (phase 2)
- [`WIN - D - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md) (phase 2)
- [`WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.fr.md) (phase 2)
- [`WIN - U - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) (phase 2)
- [`AND - U - Compliance Corporate Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md) (phase 3)
- [`AND - U - Compliance Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) (phase 3)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`AND - U - Work Profile Restrictions`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) (phase 3)
- [`IOS - D - Enterprise SSO`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) (phase 3)
- [`IOS - D - Passcode`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.fr.md) (phase 3)
- [`IOS - U - Compliance Password`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) (phase 3)
- [`WIN - D - Windows Hello for Business Multi User`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md) (phase 4)
- [`WIN - D - Windows Hello Passkey PIN Complexity Numeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.fr.md) (phase 5)
- [`WIN - D - Windows Hello PIN Complexity Alphanumeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.fr.md) (phase 5)
- [`WIN - D - Windows Hello PIN Complexity Numeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.fr.md) (phase 5)

#### A.5.19 Sécurité de l'information dans les relations avec les fournisseurs

- [`WIN - U - AI Usage Control Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.fr.md) (phase 2)
- [`WIN - U - AI Usage Control Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.fr.md) (phase 5)

#### A.5.29 Sécurité de l'information durant une perturbation

- [`WIN - D - Business Continuity`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.fr.md) (phase 1)
- [`WIN - D - Defender Ransomware Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.fr.md) (phase 1)

#### A.5.30 Préparation des TIC pour la continuité d'activité

- [`WIN - D - Business Continuity`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.fr.md) (phase 1)
- [`WIN - D - Storage Sense`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.fr.md) (phase 1)

#### A.5.33 Protection des enregistrements

- [`WIN - D - Windows AI Recall Boundaries`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.fr.md) (phase 3)

#### A.5.34 Protection de la vie privée et des DCP

- [`WIN - D - Data Minimisation`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Data_Minimisation.fr.md) (phase 1)
- [`WIN - D - Location and Privacy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Location_and_Privacy.fr.md) (phase 1)
- [`WIN - D - Privacy and Telemetry`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Privacy_and_Telemetry.fr.md) (phase 1)
- [`WIN - D - Windows AI Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.fr.md) (phase 1)
- [`AND - U - Corporate AI Restricted`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.fr.md) (phase 2)
- [`MAC - D - Apple Intelligence Restricted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.fr.md) (phase 2)
- [`MAC - D - Restrictions Hardening`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.fr.md) (phase 2)
- [`WIN - D - Windows AI Features Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.fr.md) (phase 2)
- [`IOS - D - Apple Intelligence Restricted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.fr.md) (phase 3)
- [`WIN - D - Windows AI Recall Boundaries`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.fr.md) (phase 3)
- [`IOS - D - Apple Intelligence Permitted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.fr.md) (phase 5)
- [`MAC - D - Apple Intelligence Permitted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.fr.md) (phase 5)
- [`WIN - D - Windows AI Features Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.fr.md) (phase 5)
- [`WIN - D - Windows AI Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.fr.md) (phase 5)

#### A.7.7 Bureau propre et écran vide

- [`MAC - U - Compliance Password`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) (phase 1)
- [`WIN - D - Device Lock`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.fr.md) (phase 1)
- [`WIN - D - Login and Lock Screen`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.fr.md) (phase 1)
- [`WIN - D - Power Management`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.fr.md) (phase 1)
- [`WIN - U - Windows User Experience`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.fr.md) (phase 1)
- [`MAC - D - Passcode and Screen Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.fr.md) (phase 2)
- [`MAC - D - Screensaver`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.fr.md) (phase 2)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`AND - U - Work Profile Restrictions`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) (phase 3)
- [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) (phase 4)

#### A.7.9 Sécurité des actifs hors des locaux

- [`WIN - D - BitLocker`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.fr.md) (phase 1)
- [`WIN - D - Wireless and Peripherals`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.fr.md) (phase 1)
- [`AND - U - Corporate Data Protection`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.fr.md) (phase 2)
- [`MAC - D - FileVault`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.fr.md) (phase 2)
- [`MAC - D - Recovery Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.fr.md) (phase 2)
- [`WIN - D - Kernel DMA Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.fr.md) (phase 2)
- [`IOS - D - Lock Screen`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.fr.md) (phase 4)

#### A.7.10 Supports de stockage

- [`WIN - D - BitLocker`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.fr.md) (phase 1)
- [`WIN - D - Removable Storage`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.fr.md) (phase 2)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`MAC - D - External Storage Read Only`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.fr.md) (phase 5)

#### A.8.1 Terminaux finaux des utilisateurs

- [`AND - U - App Protection`](../IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) (phase 1)
- [`IOS - U - App Protection`](../IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) (phase 1)
- [`MAC - D - Restrictions`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.fr.md) (phase 1)
- [`MAC - U - Compliance Device Health`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.fr.md) (phase 1)
- [`MAC - U - Compliance Device Security`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) (phase 1)
- [`MAC - U - Compliance Password`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) (phase 1)
- [`WIN - D - AI Tooling`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.fr.md) (phase 1)
- [`WIN - D - BitLocker`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.fr.md) (phase 1)
- [`WIN - D - Device Lock`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.fr.md) (phase 1)
- [`WIN - D - Power Management`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.fr.md) (phase 1)
- [`WIN - D - Windows AI Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.fr.md) (phase 1)
- [`WIN - U - Compliance Antispyware`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.fr.md) (phase 1)
- [`WIN - U - Compliance Antivirus`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.fr.md) (phase 1)
- [`WIN - U - Compliance BitLocker`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.fr.md) (phase 1)
- [`WIN - U - Compliance Code Integrity`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.fr.md) (phase 1)
- [`WIN - U - Compliance Firewall`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.fr.md) (phase 1)
- [`WIN - U - Compliance Secure Boot`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.fr.md) (phase 1)
- [`WIN - U - Compliance TPM`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.fr.md) (phase 1)
- [`WIN - U - Personal Data Encryption`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.fr.md) (phase 1)
- [`AND - U - Corporate Data Protection`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.fr.md) (phase 2)
- [`MAC - D - FileVault`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.fr.md) (phase 2)
- [`MAC - D - Passcode and Screen Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.fr.md) (phase 2)
- [`MAC - D - Recovery Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.fr.md) (phase 2)
- [`MAC - D - Screensaver`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.fr.md) (phase 2)
- [`WIN - D - Device Guard and Credential Guard`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md) (phase 2)
- [`WIN - D - Enrollment Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.fr.md) (phase 2)
- [`WIN - D - Kernel DMA Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.fr.md) (phase 2)
- [`WIN - D - Windows AI Features Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.fr.md) (phase 2)
- [`WIN - D - Windows Component Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.fr.md) (phase 2)
- [`WIN - U - AI Usage Control Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.fr.md) (phase 2)
- [`AND - U - Compliance Block Device Administrator`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.fr.md) (phase 3)
- [`AND - U - Compliance Corporate Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md) (phase 3)
- [`AND - U - Compliance Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) (phase 3)
- [`AND - U - Compliance Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) (phase 3)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`AND - U - Work Profile Restrictions`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) (phase 3)
- [`IOS - D - Data Protection`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.fr.md) (phase 3)
- [`IOS - D - Passcode`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.fr.md) (phase 3)
- [`IOS - U - Compliance Device Health`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md) (phase 3)
- [`IOS - U - Compliance Password`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) (phase 3)
- [`MAC - D - Wifi Corporate`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.fr.md) (phase 3)
- [`WIN - D - Wifi Corporate`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.fr.md) (phase 3)
- [`AND - D - Compliance Dedicated Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) (phase 4)
- [`IOS - D - Lock Screen`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.fr.md) (phase 4)
- [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) (phase 4)
- [`MAC - D - Enrollment Profile Administrator User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.fr.md) (phase 4)
- [`MAC - D - Enrollment Profile Standard User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.fr.md) (phase 4)
- [`WIN - D - Wireless Shared Devices`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.fr.md) (phase 4)
- [`MAC - D - Apple Intelligence Permitted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.fr.md) (phase 5)
- [`WIN - D - Windows AI Features Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.fr.md) (phase 5)
- [`WIN - D - Windows AI Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.fr.md) (phase 5)
- [`WIN - U - AI Usage Control Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.fr.md) (phase 5)
- [`WIN - U - Microsoft Outlook Cached Mode Off`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.fr.md) (phase 5)

#### A.8.2 Droits d'accès privilégiés

- [`WIN - D - Local Administrators`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Administrators.fr.md) (phase 1)
- [`WIN - D - Local Security Policies`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.fr.md) (phase 1)
- [`WIN - D - Microsoft Store`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.fr.md) (phase 1)
- [`WIN - D - User Rights`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.fr.md) (phase 1)
- [`WIN - D - Windows LAPS`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.fr.md) (phase 1)
- [`WIN - U - Microsoft Store`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.fr.md) (phase 1)
- [`WIN - D - Administrator Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.fr.md) (phase 2)
- [`MAC - D - Enrollment Profile Administrator User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.fr.md) (phase 4)
- [`MAC - D - Enrollment Profile Standard User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.fr.md) (phase 4)

#### A.8.3 Restriction d'accès à l'information

- [`AND - U - App Protection`](../IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) (phase 1)
- [`WIN - U - File Sharing Restrictions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.fr.md) (phase 2)

#### A.8.5 Authentification sécurisée

- [`AND - U - App Protection`](../IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) (phase 1)
- [`IOS - U - App Protection`](../IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) (phase 1)
- [`MAC - D - Accounts and Login`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.fr.md) (phase 1)
- [`MAC - D - Platform SSO`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.fr.md) (phase 1)
- [`MAC - U - Compliance Password`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) (phase 1)
- [`WIN - D - Device Lock`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.fr.md) (phase 1)
- [`WIN - D - Local Security Policies`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.fr.md) (phase 1)
- [`WIN - D - Passwordless`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.fr.md) (phase 1)
- [`WIN - D - Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.fr.md) (phase 1)
- [`WIN - D - Windows Hello Cloud Kerberos Trust`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.fr.md) (phase 1)
- [`MAC - D - Login Window`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.fr.md) (phase 2)
- [`MAC - D - Passcode and Screen Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.fr.md) (phase 2)
- [`MAC - D - Screensaver`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.fr.md) (phase 2)
- [`WIN - D - Access Control`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.fr.md) (phase 2)
- [`WIN - D - Account Lockout`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.fr.md) (phase 2)
- [`WIN - D - Disable NTLM`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.fr.md) (phase 2)
- [`WIN - D - Logon Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.fr.md) (phase 2)
- [`WIN - D - Network Authentication Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.fr.md) (phase 2)
- [`WIN - D - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md) (phase 2)
- [`WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.fr.md) (phase 2)
- [`WIN - U - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) (phase 2)
- [`AND - U - Compliance Corporate Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md) (phase 3)
- [`AND - U - Compliance Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) (phase 3)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`AND - U - Work Profile Restrictions`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) (phase 3)
- [`IOS - D - Enterprise SSO`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) (phase 3)
- [`IOS - D - Passcode`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.fr.md) (phase 3)
- [`IOS - U - Compliance Password`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) (phase 3)
- [`MAC - D - Azure Files Cloud Kerberos`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.fr.md) (phase 3)
- [`WIN - D - Windows Hello for Business Multi User`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md) (phase 4)
- [`WIN - D - Windows Hello Passkey PIN Complexity Numeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.fr.md) (phase 5)
- [`WIN - D - Windows Hello PIN Complexity Alphanumeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.fr.md) (phase 5)
- [`WIN - D - Windows Hello PIN Complexity Numeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.fr.md) (phase 5)

#### A.8.6 Dimensionnement

- [`WIN - D - Delivery Optimisation`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Delivery_Optimisation.fr.md) (phase 1)
- [`WIN - D - Endpoint Analytics`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Endpoint_Analytics.fr.md) (phase 1)
- [`WIN - D - Storage Sense`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.fr.md) (phase 1)

#### A.8.7 Protection contre les programmes malveillants

- [`MAC - D - Defender Antivirus`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.fr.md) (phase 1)
- [`MAC - D - Defender for Endpoint`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.fr.md) (phase 1)
- [`MAC - D - Firewall and Gatekeeper`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.fr.md) (phase 1)
- [`MAC - D - Microsoft Edge Security`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`MAC - U - Compliance Device Health`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.fr.md) (phase 1)
- [`WIN - D - Attack Surface Reduction`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.fr.md) (phase 1)
- [`WIN - D - Defender Additional Configuration`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Additional_Configuration.fr.md) (phase 1)
- [`WIN - D - Defender Antivirus`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Antivirus.fr.md) (phase 1)
- [`WIN - D - Defender EDR Policy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.fr.md) (phase 1)
- [`WIN - D - Defender Ransomware Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.fr.md) (phase 1)
- [`WIN - D - Defender Security Experience`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Security_Experience.fr.md) (phase 1)
- [`WIN - D - Defender Update Ring 3 Production`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.fr.md) (phase 1)
- [`WIN - D - Internet Explorer Legacy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.fr.md) (phase 1)
- [`WIN - D - Microsoft Edge Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`WIN - D - Microsoft Office Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.fr.md) (phase 1)
- [`WIN - D - Security Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.fr.md) (phase 1)
- [`WIN - D - Threat Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.fr.md) (phase 1)
- [`WIN - D - Windows Firewall Rules`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.fr.md) (phase 1)
- [`WIN - U - Attachment Scanning`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Attachment_Scanning.fr.md) (phase 1)
- [`WIN - U - Compliance Antispyware`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.fr.md) (phase 1)
- [`WIN - U - Compliance Antivirus`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.fr.md) (phase 1)
- [`WIN - U - Compliance Code Integrity`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.fr.md) (phase 1)
- [`WIN - U - Compliance Defender Real Time Protection`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.fr.md) (phase 1)
- [`WIN - U - Compliance Defender Security Intelligence`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.fr.md) (phase 1)
- [`WIN - U - Compliance Secure Boot`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.fr.md) (phase 1)
- [`WIN - U - Microsoft Office Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.fr.md) (phase 1)
- [`WIN - D - Device Guard and Credential Guard`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md) (phase 2)
- [`WIN - D - Printing Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.fr.md) (phase 2)
- [`WIN - D - Script File Associations`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.fr.md) (phase 2)
- [`AND - U - Compliance Corporate Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md) (phase 3)
- [`AND - U - Compliance Corporate Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md) (phase 3)
- [`AND - U - Compliance Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`AND - U - Compliance Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) (phase 3)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`IOS - U - Compliance Defender for Endpoint`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`IOS - U - Compliance Device Health`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md) (phase 3)
- [`WIN - U - Compliance Defender for Endpoint Risk`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md) (phase 3)
- [`IOS - D - Defender for Endpoint Onboarding Supervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.fr.md) (phase 4)
- [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.fr.md) (phase 4)
- [`WIN - D - Defender ASR Policy Audit Mode`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.fr.md) (phase 4)
- [`WIN - D - Defender Update Ring 1 Pilot`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.fr.md) (phase 4)
- [`WIN - D - Defender Update Ring 2 UAT`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.fr.md) (phase 4)
- [`WIN - D - Defender AV Policy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_AV_Policy.fr.md) (phase 5)
- [`WIN - D - Defender for Endpoint EDR`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.fr.md) (phase 5)

#### A.8.8 Gestion des vulnérabilités techniques

- [`MAC - D - Microsoft AutoUpdate`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.fr.md) (phase 1)
- [`MAC - U - Microsoft Edge Updates`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.fr.md) (phase 1)
- [`WIN - D - Attack Surface Reduction`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.fr.md) (phase 1)
- [`WIN - D - Automatic Restart Sign-On`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Automatic_Restart_Sign_On.fr.md) (phase 1)
- [`WIN - D - Defender Update Ring 3 Production`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.fr.md) (phase 1)
- [`WIN - D - Microsoft Edge Updates`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Updates.fr.md) (phase 1)
- [`WIN - D - Microsoft Office Updates`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.fr.md) (phase 1)
- [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.fr.md) (phase 1)
- [`WIN - D - Threat Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.fr.md) (phase 1)
- [`WIN - D - Update Reports and Telemetry`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.fr.md) (phase 1)
- [`WIN - D - Windows Update Ring 3 Production`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.fr.md) (phase 1)
- [`MAC - D - Software Updates`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.fr.md) (phase 2)
- [`MAC - U - Compliance OS Version`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.fr.md) (phase 2)
- [`WIN - U - Compliance OS Version`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.fr.md) (phase 2)
- [`AND - D - System Updates`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_D_System_Updates.fr.md) (phase 3)
- [`AND - U - Compliance Corporate Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md) (phase 3)
- [`AND - U - Compliance Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) (phase 3)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`IOS - D - Software Updates`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.fr.md) (phase 3)
- [`AND - D - Compliance Dedicated Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) (phase 4)
- [`WIN - D - Defender Update Ring 1 Pilot`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.fr.md) (phase 4)
- [`WIN - D - Defender Update Ring 2 UAT`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.fr.md) (phase 4)
- [`WIN - D - Windows Update Ring 1 Pilot`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.fr.md) (phase 4)
- [`WIN - D - Windows Update Ring 2 UAT`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.fr.md) (phase 4)

#### A.8.9 Gestion de la configuration

- [`MAC - D - Microsoft Office`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Office.fr.md) (phase 1)
- [`MAC - D - Microsoft OneDrive`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_OneDrive.fr.md) (phase 1)
- [`WIN - D - Cloud Optimized Content`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cloud_Optimized_Content.fr.md) (phase 1)
- [`WIN - D - Config Refresh`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Config_Refresh.fr.md) (phase 1)
- [`WIN - D - Internet Explorer Legacy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.fr.md) (phase 1)
- [`WIN - D - Legacy Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.fr.md) (phase 1)
- [`WIN - D - Local Security Policies`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.fr.md) (phase 1)
- [`WIN - D - Microsoft Edge Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`WIN - D - Microsoft Office Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.fr.md) (phase 1)
- [`WIN - D - Security Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.fr.md) (phase 1)
- [`WIN - D - Windows Feature Configuration`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Feature_Configuration.fr.md) (phase 1)
- [`WIN - D - Windows Sandbox`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Sandbox.fr.md) (phase 1)
- [`WIN - D - Windows Subsystem for Linux`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.fr.md) (phase 1)
- [`WIN - U - Microsoft Edge User Experience`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_User_Experience.fr.md) (phase 1)
- [`WIN - U - Microsoft Office Experience`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Experience.fr.md) (phase 1)
- [`WIN - U - Microsoft Office Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.fr.md) (phase 1)
- [`WIN - U - Microsoft Outlook`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook.fr.md) (phase 1)
- [`WIN - U - Windows Spotlight`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Spotlight.fr.md) (phase 1)
- [`MAC - D - Restrictions Hardening`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.fr.md) (phase 2)
- [`WIN - D - Windows Component Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.fr.md) (phase 2)
- [`WIN - U - Microsoft Edge Management`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Management.fr.md) (phase 2)
- [`WIN - U - Microsoft Outlook Cached Mode Managed`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.fr.md) (phase 2)
- [`AND - U - Compliance Block Device Administrator`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.fr.md) (phase 3)
- [`IOS - D - Software Updates`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.fr.md) (phase 3)
- [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) (phase 4)
- [`WIN - D - Microsoft Edge Search Engine`](../IntuneTemplate/WIN/AdministrativeTemplates/Baseline_WIN_D_Microsoft_Edge_Search_Engine.fr.md) (phase 5)
- [`WIN - U - Microsoft Outlook Cached Mode Default`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.fr.md) (phase 5)
- [`WIN - U - Microsoft Outlook Cached Mode Off`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.fr.md) (phase 5)

#### A.8.11 Masquage des données

- [`WIN - D - Windows AI Recall Boundaries`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.fr.md) (phase 3)

#### A.8.12 Prévention de la fuite de données

- [`AND - U - App Protection`](../IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) (phase 1)
- [`IOS - U - App Protection`](../IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) (phase 1)
- [`MAC - D - Restrictions`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.fr.md) (phase 1)
- [`MAC - U - Microsoft Edge Profiles and Sync`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.fr.md) (phase 1)
- [`MAC - U - Microsoft OneDrive KFM`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.fr.md) (phase 1)
- [`WIN - D - AI Tooling`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.fr.md) (phase 1)
- [`WIN - D - Microsoft Accounts`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.fr.md) (phase 1)
- [`WIN - D - Microsoft OneDrive`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.fr.md) (phase 1)
- [`WIN - D - Privacy and Telemetry`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Privacy_and_Telemetry.fr.md) (phase 1)
- [`WIN - D - Windows AI Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.fr.md) (phase 1)
- [`WIN - D - Windows Feature Configuration`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Feature_Configuration.fr.md) (phase 1)
- [`WIN - U - Microsoft Edge Profiles and Sync`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.fr.md) (phase 1)
- [`WIN - U - Microsoft OneDrive`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_OneDrive.fr.md) (phase 1)
- [`AND - U - Corporate AI Restricted`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.fr.md) (phase 2)
- [`AND - U - Corporate Data Protection`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.fr.md) (phase 2)
- [`MAC - D - Apple Intelligence Restricted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.fr.md) (phase 2)
- [`WIN - D - Removable Storage`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.fr.md) (phase 2)
- [`WIN - U - File Sharing Restrictions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.fr.md) (phase 2)
- [`WIN - U - Microsoft Teams`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.fr.md) (phase 2)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`AND - U - Work Profile Restrictions`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) (phase 3)
- [`IOS - D - Apple Intelligence Restricted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.fr.md) (phase 3)
- [`IOS - D - Data Protection`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.fr.md) (phase 3)
- [`WIN - D - Windows AI Recall Boundaries`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.fr.md) (phase 3)
- [`IOS - D - Apple Intelligence Permitted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.fr.md) (phase 5)
- [`MAC - D - External Storage Read Only`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.fr.md) (phase 5)

#### A.8.13 Sauvegarde des informations

- [`MAC - U - Microsoft OneDrive KFM`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.fr.md) (phase 1)
- [`WIN - D - Microsoft OneDrive`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.fr.md) (phase 1)
- [`WIN - D - Settings Sync`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.fr.md) (phase 1)

#### A.8.15 Journalisation

- [`MAC - D - Time Server`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Time_Server.fr.md) (phase 1)
- [`WIN - D - Audit and Event Logging`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_and_Event_Logging.fr.md) (phase 1)
- [`WIN - D - Audit Policy Enforcement`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.fr.md) (phase 1)
- [`WIN - D - Logging`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.fr.md) (phase 1)
- [`WIN - D - Security Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.fr.md) (phase 1)
- [`WIN - D - Windows Firewall`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.fr.md) (phase 1)
- [`WIN - D - Security Log Monitoring`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.fr.md) (phase 2)
- [`WIN - D - Windows Event Forwarding`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.fr.md) (phase 3)

#### A.8.16 Activités de surveillance

- [`MAC - D - Defender for Endpoint`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.fr.md) (phase 1)
- [`WIN - D - Audit Policy Enforcement`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.fr.md) (phase 1)
- [`WIN - D - Defender EDR Policy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.fr.md) (phase 1)
- [`WIN - D - Logging`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.fr.md) (phase 1)
- [`WIN - D - Security Log Monitoring`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.fr.md) (phase 2)
- [`AND - U - Compliance Corporate Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md) (phase 3)
- [`AND - U - Compliance Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`IOS - U - Compliance Defender for Endpoint`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`WIN - D - Windows Event Forwarding`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.fr.md) (phase 3)
- [`WIN - U - Compliance Defender for Endpoint Risk`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md) (phase 3)
- [`WIN - D - Defender ASR Policy Audit Mode`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.fr.md) (phase 4)
- [`WIN - D - Defender for Endpoint EDR`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.fr.md) (phase 5)

#### A.8.17 Synchronisation des horloges

- [`MAC - D - Time Server`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Time_Server.fr.md) (phase 1)
- [`WIN - D - Timezone`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Timezone.fr.md) (phase 1)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)

#### A.8.18 Utilisation de programmes utilitaires à privilèges

- [`WIN - D - User Rights`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.fr.md) (phase 1)
- [`MAC - D - Recovery Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.fr.md) (phase 2)
- [`MAC - D - Privacy Preferences`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.fr.md) (phase 4)
- [`MAC - D - Screen Recording`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Screen_Recording.fr.md) (phase 4)

#### A.8.19 Installation de logiciels sur des systèmes opérationnels

- [`MAC - D - Firewall and Gatekeeper`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.fr.md) (phase 1)
- [`MAC - U - Compliance Device Security`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) (phase 1)
- [`MAC - U - Microsoft Edge Extensions`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.fr.md) (phase 1)
- [`WIN - D - Microsoft Store`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.fr.md) (phase 1)
- [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.fr.md) (phase 1)
- [`WIN - D - Windows Package Manager`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Package_Manager.fr.md) (phase 1)
- [`WIN - D - Windows Subsystem for Linux`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.fr.md) (phase 1)
- [`WIN - U - Copilot`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Copilot.fr.md) (phase 1)
- [`WIN - U - Microsoft Edge Extensions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Extensions.fr.md) (phase 1)
- [`WIN - U - Microsoft Store`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.fr.md) (phase 1)
- [`MAC - D - Restrictions Hardening`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.fr.md) (phase 2)
- [`MAC - D - Software Updates`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.fr.md) (phase 2)
- [`MAC - U - Compliance OS Version`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.fr.md) (phase 2)
- [`WIN - D - In-Box App Removal`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.fr.md) (phase 2)
- [`WIN - D - Printing Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.fr.md) (phase 2)
- [`WIN - U - Compliance OS Version`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.fr.md) (phase 2)
- [`AND - U - Compliance Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) (phase 3)
- [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) (phase 4)

#### A.8.20 Sécurité des réseaux

- [`MAC - D - Firewall and Gatekeeper`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.fr.md) (phase 1)
- [`MAC - D - Microsoft Edge Security`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`MAC - U - Compliance Device Security`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) (phase 1)
- [`WIN - D - Defender Ransomware Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.fr.md) (phase 1)
- [`WIN - D - Legacy Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.fr.md) (phase 1)
- [`WIN - D - Local Security Policies`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.fr.md) (phase 1)
- [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.fr.md) (phase 1)
- [`WIN - D - Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.fr.md) (phase 1)
- [`WIN - D - Security Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.fr.md) (phase 1)
- [`WIN - D - Windows Firewall`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.fr.md) (phase 1)
- [`WIN - D - Windows Firewall Rules`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.fr.md) (phase 1)
- [`WIN - D - Wireless and Peripherals`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.fr.md) (phase 1)
- [`WIN - U - Compliance Firewall`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.fr.md) (phase 1)
- [`WIN - D - Logon Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.fr.md) (phase 2)
- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.fr.md) (phase 2)
- [`WIN - D - Network Authentication Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.fr.md) (phase 2)
- [`WIN - D - Printing Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.fr.md) (phase 2)
- [`WIN - D - Remote Access Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.fr.md) (phase 2)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`MAC - D - Wifi Corporate`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.fr.md) (phase 3)
- [`MAC - D - Wifi Guest`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.fr.md) (phase 3)
- [`WIN - D - Wifi Corporate`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.fr.md) (phase 3)
- [`WIN - D - Wifi Guest`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.fr.md) (phase 3)
- [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) (phase 4)
- [`WIN - D - Wireless Shared Devices`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.fr.md) (phase 4)
- [`WIN - D - Microsoft Edge DNS over HTTPS Secure`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.fr.md) (phase 5)

#### A.8.21 Sécurité des services réseau

- [`WIN - D - Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.fr.md) (phase 1)
- [`WIN - D - Remote Access Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.fr.md) (phase 2)
- [`MAC - D - Wifi Corporate`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.fr.md) (phase 3)
- [`MAC - D - Wifi Guest`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.fr.md) (phase 3)
- [`WIN - D - Wifi Corporate`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.fr.md) (phase 3)
- [`WIN - D - Wifi Guest`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.fr.md) (phase 3)

#### A.8.23 Filtrage web

- [`MAC - D - Microsoft Edge Security`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`WIN - D - Enhanced Phishing Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.fr.md) (phase 1)
- [`WIN - D - Microsoft Edge Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`WIN - U - AI Usage Control Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.fr.md) (phase 2)
- [`IOS - D - Defender for Endpoint Onboarding Supervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.fr.md) (phase 4)
- [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.fr.md) (phase 4)
- [`WIN - U - AI Usage Control Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.fr.md) (phase 5)

#### A.8.24 Utilisation de la cryptographie

- [`AND - U - App Protection`](../IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) (phase 1)
- [`IOS - U - App Protection`](../IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) (phase 1)
- [`MAC - U - Compliance Device Security`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) (phase 1)
- [`WIN - D - BitLocker`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.fr.md) (phase 1)
- [`WIN - D - Microsoft Edge Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`WIN - D - Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.fr.md) (phase 1)
- [`WIN - U - Compliance BitLocker`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.fr.md) (phase 1)
- [`WIN - U - Compliance TPM`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.fr.md) (phase 1)
- [`WIN - U - Personal Data Encryption`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.fr.md) (phase 1)
- [`MAC - D - FileVault`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.fr.md) (phase 2)
- [`WIN - D - Cryptography`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.fr.md) (phase 2)
- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.fr.md) (phase 2)
- [`AND - U - Compliance Corporate Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md) (phase 3)
- [`AND - U - Compliance Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) (phase 3)
- [`IOS - D - Data Protection`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.fr.md) (phase 3)
- [`AND - D - Compliance Dedicated Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) (phase 4)
- [`WIN - D - Microsoft Edge DNS over HTTPS Secure`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.fr.md) (phase 5)

#### A.8.32 Gestion des changements

- [`WIN - D - Defender Update Ring 3 Production`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.fr.md) (phase 1)
- [`WIN - D - Windows Update Ring 3 Production`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.fr.md) (phase 1)
- [`WIN - D - Defender Update Ring 1 Pilot`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.fr.md) (phase 4)
- [`WIN - D - Defender Update Ring 2 UAT`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.fr.md) (phase 4)
- [`WIN - D - Windows Update Ring 1 Pilot`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.fr.md) (phase 4)
- [`WIN - D - Windows Update Ring 2 UAT`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.fr.md) (phase 4)

## NIS2 art. 21, paragraphe 2

Source : Directive (UE) 2022/2555 (NIS2), art. 21, paragraphe 2 ; précisée par le règlement d'exécution (UE) 2024/2690, annexe. Pour chaque point : ce que la baseline fait techniquement, de quelles policies il s'agit,
comment le démontrer, et ce que l'organisation doit régler elle-même. L'article 21 exige des mesures
*appropriées et proportionnées* fondées sur une analyse des risques ; cette baseline est une mise en œuvre argumentée
de la partie technique, pas un substitut à cette appréciation.

### art. 21(2)(a) politiques relatives à l'analyse des risques et à la sécurité des systèmes d'information

*Les politiques relatives à l'analyse des risques et à la sécurité des systèmes d'information* — précisé dans annexe §1–2 du règlement d'exécution.

**Mise en œuvre technique.** Cette baseline est une déclinaison de la politique de sécurité des appareils et des accès, mais pas une analyse des risques.

**Intune, phase 1 (0)**

- aucune

**Preuve.** Aucune mesure technique en phase 1, donc pas non plus de preuve technique.

**Nécessaire sur le plan organisationnel**

- Analyse des risques (par exemple une BIA et un registre des risques) justifiant le choix des mesures
- Politique de sécurité des réseaux et de l'information, approuvée par l'organe de direction (art. 20)
- Révision périodique de la politique et de l'analyse des risques
- Registre des risques résiduels acceptés et des choix de l'organisation (voir Choix de l'organisation dans ce document)

### art. 21(2)(b) gestion des incidents

*La gestion des incidents* — précisé dans annexe §3 du règlement d'exécution.

**Mise en œuvre technique.** L'onboarding EDR, la journalisation d'audit, la journalisation PowerShell et les policies CA basées sur le risque fournissent la détection et les moyens d'intervenir.

**Intune, phase 1 (8)**

- [`MAC - D - Defender for Endpoint`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.fr.md) (phase 1)
- [`MAC - D - Time Server`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Time_Server.fr.md) (phase 1)
- [`WIN - D - Audit and Event Logging`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_and_Event_Logging.fr.md) (phase 1)
- [`WIN - D - Audit Policy Enforcement`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Audit_Policy_Enforcement.fr.md) (phase 1)
- [`WIN - D - Defender EDR Policy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_EDR_Policy.fr.md) (phase 1)
- [`WIN - D - Logging`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logging.fr.md) (phase 1)
- [`WIN - D - Security Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.fr.md) (phase 1)
- [`WIN - D - Timezone`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Timezone.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (6)**

- [`WIN - D - Security Log Monitoring`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.fr.md) (phase 2)
- [`AND - U - Compliance Corporate Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md) (phase 3)
- [`AND - U - Compliance Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`IOS - U - Compliance Defender for Endpoint`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`WIN - D - Windows Event Forwarding`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.fr.md) (phase 3)
- [`WIN - U - Compliance Defender for Endpoint Risk`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md) (phase 3)

**Alternative, non déployée (1)**: `WIN - D - Defender for Endpoint EDR`

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Plan de réponse aux incidents avec rôles et procédures opérationnelles
- Procédure de notification au CSIRT/à l'autorité de supervision dans les 24 heures (alerte précoce), 72 heures et 1 mois (art. 23)
- Suivi des alertes (qui surveille quand, escalade)
- Stockage centralisé des journaux et durées de conservation
- Retour d'expérience après incident

### art. 21(2)(c) continuité des activités et gestion des crises

*La continuité des activités, par exemple la gestion des sauvegardes et la reprise des activités, et la gestion des crises* — précisé dans annexe §4 du règlement d'exécution.

**Mise en œuvre technique.** OneDrive Known Folder Move, la sauvegarde Windows, Quick Machine Recovery et un réseau de secours y contribuent ; ils ne remplacent pas une sauvegarde des données M365.

**Intune, phase 1 (6)**

- [`MAC - U - Microsoft OneDrive KFM`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_OneDrive_KFM.fr.md) (phase 1)
- [`WIN - D - Business Continuity`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Business_Continuity.fr.md) (phase 1)
- [`WIN - D - Defender Ransomware Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.fr.md) (phase 1)
- [`WIN - D - Microsoft OneDrive`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_OneDrive.fr.md) (phase 1)
- [`WIN - D - Settings Sync`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Settings_Sync.fr.md) (phase 1)
- [`WIN - D - Storage Sense`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Storage_Sense.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (2)**

- [`MAC - D - Wifi Guest`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.fr.md) (phase 3)
- [`WIN - D - Wifi Guest`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.fr.md) (phase 3)

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Plan de continuité et de reprise d'activité avec RTO/RPO
- Politique de sauvegarde des données M365 et applicatives, avec tests de restauration périodiques
- Organisation de crise et plan de communication
- Procédure break-glass pour le tenant

### art. 21(2)(d) sécurité de la chaîne d'approvisionnement

*La sécurité de la chaîne d'approvisionnement, y compris les aspects liés à la sécurité concernant les relations avec les fournisseurs* — précisé dans annexe §5 du règlement d'exécution.

**Mise en œuvre technique.** Techniquement, uniquement le blocage des services et sources logicielles non approuvés (services d'IA, extensions, sources logicielles).

**Intune, phase 1 (2)**

- [`WIN - D - AI Tooling`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_AI_Tooling.fr.md) (phase 1)
- [`WIN - D - Windows AI Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Restricted.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (5)**

- [`AND - U - Corporate AI Restricted`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.fr.md) (phase 2)
- [`MAC - D - Apple Intelligence Restricted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.fr.md) (phase 2)
- [`WIN - D - Windows AI Features Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.fr.md) (phase 2)
- [`WIN - U - AI Usage Control Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.fr.md) (phase 2)
- [`IOS - D - Apple Intelligence Restricted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.fr.md) (phase 3)

**Alternative, non déployée (5)**: `IOS - D - Apple Intelligence Permitted`, `MAC - D - Apple Intelligence Permitted`, `WIN - D - Windows AI Features Permitted`, `WIN - D - Windows AI Permitted`, `WIN - U - AI Usage Control Permitted`

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Registre des fournisseurs avec classification des risques
- Exigences de sécurité dans les contrats et les accords de sous-traitance
- Revue périodique des fournisseurs critiques (Microsoft, MSP, outils d'assistance à distance)
- Décision sur les services d'IA et cloud autorisés

### art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités

*La sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement et la divulgation des vulnérabilités* — précisé dans annexe §6 du règlement d'exécution.

**Mise en œuvre technique.** Le cœur de la baseline : gestion de la configuration, gestion des correctifs (anneaux de mise à jour), durcissement, protection contre les logiciels malveillants, sécurité réseau sur l'appareil et versions minimales de l'OS.

**Intune, phase 1 (48)**

- [`MAC - D - Defender Antivirus`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_Antivirus.fr.md) (phase 1)
- [`MAC - D - Defender for Endpoint`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Defender_for_Endpoint.fr.md) (phase 1)
- [`MAC - D - Firewall and Gatekeeper`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Firewall_and_Gatekeeper.fr.md) (phase 1)
- [`MAC - D - Microsoft AutoUpdate`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_AutoUpdate.fr.md) (phase 1)
- [`MAC - D - Microsoft Edge Security`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`MAC - U - Compliance Device Health`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.fr.md) (phase 1)
- [`MAC - U - Compliance Device Security`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) (phase 1)
- [`MAC - U - Microsoft Edge Extensions`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Extensions.fr.md) (phase 1)
- [`MAC - U - Microsoft Edge Updates`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Updates.fr.md) (phase 1)
- [`WIN - D - Attack Surface Reduction`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Attack_Surface_Reduction.fr.md) (phase 1)
- [`WIN - D - Automatic Restart Sign-On`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Automatic_Restart_Sign_On.fr.md) (phase 1)
- [`WIN - D - Config Refresh`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Config_Refresh.fr.md) (phase 1)
- [`WIN - D - Defender Additional Configuration`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Additional_Configuration.fr.md) (phase 1)
- [`WIN - D - Defender Antivirus`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Antivirus.fr.md) (phase 1)
- [`WIN - D - Defender Ransomware Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Ransomware_Protection.fr.md) (phase 1)
- [`WIN - D - Defender Security Experience`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Security_Experience.fr.md) (phase 1)
- [`WIN - D - Defender Update Ring 3 Production`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_3_Production.fr.md) (phase 1)
- [`WIN - D - Internet Explorer Legacy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Internet_Explorer_Legacy.fr.md) (phase 1)
- [`WIN - D - Legacy Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Legacy_Hardening.fr.md) (phase 1)
- [`WIN - D - Local Security Policies`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.fr.md) (phase 1)
- [`WIN - D - Microsoft Edge Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`WIN - D - Microsoft Edge Updates`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_Updates.fr.md) (phase 1)
- [`WIN - D - Microsoft Office Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Security.fr.md) (phase 1)
- [`WIN - D - Microsoft Office Updates`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Office_Updates.fr.md) (phase 1)
- [`WIN - D - Microsoft Store`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Store.fr.md) (phase 1)
- [`WIN - D - Printing`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing.fr.md) (phase 1)
- [`WIN - D - Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.fr.md) (phase 1)
- [`WIN - D - Security Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Hardening.fr.md) (phase 1)
- [`WIN - D - Threat Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Threat_Protection.fr.md) (phase 1)
- [`WIN - D - Update Reports and Telemetry`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.fr.md) (phase 1)
- [`WIN - D - Windows Firewall`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall.fr.md) (phase 1)
- [`WIN - D - Windows Firewall Rules`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Firewall_Rules.fr.md) (phase 1)
- [`WIN - D - Windows Package Manager`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Package_Manager.fr.md) (phase 1)
- [`WIN - D - Windows Sandbox`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Sandbox.fr.md) (phase 1)
- [`WIN - D - Windows Subsystem for Linux`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Subsystem_for_Linux.fr.md) (phase 1)
- [`WIN - D - Windows Update Ring 3 Production`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_3_Production.fr.md) (phase 1)
- [`WIN - D - Wireless and Peripherals`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_and_Peripherals.fr.md) (phase 1)
- [`WIN - U - Attachment Scanning`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Attachment_Scanning.fr.md) (phase 1)
- [`WIN - U - Compliance Antispyware`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.fr.md) (phase 1)
- [`WIN - U - Compliance Antivirus`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.fr.md) (phase 1)
- [`WIN - U - Compliance Code Integrity`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.fr.md) (phase 1)
- [`WIN - U - Compliance Defender Real Time Protection`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.fr.md) (phase 1)
- [`WIN - U - Compliance Defender Security Intelligence`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.fr.md) (phase 1)
- [`WIN - U - Compliance Firewall`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.fr.md) (phase 1)
- [`WIN - U - Compliance Secure Boot`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.fr.md) (phase 1)
- [`WIN - U - Microsoft Edge Extensions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Extensions.fr.md) (phase 1)
- [`WIN - U - Microsoft Office Security`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Office_Security.fr.md) (phase 1)
- [`WIN - U - Microsoft Store`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Store.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (35)**

- [`MAC - D - Restrictions Hardening`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.fr.md) (phase 2)
- [`MAC - D - Software Updates`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.fr.md) (phase 2)
- [`MAC - U - Compliance OS Version`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.fr.md) (phase 2)
- [`WIN - D - Device Guard and Credential Guard`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md) (phase 2)
- [`WIN - D - In-Box App Removal`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.fr.md) (phase 2)
- [`WIN - D - Kernel DMA Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.fr.md) (phase 2)
- [`WIN - D - Network Authentication Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.fr.md) (phase 2)
- [`WIN - D - Printing Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.fr.md) (phase 2)
- [`WIN - D - Remote Access Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.fr.md) (phase 2)
- [`WIN - D - Script File Associations`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.fr.md) (phase 2)
- [`WIN - D - Windows Component Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.fr.md) (phase 2)
- [`WIN - U - Compliance OS Version`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.fr.md) (phase 2)
- [`AND - D - System Updates`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_D_System_Updates.fr.md) (phase 3)
- [`AND - U - Compliance Corporate Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md) (phase 3)
- [`AND - U - Compliance Corporate Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md) (phase 3)
- [`AND - U - Compliance Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`AND - U - Compliance Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) (phase 3)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`IOS - D - Software Updates`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.fr.md) (phase 3)
- [`IOS - U - Compliance Defender for Endpoint`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md) (phase 3)
- [`IOS - U - Compliance Device Health`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md) (phase 3)
- [`MAC - D - Wifi Corporate`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.fr.md) (phase 3)
- [`MAC - D - Wifi Guest`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.fr.md) (phase 3)
- [`WIN - D - Wifi Corporate`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.fr.md) (phase 3)
- [`WIN - D - Wifi Guest`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.fr.md) (phase 3)
- [`AND - D - Compliance Dedicated Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) (phase 4)
- [`IOS - D - Defender for Endpoint Onboarding Supervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.fr.md) (phase 4)
- [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.fr.md) (phase 4)
- [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) (phase 4)
- [`WIN - D - Defender ASR Policy Audit Mode`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.fr.md) (phase 4)
- [`WIN - D - Defender Update Ring 1 Pilot`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.fr.md) (phase 4)
- [`WIN - D - Defender Update Ring 2 UAT`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.fr.md) (phase 4)
- [`WIN - D - Windows Update Ring 1 Pilot`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.fr.md) (phase 4)
- [`WIN - D - Windows Update Ring 2 UAT`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.fr.md) (phase 4)
- [`WIN - D - Wireless Shared Devices`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.fr.md) (phase 4)

**Alternative, non déployée (1)**: `WIN - D - Defender AV Policy`

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Processus de gestion des vulnérabilités avec délais de correction et enregistrement des exceptions
- Gestion des changements pour la baseline (revue de PR, pilote)
- Exigences de sécurité lors de l'acquisition de produits et services TIC
- Politique de divulgation coordonnée des vulnérabilités (CVD)

### art. 21(2)(f) évaluation de l'efficacité

*Des politiques et des procédures pour évaluer l'efficacité des mesures de gestion des risques en matière de cybersécurité* — précisé dans annexe §7 du règlement d'exécution.

**Mise en œuvre technique.** Les compliance policies et le reporting de conformité d'Intune mesurent si les mesures sont effectivement en place ; c'est une preuve, pas une évaluation.

**Intune, phase 1 (13)**

- [`MAC - U - Compliance Device Health`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Health.fr.md) (phase 1)
- [`MAC - U - Compliance Device Security`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) (phase 1)
- [`MAC - U - Compliance Password`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) (phase 1)
- [`WIN - D - Update Reports and Telemetry`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Update_Reports_and_Telemetry.fr.md) (phase 1)
- [`WIN - U - Compliance Antispyware`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antispyware.fr.md) (phase 1)
- [`WIN - U - Compliance Antivirus`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Antivirus.fr.md) (phase 1)
- [`WIN - U - Compliance BitLocker`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.fr.md) (phase 1)
- [`WIN - U - Compliance Code Integrity`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Code_Integrity.fr.md) (phase 1)
- [`WIN - U - Compliance Defender Real Time Protection`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Real_Time_Protection.fr.md) (phase 1)
- [`WIN - U - Compliance Defender Security Intelligence`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_Security_Intelligence.fr.md) (phase 1)
- [`WIN - U - Compliance Firewall`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Firewall.fr.md) (phase 1)
- [`WIN - U - Compliance Secure Boot`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Secure_Boot.fr.md) (phase 1)
- [`WIN - U - Compliance TPM`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (2)**

- [`MAC - U - Compliance OS Version`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.fr.md) (phase 2)
- [`WIN - U - Compliance OS Version`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.fr.md) (phase 2)

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Programme d'évaluation établi (audit interne, test d'intrusion, revue de direction)
- KPI et reporting à l'organe de direction
- Suivi des écarts issus du reporting de conformité
- Réajustement périodique de cette baseline face aux nouvelles menaces

### art. 21(2)(g) pratiques de base en matière de cyberhygiène et formation à la cybersécurité

*Les pratiques de base en matière de cyberhygiène et la formation à la cybersécurité* — précisé dans annexe §8 du règlement d'exécution.

**Mise en œuvre technique.** Techniquement, uniquement des avertissements en contexte (protection contre l'hameçonnage, bannière d'ouverture de session) ; le reste de la baseline constitue l'hygiène elle-même.

**Intune, phase 1 (1)**

- [`WIN - D - Enhanced Phishing Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (2)**

- [`MAC - D - Login Window`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.fr.md) (phase 2)
- [`MAC - D - Restrictions Hardening`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.fr.md) (phase 2)

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Programme de sensibilisation pour tous les collaborateurs
- Formation des organes de direction (art. 20(2))
- Formation spécifique pour les administrateurs
- Simulations d'hameçonnage périodiques et évaluation

### art. 21(2)(h) cryptographie et chiffrement

*Des politiques et des procédures relatives à l'utilisation de la cryptographie et, le cas échéant, du chiffrement* — précisé dans annexe §9 du règlement d'exécution.

**Mise en œuvre technique.** BitLocker, FileVault, Personal Data Encryption, chiffrement des applications (MAM), version minimale de TLS et protocoles d'administration chiffrés.

**Intune, phase 1 (8)**

- [`AND - U - App Protection`](../IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) (phase 1)
- [`IOS - U - App Protection`](../IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) (phase 1)
- [`MAC - U - Compliance Device Security`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Device_Security.fr.md) (phase 1)
- [`WIN - D - BitLocker`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_BitLocker.fr.md) (phase 1)
- [`WIN - D - Remote Desktop and RPC`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Desktop_and_RPC.fr.md) (phase 1)
- [`WIN - U - Compliance BitLocker`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_BitLocker.fr.md) (phase 1)
- [`WIN - U - Compliance TPM`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_TPM.fr.md) (phase 1)
- [`WIN - U - Personal Data Encryption`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Personal_Data_Encryption.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (7)**

- [`MAC - D - FileVault`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.fr.md) (phase 2)
- [`WIN - D - Cryptography`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.fr.md) (phase 2)
- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.fr.md) (phase 2)
- [`AND - U - Compliance Corporate Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md) (phase 3)
- [`AND - U - Compliance Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) (phase 3)
- [`IOS - D - Data Protection`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.fr.md) (phase 3)
- [`AND - D - Compliance Dedicated Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) (phase 4)

**Alternative, non déployée (1)**: `WIN - D - Microsoft Edge DNS over HTTPS Secure`

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Politique cryptographique (algorithmes, longueurs de clé)
- Gestion des clés : qui peut consulter les clés de récupération, et journalisation de ces consultations
- Contrôle périodique de l'état du chiffrement et des exceptions

### art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs

*La sécurité des ressources humaines, des politiques de contrôle d'accès et la gestion des actifs* — précisé dans annexe §10–12 du règlement d'exécution.

**Mise en œuvre technique.** Verrouillage de l'écran, exigences de mot de passe et de code PIN, administrateurs locaux gérés, LAPS, stockage amovible, inscription et conformité comme condition d'accès.

**Intune, phase 1 (22)**

- [`AND - U - App Protection`](../IntuneTemplate/AND/AppProtection/Baseline_AND_U_App_Protection.fr.md) (phase 1)
- [`IOS - U - App Protection`](../IntuneTemplate/IOS/AppProtection/Baseline_IOS_U_App_Protection.fr.md) (phase 1)
- [`MAC - D - Accounts and Login`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Accounts_and_Login.fr.md) (phase 1)
- [`MAC - D - Microsoft Edge Password Management`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Password_Management.fr.md) (phase 1)
- [`MAC - D - Platform SSO`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Platform_SSO.fr.md) (phase 1)
- [`MAC - D - Restrictions`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions.fr.md) (phase 1)
- [`MAC - U - Compliance Password`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_Password.fr.md) (phase 1)
- [`MAC - U - Microsoft Edge Profiles and Sync`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_U_Microsoft_Edge_Profiles_and_Sync.fr.md) (phase 1)
- [`WIN - D - Device Lock`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Lock.fr.md) (phase 1)
- [`WIN - D - Enhanced Phishing Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enhanced_Phishing_Protection.fr.md) (phase 1)
- [`WIN - D - Local Administrators`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Administrators.fr.md) (phase 1)
- [`WIN - D - Local Security Policies`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Local_Security_Policies.fr.md) (phase 1)
- [`WIN - D - Login and Lock Screen`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Login_and_Lock_Screen.fr.md) (phase 1)
- [`WIN - D - Microsoft Accounts`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Accounts.fr.md) (phase 1)
- [`WIN - D - Passwordless`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.fr.md) (phase 1)
- [`WIN - D - Power Management`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Power_Management.fr.md) (phase 1)
- [`WIN - D - User Rights`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_User_Rights.fr.md) (phase 1)
- [`WIN - D - Windows Hello Cloud Kerberos Trust`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.fr.md) (phase 1)
- [`WIN - D - Windows LAPS`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_LAPS.fr.md) (phase 1)
- [`WIN - U - Microsoft Edge Password Management`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Password_Management.fr.md) (phase 1)
- [`WIN - U - Microsoft Edge Profiles and Sync`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Profiles_and_Sync.fr.md) (phase 1)
- [`WIN - U - Windows User Experience`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_User_Experience.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (37)**

- [`AND - U - Corporate Data Protection`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.fr.md) (phase 2)
- [`MAC - D - Login Window`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.fr.md) (phase 2)
- [`MAC - D - Passcode and Screen Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.fr.md) (phase 2)
- [`MAC - D - Recovery Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.fr.md) (phase 2)
- [`MAC - D - Screensaver`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.fr.md) (phase 2)
- [`WIN - D - Access Control`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.fr.md) (phase 2)
- [`WIN - D - Account Lockout`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.fr.md) (phase 2)
- [`WIN - D - Administrator Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.fr.md) (phase 2)
- [`WIN - D - Device Guard and Credential Guard`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md) (phase 2)
- [`WIN - D - Disable NTLM`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.fr.md) (phase 2)
- [`WIN - D - Enrollment Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.fr.md) (phase 2)
- [`WIN - D - Logon Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.fr.md) (phase 2)
- [`WIN - D - Removable Storage`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.fr.md) (phase 2)
- [`WIN - D - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md) (phase 2)
- [`WIN - U - File Sharing Restrictions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.fr.md) (phase 2)
- [`WIN - U - Microsoft Teams`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.fr.md) (phase 2)
- [`WIN - U - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) (phase 2)
- [`AND - U - Compliance Block Device Administrator`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.fr.md) (phase 3)
- [`AND - U - Compliance Corporate Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md) (phase 3)
- [`AND - U - Compliance Corporate Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md) (phase 3)
- [`AND - U - Compliance Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) (phase 3)
- [`AND - U - Compliance Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) (phase 3)
- [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) (phase 3)
- [`AND - U - Work Profile Restrictions`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) (phase 3)
- [`IOS - D - Data Protection`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.fr.md) (phase 3)
- [`IOS - D - Enterprise SSO`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) (phase 3)
- [`IOS - D - Passcode`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.fr.md) (phase 3)
- [`IOS - U - Compliance Device Health`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md) (phase 3)
- [`IOS - U - Compliance Password`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) (phase 3)
- [`MAC - D - Azure Files Cloud Kerberos`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.fr.md) (phase 3)
- [`WIN - U - Compliance Defender for Endpoint Risk`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md) (phase 3)
- [`AND - D - Compliance Dedicated Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) (phase 4)
- [`IOS - D - Lock Screen`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.fr.md) (phase 4)
- [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) (phase 4)
- [`MAC - D - Enrollment Profile Administrator User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.fr.md) (phase 4)
- [`MAC - D - Enrollment Profile Standard User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.fr.md) (phase 4)
- [`WIN - D - Windows Hello for Business Multi User`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md) (phase 4)

**Alternative, non déployée (1)**: `MAC - D - External Storage Read Only`

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Sécurité RH : vérification des antécédents, confidentialité, processus de départ
- Politique d'accès et revue périodique des droits
- Inventaire des actifs avec propriétaire
- Politique relative aux appareils personnels et aux supports amovibles

### art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées

*L'utilisation de solutions d'authentification à plusieurs facteurs ou d'authentification continue, de communications vocales, vidéo et textuelles sécurisées et de systèmes sécurisés de communication d'urgence* — précisé dans annexe §11.7 du règlement d'exécution.

**Mise en œuvre technique.** Intune fournit les méthodes d'authentification forte (Windows Hello for Business, connexion sans mot de passe) ; l'application de la MFA se fait dans Conditional Access.

**Intune, phase 1 (3)**

- [`MAC - D - Microsoft Edge Security`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Microsoft_Edge_Security.fr.md) (phase 1)
- [`WIN - D - Passwordless`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Passwordless.fr.md) (phase 1)
- [`WIN - D - Windows Hello Cloud Kerberos Trust`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Cloud_Kerberos_Trust.fr.md) (phase 1)

**Préparé — pilote, en attente ou groupe dédié (7)**

- [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.fr.md) (phase 2)
- [`WIN - D - Network Authentication Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.fr.md) (phase 2)
- [`WIN - D - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md) (phase 2)
- [`WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.fr.md) (phase 2)
- [`WIN - U - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) (phase 2)
- [`IOS - D - Enterprise SSO`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) (phase 3)
- [`WIN - D - Windows Hello for Business Multi User`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md) (phase 4)

**Alternative, non déployée (4)**: `WIN - D - Microsoft Edge DNS over HTTPS Secure`, `WIN - D - Windows Hello Passkey PIN Complexity Numeric`, `WIN - D - Windows Hello PIN Complexity Alphanumeric`, `WIN - D - Windows Hello PIN Complexity Numeric`

**Preuve.** Les rapports Intune : l'affectation et le statut par appareil des policies ci-dessus.

**Nécessaire sur le plan organisationnel**

- Décision sur les méthodes MFA autorisées et les exceptions
- Processus d'enregistrement des méthodes d'authentification (délivrance de TAP)
- Communication d'urgence sécurisée en dehors du tenant propre (par exemple en cas d'indisponibilité du tenant)

## CIS Controls v8.1

CIS Controls v8.1 (juin 2024). IG est l'Implementation Group la plus basse qui contient le safeguard (IG2 inclut IG1).
Les références aux benchmarks (CIS Microsoft Windows 11, Apple macOS, iOS, Android) figurent par policy dans `bron` et `bewijs`.

### 1 Inventory and Control of Enterprise Assets

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **1.1** Establish and Maintain Detailed Enterprise Asset Inventory | IG1 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `WIN - D - Enrollment Hardening`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **1.2** Address Unauthorized Assets | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **1.3** Utilize an Active Discovery Tool | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **1.4** Use Dynamic Host Configuration Protocol (DHCP) Logging to Update Enterprise Asset Inventory | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **1.5** Use a Passive Asset Discovery Tool | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 2 Inventory and Control of Software Assets

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **2.1** Establish and Maintain a Software Inventory | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **2.2** Ensure Authorized Software is Currently Supported | IG1 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `MAC - U - Compliance OS Version`, `WIN - U - Compliance OS Version` |
| **2.3** Address Unauthorized Software | IG1 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `WIN - D - Printing Hardening`, `AND - U - Compliance Device Health` |
| **2.4** Utilize Automated Software Inventory Tools | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **2.5** Allowlist Authorized Software | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Firewall and Gatekeeper`, `MAC - D - Restrictions Hardening`, `IOS - D - Restrictions Corporate` |
| **2.6** Allowlist Authorized Libraries | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **2.7** Allowlist Authorized Scripts | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 3 Data Protection

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **3.1** Establish and Maintain a Data Management Process | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **3.2** Establish and Maintain a Data Inventory | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **3.3** Configure Data Access Control Lists | IG1 | technique | ● Couvert (phase 1) | `IOS - U - App Protection`, `WIN - U - File Sharing Restrictions`, `IOS - D - Data Protection`, `MAC - D - External Storage Read Only` |
| **3.4** Enforce Data Retention | IG1 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `WIN - D - Windows AI Recall Boundaries` |
| **3.5** Securely Dispose of Data | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **3.6** Encrypt Data on End-User Devices | IG1 | technique | ● Couvert (phase 1) | `AND - U - App Protection`, `MAC - U - Compliance Device Security`, `WIN - D - BitLocker`, `WIN - U - Compliance BitLocker`, `WIN - U - Personal Data Encryption`, `MAC - D - FileVault` et 3 de plus |
| **3.7** Establish and Maintain a Data Classification Scheme | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **3.8** Document Data Flows | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **3.9** Encrypt Data on Removable Media | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **3.10** Encrypt Sensitive Data in Transit | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Microsoft Edge Security`, `WIN - D - Cryptography`, `WIN - D - Microsoft Edge DNS over HTTPS Automatic`, `WIN - D - Microsoft Edge DNS over HTTPS Secure` |
| **3.11** Encrypt Sensitive Data at Rest | IG2 | technique | ● Couvert (phase 1) | `IOS - U - App Protection`, `WIN - D - BitLocker`, `WIN - U - Personal Data Encryption`, `MAC - D - FileVault`, `IOS - D - Data Protection` |
| **3.12** Segment Data Processing and Storage Based on Sensitivity | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **3.13** Deploy a Data Loss Prevention Solution | IG3 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `AND - U - Corporate AI Restricted`, `AND - U - Corporate Data Protection` |
| **3.14** Log Sensitive Data Access | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 4 Secure Configuration of Enterprise Assets and Software

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **4.1** Establish and Maintain a Secure Configuration Process | IG1 | organisationnel | ● Couvert (phase 1) | `WIN - D - Config Refresh`, `WIN - D - Internet Explorer Legacy`, `WIN - D - Legacy Hardening`, `WIN - D - Local Security Policies`, `WIN - D - Login and Lock Screen`, `WIN - D - Microsoft Edge Security` et 24 de plus |
| **4.2** Establish and Maintain a Secure Configuration Process for Network Infrastructure | IG1 | organisationnel | ▢ Organisationnel | — |
| **4.3** Configure Automatic Session Locking on Enterprise Assets | IG1 | technique | ● Couvert (phase 1) | `MAC - U - Compliance Password`, `WIN - D - Device Lock`, `WIN - D - Power Management`, `MAC - D - Passcode and Screen Lock`, `MAC - D - Screensaver`, `AND - U - Compliance Corporate Password` et 5 de plus |
| **4.4** Implement and Manage a Firewall on Servers | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **4.5** Implement and Manage a Firewall on End-User Devices | IG1 | technique | ● Couvert (phase 1) | `MAC - D - Firewall and Gatekeeper`, `MAC - U - Compliance Device Security`, `WIN - D - Windows Firewall`, `WIN - D - Windows Firewall Rules`, `WIN - U - Compliance Firewall` |
| **4.6** Securely Manage Enterprise Assets and Software | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **4.7** Manage Default Accounts on Enterprise Assets and Software | IG1 | technique | ● Couvert (phase 1) | `MAC - D - Accounts and Login`, `WIN - D - Local Security Policies`, `WIN - D - Windows LAPS`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **4.8** Uninstall or Disable Unnecessary Services on Enterprise Assets and Software | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Restrictions`, `WIN - D - Legacy Hardening`, `WIN - D - Privacy and Telemetry`, `WIN - D - Security Hardening`, `WIN - D - Windows Feature Configuration`, `WIN - D - Windows Sandbox` et 12 de plus |
| **4.9** Configure Trusted DNS Servers on Enterprise Assets | IG2 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `WIN - D - Microsoft Edge DNS over HTTPS Automatic`, `WIN - D - Microsoft Edge DNS over HTTPS Secure` |
| **4.10** Enforce Automatic Device Lockout on Portable End-User Devices | IG2 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `WIN - D - Account Lockout`, `AND - U - Corporate Device Security`, `AND - U - Work Profile Restrictions`, `IOS - D - Passcode` |
| **4.11** Enforce Remote Wipe Capability on Portable End-User Devices | IG2 | technique | ● Couvert (phase 1) | `AND - U - App Protection`, `IOS - U - App Protection` |
| **4.12** Separate Enterprise Workspaces on Mobile End-User Devices | IG3 | technique | ● Couvert (phase 1) | `AND - U - App Protection`, `AND - U - Corporate Device Security`, `AND - U - Work Profile Restrictions` |

### 5 Account Management

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **5.1** Establish and Maintain an Inventory of Accounts | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **5.2** Use Unique Passwords | IG1 | technique | ● Couvert (phase 1) | `MAC - D - Microsoft Edge Password Management`, `WIN - D - Windows LAPS`, `WIN - U - Microsoft Edge Password Management`, `MAC - D - Recovery Lock`, `WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric`, `WIN - D - Windows Hello Passkey PIN Complexity Numeric` et 2 de plus |
| **5.3** Disable Dormant Accounts | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **5.4** Restrict Administrator Privileges to Dedicated Administrator Accounts | IG1 | technique | ● Couvert (phase 1) | `WIN - D - Local Administrators`, `WIN - D - Administrator Protection`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **5.5** Establish and Maintain an Inventory of Service Accounts | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **5.6** Centralize Account Management | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Platform SSO`, `WIN - D - Microsoft Accounts` |

### 6 Access Control Management

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **6.1** Establish an Access Granting Process | IG1 | organisationnel | ▢ Organisationnel | — |
| **6.2** Establish an Access Revoking Process | IG1 | organisationnel | ▢ Organisationnel | — |
| **6.3** Require MFA for Externally-Exposed Applications | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **6.4** Require MFA for Remote Network Access | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **6.5** Require MFA for Administrative Access | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **6.6** Establish and Maintain an Inventory of Authentication and Authorization Systems | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **6.7** Centralize Access Control | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Platform SSO`, `IOS - D - Enterprise SSO`, `MAC - D - Azure Files Cloud Kerberos` |
| **6.8** Define and Maintain Role-Based Access Control | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 7 Continuous Vulnerability Management

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **7.1** Establish and Maintain a Vulnerability Management Process | IG1 | organisationnel | ▢ Organisationnel | — |
| **7.2** Establish and Maintain a Remediation Process | IG1 | organisationnel | ▢ Organisationnel | — |
| **7.3** Perform Automated Operating System Patch Management | IG1 | technique | ● Couvert (phase 1) | `WIN - D - Automatic Restart Sign-On`, `WIN - D - Windows Update Ring 3 Production`, `MAC - D - Software Updates`, `AND - D - System Updates`, `AND - U - Compliance Corporate Device Health`, `AND - U - Compliance Device Health` et 4 de plus |
| **7.4** Perform Automated Application Patch Management | IG1 | technique | ● Couvert (phase 1) | `MAC - D - Microsoft AutoUpdate`, `MAC - U - Microsoft Edge Updates`, `WIN - D - Microsoft Edge Updates`, `WIN - D - Microsoft Office Updates`, `MAC - D - Software Updates`, `AND - U - Corporate Device Security` |
| **7.5** Perform Automated Vulnerability Scans of Internal Enterprise Assets | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **7.6** Perform Automated Vulnerability Scans of Externally-Exposed Enterprise Assets | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **7.7** Remediate Detected Vulnerabilities | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |

### 8 Audit Log Management

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **8.1** Establish and Maintain an Audit Log Management Process | IG1 | organisationnel | ▢ Organisationnel | — |
| **8.2** Collect Audit Logs | IG1 | technique | ● Couvert (phase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Audit Policy Enforcement`, `WIN - D - Windows Firewall`, `WIN - D - Security Log Monitoring` |
| **8.3** Ensure Adequate Audit Log Storage | IG1 | technique | ● Couvert (phase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Security Log Monitoring` |
| **8.4** Standardize Time Synchronization | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Time Server`, `WIN - D - Timezone` |
| **8.5** Collect Detailed Audit Logs | IG2 | technique | ● Couvert (phase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Audit Policy Enforcement`, `WIN - D - Logging` |
| **8.6** Collect DNS Query Audit Logs | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **8.7** Collect URL Request Audit Logs | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **8.8** Collect Command-Line Audit Logs | IG2 | technique | ● Couvert (phase 1) | `WIN - D - Audit and Event Logging`, `WIN - D - Logging`, `WIN - D - Security Hardening`, `WIN - D - Security Log Monitoring` |
| **8.9** Centralize Audit Logs | IG2 | technique | ◐ Seulement pilote, en attente ou groupe dédié | `WIN - D - Windows Event Forwarding` |
| **8.10** Retain Audit Logs | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **8.11** Conduct Audit Log Reviews | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **8.12** Collect Service Provider Logs | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 9 Email and Web Browser Protections

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **9.1** Ensure Use of Only Fully Supported Browsers and Email Clients | IG1 | technique | ● Couvert (phase 1) | `MAC - U - Microsoft Edge Updates`, `WIN - D - Microsoft Edge Updates` |
| **9.2** Use DNS Filtering Services | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **9.3** Maintain and Enforce Network-Based URL Filters | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Microsoft Edge Security`, `IOS - D - Defender for Endpoint Onboarding Supervised`, `IOS - D - Defender for Endpoint Onboarding Unsupervised` |
| **9.4** Restrict Unnecessary or Unauthorized Browser and Email Client Extensions | IG2 | technique | ● Couvert (phase 1) | `MAC - U - Microsoft Edge Extensions`, `WIN - U - Microsoft Edge Extensions` |
| **9.5** Implement DMARC | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **9.6** Block Unnecessary File Types | IG2 | technique | ● Couvert (phase 1) | `WIN - D - Microsoft Edge Security`, `WIN - U - Microsoft Office Security`, `WIN - D - Script File Associations` |
| **9.7** Deploy and Maintain Email Server Anti-Malware Protections | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 10 Malware Defenses

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **10.1** Deploy and Maintain Anti-Malware Software | IG1 | technique | ● Couvert (phase 1) | `MAC - D - Defender Antivirus`, `MAC - D - Defender for Endpoint`, `MAC - D - Firewall and Gatekeeper`, `MAC - D - Microsoft Edge Security`, `WIN - D - Defender Additional Configuration`, `WIN - D - Defender Antivirus` et 14 de plus |
| **10.2** Configure Automatic Anti-Malware Signature Updates | IG1 | technique | ● Couvert (phase 1) | `MAC - D - Defender Antivirus`, `WIN - D - Defender Antivirus`, `WIN - D - Defender Update Ring 3 Production`, `WIN - U - Compliance Defender Security Intelligence`, `WIN - D - Defender Update Ring 1 Pilot`, `WIN - D - Defender Update Ring 2 UAT` |
| **10.3** Disable Autorun and Autoplay for Removable Media | IG1 | technique | ● Couvert (phase 1) | `WIN - D - Security Hardening` |
| **10.4** Configure Automatic Anti-Malware Scanning of Removable Media | IG2 | technique | ● Couvert (phase 1) | `WIN - D - Defender Antivirus`, `WIN - D - Defender AV Policy` |
| **10.5** Enable Anti-Exploitation Features | IG2 | technique | ● Couvert (phase 1) | `MAC - U - Compliance Device Health`, `WIN - D - Attack Surface Reduction`, `WIN - D - Defender Additional Configuration`, `WIN - D - Microsoft Edge Security`, `WIN - D - Microsoft Office Security`, `WIN - D - Threat Protection` et 5 de plus |
| **10.6** Centrally Manage Anti-Malware Software | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Defender Antivirus`, `WIN - D - Defender Additional Configuration`, `WIN - D - Defender Antivirus`, `WIN - D - Defender Security Experience`, `WIN - D - Threat Protection`, `WIN - D - Defender AV Policy` |
| **10.7** Use Behavior-Based Anti-Malware Software | IG2 | technique | ● Couvert (phase 1) | `WIN - D - Defender Antivirus`, `WIN - D - Defender Ransomware Protection`, `WIN - D - Defender AV Policy` |

### 11 Data Recovery

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **11.1** Establish and Maintain a Data Recovery Process | IG1 | organisationnel | ▢ Organisationnel | — |
| **11.2** Perform Automated Backups | IG1 | technique | ● Couvert (phase 1) | `MAC - U - Microsoft OneDrive KFM`, `WIN - D - Microsoft OneDrive`, `WIN - D - Settings Sync` |
| **11.3** Protect Recovery Data | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **11.4** Establish and Maintain an Isolated Instance of Recovery Data | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **11.5** Test Data Recovery | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |

### 12 Network Infrastructure Management

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **12.1** Ensure Network Infrastructure is Up-to-Date | IG1 | technique | ○ Aucune mesure technique dans la baseline | — |
| **12.2** Establish and Maintain a Secure Network Architecture | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **12.3** Securely Manage Network Infrastructure | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **12.4** Establish and Maintain Architecture Diagram(s) | IG2 | organisationnel | ▢ Organisationnel | — |
| **12.5** Centralize Network Authentication, Authorization, and Auditing (AAA) | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **12.6** Use of Secure Network Management and Communication Protocols | IG2 | technique | ● Couvert (phase 1) | `WIN - D - Remote Desktop and RPC` |
| **12.7** Ensure Remote Devices Utilize a VPN and are Connecting to an Enterprise's AAA Infrastructure | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **12.8** Establish and Maintain Dedicated Computing Resources for All Administrative Work | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 13 Network Monitoring and Defense

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **13.1** Centralize Security Event Alerting | IG2 | technique | ● Couvert (phase 1) | `WIN - D - Defender EDR Policy`, `WIN - U - Compliance Defender for Endpoint Risk`, `WIN - D - Defender for Endpoint EDR` |
| **13.2** Deploy a Host-Based Intrusion Detection Solution | IG2 | technique | ● Couvert (phase 1) | `MAC - D - Defender for Endpoint`, `WIN - D - Defender EDR Policy`, `WIN - D - Defender for Endpoint EDR` |
| **13.3** Deploy a Network Intrusion Detection Solution | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.4** Perform Traffic Filtering Between Network Segments | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.5** Manage Access Control for Remote Assets | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.6** Collect Network Traffic Flow Logs | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.7** Deploy a Host-Based Intrusion Prevention Solution | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.8** Deploy a Network Intrusion Prevention Solution | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.9** Deploy Port-Level Access Control | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.10** Perform Application Layer Filtering | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |
| **13.11** Tune Security Event Alerting Thresholds | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 14 Security Awareness and Skills Training

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **14.1** Establish and Maintain a Security Awareness Program | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.2** Train Workforce Members to Recognize Social Engineering Attacks | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.3** Train Workforce Members on Authentication Best Practices | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.4** Train Workforce on Data Handling Best Practices | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.5** Train Workforce Members on Causes of Unintentional Data Exposure | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.6** Train Workforce Members on Recognizing and Reporting Security Incidents | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.7** Train Workforce on How to Identify and Report if Their Enterprise Assets are Missing Security Updates | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.8** Train Workforce on the Dangers of Connecting to and Transmitting Enterprise Data Over Insecure Networks | IG1 | organisationnel | ▢ Organisationnel | — |
| **14.9** Conduct Role-Specific Security Awareness and Skills Training | IG2 | organisationnel | ▢ Organisationnel | — |

### 16 Application Software Security

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **16.1** Establish and Maintain a Secure Application Development Process | IG2 | organisationnel | ▢ Organisationnel | — |
| **16.2** Establish and Maintain a Process to Accept and Address Software Vulnerabilities | IG2 | organisationnel | ▢ Organisationnel | — |
| **16.3** Perform Root Cause Analysis on Security Vulnerabilities | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.4** Establish and Manage an Inventory of Third-Party Software Components | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.5** Use Up-to-Date and Trusted Third-Party Software Components | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.6** Establish and Maintain a Severity Rating System and Process for Application Vulnerabilities | IG2 | organisationnel | ▢ Organisationnel | — |
| **16.7** Use Standard Hardening Configuration Templates for Application Infrastructure | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.8** Separate Production and Non-Production Systems | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.9** Train Developers in Application Security Concepts and Secure Coding | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.10** Apply Secure Design Principles in Application Architectures | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.11** Leverage Vetted Modules or Services for Application Security Components | IG2 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.12** Implement Code-Level Security Checks | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.13** Conduct Application Penetration Testing | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |
| **16.14** Conduct Threat Modeling | IG3 | technique | ○ Aucune mesure technique dans la baseline | — |

### 17 Incident Response Management

| Safeguard | IG | Nature | Statut | Policies |
|---|---|---|---|---|
| **17.1** Designate Personnel to Manage Incident Handling | IG1 | organisationnel | ▢ Organisationnel | — |
| **17.2** Establish and Maintain Contact Information for Reporting Security Incidents | IG1 | organisationnel | ▢ Organisationnel | — |
| **17.3** Establish and Maintain an Enterprise Process for Reporting Incidents | IG1 | organisationnel | ▢ Organisationnel | — |
| **17.4** Establish and Maintain an Incident Response Process | IG2 | organisationnel | ▢ Organisationnel | — |
| **17.5** Assign Key Roles and Responsibilities | IG2 | organisationnel | ▢ Organisationnel | — |
| **17.6** Define Mechanisms for Communicating During Incident Response | IG2 | organisationnel | ▢ Organisationnel | — |
| **17.7** Conduct Routine Incident Response Exercises | IG2 | organisationnel | ▢ Organisationnel | — |
| **17.8** Conduct Post-Incident Reviews | IG2 | organisationnel | ▢ Organisationnel | — |
| **17.9** Establish and Maintain Security Incident Thresholds | IG3 | organisationnel | ▢ Organisationnel | — |

## NIST CSF 2.0

NIST Cybersecurity Framework 2.0 (février 2024). Seules les sous-catégories pertinentes pour les terminaux et l'identité. Govern
est organisationnel par définition : aucune policy ne le met en œuvre, cette baseline en est tout au plus une exécution.

### GV — Govern (gouverner)

| Sous-catégorie | Description | Statut | Policies |
|---|---|---|---|
| **GV.OC-03** | Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed | ▢ Organisationnel | — |
| **GV.RM-01** | Risk management objectives are established and agreed to by organizational stakeholders | ▢ Organisationnel | — |
| **GV.RR-02** | Roles, responsibilities, and authorities related to cybersecurity risk management are established and communicated | ▢ Organisationnel | — |
| **GV.PO-01** | Policy for managing cybersecurity risks is established, communicated, and enforced | ▢ Organisationnel | — |
| **GV.PO-02** | Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced | ▢ Organisationnel | — |
| **GV.OV-01** | Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy | ▢ Organisationnel | — |
| **GV.SC-01** | A cybersecurity supply chain risk management program is established and agreed to | ▢ Organisationnel | — |
| **GV.SC-05** | Requirements to address cybersecurity risks in supply chains are established and integrated into contracts | ▢ Organisationnel | — |

### ID — Identify (identifier)

| Sous-catégorie | Description | Statut | Policies |
|---|---|---|---|
| **ID.AM-01** | Inventories of hardware managed by the organization are maintained | ◐ Seulement pilote, en attente ou groupe dédié | `WIN - D - Enrollment Hardening`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **ID.AM-02** | Inventories of software, services, and systems managed by the organization are maintained | ○ Aucune mesure technique dans la baseline | — |
| **ID.AM-08** | Systems, hardware, software, services, and data are managed throughout their life cycles | ○ Aucune mesure technique dans la baseline | — |
| **ID.RA-01** | Vulnerabilities in assets are identified, validated, and recorded | ◐ Seulement pilote, en attente ou groupe dédié | `MAC - D - Software Updates`, `IOS - D - Software Updates` |
| **ID.RA-02** | Cyber threat intelligence is received from information sharing forums and sources | ○ Aucune mesure technique dans la baseline | — |
| **ID.RA-07** | Changes and exceptions are managed, assessed for risk impact, recorded, and tracked | ○ Aucune mesure technique dans la baseline | — |
| **ID.IM-01** | Improvements are identified from evaluations | ○ Aucune mesure technique dans la baseline | — |

### PR — Protect (protéger)

| Sous-catégorie | Description | Statut | Policies |
|---|---|---|---|
| **PR.AA-01** | Identities and credentials for authorized users, services, and hardware are managed | ● Couvert (phase 1) | `MAC - D - Microsoft Edge Password Management`, `MAC - D - Platform SSO`, `WIN - D - Enhanced Phishing Protection`, `WIN - D - Microsoft Accounts`, `WIN - D - Windows LAPS`, `WIN - U - Microsoft Edge Password Management` et 9 de plus |
| **PR.AA-02** | Identities are proofed and bound to credentials based on the context of interactions | ○ Aucune mesure technique dans la baseline | — |
| **PR.AA-03** | Users, services, and hardware are authenticated | ● Couvert (phase 1) | `AND - U - App Protection`, `IOS - U - App Protection`, `MAC - D - Accounts and Login`, `MAC - D - Platform SSO`, `MAC - U - Compliance Password`, `WIN - D - Device Lock` et 25 de plus |
| **PR.AA-04** | Identity assertions are protected, conveyed, and verified | ● Couvert (phase 1) | `WIN - D - Windows Hello Cloud Kerberos Trust`, `WIN - D - Disable NTLM`, `MAC - D - Azure Files Cloud Kerberos` |
| **PR.AA-05** | Access permissions, entitlements, and authorizations are defined, managed, enforced, and reviewed (least privilege, separation of duties) | ● Couvert (phase 1) | `WIN - D - Local Administrators`, `WIN - D - Local Security Policies`, `WIN - D - User Rights`, `WIN - D - Windows LAPS`, `MAC - D - Recovery Lock`, `WIN - D - Administrator Protection` et 6 de plus |
| **PR.AT-01** | Personnel are provided with awareness and training | ○ Aucune mesure technique dans la baseline | — |
| **PR.DS-01** | The confidentiality, integrity, and availability of data-at-rest are protected | ● Couvert (phase 1) | `AND - U - App Protection`, `IOS - U - App Protection`, `MAC - U - Compliance Device Security`, `WIN - D - BitLocker`, `WIN - D - Windows AI Restricted`, `WIN - U - Compliance BitLocker` et 12 de plus |
| **PR.DS-02** | The confidentiality, integrity, and availability of data-in-transit are protected | ● Couvert (phase 1) | `MAC - D - Restrictions`, `MAC - U - Microsoft Edge Profiles and Sync`, `WIN - D - AI Tooling`, `WIN - D - Data Minimisation`, `WIN - D - Privacy and Telemetry`, `WIN - D - Remote Desktop and RPC` et 13 de plus |
| **PR.DS-10** | The confidentiality, integrity, and availability of data-in-use are protected | ● Couvert (phase 1) | `AND - U - App Protection`, `AND - U - Corporate AI Restricted`, `AND - U - Corporate Data Protection`, `AND - U - Work Profile Restrictions` |
| **PR.DS-11** | Backups of data are created, protected, maintained, and tested | ● Couvert (phase 1) | `MAC - U - Microsoft OneDrive KFM`, `WIN - D - Microsoft OneDrive`, `WIN - D - Settings Sync` |
| **PR.PS-01** | Configuration management practices are established and applied | ● Couvert (phase 1) | `MAC - D - Accounts and Login`, `MAC - D - Microsoft Edge Security`, `MAC - D - Microsoft Office`, `MAC - D - Microsoft OneDrive`, `MAC - D - Restrictions`, `WIN - D - Cloud Optimized Content` et 53 de plus |
| **PR.PS-02** | Software is maintained, replaced, and removed commensurate with risk | ● Couvert (phase 1) | `MAC - D - Microsoft AutoUpdate`, `MAC - U - Microsoft Edge Updates`, `WIN - D - Automatic Restart Sign-On`, `WIN - D - Defender Update Ring 3 Production`, `WIN - D - Microsoft Edge Updates`, `WIN - D - Microsoft Office Updates` et 16 de plus |
| **PR.PS-03** | Hardware is maintained, replaced, and removed commensurate with risk | ○ Aucune mesure technique dans la baseline | — |
| **PR.PS-04** | Log records are generated and made available for continuous monitoring | ● Couvert (phase 1) | `MAC - D - Time Server`, `WIN - D - Audit and Event Logging`, `WIN - D - Audit Policy Enforcement`, `WIN - D - Logging`, `WIN - D - Security Hardening`, `WIN - D - Timezone` et 2 de plus |
| **PR.PS-05** | Installation and execution of unauthorized software are prevented | ● Couvert (phase 1) | `MAC - D - Firewall and Gatekeeper`, `MAC - U - Microsoft Edge Extensions`, `WIN - D - Attack Surface Reduction`, `WIN - D - Microsoft Edge Security`, `WIN - D - Microsoft Office Security`, `WIN - D - Microsoft Store` et 9 de plus |
| **PR.IR-01** | Networks and environments are protected from unauthorized logical access and usage | ● Couvert (phase 1) | `MAC - D - Firewall and Gatekeeper`, `WIN - D - Remote Desktop and RPC`, `WIN - D - Windows Firewall`, `WIN - D - Windows Firewall Rules`, `WIN - D - Wireless and Peripherals`, `WIN - D - Network Authentication Hardening` et 4 de plus |
| **PR.IR-03** | Mechanisms are implemented to achieve resilience requirements in normal and adverse situations | ● Couvert (phase 1) | `WIN - D - Business Continuity`, `MAC - D - Wifi Guest`, `WIN - D - Wifi Guest` |
| **PR.IR-04** | Adequate resource capacity to ensure availability is maintained | ● Couvert (phase 1) | `WIN - D - Delivery Optimisation`, `WIN - D - Endpoint Analytics`, `WIN - D - Storage Sense` |

### DE — Detect (détecter)

| Sous-catégorie | Description | Statut | Policies |
|---|---|---|---|
| **DE.CM-01** | Networks and network services are monitored to find potentially adverse events | ◐ Seulement pilote, en attente ou groupe dédié | `IOS - D - Defender for Endpoint Onboarding Supervised`, `IOS - D - Defender for Endpoint Onboarding Unsupervised` |
| **DE.CM-03** | Personnel activity and technology usage are monitored to find potentially adverse events | ○ Aucune mesure technique dans la baseline | — |
| **DE.CM-09** | Computing hardware and software, runtime environments, and their data are monitored to find potentially adverse events | ● Couvert (phase 1) | `MAC - D - Defender Antivirus`, `MAC - D - Defender for Endpoint`, `MAC - D - Microsoft Edge Security`, `MAC - U - Compliance Device Health`, `MAC - U - Compliance Device Security`, `MAC - U - Compliance Password` et 34 de plus |
| **DE.AE-02** | Potentially adverse events are analyzed to better understand associated activities | ● Couvert (phase 1) | `WIN - D - Defender EDR Policy`, `WIN - D - Defender for Endpoint EDR` |
| **DE.AE-03** | Information is correlated from multiple sources | ○ Aucune mesure technique dans la baseline | — |
| **DE.AE-06** | Information on adverse events is provided to authorized staff and tools | ○ Aucune mesure technique dans la baseline | — |

### RS — Respond (répondre)

| Sous-catégorie | Description | Statut | Policies |
|---|---|---|---|
| **RS.MA-01** | The incident response plan is executed in coordination with relevant third parties once an incident is declared | ○ Aucune mesure technique dans la baseline | — |
| **RS.MA-02** | Incident reports are triaged and validated | ○ Aucune mesure technique dans la baseline | — |
| **RS.AN-03** | Analysis is performed to establish what has taken place during an incident and the root cause | ○ Aucune mesure technique dans la baseline | — |
| **RS.AN-07** | Incident data and metadata are collected, and their integrity and provenance are preserved | ○ Aucune mesure technique dans la baseline | — |
| **RS.CO-02** | Internal and external stakeholders are notified of incidents | ○ Aucune mesure technique dans la baseline | — |
| **RS.MI-01** | Incidents are contained | ● Couvert (phase 1) | `WIN - D - Defender Antivirus`, `WIN - D - Defender Ransomware Protection`, `AND - U - Compliance Corporate Defender for Endpoint`, `AND - U - Compliance Defender for Endpoint`, `WIN - U - Compliance Defender for Endpoint Risk` |
| **RS.MI-02** | Incidents are eradicated | ○ Aucune mesure technique dans la baseline | — |

### RC — Recover (rétablir)

| Sous-catégorie | Description | Statut | Policies |
|---|---|---|---|
| **RC.RP-01** | The recovery portion of the incident response plan is executed once initiated from the incident response process | ○ Aucune mesure technique dans la baseline | — |
| **RC.RP-02** | Recovery actions are selected, scoped, prioritized, and performed | ● Couvert (phase 1) | `WIN - D - Business Continuity` |
| **RC.RP-03** | The integrity of backups and other restoration assets is verified before using them for restoration | ○ Aucune mesure technique dans la baseline | — |
| **RC.RP-05** | The integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed | ○ Aucune mesure technique dans la baseline | — |
| **RC.CO-03** | Recovery activities and progress in restoring operational capabilities are communicated to designated stakeholders | ○ Aucune mesure technique dans la baseline | — |

## Choix de l'organisation et risques résiduels

Ce qui requiert une décision de la direction avant que la baseline soit complète. Chaque ligne provient de `faseWaarom`
dans le manifeste ; une décision ici est un changement de phase dans une PR, afin que la décision et le
déploiement se retrouvent au même endroit.

### A. Choisir une variante — phase 5, ne pas déployer (15)

Alternatives à une policy qui, elle, est déployée, ou choix de l'organisation sans réponse techniquement juste. Affecter deux
variantes en même temps produit un Conflit dans Intune, après quoi aucune des deux n'est appliquée.

| Policy | Pourquoi non déployée · lien | Normes (ISO) |
|---|---|---|
| [`IOS - D - Apple Intelligence Permitted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Permitted.fr.md) | Alternative à la variante Restricted, pour une organisation qui autorise Apple Intelligence sur les appareils de l'entreprise. Affectez-en une, jamais les deux. Lien: `IOS - D - Apple Intelligence Restricted`. | A.5.10, A.5.34, A.8.12 |
| [`MAC - D - Apple Intelligence Permitted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Permitted.fr.md) | Alternative à la variante Restricted, pour une organisation qui autorise Apple Intelligence sur le poste de travail. Affectez-en une, jamais les deux. Lien: `MAC - D - Restrictions`, `MAC - D - Apple Intelligence Restricted`. | A.5.10, A.5.34, A.8.1 |
| [`MAC - D - External Storage Read Only`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_External_Storage_Read_Only.fr.md) | Choix de l'organisation. La parité avec CXNM - Standard - WIN - D - Removable Storage (phase 2, écriture bloquée, lecture autorisée) est impossible sur macOS : avec ReadOnly, macOS ne monte pas pour autant les supports en lecture-écriture en lecture seule — Apple : 'external storage that is read-write will not be mounted read-only'. En pratique, cela bloque donc presque toutes les clés USB et tous les disques externes, y compris en lecture. C'est une autre décision que sous Windows, et donc pas une phase 2. Lien: `WIN - D - Removable Storage`. | A.7.10, A.8.12 |
| [`WIN - D - Defender AV Policy`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_AV_Policy.fr.md) | Le template standard CIPP à côté de la version OIB, plus permissif sur trois points. La version OIB est plus stricte — celui-ci n'a sa place nulle part. Lien: `WIN - D - Defender Antivirus`. | A.8.7 |
| [`WIN - D - Defender for Endpoint EDR`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_for_Endpoint_EDR.fr.md) | Double de CXNM - Standard - WIN - D - Defender EDR Policy, qui est déployée : affecter les deux place deux policies EDR sur le même appareil. Jusqu'en septembre 2026, ce template portait le jeton d'onboarding chiffré du tenant d'où il avait été exporté ; il a été remplacé par la valeur du connecteur, de sorte que le dépôt ne contient plus de valeur propre à un tenant. Lien: `WIN - D - Defender EDR Policy`. | A.8.7, A.8.16 |
| [`WIN - D - Microsoft Edge DNS over HTTPS Secure`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Secure.fr.md) | Alternative à la variante Automatic, uniquement pour une organisation disposant de son propre résolveur DoH ou d'un résolveur sous contrat (par exemple un service de filtrage DNS) capable de résoudre les noms internes. Nécessite une URL de résolveur propre au tenant. Lien: `WIN - D - Microsoft Edge DNS over HTTPS Automatic`. | A.8.20, A.8.24 |
| [`WIN - D - Microsoft Edge Search Engine`](../IntuneTemplate/WIN/AdministrativeTemplates/Baseline_WIN_D_Microsoft_Edge_Search_Engine.fr.md) | Un choix de l'organisation, pas un paramètre de sécurité : le moteur de recherche par défaut n'a pas sa place dans une baseline générique. Ne l'affectez que si l'organisation l'a décidé. | A.8.9 |
| [`WIN - D - Windows AI Features Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Permitted.fr.md) | Alternative à la variante Restricted, pour une organisation qui autorise l'IA générative sur le poste de travail. Affectez-en une, jamais les deux. Lien: `WIN - D - Windows AI Features Restricted`, `WIN - D - Windows AI Restricted`, `WIN - U - AI Usage Control Restricted`. | A.5.10, A.5.34, A.8.1 |
| [`WIN - D - Windows AI Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Permitted.fr.md) | Alternative à la variante Restricted, pour une organisation qui autorise Recall et Click To Do. Affectez-en une, jamais les deux. Lien: `WIN - D - Windows AI Restricted`. | A.5.10, A.5.34, A.8.1 |
| [`WIN - D - Windows Hello Passkey PIN Complexity Numeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Numeric.fr.md) | Alternative à la variante alphanumérique, pour une organisation qui ne veut pas supporter le coût d'assistance d'un code PIN complexe. Il existe quatre policies de complexité du code PIN et une seule peut être affectée à la fois : `WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric` / `Numeric` (le jeu nommé passkey) et `WIN - D - Windows Hello PIN Complexity Alphanumeric` / `Numeric` (le jeu générique, plus ancien). Deux policies affectées qui définissent le même paramètre avec une valeur différente produisent un Conflict dans Intune, après quoi aucune des deux n'est appliquée. | A.5.17, A.8.5 |
| [`WIN - D - Windows Hello PIN Complexity Alphanumeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Alphanumeric.fr.md) | Prédécesseur au nom générique de `WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric`, qui a repris le déploiement parce que son nom indique de quoi il s'agit. Contenu identique — les quatre mêmes paramètres avec les mêmes valeurs — il n'y a donc aucune raison de l'affecter. Il existe quatre policies de complexité du code PIN et une seule peut être affectée à la fois : `WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric` / `Numeric` (le jeu nommé passkey) et `WIN - D - Windows Hello PIN Complexity Alphanumeric` / `Numeric` (le jeu générique, plus ancien). Deux policies affectées qui définissent le même paramètre avec une valeur différente produisent un Conflict dans Intune, après quoi aucune des deux n'est appliquée. | A.5.17, A.8.5 |
| [`WIN - D - Windows Hello PIN Complexity Numeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_PIN_Complexity_Numeric.fr.md) | Prédécesseur au nom générique de `WIN - D - Windows Hello Passkey PIN Complexity Numeric`. Alternative à la variante alphanumérique, pour une organisation qui ne veut pas supporter le coût d'assistance d'un code PIN complexe. Il existe quatre policies de complexité du code PIN et une seule peut être affectée à la fois : `WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric` / `Numeric` (le jeu nommé passkey) et `WIN - D - Windows Hello PIN Complexity Alphanumeric` / `Numeric` (le jeu générique, plus ancien). Deux policies affectées qui définissent le même paramètre avec une valeur différente produisent un Conflict dans Intune, après quoi aucune des deux n'est appliquée. | A.5.17, A.8.5 |
| [`WIN - U - AI Usage Control Permitted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Permitted.fr.md) | Alternative à la variante Restricted, pour une organisation qui autorise les services d'IA publics. Affectez-en une, jamais les deux. Lien: `WIN - U - AI Usage Control Restricted`. | A.5.10, A.5.19, A.8.1, A.8.23 |
| [`WIN - U - Microsoft Outlook Cached Mode Default`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Default.fr.md) | Alternative à la variante Managed, pour une organisation qui souhaite bien mettre en cache les boîtes aux lettres partagées. Affectez-en une, jamais deux — elles définissent le même paramètre et produisent ensemble un Conflict. | A.8.9 |
| [`WIN - U - Microsoft Outlook Cached Mode Off`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Off.fr.md) | Alternative à la variante Managed, pour les appareils partagés sans profil conservé. Affectez-en une, jamais deux — elles définissent le même paramètre avec une valeur différente et produisent ensemble un Conflict, après quoi aucune des deux n'est appliquée. | A.8.1, A.8.9 |

### B. Groupe dédié — phase 4 (16)

Va sur un groupe spécifique. Décision : ce groupe existe-t-il, qui en fait partie et qui gère l'appartenance.

| Policy | Groupe · pourquoi | Normes (ISO) |
|---|---|---|
| [`AND - D - Compliance Dedicated Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_D_Compliance_Dedicated_Device_Health.fr.md) | **SEC-Android-Dedicated (groupe d'appareils dynamique basé sur l'enrollmentProfileName des profils d'inscription dedicated, ou une affectation avec filtre — voir extras/android/assignment-filters)** — Les appareils dedicated n'ont pas d'utilisateur ; une affectation par utilisateur ne les atteint pas. À affecter à un groupe d'appareils ne contenant que des appareils dedicated. | A.8.1, A.8.8, A.8.24 |
| [`IOS - D - Defender for Endpoint Onboarding Supervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Supervised.fr.md) | **SEC-iOS-Corporate (groupe d'appareils dynamique : iPhone/iPad avec deviceOwnership Company, inscrits via ADE et supervisés — règle dans extras/ios/README.md)** — Appareils supervisés uniquement ; les appareils non supervisés reçoivent la variante VPN. Nécessite en outre une licence Defender for Endpoint, le connecteur et l'application Defender comme application (VPP) requise. | A.8.7, A.8.23 |
| [`IOS - D - Defender for Endpoint Onboarding Unsupervised`](../IntuneTemplate/IOS/DeviceConfigurations/Baseline_IOS_D_Defender_for_Endpoint_Onboarding_Unsupervised.fr.md) | **SEC-iOS-BYOD (groupe d'appareils dynamique : iPhone/iPad inscrits avec deviceOwnership Personal, donc non supervisés — règle dans extras/ios/README.md)** — Appareils non supervisés (inscrits à titre personnel) uniquement ; les appareils supervisés reçoivent le filtre de contenu. Nécessite en outre une licence Defender for Endpoint, le connecteur et l'application Defender. | A.8.7, A.8.23 |
| [`IOS - D - Lock Screen`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Lock_Screen.fr.md) | **SEC-iOS-Corporate (groupe d'appareils dynamique : iPhone/iPad avec deviceOwnership Company, inscrits via ADE et supervisés — règle dans extras/ios/README.md)** — Appareils de l'entreprise uniquement, et le texte doit être renseigné pour chaque organisation avant l'affectation (placeholder VERLOREN-TOESTEL-TEKST-INVULLEN). | A.7.9, A.8.1 |
| [`IOS - D - Restrictions Corporate`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Restrictions_Corporate.fr.md) | **SEC-iOS-Corporate (groupe d'appareils dynamique : iPhone/iPad avec deviceOwnership Company, inscrits via ADE et supervisés — règle dans extras/ios/README.md)** — Presque tous les paramètres nécessitent un appareil supervisé (ADE) ; sur un appareil personnel, ils sont inappropriés ou sans effet. Après l'affectation, l'utilisateur ne peut plus effacer lui-même l'appareil — la réinitialisation passe par Intune. | A.7.7, A.8.1, A.8.9, A.8.19, A.8.20 |
| [`MAC - D - Enrollment Profile Administrator User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Administrator_User_Affinity.fr.md) | **Jeton ADE (choisissez l'un des deux profils par jeton — un profil d'inscription macOS est lié à un jeton ADE, pas à un groupe Entra)** — Alternative au profil d'inscription standard ; ils diffèrent d'exactement un paramètre. Une inscription verrouillée ne peut être annulée après coup que par un wipe. | A.5.9, A.8.1, A.8.2 |
| [`MAC - D - Enrollment Profile Standard User Affinity`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.fr.md) | **Jeton ADE (choisissez l'un des deux profils par jeton — un profil d'inscription macOS est lié à un jeton ADE, pas à un groupe Entra)** — Alternative au profil d'inscription administrateur ; ils diffèrent d'exactement un paramètre. | A.5.9, A.8.1, A.8.2 |
| [`MAC - D - Privacy Preferences`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Privacy_Preferences.fr.md) | **SEC-Remote-Support-macOS (Mac sur lesquels tourne NinjaOne ou TeamViewer)** — Concerne deux outils d'assistance à distance précis, NinjaOne et TeamViewer, et pas toutes les organisations. L'affecter à un Mac sans ces outils n'a aucun effet ; l'affecter là où se trouve une autre installation de TeamViewer donne bel et bien des droits à celle-ci sans que personne n'approuve quoi que ce soit. Si l'organisation utilise d'autres outils, remplacez les bundle IDs et les code requirements au lieu d'affecter cette policy. | A.8.18 |
| [`MAC - D - Screen Recording`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Screen_Recording.fr.md) | **SEC-Remote-Support-macOS (Mac sur lesquels tourne NinjaOne ou TeamViewer)** — Concerne deux outils d'assistance à distance précis, NinjaOne et TeamViewer, et pas toutes les organisations. L'affecter à un Mac sans ces outils n'a aucun effet ; l'affecter là où se trouve une autre installation de TeamViewer donne bel et bien des droits à celle-ci sans que personne n'approuve quoi que ce soit. Si l'organisation utilise d'autres outils, remplacez les bundle IDs et les code requirements au lieu d'affecter cette policy. | A.8.18 |
| [`WIN - D - Defender ASR Policy Audit Mode`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.fr.md) | **SEC-Baseline-Pilot** — Groupe pilote, et ce sans la policy ASR bloquante — les mêmes seize règles en audit au lieu de block. | A.8.7, A.8.16 |
| [`WIN - D - Defender Update Ring 1 Pilot`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_1_Pilot.fr.md) | **SEC-Update-Ring1** — Groupe pilote pour les mises à jour Defender. | A.8.7, A.8.8, A.8.32 |
| [`WIN - D - Defender Update Ring 2 UAT`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Defender_Update_Ring_2_UAT.fr.md) | **SEC-Update-Ring2** — Groupe UAT pour les mises à jour Defender. | A.8.7, A.8.8, A.8.32 |
| [`WIN - D - Windows Hello for Business Multi User`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business_Multi_User.fr.md) | **SEC-Shared-Devices** — Appareils partagés. La seule que l'on peut affecter à côté de son homologue : les quatre paramètres qui se recoupent ont la même valeur. | A.5.17, A.8.5 |
| [`WIN - D - Windows Update Ring 1 Pilot`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_1_Pilot.fr.md) | **SEC-Update-Ring1** — Groupe pilote pour les mises à jour Windows. | A.8.8, A.8.32 |
| [`WIN - D - Windows Update Ring 2 UAT`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Windows_Update_Ring_2_UAT.fr.md) | **SEC-Update-Ring2** — Groupe UAT pour les mises à jour Windows. | A.8.8, A.8.32 |
| [`WIN - D - Wireless Shared Devices`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Wireless_Shared_Devices.fr.md) | **SEC-Shared-Devices** — Appareils partagés. Sur un ordinateur portable à utilisateur unique, cela rend impossible le télétravail et le travail à l'hôtel. | A.8.1, A.8.20 |

### C. En attente d'un prérequis — phase 3 (26)

Prête, mais n'agit qu'une fois le prérequis rempli. Décision : qui s'en charge et quand.

| Policy | Prérequis | Normes (ISO) |
|---|---|---|
| [`AND - D - System Updates`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_D_System_Updates.fr.md) | En attente de la première inscription fully managed, corporate-owned work profile ou dedicated. À affecter à un groupe d'appareils ou avec un filtre sur la propriété Corporate ; sur un groupe pilote, vérifier d'abord si les appareils restent allumés et en charge la nuit. | A.8.8 |
| [`AND - U - Compliance Block Device Administrator`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Block_Device_Administrator.fr.md) | N'a d'effet que sur un tenant qui compte encore des appareils device administrator ou où cette inscription n'est pas bloquée. Voir extras/android/enrollment-restrictions pour fermer cette inscription ; cette policy nettoie ce qui existe déjà. | A.8.1, A.8.9 |
| [`AND - U - Compliance Corporate Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Defender_for_Endpoint.fr.md) | En attente d'une inscription fully managed ou corporate-owned work profile, ainsi que d'une licence Defender for Endpoint, du connecteur avec Android activé et de l'application Defender via Managed Google Play. | A.8.7, A.8.16 |
| [`AND - U - Compliance Corporate Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Device_Health.fr.md) | En attente de la première inscription fully managed ou corporate-owned work profile ; le type `androidDeviceOwnerCompliancePolicy` n'affecte aucun autre appareil. | A.8.1, A.8.7, A.8.8 |
| [`AND - U - Compliance Corporate Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Corporate_Password.fr.md) | En attente de la première inscription fully managed ou corporate-owned work profile. | A.5.17, A.8.5, A.8.24 |
| [`AND - U - Compliance Defender for Endpoint`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Defender_for_Endpoint.fr.md) | En attente de trois prérequis : une licence Defender for Endpoint, le connecteur Defender–Intune avec Android activé, et l'application Defender déployée via Managed Google Play. Sans ces trois éléments, tout appareil devient non conforme. | A.8.7, A.8.16 |
| [`AND - U - Compliance Device Health`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Device_Health.fr.md) | En attente de la première inscription avec profil professionnel personnel. Une compliance policy n'affecte qu'un appareil inscrit ; tant qu'Android ne passe que par App Protection sans inscription, elle n'a aucun effet. | A.8.1, A.8.7, A.8.8, A.8.19 |
| [`AND - U - Compliance Password`](../IntuneTemplate/AND/CompliancePolicies/Baseline_AND_U_Compliance_Password.fr.md) | En attente de la première inscription Android. | A.5.17, A.8.1, A.8.5, A.8.24 |
| [`AND - U - Corporate Device Security`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Device_Security.fr.md) | En attente de la première inscription fully managed ou corporate-owned work profile. Ensuite, d'abord sur un groupe pilote : les utilisateurs reçoivent un nouveau code, le stockage externe et les réseaux 2G disparaissent, et un Private Space existant est supprimé. | A.5.17, A.7.7, A.7.10, A.8.1, A.8.5, A.8.7, A.8.8, A.8.12, A.8.17, A.8.20 |
| [`AND - U - Work Profile Restrictions`](../IntuneTemplate/AND/DeviceConfigurations/Baseline_AND_U_Work_Profile_Restrictions.fr.md) | En attente de la première inscription avec profil professionnel personnel. Ensuite, d'abord sur un groupe pilote : les utilisateurs reçoivent la première fois un code supplémentaire pour le profil professionnel et ne peuvent plus copier des applications professionnelles vers les applications personnelles. | A.5.17, A.7.7, A.8.1, A.8.5, A.8.12 |
| [`IOS - D - Apple Intelligence Restricted`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Apple_Intelligence_Restricted.fr.md) | En attente de la première inscription iOS. En outre, un choix de l'organisation : choisir entre celle-ci et la variante Permitted, jamais les deux. | A.5.10, A.5.34, A.8.12 |
| [`IOS - D - Data Protection`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Data_Protection.fr.md) | En attente de la première inscription iOS. Les utilisateurs remarqueront que « Ouvrir dans » depuis les applications gérées ne propose plus d'applications personnelles. | A.8.1, A.8.12, A.8.24 |
| [`IOS - D - Enterprise SSO`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Enterprise_SSO.fr.md) | En attente de la première inscription iOS et de Microsoft Authenticator sur l'appareil : Apple n'accepte l'extension SSO que via MDM, et sans Authenticator aucun plug-in ne l'exécute. | A.5.17, A.8.5 |
| [`IOS - D - Passcode`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Passcode.fr.md) | En attente de la première inscription iOS. Attention lors du premier déploiement : un utilisateur ayant un code à quatre chiffres ou un code simple doit le modifier au prochain déverrouillage. | A.5.17, A.8.1, A.8.5 |
| [`IOS - D - Software Updates`](../IntuneTemplate/IOS/SettingsCatalog/Baseline_IOS_D_Software_Updates.fr.md) | En attente de la première inscription iOS. Après l'échéance, l'appareil installe lui-même la mise à jour à 02:00 et redémarre — annoncez-le et observez comment cela se passe sur les premiers appareils. | A.8.8, A.8.9 |
| [`IOS - U - Compliance Defender for Endpoint`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Defender_for_Endpoint.fr.md) | En attente de trois prérequis : une licence Defender for Endpoint pour l'utilisateur, le connecteur Intune pour Defender for Endpoint avec iOS/iPadOS activé, et l'application Defender sur l'appareil. Ne l'affectez qu'une fois ces éléments en place — sinon un appareil sans signal de risque peut, selon le paramètre du connecteur, être déclaré non conforme. | A.5.15, A.8.7, A.8.16 |
| [`IOS - U - Compliance Device Health`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Device_Health.fr.md) | En attente de la première inscription iOS. Une compliance policy n'affecte qu'un appareil inscrit ; tant qu'iOS ne passe que par App Protection sans inscription, elle n'a aucun effet. | A.5.15, A.8.1, A.8.7 |
| [`IOS - U - Compliance Password`](../IntuneTemplate/IOS/CompliancePolicies/Baseline_IOS_U_Compliance_Password.fr.md) | En attente de la première inscription iOS. | A.5.17, A.8.1, A.8.5 |
| [`MAC - D - Azure Files Cloud Kerberos`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Azure_Files_Cloud_Kerberos.fr.md) | Attend qu'il existe un compte de stockage avec Entra Kerberos comme source d'identité. Un compte déjà configuré sur Microsoft Entra Domain Services ou AD DS ne peut pas l'avoir en même temps, et le basculer affecte tout ce qui tourne déjà sur ce compte. Sur un Mac disposant d'un TGT cloud valide, un tel compte renvoie AADSTS700016 — le KDC ne connaît aucune application pour ce service de fichiers. Le profil lui-même est terminé et indépendant du compte : `Hosts` est défini sur `.windows.net` et couvre donc tout compte de stockage. Dès qu'il en existe un avec Entra Kerberos, ceci peut passer en phase 1, avec comme second prérequis que Microsoft active le tenant pour la préversion macOS (azurefiles@microsoft.com). | A.8.5 |
| [`MAC - D - Wifi Corporate`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Corporate.fr.md) | Le SSID et la PSK sont définis sur un placeholder. Une affectation avant qu'ils soient renseignés produit un profil qui ne se connecte nulle part. Passez la phase à 1 dès que les vraies valeurs y figurent. | A.8.1, A.8.20, A.8.21 |
| [`MAC - D - Wifi Guest`](../IntuneTemplate/MAC/DeviceConfigurations/Baseline_MAC_D_Wifi_Guest.fr.md) | Le SSID et la PSK sont définis sur un placeholder. Une affectation avant qu'ils soient renseignés produit un profil qui ne se connecte nulle part. Passez la phase à 1 dès que les vraies valeurs y figurent, et pas avant Wifi Corporate. | A.8.20, A.8.21 |
| [`WIN - D - Wifi Corporate`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Corporate.fr.md) | Le SSID et la PSK sont définis sur un placeholder. Une affectation avant qu'ils soient renseignés produit un profil qui ne se connecte nulle part. Passez la phase à 1 dès que les vraies valeurs y figurent. | A.8.1, A.8.20, A.8.21 |
| [`WIN - D - Wifi Guest`](../IntuneTemplate/WIN/DeviceConfigurations/Baseline_WIN_D_Wifi_Guest.fr.md) | Le SSID et la PSK sont définis sur un placeholder. Une affectation avant qu'ils soient renseignés produit un profil qui ne se connecte nulle part. Passez la phase à 1 dès que les vraies valeurs y figurent, et pas avant Wifi Corporate. | A.8.20, A.8.21 |
| [`WIN - D - Windows AI Recall Boundaries`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Recall_Boundaries.fr.md) | Va de pair avec CXNM - Standard - WIN - D - Windows AI Permitted et n'a aucun effet sans cette policy : si Recall est désactivé, il n'y a rien à restreindre. Ne l'affectez que lorsque l'organisation autorise Recall, et complétez d'abord la liste d'applications avec les programmes qui affichent des données sensibles dans cet environnement. | A.5.33, A.5.34, A.8.11, A.8.12 |
| [`WIN - D - Windows Event Forwarding`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Event_Forwarding.fr.md) | N'a aucun effet sans un Windows Event Collector avec des abonnements initiés par la source, joignable depuis les appareils (VPN, Always On VPN ou réseau interne). Quiconque centralise les journaux via Defender for Endpoint, Microsoft Sentinel ou l'Azure Monitor Agent n'a pas besoin de cette policy. | A.8.15, A.8.16 |
| [`WIN - U - Compliance Defender for Endpoint Risk`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_Defender_for_Endpoint_Risk.fr.md) | En attente du connecteur Microsoft Defender for Endpoint dans Intune (Endpoint security → Microsoft Defender for Endpoint → 'Connect Windows devices … to Defender for Endpoint' activé) et d'une licence Defender for Endpoint P1/P2 ou Business. Sans connecteur, chaque appareil indique « non conforme » ou « non disponible » pour ce contrôle. | A.5.15, A.8.7, A.8.16 |

### D. Pilote — phase 2 (39)

Perceptible par les utilisateurs ou susceptible de casser quelque chose. Décision : accepter les conséquences après le pilote et passer en phase 1.
Jusqu'à cette décision, la mesure que la policy met en œuvre n'est pas couverte.

| Policy | Conséquence à accepter | Normes (ISO) |
|---|---|---|
| [`AND - U - Corporate AI Restricted`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_AI_Restricted.fr.md) | Les utilisateurs perdent Circle to Search et le contexte d'écran de Gemini sur le profil professionnel ou sur tout l'appareil. Que cela convienne relève du choix de l'organisation concernant l'IA générative, comme pour Windows AI Restricted ; d'abord sur un groupe pilote, et ne pas affecter dans une organisation qui autorise ces assistants. | A.5.10, A.5.34, A.8.12 |
| [`AND - U - Corporate Data Protection`](../IntuneTemplate/AND/SettingsCatalog/Baseline_AND_U_Corporate_Data_Protection.fr.md) | Les utilisateurs le remarquent immédiatement : pas de captures d'écran, pas de fichiers via Bluetooth, et un appareil fully managed ne peut plus être réinitialisé par l'utilisateur — l'IT doit l'effacer. D'abord sur un groupe pilote ; sans inscription fully managed ou corporate-owned work profile, il ne fait rien. | A.7.9, A.8.1, A.8.12 |
| [`MAC - D - Apple Intelligence Restricted`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Apple_Intelligence_Restricted.fr.md) | Les utilisateurs voient disparaître Writing Tools, les résumés, Genmoji, Image Playground et l'intégration ChatGPT. C'est voulu, mais c'est visible et mérite une annonce. Choisissez par organisation entre celle-ci et la variante Permitted — ne jamais affecter les deux. | A.5.10, A.5.34, A.8.12 |
| [`MAC - D - FileVault`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.fr.md) | Chiffre le disque et demande pour cela la coopération de l'utilisateur. Vérifiez pendant le pilote que la clé de récupération apparaît bien dans Intune avant de déployer largement. | A.7.9, A.8.1, A.8.24 |
| [`MAC - D - Login Window`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Login_Window.fr.md) | Dans la fenêtre de connexion, les utilisateurs doivent saisir leur nom de compte au lieu de cliquer sur leur nom. À annoncer. Après un redémarrage, l'utilisateur voit toujours la liste des comptes de l'écran de déverrouillage FileVault ; ce paramètre s'applique à la fenêtre de connexion qui suit (déconnexion, changement d'utilisateur). | A.5.10, A.8.5 |
| [`MAC - D - Passcode and Screen Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Passcode_and_Screen_Lock.fr.md) | Les utilisateurs dont le mot de passe est plus court ou plus simple doivent le changer à leur prochaine connexion. | A.5.17, A.7.7, A.8.1, A.8.5 |
| [`MAC - D - Recovery Lock`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Recovery_Lock.fr.md) | Quiconque a besoin de recoveryOS — réinstaller macOS, Utilitaire de disque depuis la récupération, un autre disque de démarrage — doit désormais demander le mot de passe au service desk. Vérifiez pendant le pilote que le mot de passe est visible dans Intune avant de déployer largement. | A.5.17, A.7.9, A.8.1, A.8.18 |
| [`MAC - D - Restrictions Hardening`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Restrictions_Hardening.fr.md) | Lancer une application non signée via clic droit → Ouvrir n'est plus possible, et un utilisateur ne peut plus installer manuellement un profil ou un certificat (par exemple d'un fournisseur VPN, d'un environnement de test ou d'un portail Wi-Fi). Inventoriez pendant le pilote qui le fait actuellement ; ces installations doivent désormais passer par Intune. | A.5.34, A.8.9, A.8.19 |
| [`MAC - D - Screensaver`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Screensaver.fr.md) | Quiconque a l'habitude de retrouver l'écran sans mot de passe dans la minute suivant l'économiseur d'écran doit désormais utiliser immédiatement son mot de passe ou Touch ID. Perceptible, sans rien casser ; d'abord pilote et annonce. | A.7.7, A.8.1, A.8.5 |
| [`MAC - D - Software Updates`](../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_Software_Updates.fr.md) | Les mises à jour sont installées automatiquement et imposées au plus tard 30 jours après leur publication avec un redémarrage à 12:30 — y compris pour une nouvelle version majeure de macOS. Vérifiez pendant le pilote comment tombe le moment du redémarrage et si les applications métier supportent la nouvelle version majeure. L'inscription aux bêtas n'est plus possible. | A.8.8, A.8.19 |
| [`MAC - U - Compliance OS Version`](../IntuneTemplate/MAC/CompliancePolicies/Baseline_MAC_U_Compliance_OS_Version.fr.md) | Un Mac sous macOS 14 devient non conforme et perd l'accès via Conditional Access. OVERZICHT.md mentionne déjà que les Mac plus anciens ne reçoivent pas le profil de mise à jour ; cette policy rend cela visible au lieu de silencieux. Vérifiez d'abord combien de Mac sont concernés. Le délai de grâce est de 72 heures. | A.8.8, A.8.19 |
| [`WIN - D - Access Control`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Access_Control.fr.md) | Les utilisateurs doivent saisir leur nom complet au lieu de cliquer dessus, et ils voient une bannière. Adaptez d'abord le texte de la bannière au nom de votre organisation. | A.5.15, A.5.17, A.8.5 |
| [`WIN - D - Account Lockout`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Account_Lockout.fr.md) | Le seuil machine place un appareil en récupération BitLocker après dix tentatives échouées. C'est récupérable (la clé est stockée dans Entra ID) mais cela génère une demande au support ; vérifiez pendant le pilote à quelle fréquence cela se produit. | A.5.15, A.5.17, A.8.5 |
| [`WIN - D - Administrator Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Administrator_Protection.fr.md) | Change la façon de travailler d'un administrateur : plus de droits élevés en permanence, mais une confirmation pour chaque action. Les scripts et outils qui s'appuient silencieusement sur les droits d'administrateur le remarqueront. Windows 11 24H2 et versions ultérieures ; sur les builds plus anciens, il ne fait rien. | A.8.2 |
| [`WIN - D - Cryptography`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Cryptography.fr.md) | Un système interne qui ne parle que TLS 1.0/1.1 devient inaccessible. C'est voulu, mais il faut le savoir. | A.8.24 |
| [`WIN - D - Device Guard and Credential Guard`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Device_Guard_and_Credential_Guard.fr.md) | Nécessite un redémarrage, et l'intégrité de la mémoire (HVCI) ne charge pas les pilotes qui n'ont pas été conçus pour elle — pensez aux anciens pilotes VPN, d'imprimante et de station d'accueil. Vérifiez pendant le pilote que tout démarre encore. | A.5.17, A.8.1, A.8.7 |
| [`WIN - D - Disable NTLM`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Disable_NTLM.fr.md) | Refuse tout NTLM, entrant et sortant. Ce qui ne peut pas passer par Kerberos casse : les applications qui se connectent par adresse IP, les appareils hors du domaine, et les partages pour lesquels l'appareil n'obtient pas de ticket Kerberos — un appareil joint à Entra qui ouvre un partage sur Entra Domain Services se rabat sur NTLM. Avant le pilote, consultez Microsoft-Windows-NTLM/Operational sur quelques appareils Windows 11 24H2 (4020/4021 sortant, 4022/4023 entrant) : cette journalisation y est activée par défaut et montre ce qui casserait. | A.8.5 |
| [`WIN - D - Enrollment Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Enrollment_Hardening.fr.md) | Concerne la première installation d'un appareil, pas un appareil en service. Testez sur un appareil Autopilot : sans réseau, l'utilisateur ne peut pas aller plus loin, et c'est voulu — mais cela doit correspondre à la manière dont les appareils sont déployés chez vous. | A.5.9, A.5.15, A.8.1 |
| [`WIN - D - In-Box App Removal`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_In_Box_App_Removal.fr.md) | Supprime les applications intégrées, y compris sur les appareils déjà en service. Vérifiez pendant le pilote si quelqu'un en regrette une. | A.8.19 |
| [`WIN - D - Kernel DMA Protection`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Kernel_DMA_Protection.fr.md) | Une station d'accueil ou un eGPU sans remappage DMA ne fonctionne plus. Testez avec les stations d'accueil présentes dans le parc. | A.7.9, A.8.1 |
| [`WIN - D - Logon Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Logon_Hardening.fr.md) | Les utilisateurs devront désormais appuyer sur CTRL+ALT+DEL avant l'écran de connexion. Communiquez-le avant le déploiement général. | A.5.15, A.8.5, A.8.20 |
| [`WIN - D - Microsoft Edge DNS over HTTPS Automatic`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Microsoft_Edge_DNS_over_HTTPS_Automatic.fr.md) | Automatique est la valeur par défaut d'Edge, mais une fois imposée, l'utilisateur ne peut plus la désactiver ni choisir son propre résolveur. Testez sur le groupe pilote que les noms internes et un éventuel proxy web/filtre DNS continuent de fonctionner. | A.8.20, A.8.24 |
| [`WIN - D - Network Authentication Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Network_Authentication_Hardening.fr.md) | Fermer PKU2U casse le Bureau à distance vers un autre appareil joint à Entra avec des identifiants Entra via l'ancienne méthode de connexion, et le mode P-node casse la résolution de noms NetBIOS par diffusion dans un réseau sans DNS ni WINS. D'abord sur le groupe pilote. | A.8.5, A.8.20 |
| [`WIN - D - Printing Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Printing_Hardening.fr.md) | Windows Protected Print abandonne les imprimantes qui n'ont pas de pilote Mopria. Inventoriez d'abord le parc d'imprimantes. | A.8.7, A.8.19, A.8.20 |
| [`WIN - D - Remote Access Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Remote_Access_Hardening.fr.md) | Vérifiez qu'aucun script de gestion ni outil de supervision ne s'appuie sur winrs. Enter-PSSession et Invoke-Command continuent de fonctionner, winrs non. | A.5.15, A.8.20, A.8.21 |
| [`WIN - D - Removable Storage`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Removable_Storage.fr.md) | L'écriture sur les clés USB, les disques externes et les téléphones est bloquée, et un utilisateur le remarque immédiatement. Attention : tant que cette policy n'est pas déployée largement, le stockage amovible n'est restreint nulle part — BitLocker laisse volontairement removabledrivesrequireencryption désactivé, car ce blocage le couvre. | A.7.10, A.8.12 |
| [`WIN - D - Script File Associations`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Script_File_Associations.fr.md) | Un double-clic sur un fichier .js, .vbs ou .hta ouvre désormais le Bloc-notes. Un script d'ouverture de session ou d'installation lancé de cette façon ne fait alors plus rien ; vérifiez pendant le pilote si de tels scripts circulent. | A.8.7 |
| [`WIN - D - Security Log Monitoring`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Security_Log_Monitoring.fr.md) | La journalisation des modules pour tous les modules (*) produit beaucoup d'événements 4103 dans Microsoft-Windows-PowerShell/Operational. Vérifiez d'abord sur le groupe pilote l'effet sur le volume des journaux et sur une éventuelle ingestion SIEM ; voir extras/windows/remediations/event-log-sizes pour la taille des journaux. | A.8.15, A.8.16 |
| [`WIN - D - Windows AI Features Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_AI_Features_Restricted.fr.md) | Les utilisateurs voient disparaître les boutons d'IA dans Paint. C'est voulu, mais c'est visible et mérite une annonce. Choisissez par organisation entre celle-ci et la variante Permitted — ne jamais affecter les deux. | A.5.10, A.5.34, A.8.1 |
| [`WIN - D - Windows Component Hardening`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Component_Hardening.fr.md) | Perceptible sur deux points : « Continuer sur cet appareil » (Continue experiences) disparaît, et un appareil kiosque qui fonctionne avec AutoAdminLogon ne se connecte plus automatiquement. D'abord sur le groupe pilote ; tenir les kiosques en dehors de cette policy. | A.8.1, A.8.9 |
| [`WIN - D - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_for_Business.fr.md) | Chaque utilisateur est guidé dans la configuration du PIN à sa prochaine connexion, et un appareil sans TPM n'obtient pas WHfB. Entre dans le pilote avec WIN - U - Windows Hello for Business : l'une dans le pilote et l'autre sur tout le monde rend le pilote inutile. | A.5.17, A.8.5 |
| [`WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_D_Windows_Hello_Passkey_PIN_Complexity_Alphanumeric.fr.md) | Entre dans le pilote avec WIN - D - Windows Hello for Business et WIN - U - Windows Hello for Business — elles sont dans la même phase et attendent cette même décision. Affecter la complexité à des utilisateurs sans WHfB configuré ne fait rien ; à l'inverse, un utilisateur avec WHfB mais sans cette policy retombe sur six chiffres. Surveillez pendant le pilote le nombre de réinitialisations de PIN : c'est le coût de cette variante. Il existe quatre policies de complexité du PIN et une seule peut être affectée à la fois : `WIN - D - Windows Hello Passkey PIN Complexity Alphanumeric` / `Numeric` (l'ensemble nommé passkey) et `WIN - D - Windows Hello PIN Complexity Alphanumeric` / `Numeric` (l'ensemble générique, plus ancien). Deux policies affectées qui définissent le même paramètre avec une valeur différente produisent un Conflict dans Intune, après quoi aucune des deux n'est appliquée. | A.5.17, A.8.5 |
| [`WIN - U - AI Usage Control Restricted`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_AI_Usage_Control_Restricted.fr.md) | Reprend la liste de blocage d'URL d'Edge de Microsoft Edge User Experience — ce paramètre y a déjà été retiré. Vérifiez pendant le pilote qu'aucun site légitime n'est bloqué. Choisissez par organisation entre celle-ci et la variante Permitted ; ne jamais affecter les deux. | A.5.10, A.5.19, A.8.1, A.8.23 |
| [`WIN - U - Compliance OS Version`](../IntuneTemplate/WIN/CompliancePolicies/Baseline_WIN_U_Compliance_OS_Version.fr.md) | Un appareil sous le seuil minimal devient non conforme et perd ainsi l'accès via Conditional Access. Vérifiez d'abord dans les rapports combien d'appareils sont concernés — la réponse devrait être zéro, mais il faut l'avoir constaté et non le supposer. Le délai de grâce est de 72 heures. | A.8.8, A.8.19 |
| [`WIN - U - File Sharing Restrictions`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_File_Sharing_Restrictions.fr.md) | Un utilisateur habitué à partager un dossier de son profil via l'Explorateur de fichiers verra cette option disparaître. Le partage via OneDrive et Teams continue de fonctionner. | A.8.3, A.8.12 |
| [`WIN - U - Microsoft Edge Management`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Edge_Management.fr.md) | Inverse la priorité : la policy de l'Edge Management Service l'emporte alors sur la policy Edge de cette baseline. Toute personne ayant le rôle Edge Administrator peut donc écraser des paramètres de Microsoft Edge Security et User Experience. Consignez d'abord qui détient ce rôle avant le déploiement général. | A.8.9 |
| [`WIN - U - Microsoft Outlook Cached Mode Managed`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Outlook_Cached_Mode_Managed.fr.md) | Concerne chaque profil existant : Outlook reconstruit l'OST et une boîte aux lettres partagée dans le profil passe du mode mis en cache au mode en ligne. C'est visible — la première synchronisation prend du temps et de la bande passante, et quiconque a l'habitude de travailler hors ligne dans une boîte partagée le remarque immédiatement. D'abord sur le groupe pilote, et vérifiez-y combien de profils ont une boîte aux lettres partagée. | A.8.9 |
| [`WIN - U - Microsoft Teams`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Microsoft_Teams.fr.md) | Bloque la connexion avec un compte d'un autre tenant. C'est voulu, mais quiconque utilise un second compte professionnel dans Teams le remarque immédiatement — vérifiez pendant le pilote si cela se produit. | A.5.14, A.5.15, A.8.12 |
| [`WIN - U - Windows Hello for Business`](../IntuneTemplate/WIN/SettingsCatalog/Baseline_WIN_U_Windows_Hello_for_Business.fr.md) | Va de pair avec WIN - D - Windows Hello for Business et entre dans le pilote avec elle — sur tous les utilisateurs, elle configurerait quand même WHfB sur chaque appareil, et le pilote ne testerait alors rien. | A.5.17, A.8.5 |

### Risques résiduels

**Mesures ISO réalisables techniquement mais non couvertes aujourd'hui par la phase 1 (16).**
Acceptez le risque explicitement, traitez-le en dehors de cette baseline, ou passez la policy préparée en phase 1.

| Mesure | Réalisable | Préparé dans la baseline |
|---|---|---|
| **A.5.3** Séparation des tâches | partiel | — |
| **A.5.7** Renseignements sur les menaces | partiel | — |
| **A.5.9** Inventaire des informations et autres actifs associés | partiel | `WIN - D - Enrollment Hardening`, `MAC - D - Enrollment Profile Administrator User Affinity`, `MAC - D - Enrollment Profile Standard User Affinity` |
| **A.5.11** Restitution des actifs | partiel | — |
| **A.5.18** Droits d'accès | partiel | — |
| **A.5.23** Sécurité de l'information dans l'utilisation de services en nuage | partiel | — |
| **A.5.25** Évaluation des événements liés à la sécurité de l'information et prise de décision | partiel | — |
| **A.5.26** Réponse aux incidents liés à la sécurité de l'information | partiel | — |
| **A.5.28** Collecte des preuves | partiel | — |
| **A.5.33** Protection des enregistrements | partiel | `WIN - D - Windows AI Recall Boundaries` |
| **A.5.36** Conformité aux politiques, règles et normes de sécurité de l'information | partiel | — |
| **A.6.5** Responsabilités après la fin ou le changement d'un emploi | partiel | — |
| **A.6.7** Travail à distance | partiel | — |
| **A.7.14** Élimination ou recyclage sécurisé(e) du matériel | partiel | — |
| **A.8.10** Suppression des informations | partiel | — |
| **A.8.11** Masquage des données | partiel | `WIN - D - Windows AI Recall Boundaries` |

**Points NIS2 sans aucune mesure technique en phase 1 :** (a). Pour ces points, la conformité repose entièrement sur les mesures organisationnelles.

Toutes les policies renvoient à une norme.

## Ce qu'une licence apporterait

Le point de départ est **Microsoft 365 Business Premium** (300 utilisateurs maximum). Ce qu'elle comprend :

- Microsoft Entra ID P1
- Microsoft Intune Plan 1
- Microsoft Defender for Business (Windows, Mac, Android, iOS)
- Microsoft Defender for Office 365 Plan 1
- Windows 11 Business (niveau Pro, pas Enterprise)
- Purview Information Protection et DLP

Ci-dessous, pour chaque licence, les policies de cette baseline qui deviennent opérantes grâce à elle, et les
normes concernées. Les policies en attente d'un pilote, d'une décision de l'organisation ou d'une inscription
n'y figurent **pas** — elles ont leur propre raison dans [Choix de l'organisation](#choix-de-lorganisation-et-risques-résiduels).

### Microsoft Entra ID P2

*séparément par utilisateur, ou dans le cadre de la Defender Suite for Business Premium*

Conditional Access basé sur le risque figure comme « P1: No » dans le propre tableau de licences de Microsoft. Quatre templates du dépôt CA utilisent userRiskLevels ou signInRiskLevels comme condition ; en P1, ces conditions ne sont jamais remplies, donc les policies n'ont aucun effet — alors qu'elles sont bien déployées et considérées comme présentes lors de l'évaluation.

| Côté | Policies |
|---|---|
| Conditional Access (4) | `CXNM - STANDARD - 1090 - BLOCK - HighRisk SignIns`, `CXNM - STANDARD - 1100 - BLOCK - HighRisk Users`, `CXNM - STANDARD - 2010 - GRANT - MediumRisk Signins`, `CXNM - STANDARD - 2020 - GRANT - MediumRisk Users` |

**Sans nouvelle policy, mais avec couverture :** Privileged Identity Management : rôles just-in-time plutôt que permanents, avec approbation et piste d'audit. A.5.3 figure désormais explicitement dans COMPLIANCE.md comme « Mettre en place le RBAC Entra/Intune et PIM — hors de cette baseline ».

ISO: `A.5.3 Functiescheiding`, `A.8.2 Speciale toegangsrechten` · NIS2: `(i)`

### Microsoft Defender for Cloud Apps

*séparément, ou dans le cadre de la Defender Suite for Business Premium*

La stratégie CA 3060 fait passer les sessions de navigateur par MDCA comme contrôle de session. Sans cette licence, le contrôle de session ne peut pas être sélectionné dans la policy.

| Côté | Policies |
|---|---|
| Conditional Access (1) | `CXNM - STANDARD - 3060 - SESSION - Defender for Cloud Apps` |

### Microsoft Defender Suite for Business Premium

*module complémentaire à Business Premium, commercial et non-profit*

Regroupe entra-id-p2 et defender-cloud-apps, donc les cinq mêmes policies. Ce qui s'y ajoute n'est pas une policy mais une capacité d'investigation : threat hunting, live response, six mois de rétention et automated investigation & response.

**Sans nouvelle policy, mais avec couverture :** Automated investigation & response assure l'évaluation et le confinement ; six mois de rétention des appareils et l'advanced hunting fournissent les preuves exigées par A.5.28 et qui étayent une notification NIS2 dans les 24 heures.

ISO: `A.5.7 Informatie en analyses over dreigingen`, `A.5.25 Beoordelen van en besluiten over informatiebeveiligingsgebeurtenissen`, `A.5.26 Reageren op informatiebeveiligingsincidenten`, `A.5.28 Verzamelen van bewijsmateriaal` · NIS2: `(b)`

> **Attention.** Defender for Business et Defender for Endpoint Plan 2 NE PEUVENT PAS coexister dans un même tenant. Microsoft : une organisation disposant des deux 'defaults to the Defender for Business experience'. Pour obtenir réellement P2, il faut licencier chaque utilisateur et demander au support Microsoft de convertir le tenant. Un achat partiel donne donc le prix de P2 avec les capacités de Defender for Business.

### Windows 11 Enterprise E3 of E5

*licence distincte à côté de Business Premium ; la disponibilité varie selon le canal — à vérifier auprès du distributeur*

Personal Data Encryption et Credential Guard figurent comme « Windows Pro: No » dans le tableau des éditions de Microsoft. Business Premium fournit Windows 11 Business, qui est de niveau Pro.

| Côté | Policies |
|---|---|
| Intune (1) | `WIN - U - Personal Data Encryption` |

**Partiellement: WIN - D - Device Guard and Credential Guard.** L'un des huit paramètres (deviceguard_lsacfgflags, Credential Guard) est réservé à Enterprise. Les sept autres — VBS, HVCI, System Guard Secure Launch, protection LSA, Secure Boot avec DMA — fonctionnent sur Pro. Cette policy est donc utile sans cette licence ; elle contient un paramètre inopérant.

**Arbitrage.** Sur un parc avec BitLocker sur tous les appareils et OneDrive Known Folder Move, le gain marginal de PDE est faible : le disque est déjà chiffré et les dossiers sont déjà dans le cloud. PDE protège contre un autre scénario — un appareil allumé et déverrouillé sur lequel un autre utilisateur se connecte. Achetez-le si un contrat ou une déclaration d'applicabilité l'exige, pas parce que cela paraît complet.

### Microsoft Entra Workload ID Premium

*licence distincte ; N'EST PAS incluse dans Entra ID P2 ni dans la Defender Suite*

La détection des risques sur les identités de charge de travail est un SKU distinct. C'est le piège de la Defender Suite : P2 couvre le risque utilisateur, pas le risque des charges de travail.

| Côté | Policies |
|---|---|
| Conditional Access (1) | `CXNM - STANDARD - 1140 - BLOCK - Managed Identities At Risk` |

### Microsoft Entra Agent ID

*pas encore disponible dans tous les tenants*

Les cinq templates d'agent nécessitent des identités d'agent. Ce n'est pas une décision d'achat mais une question de disponibilité ; ils sont donc en report-only jusqu'à ce que la fonctionnalité soit disponible.

| Côté | Policies |
|---|---|
| Conditional Access (5) | `CXNM - STANDARD - 1150 - BLOCK - Risky Agent Identities`, `CXNM - STANDARD - 1160 - BLOCK - Agent Identities To Agent Resources`, `CXNM - STANDARD - 1170 - BLOCK - Risky Agent Users`, `CXNM - STANDARD - 1180 - BLOCK - Agent Users Outside Compliant Network`, `CXNM - STANDARD - 2160 - GRANT - Agent Users Compliant Device` |

### Ce pour quoi il n'est pas nécessaire de payer

Des éléments dont on pense facilement qu'ils nécessitent une licence, mais que Business Premium
couvre déjà. Ils figurent ici pour que personne ne les paie par erreur.
Les six compliance policies Defender des phases 3 et 4 attendent une CONFIGURATION, pas un budget :
le connecteur Defender–Intune, et l'application Defender déployée via Managed Google Play ou VPP.
Defender for Business couvre Windows, Mac, Android et iOS.

| Quoi | Pourquoi cela fonctionne déjà |
|---|---|
| Règles Attack Surface Reduction | Microsoft : 'ASR rules are a Microsoft Defender Antivirus feature available on any edition of Windows.' Seul le reporting centralisé exige davantage ; les règles elles-mêmes s'appliquent sur Pro. |
| Defender sur Android et iOS | Defender for Business prend en charge Windows, Mac, Android et iOS/iPadOS. Les compliance policies associées attendent le connecteur et le déploiement de l'application, pas une licence. |
| Conditional Access lui-même | Entra ID P1 est inclus dans Business Premium. Seules les quatre policies basées sur le risque nécessitent P2. |
| VBS, HVCI, protection LSA | Fonctionnent sur Windows Pro. Seul Credential Guard, au sein de cette même policy, nécessite Enterprise. |

## Déclaration d'applicabilité — point de départ

Une proposition par mesure de l'Annexe A pour la DdA (déclaration d'applicabilité). **L'applicabilité est une
décision de l'organisation fondée sur son analyse des risques** ; ces colonnes sont un point de départ, pas un
résultat. La colonne *NIS2* indique les points que touchent les policies liées à cette mesure.

| Mesure | Appliquée (proposition) | Raison | Mesure mise en place | NIS2 |
|---|---|---|---|---|
| **A.5.1** Politiques de sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Définir la politique de sécurité de l'information et les politiques spécifiques à une thématique (notamment endpoint, accès et IA), les faire approuver par la direction et les réviser périodiquement. | — |
| **A.5.2** Fonctions et responsabilités liées à la sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Désigner et consigner le propriétaire de la baseline, le CISO et les rôles d'administration (administration Intune, Entra et Defender). | — |
| **A.5.3** Séparation des tâches | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Séparation entre qui modifie les policies, qui les approuve (revue de PR) et qui accorde les exceptions ; mettre en place le RBAC Entra/Intune et PIM — hors du périmètre de cette baseline. | — |
| **A.5.4** Responsabilités de la direction | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : La direction pilote la conformité de manière démontrable (NIS2 art. 20 : les organes de direction approuvent les mesures et suivent une formation). | — |
| **A.5.5** Contacts avec les autorités | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Consigner les points de contact avec le CSIRT/NCSC, l'autorité de supervision et l'autorité de protection des données (AP), y compris les délais de notification. | — |
| **A.5.6** Contacts avec des groupes d'intérêt spécifiques | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Organiser la participation aux ISAC, aux concertations sectorielles et aux avis des fournisseurs. | — |
| **A.5.7** Renseignements sur les menaces | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Faire évaluer les renseignements sur les menaces (Defender, Entra ID Protection, NCSC) et les traduire en ajustements de la baseline. | — |
| **A.5.8** Sécurité de l'information dans la gestion de projet | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Intégrer des exigences de sécurité dans les projets, par exemple lors du déploiement de nouveaux appareils ou de nouvelles plateformes. | — |
| **A.5.9** Inventaire des informations et autres actifs associés | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Préparé techniquement : 3 policies en pilote, en attente ou groupe dédié. Organisationnel : Intune fournit l'inventaire des appareils ; la propriété, l'inventaire des informations et le contrôle périodique de leur exhaustivité relèvent de l'organisationnel. | (i) |
| **A.5.10** Utilisation correcte de l'information et des autres actifs associés | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 3 policies en phase 1, 6 préparée(s). Organisationnel : Définir et communiquer les règles d'utilisation (y compris l'IA et l'usage privé) ; la technique n'en impose qu'une partie. | (d) (g) (i) |
| **A.5.11** Restitution des actifs | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Processus de départ : restitution des appareils, retire/wipe dans Intune, blocage du compte. | — |
| **A.5.12** Classification des informations | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Définir un schéma de classification ; les étiquettes techniques (Purview) sont hors du périmètre de cette baseline. | — |
| **A.5.13** Marquage des informations | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Procédure et outils de marquage (étiquettes de confidentialité Purview) — hors du périmètre de cette baseline. | — |
| **A.5.14** Transfert des informations | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 1 policy en phase 1, 1 préparée(s). Organisationnel : Règles de transfert d'informations avec des tiers (messagerie, liens de partage, comptes invités) ; la technique restreint les canaux sur l'appareil. | (i) |
| **A.5.15** Contrôle d'accès | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 3 policies en phase 1, 9 préparée(s). Organisationnel : Établir une politique d'accès (qui peut accéder à quoi, dans quelles conditions) ; Conditional Access et les policies d'appareil l'appliquent. | (b) (e) (i) |
| **A.5.16** Gestion des identités | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 2 policies en phase 1. Organisationnel : Relier le cycle de vie des identités (arrivées, mobilités, départs) aux RH ; enregistrer les comptes partagés et de service. | (i) |
| **A.5.17** Informations d'authentification | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 12 policies en phase 1, 16 préparée(s). Organisationnel : Former les utilisateurs à la gestion des mots de passe, codes PIN et codes de récupération ; processus de délivrance des codes d'accès temporaires. | (c) (e) (f) (g) (h) (i) (j) |
| **A.5.18** Droits d'accès | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Attribution, revue périodique (access reviews) et révocation des droits ; CA applique des conditions mais ne revoit pas les droits. | — |
| **A.5.19** Sécurité de l'information dans les relations avec les fournisseurs | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Préparé techniquement : 1 policy en pilote, en attente ou groupe dédié. Organisationnel : Politique fournisseurs et évaluation des risques (y compris Microsoft, services d'IA, outils d'assistance à distance) ; la technique ne peut que bloquer les services non approuvés. | (d) |
| **A.5.20** La sécurité de l'information dans les accords conclus avec les fournisseurs | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Inclure dans les contrats les exigences de sécurité, les accords de sous-traitance (traitement des données) et les droits d'audit. | — |
| **A.5.21** Gestion de la sécurité de l'information dans la chaîne d'approvisionnement TIC | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Exigences relatives aux produits et services TIC de la chaîne ; évaluer la provenance des logiciels et des mises à jour. | — |
| **A.5.22** Surveillance, révision et gestion des changements des services fournisseurs | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Suivre les changements chez Microsoft et les fournisseurs (Message Center, feuilles de route) et les revoir périodiquement. | — |
| **A.5.23** Sécurité de l'information dans l'utilisation de services en nuage | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Processus d'acquisition, d'utilisation et de sortie des services cloud ; CA et les restrictions de tenant en appliquent une partie. | — |
| **A.5.24** Planification et préparation de la gestion des incidents liés à la sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Plan de réponse aux incidents avec rôles, procédures opérationnelles (notamment isoler l'appareil, révoquer le compte) et obligation de notification (NIS2 art. 23). | — |
| **A.5.25** Évaluation des événements liés à la sécurité de l'information et prise de décision | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Processus de tri et critères définissant un « incident » ; Defender fournit les signaux. | — |
| **A.5.26** Réponse aux incidents liés à la sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Exécution du plan de réponse ; les actions techniques (isoler, effacer, révoquer les sessions) doivent avoir été exercées. | — |
| **A.5.27** Tirer des enseignements des incidents liés à la sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Retours d'expérience après incident et leur traduction en modifications de la baseline. | — |
| **A.5.28** Collecte des preuves | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Procédure forensique et durées de conservation ; la journalisation et l'EDR fournissent les éléments, la garantie de la chaîne de traçabilité est organisationnelle. | — |
| **A.5.29** Sécurité de l'information durant une perturbation | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 2 policies en phase 1. Organisationnel : Planifier le niveau de sécurité en situation de crise (procédures d'urgence, comptes break-glass). | (c) (e) |
| **A.5.30** Préparation des TIC pour la continuité d'activité | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 2 policies en phase 1. Organisationnel : BIA, objectifs de reprise (RTO/RPO) et tests de continuité périodiques. | (c) |
| **A.5.31** Exigences légales, statutaires, réglementaires et contractuelles | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Tenir un registre des lois et réglementations applicables (NIS2/loi sur la cybersécurité, RGPD). | — |
| **A.5.32** Droits de propriété intellectuelle | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Gestion des licences et règles d'utilisation des logiciels et des contenus. | — |
| **A.5.33** Protection des enregistrements | oui | sécurité de base ; à confirmer par l'analyse des risques | Préparé techniquement : 1 policy en pilote, en attente ou groupe dédié. Organisationnel : Définir les durées de conservation et la protection des enregistrements (politique de rétention, conservation des journaux). | — |
| **A.5.34** Protection de la vie privée et des DCP | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 4 policies en phase 1, 6 préparée(s). Organisationnel : Responsabilité RGPD : registre des traitements, AIPD pour la télémétrie, la surveillance et les fonctions d'IA, concertation avec le DPO et le comité social et économique. | (d) (e) (g) |
| **A.5.35** Révision indépendante de la sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Audit interne ou revue externe à intervalles planifiés. | — |
| **A.5.36** Conformité aux politiques, règles et normes de sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Revoir périodiquement la conformité ; les compliance policies et le reporting de conformité d'Intune fournissent la mesure, la revue et le suivi sont organisationnels. | — |
| **A.5.37** Procédures d'exploitation documentées | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Documenter les procédures d'administration (déploiement, exceptions, restauration) ; la documentation générée dans ce dépôt en fait partie. | — |
| **A.6.1** Sélection des candidats | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Vérification des antécédents (extrait de casier judiciaire) proportionnée au risque de la fonction. | — |
| **A.6.2** Termes et conditions du contrat de travail | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Inclure les obligations de sécurité dans les conditions d'emploi. | — |
| **A.6.3** Sensibilisation, enseignement et formation en sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Programme de sensibilisation et formation (hameçonnage, mots de passe, usage de l'IA) ; également pour les organes de direction (NIS2 art. 20(2)). | — |
| **A.6.4** Processus disciplinaire | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Procédure formelle en cas de violation de la politique. | — |
| **A.6.5** Responsabilités après la fin ou le changement d'un emploi | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Processus de départ : révoquer les accès, restituer l'appareil ou l'effacer de manière sélective, confidentialité après le départ. | — |
| **A.6.6** Accords de confidentialité ou de non-divulgation | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Rédiger des accords de confidentialité et les faire signer. | — |
| **A.6.7** Travail à distance | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Politique de télétravail (lieu, écrans, réseaux) ; la technique protège l'appareil et l'accès. | — |
| **A.6.8** Déclaration des événements liés à la sécurité de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Mettre en place un canal de signalement pour les collaborateurs et le faire connaître. | — |
| **A.7.1** Périmètres de sécurité physique | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité : définir les zones physiques. | — |
| **A.7.2** Les entrées physiques | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité : contrôle d'accès aux bâtiments et aux locaux. | — |
| **A.7.3** Sécurisation des bureaux, des salles et des installations | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité. | — |
| **A.7.4** Surveillance de la sécurité physique | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité : vidéosurveillance, suivi des alarmes. | — |
| **A.7.5** Protection contre les menaces physiques et environnementales | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité. | — |
| **A.7.6** Travail dans les zones sécurisées | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité. | — |
| **A.7.7** Bureau propre et écran vide | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 5 policies en phase 1, 5 préparée(s). Organisationnel : Définir des règles de bureau propre pour le papier et les supports ; l'écran vide est imposé techniquement. | (e) (f) (i) |
| **A.7.8** Emplacement et protection du matériel | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité. | — |
| **A.7.9** Sécurité des actifs hors des locaux | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 2 policies en phase 1, 5 préparée(s). Organisationnel : Règles pour l'emport du matériel, le fait de le laisser sans surveillance et la déclaration de perte ; le chiffrement et l'effacement à distance sont techniques. | (e) (h) (i) |
| **A.7.10** Supports de stockage | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 1 policy en phase 1, 2 préparée(s). Organisationnel : Politique relative aux supports amovibles et à la destruction sécurisée. | (e) (h) (i) |
| **A.7.11** Services supports | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité. | — |
| **A.7.12** Sécurité du câblage | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Hors du domaine endpoint/identité. | — |
| **A.7.13** Maintenance du matériel | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Maintenance et réparation par des personnes autorisées, avec des accords sur les données présentes sur l'appareil. | — |
| **A.7.14** Élimination ou recyclage sécurisé(e) du matériel | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Procédure de mise au rebut et de réutilisation (wipe/Autopilot Reset, certificat de destruction). | — |
| **A.8.1** Terminaux finaux des utilisateurs | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 19 policies en phase 1, 29 préparée(s). Organisationnel : Politique relative aux appareils professionnels et personnels (BYOD), enregistrement et règles d'utilisation. | (d) (e) (f) (h) (i) |
| **A.8.2** Droits d'accès privilégiés | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 6 policies en phase 1, 3 préparée(s). Organisationnel : Processus d'attribution et de revue périodique des droits d'administration (PIM, access reviews). | (e) (i) |
| **A.8.3** Restriction d'accès à l'information | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 1 policy en phase 1, 1 préparée(s). Organisationnel : Matrice d'autorisations et droits sur les données (SharePoint/Teams) — en grande partie hors de cette baseline. | (h) (i) |
| **A.8.4** Accès aux codes source | selon le cas | applicable uniquement en cas de développement interne de logiciels ou de scripts | Organisationnel : Uniquement en cas de développement logiciel interne : gérer l'accès aux dépôts et aux outils de développement. | — |
| **A.8.5** Authentification sécurisée | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 10 policies en phase 1, 20 préparée(s). Organisationnel : Établir une politique d'authentification (quelles méthodes, exceptions, break-glass). | (e) (f) (g) (h) (i) (j) |
| **A.8.6** Dimensionnement | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 3 policies en phase 1. Organisationnel : Planification des capacités pour le réseau, les licences et le stockage. | (c) |
| **A.8.7** Protection contre les programmes malveillants | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 26 policies en phase 1, 16 préparée(s). Organisationnel : Sensibilisation des utilisateurs et suivi des détections (la norme cite explicitement les deux). | (b) (c) (e) (f) (i) (j) |
| **A.8.8** Gestion des vulnérabilités techniques | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 11 policies en phase 1, 13 préparée(s). Organisationnel : Processus de gestion des vulnérabilités : suivre les sources, évaluer le risque, fixer des délais de correction, enregistrer les exceptions. | (e) (f) (h) (i) |
| **A.8.9** Gestion de la configuration | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 18 policies en phase 1, 7 préparée(s). Organisationnel : Ce dépôt est la configuration de référence ; la revue des modifications (PR) et le suivi des écarts dans le tenant restent un processus. | (b) (e) (g) (i) |
| **A.8.10** Suppression des informations | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Politique de conservation et de suppression ; l'effacement sélectif et le wipe sont des outils techniques. | — |
| **A.8.11** Masquage des données | oui | sécurité de base ; à confirmer par l'analyse des risques | Préparé techniquement : 1 policy en pilote, en attente ou groupe dédié. Organisationnel : Politique définissant quand les données sont masquées ou pseudonymisées — principalement au niveau applicatif. | — |
| **A.8.12** Prévention de la fuite de données | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 13 policies en phase 1, 11 préparée(s). Organisationnel : Politique DLP et classification ; Purview DLP est hors de cette baseline, les restrictions d'appareil et d'application y contribuent. | (c) (d) (e) (h) (i) |
| **A.8.13** Sauvegarde des informations | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 3 policies en phase 1. Organisationnel : Politique de sauvegarde des données M365 et tests de restauration périodiques ; la synchronisation OneDrive n'est pas une sauvegarde complète. | (c) |
| **A.8.14** Redondance des moyens de traitement de l'information | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Redondance des services et de l'infrastructure — hors du domaine endpoint/identité. | — |
| **A.8.15** Journalisation | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 6 policies en phase 1, 2 préparée(s). Organisationnel : Collecter, protéger, conserver et analyser les journaux de manière centralisée (SIEM/Defender XDR) ; la baseline ne règle que ce que l'appareil journalise. | (b) (e) |
| **A.8.16** Activités de surveillance | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 4 policies en phase 1, 7 préparée(s). Organisationnel : Suivi des alertes 24 h/24 et 7 j/7 ou pendant les heures de bureau, avec des critères d'escalade. | (b) (e) (i) |
| **A.8.17** Synchronisation des horloges | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 2 policies en phase 1, 1 préparée(s). Organisationnel : Définir une source de temps approuvée. | (b) (e) (i) |
| **A.8.18** Utilisation de programmes utilitaires à privilèges | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 1 policy en phase 1, 3 préparée(s). Organisationnel : Registre des outils d'administration et d'assistance à distance autorisés et des personnes habilitées à les utiliser. | (i) |
| **A.8.19** Installation de logiciels sur des systèmes opérationnels | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 10 policies en phase 1, 8 préparée(s). Organisationnel : Processus d'approbation et de mise à disposition des logiciels (catalogue Company Portal). | (e) (f) (g) (h) (i) |
| **A.8.20** Sécurité des réseaux | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 13 policies en phase 1, 12 préparée(s). Organisationnel : L'infrastructure réseau (pare-feu, Wi-Fi, VPN) est en grande partie hors de cette baseline. | (b) (c) (e) (f) (h) (i) (j) |
| **A.8.21** Sécurité des services réseau | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 1 policy en phase 1, 5 préparée(s). Organisationnel : Définir et surveiller les exigences relatives aux services et fournisseurs réseau. | (c) (e) (h) |
| **A.8.22** Cloisonnement des réseaux | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : La segmentation réseau relève de l'infrastructure et ne peut pas être mise en place via des policies endpoint/identité. | — |
| **A.8.23** Filtrage web | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 3 policies en phase 1, 3 préparée(s). Organisationnel : Définir les catégories et les exceptions (Defender Web Content Filtering dans le portail Defender). | (d) (e) (g) (i) (j) |
| **A.8.24** Utilisation de la cryptographie | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 9 policies en phase 1, 7 préparée(s). Organisationnel : Politique cryptographique et gestion des clés (qui a accès aux clés de récupération, rotation). | (e) (f) (h) (i) (j) |
| **A.8.25** Cycle de vie de développement sécurisé | selon le cas | applicable uniquement en cas de développement logiciel interne | Organisationnel : Uniquement en cas de développement interne. | — |
| **A.8.26** Exigences de sécurité des applications | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Exigences de sécurité lors du développement ou de l'acquisition d'applications. | — |
| **A.8.27** Principes d'ingénierie et d'architecture des systèmes sécurisés | selon le cas | applicable uniquement en cas de développement interne de systèmes | Organisationnel : Définir les principes d'architecture (zero trust). | — |
| **A.8.28** Codage sécurisé | selon le cas | applicable uniquement en cas de développement logiciel interne | Organisationnel : Uniquement en cas de développement interne. | — |
| **A.8.29** Tests de sécurité dans le développement et l'acceptation | selon le cas | applicable uniquement en cas de développement logiciel interne | Organisationnel : Uniquement en cas de développement interne ; pour la baseline elle-même : la phase pilote (phase 2). | — |
| **A.8.30** Développement externalisé | selon le cas | applicable uniquement en cas de développement externalisé | Organisationnel : Uniquement en cas de développement externalisé. | — |
| **A.8.31** Séparation des environnements de développement, de test et de production | selon le cas | applicable uniquement en cas de développement interne ou d'un environnement de test interne | Organisationnel : Tenant de test ou groupe pilote à côté de la production. | — |
| **A.8.32** Gestion des changements | oui | sécurité de base et mise en œuvre de NIS2 art. 21(2) ; à confirmer par l'analyse des risques | Technique : 2 policies en phase 1, 4 préparée(s). Organisationnel : Définir et suivre une procédure de changement (revue de PR, phase pilote, communication) ; les anneaux de mise à jour en sont le volet technique. | (e) |
| **A.8.33** Informations de test | selon le cas | applicable uniquement en cas de développement ou de tests internes | Organisationnel : Uniquement en cas de développement ou de tests internes. | — |
| **A.8.34** Protection des systèmes d'information en cours d'audit et de test | oui | sécurité de base ; à confirmer par l'analyse des risques | Organisationnel : Planifier les audits et les tests d'intrusion et les coordonner avec la direction responsable. | — |

## Contrôle du mappage

| | Nombre |
|---|---:|
| Policies Intune avec mesures | 197 sur 197 |
| Libellés hors vocabulaire | 0 |
| Libellés avec une graphie divergente (comptés quand même) | 0 |

Ne mappez que ce qu'une policy impose ou vérifie réellement. `check-scope.js` refuse une policy sans
mesures et les libellés qui ne figurent pas exactement dans `IntuneTemplate/_controls.json`.

---

Retour au [README principal](../README.fr.md) · [OVERZICHT.fr.md](OVERZICHT.fr.md)
