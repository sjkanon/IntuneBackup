<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_LAPS.md) · [English](Baseline_WIN_D_Windows_LAPS.en.md) · **Français**

# CXNM - Standard - WIN - D - Windows LAPS

Change automatiquement le mot de passe du compte administrateur local et le stocke dans Entra ID, afin qu'aucun mot de passe administrateur partagé ne circule plus.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAccountProtection) |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Windows LAPS - D - LAPS Configuration |
| Fichier | [`Baseline_WIN_D_Windows_LAPS.json`](Baseline_WIN_D_Windows_LAPS.json) |

> Depuis OIB v4.0, la seule variante LAPS ; jusqu'à la v3.8, c'était la variante 24H2+ à côté d'une variante de base, qui n'avait déjà pas été reprise car la policy disposait déjà de la gestion automatique des comptes. Le nom de compte administrateur personnalisé a été supprimé en septembre 2026 : avec la gestion automatique des comptes activée, Windows ignore ce paramètre, et la valeur était le nom de compte d'une seule organisation.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Informations d'authentification<br>A.8.2 Droits d'accès privilégiés |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.7 Manage Default Accounts on Enterprise Assets and Software<br>5.2 Use Unique Passwords |
| NIST CSF 2.0 | PR.AA-01<br>PR.AA-05 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 12

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_laps_policies_backupdirectory` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_passwordagedays_aad` | 7 |
| `device_vendor_msft_laps_policies_passwordcomplexity` | 8 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_passphraselength` | 4 |
| `device_vendor_msft_laps_policies_passwordlength` | 21 |
| `device_vendor_msft_laps_policies_postauthenticationactions` | 11 |
| `device_vendor_msft_laps_policies_postauthenticationresetdelay` | 1 |
| `device_vendor_msft_laps_policies_automaticaccountmanagementenabled` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementnameorprefix` | *(vide)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementtarget` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementenableaccount` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_laps_policies_automaticaccountmanagementrandomizename` | false |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
