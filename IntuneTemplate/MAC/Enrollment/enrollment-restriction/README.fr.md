[Nederlands](README.md) · [English](README.en.md) · **Français**

# Restriction d'inscription : pas de Mac personnels

Conseil et modèle : ne pas laisser les Mac personnels s'inscrire dans Intune.

Une restriction d'inscription (`deviceEnrollmentPlatformRestrictionConfiguration`) n'est aucun des
cinq types de stratégies CIPP et se trouve sous `deviceManagement/deviceEnrollmentConfigurations`. CIPP,
`check-scope.js`, `export-intunebackup.js` et `Set-BaselineAssignment.ps1` n'en font rien.

| Fichier | Ce que c'est |
|---|---|
| `macos-block-personal.json` | Corps Graph : plateforme macOS autorisée, propriété personnelle bloquée |

## Conseil

**Bloquez les Mac personnels** dès que tous les Mac d'entreprise arrivent via Apple Business (ADE) ou
que leur numéro de série figure dans Intune comme corporate identifier.

Pourquoi :

- La baseline macOS est conçue pour des Mac d'entreprise. Un Mac personnel qui s'inscrit via Company
  Portal se voit imposer le séquestre FileVault, Platform SSO, Restrictions et Defender sur
  un appareil dont l'organisation n'est pas propriétaire — avec une question de confidentialité et de RGPD
  (A.5.34) à laquelle personne n'a répondu.
- Une grande partie de la sécurité de cette baseline ne fonctionne qu'en mode **supervisé** (ADE) : Recovery Lock, les
  paramètres déclaratifs de mise à jour et de gestion du disque, `allowUIConfigurationProfileInstallation`. Un
  Mac inscrit manuellement n'est pas supervisé et en est exclu sans bruit, alors qu'il peut
  bel et bien devenir conforme et donc obtenir l'accès.
- L'utilisateur peut lui-même retirer de la gestion un Mac inscrit manuellement ; pas un Mac ADE avec
  inscription verrouillée (voir `IntuneTemplate/MAC/Enrollment/ade-profile/`).

Par défaut, Intune considère un Mac comme **propriété personnelle**. Il n'est propriété de l'entreprise que
s'il (Microsoft Learn, *Overview of enrollment restrictions*, « Blocking personal Macs ») :

- a été inscrit via Apple Automated Device Enrollment (ADE), ou
- est enregistré avec son numéro de série comme corporate identifier.

Ce qui arrive alors à un Mac personnel : pas d'inscription. L'accès à M365 est régi par
Conditional Access — accès web via Edge avec app-enforced restrictions, ou rien. La baseline de
`CA-policies` en décide ; cette restriction n'y change rien.

**Attention, comme l'indique Microsoft :** « Enrollment restrictions are not security features.
Compromised devices can misrepresent their character. » Ceci empêche une inscription accidentelle ; la
vraie barrière est Conditional Access avec *require compliant device*.

Quand *ne pas* bloquer : si l'organisation gère délibérément des Mac personnels (BYOD avec inscription
complète). Il faut alors un ensemble de stratégies propre et plus léger — la baseline d'entreprise n'est alors
pas la bonne.

## Déploiement

Préparation : ajoutez d'abord les Mac existants qui ne sont *pas* arrivés via ADE, par numéro de série, sous
Devices → Enrollment → Corporate device identifiers. Sinon, un tel Mac ne pourra plus revenir
après un effacement.

1. Intune → Devices → Device onboarding → Enrollment → **Device platform restriction** → macOS →
   Create restriction, ou via Graph :

   ```powershell
   Connect-MgGraph -Scopes DeviceManagementServiceConfig.ReadWrite.All
   $body = Get-Content .\macos-block-personal.json -Raw
   $r = Invoke-MgGraphRequest -Method POST `
       -Uri "https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations" `
       -Body $body -ContentType "application/json"
   ```

2. Affecter à un **groupe d'utilisateurs** (les restrictions d'inscription s'appliquent à l'utilisateur qui
   inscrit l'appareil) :

   ```powershell
   $assign = @{ enrollmentConfigurationAssignments = @(@{
       target = @{ "@odata.type" = "#microsoft.graph.groupAssignmentTarget"; groupId = "GROEP-ID-INVULLEN" } }) } | ConvertTo-Json -Depth 5
   Invoke-MgGraphRequest -Method POST `
       -Uri "https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations/$($r.id)/assign" `
       -Body $assign -ContentType "application/json"
   ```

   Ou : modifiez la **restriction par défaut** (All users, priorité la plus basse) et définissez-y macOS
   personally owned sur Block — elle s'applique alors à tous sans affectation distincte.

3. Testez avec un compte de test sur un Mac non enregistré : Company Portal doit refuser
   l'inscription.

Limitation indiquée sur la même page Microsoft : l'ADE sans utilisateur (sans affinité utilisateur) reçoit toujours
la restriction **par défaut**, et non une restriction affectée. Les profils ADE de cette baseline
utilisent l'affinité utilisateur, ils ne sont donc pas concernés — et un Mac ADE est de toute façon propriété de l'entreprise.

## Normes

A.5.9 Inventaire des informations et autres actifs associés, A.8.1
Terminaux des utilisateurs ; NIS2 art. 21(2)(i) ; CIS Controls v8.1 1.1 Establish and
Maintain Detailed Enterprise Asset Inventory et 1.2 Address Unauthorized Assets ; NIST CSF 2.0
ID.AM-01.
