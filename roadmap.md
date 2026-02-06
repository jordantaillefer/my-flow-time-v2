# My Flow Time v2 - Roadmap

## Vision

App de planification de journee avec des creneaux horaires et des modules custom par categorie.
L'objectif est de structurer ses journees, les executer via des modules interactifs, et suivre sa progression.

---

## Stack technique

| Couche | Techno |
|--------|--------|
| Monorepo | pnpm workspaces |
| Frontend | React 19 + Vite + shadcn/ui + Tailwind |
| API layer | tRPC (end-to-end type-safe) + TanStack Query |
| Backend | Hono sur Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) + Drizzle ORM |
| Auth | Better Auth (multi-utilisateur) |
| Formulaires | React Hook Form + Zod (validation) |
| Tableaux | TanStack Table |
| Routing | TanStack Router |
| Shared | Package partage pour les types + schemas Zod |
| Tests | Vitest |
| PWA | vite-plugin-pwa + Workbox (offline-first) |

Base de code initiale : projet `billable`.

---

## Principes de developpement

- **Mobile-first** : tout le design part du mobile, puis s'adapte au desktop
- **API-first** : chaque feature commence par le schema DB + API, puis l'UI
- **Offline-first** : PWA avec cache des donnees et synchronisation au retour en ligne
- **Functional Core, Imperative Shell** : logique metier pure et testable (fonctions pures, pas d'effets de bord), effets de bord isoles dans la couche shell (API calls, DB, DOM). Cote API : handlers Hono (shell) appellent des fonctions metier pures (core). Cote frontend : custom hooks (shell) orchestrent des fonctions de transformation pures (core)
- **Clean code** : composants reutilisables, separation des responsabilites, custom hooks pour la logique metier
- **UI soignee** : shadcn/ui comme base, animations subtiles (framer-motion), micro-interactions, etats de chargement/vide/erreur traites pour chaque ecran
- **Tests** : tests unitaires sur la logique metier, tests API sur les endpoints critiques
- **Actions user** : quand une action manuelle est requise (Cloudflare, config, etc.), c'est signale avec le tag **[ACTION USER]**

---

## Phase 0 - Setup du projet ✅

- [x] Copier la base du projet billable et renommer (packages, configs, DB)
- [x] **[ACTION USER]** Creer le projet Cloudflare + base D1 via le dashboard
- [x] Ajouter Tailwind CSS v4 + shadcn/ui au frontend
- [x] Setup tRPC : serveur (adaptateur Hono) + client React (integration TanStack Query)
- [x] Setup React Hook Form + resolvers Zod (wrapper `formResolver` pour compat zod v4)
- [x] Setup TanStack Table
- [x] Setup PWA : vite-plugin-pwa, manifest, service worker, strategie de cache (NetworkFirst API, CacheFirst assets)
- [x] Setup du routing (TanStack Router, file-based via vite plugin)
- [x] Layout responsive : AppShell (DesktopSidebar sticky, Header mobile, BottomNav mobile)
- [x] Theming : dark mode permanent, palette blue-violet (oklch), gradients sur sidebar/cards/buttons/dialogs
- [x] Verifier que le dev local tourne (api port 8787, web port 5173 avec proxy /api)

## Phase 1 - Auth & utilisateur ✅

- [x] Configurer Better Auth (signup / login / logout)
- [x] Pages auth : inscription, connexion (formulaires shadcn, validation Zod)
- [x] Middleware auth cote API (authedProcedure tRPC)
- [x] Composant UserMenu dans le header/sidebar (avatar initiales, dropdown, deconnexion)
- [x] Gestion offline : cache de la session, redirection si expire

## Phase 2 - Categories & sous-categories ✅

- [x] Schema DB : table `category` (id, name, icon, color, isDefault, userId FK cascade) + table `subcategory` (id, name, moduleType, isDefault, categoryId FK cascade, userId FK cascade)
- [x] API CRUD : categoryRouter (list/create/update/delete) + subcategoryRouter (create/update/delete)
- [x] Page Settings avec CategoryList : cards en grille, sous-categories en badges, formulaires dialogs
- [x] Seed initial via isDefault flag
- [x] Champ `moduleType` sur subcategory pour lier un module custom (ex: "workout")

## Phase 3 - Templates de journee ✅

- [x] Schema DB : `day_template` (id, name, color, userId) + `template_slot` (id, startTime, endTime, order, subcategoryId, templateId, userId) + `template_recurrence` (id, dayOfWeek 0-6, templateId, userId, unique par jour/user)
- [x] API : dayTemplateRouter (list/getById/create/update/delete) + templateSlotRouter (create/update/delete/reorder) + templateRecurrenceRouter (list/set upsert/unset)
- [x] Page editeur de template (`/templates/$templateId`) : creneaux ordonnes, slot form dialog avec Select groupé par categorie, boutons edit/delete
- [x] RecurrencePicker : 7 boutons toggle (L M Me J V S D), avertissement si jour deja assigne
- [x] TemplateList dans Settings : cards en grille, nb creneaux, jours assignes, lien vers editeur

## Phase 4 - Calendrier & planning ✅

- [x] Schema DB : table `planned_day` (date, FK day_template nullable) + table `planned_slot` (FK planned_day, heure debut, heure fin, FK subcategory, FK template_slot nullable)
- [x] API generation des jours a partir des recurrences + CRUD slots individuels
- [x] Vue calendrier : semaine (grille horaire style Google Calendar, responsive mobile 1 jour) et mois
- [x] Edition inline d'un jour : ajouter/modifier/supprimer des creneaux + clic sur grille horaire pour pre-remplir
- [x] Application rapide d'un template sur un jour
- [ ] Sync offline : cache des donnees du calendrier, queue de modifications

## Phase 5 - Vue "Aujourd'hui" ✅

- [x] Page dediee : affichage des creneaux du jour sous forme de timeline verticale
- [x] Indicateur du creneau actif (basee sur l'heure courante, mise a jour en temps reel)
- [x] Architecture de modules : registre de composants indexes par `module_type`
- [x] Clic sur un creneau = ouvre le module associe (ou un detail generique si pas de module)
- [x] Transitions fluides entre creneaux

## Phase 6 - Module Musculation : Base d'exercices ✅

- [x] Schema DB : table `exercise` (nom, groupe_musculaire, description, image_url nullable)
- [x] Seed d'exercices par groupe : pectoraux, dos, jambes, epaules, bras, abdos
- [x] API CRUD exercices + filtrage par groupe musculaire
- [x] Page de consultation : liste filtrable par groupe, barre de recherche
- [x] Composant `ExerciseCard` reutilisable (utilise dans le planificateur et l'historique)

## Phase 7 - Module Musculation : Planificateur de seance

- [ ] Schema DB : table `workout_plan` (FK planned_slot) + table `workout_plan_exercise` (FK exercise, ordre, series_prevues, reps_prevues, poids_prevu, repos_prevu_secondes)
- [ ] API CRUD plan de seance
- [ ] UI : depuis un creneau Musculation dans le calendrier, construire sa seance
- [ ] Ajout d'exercices depuis la base (recherche + selection rapide)
- [ ] Reordonner les exercices (drag & drop)
- [ ] Previsualisation de la seance planifiee

## Phase 8 - Module Musculation : Execution de seance

- [ ] Schema DB : table `workout_session` (FK workout_plan, date_debut, date_fin, statut, notes) + table `workout_set` (FK workout_session, FK exercise, numero_serie, reps_realisees, poids_realise, feeling 1-5, timestamp)
- [ ] API : demarrer / completer une seance, enregistrer chaque serie
- [ ] UI execution (plein ecran, optimisee mobile) :
  - Exercice en cours avec objectifs affiches (series x reps x poids)
  - Saisie rapide : reps / poids / feeling par serie (boutons +/- pour ajuster vite)
  - Chronometre de repos configurable entre les series (notification vibration quand termine)
  - Navigation : serie suivante > exercice suivant > fin de seance
  - Recapitulatif complet en fin de seance
- [ ] Fonctionnement offline complet : toute la seance en local, sync au retour en ligne

## Phase 9 - Historique & statistiques

- [ ] Page historique des seances : liste chronologique, filtrable par date et exercice
- [ ] Vue detail d'une seance : tableau exercice par exercice (series, reps, poids, feeling)
- [ ] Vue graphiques (recharts) :
  - Courbe de progression du poids par exercice
  - Volume total (poids x reps) par seance dans le temps
  - Feeling moyen par exercice dans le temps
- [ ] Composants de stats reutilisables (utilises aussi dans la vue Aujourd'hui)

---

## Pour plus tard (hors scope initial)

- [ ] App mobile native (React Native / Expo)
- [ ] Exercices custom (l'utilisateur cree ses propres exercices)
- [ ] Autres modules : Lecture (suivi de pages/livres), Musique (suivi de pratique), etc.
- [ ] Notifications / rappels (push notifications via service worker)
- [ ] Export de donnees (CSV, JSON)
- [ ] Partage de templates entre utilisateurs
