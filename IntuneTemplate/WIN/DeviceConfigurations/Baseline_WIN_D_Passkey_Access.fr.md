<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Passkey_Access.md) · [English](Baseline_WIN_D_Passkey_Access.en.md) · **Français**

# [Baseline] - WIN - D - Passkey Access

Donne aux applications sous Windows l'accès aux passkeys, pour que la connexion avec une passkey fonctionne dans les applications et dans une session distante (Windows App, Azure Virtual Desktop) sans que l'utilisateur doive activer lui-même le paramètre de confidentialité.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | All Devices |
| Source | Baseline propre — OMA-URI ./Device/Vendor/MSFT/Policy/Config/Privacy/LetAppsAccessPasskeys = 1 (Force allow), Policy CSP Privacy. |
| Fichier | [`Baseline_WIN_D_Passkey_Access.json`](Baseline_WIN_D_Passkey_Access.json) |

> Profil personnalisé (OMA-URI) : le paramètre n'est pas encore dans le Settings Catalog. Microsoft le documente pour Windows Insider Preview ; si une build ne le connaît pas, Intune signale une erreur pour ce paramètre et rien ne change. Force allow verrouille aussi la liste par application ; pour refuser quand même une application, utilisez LetAppsAccessPasskeys_ForceDenyTheseApps.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.5 Authentification sécurisée |
| NIS2 art. 21(2) | art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 7

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `omaSettings[0].@odata.type` | #microsoft.graph.omaSettingInteger |
| `omaSettings[0].displayName` | Let apps access passkeys (Force allow) |
| `omaSettings[0].description` | — |
| `omaSettings[0].omaUri` | ./Device/Vendor/MSFT/Policy/Config/Privacy/LetAppsAccessPasskeys |
| `omaSettings[0].isEncrypted` | false |
| `omaSettings[0].value` | 1 |
| `omaSettings[0].isReadOnly` | false |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
