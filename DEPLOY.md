# Déploiement No Vertical Web · Guide pas-à-pas pour Renaud

Tous les fichiers sont prêts dans ce dossier. Il ne reste qu'à exécuter les commandes ci-dessous depuis Terminal sur ton Mac. Tu peux les copier-coller bloc par bloc, en lisant les notes entre chaque étape.

- **Dossier de travail** : ce dossier même (`-CLAUDE-CTRL-ALT-R/no-vertical-web/`) dans iCloud.
- **Compte / orga GitHub** : `renopointcom`.
- **Dépôt cible** : `renopointcom/no-vertical-web`.
- **Sous-domaine** : `nvw.ctrlaltr.org` (CNAME chez OVH).

## Pré-requis (à vérifier une fois)

```bash
git --version
gh --version
gh auth status
```

Si `gh` n'est pas installé :

```bash
brew install gh
gh auth login
```

Vérifier que tu es bien authentifié sous `renopointcom` (ou que tu en es owner si c'est une orga) :

```bash
gh api user --jq '.login'
# Attendu : "renopointcom" (compte perso)

# Ou, si renopointcom est une orga GitHub :
gh api orgs/renopointcom --jq '.login + " — type: " + .type' 2>/dev/null
```

Si tu es loggué sous un autre compte, fais `gh auth switch` ou relance `gh auth login`.

## 1. Se placer dans le dossier

```bash
cd "$HOME/Library/Mobile Documents/com~apple~CloudDocs/ME2024/-WEB-SITES/_CLAUDE-COWORK/-CLAUDE-CTRL-ALT-R/no-vertical-web"
```

Note iCloud : git fonctionne dans un dossier iCloud, mais évite de pousser/tirer pendant qu'iCloud est en train de synchroniser. Si tu vois des fichiers fantômes `.icloud`, force le téléchargement avec :

```bash
find . -name "*.icloud" -exec brctl download {} \;
```

## 2. Init git, premier commit

```bash
git init -b main
git add .
git commit -m "Initial release v1.0.0"
```

## 3. Créer le dépôt distant et pousser

```bash
gh repo create renopointcom/no-vertical-web \
  --public \
  --description "Le web n'a pas été créé pour être vu au format vertical. Un script et un geste, par CTRL+ALT+R." \
  --homepage "https://nvw.ctrlaltr.org" \
  --source=. \
  --remote=origin \
  --push
```

## 4. Topics GitHub

```bash
gh repo edit renopointcom/no-vertical-web \
  --add-topic javascript,wordpress,responsive,fluxus,manifesto,vanilla-js,no-dependencies,ctrlaltr
```

## 5. Activer GitHub Pages

```bash
gh api --method POST /repos/renopointcom/no-vertical-web/pages \
  -f "source[branch]=main" \
  -f "source[path]=/" \
  || echo "Si échec : Settings > Pages > Source = Deploy from a branch / main / root"
```

Le fichier `CNAME` à la racine sera détecté automatiquement, GitHub configurera `nvw.ctrlaltr.org` comme domaine personnalisé.

## 6. DNS chez OVH (manuel)

Dans la zone DNS de `ctrlaltr.org` (espace client OVH), ajoute :

| Champ | Valeur |
|---|---|
| Type | CNAME |
| Sous-domaine | `nvw` |
| Cible | `renopointcom.github.io.` (avec le point final) |
| TTL | 3600 |

Propagation : 5 min à 1 h. Vérifier :

```bash
dig nvw.ctrlaltr.org CNAME +short
# Attendu : renopointcom.github.io.
```

## 7. Activer Enforce HTTPS

Quand `dig` renvoie bien la cible, attends 10 à 30 min que GitHub provisionne le certificat Let's Encrypt, puis :

```bash
gh api --method PUT /repos/renopointcom/no-vertical-web/pages \
  -F "https_enforced=true" \
  || echo "Si échec : Settings > Pages > cocher 'Enforce HTTPS'"
```

## 8. Créer la release v1.0.0

```bash
git tag -a v1.0.0 -m "v1.0.0 — Initial release"
git push origin v1.0.0

gh release create v1.0.0 \
  --title "v1.0.0 — Initial release" \
  --notes-file CHANGELOG.md \
  nvw.js
```

## 9. Hash SRI (Subresource Integrity)

```bash
SRI=$(shasum -b -a 384 nvw.js | awk '{print $1}' | xxd -r -p | base64)
echo "sha384-$SRI"
```

Hash provisoire (calculé sur le `nvw.js` actuel, tant que tu ne touches pas au fichier) :

```
sha384-NHit4kDE0OhbzczyICDdtsNDyS7Aba3r2ksfvyISGu/h2TS/sXCDDP7gPR+RzWzk
```

Copie la chaîne complète (`sha384-...`) et remplace `[À_CALCULER]` dans :

- `README.md` (section « Production : version versionnée avec SRI »)
- `index.html` (section « Production avec SRI »)

Puis :

```bash
git add README.md index.html
git commit -m "docs: add SRI hash for v1.0.0"
git push origin main
```

## 10. Vérifications finales

```bash
curl -I https://nvw.ctrlaltr.org/
curl -I https://nvw.ctrlaltr.org/nvw.js
curl -I https://cdn.jsdelivr.net/gh/renopointcom/no-vertical-web@v1.0.0/nvw.js
```

Les trois doivent répondre `HTTP/2 200` avec un `content-type` cohérent (`text/html` pour la page, `application/javascript` pour le script).

## Checklist d'acceptation

- [ ] Dépôt public sur `https://github.com/renopointcom/no-vertical-web`
- [ ] Tag `v1.0.0` poussé, release publiée avec `nvw.js` en asset
- [ ] GitHub Pages actif sur `main`
- [ ] `CNAME` présent avec `nvw.ctrlaltr.org`
- [ ] `https://nvw.ctrlaltr.org/` répond 200 + HTTPS
- [ ] `https://nvw.ctrlaltr.org/nvw.js` répond 200 + HTTPS
- [ ] jsDelivr versionné répond 200
- [ ] Enforce HTTPS activé
- [ ] Hash SRI reporté dans README et index.html
- [ ] Topics renseignés

---

*Si une commande échoue, copie-colle l'erreur dans Cowork, on débogue ensemble.*
