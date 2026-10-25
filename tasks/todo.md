# TODO

> La roadmap de référence est celle du README (section Roadmap). Ce fichier en suit la phase en cours.
> Toute évolution de périmètre se reporte d'abord dans le README.

## In Progress
- [~] Phase 1 : Claude Code MVP — conception validée, implémentation à démarrer

## To Do
- [ ] Initialiser le dépôt Git et le publier sur GitHub (Giovidoh/vigie)
- [ ] Phase 1 : règles locales texte, par catégorie de politique d'usage et par niveau
- [ ] Phase 1 : hook `UserPromptSubmit` qui vérifie le prompt avant l'envoi
- [ ] Phase 1 : messages d'alerte et préfixe de contournement pour le niveau Élevé
- [ ] Phase 1 : jeu de tests (prompts à laisser passer, prompts à signaler) et mesure des faux positifs
- [ ] Phase 1 : packaging en plugin Claude Code avec une marketplace

## Done
- [x] Nom du projet : Vigie
- [x] README basé sur Best-README-Template, avec la roadmap
- [x] Licence Apache 2.0 (texte officiel apache.org dans `LICENSE`)

## Blocked
- [!] Décider du positionnement Enterprise (inference hooks) — en attente : un prompt refusé par un inference hook est-il quand même analysé par les systèmes de sécurité d'Anthropic ? La doc publique ne le dit pas (recherche du 2026-10-25) ; question à poser à Anthropic

## Décisions
- Analyse 100 % locale : aucun prompt envoyé à Anthropic ni à un tiers pour vérification.
- Pas de Llama Guard ni d'Ollama : trop lourd et trop lent. Petit modèle local en phase 2.
- Pas de proposition de reformulation : Vigie alerte uniquement.
- Démarrage avec Claude Code, mais cœur indépendant de l'outil (phase 4 : autres assistants).
- Runtime : Node.js (Python absent de la machine de dev).
