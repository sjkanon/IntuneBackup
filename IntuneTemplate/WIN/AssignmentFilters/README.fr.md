[Nederlands](README.md) · [English](README.en.md) · **Français**

# Filtres d'affectation pour Windows

Un corps `deviceAndAppManagementAssignmentFilter`. Un filtre affine une affectation à un
groupe : *tous les appareils, mais pas les hôtes de session AVD*. Ici, il fait la distinction entre
les appareils physiques et les hôtes de session Azure Virtual Desktop sous Windows 11 Enterprise
multisession.

| Fichier | Règle | Utilisation |
|---|---|---|
| `WIN-AVD-Multi-Session.json` | `device.operatingSystemSKU -eq "ServerRdsh"` | **inclusion** sur les quatre stratégies AVD (`[Baseline] - WIN - D - AVD …`) ; **exclusion** sur les stratégies qui n'ont pas leur place sur AVD |

`ServerRdsh` est la SKU de Windows Enterprise multisession. Testé dans le tenant de test : le filtre
correspond exactement à l'hôte de session AVD et à aucun PC physique. Les Cloud PC Windows 365 tournent sous
Windows Enterprise (mono-session) et n'en relèvent donc pas.

Quelle stratégie reçoit une inclusion, une exclusion ou ni l'une ni l'autre figure par stratégie dans
[docs/AVD.fr.md](../../../docs/AVD.fr.md). Le filtre fonctionne aussi sur les affectations ciblant les utilisateurs,
comme `[Baseline] - WIN - U - Windows Hello for Business` : Intune évalue le filtre sur
l'appareil auquel l'utilisateur se connecte. Exclure un groupe d'appareils n'y fait rien, car
l'affectation va aux utilisateurs.

Les filtres avec `platform: windows10AndLater` ne peuvent être sélectionnés que sur des stratégies Windows.

## Déploiement

```http
POST https://graph.microsoft.com/beta/deviceManagement/assignmentFilters
Content-Type: application/json

<contenu du fichier>
```

Ou dans le portail : Administration du locataire → Filtres → Créer → Appareils gérés → Windows 10 et ultérieur, et
collez la règle du tableau. Un filtre ne fait rien tant qu'il n'est pas sélectionné sur une affectation.
