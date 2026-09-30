[Nederlands](PLAN.md) · [English](PLAN.en.md) · **Français**

# Plan : de 24 stratégies maison à une baseline fondée sur OpenIntuneBaseline

Objectif : étendre la baseline et la maintenir à jour sur la base
d'[OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline), avec une
séparation explicite par plateforme et appareil/utilisateur — et avec une couche tenant distincte (ScubaGear / Maester) pour finir.

Statut : **les phases 1, 2, 4, 5, 6 et 7 sont réalisées** (dépôt). La phase 3 (le tenant) et la
phase 8 restent ouvertes. Le tenant n'a pas encore été touché.

| Phase | Quoi | Risque | Statut |
|---|---|---|---|
| 1 | Modifications de scripts (`check-scope.js`, `-Scope`, contrôle strict des affectations) | faible | ✅ |
| 2 | Renommage D/U + 2 scissions dans `IntuneTemplate/` | faible dans le dépôt | ✅ |
| 4 | Stratégies de conformité (travail sur le pipeline + 7 stratégies) | moyen | ✅ |
| 5 | Combler les lacunes de durcissement à partir d'OIB | moyen | ✅ |
| 6 | Anneaux de mise à jour | faible | ✅ |
| 7 | Scinder les Administrative Templates par thème | moyen | ✅ |
| — | macOS, BYOD et l'axe plateforme dans le nommage | moyen | ✅ |
| 3 | **Migration du tenant** via `Rename-BaselinePolicy.ps1` | **élevé** — d'abord `-WhatIf`, d'abord dans un tenant pilote | ouvert |
| 8 | Couche tenant ScubaGear/Maester | chantier séparé | ouvert |

La phase 3 vient volontairement après le reste : le dépôt est maintenant complet et le tenant peut
être mis à niveau en une seule fois, au lieu d'être renommé deux fois de suite.

---

## Ce qui a été fait dans le dépôt

24 → 95 stratégies. La source est désormais `IntuneTemplate/_manifest.json` plus
`scripts/import-oib.js` ; voir [README.fr.md](../README.fr.md) pour l'organisation, le nommage et la
façon d'intégrer une nouvelle version d'OIB.

**Phases 1 et 2** (auparavant) : séparation appareil/utilisateur, renommage en `[Baseline] - D/U - Item`,
`check-scope.js` comme étape bloquante de la CI.

**Phase 4 — conformité.** Il n'y en avait aucune. Sans stratégie de conformité, « exiger un appareil
conforme » dans Conditional Access n'a aucun sens. Il y en a désormais 7 (4 Windows, 3 macOS), avec un
nouveau `Type` CIPP `deviceCompliancePolicies` et le dossier `Device Compliance Policies` dans
l'export.

**Phase 5 — durcissement.** L'ensemble Windows d'OIB a été repris en entier : Windows Hello for Business,
Cloud Kerberos Trust, Credential/Device Guard, Local Administrators, Office Security (D et U),
la scission d'Edge, Disable NTLM, Administrator Protection, Config Refresh, In-Box App
Removal, Delivery Optimisation, Personal Data Encryption, Windows Sandbox, WSL, Package
Manager, Script File Associations, Timezone et d'autres. 15 stratégies existantes ont été réécrites
sur le contenu d'OIB ; les paramètres qu'OIB ne connaît pas ont été conservés (voir le point 2 du
README sous « Mettre à jour OpenIntuneBaseline »).

**Phase 6 — anneaux de mise à jour.** Ring 1 (Pilot) et Ring 2 (UAT) ajoutés à côté du Ring 3
existant, plus les trois anneaux de mise à jour de l'antivirus Defender. Ring 1 et 2 sont
volontairement sans affectation. Les Driver update profiles restent hors périmètre :
IntuneBackupAndRestore 4.0.1 ne les prend pas en charge.

