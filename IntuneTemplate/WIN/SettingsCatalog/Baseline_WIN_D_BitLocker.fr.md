<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_BitLocker.md) · [English](Baseline_WIN_D_BitLocker.en.md) · **Français**

# CXNM - Standard - WIN - D - BitLocker

Chiffre le disque du système d'exploitation et, via les paramètres personnalisés conservés, également les disques fixes et amovibles. Les clés de récupération sont stockées dans Entra ID.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog (endpointSecurityDiskEncryption) |
| Affectation | All Devices |
| Source | OpenIntuneBaseline Windows v4.0 — ES - Encryption - D - BitLocker (OS Disk) |
| Fichier | [`Baseline_WIN_D_BitLocker.json`](Baseline_WIN_D_BitLocker.json) |

> OIB ne couvre que le disque de l'OS. Les 11 paramètres propres pour les lecteurs fixes et amovibles et le PIN de pré-démarrage sont conservés — sinon le chiffrement des lecteurs de données serait désactivé sans que personne ne le remarque. Avant KB5124012 (14 septembre 2026), device preparation (Autopilot v2) plaçait parfois le disque de l'OS en XTS-AES 128 au lieu de 256, car le chiffrement démarrait avant l'arrivée de cette stratégie ; voir WIN/Enrollment/README.fr.md.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Sécurité des actifs hors des locaux<br>A.7.10 Supports de stockage<br>A.8.1 Terminaux finaux des utilisateurs<br>A.8.24 Utilisation de la cryptographie |
| NIS2 art. 21(2) | art. 21(2)(h) cryptographie et chiffrement |
| CIS Controls v8.1 | 3.6 Encrypt Data on End-User Devices<br>3.11 Encrypt Sensitive Data at Rest |
| NIST CSF 2.0 | PR.DS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 36

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
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

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
