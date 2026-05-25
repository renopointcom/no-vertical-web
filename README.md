# No Vertical Web

> Le web n'a pas été créé pour être vu au format vertical.

Un script JavaScript autonome qui affiche un overlay plein écran lorsqu'un site est consulté au format vertical. Aucune dépendance, ~4 Ko, configurable.

Un projet **[CTRL+ALT+R](https://ctrlaltr.org)**.

→ [nvw.ctrlaltr.org](https://nvw.ctrlaltr.org) — page de référence et démo live.

## Usage minimal

Une ligne, avant `</body>` :

```html
<script src="https://nvw.ctrlaltr.org/nvw.js"></script>
```

Sans configuration, le visiteur en vertical voit le manifeste original signé CTRL+ALT+R.

## Usage configuré

```html
<script>
window.NVW_CONFIG = {
  ratioThreshold: 1.0,      // h/w au-dessus duquel on déclenche
  widthThreshold: 768,      // largeur en dessous de laquelle on déclenche
  operator: 'AND',          // 'AND' ou 'OR'
  message: '<h1>Ton message</h1><p>Tourne ton écran.</p>',
  bgColor: '#000000',
  textColor: '#ffffff',
  imageUrl: '',             // URL d'un logo / image optionnel
  customCss: '',            // CSS additionnel
  excludeSelectors: ['.no-nvw']
};
</script>
<script src="https://nvw.ctrlaltr.org/nvw.js"></script>
```

## Production : version versionnée avec SRI

Pour un usage en production, utilise l'URL **jsDelivr versionnée** (immutable) avec une garantie d'intégrité via Subresource Integrity :

```html
<script
  src="https://cdn.jsdelivr.net/gh/renopointcom/no-vertical-web@v1.0.0/nvw.js"
  integrity="sha384-[À_CALCULER]"
  crossorigin="anonymous"></script>
```

| URL | Quand l'utiliser |
|---|---|
| `nvw.ctrlaltr.org/nvw.js` | Suivre toujours la dernière version. Test, démo, prototype. |
| `cdn.jsdelivr.net/gh/.../@v1.0.0/...` | Production. Version figée, SRI possible. |

## Auto-hébergement

Pour un contrôle total de ta chaîne de sécurité, télécharge le fichier et héberge-le toi-même :

```bash
curl -O https://nvw.ctrlaltr.org/nvw.js
```

Puis inclus-le depuis ton propre domaine. Un exemple de configuration Apache se trouve dans [`docs/htaccess.example`](./docs/htaccess.example).

## Écosystème

- **Extension WordPress** : [wordpress.org/plugins/no-vertical-web](https://wordpress.org/plugins/no-vertical-web/) *(en cours de soumission)*
- **Site de référence** : [nvw.ctrlaltr.org](https://nvw.ctrlaltr.org)
- **Projet parent** : [ctrlaltr.org](https://ctrlaltr.org)

## Options de configuration

| Option | Type | Défaut | Description |
|---|---|---|---|
| `ratioThreshold` | number | `1.0` | Seuil de ratio hauteur/largeur. |
| `widthThreshold` | number | `768` | Seuil de largeur en pixels. |
| `operator` | `'AND'`\|`'OR'` | `'AND'` | Combinaison des deux conditions. |
| `message` | HTML string | manifeste CTRL+ALT+R | Contenu HTML de l'overlay. |
| `bgColor` | hex | `'#000000'` | Couleur de fond. |
| `textColor` | hex | `'#ffffff'` | Couleur du texte. |
| `imageUrl` | URL | `''` | Image/logo affiché au-dessus du message. |
| `customCss` | string | `''` | CSS additionnel injecté. |
| `excludeSelectors` | array | `[]` | Sélecteurs CSS où ne pas afficher l'overlay. |

## Compatibilité

Tous navigateurs modernes. Pas de dépendance, pas de polyfill nécessaire.

## Licence

GPL v2 ou ultérieure. Voir [LICENSE](./LICENSE).

## Contribuer

Issues et pull requests bienvenus.

---

*Un projet CTRL+ALT+R. Le raccourci clavier rafraîchit. Le projet propose de rafraîchir le rapport au web.*
