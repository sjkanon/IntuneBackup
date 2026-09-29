[Nederlands](README.md) · [English](README.en.md) · **Français**

# macOS Shell Scripts

**Généré** à partir de `shellscripts/` — ne pas modifier à la main.

`Start-IntuneRestoreConfig` ignore ce dossier : `deviceShellScripts` n'a pas de fonction
de restauration dans le module ni de `TemplateType` dans CIPP. Ces scripts voyagent ici
parce qu'ils seraient sinon oubliés lors d'une reconstruction.

La création se fait à la main : **Devices → macOS → Shell scripts → Add**. Les paramètres
de chaque script (exécution en tant qu'utilisateur connecté, fréquence, affectation) figurent dans
`shellscripts/macos/README.fr.md` dans le dépôt — ces valeurs ne sont pas un détail : un script
de Dock exécuté en root écrit dans le mauvais Dock et l'utilisateur ne voit rien.
