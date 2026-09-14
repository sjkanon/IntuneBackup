<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Attack Surface Reduction

Blokkeert de aanvalstechnieken uit Defender's Attack Surface Reduction-regels: macro's die processen starten, uitvoerbare inhoud uit e-mail en USB, misbruik van Office- en scriptmotoren, en het uitlezen van inloggegevens uit LSASS.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAttackSurfaceReduction) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-007-ASRDefaultRules` |
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Attack Surface Reduction - D - ASR Rules (L2) |
| Bestand | [`Baseline_WIN_D_Attack_Surface_Reduction.json`](Baseline_WIN_D_Attack_Surface_Reduction.json) |

> Vervangt de vorige ASR-policy: dezelfde 18 regels plus 2 nieuwe, allemaal op block.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.7 Bescherming tegen malware<br>A.8.8 Beheer van technische kwetsbaarheden |
| NIS2 art. 21(2) | art. 21(2)(e) beveiliging bij verwerving, ontwikkeling en onderhoud, incl. kwetsbaarheden |
| CIS Controls v8.1 | 10.5 Enable Anti-Exploitation Features |
| NIST CSF 2.0 | PR.PS-05<br>DE.CM-09 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 20

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_defender_attacksurfacereductionrules` | *(groep)* |
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

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
