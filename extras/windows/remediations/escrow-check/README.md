# Escrow-controle: BitLocker-herstelsleutel en LAPS-wachtwoord in Entra ID

| | |
|---|---|
| **Controls** | ISO A.8.13 Back-up van informatie, A.8.24 Gebruik van cryptografie, A.8.2 Speciale toegangsrechten · NIS2 art. 21(2)(c) bedrijfscontinuiteit en crisisbeheer, art. 21(2)(f) beoordeling van de doeltreffendheid · CIS Controls v8.1 3.11 Encrypt Sensitive Data at Rest, 5.2 Use Unique Passwords · NIST CSF 2.0 PR.DS-01, PR.AA-05 |
| **Fase** | detectie 1 (verandert niets) · BitLocker-herstel 2 |

## Waarom

`[Baseline] - WIN - D - BitLocker` eist dat de herstelsleutel naar Entra ID gaat en
`[Baseline] - WIN - D - Windows LAPS` dat het beheerderswachtwoord daar staat. Beide policies
rapporteren **Geslaagd** zodra de instelling is gezet — niet of de sleutel of het wachtwoord
ook daadwerkelijk is aangekomen. De compliance-toets `Compliance BitLocker` kijkt alleen of de
schijf versleuteld is. Een apparaat dat versleuteld is zonder bruikbare herstelsleutel in Entra
is bij het eerste BitLocker-herstel onherroepelijk een verloren apparaat. Deze scripts maken dat
verschil zichtbaar in het remediation-rapport — het aantoonbare deel van A.8.13 en art. 21(2)(f).

## Bestanden

| Bestand | Detectie | Herstel |
|---|---|---|
| `Detect-BitLockerEscrow.ps1` / `Remediate-BitLockerEscrow.ps1` | Heeft de OS-schijf een herstelwachtwoord-protector, en staat er voor díe protector een geslaagde Entra-backup (BitLocker-API gebeurtenis 845) in het logboek? | `BackupToAAD-BitLockerKeyProtector` voor elke herstelwachtwoord-protector; maakt er één aan als hij ontbreekt en de schijf versleuteld is |
| `Detect-LapsEscrow.ps1` | Is er in de afgelopen `$MaxAgeDays` dagen een geslaagde LAPS-update naar Entra ID gelogd (Microsoft-Windows-LAPS/Operational 10029)? | geen — alleen detectie; `Invoke-LapsPolicyProcessing` forceert een nieuwe poging, maar een blijvende fout zit in de policy of in de Entra-apparaatinstelling *Enable Microsoft Entra Local Administrator Password Solution* en moet daar worden opgelost |

## Uitrol

Intune admin center → **Devices → Scripts and remediations → Create**, per paar:

| Veld | Waarde |
|---|---|
| Naam | `[Baseline] - WIN - D - BitLocker Escrow Check` / `[Baseline] - WIN - D - LAPS Escrow Check` |
| Uitvoeren met aanmeldingsreferenties | Nee (SYSTEM) |
| 64-bits PowerShell | Ja |
| Schema | Dagelijks |
| Toewijzing | alle Windows-apparaten; het BitLocker-herstelscript pas na een week in de pilotgroep |

Het rapport (Scripts and remediations → de remediation → Device status) is het bewijs:
*Without issues* = sleutel of wachtwoord aantoonbaar in Entra.

## Kanttekeningen

- Gebeurtenis 845 staat alleen in het logboek zolang het niet is overgeschreven. Een apparaat dat
  lang geleden is versleuteld kan dus terecht een sleutel in Entra hebben en toch als *issue*
  verschijnen; het herstelscript maakt dan een nieuwe backup en daarna is het groen. Dat is
  bewust: liever één overbodige backup dan één aanname.
- `Detect-LapsEscrow.ps1` gaat uit van `passwordagedays_aad` = 7 in de LAPS-policy; `$MaxAgeDays`
  staat daarom op 10. Pas aan als de policy verandert.
- Beide detecties lezen alleen logboeken en BitLocker-status; ze versturen niets.
