<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Personal Data Encryption

Versleutelt de persoonlijke mappen van de gebruiker met een sleutel die aan hun Windows Hello-aanmelding hangt, zodat de data ook op een aanstaand apparaat versleuteld blijft.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog (endpointSecurityDiskEncryption) |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-105-UPersonalDataEncryption` |
| Bron | OpenIntuneBaseline Windows v4.0 — ES - Encryption - U - Personal Data Encryption |
| Bestand | [`Baseline_WIN_U_Personal_Data_Encryption.json`](Baseline_WIN_U_Personal_Data_Encryption.json) |

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Eindpuntapparatuur van gebruikers<br>A.8.24 Gebruik van cryptografie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptografie en versleuteling |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>3.11 Encrypt Sensitive Data at Rest |
| NIST CSF 2.0 | PR.DS-01 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../COMPLIANCE.md).

## Instellingen — 4

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_pde_enablepersonaldataencryption` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_pde_protectfolders_protectpictures` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_pde_protectfolders_protectdocuments` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`user_vendor_msft_pde_protectfolders_protectdesktop` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
