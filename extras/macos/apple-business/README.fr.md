[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/macos/apple-business/

Les paramètres d'Apple Business (Manager) sur lesquels s'appuie la baseline macOS. Pas un modèle —
Apple Business n'a pas d'API permettant de déployer cela depuis un dépôt — mais une checklist,
car une erreur ici ne devient visible dans Intune que lorsqu'un Mac ne s'inscrit plus.

S'applique aux Mac d'entreprise via Automated Device Enrollment (ADE) : les profils de
[`extras/macos/enrollment/`](../enrollment/README.fr.md) et les stratégies
`MAC - D - Enrollment Profile …` partent du principe que ceci est en place.

## 1. Organisation et administrateurs

| Paramètre | Conseil | Pourquoi |
|---|---|---|
| Administrateurs | au moins deux comptes avec le rôle *Administrator*, personnels (pas de compte partagé) | un administrateur unique qui part ou perd son accès paralyse les jetons et la gestion des appareils |
| Compte d'urgence | un *Administrator* **non** fédéré, avec un mot de passe fort et l'authentification à deux facteurs, dans le coffre-fort | si Entra ID ou la fédération tombe en panne, plus personne avec un compte fédéré ne peut accéder à Apple Business |
| Rôles | *Device Manager* pour le service desk (affecter des appareils), *Content Manager* pour les applications ; *Administrator* uniquement pour qui gère les jetons et la fédération | droits minimaux (A.8.2) |
| Authentification à deux facteurs | activée pour tous les administrateurs non fédérés | Apple Business détermine qui peut prendre le contrôle de vos Mac |

## 2. Managed Apple Accounts et fédération avec Microsoft Entra ID

| Paramètre | Conseil |
|---|---|
| Domaine | vérifier le domaine de messagerie de l'organisation (DNS TXT) |
| Federated authentication | lier à Microsoft Entra ID. Les utilisateurs se connectent avec leur compte Entra en tant que Managed Apple Account ; mot de passe, MFA et Conditional Access viennent d'Entra |
| Directory sync | activé (via Entra), afin qu'un compte Entra désactivé désactive aussi le Managed Apple Account |
| **Domain capture** | activé : plus personne ne peut créer un Apple Account personnel avec le domaine de l'entreprise. Les comptes personnels existants avec ce domaine reçoivent d'Apple une demande de modification de leur adresse e-mail — prévenez les utilisateurs à l'avance |
| Services iCloud pour les Managed Apple Accounts | uniquement ce que l'organisation utilise ; la baseline désactive déjà la synchronisation iCloud sur le Mac (`MAC - D - Restrictions`) |

Pourquoi : sans fédération ni domain capture, des Apple Accounts personnels apparaissent sur
l'adresse de l'entreprise, que l'organisation ne peut pas révoquer, et l'offboarding passe par deux systèmes.

## 3. Serveur MDM et affectation

| Étape | Où |
|---|---|
| Ajouter Intune comme serveur MDM : télécharger la clé publique dans Intune (Devices → Enrollment → Apple → **Enrollment program tokens** → Add), créer un serveur MDM dans Apple Business avec cette clé, renvoyer le jeton serveur (`.p7m`) dans Intune | Apple Business → Préférences → Serveurs MDM |
| **Serveur MDM par défaut pour Mac** sur ce serveur Intune | Apple Business → Préférences → Affectation de la gestion des appareils. Sans valeur par défaut, un Mac nouvellement acheté n'arrive pas de lui-même dans Intune |
| Lier les achats | enregistrer le numéro client Apple ou l'ID revendeur, afin que les Mac d'Apple et des revendeurs agréés apparaissent automatiquement dans Apple Business |
| Mac existants | ajouter avec Apple Configurator pour iPhone ; un tel Mac a une période provisoire de 30 jours pendant laquelle l'utilisateur peut le retirer de la gestion |
| Profil d'inscription | l'associer au jeton dans Intune et le définir par défaut (`extras/macos/enrollment/`), avant d'allumer le premier Mac |

## 4. Jetons et certificats qui expirent chaque année

Aucun des trois ne prévient clairement. Programmez un rendez-vous récurrent **30 jours avant** la date d'expiration
et vérifiez Tenant administration → Connectors and tokens dans Intune.

| Quoi | Validité | À l'expiration | Renouvellement |
|---|---|---|---|
| Apple MDM Push Certificate (APNs) | 1 an | Intune ne peut plus joindre aucun appareil Apple ; 30 jours après la date, tous les appareils Apple doivent être réinscrits | avec le **même** Apple Account que celui qui a servi à le créer — utilisez un Managed Apple Account ou un compte fonctionnel sur une boîte aux lettres partagée, jamais le compte personnel d'un administrateur |
| Jeton serveur ADE | 1 an | les nouveaux Mac ne s'inscrivent plus via ADE ; les existants continuent de fonctionner | télécharger un nouveau jeton dans Apple Business, le charger sur le même jeton dans Intune (ne pas créer de nouveau jeton — les affectations de profil se détachent) |
| Jeton d'emplacement Apps and Books (VPP) | 1 an | plus de nouvelles licences d'application ni de mises à jour via Intune | télécharger un nouveau jeton, le charger sur l'emplacement existant dans Intune |

L'Apple Account pour APNs est le point le plus vulnérable de toute l'installation Apple : qui perd ce
compte perd la gestion de tous les appareils Apple. Consignez dans le SMSI *quel* compte c'est
et qui y a accès (A.5.17).

## 5. Apps and Books

- Attribuer les licences d'applications **par appareil** (device-based assignment dans Intune) : aucun Apple
  Account n'est alors nécessaire sur le Mac et la licence reste attachée à l'appareil.
- Ne lier à Intune que l'emplacement Apps and Books propre à ce tenant — lier un même emplacement
  à deux MDM provoque des conflits de licences.

## 6. Fin de vie

Un Mac qui quitte l'organisation (vente, retour de leasing) :

1. l'effacer ou le désinscrire dans Intune — cela supprime aussi le Recovery Lock (voir `MAC - D - Recovery Lock`) ;
2. le **libérer** dans Apple Business (Release from organization) ; sinon le Mac arrive dans Intune
   chez le nouveau propriétaire lorsqu'il l'allume ;
3. Activation Lock : vérifier qu'aucun Apple Account personnel n'est plus associé au Mac.

## Normes

A.5.9 Inventaire des informations et autres actifs associés, A.5.11 Restitution des actifs, A.5.16
Gestion des identités, A.5.17 Informations d'authentification, A.5.23 Sécurité de l'information dans
l'utilisation de services en nuage, A.8.2 Droits d'accès privilégiés ; NIS2 art. 21(2)(i) et (j) ; CIS Controls v8.1
1.1, 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts, 6.7 Centralize
Access Control ; NIST CSF 2.0 ID.AM-01, PR.AA-01, PR.AA-05.
