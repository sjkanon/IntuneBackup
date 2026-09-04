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

> User-scoped, dus toewijzen aan gebruikers en niet aan apparaten. Werkt met Defender en met elke andere scanner die zich als antivirusprovider registreert. Daarnaast blijft de zone-informatie op een gedownload bestand bewaard (Mark of the Web). Dat merkteken is waar Office Beveiligde weergave en SmartScreen op afgaan; gaat het verloren, dan opent een gedownload document alsof het van de eigen schijf komt en valt de belangrijkste rem weg. De instelling heet in de catalogus omgekeerd — *Do not preserve zone information* op Disabled betekent dat de informatie juist wél wordt bewaard.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `user_vendor_msft_policy_config_attachmentmanager_notifyantivirusprograms` | 1 |
| `user_vendor_msft_policy_config_attachmentmanager_donotpreservezoneinformation` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
