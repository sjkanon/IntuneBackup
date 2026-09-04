<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - Defender Ransomware Protection

Blokkeert dat een besmet apparaat bestanden op ándere machines over het netwerk versleutelt.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-153-DDefenderRansomwareProtection` |
| Bron | IntuneAdmin/IntuneBaselines — Microsoft Endpoint Security, Remote Encryption Protection; waarden geverifieerd tegen de settings catalog-definities. IntuneAdmin zet Audit; hier staat Block. |
| Bestand | [`Baseline_WIN_D_Defender_Ransomware_Protection.json`](Baseline_WIN_D_Defender_Ransomware_Protection.json) |

> De agressiviteit staat op Low: alleen blokkeren als Defender voor 100 procent zeker is. Dat is de waarde met de kleinste kans op een fout-positief, en een fout-positief is hier duur — je blokkeert dan een legitiem proces dat bestanden op een share bijwerkt, bijvoorbeeld een back-up of een sync-tool. Medium en High blokkeren vanaf 99 respectievelijk 90 procent zekerheid; overweeg die pas als de rapportage laat zien dat er niets legitiems geraakt wordt. IntuneAdmin levert deze instelling op Audit; hier staat Block, want detecteren zonder blokkeren stopt geen versleuteling.

## Instellingen — 2

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_defender_configuration_behavioralnetworkblocks_remoteencryptionprotection_remoteencryptionprotectionconfiguredstate` | 1 |
| `device_vendor_msft_defender_configuration_behavioralnetworkblocks_remoteencryptionprotection_remoteencryptionprotectionaggressiveness` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
