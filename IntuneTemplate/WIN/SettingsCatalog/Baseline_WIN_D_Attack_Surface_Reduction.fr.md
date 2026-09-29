<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Attack_Surface_Reduction.md) · [English](Baseline_WIN_D_Attack_Surface_Reduction.en.md) · **Français**

# [Baseline] - WIN - D - Attack Surface Reduction

Bloque les techniques d'attaque visées par les règles Attack Surface Reduction de Defender : macros qui lancent des processus, contenu exécutable provenant des e-mails et de l'USB, abus des moteurs Office et de script, et vol d'identifiants depuis LSASS.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityAttackSurfaceReduction) |
| Affectation | All Devices |
| checkId | `INTUNE-BASE-007-ASRDefaultRules` |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Attack Surface Reduction - D - ASR Rules (L2) |
| Fichier | [`Baseline_WIN_D_Attack_Surface_Reduction.json`](Baseline_WIN_D_Attack_Surface_Reduction.json) |

> Remplace la policy ASR précédente : les mêmes 18 règles plus 2 nouvelles, toutes sur block.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Protection contre les programmes malveillants<br>A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.PS-05<br>DE.CM-09 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 20

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_defender_attacksurfacereductionrules` | *(groupe)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockexecutionofpotentiallyobfuscatedscripts` | warn |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockwin32apicallsfromofficemacros` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockexecutablefilesrunningunlesstheymeetprevalenceagetrustedlistcriterion` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockofficecommunicationappfromcreatingchildprocesses` | warn |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockallofficeapplicationsfromcreatingchildprocesses` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockadobereaderfromcreatingchildprocesses` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockcredentialstealingfromwindowslocalsecurityauthoritysubsystem` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockjavascriptorvbscriptfromlaunchingdownloadedexecutablecontent` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockuntrustedunsignedprocessesthatrunfromusb` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockpersistencethroughwmieventsubscription` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockuseofcopiedorimpersonatedsystemtools` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockabuseofexploitedvulnerablesigneddrivers` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockprocesscreationsfrompsexecandwmicommands` | warn |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockofficeapplicationsfromcreatingexecutablecontent` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockofficeapplicationsfrominjectingcodeintootherprocesses` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockrebootingmachineinsafemode` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_useadvancedprotectionagainstransomware` | block |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockexecutablecontentfromemailclientandwebmail` | block |
| `device_vendor_msft_policy_config_defender_enablecontrolledfolderaccess` | 2 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
