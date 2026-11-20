<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Shared_Device_Name.md) · [English](Baseline_WIN_D_Shared_Device_Name.en.md) · **Français**

# [Baseline] - WIN - D - Shared Device Name

Donne aux appareils Windows partagés un nom reconnaissable : l'abréviation du client, SHR et le numéro de série, par exemple BC-SHR-7HQ2KX3. S'applique après le prochain redémarrage.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| Source | Baseline propre — Accounts CSP, Domain/ComputerName = %CustomerShort%-SHR-%SERIAL%. %CustomerShort% est une variable CIPP par client ; Windows remplit %SERIAL%. |
| Fichier | [`Baseline_WIN_D_Shared_Device_Name.json`](Baseline_WIN_D_Shared_Device_Name.json) |

> À placer sur SG-D-UEM-WIN-Shared. Définissez d'abord la variable CIPP CustomerShort pour le client (3 caractères au maximum, lettres et chiffres uniquement) : sans elle, l'appareil reçoit littéralement %CustomerShort% dans son nom et Windows le refuse. Windows limite le nom à 15 caractères (NetBIOS) en coupant le numéro de série par le début : BC-SHR- laisse 8 caractères du numéro de série, ABC-SHR- 7. Le nouveau nom ne s'applique qu'après un redémarrage ; Intune ne redémarre pas l'appareil lui-même. Pas pour les appareils joints en hybride (l'Accounts CSP ne les prend pas en charge). Choisir un autre nom plus tard renomme à nouveau chaque appareil partagé au prochain redémarrage.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.9 Inventaire des informations et autres actifs associés |
| NIS2 art. 21(2) | art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs |
| NIST CSF 2.0 | ID.AM-01 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Propriétés — 7

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `omaSettings[0].@odata.type` | #microsoft.graph.omaSettingString |
| `omaSettings[0].displayName` | Computer name |
| `omaSettings[0].description` | %CustomerShort% is a CIPP custom variable (max. 3 letters); %SERIAL% is expanded by Windows and cut from th… |
| `omaSettings[0].omaUri` | ./Device/Vendor/MSFT/Accounts/Domain/ComputerName |
| `omaSettings[0].isEncrypted` | false |
| `omaSettings[0].value` | %CustomerShort%-SHR-%SERIAL% |
| `omaSettings[0].isReadOnly` | false |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
