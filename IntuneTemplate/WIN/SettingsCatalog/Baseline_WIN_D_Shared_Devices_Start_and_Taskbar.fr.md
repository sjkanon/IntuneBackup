<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.md) · [English](Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.en.md) · **Français**

# [Baseline] - WIN - D - Shared Devices Start and Taskbar

Épingle Microsoft Edge et Windows App dans la barre des tâches et dans Démarrer sur les appareils partagés, afin que chaque utilisateur trouve tout de suite le navigateur et le poste de travail distant à sa première connexion.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | — |
| Source | Baseline propre — Policy CSP Start/ConfigureStartPins (disposition de Démarrer de Windows 11) et Start/StartLayout avec une CustomTaskbarLayoutCollection (barre des tâches), Microsoft Learn : Customize the Start layout et Customize the Taskbar on Windows 11. |
| Fichier | [`Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.json`](Baseline_WIN_D_Shared_Devices_Start_and_Taskbar.json) |

> À affecter à SG-D-UEM-WIN-Shared. La barre des tâches reçoit Edge et Windows App après les icônes par défaut de Windows ; cela se fait à la première connexion d'un profil, c'est-à-dire pour chaque nouvel utilisateur sur un PC partagé. Démarrer reçoit Edge, Windows App, l'Explorateur et les Paramètres ; cela remplace toute la liste des applications épinglées et les utilisateurs ne peuvent pas la modifier. Windows App doit être installée : déployez-la comme application du Store (9N1F85V9T8BN) via CIPP ou Intune, sinon l'emplacement reste vide. Un raccourci sur le bureau ne se règle pas par stratégie : Edge en crée un lui-même, Windows App demande un script. Windows 11 uniquement. Vérifiez l'ID d'application de Windows App (MicrosoftCorporationII.Windows365_8wekyb3d8bbwe!Windows365) sur un appareil avec Get-StartApps.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.9 Gestion de la configuration |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| CIS Controls v8.1 | 4.1 Establish and Maintain a Secure Configuration Process |
| NIST CSF 2.0 | PR.PS-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 2

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_policy_config_start_configurestartpins` | {"pinnedList":[{"desktopAppLink":"%ALLUSERSPROFILE%\\Microsoft\\Windows\\Start Menu\\Programs\\Microsoft Ed… |
| `device_vendor_msft_policy_config_start_startlayout` | <?xml version="1.0" encoding="utf-8"?>
<LayoutModificationTemplate xmlns="http://schemas.microsoft.com/Star… |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
