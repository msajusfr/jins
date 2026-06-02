# Jin's

Web app React pour consulter un glossaire des Jìn des arts martiaux chinois et écouter leur prononciation via le navigateur.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Web Speech API du navigateur pour l'audio

## Langues

L'interface propose trois langues via les boutons drapeaux : français, anglais et chinois.

## Installation locale

```bash
npm install
npm run dev
```

## Build

```bash
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

Si le navigateur ne supporte pas la synthèse vocale, l'application affiche simplement une erreur dans l'interface.

Le sélecteur de voix affiche les voix chinoises disponibles dans le navigateur. Si aucune voix chinoise n'est exposée par le système, l'application propose les voix disponibles en fallback.
