<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - IOS - D - Data Protection

Houdt bedrijfsgegevens op elk ingeschreven toestel gescheiden van privé-apps: documenten uit beheerde apps openen niet in onbeheerde apps, AirDrop telt als onbeheerd, beheerde apps synchroniseren niet naar iCloud, privé-apps lezen geen werkcontacten en lokale back-ups zijn versleuteld.

| | |
|---|---|
| Platform | iOS/iPadOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-185-IOSDDataProtection` |
| Bron | UniFy iOS/iPadOS Baseline v1.2 — SC - Data Protection - BYOD/Corporate en SC - iCloud & Storage - BYOD/Corporate (CIS Apple iOS/iPadOS 26 Benchmark v1.0.0); samengevoegd tot één policy voor alle ingeschreven toestellen, omdat elke sleutel ook zonder supervisie en bij user enrollment werkt |
| Bestand | [`Baseline_IOS_D_Data_Protection.json`](Baseline_IOS_D_Data_Protection.json) |

> De opdracht noemde een aparte 'Data Protection BYOD'. Het is één policy geworden: dezelfde sleutels met dezelfde waarden in een BYOD- én een Corporate-variant zou dubbel onderhoud zijn, en [Baseline] - IOS - D - Restrictions Corporate bevat alleen wat supervisie vraagt. Contacten: allowunmanagedtoreadmanagedcontacts=false (privé-apps lezen geen werkcontacten, gelijk aan de Apple-standaard maar expliciet), maar allowmanagedtowriteunmanagedcontacts=**true** — met open-in-scheiding aan kan Outlook anders geen contacten naar de Contacten-app schrijven en ziet de gebruiker bij een inkomend gesprek geen naam; dezelfde reden waarom contactSyncBlocked in App Protection bewust uit staat. allowopenfromunmanagedtomanaged en requiremanagedpasteboard bewust niet: foto's uit de privébibliotheek blijven deelbaar met werkapps (zie ANALYSE.md). Niet overgenomen uit UniFy BYOD: allowscreenshot=false (schermafdrukken op het héle privétoestel uit; App Protection blokkeert ze al binnen de beheerde apps), allowcloudprivaterelay=false en forceairplayoutgoingrequestspairingpassword (privacy/gemak, geen gegevensscheiding).

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.12 Voorkomen van datalekken<br>A.8.24 Gebruik van cryptografie<br>A.8.1 Eindpuntapparatuur van gebruikers |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen<br>art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists<br>3.11 Encrypt Sensitive Data at Rest |
| NIST CSF 2.0 | PR.DS-01<br>PR.DS-02 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 7

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `com.apple.applicationaccess_com.apple.applicationaccess` | *(groep)* |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowopenfrommanagedtounmanaged` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowunmanagedtoreadmanagedcontacts` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmanagedtowriteunmanagedcontacts` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceairdropunmanaged` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_allowmanagedappscloudsync` | false |
| &nbsp;&nbsp;&nbsp;&nbsp;`com.apple.applicationaccess_forceencryptedbackup` | true |

---

Terug naar het [iOS/iPadOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
