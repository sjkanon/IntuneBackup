<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Remote_Access_Hardening.md) · [English](Baseline_WIN_D_Remote_Access_Hardening.en.md) · **Français**

# [Baseline] - WIN - D - Remote Access Hardening

Ferme le shell distant WinRM et déconnecte une session SMB inactive après quinze minutes.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | CIS v4 Windows 11 L1 — paramètres repris d'IntuneAdmin, valeurs vérifiées par rapport aux définitions du settings catalog. |
| Fichier | [`Baseline_WIN_D_Remote_Access_Hardening.json`](Baseline_WIN_D_Remote_Access_Hardening.json) |

> ATTENTION avant d'affecter : vérifiez qu'aucun script de gestion ni outil de supervision ne repose sur WinRM. `Enter-PSSession` et `Invoke-Command` continuent de fonctionner — ils utilisent le point de terminaison PowerShell, pas le shell distant — mais `winrs` et tout ce qui s'appuie dessus ne fonctionnent plus. Sur un parc doté d'outils de gestion on-prem, c'est la seule policy de cet ensemble qui peut casser quelque chose que vous ne voyez pas immédiatement. En plus du shell distant, la gestion du serveur WinRM dans son ensemble est désormais fermée elle aussi. C'est la variante la plus large : plus aucune connexion WinRM entrante, et pas seulement plus de shell interactif. Vérifiez ce point, avec le paramètre du shell distant, par rapport aux outils de gestion qui reposent sur WinRM.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.15 Contrôle d'accès<br>A.8.20 Sécurité des réseaux<br>A.8.21 Sécurité des services réseau |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 3

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_remoteshell_allowremoteshellaccess` | 0 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_microsoftnetworkserver_amountofidletimerequiredbeforesuspendingsession` | 15 |
| `device_vendor_msft_policy_config_remotemanagement_allowremoteservermanagement` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
