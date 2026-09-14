<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - File Sharing Restrictions

Voorkomt dat een gebruiker bestanden uit zijn eigen profiel via 'Delen' in Verkenner met andere gebruikers of het netwerk deelt.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-209-UFileSharingRestrictions` |
| Bron | CIS v4 Windows 11 L1 — IntuneAdmin CISv4-profiel 'Prevent users from sharing files within their profile (User)', instance ongewijzigd overgenomen |
| Bestand | [`Baseline_WIN_U_File_Sharing_Restrictions.json`](Baseline_WIN_U_File_Sharing_Restrictions.json) |

> Raakt geen bestaande share die een beheerder heeft aangemaakt, alleen het deelmenu van de gebruiker zelf.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.3 Beperking toegang tot informatie<br>A.8.12 Voorkomen van datalekken |
| NIS2 art. 21(2) | art. 21(2)(i) personeelsbeveiliging, toegangsbeleid en beheer van bedrijfsmiddelen |
| CIS Controls v8.1 | 3.3 Configure Data Access Control Lists |
| NIST CSF 2.0 | PR.AA-05<br>PR.DS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_admx_sharing_noinplacesharing` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
