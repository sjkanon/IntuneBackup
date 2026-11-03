<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

**Nederlands** · [English](Baseline_WIN_D_Shared_Devices_Passwordless.en.md) · [Français](Baseline_WIN_D_Shared_Devices_Passwordless.fr.md)

# [Baseline] - WIN - D - Shared Devices Passwordless

Verbergt het wachtwoordveld op het aanmeldscherm van gedeelde apparaten en zet aanmelden via het web aan, zodat gebruikers zich aanmelden met een FIDO2-sleutel, of met een Temporary Access Pass zolang ze er nog geen hebben.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| Bron | Eigen baseline — EnablePasswordlessExperience en EnableWebSignIn uit [Baseline] - WIN - D - Passwordless (OpenIntuneBaseline Windows v4.0), zonder de standaard-aanmeldtegel. |
| Bestand | [`Baseline_WIN_D_Shared_Devices_Passwordless.json`](Baseline_WIN_D_Shared_Devices_Passwordless.json) |

> Hoort op SG-D-UEM-WIN-Shared, samen met [Baseline] - WIN - D - Windows Hello for Business Disabled en [Baseline] - WIN - D - Security Key Sign-in. [Baseline] - WIN - D - Passwordless zet daarnaast de standaardtegel op de pincode van Windows Hello; die hoort niet op een toestel zonder Windows Hello, daarom staat hij hier niet in. Deze twee instellingen hebben dezelfde waarde als in die policy, dus samen op één toestel is geen Conflict. Wie nog geen sleutel heeft, meldt zich aan via het web met een Temporary Access Pass van de servicedesk: zet de TAP-methode in Entra aan voordat deze policy landt.

## Normen

| Kader | Controls |
|---|---|
| ISO/IEC 27001:2022 | A.5.17 Authenticatie-informatie<br>A.8.5 Veilige authenticatie |
| NIS2 art. 21(2) | art. 21(2)(j) multifactorauthenticatie en beveiligde communicatie |
| NIST CSF 2.0 | PR.AA-03 |

Wat dit per norm betekent en wat er organisatorisch naast nodig is: [COMPLIANCE.md](../../../docs/COMPLIANCE.md).

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_authentication_enablepasswordlessexperience` | 1 |
| `device_vendor_msft_policy_config_authentication_enablewebsignin` | 1 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
