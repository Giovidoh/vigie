# TODO

> La roadmap de référence est celle du README (section Roadmap). Ce fichier en suit la phase en cours.
> Toute évolution de périmètre se reporte d'abord dans le README.

## In Progress

## To Do
- [ ] Publier le dépôt sur GitHub (Giovidoh/vigie) et fusionner la branche `feat/phase-1-claude-code-mvp`
- [ ] Tester l'installation depuis la marketplace GitHub (`claude plugin marketplace add Giovidoh/vigie`)
- [ ] Vérifier en session interactive l'envoi forcé avec `!jassume` (non testé en réel : session CLI expirée)
- [ ] Phase 2 : petit modèle local pour le texte

## Done
- [x] Nom du projet : Vigie
- [x] README basé sur Best-README-Template, avec la roadmap
- [x] Licence Apache 2.0 (texte officiel apache.org dans `LICENSE`)
- [x] Dépôt Git initialisé (branche `main`)
- [x] Phase 1 : règles locales texte (`rules/anthropic.json`), par catégorie et par niveau
- [x] Phase 1 : hook `UserPromptSubmit` — blocage vérifié en réel avec `claude -p --plugin-dir .`
- [x] Phase 1 : messages d'alerte FR/EN et préfixe `!jassume` pour le niveau Élevé
- [x] Phase 1 : 51 tests (`npm test`), dont des prompts proches des règles pour limiter les faux positifs
- [x] Phase 1 : plugin et marketplace validés (`claude plugin validate .`)

## Blocked
- [!] Décider du positionnement Enterprise (inference hooks) — en attente : un prompt refusé par un inference hook est-il quand même analysé par les systèmes de sécurité d'Anthropic ? La doc publique ne le dit pas (recherche du 2026-10-25) ; question à poser à Anthropic

## Décisions
- Analyse 100 % locale : aucun prompt envoyé à Anthropic ni à un tiers pour vérification.
- Pas de Llama Guard ni d'Ollama : trop lourd et trop lent. Petit modèle local en phase 2.
- Pas de proposition de reformulation : Vigie alerte uniquement.
- Démarrage avec Claude Code, mais cœur indépendant de l'outil (phase 4 : autres assistants).
- Runtime : Node.js (Python absent de la machine de dev).
