[Nederlands](README.md) · [English](README.en.md) · **Français**

# Restrictions d'inscription Android

Une restriction d'inscription décide *avant* l'inscription si un appareil peut être inscrit ou non.
Les stratégies de conformité de `IntuneTemplate/AND/` décident ensuite si l'appareil est suffisamment sûr.
Deux décisions sont traitées ici.

## 1. Autoriser Android Enterprise, y compris personnel — `AND-Allow-Android-Enterprise.json`

`platformType: androidForWork` couvre toutes les formes d'Android Enterprise : profil professionnel personnel,
corporate-owned work profile, fully managed et dedicated. `personalDeviceEnrollmentBlocked:
false` autorise le profil professionnel personnel — sinon, un employé disposant de son propre téléphone ne peut
travailler que via App Protection sans inscription, et les stratégies de profil professionnel
(Work Profile Restrictions, Compliance Device Health/Password) ne s'appliquent alors jamais.

Bloquer l'inscription personnelle ne concerne que le profil professionnel personnel ; les inscriptions
corporate (code QR, zero-touch, Knox Mobile Enrollment) contournent cette restriction.

Pas de version minimale de l'OS dans la restriction : elle figure dans les stratégies de conformité, où l'utilisateur reçoit une
notification au lieu d'une inscription échouée sans explication.

## 2. Bloquer device administrator — dans le portail

Device administrator a été abandonné par Google et Intune ne le prend plus en charge depuis le 31 décembre
2024 sur les appareils dotés de Google Mobile Services. Aucune stratégie Android de la
baseline ne fonctionne sur un tel appareil. Fermez-le :

**Intune → Appareils → Inscription → Restrictions de plateforme d'appareil → Android** → la
restriction par défaut (*All users*) → *Android device administrator* : **Plateforme : Bloquer**.

Il n'y a délibérément **pas de JSON** pour cela ici. La valeur Graph correspondante (`platformType: "android"` sur
le même type) n'a pas pu être vérifiée lors de cette itération par rapport à un export source ou aux
définitions pl4nty, et la restriction par défaut existe déjà dans chaque tenant (on la met à jour avec
PATCH, pas avec un nouveau POST). Les appareils déjà inscrits avec device administrator
sont interceptés par `CXNM - Standard - AND - U - Compliance Block Device Administrator`.

## Déploiement

```http
POST https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations
Content-Type: application/json

<contenu de AND-Allow-Android-Enterprise.json>
```

Ensuite, affectez-la — une restriction personnalisée sans affectation ne fait rien :

```http
POST https://graph.microsoft.com/beta/deviceManagement/deviceEnrollmentConfigurations/{id}/assign
Content-Type: application/json

{ "enrollmentConfigurationAssignments": [ { "target": {
    "@odata.type": "#microsoft.graph.groupAssignmentTarget",
    "groupId": "GEBRUIKERSGROEP-ID-INVULLEN" } } ] }
```

Ou dans le portail : au même endroit que ci-dessus → *Créer une restriction* → Android Enterprise.

Attention : `priority` n'est pas toujours reprise lors de l'import. Après la création, vérifiez que
cette restriction se trouve *au-dessus* de la restriction par défaut (numéro plus bas = priorité plus haute), sinon la
restriction par défaut l'emporte.
