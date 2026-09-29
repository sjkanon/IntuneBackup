<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Logon_Hardening.md) · [English](Baseline_WIN_D_Logon_Hardening.en.md) · **Français**

# [Baseline] - WIN - D - Logon Hardening

Exige CTRL+ALT+DEL avant la connexion et retire le choix du réseau de l'écran de verrouillage.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS v4 Windows 11 L1 — paramètres repris d'IntuneAdmin, valeurs vérifiées par rapport à la définition du settings catalog. |
| Fichier | [`Baseline_WIN_D_Logon_Hardening.json`](Baseline_WIN_D_Logon_Hardening.json) |

> Perceptible pour les utilisateurs, annoncez-le donc : après cette policy, chacun doit appuyer sur CTRL+ALT+SUPPR avant que l'écran de connexion n'apparaisse. Sur les tablettes et les 2-en-1 sans clavier, Windows utilise à la place le bouton Windows plus le bouton marche/arrêt. Le libellé du paramètre est inversé : "Do not require CTRL+ALT+DEL" sur Disabled signifie qu'il est justement requis. Deux ajouts sur l'écran de connexion : l'adresse e-mail de l'utilisateur n'y est plus affichée, et les utilisateurs connectés ne sont pas énumérés. Les deux retirent la moitié d'une tentative de connexion — le nom d'utilisateur — à quiconque voit l'écran.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.8.5 Authentification sécurisée<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.AA-03 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_donotrequirectrlaltdel` | 0 |
| `device_vendor_msft_policy_config_windowslogon_dontdisplaynetworkselectionui` | 1 |
| `device_vendor_msft_policy_config_admx_logon_blockuserfromshowingaccountdetailsonsignin` | 1 |
| `device_vendor_msft_policy_config_admx_logon_dontenumerateconnectedusers` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
