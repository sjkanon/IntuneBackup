<!-- Gegenereerd door scripts/generate-docs.js — niet met de hand bijwerken. -->

# [Baseline] - WIN - D - BitLocker

Versleutelt de OS-schijf en, via de behouden eigen instellingen, ook vaste en verwisselbare schijven. Herstelsleutels worden in Entra ID bewaard.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — toewijzen aan apparaatgroepen |
| Type | Settings Catalog (endpointSecurityDiskEncryption) |
| Toewijzing | All Devices |
| checkId | `INTUNE-BASE-011-Bitlocker` |
| Bron | OpenIntuneBaseline Windows v3.8 — ES - Encryption - D - BitLocker (OS Disk) |
| Bestand | [`Baseline_WIN_D_BitLocker.json`](Baseline_WIN_D_BitLocker.json) |

> OIB dekt alleen de OS-schijf. De 11 eigen instellingen voor vaste en verwisselbare schijven en de preboot-PIN blijven staan — anders zou versleuteling van datadrives stilzwijgend uitgaan.

## Instellingen — 36

Ingesprongen regels zijn kindinstellingen: die gelden alleen als hun bovenliggende
instelling op de getoonde waarde staat.

| Instelling | Waarde |
|---|---|
| `device_vendor_msft_bitlocker_systemdrivesencryptiontype` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesencryptiontype_osencryptiontypedropdown_name` | 1 |
| `device_vendor_msft_bitlocker_systemdrivesrequirestartupauthentication` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrequirestartupauthentication_configuretpmpinkeyusagedropdown_name` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrequirestartupauthentication_configurepinusagedropdown_name` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrequirestartupauthentication_configuretpmusagedropdown_name` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrequirestartupauthentication_configurenontpmstartupkeyusage_name` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrequirestartupauthentication_configuretpmstartupkeyusagedropdown_name` | 0 |
| `device_vendor_msft_bitlocker_systemdrivesdisallowstandarduserscanchangepin` | 1 |
| `device_vendor_msft_bitlocker_systemdrivesrecoveryoptions` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrecoveryoptions_oshiderecoverypage_name` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrecoveryoptions_osallowdra_name` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrecoveryoptions_osactivedirectorybackupdropdown_name` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrecoveryoptions_osrequireactivedirectorybackup_name` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrecoveryoptions_osactivedirectorybackup_name` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrecoveryoptions_osrecoverypasswordusagedropdown_name` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_systemdrivesrecoveryoptions_osrecoverykeyusagedropdown_name` | 0 |
| `device_vendor_msft_bitlocker_encryptionmethodbydrivetype` | 1 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_encryptionmethodbydrivetype_encryptionmethodwithxtsrdvdropdown_name` | 4 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_encryptionmethodbydrivetype_encryptionmethodwithxtsfdvdropdown_name` | 7 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_encryptionmethodbydrivetype_encryptionmethodwithxtsosdropdown_name` | 7 |
| `device_vendor_msft_bitlocker_requiredeviceencryption` | 1 |
| `device_vendor_msft_bitlocker_allowwarningforotherdiskencryption` | 0 |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_bitlocker_allowstandarduserencryption` | 1 |
| `device_vendor_msft_bitlocker_configurerecoverypasswordrotation` | 1 |
| `device_vendor_msft_bitlocker_identificationfield` | 0 |
| `device_vendor_msft_bitlocker_systemdrivesminimumpinlength` | 0 |
| `device_vendor_msft_bitlocker_systemdrivesenhancedpin` | 0 |
| `device_vendor_msft_bitlocker_systemdrivesenableprebootpinexceptionondecapabledevice` | 0 |
| `device_vendor_msft_bitlocker_systemdrivesenableprebootinputprotectorsonslates` | 0 |
| `device_vendor_msft_bitlocker_systemdrivesrecoverymessage` | 0 |
| `device_vendor_msft_bitlocker_fixeddrivesencryptiontype` | 0 |
| `device_vendor_msft_bitlocker_fixeddrivesrecoveryoptions` | 0 |
| `device_vendor_msft_bitlocker_fixeddrivesrequireencryption` | 0 |
| `device_vendor_msft_bitlocker_removabledrivesconfigurebde` | 0 |
| `device_vendor_msft_bitlocker_removabledrivesrequireencryption` | 0 |

---

Terug naar het [Windows-overzicht](../README.md) · [hoofd-README](../../../README.md)
