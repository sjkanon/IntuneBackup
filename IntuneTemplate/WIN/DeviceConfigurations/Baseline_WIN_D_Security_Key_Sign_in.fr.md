<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Security_Key_Sign_in.md) · [English](Baseline_WIN_D_Security_Key_Sign_in.en.md) · **Français**

# [Baseline] - WIN - D - Security Key Sign-in

Permet aux utilisateurs de se connecter sur les appareils partagés avec une clé de sécurité FIDO2 ou un badge NFC, sans mot de passe et sans configurer Windows Hello for Business sur l'appareil.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | Baseline propre — OMA-URI ./Device/Vendor/MSFT/PassportForWork/SecurityKey/UseSecurityKeyForSignin = 1, comme dans IntuneAdmin/IntuneBaselines (Baseline - Enables FIDO Security Keys to be used during Windows Sign In). |
| Fichier | [`Baseline_WIN_D_Security_Key_Sign_in.json`](Baseline_WIN_D_Security_Key_Sign_in.json) |

> Se place sur SEC-Shared-Devices. L'utilisateur a besoin d'une passkey sur une clé ou un badge FIDO2, enregistrée dans Entra ; activez pour cela la méthode d'authentification Passkey (FIDO2) dans la stratégie des méthodes d'authentification d'Entra. Un profil personnalisé (OMA-URI) plutôt que Settings Catalog, car l'ID Settings Catalog n'est vérifiable dans aucune source ; c'est le même paramètre que dans IntuneAdmin. Fonctionne sans Windows Hello for Business sur l'appareil : testez sur le premier appareil que l'option Clé de sécurité figure sur l'écran de connexion à côté de [Baseline] - WIN - D - Windows Hello for Business Disabled.

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
| `omaSettings[0].displayName` | Turn on FIDO Security Keys for Windows Sign-In |
| `omaSettings[0].description` | — |
| `omaSettings[0].omaUri` | ./Device/Vendor/MSFT/PassportForWork/SecurityKey/UseSecurityKeyForSignin |
| `omaSettings[0].isEncrypted` | false |
| `omaSettings[0].value` | 1 |
| `omaSettings[0].isReadOnly` | false |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
