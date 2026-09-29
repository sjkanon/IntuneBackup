<!-- Généré par scripts/generate-docs.js — ne pas modifier à la main. -->

[Nederlands](Baseline_AND_D_System_Updates.md) · [English](Baseline_AND_D_System_Updates.en.md) · **Français**

# [Baseline] - AND - D - System Updates

Installe automatiquement les mises à jour système Android sur les appareils de l'organisation dans une fenêtre de maintenance entre 00:00 et 06:00.

| | |
|---|---|
| Platform | Android |
| Scope | Device (D) — affecter à des groupes d'appareils |
| Type | Device config |
| Affectation | — |
| checkId | aucun — le moteur de la plateforme n'a pas de correspondance pour ce type de policy |
| Source | UniFy Android Enterprise Baseline v1.5.1 — AND - DC - DR - DEV - Additional-Settings - Fully-Managed - v1.5, uniquement les trois champs systemUpdate |
| Fichier | [`Baseline_AND_D_System_Updates.json`](Baseline_AND_D_System_Updates.json) |

> Uniquement les champs systemUpdate de `androidDeviceOwnerGeneralDeviceConfiguration` ; le Settings Catalog ne connaît aucun paramètre de mise à jour système. Un appareil éteint la nuit ou qui ne peut pas terminer une mise à jour dans la fenêtre ne l'installe qu'à une occasion ultérieure (UniFy W-15) — c'est pourquoi la conformité vérifie la date du correctif. Pas de `systemUpdateFreezePeriods` : une période de gel (par ex. autour d'une clôture annuelle) relève du choix du client. Appareils dédiés utilisés 24 h/24 : choisissez une autre fenêtre dans votre propre copie, pas dans cette policy. Aucun autre champ de ce type n'est défini, donc aucun chevauchement avec une éventuelle policy kiosque ou Additional Settings — à condition que celle-ci laisse vides les champs systemUpdate.

## Normes

| Référentiel | Mesures |
|---|---|
| ISO/IEC 27001:2022 | A.8.8 Gestion des vulnérabilités techniques |
| NIS2 art. 21(2) | art. 21(2)(e) sécurité de l'acquisition, du développement et de la maintenance des réseaux et des systèmes d'information, y compris le traitement des vulnérabilités |
| CIS Controls v8.1 | 7.3 Perform Automated Operating System Patch Management |
| NIST CSF 2.0 | PR.PS-02 |

Ce que cela signifie pour chaque norme et ce qui reste nécessaire sur le plan organisationnel : [COMPLIANCE.fr.md](../../../COMPLIANCE.fr.md).

## Propriétés — 3

Une configuration d'appareil classique n'a pas de settingDefinitionId mais des propriétés fixes.

| Propriété | Valeur |
|---|---|
| `systemUpdateInstallType` | windowed |
| `systemUpdateWindowStartMinutesAfterMidnight` | 0 |
| `systemUpdateWindowEndMinutesAfterMidnight` | 360 |

---

Retour à la [vue d'ensemble Android](../README.fr.md) · [README principal](../../../README.fr.md)
