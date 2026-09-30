<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Windows_AI_Recall_Boundaries.md) · [English](Baseline_WIN_D_Windows_AI_Recall_Boundaries.en.md) · **Français**

# CXNM - Standard - WIN - D - Windows AI Recall Boundaries

Encadre Recall lorsqu'il est autorisé : pas d'instantanés des portails d'administration ni du coffre-fort de mots de passe, conservation de 30 jours au plus, 10 Go au plus, et les utilisateurs ne peuvent pas exporter leurs données Recall.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Policy CSP WindowsAI (SetDenyAppListForRecall, SetDenyUriListForRecall, SetMaximumStorageDurationForRecallSnapshots, SetMaximumStorageSpaceForRecallSnapshots, AllowRecallExport) ; valeurs vérifiées par rapport aux définitions du settings catalog |
| Fichier | [`Baseline_WIN_D_Windows_AI_Recall_Boundaries.json`](Baseline_WIN_D_Windows_AI_Recall_Boundaries.json) |

> **La liste d'applications est volontairement incomplète.** Elle contient ce qui est défendable partout — une session RDP affiche l'écran d'un autre système, un coffre-fort de mots de passe affiche des mots de passe. Complétez-la avec les programmes qui affichent des données sensibles dans cet environnement : le logiciel RH, le système de gestion des dossiers, l'environnement bancaire. Les noms peuvent être un exécutable (`app.exe`) ou un AUMID pour les applications du Store. Notez que la durée de conservation de 30 jours ne dit rien des obligations de suppression : si une donnée personnelle se trouve dans l'index, cet index est soumis aux mêmes règles que la source. L'export est déjà désactivé par défaut ; il est fixé explicitement ici pour que ce soit une décision et non un hasard.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.33 Protection des enregistrements<br>A.5.34 Protection de la vie privée et des DCP<br>A.8.11 Masquage des données<br>A.8.12 Prévention de la fuite de données |
| CIS Controls v8.1 | 3.4 Enforce Data Retention |
| NIST CSF 2.0 | PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 5

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_windowsai_setdenyapplistforrecall` | mstsc.exe, KeePass.exe, KeePassXC.exe, 1Password.exe, Bitwarden.exe |
| `device_vendor_msft_policy_config_windowsai_setdenyurilistforrecall` | https://login.microsoftonline.com, https://entra.microsoft.com, https://portal.azure.com, https://admin.microsoft.com, https://intune.microsoft.com, https://security.microsoft.com, https://compliance.microsoft.com, https://myaccount.microsoft.com, https://mysignins.microsoft.com |
| `device_vendor_msft_policy_config_windowsai_setmaximumstoragedurationforrecallsnapshots` | 30 |
| `device_vendor_msft_policy_config_windowsai_setmaximumstoragespaceforrecallsnapshots_v2` | device_vendor_msft_policy_config_windowsai_setmaximumstoragespaceforrecallsnapshots_10240 |
| `device_vendor_msft_policy_config_windowsai_allowrecallexport` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
