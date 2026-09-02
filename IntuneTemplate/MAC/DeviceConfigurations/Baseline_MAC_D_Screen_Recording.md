<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - MAC - D - Screen Recording

Zet schermopname voor NinjaOne Remote en TeamViewer op AllowStandardUserToSetSystemService: een gebruiker zonder beheerdersrechten kan het vinkje zelf aanzetten, zonder beheerderswachtwoord. Aanzetten blijft een handmatige klik — macOS staat een MDM niet toe schermopname te verlenen.

| | |
|---|---|
| Platform | macOS |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Device config |
| Toewijzing | All Devices |
| checkId | geen — de platform-engine heeft geen matcher voor dit policytype |
| Bron | eigen baseline — Apple staat schermopname niet toe in de settings catalog-vorm van PPPC |
| Bestand | [`Baseline_MAC_D_Screen_Recording.json`](Baseline_MAC_D_Screen_Recording.json) |

> Apple laat schermopname niet met "Allow" verlenen — een MDM kan het alleen weigeren of, zoals hier, de gebruiker het zelf laten aanzetten zonder beheerderswachtwoord. De eerste klik blijft dus handmatig, net als de periodieke herbevestiging op recente macOS-versies. Custom profile en geen settings catalog, omdat de mobileconfig de letterlijke waarde uit Apple's schema draagt in plaats van een Intune-enum die per definitie-update kan verschuiven. Dezelfde vijf bundles en dezelfde code requirements als de Toegankelijkheid-entries in [Baseline] - MAC - D - Privacy Preferences; die twee profielen raken elkaar niet omdat ze verschillende TCC-services zetten.

## Eigenschappen — 4

Een klassieke device configuration heeft geen settingDefinitionId's maar vaste eigenschappen.

| Eigenschap | Waarde |
|---|---|
| `deploymentChannel` | deviceChannel |
| `payloadName` | Screen Recording |
| `payloadFileName` | baseline-mac-screen-recording.mobileconfig |
| `payload` | PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHBsaXN0IFBVQkxJQyAiLS8vQXBwbGUvL0RURCBQTEl… |

---

Terug naar het [macOS-overzicht](../README.md) · [hoofd-README](../../../README.md)
