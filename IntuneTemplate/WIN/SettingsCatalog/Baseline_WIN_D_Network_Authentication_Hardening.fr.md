<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Network_Authentication_Hardening.md) · [English](Baseline_WIN_D_Network_Authentication_Hardening.en.md) · **Français**

# [Baseline] - WIN - D - Network Authentication Hardening

Rend l'authentification réseau moins vulnérable aux abus : le compte système utilise l'identité de l'ordinateur pour NTLM, PKU2U avec des identités en ligne est fermé, le trafic LDAP demande la signature, le client Kerberos prend en charge l'armoring et les noms NetBIOS ne sont plus résolus par diffusion.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| checkId | `INTUNE-BASE-204-DNetworkAuthenticationHardening` |
| Source | CIS v4 Windows 11 L1 (profils CISv4 d'IntuneAdmin) et la Microsoft Security Baseline pour Windows 11 — valeurs vérifiées par rapport aux définitions du settings catalog ; PKU2U s'écarte volontairement de la valeur d'IntuneAdmin |
| Fichier | [`Baseline_WIN_D_Network_Authentication_Hardening.json`](Baseline_WIN_D_Network_Authentication_Hardening.json) |

> **Écart volontaire par rapport à la source :** IntuneAdmin règle PKU2U sur `_1` (Allow), alors que CIS L1 2.3.11.3 exige 'Disabled' ; ici `_0` (Block). NetBT NodeType et la signature LDAP requièrent Windows 11 22H2 avec la mise à jour d'avril 2025 (10.0.22621.5126) ou ultérieure ; sur les builds plus anciens, Intune signale « Non applicable ». **Imposer** le blindage Kerberos (`requirekerberosarmoring`) n'est volontairement pas inclus : cela fait échouer toute connexion auprès d'un domaine qui ne prend pas en charge le blindage. La signature SMB et l'audit NTLM figurent déjà dans Local Security Policies et Security Hardening ; WDigest et LLMNR dans Legacy Hardening.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.5 Authentification sécurisée<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(j) authentification à plusieurs facteurs et communications sécurisées<br>art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process<br>4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.AA-03<br>PR.PS-01<br>PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_allowlocalsystemtousecomputeridentityforntlm` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_allowpku2uauthenticationrequests` | 0 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_networksecurity_ldapclientsigningrequirements` | 1 |
| `device_vendor_msft_policy_config_kerberos_kerberosclientsupportsclaimscompoundarmor` | 1 |
| `device_vendor_msft_policy_config_mssecurityguide_netbtnodetypeconfiguration` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_mssecurityguide_netbtnodetypeconfiguration_pol_secguide_secguide_netbtnodetypecfg` | 2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
