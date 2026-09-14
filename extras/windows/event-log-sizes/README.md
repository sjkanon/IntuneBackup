# Logboekgroottes voor PowerShell, Defender en Code Integrity

| | |
|---|---|
| **Controls** | ISO A.8.15 Logging · NIS2 art. 21(2)(b) incidentbehandeling · CIS Controls v8.1 8.3 Ensure Adequate Audit Log Storage · NIST CSF 2.0 PR.PS-04 |
| **Fase** | 2 |

## Waarom

`[Baseline] - WIN - D - Audit and Event Logging` zet de grootte van Application, Security en
System. De drie operationele kanalen waar incidentonderzoek het meest op leunt, hebben geen CSP
voor hun maximale grootte en staan standaard op 15 MB of kleiner:

| Kanaal | Wordt gevuld door | Standaard | Hier |
|---|---|---:|---:|
| `Microsoft-Windows-PowerShell/Operational` | scriptblok-logging (Security Hardening), module-logging (Security Log Monitoring) | 15 MB | 256 MB |
| `Microsoft-Windows-Windows Defender/Operational` | detecties, ASR, Network Protection, tamper-meldingen | 16 MB | 64 MB |
| `Microsoft-Windows-CodeIntegrity/Operational` | App Control-audit 3076/3089 (zie `../app-control/`) | 1 MB | 64 MB |

Met module-logging aan loopt het PowerShell-logboek op een actieve beheerwerkplek binnen uren vol
en zijn de gebeurtenissen van gisteren weg op het moment dat iemand ernaar zoekt. Het
CodeIntegrity-logboek van 1 MB overleeft een auditfase van dertig dagen niet.

## Uitrol

Intune admin center → **Devices → Scripts and remediations → Create**:

| Veld | Waarde |
|---|---|
| Naam | `[Baseline] - WIN - D - Event Log Sizes` |
| Detectiescript | `Detect-EventLogSizes.ps1` |
| Herstelscript | `Remediate-EventLogSizes.ps1` |
| Uitvoeren met aanmeldingsreferenties | Nee (SYSTEM) |
| 64-bits PowerShell | Ja |
| Schema | Dagelijks |
| Toewijzing | pilotgroep, daarna alle Windows-apparaten |

De groottes staan in beide scripts in dezelfde tabel `$Channels`; houd die gelijk. 256 + 64 + 64 MB
is op een schijf van 256 GB verwaarloosbaar; Storage Sense raakt logboeken niet.
