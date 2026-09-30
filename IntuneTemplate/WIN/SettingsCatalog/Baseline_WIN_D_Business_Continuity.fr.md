<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_WIN_D_Business_Continuity.md) · [English](Baseline_WIN_D_Business_Continuity.en.md) · **Français**

# [Baseline] - WIN - D - Business Continuity

Active Quick Machine Recovery : un appareil qui ne démarre plus récupère lui-même un paquet de récupération depuis le cloud au lieu d'attendre un technicien.

| | |
|---|---|
| Platform | Windows |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Settings Catalog |
| Affectation | All Devices |
| Source | ISO/IEC 27001:2022 A.5.29, A.5.30 et A.8.14, NIS2 art. 21(2)(c) — paramètres issus de l'ensemble Modern Workplace d'IntuneAdmin |
| Fichier | [`Baseline_WIN_D_Business_Continuity.json`](Baseline_WIN_D_Business_Continuity.json) |

> La politique de continuité a rarement une mesure technique sur le poste de travail lui-même. Celle-ci est la moins coûteuse qui soit. Les informations Wi-Fi du profil source sont volontairement omises : elles sont propres au tenant et n'ont pas leur place dans une baseline partagée. Sans ces informations, la récupération fonctionne via une connexion filaire ; si votre flotte n'a pas d'Ethernet, ajoutez-les avant le déploiement.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.5.29 Sécurité de l'information durant une perturbation<br>A.5.30 Préparation des TIC pour la continuité d'activité |
| NIS2 art. 21(2) | art. 21(2)(c) continuité des activités et gestion des crises |
| NIST CSF 2.0 | PR.IR-03<br>RC.RP-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../docs/COMPLIANCE.fr.md).

## Paramètres — 4

Les lignes en retrait sont des paramètres enfants : ils ne s'appliquent que si le
paramètre parent a la valeur indiquée.

| Paramètre | Valeur |
|---|---|
| `device_vendor_msft_remoteremediation_cloudremediationsettings_enablecloudremediation` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_enableautoremediation` | true |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_setretryinterval` | 30 |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`device_vendor_msft_remoteremediation_cloudremediationsettings_autoremediationsettings_settimetoreboot` | 180 |

---

Retour à la [vue d'ensemble Windows](../README.fr.md) · [README principal](../../../README.fr.md)
