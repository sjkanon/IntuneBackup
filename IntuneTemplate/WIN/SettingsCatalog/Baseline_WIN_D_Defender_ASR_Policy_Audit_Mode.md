<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender ASR Policy Audit Mode

Zet dezelfde Attack Surface Reduction-regels als de blokkerende ASR-policy op audit: Defender logt wat het zou tegenhouden, maar houdt niets tegen. Bedoeld om de impact van een regel te meten voordat je 'm laat blokkeren.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityAttackSurfaceReduction) |
| Toewijzing | — |
| checkId | `INTUNE-BASE-107-DDefenderASRPolicyAuditMode` |
| Bron | CIPP-standaardtemplate |
| Bestand | [`Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.json`](Baseline_WIN_D_Defender_ASR_Policy_Audit_Mode.json) |

> Komt uit CIPP, niet uit OIB — import-oib.js raakt de instellingen dus niet aan. Zet 16 ASR-regels op audit die [Baseline] - WIN - D - Attack Surface Reduction op block of warn zet. Daarom sinds de vergelijking met IntuneAdmin/IntuneBaselines bewust zónder toewijzing: beide op alle apparaten leverde op elk van die 16 regels een Conflict op, waarna Intune de regel door géén van beide policies toepast. Hoort op een pilotgroep, en dan zonder de blokkerende ASR-policy.

## Instellingen — 20

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_defender_attacksurfacereductionrules` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockexecutionofpotentiallyobfuscatedscripts` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockadobereaderfromcreatingchildprocesses` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockwin32apicallsfromofficemacros` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockcredentialstealingfromwindowslocalsecurityauthoritysubsystem` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockprocesscreationsfrompsexecandwmicommands` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockpersistencethroughwmieventsubscription` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockofficeapplicationsfromcreatingexecutablecontent` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockofficeapplicationsfrominjectingcodeintootherprocesses` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockexecutablefilesrunningunlesstheymeetprevalenceagetrustedlistcriterion` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockjavascriptorvbscriptfromlaunchingdownloadedexecutablecontent` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockwebshellcreationforservers` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockofficecommunicationappfromcreatingchildprocesses` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockuseofcopiedorimpersonatedsystemtools` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockallofficeapplicationsfromcreatingchildprocesses` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockuntrustedunsignedprocessesthatrunfromusb` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_useadvancedprotectionagainstransomware` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockexecutablecontentfromemailclientandwebmail` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockabuseofexploitedvulnerablesigneddrivers` | audit |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_policy_config_defender_attacksurfacereductionrules_blockrebootingmachineinsafemode` | audit |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
