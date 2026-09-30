<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Account_Lockout.md) · [English](Baseline_WIN_D_Account_Lockout.en.md) · **Français**

# [Baseline] - WIN - D - Account Lockout

Verrouille un compte pendant 15 minutes après dix tentatives de connexion échouées, y compris celui de l'administrateur intégré, et place l'appareil en récupération BitLocker après dix tentatives échouées.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS v4 Windows 11 L1 et la Microsoft Security Baseline — valeurs vérifiées par rapport à Policy CSP DeviceLock (AccountLockoutPolicy, AllowAdministratorLockout) et LocalPoliciesSecurityOptions. |
| Fichier | [`Baseline_WIN_D_Account_Lockout.json`](Baseline_WIN_D_Account_Lockout.json) |

> Seuil de 10 et non de 5 : à 5, un utilisateur qui se trompe se bloque trop facilement, et 10 est la valeur de la Microsoft Security Baseline. Le verrouillage du compte se lève de lui-même après 15 minutes — personne n'a besoin d'appeler pour cela. Le seuil machine (InteractiveLogon MachineAccountLockoutThreshold) fait autre chose : il place l'appareil en récupération BitLocker après dix tentatives échouées, et la clé de récupération est alors nécessaire. C'est prévu pour un portable volé, pas pour un utilisateur distrait, mais attendez-vous à une demande occasionnelle au helpdesk. AccountLockoutPolicy requiert Windows 11 22H2 avec KB5053657 ou 24H2 ; les appareils plus anciens ignorent le paramètre sans rien signaler. ATTENTION : IntuneAdmin définit ce paramètre dans son profil NIS2 sur la valeur brute "15" — le CSP attend les trois champs sous forme d'une seule chaîne ("AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15"), cette valeur y est donc cassée. Ne la reprenez pas.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.10 Enforce Automatic Device Lockout on Portable End-User Devices |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_devicelock_accountlockoutpolicy` | AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15 |
| `device_vendor_msft_policy_config_devicelock_allowadministratorlockout` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_machineaccountlockoutthreshold` | 10 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