**Phase 7 — Administrative Templates scindés.** Le bloc de 300 paramètres a été réparti entre
Internet Explorer Legacy (204), Security Hardening (41), Printing (13), Remote Desktop and
RPC (9) et quelques plus petits. Les 15 paramètres sans équivalent OIB se trouvent dans
`WIN - D - Legacy Hardening`, tenus à part pour qu'une mise à niveau d'OIB ne les entraîne ni ne
les supprime.

**Axe plateforme.** Toutes les stratégies s'appellent désormais `[Baseline] - <WIN|MAC|IOS|AND> - <D|U> - <Item>`
et se trouvent dans `IntuneTemplate/<PLATFORM>/<POLICYTYPE>/`. macOS (20 stratégies) et la protection
d'applications BYOD pour iOS et Android (2) sont nouveaux.

---

## Phase 3 — Migration du tenant

C'est la partie risquée. Les stratégies existent déjà dans le tenant sous leur ancien nom, et
certaines ont été remplacées sur le fond.

`IntuneTemplate/_renames.json` consigne pour chaque stratégie son ancien nom (à la fois le nom
d'origine et l'étape intermédiaire de la phase 2) et ce qui lui correspond aujourd'hui.
`scripts/Rename-BaselinePolicy.ps1` l'exécute avec un `PATCH` : le nom change, l'id reste, toutes
les affectations existantes et l'historique d'affectation restent intacts.

**Ne pas redéployer.** `Start-IntuneRestoreConfig` crée les stratégies par nom. Sous un
nouveau nom, cela produit des **doublons** à côté des anciennes — deux stratégies aux paramètres
qui se chevauchent, voire se contredisent, sur les mêmes appareils. À ne faire que dans un tenant vide.

Ordre :

1. **Faire l'inventaire** avec `Get-BaselinePolicyState.ps1` (voir ci-dessous) — avant de modifier quoi que ce soit.
2. `Rename-BaselinePolicy.ps1 -WhatIf` → vérifier que chaque ancien nom est trouvé exactement
   une fois.
3. Renommer.
4. Les cas `replace` à la main : `Windows Firewall` (Settings Catalog → template Endpoint
   Security) et `Microsoft Office Updates` (ADMX → Settings Catalog). L'ancienne supprimée, la
   nouvelle ajoutée, dans cet ordre.
5. Supprimer les cas `retire` : Network Security, Windows Search, System Services,
   OneDrive KFM. `replacedBy` dans `_renames.json` indique où se trouvent désormais leurs paramètres.
6. Déployer les ~65 nouvelles stratégies via CIPP ou `Start-IntuneRestoreConfig`.
7. `Set-BaselineAssignment.ps1 -Scope D -AllDevices` et `-Scope U -AllUsers`, d'abord avec
   `-WhatIf`. Pour les stratégies existantes, il doit signaler « already assigned ».
8. Appeler `Invoke-IntuneRestoreAppProtectionPolicyAssignment` séparément (voir README).
9. **Refaire l'inventaire** — la liste des stratégies orphelines doit être vide.

