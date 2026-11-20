[Nederlands](README.md) · [English](README.en.md) · **Français**

# Pas de comptes professionnels d'autres organisations sous Windows

| | |
|---|---|
| **Controls** | ISO A.5.15 Contrôle d'accès, A.8.1 Terminaux finaux des utilisateurs, A.8.9 Gestion de la configuration · NIS2 art. 21(2)(i) sécurité des ressources humaines, politiques de contrôle d'accès et gestion des actifs · CIS Controls v8.1 4.1 Establish and Maintain a Secure Configuration Process · NIST CSF 2.0 PR.AA-01, PR.PS-01 |
| **Phase** | 2 (pilote), puis tous les appareils Windows physiques |
| **Source** | IntuneAdmin/IntuneBaselines, *Modern Work Detect and Remediation* (octobre 2026) ; scripts propres |

## Ce que cela empêche

Sur un appareil de l'organisation, un utilisateur peut ajouter un compte professionnel d'**un autre
tenant** sous *Paramètres → Comptes → Accès Professionnel ou Scolaire*. Office fait de même sans le
demander : après une connexion avec un autre compte professionnel, une case cochée *Autoriser mon
organisation à gérer mon appareil* apparaît. L'appareil est alors aussi inscrit dans cet autre tenant
(Entra registered). Conséquences :

- l'autre organisation peut appliquer son accès conditionnel, et parfois sa stratégie MAM ou MDM, à
  cet appareil ;
- des jetons de cet autre tenant se trouvent dans le cache WAM d'un appareil que nous gérons, et nos
  données peuvent atteindre l'autre tenant via les applications connectées avec ce compte ;
- notre appareil apparaît dans l'Entra ID de l'autre tenant — invisible et impossible à nettoyer
  depuis ce tenant.

`BlockAADWorkplaceJoin = 1` (`HKLM\SOFTWARE\Policies\Microsoft\Windows\WorkplaceJoin`) bloque cette
inscription. Le compte professionnel de l'organisation, avec lequel l'appareil est joint à Entra, n'est
pas concerné.

## Pourquoi un script et non un modèle

Le paramètre ne figure pas dans le catalogue de paramètres (`pl4nty/intune-change-tracking` ne
connaît aucune définition `workplacejoin`) ni dans un ADMX intégré. D'où, comme
[`dns-over-https/`](../dns-over-https/README.fr.md), une correction (remediation).

## Points d'attention

- **Les consultants et le personnel partagé** qui travaillent pour une seconde organisation avec un
  compte de *ce* tenant seront concernés. L'accès invité (B2B) avec leur propre compte — basculer
  Teams vers une autre organisation, un site SharePoint partagé — n'utilise pas de second compte
  professionnel et continue de fonctionner. Vérifiez pendant le pilote si quelqu'un utilise un second
  compte professionnel dans les applications de bureau ; cette personne passe au navigateur dans un
  profil distinct, ou reçoit une exception (un groupe d'exclusion sur l'affectation).
- **Les inscriptions existantes restent.** Le script empêche les nouvelles ; les existantes
  apparaissent dans `dsregcmd /status` (section *Work Account*) ou sous *Accès Professionnel ou
  Scolaire*. L'utilisateur ou le service d'assistance les supprime avec *Déconnecter*.
- **Appareils partagés et AVD** : tout aussi utile, mais superflu en multisession si les utilisateurs
  n'ont pas l'application Paramètres. Commencez par les appareils physiques.

## Déploiement

Centre d'administration Intune → **Devices → Scripts and remediations → Create** :

| Champ | Valeur |
|---|---|
| Nom | `[Baseline] - WIN - D - Block Workplace Join` |
| Script de détection | `Detect-BlockWorkplaceJoin.ps1` |
| Script de correction | `Remediate-BlockWorkplaceJoin.ps1` |
| Exécuter avec les informations d'identification de l'utilisateur connecté | Non (SYSTEM) |
| PowerShell 64 bits | Oui |
| Planification | Quotidienne |
| Affectation | groupe pilote, puis tous les appareils Windows physiques |

Annulation : supprimez la valeur `BlockAADWorkplaceJoin`. Un utilisateur peut alors de nouveau ajouter
un compte professionnel d'une autre organisation.
