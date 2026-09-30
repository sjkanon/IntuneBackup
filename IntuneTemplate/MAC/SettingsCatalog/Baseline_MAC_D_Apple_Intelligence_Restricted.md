<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_MAC_D_Apple_Intelligence_Restricted.en.md) · [Français](Baseline_MAC_D_Apple_Intelligence_Restricted.fr.md)

# CXNM - Standard - MAC - D - Apple Intelligence Restricted

Zet Apple Intelligence-functies uit die tekst, e-mail, notities, webpagina's of afbeeldingen door een taalmodel laten verwerken of naar een externe AI-dienst sturen, en houdt dicteren op het apparaat.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | CIS Apple macOS 26.0 Tahoe Benchmark v1.1.0 L1 2.5.1.1–2.5.1.4 en 2.18.1 (mSCP branch tahoe); ids en waarden gelijk aan OpenIntuneBaseline macOS v2.0 beta — SC - Device Security - D - Restrictions, behalve Safari-samenvattingen (OIB: aan, hier uit) |
| Bestand | [`Baseline_MAC_D_Apple_Intelligence_Restricted.json`](Baseline_MAC_D_Apple_Intelligence_Restricted.json) |

> **Alternatief van CXNM - Standard - MAC - D - Apple Intelligence Permitted** — die zet dezelfde twaalf instellingen op de andere waarde. Allebei toewijzen levert een Conflict op, en dan doet géén van beide iets. Gecontroleerd: CXNM - Standard - MAC - D - Restrictions (OpenIntuneBaseline macOS v1.0) zet geen van deze twaalf ids, en geen ander template doet dat. Siri staat daar al uit (allowAssistant), dus de ChatGPT-integratie via Siri was al grotendeels dicht; deze policy sluit ook de integratie in Writing Tools en het aanmelden bij een externe dienst. Profielsleutels (com.apple.applicationaccess) en geen DDM: Apple markeert in september 2026 alle twaalf sleutels als deprecated vanaf 26.4, ten gunste van de declaratieve configuraties com.apple.configuration.intelligence.settings en com.apple.configuration.external-intelligence.settings (in Intune: intelligencesettings_* en externalintelligencesettings_*, die ook voor macOS bestaan). Toch blijven de profielsleutels staan, en dat is nagerekend in plaats van uitgesteld: die DDM-configuraties bestaan pas vanaf macOS 26.4 en Apple staat er alleen supervised inschrijving bij toe, terwijl deze payload het ook doet op macOS 15 en op een Mac die de gebruiker zelf heeft ingeschreven. Nu omzetten zou Apple Intelligence op 15.x en op 26.0 tot 26.3 juist onbeperkt laten, en dat is een verslechtering. Deprecated is bij Apple ook niet verwijderd: de sleutels werken nog, en mSCP en OpenIntuneBaseline v2.0 beta gebruiken dezelfde. Overstappen zodra de vloot op 26.4 of hoger zit en via ADE is ingeschreven; zet dan de hele policy om en meng de twee vormen niet. De omzetting is een op een: intelligencesettings_allowwritingtools, _allowgenmoji, _allowimageplayground, _allowappleintelligencereport en _forceondeviceonlydictation, de samenvattingen onder intelligencesettings_apps_mail, _apps_notes en _apps_safari, en externalintelligencesettings_enabled en _allowsignin. DDM kan daarnaast wat deze payload niet kan (AllowImageWand, AllowVisualIntelligence, AllowPersonalizedHandwritingResults, ForceOnDeviceOnlyTranslation, Apps/Calendar) en dat is een nieuwe keuze, geen onderdeel van de omzetting. CXNM - Standard - IOS - D - Apple Intelligence Restricted is al wel declaratief; daar was geen dekking van oudere versies te verliezen. allowMailSummary blokkeert volgens Apple alleen het handmatig samenvatten van een e-mail, niet de automatische samenvattingen. Wie de ChatGPT-integratie wel wil toestaan maar alleen met de eigen zakelijke werkruimte, gebruikt allowedExternalIntelligenceWorkspaceIDs — organisatiespecifiek, daarom niet opgenomen. Apple Intelligence draait alleen op Macs met Apple silicon en macOS 15.1 of later; op andere Macs doen de instellingen niets. Allemaal ook op iOS/iPadOS geldig; deze policy is alleen voor macOS. Bewuste afwijking van OpenIntuneBaseline v2.0 beta: die laat allowSafariSummary op true; hier false, want een samengevatte webpagina kan een intranet- of SharePoint-pagina zijn. Het Apple Intelligence-rapport (allowAppleIntelligenceReport) staat uit zoals in OIB.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.10 Aanvaardbaar gebruik<br>A.8.12 Voorkomen van datalekken<br>A.5.34 Privacy en bescherming van persoonsgegevens |
| NIS2 art. 21(2) | art. 21(2)(d) beveiliging van de toeleveringsketen |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.DS-02<br>PR.PS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 13

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowappleintelligencereport` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrations` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowexternalintelligenceintegrationssignin` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowgenmoji` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowimageplayground` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsmartreplies` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmailsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscription` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allownotestranscriptionsummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowsafarisummary` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowwritingtools` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceondeviceonlydictation` | true |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
