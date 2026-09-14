# extras/macos/apple-business/

De instellingen in Apple Business (Manager) waar de macOS-baseline op leunt. Geen template —
Apple Business heeft geen API waarmee dit vanuit een repo uit te rollen is — maar een checklist,
omdat een fout hier niet in Intune zichtbaar wordt totdat een Mac niet meer inschrijft.

Geldt voor bedrijfs-Macs via Automated Device Enrollment (ADE): de profielen in
[`enrollment/macos/`](../../../enrollment/macos/README.md) en de
`MAC - D - Enrollment Profile …`-policies gaan ervan uit dat dit staat.

## 1. Organisatie en beheerders

| Instelling | Advies | Waarom |
|---|---|---|
| Beheerders | minimaal twee accounts met de rol *Administrator*, persoonlijk (geen gedeeld account) | één beheerder die vertrekt of zijn toegang kwijtraakt legt tokens en apparaatbeheer stil |
| Noodaccount | één *Administrator* dat **niet** gefedereerd is, met sterk wachtwoord en tweestapsverificatie, in de kluis | valt Entra ID of de federatie uit, dan kan niemand met een gefedereerd account meer in Apple Business |
| Rollen | *Device Manager* voor servicedesk (apparaten toewijzen), *Content Manager* voor apps; *Administrator* alleen voor wie tokens en federatie beheert | minimale rechten (A.8.2) |
| Tweestapsverificatie | aan voor alle niet-gefedereerde beheerders | Apple Business beheert wie jouw Macs mag overnemen |

## 2. Managed Apple Accounts en federatie met Microsoft Entra ID

| Instelling | Advies |
|---|---|
| Domein | het maildomein van de organisatie verifiëren (DNS TXT) |
| Federated authentication | koppelen met Microsoft Entra ID. Gebruikers melden zich met hun Entra-account aan als Managed Apple Account; wachtwoord, MFA en Conditional Access komen uit Entra |
| Directory sync | aan (via Entra), zodat een uitgeschakeld Entra-account ook het Managed Apple Account uitschakelt |
| **Domain capture** | aan: niemand kan nog een persoonlijk Apple Account met het bedrijfsdomein aanmaken. Bestaande persoonlijke accounts met dat domein krijgen van Apple een verzoek om hun e-mailadres te wijzigen — meld dat vooraf aan gebruikers |
| iCloud-diensten voor Managed Apple Accounts | alleen wat de organisatie gebruikt; de baseline zet iCloud-synchronisatie op de Mac al uit (`MAC - D - Restrictions`) |

Waarom: zonder federatie en domain capture ontstaan persoonlijke Apple Accounts op het
bedrijfsadres die de organisatie niet kan intrekken, en loopt offboarding via twee systemen.

## 3. MDM-server en toewijzing

| Stap | Waar |
|---|---|
| Intune als MDM-server toevoegen: publieke sleutel downloaden in Intune (Devices → Enrollment → Apple → **Enrollment program tokens** → Add), in Apple Business een MDM-server aanmaken met die sleutel, servertoken (`.p7m`) terug uploaden in Intune | Apple Business → Voorkeuren → MDM-servers |
| **Standaard-MDM-server voor Mac** op deze Intune-server | Apple Business → Voorkeuren → Toewijzing apparaatbeheer. Zonder standaard komt een nieuw gekochte Mac niet vanzelf in Intune |
| Aankopen koppelen | Apple-klantnummer of reseller-ID vastleggen, zodat Macs van Apple en erkende resellers automatisch in Apple Business verschijnen |
| Bestaande Macs | toevoegen met Apple Configurator voor iPhone; zo'n Mac heeft een voorlopige periode van 30 dagen waarin de gebruiker hem uit beheer kan halen |
| Inschrijfprofiel | in Intune aan het token hangen en als standaard instellen (`enrollment/macos/`), vóórdat de eerste Mac wordt aangezet |

## 4. Tokens en certificaten die jaarlijks verlopen

Geen van drie waarschuwt luid. Zet een terugkerende agenda-afspraak **30 dagen vóór** de vervaldatum
en controleer Tenant administration → Connectors and tokens in Intune.

| Wat | Geldig | Bij verlopen | Vernieuwen |
|---|---|---|---|
| Apple MDM Push Certificate (APNs) | 1 jaar | Intune kan geen enkel Apple-apparaat meer bereiken; na 30 dagen over de datum moeten alle Apple-apparaten opnieuw worden ingeschreven | met **hetzelfde** Apple Account als waarmee het is aangemaakt — gebruik een Managed Apple Account of functioneel account op een gedeelde mailbox, nooit het persoonlijke account van een beheerder |
| ADE-servertoken | 1 jaar | nieuwe Macs schrijven niet meer in via ADE; bestaande blijven werken | nieuw token downloaden in Apple Business, uploaden bij hetzelfde token in Intune (niet een nieuw token aanmaken — dan raken de profieltoewijzingen los) |
| Apps and Books-locatietoken (VPP) | 1 jaar | geen nieuwe app-licenties of updates via Intune | nieuw token downloaden, uploaden bij de bestaande locatie in Intune |

Het Apple Account voor APNs is het meest kwetsbare punt van de hele Apple-inrichting: wie dat
account kwijtraakt, verliest het beheer over alle Apple-apparaten. Leg in het ISMS vast wélk account
het is en wie erbij kan (A.5.17).

## 5. Apps and Books

- Apps **per apparaat** licenseren (device-based assignment in Intune): er is dan geen Apple
  Account op de Mac nodig en de licentie blijft bij het apparaat.
- Alleen de Apps and Books-locatie aan Intune koppelen die voor deze tenant is — één locatie
  aan twee MDM's koppelen geeft licentieconflicten.

## 6. Einde levensduur

Een Mac die de organisatie verlaat (verkoop, retour lease):

1. in Intune wissen of uitschrijven — dat wist ook de Recovery Lock (zie `MAC - D - Recovery Lock`);
2. in Apple Business **vrijgeven** (Release from organization); anders komt de Mac bij de
   nieuwe eigenaar bij het aanzetten in Intune terecht;
3. Activation Lock: controleer dat er geen persoonlijk Apple Account meer aan de Mac hangt.

## Normen

A.5.9 Inventarisatie van bedrijfsmiddelen, A.5.11 Retourneren van bedrijfsmiddelen, A.5.16
Identiteitsbeheer, A.5.17 Authenticatie-informatie, A.5.23 Informatiebeveiliging voor het gebruik
van clouddiensten, A.8.2 Speciale toegangsrechten; NIS2 art. 21(2)(i) en (j); CIS Controls v8.1
1.1, 5.4 Restrict Administrator Privileges to Dedicated Administrator Accounts, 6.7 Centralize
Access Control; NIST CSF 2.0 ID.AM-01, PR.AA-01, PR.AA-05.
