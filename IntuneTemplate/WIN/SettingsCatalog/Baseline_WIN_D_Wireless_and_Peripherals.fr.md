<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Wireless_and_Peripherals.md) · [English](Baseline_WIN_D_Wireless_and_Peripherals.en.md) · **Français**

# [Baseline] - WIN - D - Wireless and Peripherals

Rend l'appareil invisible via Bluetooth et ferme Windows Connect Now, afin que les paramètres sans fil ne puissent pas être transférés d'un appareil à l'autre en dehors de la gestion. Les appareils déjà appairés continuent de fonctionner.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | ISO/IEC 27001:2022 A.8.20 et A.7.9, NIS2 art. 21(2)(e) — paramètres issus de l'ensemble Endpoint Security d'IntuneAdmin |
| Fichier | [`Baseline_WIN_D_Wireless_and_Peripherals.json`](Baseline_WIN_D_Wireless_and_Peripherals.json) |

> Windows Connect Now est la voie oubliée : elle permet à un utilisateur de transférer les paramètres sans fil — y compris le mot de passe du réseau — d'un appareil à un autre via WPS ou une clé USB, en dehors de toute gestion. Les deux paramètres ferment cette voie. Quant à la question de savoir qui peut voir les profils Wi-Fi des autres : les profils déployés via Intune ou GPO s'appliquent à tout l'appareil et sont donc visibles pour chaque utilisateur de cet appareil, et quiconque ajoute lui-même un réseau peut en récupérer le mot de passe en clair avec netsh. Tant que le réseau de l'entreprise fonctionne avec un mot de passe partagé (PSK), chaque utilisateur qui s'y est un jour connecté connaît donc ce mot de passe — aucune policy n'y peut rien. La mesure qui résout réellement ce problème est le 802.1X avec certificats, car il n'y a alors plus de secret partagé à lire. Le blocage complet de la configuration Wi-Fi manuelle (AllowManualWiFiConfiguration) est volontairement omis : il rendrait impossible le travail à domicile et à l'hôtel, et le télétravail doit rester possible. Des politiques plus strictes exigent parfois de désactiver tous les profils Bluetooth sauf Serial Port Profile. L'appliquer à la lettre casse les casques, souris et claviers ; cela demande d'abord une décision. Ces quatre paramètres constituent l'étape intermédiaire défendable : l'appareil ne peut plus être découvert ni approché par un inconnu, et les appairages existants continuent de fonctionner. ServicesAllowedList est volontairement omis — il exige des GUID par profil et, sans liste soigneusement établie, désactive plus que prévu.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.7.9 Sécurité des actifs hors des locaux<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 4.8 Uninstall or Disable Unnecessary Services on Enterprise Assets and Software |
| NIST CSF 2.0 | PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 6

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_bluetooth_allowadvertising` | 0 |
| `device_vendor_msft_policy_config_bluetooth_allowdiscoverablemode` | 0 |
| `device_vendor_msft_policy_config_bluetooth_allowprepairing` | 0 |
| `device_vendor_msft_policy_config_bluetooth_allowpromptedproximalconnections` | 0 |
| `device_vendor_msft_policy_config_admx_windowsconnectnow_wcn_enableregistrar` | 0 |
| `device_vendor_msft_policy_config_admx_windowsconnectnow_wcn_disablewcnui_2` | 1 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
