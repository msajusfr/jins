# Jin's

Web app React pour consulter les Jìn des arts martiaux chinois, lire les chapitres associés et écouter leur prononciation via le navigateur.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Web Speech API du navigateur pour l'audio

## Source des contenus

La source éditable est dans `content/`.

```txt
content/
  book/
    introduction.fr.md
    introduction.en.md
    introduction.zh.md
  jins/
    mo-pan-jin/
      meta.json
      chapter.fr.md
      chapter.en.md
      chapter.zh.md
```

Pour modifier un Jìn, éditer uniquement son dossier dans `content/jins/<id>/`.

- `meta.json` contient le nom chinois, le pinyin, la famille, les sections courtes, l'audio et l'image.
- `chapter.fr.md`, `chapter.en.md`, `chapter.zh.md` contiennent le chapitre détaillé affiché par l'icône livre.
- Les images servies par l'app restent dans `public/images/jins/`.

Les fichiers TypeScript dans `src/data/generated/` sont générés. Ne pas les modifier à la main.

## Génération

Après une modification dans `content/`, régénérer les données React :

```bash
npm run content:build
```

La commande vérifie aussi que les 53 Jìn ont un chapitre français et une entrée cohérente.

## Installation locale

```bash
npm install
npm run dev
```

## Build

```bash
npm run content:build
npm run build
npm run preview
```

## Déploiement Vercel

1. Push le projet sur GitHub.
2. Importer le dépôt dans Vercel.
3. Garder les réglages Vite par défaut :
   - Build Command : `npm run build`
   - Output Directory : `dist`
4. Deploy.

## Audio

L'application utilise la Web Speech API disponible dans les navigateurs modernes. Aucun backend, aucune clé API et aucune génération serveur ne sont nécessaires.

Pour les mots chinois, l'app cherche d'abord une voix `Tingting` en `zh-CN`, puis retombe sur une autre voix chinoise disponible si nécessaire.
