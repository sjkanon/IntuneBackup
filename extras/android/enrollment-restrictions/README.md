# Android-inschrijvingsrestricties

Een inschrijvingsrestrictie beslist *vóór* de inschrijving of een toestel er überhaupt in mag.
De compliancepolicies in `IntuneTemplate/AND/` beslissen daarna of het toestel veilig genoeg is.
Hier staan twee besluiten.

## 1. Android Enterprise toestaan, ook persoonlijk — `AND-Allow-Android-Enterprise.json`

`platformType: androidForWork` dekt alle Android Enterprise-vormen: persoonlijk werkprofiel,
corporate-owned work profile, fully managed en dedicated. `personalDeviceEnrollmentBlocked:
false` laat het persoonlijke werkprofiel toe — anders kan een medewerker met een eigen telefoon
alleen via App Protection zonder inschrijving werken, en dan gelden de werkprofielpolicies
(Work Profile Restrictions, Compliance Device Health/Password) nooit.

Blokkeren van persoonlijke inschrijving raakt alleen het persoonlijke werkprofiel; corporate
inschrijvingen (QR-code, zero-touch, Knox Mobile Enrollment) gaan buiten deze restrictie om.

Geen OS-ondergrens in de restrictie: die staat in de compliancepolicies, waar een gebruiker een
melding krijgt in plaats van een mislukte inschrijving zonder uitleg.

## 2. Device administrator blokkeren — in de portal

Device administrator is door Google uitgefaseerd en Intune ondersteunt het sinds 31 december
2024 niet meer op toestellen met Google Mobile Services. Geen enkele Android-policy in de
baseline werkt op zo'n toestel. Zet het dicht:

**Intune → Apparaten → Inschrijving → Apparaatplatformbeperkingen → Android** → de
standaardbeperking (*All users*) → *Android device administrator*: **Platform: Blokkeren**.

Er staat hier bewust **geen JSON** voor. De Graph-waarde daarvoor (`platformType: "android"` op
hetzelfde type) kon in deze ronde niet worden geverifieerd tegen een bron-export of de
pl4nty-definities, en de standaardbeperking bestaat al in elke tenant (die werk je bij met
PATCH, niet met een nieuwe POST). Toestellen die al met device administrator zijn ingeschreven
vangt `[Baseline] - AND - U - Compliance Block Device Administrator` op.

## Uitrollen

```http
POST https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations
Content-Type: application/json

<inhoud van AND-Allow-Android-Enterprise.json>
```

Daarna toewijzen — een aangepaste restrictie zonder toewijzing doet niets:

```http
POST https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations/{id}/assign
Content-Type: application/json

{ "enrollmentConfigurationAssignments": [ { "target": {
    "@odata.type": "#microsoft.graph.groupAssignmentTarget",
    "groupId": "GEBRUIKERSGROEP-ID-INVULLEN" } } ] }
```

Of in de portal: dezelfde plek als hierboven → *Beperking maken* → Android Enterprise.

Let op: `priority` wordt bij importeren niet altijd overgenomen. Controleer na het aanmaken dat
deze restrictie bóven de standaardbeperking staat (lager getal = hoger), anders wint de
standaard.
