# extras/android/

Wat bij een complete Android-baseline hoort maar geen van de vijf CIPP-policytypes is. Deze
bestanden staan daarom **buiten** `IntuneTemplate/`, net als `enrollment/macos/` en
`compliance/macos/`: `generate-baseline.js`, `export-intunebackup.js` en
`Set-BaselineAssignment.ps1` pikken ze niet op, en er hoort geen `checkId` bij.

| Map | Wat | Graph-resource |
|---|---|---|
| [`enrollment-restrictions/`](enrollment-restrictions/README.md) | Android Enterprise toestaan, device administrator blokkeren | `deviceManagement/deviceEnrollmentConfigurations` |
| [`app-configuration/`](app-configuration/README.md) | Outlook, Edge en Defender op ingeschreven toestellen | `deviceAppManagement/mobileAppConfigurations` |
| [`assignment-filters/`](assignment-filters/README.md) | Persoonlijk, corporate en dedicated uit elkaar houden | `deviceManagement/assignmentFilters` |

Alle JSON is een Graph-body (beta) zonder tenant-id's. Wat per tenant verschilt staat er als
placeholder in HOOFDLETTERS die eindigt op `-INVULLEN`; zoek daarop vóór je iets uitrolt.

De volgorde bij een eerste Android-inschrijving:

1. Managed Google Play koppelen (Intune → Apparaten → Android → Android Enterprise) en Outlook,
   Edge, Teams, Authenticator en — bij een Defender-licentie — Microsoft Defender goedkeuren.
2. Inschrijvingsrestricties (deze map).
3. App-configuratie (deze map), nadat de apps uit stap 1 in Intune staan.
4. De fase 3-policies uit `IntuneTemplate/AND/` toewijzen.
