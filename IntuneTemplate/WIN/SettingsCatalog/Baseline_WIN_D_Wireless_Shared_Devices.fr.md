<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Wireless_Shared_Devices.md) · [English](Baseline_WIN_D_Wireless_Shared_Devices.en.md) · **Français**

# [Baseline] - WIN - D - Wireless Shared Devices

Sur les appareils partagés, n'autorise que les réseaux déployés via Intune. Les réseaux Wi-Fi ajoutés par l'utilisateur sont supprimés et aucun ne peut être ajouté.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | ISO/IEC 27001:2022 A.8.20 et A.8.1, NIS2 art. 21(2)(e) — Policy CSP Wifi/AllowManualWiFiConfiguration |
| Fichier | [`Baseline_WIN_D_Wireless_Shared_Devices.json`](Baseline_WIN_D_Wireless_Shared_Devices.json) |

> UNIQUEMENT pour les appareils partagés. Par défaut, Windows transforme un réseau ajouté par un utilisateur en profil pour tous les utilisateurs : chaque autre utilisateur de cet appareil voit ce SSID dans la liste et peut s'y connecter. Lire le mot de passe n'est possible qu'en tant qu'administrateur local, et dans cette baseline cela est limité au compte LAPS (wlapsadmin par défaut) — mais la liste des SSID révèle déjà à elle seule où un collègue s'est trouvé. Les profils par utilisateur existent bien dans Windows (netsh wlan add profile user=current), mais l'interface ne les crée jamais ainsi et aucun paramètre MDM ou Settings Catalog ne l'impose : la GPO correspondante se trouve dans Wireless Network (IEEE 802.11) Policies et est liée au domaine. Ce qui est possible, c'est l'inverse : n'autoriser que les réseaux provenant d'Intune. DEUX PRÉREQUIS. Déployez d'abord un profil Wi-Fi via Intune, sinon l'appareil se retrouve hors ligne après application. Et n'affectez jamais cette policy à des ordinateurs portables : les réseaux domestiques et d'hôtel ne fonctionneraient plus, et le télétravail doit rester possible. Microsoft avertit en outre que les profils existants créés par les utilisateurs sont supprimés lors de l'application — c'est ici l'objectif, mais annoncez-le au préalable.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.1 Terminaux finaux des utilisateurs<br>A.8.20 Sécurité des réseaux |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| NIST CSF 2.0 | PR.IR-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Paramètres — 1

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_wifi_allowmanualwificonfiguration` | 0 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
