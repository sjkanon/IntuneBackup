<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Apple Intelligence Permitted

Staat dezelfde Apple Intelligence-functies uitdrukkelijk toe: Writing Tools, samenvattingen in Mail, Notities en Safari, Genmoji, Image Playground, de externe AI-integratie en dicteren via Apple's servers.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-194-MACDAppleIntelligencePermitted` |
| Bron | Eigen baseline — spiegelbeeld van [Baseline] - MAC - D - Apple Intelligence Restricted; ids uit OpenIntuneBaseline macOS v2.0 beta en CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 (mSCP branch tahoe) |
| Bestand | [`Baseline_MAC_D_Apple_Intelligence_Permitted.json`](Baseline_MAC_D_Apple_Intelligence_Permitted.json) |

> **Alternatief van [Baseline] - MAC - D - Apple Intelligence Restricted.** Die zet dezelfde twaalf instellingen op de andere waarde; allebei toewijzen levert een Conflict op waarna Intune er géén toepast. forceOnDeviceOnlyDictation staat hier op false: dicteren mag via Apple's servers. De ChatGPT-integratie beperken tot de eigen zakelijke werkruimte kan met allowedExternalIntelligenceWorkspaceIDs; organisatiespecifiek, daarom niet opgenomen. Siri blijft uit via [Baseline] - MAC - D - Restrictions (allowAssistant); wie de externe integratie via Siri wil, moet ook dat besluit heroverwegen.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Aanvaardbaar gebruik<br>A.8.1 Eindpuntapparatuur van gebruikers<br>A.5.34 Privacy en bescherming van persoonsgegevens |
| NIS2 art. 21(2) | art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 13

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowappleintelligencereport` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrations` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrationssignin` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowgenmoji` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowimageplayground` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsmartreplies` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscription` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscriptionsummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowsafarisummary` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowwritingtools` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceondeviceonlydictation` | false |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
