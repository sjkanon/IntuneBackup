<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_U_Compliance_Block_Device_Administrator.md) · [English](Baseline_AND_U_Compliance_Block_Device_Administrator.en.md) · **Français**

# CXNM - Standard - AND - U - Compliance Block Device Administrator

Marque comme non conforme tout appareil Android encore géré avec l'ancien device administrator, afin qu'il doive passer à Android Enterprise.

| | |
|---|---|
| Platform | Android |
| Scope | User (U) — affecter à des groupes d'utilisateurs |
| Type | Compliance |
| Affectation | — |
| Source | Conformité Intune pour Android device administrator (`securityBlockDeviceAdministratorManagedDevices`) ; recommandation issue d'UniFy Android Enterprise Baseline v1.5.1, guide 9 (Enrollment Restrictions) |
| Fichier | [`Baseline_AND_U_Compliance_Block_Device_Administrator.json`](Baseline_AND_U_Compliance_Block_Device_Administrator.json) |

> La seule façon de s'inscrire encore avec device administrator est un appareil sans Google Mobile Services (par ex. sur certains marchés) ; là aussi, la gestion AOSP est le successeur. Après l'affectation, l'utilisateur reçoit dans le Portail d'entreprise un message indiquant que l'appareil doit passer à un profil professionnel. App Protection continue de fonctionner, donc Outlook et Teams restent accessibles via Conditional Access 2070 (appareil conforme ou application protégée).

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 7

Une policy de conformité n'a pas de settingDefinitionId mais des propriétés fixes. `scheduledActionsForRule` détermine ce qui se passe lorsqu'un appareil n'est pas conforme.

| Propriété | Valeur |
|---|---|
| `securityBlockDeviceAdministratorManagedDevices` | true |
| `scheduledActionsForRule[0].ruleName` | PasswordRequired |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].@odata.type` | #microsoft.graph.deviceComplianceActionItem |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].gracePeriodHours` | 24 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].actionType` | block |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationTemplateId` | 00000000-0000-0000-0000-000000000000 |
| `scheduledActionsForRule[0].scheduledActionConfigurations[0].notificationMessageCCList` | — |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
