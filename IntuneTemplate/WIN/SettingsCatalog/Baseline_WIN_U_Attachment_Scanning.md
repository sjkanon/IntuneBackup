<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - U - Attachment Scanning

Laat de virusscanner elke bijlage controleren op het moment dat de gebruiker hem opent, niet alleen bij het opslaan.

| | |
|---|---|
| Platform | Windows |
| Scope | User (U) — toewijzen aan gebruikersgroepen |
| Type | Settings Catalog |
| Toewijzing | All Users |
| checkId | `INTUNE-BASE-140-UAttachmentScanning` |
| Bron | CIS v4 Windows 11 L1 — instelling overgenomen uit IntuneAdmin, waarde geverifieerd tegen de settings catalog-definitie. |
| Bestand | [`Baseline_WIN_U_Attachment_Scanning.json`](Baseline_WIN_U_Attachment_Scanning.json) |

> User-scoped, dus toewijzen aan gebruikers en niet aan apparaten. Werkt met Defender en met elke andere scanner die zich als antivirusprovider registreert.

## Instellingen — 1

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_attachmentmanager_notifyantivirusprograms` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
