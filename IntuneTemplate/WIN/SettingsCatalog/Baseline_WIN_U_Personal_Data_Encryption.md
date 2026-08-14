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
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Encryption - U - Personal Data Encryption |
| Bestand | [`Baseline_WIN_U_Personal_Data_Encryption.json`](Baseline_WIN_U_Personal_Data_Encryption.json) |

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
