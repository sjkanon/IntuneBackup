[Nederlands](README.md) · [English](README.en.md) · **Français**

# extras/macos/escrow-buddy/

Faire tout de même arriver la clé de récupération FileVault dans Intune pour un Mac qui était déjà chiffré.

Se trouve en dehors de `IntuneTemplate/` pour la même raison que [`shellscripts/macos/`](../../../shellscripts/macos/README.fr.md) :
un script shell (`deviceShellScripts`) n'est aucun des cinq types de stratégies CIPP. Non pris en compte
par `generate-baseline.js`, `export-intunebackup.js`, `check-scope.js` ou
`Set-BaselineAssignment.ps1`, et ne reçoit pas de `checkId`. Sa place est dans
`shellscripts/macos/` lors de la fusion.

| Fichier | Ce qu'il fait | Portée |
|---|---|---|
| `escrow-buddy.sh` | installe Escrow Buddy (version figée, signature vérifiée) et demande une seule fois une nouvelle clé de récupération | Appareil |

## La faille

[`MAC - D - FileVault`](../../../IntuneTemplate/MAC/SettingsCatalog/Baseline_MAC_D_FileVault.fr.md)
conserve la clé de récupération dans Intune, mais macOS ne place sous séquestre qu'une clé qui est
**créée** alors que le profil de séquestre (`com.apple.security.FDERecoveryKeyEscrow`) est présent sur le Mac.
Trois situations passent donc entre les mailles :

- l'utilisateur avait déjà activé FileVault lui-même avant l'inscription du Mac ;
- un Mac a été inscrit via Company Portal alors qu'il était déjà chiffré ;
- le profil n'est arrivé qu'après que Setup Assistant a déjà chiffré le disque.

Intune n'affiche alors aucune clé de récupération pour l'appareil, et la rotation de la stratégie FileVault
(`recoverykeyrotationinmonths`) ne fonctionne que sur une clé qu'Intune connaît déjà. Un mot de passe
oublié signifie dans ce cas un disque perdu.

## Fonctionnement

[Escrow Buddy](https://github.com/macadmins/escrow-buddy) (Apache 2.0, Mac Admins Open Source,
à l'origine Netflix) est un authorization plugin. Le package place le mécanisme
`Escrow Buddy:Invoke,privileged` dans `system.login.console`, juste avant `loginwindow:done`. Si
`GenerateNewKey` dans `/Library/Preferences/com.netflix.Escrow-Buddy.plist` vaut true, le
plugin crée, lors de la connexion suivante d'un utilisateur FileVault et avec le mot de passe saisi,
une nouvelle clé de récupération personnelle. macOS l'envoie à Intune via le profil de séquestre.
L'utilisateur ne remarque rien ; aucune boîte de dialogue n'apparaît.

Le script :

1. s'arrête si FileVault est désactivé (la stratégie FileVault gère alors le chiffrement et le séquestre) ;
2. s'arrête s'il a déjà demandé une clé auparavant (marqueur dans
   `/Library/Application Support/Baseline/escrow-buddy-requested`) ;
3. attend si le profil de séquestre n'est pas encore présent — une nouvelle clé sans séquestre aggrave
   la situation, car l'ancienne clé personnelle disparaît alors aussi ;
4. télécharge Escrow Buddy **1.0.0** depuis la release GitHub et n'installe que si le package
   est notarié par Apple (`spctl --assess --type install`) et signé avec
   *Developer ID Installer* de l'équipe **T4SK8ZXCXG** (Mac Admins Open Source — l'identité issue de
   `.github/workflows/build_main.yml` du projet). Un autre signataire : ne pas
   installer, signature dans le journal ;
5. vérifie que le mécanisme figure réellement dans l'authorization database ;
6. définit `GenerateNewKey`.

Journal : `/Library/Logs/Baseline/escrow-buddy.log`.

Il n'y a aucun mal à ce que le script s'exécute aussi sur un Mac dont Intune possédait déjà la clé :
la clé est alors remplacée une fois et remise sous séquestre, exactement ce que fait aussi la rotation de la
stratégie FileVault. C'est pourquoi on ne tente pas de deviner depuis le Mac si Intune possède une
clé — le Mac ne peut pas le voir.

## Paramètres dans Intune

Devices → macOS → Shell scripts → Add.

| Paramètre | Valeur | Pourquoi |
|---|---|---|
| Run script as signed-in user | **No** | installer et modifier `authorizationdb` requiert root |
| Hide script notifications | Yes | |
| Script frequency | **Every 1 day** | le script attend le profil de séquestre ; après le marqueur, il ne fait plus rien |
| Max number of retries | 3 | |

Affecter au même **groupe d'appareils** que `MAC - D - FileVault`, et seulement une fois cette stratégie présente sur le
Mac. Phase : identique à FileVault (pilote d'abord).

## Vérification

- Sur le Mac, après connexion : `sudo profiles show -type configuration | grep -i escrow` affiche le
  profil, et le journal se termine par « GenerateNewKey set ». Après la connexion suivante,
  `GenerateNewKey` repasse à false (`defaults read /Library/Preferences/com.netflix.Escrow-Buddy.plist`).
- Dans Intune : Devices → l'appareil → **Recovery keys** affiche une clé.

## Nouvelle version

Mettre à jour `EB_VERSION` et, avant le déploiement, vérifier sur un Mac que
`pkgutil --check-signature` affiche toujours `Developer ID Installer: Mac Admins Open Source (T4SK8ZXCXG)`.
Si le signataire change, le script s'arrête volontairement — ne modifiez `EB_TEAM_ID` qu'après
vérification auprès du projet.

**Point ouvert :** la release 1.0.0 date de juin 2023 ; la signature de cette release n'a pas été
vérifiée sur un Mac depuis ce poste de travail. Le script échoue de façon sûre si le team id ne correspond pas ;
vérifiez-le dans le journal sur le premier Mac pilote.

## Suppression

```bash
sudo "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle/Contents/Resources/AuthDBTeardown.sh"
sudo rm -rf "/Library/Security/SecurityAgentPlugins/Escrow Buddy.bundle"
sudo pkgutil --forget com.netflix.Escrow-Buddy
```

C'est aussi ce que fait `scripts/uninstall.sh` du projet. Ne laissez pas le plugin sur un Mac
qui sort de la gestion : un mécanisme dans `system.login.console` dont le bundle est absent
bloque la connexion.

## Fins de ligne

LF, comme tous les `*.sh` de ce dépôt (`.gitattributes`).
