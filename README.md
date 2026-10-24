# Skilloo — Apprendre aujourd'hui, réussir demain

Plateforme d'apprentissage gamifiée (Afrique francophone) : chaque module du parcours Blockchain & Web3 allume un étage de ta ville.

## Lancer en local

Prérequis : Node.js 20+

1. `npm install`
2. Optionnel : `GEMINI_API_KEY` dans `.env.local` pour le mentor IA Loo (sinon réponse locale de repli)
3. `npm run dev` puis http://localhost:3000

## Écrans (routes hash)

`#/ville` · `#/parcours` · `#/parcours/mod_1` … `mod_18` · `#/missions` · `#/progression` · `#/certificat`

## Mode démonstration

Bouton « Démo » dans la barre supérieure : ouvre les 18 modules, permet de simuler la validation complète et d'afficher
le certificat de démonstration. La progression démo est stockée séparément (`skilloo_progress_demo`) et ne touche jamais
la progression apprenant (`skilloo_progress_learner`). Le certificat n'est pas une certification officielle.

## Vérifications

- `npm run lint` — typage TypeScript
- `npx tsx src/lib/progress.check.ts` — règles de progression (statuts, niveaux, rangs, quartiers)

## Architecture

- `src/lib/progress.ts` — seul point d'accès au stockage (localStorage) : à remplacer par un client API en phase backend
- `src/lib/router.ts` — routage par hash, sans dépendance
- `src/data/` — modules, quartiers, habitants et missions (données structurées)
