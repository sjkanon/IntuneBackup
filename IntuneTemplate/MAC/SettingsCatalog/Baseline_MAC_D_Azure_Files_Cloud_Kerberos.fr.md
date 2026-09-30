<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Azure_Files_Cloud_Kerberos.md) · [English](Baseline_MAC_D_Azure_Files_Cloud_Kerberos.en.md) · **Français**

# CXNM - Standard - MAC - D - Azure Files Cloud Kerberos

Fournit au Mac un ticket Kerberos pour le realm Entra Cloud Kerberos, afin qu'un partage SMB sur Azure Files s'ouvre sans que l'utilisateur se reconnecte.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Microsoft Learn — Enable Microsoft Entra Kerberos authentication for Azure Files on macOS with Platform SSO (preview), et le guide Entra pour Kerberos SSO dans Platform SSO ; settingDefinitionId vérifiés par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_MAC_D_Azure_Files_Cloud_Kerberos.json`](Baseline_MAC_D_Azure_Files_Cloud_Kerberos.json) |

> Va de pair avec CXNM - Standard - MAC - D - Platform SSO et ne fait rien sans cette policy : le TGT cloud est émis par Platform SSO ; ce profil indique seulement à l'extension Kerberos d'Apple quel realm lui correspond et qu'elle peut utiliser ce TGT (`usePlatformSSOTGT`). `performKerberosOnly` tient l'extension à l'écart des contrôles d'expiration de mot de passe, de la synchronisation des mots de passe et du chemin du dossier de départ — cela relève de Platform SSO, pas d'ici.
>
> Une seconde policy à côté de Platform SSO et non une extension de celle-ci : le settings catalog connaît pour `com.apple.extensiblesso` deux formes distinctes, la forme Platform SSO (`com.apple.extensiblesso_com.apple.extensiblesso`) et la forme Kerberos qu'utilise cette policy (`com.apple.extensiblesso_com.apple.extensiblesso-kerberos_kerberos`). Chaque realm Kerberos correspond à une telle forme, avec son propre `Realm` et ses propres `Hosts`. Sur le Mac, ces profils sont installés côte à côte et macOS fusionne les payloads ; check-scope.js ne signale donc volontairement pas ce chevauchement chez Apple comme un conflit.
>
> L'id du tenant figure sous la forme `%OrganizationId%` dans l'URL `preferredKDCs`, la même construction que dans les policies OneDrive KFM et Teams : CIPP remplace ce jeton lors du déploiement par le customerId du tenant (voir Get-CIPPTextReplacement dans CIPP-API) ; `%tenantid%` fait de même. Si vous déployez avec IntuneBackupAndRestore au lieu de CIPP, ce remplacement n'a pas lieu et vous devez saisir l'id à la main.
>
> Côté tenant, quatre éléments doivent être en place avant que ce profil produise quoi que ce soit : Entra Kerberos activé sur le storage account, le consentement administrateur sur le service principal associé, la MFA désactivée pour l'app Entra de ce storage account, et des share-level permissions sur le partage lui-même. Si le file share existe déjà, l'URI d'identifiant de cet enregistrement d'app est `CIFS/<account>.file.core.windows.net` — en majuscules. macOS ne monte que sur `cifs/` en minuscules ; Microsoft fournit `updateappmanifestazurefiles.ps1` pour cela dans azure-files-samples. Les nouveaux partages n'ont pas ce problème.
>
> **Un storage account qui a déjà une autre identity source est exclu.** Si le compte utilise Microsoft Entra Domain Services Entra Kerberos et AD DS sont grisés dans le portail avec "Another access method is already configured". Un storage account ne peut en avoir qu'une. Sur un Mac disposant d'un TGT cloud valide, `kgetcred cifs/<account>.file.core.windows.net@KERBEROS.MICROSOFTONLINE.COM` renvoie alors AADSTS700016 — il n'existe pas d'enregistrement d'app pour le service de fichiers, il n'y a donc rien à émettre. Entra DS n'est pas non plus une voie alternative vers le même objectif : Platform SSO n'émet que `tgt_cloud` (Entra Kerberos) et `tgt_ad` (AD on-premises via Cloud Kerberos Trust), et Entra DS n'est ni l'un ni l'autre. Changer l'identity source affecte tout le trafic existant vers ces partages, y compris les droits définis au niveau des fichiers et des dossiers avec des identités Entra DS ; voir "Change the identity source for Azure file shares" chez Microsoft. Le diagnostic complet se trouve dans extras/macos/shell-scripts/README.md.
>
> **Ce qu'il faut pour déployer ceci.** Un storage account avec Entra Kerberos comme identity source. Si le compte existant utilise autre chose et ne peut pas être converti, un **second storage account** est nécessaire avec Entra Kerberos comme identity source — les deux peuvent coexister, la limitation s'applique par compte et non par tenant. Ce profil n'a pas besoin d'être modifié pour cela : `Hosts` couvre avec `.windows.net` tout storage account, et seul le script de montage dans `extras/macos/shell-scripts/` mentionne un nom de compte. Si cela ne vaut pas l'effort, la conclusion honnête est que SMB est ici le mauvais moyen de transport et que les données ont leur place dans SharePoint, avec `automountteamsites` du settings catalog — cela fonctionne sur les deux plateformes sans Kerberos et sans VPN.
>
> Le côté AD on-premises serait une seconde policy de cette forme, avec son propre realm et son propre nom de domaine dans `Hosts`. Elle n'est pas incluse ici — cette baseline part d'appareils cloud-only. Si elle est ajoutée, le profil on-prem doit être déployé en premier et celui-ci ensuite, dans cet ordre. L'attribution du TGT elle-même peut être pilotée avec `custom_tgt_setting` dans les extension data de la policy Platform SSO (Company Portal 2508+) ; la valeur par défaut 0 attribue à la fois le TGT on-prem et le TGT cloud, c'est pourquoi cette policy n'a pas besoin d'être modifiée pour ce profil.
>
> Pour les profils Platform SSO, Microsoft indique « affecter aux utilisateurs, pas aux appareils ». Cette baseline garde les profils macOS sur des groupes d'appareils, comme la policy Platform SSO existante. Tant que la policy est en phase 3, cela ne fait aucune différence pratique : elle est créée mais pas affectée.
>
> Vérifier après le déploiement : `app-sso platform -s` dans Terminal doit afficher un ticket avec `ticketKeyPath` = `tgt_cloud`, et `nc -vz <account>.file.core.windows.net 445` doit être ouvert. Que l'élément de barre de menus de l'extension Kerberos indique "Not signed in" est normal et ne signifie pas que cela ne fonctionne pas.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 6.7 Centralize Access Control |
| NIST CSF 2.0 | PR.AA-03<br>PR.AA-04 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 10

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `com.apple.extensiblesso_com.apple.extensiblesso-kerberos_kerberos` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensionidentifier_kerberos` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_teamidentifier_kerberos` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_type_kerberos` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_realm_kerberos` | KERBEROS.MICROSOFTONLINE.COM |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_kerberos` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_useplatformssotgt_kerberos` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_performkerberosonly_kerberos` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_extensiondata_preferredkdcs_kerberos` | kkdcp://login.microsoftonline.com/%OrganizationId%/kerberos |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.extensiblesso_hosts_kerberos` | windows.net, .windows.net |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
