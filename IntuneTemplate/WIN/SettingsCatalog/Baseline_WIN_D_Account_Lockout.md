<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Account Lockout

Sluit een account 15 minuten af na tien mislukte aanmeldpogingen, ook dat van de ingebouwde beheerder, en zet het apparaat na tien mislukte pogingen in BitLocker-herstel.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | — |
| checkId | `INTUNE-BASE-124-DAccountLockout` |
| Bron | CIS v4 Windows 11 L1 en de Microsoft Security Baseline — waarden geverifieerd tegen Policy CSP DeviceLock (AccountLockoutPolicy, AllowAdministratorLockout) en LocalPoliciesSecurityOptions. |
| Bestand | [`Baseline_WIN_D_Account_Lockout.json`](Baseline_WIN_D_Account_Lockout.json) |

> Drempel 10 en niet 5: bij 5 tikt een gebruiker die zich vergist zichzelf er te makkelijk uit, en 10 is de waarde van de Microsoft Security Baseline. De accountvergrendeling heft zichzelf na 15 minuten op — daar hoeft niemand voor gebeld te worden. De machine-drempel (InteractiveLogon MachineAccountLockoutThreshold) doet iets anders: die zet het apparaat ná tien mislukte pogingen in BitLocker-herstel, en dán is de herstelsleutel nodig. Dat is bedoeld voor een gestolen laptop, niet voor een vergeetachtige gebruiker, maar reken op een enkele helpdeskvraag. AccountLockoutPolicy vraagt Windows 11 22H2 met KB5053657 of 24H2; oudere apparaten negeren de instelling stil. LET OP: IntuneAdmin zet deze instelling in zijn NIS2-profiel op de kale waarde "15" — de CSP verwacht de drie velden als één string ("AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15"), dus die waarde is daar stuk. Neem hem niet over.

## Instellingen — 3

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_policy_config_devicelock_accountlockoutpolicy` | AccountLockoutDuration:15, AccountLockoutThreshold:10, ResetAccountLockoutCounterAfter:15 |
| `device_vendor_msft_policy_config_devicelock_allowadministratorlockout` | 1 |
| `device_vendor_msft_policy_config_localpoliciessecurityoptions_interactivelogon_machineaccountlockoutthreshold` | 10 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
