<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.md) · [English](Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.en.md) · **Français**

# CXNM - Standard - MAC - D - Enrollment Profile Standard User Affinity

Déroule l'Assistant réglages pour un Mac d'entreprise avec affinité utilisateur et inscription verrouillée, et crée le compte connecté en tant qu'utilisateur standard ; l'administration passe par le compte service desk masqué.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (enrollmentConfiguration) |
| Affectation | — |
| Source | baseline propre — OpenIntuneBaseline n'a pas de profil d'inscription |
| Fichier | [`Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.json`](Baseline_MAC_D_Enrollment_Profile_Standard_User_Affinity.json) |

> Alternative à CXNM - Standard - MAC - D - Enrollment Profile Administrator User Affinity, pas un complément : les deux profils diffèrent par un seul paramètre — le compte connecté devient-il administrateur ou utilisateur standard. Les deux sur All Devices provoqueraient un conflit, ils sont donc volontairement laissés sans affectation et doivent aller sur un groupe dédié. Ils se chevauchent en outre avec extras/macos/enrollment/macOS-Corporate-ADE-Baseline.json, qui déploie le même profil d'inscription via depMacOSEnrollmentProfile et y utilise le même compte administrateur (mlapsadmin) — choisissez l'une des deux voies. Le compte administrateur s'appelle mlapsadmin et le service dans Setup Assistant IT Servicedesk ; le numéro de téléphone est SERVICEDESK-TELEFOON-INVULLEN et doit être renseigné par organisation avant que le profil soit lié à un jeton — l'utilisateur le voit pendant la configuration.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.9 Inventaire des informations et autres actifs associés<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.2 Droits d'accès privilégiés |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 1.1 Establish and Maintain Detailed Enterprise Asset Inventory<br>4.7 Manage Default Accounts on Enterprise Assets and Software<br>5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts |
| NIST CSF 2.0 | ID.AM-01<br>PR.AA-05<br>PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 40

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `ade_macos_useraffinity` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`ade_macos_authenticationmethod` | 2 |
| `ade_macos_awaitconfiguration` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_createlocaladmin` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_adminaccountfullname` | IT Servicedesk |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_hideusersgroups` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_adminaccountpasswordrotation` | 14 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_adminaccountname` | mlapsadmin |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_createlocalprimary` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_prefillaccountinfo` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_restrictediting` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_primaryaccountfullname` | {{username}} |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`ade_accountsettings_primaryaccountname` | {{username}} |
| `ade_lockedenrollment` | 1 |
| `ade_setupassistant_department` | IT Servicedesk |
| `ade_setupassistant_departmentphone` | SERVICEDESK-TELEFOON-INVULLEN |
| `ade_setupassistant_locationservices` | 1 |
| `ade_setupassistant_restore` | 0 |
| `ade_setupassistant_appleid` | 0 |
| `ade_setupassistant_termsandconditions` | 0 |
| `ade_setupassistant_touchfaceid` | 1 |
| `ade_setupassistant_applepay` | 0 |
| `ade_setupassistant_siri` | 0 |
| `ade_setupassistant_diagnosticsdata` | 0 |
| `ade_setupassistant_filevault` | 1 |
| `ade_setupassistant_iclouddiagnostics` | 0 |
| `ade_setupassistant_icloudstorage` | 0 |
| `ade_setupassistant_appearance` | 1 |
| `ade_setupassistant_screentime` | 0 |
| `ade_setupassistant_privacy` | 0 |
| `ade_setupassistant_accessibility` | 1 |
| `ade_setupassistant_unlockwithwatch` | 0 |
| `ade_setupassistant_enablelockdownmode` | 0 |
| `ade_setupassistant_softwareupdate` | 0 |
| `ade_setupassistant_softwareupdatecompleted` | 0 |
| `ade_setupassistant_termsofaddress` | 0 |
| `ade_setupassistant_intelligence` | 0 |
| `ade_setupassistant_osshowcase` | 0 |
| `ade_setupassistant_appstore` | 1 |
| `ade_setupassistant_liquidglass` | 0 |

---

Retour à la [vue d'ensemble macOS](../README.fr.md) · [README principal](../../../README.fr.md)