Le pilote (phase 2) n'est pas inclus dans l'étape 7 : `-AllDevices` et `-AllUsers` ne prennent que
ce qui est en phase 1. Il suit séparément avec `-GroupName 'SEC-Baseline-Pilot'` — la liste se
trouve dans [OVERZICHT.fr.md](OVERZICHT.fr.md#dabord-en-pilote).

### Et s'il reste des stratégies avec l'ancien nom dans le tenant

Ce scénario n'est pas théorique : un renommage qui s'arrête à mi-chemin, une stratégie que quelqu'un
a renommée à la main auparavant, un second tenant où CIPP déployait encore sous l'ancien nom. Deux
façons dont cela tourne mal :

**1. Paramètres en conflit.** Deux stratégies Settings Catalog qui définissent le même
`settingDefinitionId` avec une valeur différente produisent un *Conflict* — le paramètre n'est alors
appliqué par aucune des deux. Avec 95 stratégies, ce risque est plus grand qu'avec 24 ;
`check-scope.js` le vérifie désormais au sein du dépôt, mais pas ce qui reste dans le tenant.

**2. Dérive silencieuse des affectations.** `Set-BaselineAssignment.ps1 -Scope D` filtre sur le nom.
Une stratégie qui ne suit pas la convention échappe à tous les filtres et conserve donc tout
simplement son ancienne affectation All Devices. Le script avertit à ce sujet — n'ignorez pas cet
avertissement.

### Reste à construire: `scripts/Get-BaselinePolicyState.ps1`

Pendant côté tenant de `check-scope.js`. Lit l'ensemble des cinq types de stratégies et signale :

| Constat | Signification |
|---|---|
| stratégie dans `IntuneTemplate/` mais pas dans le tenant | pas encore déployée |
| stratégie dans le tenant sous un nom issu de `_renames.json` | orpheline — renommer ou supprimer |
| un nom apparaît plus d'une fois | doublon |
| stratégie `- D -` avec une cible utilisateur (ou inversement) | périmètre et affectation divergent |
| stratégie sans aucune affectation | n'est déployée nulle part |
| le même `settingDefinitionId` avec une valeur différente dans deux stratégies affectées | conflit |

À exécuter avant et après la phase 3, puis périodiquement. En lecture seule, pas besoin de `-WhatIf`.

---

## Phase 8 — Couche tenant : ScubaGear et Maester

À ne pas confondre avec ce qui précède : **ScubaGear n'examine pas les stratégies d'appareils Intune.**
Il évalue la configuration du tenant pour Entra ID, Exchange Online, Defender, SharePoint/OneDrive,
Teams et Power Platform. Maester regroupe EIDSCA, CISA SCuBA, CIS Microsoft 365 Foundations et
ORCA, et dispose en outre d'une poignée de contrôles Intune (LAPS, ASR, App Control for Business,
Managed Installer).

Approche : d'abord exécuter ScubaGear pour un état initial, puis mettre en place Maester comme
contrôle continu.

Les quatre contrôles Intune de Maester recoupent ce dépôt. Ils constituent le lien naturel
entre les deux couches — commencez par là.

---

## Ce que nous ne faisons volontairement pas

- **AppLocker / WDAC / App Control for Business** — OIB l'exclut explicitement en raison de sa
  dépendance à l'environnement, et à juste titre : c'est un projet, pas une stratégie. Notez que
  Maester le teste bel et bien (phase 8) — ce contrôle sera rouge ; c'est un choix délibéré qui doit
  être consigné comme exception, et non comme constat ouvert.
- **Driver update profiles** — IntuneBackupAndRestore 4.0.1 ne les prend pas en charge. Via CIPP ce
  serait possible, mais les deux voies de restauration divergeraient alors.
- **Windows 365** — OIB a des stratégies pour cela ; les Cloud PC relèvent d'un ensemble à part.
- Les écarts par rapport à CIS qu'OIB justifie (Administrator intégré activé pour LAPS,
  comportement des invites UAC pour le helpdesk) — repris avec leur justification, voir
  `OIBvsCIS-Rationale.csv` dans OIB.

---

## Sources

- [OpenIntuneBaseline](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline) — [WINDOWS](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/WINDOWS), [MACOS](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/MACOS), [BYOD](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/tree/main/BYOD)
- [OIBvsCIS-Rationale.csv](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/blob/main/WINDOWS/OIBvsCIS-Rationale.csv)
- [FAQ OIB — pourquoi D et U dans le nom](https://github.com/SkipToTheEndpoint/OpenIntuneBaseline/blob/main/FAQ.md#why-do-policies-have-d-and-u-in-their-name)
- [cisagov/ScubaGear](https://github.com/cisagov/ScubaGear)
- [Maester — tests CISA](https://maester.dev/docs/tests/cisa/) · [tests de benchmark CIS](https://maester.dev/docs/tests/cis/)
