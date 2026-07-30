Web Matcha

_Résumé: Parce que l’amour aussi, ça s’industrialise. Version: 6.0_

## Table des matières

| I | Préambule | 2 |
| --- | --- | --- |
| II | Introduction | 3 |
| III | Instructions générales | 4 |
| IV | Partie obligatoire | 6 |
| IV.1 | Inscription et connexion | 6 |
| IV.2 | Profil utilisateur | 6 |
| IV.3 | Navigation | 7 |
| IV.4 | Recherche | 7 |
| IV.5 | Consultation de profil | 8 |
| IV.6 | Chat | 8 |
| IV.7 | Notifications | 8 |
| V | Partie bonus | 10 |
| VI | Rendu et évaluation par les pairs | 11 |
| VI.1 | Évaluation par les pairs | 11 |

## Chapitre I

## Préambule

Ce deuxième millénaire a changé et renforcé à jamais les habitudes et coutumes d’Internet. Les choix sont désormais guidés par la technologie, laissant de moins en moins de place au hasard. Les relations humaines, fondement de toute société moderne, se forment de plus en plus artificiellement grâce aux algorithmes des sites de rencontre et des réseaux sociaux, connectant les gens sur la base de critères très spécifiques.

Oui, le romantisme est mort, et Victor Hugo se retourne probablement dans sa tombe.


## Chapitre II

## Introduction

Ce projet vise à créer un site de rencontre.

Vous devez développer une application qui facilite les connexions entre deux partenaires potentiels, couvrant l’ensemble du processus, de l’inscription à la rencontre finale.

Les utilisateurs doivent pouvoir s’inscrire, se connecter, compléter leur profil, rechercher et consulter les profils d’autres utilisateurs, et exprimer leur intérêt pour eux avec un « like »[1]. Ils doivent également pouvoir discuter avec ceux qui ont réciproqué leur intérêt.

1. Puisque « like » n’est pas un terme idéal, vous êtes encouragé à trouver une alternative plus explicite.

## Chapitre III

## Instructions générales

- Votre application ne doit produire aucune erreur, warning ou notice, côté serveur et côté client.

- Pour ce projet, vous êtes libre d’utiliser le langage de programmation de votre choix.

- Vous pouvez utiliser des micro-frameworks et toutes les bibliothèques nécessaires pour ce projet.

- Vous êtes libre d’utiliser des bibliothèques d’interface utilisateur telles que React, Angular, Vue, Bootstrap, Semantic, ou toute combinaison de celles-ci.

- Aucune vulnérabilité de sécurité n’est autorisée. Vous devez au minimum respecter les exigences de sécurité obligatoires, mais nous vous encourageons vivement à aller au-delà—tout en dépend.

- Nous définissons un « micro-framework » comme un framework qui inclut un routeur et éventuellement du templating, mais qui n’inclut pas d’ORM, de validateurs ou de gestionnaire de comptes utilisateurs.[1] Tant que vous respectez ces contraintes, vous êtes libre d’utiliser les outils de votre choix.

- Si vous avez besoin d’inspiration, nous suggérons d’utiliser les langages suivants comme choix principal :

  - Sinatra pour Ruby.

  - Express pour Node (oui, nous considérons cela comme un micro-framework).

  - Flask pour Python.

  - Scalatra pour Scala.

  - Slim pour PHP (Silex n’est pas autorisé en raison de son intégration avec Doctrine).

  - Nickel pour Rust.

  - Goji pour Golang.

  - Spark pour Java.

  - Crow pour C++.

- Vous devez utiliser une base de données relationnelle ou orientée graphe. La base de données doit être gratuite, comme MySQL, MariaDB, PostgreSQL, Cassandra, InfluxDB, Neo4j, etc. Vous devez créer vos requêtes manuellement, comme le font les développeurs expérimentés. Cependant, si vous êtes malin, vous pouvez créer votre propre bibliothèque pour simplifier la gestion des requêtes.

- Pour l’évaluation de ce projet, votre base de données doit contenir un minimum de 500 profils distincts.

- Vous êtes libre de choisir le serveur web qui convient le mieux à vos besoins, qu’il s’agisse d’Apache, de Nginx ou d’un serveur web intégré.

- Votre application entière doit être compatible avec au moins les dernières versions de Firefox et Chrome.

- Votre site web doit avoir une mise en page bien structurée, comprenant au moins un en-tête, une section principale et un pied de page.

- Votre site web doit être adapté aux mobiles et maintenir une mise en page acceptable sur les petits écrans.

- Tous les formulaires doivent inclure une validation appropriée, et l’ensemble du site web doit être sécurisé. Il s’agit d’une exigence obligatoire qui sera largement évaluée lors de la soutenance. Pour vous donner une idée, voici quelques exemples de vulnérabilités de sécurité qui ne seront pas tolérées :

  - Stocker des mots de passe en clair dans votre base de données.

  - Permettre l’injection de HTML ou JavaScript dans des variables non protégées.

  - Permettre le téléchargement de contenu non autorisé.

  - Permettre les attaques par injection SQL.

## Chapitre IV

## Partie obligatoire

Vous devez développer une application web avec les fonctionnalités suivantes :

## IV.1 Inscription et connexion

L’application doit permettre à un utilisateur de s’inscrire en fournissant au minimum son adresse e-mail, son nom d’utilisateur, son nom de famille, son prénom et un mot de passe sécurisé. Les mots anglais couramment utilisés ne doivent pas être acceptés comme mots de passe.

Après l’inscription, l’utilisateur doit recevoir un e-mail avec un lien unique pour vérifier son compte.

Les utilisateurs doivent pouvoir se connecter en utilisant leur nom d’utilisateur et leur mot de passe. Ils doivent également avoir la possibilité de demander un e-mail de réinitialisation de mot de passe s’ils l’oublient. De plus, les utilisateurs doivent pouvoir se déconnecter en un seul clic depuis n’importe quelle page du site.

## IV.2 Profil utilisateur

- Une fois connectés, les utilisateurs doivent compléter leur profil en fournissant les informations suivantes :

  - Genre.

  - Préférences sexuelles.

  - Une biographie.

  - Une liste d’intérêts utilisant des tags (par exemple, #vegan, #geek, #piercing, etc.), qui doivent être réutilisables.

  - Jusqu’à 5 photos, dont une désignée comme photo de profil.

- Les utilisateurs doivent pouvoir modifier ces informations à tout moment, ainsi que mettre à jour leur nom de famille, prénom et adresse e-mail.

- Les utilisateurs doivent pouvoir voir qui a consulté leur profil.

- Les utilisateurs doivent également pouvoir voir qui les a « likés ».

- Chaque utilisateur doit avoir une « note de popularité » publique[1].

- Les utilisateurs doivent être localisés via le positionnement GPS jusqu’à leur quartier, avec leur consentement explicite. Si un utilisateur refuse le suivi de localisation GPS, il doit fournir manuellement sa localisation approximative (ville ou quartier) pour utiliser les fonctionnalités de matching. Cette saisie manuelle de la localisation est requise pour que l’application fonctionne correctement.[2] Les utilisateurs doivent également avoir la possibilité de modifier leur localisation dans leur profil à tout moment.

## IV.3 Navigation

Les utilisateurs doivent pouvoir accéder facilement à une liste de profils suggérés qui correspondent à leurs préférences.

- Vous devez suggérer des profils « intéressants ». Par exemple, une femme hétérosexuelle ne devrait voir que des profils masculins. Vous devez également gérer la bisexualité. Si un utilisateur n’a pas spécifié son orientation, il doit être considéré comme bisexuel par défaut.

- Les correspondances doivent être déterminées intelligemment[3] en fonction de :

  - La proximité avec la localisation géographique de l’utilisateur.

  - Le plus grand nombre de tags partagés.

  - La « note de popularité » la plus élevée.

- La priorité doit être donnée aux utilisateurs de la même zone géographique.

- La liste des profils suggérés doit être triable par âge, localisation, « note de popularité » et tags communs.

- Les utilisateurs doivent pouvoir filtrer la liste en fonction de l’âge, de la localisation, de la « note de popularité » et des tags communs.

## IV.4 Recherche

Les utilisateurs doivent pouvoir effectuer une recherche avancée en sélectionnant un ou plusieurs critères, tels que :

- Une tranche d’âge spécifique.

- Une plage de « note de popularité ».

- Une localisation.

- Un ou plusieurs tags d’intérêt.

Comme pour la liste suggérée, les résultats de recherche doivent être triables et filtrables par âge, localisation, « note de popularité » et tags d’intérêt.

> 1. Vous êtes responsable de définir ce que signifie « note de popularité », tant que vos critères sont cohérents.

> 2. Note : Cette approche respecte les exigences du RGPD concernant le consentement explicite pour le traitement des données. Bien que certains sites de rencontre puissent utiliser des méthodes de suivi alternatives, ce projet met l’accent sur les pratiques de développement respectueuses de la vie privée. 3. Prenez en compte plusieurs critères.

## Chapitre V

## IV.5 Consultation de profil

Les utilisateurs doivent pouvoir consulter les profils des autres utilisateurs. Les profils doivent afficher toutes les informations disponibles, à l’exception de l’adresse e-mail et du mot de passe.

Lorsqu’un utilisateur consulte un profil, cela doit être enregistré dans son historique de visites.

L’utilisateur doit également pouvoir :

- « Liker » la photo de profil d’un autre utilisateur. Lorsque deux utilisateurs se « likent » mutuellement, ils seront considérés comme « connectés » et pourront commencer à discuter. Si l’utilisateur actuel n’a pas de photo de profil, il ne peut pas effectuer cette action.

- Retirer un « like » précédemment donné. Cela empêchera les notifications ultérieures de cet utilisateur, et la fonction de chat entre eux sera désactivée.

- Consulter la « note de popularité » d’un autre utilisateur.

- Voir si un utilisateur est actuellement en ligne, et sinon, consulter la date et l’heure de sa dernière connexion.

- Signaler un utilisateur comme « faux compte ».

- Bloquer un utilisateur. Un utilisateur bloqué n’apparaîtra plus dans les résultats de recherche et ne générera plus de notifications. De plus, discuter avec lui ne sera plus possible.

Les utilisateurs doivent clairement voir si le profil qu’ils consultent les a « likés » ou s’ils sont déjà « connectés ». Ils doivent également avoir la possibilité de « unliker » ou de se déconnecter de ce profil.

## IV.6 Chat

Lorsque deux utilisateurs sont connectés[4], ils doivent pouvoir « chatter » en temps réel.[5]

L’implémentation de la fonctionnalité de chat vous appartient. Cependant, les utilisateurs doivent pouvoir voir, depuis n’importe quelle page, lorsqu’ils reçoivent un nouveau message.

## IV.7 Notifications

Les utilisateurs doivent recevoir des notifications en temps réel[6] pour les événements suivants :

- Lorsqu’ils reçoivent un « like ».

- Lorsque leur profil a été consulté.

- Lorsqu’ils reçoivent un message.

- Lorsqu’un utilisateur qu’ils ont « liké » les « like » également en retour.

- Lorsqu’un utilisateur connecté les « unlike ».

4. C’est-à-dire qu’ils se sont mutuellement « likés ».

5. avec un délai maximum de 10 secondes.

6. Avec un délai maximum de 10 secondes.

8 

Web 

Matcha 

Les utilisateurs doivent pouvoir voir, depuis n’importe quelle page, lorsqu’ils ont des notifications non lues. 

`Pour des raisons de sécurité, tous les identifiants, clés API, variables d’environnement, etc., doivent être stockés localement dans un fichier .env et exclus de Git. Le stockage public des identifiants peut entraîner l’échec du projet.` 


## **Chapitre V** 

## **Partie bonus** 

Voici des fonctionnalités bonus possibles que vous pouvez implémenter pour gagner des points supplémentaires : 

- Ajouter des stratégies OmniAuth pour l’authentification des utilisateurs. 

- Permettre aux utilisateurs de créer une galerie photo personnelle avec téléchargement par glisser-déposer et édition d’image de base (par exemple, recadrer, pivoter, appliquer des filtres). 

- Développer une carte interactive des utilisateurs, nécessitant une localisation GPS plus précise via JavaScript. 

- Intégrer un chat vidéo ou audio pour les utilisateurs connectés. 

- Implémenter une fonctionnalité pour planifier et organiser des rendez-vous ou événements réels pour les utilisateurs matchés. 

`La partie bonus ne sera évaluée que si la partie obligatoire est parfaite. « Parfait » signifie que les fonctionnalités obligatoires ont été entièrement implémentées et fonctionnent sans aucun dysfonctionnement. Si vous n’avez pas rempli` **`TOUTES`** `les exigences obligatoires, vos fonctionnalités bonus ne seront pas évaluées.` 

10 

## **Chapitre VI** 

## **Rendu et évaluation les par pairs** 

Soumettez votre travail dans votre dépôt `Git` comme d’habitude. Seul le travail présent dans votre dépôt sera évalué lors de la soutenance. Assurez-vous de vérifier les noms de vos dossiers et fichiers pour vous assurer qu’ils sont corrects. 

## **VI.1 Évaluation les par pairs** 

- Votre code ne doit produire aucune erreur, warning ou notice, côté serveur ou côté client (dans la console web). 

- Tout ce qui n’est pas explicitement autorisé est strictement interdit. 

- Toute faille de sécurité entraînera une note de 0. Au minimum, vous devez implémenter les mesures de sécurité décrites dans les instructions générales. Cela inclut : 

   - S’assurer que les mots de passe ne sont pas stockés en clair dans la base de données. 

   - Se protéger contre les attaques par injection SQL. 

   - Valider toutes les entrées de formulaire et les téléchargements de fichiers. 

**==> picture [13 x 9] intentionally omitted <==**

**----- Start of picture text -----**<br>
11<br>**----- End of picture text -----**<br>


## Appendix: Recommended 2-Developer Workflow

### Goal

Ship the mandatory scope in a sequence that keeps both developers productive at the same time, with the smallest possible merge conflict surface.

### Recommended split

**Developer 1 (already in progress): Authentication and account lifecycle**

- Registration form and backend endpoint.
- Login and logout flow.
- Email verification flow.
- Password reset flow.
- Password policy and security hardening.
- Session management / auth middleware.

**Developer 2: Product features that can advance in parallel with minimal auth conflict**

Start with the **profile domain + discovery flow**, but avoid changing the authentication-specific code paths.

Developer 2 should own:

- App layout after login: header, footer, navigation shell, protected page structure.
- User profile completion/edit screens.
- Tags/interests management.
- Photo upload UI and profile photo selection.
- Suggested profiles page UI.
- Search/filter/sort UI.
- Profile view page UI.

This is the best parallel track because it mostly depends on the existence of an authenticated user, not on the internal implementation details of login itself. The auth developer defines the session contract; the second developer consumes that contract and can use mocked data until endpoints are ready.

### Boundary to avoid conflicts

Use this contract between both developers:

- Developer 1 owns: identity, credentials, sessions, email flows, route protection.
- Developer 2 owns: profile data, browsing, search, profile presentation, interaction UI.

To reduce conflicts:

- Keep auth code under dedicated auth modules/routes/components.
- Keep profile/search/navigation work under separate feature folders.
- Agree early on the authenticated user shape returned to the frontend, for example:
  - `id`
  - `username`
  - `emailVerified`
  - `profileCompleted`
- Avoid both developers editing the same page component at the same time.
- Merge small pull requests frequently instead of one large branch.

### Best work sequence for 2 developers

#### Phase 1: Shared setup

1. Agree on stack, folder structure, database choice, and coding conventions.
2. Define the minimal API contracts before building:
   - auth session response
   - profile read/update payloads
   - search/filter request and response shape
3. Create database schema draft together before implementation.
4. Seed the database strategy early because the project requires at least 500 profiles.

#### Phase 2: Parallel work

**Developer 1**

1. User registration endpoint + UI.
2. Password hashing, validation, and secure session handling.
3. Email verification flow.
4. Login/logout flow.
5. Forgot/reset password.
6. Protected-route middleware and current-user endpoint.

**Developer 2**

1. Main authenticated app shell and navigation.
2. Profile completion/edit form UI with mock data first.
3. Tags, photo gallery, and profile photo selection flow.
4. Public/profile view pages.
5. Suggested profiles UI.
6. Search, sorting, and filtering UI.

#### Phase 3: First integration point

When Developer 1 finishes the current-user/session contract:

1. Connect protected pages to real auth state.
2. Redirect incomplete users to profile completion.
3. Replace mocked profile data with real API calls.

#### Phase 4: Core social interactions

After profile and discovery basics are stable, split again:

**Developer 1**

1. Likes/unlikes backend rules.
2. Blocks and fake-account reports.
3. Profile visit history.
4. Online status / last seen tracking.

**Developer 2**

1. Like/unlike UI states.
2. Profile badges: liked you, connected, blocked state.
3. Visitors / likes received screens.
4. Discovery and search UX polish.

#### Phase 5: Real-time features

Only start this after auth, matching, and profile viewing are stable.

**Developer 1**

1. Notification backend events.
2. Chat authorization rules.
3. Real-time transport setup.

**Developer 2**

1. Notification center UI and unread badge.
2. Chat UI.
3. Real-time message rendering and page-level integration.

### What the other developer should start now

Since you are already doing login/authentication, the other developer should start with this exact order:

1. App shell and protected-page layout.
2. Profile completion/edit UI.
3. Tags and photo management UI.
4. Suggested profiles page.
5. Search/filter/sort interface.
6. Profile details page.

They can build all of this first with mocked authenticated-user data and mocked profile records. That gives fast progress without waiting on the login implementation and avoids both developers changing the same auth files.

### Shared task tracker

#### Track A - Developer 1

- [ ] Define auth/session contract.
- [ ] Implement registration.
- [ ] Implement password hashing and validation rules.
- [ ] Implement email verification.
- [ ] Implement login/logout.
- [ ] Implement forgot/reset password.
- [ ] Expose current-user endpoint.
- [ ] Add route protection.
- [ ] Integrate auth state in frontend.

#### Track B - Developer 2

- [ ] Build app shell: header, main layout, footer, navigation.
- [ ] Build protected page placeholders.
- [ ] Build profile completion form.
- [ ] Build profile edit form.
- [ ] Build tags selector/reuse flow.
- [ ] Build photo upload and profile-photo selection UI.
- [ ] Build suggested profiles list UI.
- [ ] Build search page with filters and sorting controls.
- [ ] Build profile details page UI.
- [ ] Prepare empty states, loading states, and validation messages.

#### Joint integration milestones

- [ ] Agree on DB schema for users, profiles, tags, likes, blocks, visits, messages, notifications.
- [ ] Seed 500+ profiles.
- [ ] Connect profile UI to real backend.
- [ ] Implement like/unlike flow end to end.
- [ ] Implement blocks and reports.
- [ ] Implement visitors and likes-received views.
- [ ] Implement popularity score.
- [ ] Implement location consent + manual fallback.
- [ ] Implement suggested matching logic.
- [ ] Implement advanced search backend and frontend.
- [ ] Implement real-time notifications.
- [ ] Implement real-time chat.
- [ ] Run full security pass on forms, uploads, auth, and queries.
- [ ] Run cross-browser and responsive validation.

### Best sequence including bonus

Do the bonus only after every mandatory item is stable, tested, and integrated.

Recommended order:

1. Finish all mandatory authentication and profile flows.
2. Finish discovery, search, likes, blocks, visitors, and popularity.
3. Finish notifications and chat.
4. Fix bugs, validation gaps, security issues, and responsiveness.
5. Seed data and test the full user journey.
6. Only then start one bonus item.

### Best bonus choice for two developers

The safest bonus for a 2-developer team is usually:

1. **OmniAuth / social login**, if your auth architecture is already clean.
2. **Photo gallery improvements**, if your upload flow is already stable.

Avoid starting video/audio chat too early. It has the highest technical risk and can easily destabilize the mandatory real-time messaging work.

### Weekly collaboration workflow

1. Start each day with a 10-minute sync:
   - what changed yesterday
   - what contract changed
   - what is blocked
2. Work on separate feature branches.
3. Open small pull requests in sequence.
4. Rebase/merge often to avoid long-lived divergence.
5. Demo one integrated flow every day, not only isolated screens.
6. Keep a shared "blocked / ready for integration / done" checklist.

### Requirement ownership by subject section

Use this mapping to follow the project exactly in the same order as the subject.

#### IV.1 Registration and login

**Primary owner: Developer 1**

- Registration.
- Login/logout.
- Email verification.
- Forgot/reset password.
- Password security rules.
- Session/auth middleware.

**Developer 2 support**

- Connect login/register/reset screens to the final UI style.
- Prepare post-login navigation behavior.

#### IV.2 User profile

**Primary owner: Developer 2**

- Profile completion/edit pages.
- Gender, sexual preferences, biography.
- Interests/tags UI.
- Up to 5 photos and profile picture selection.
- Edit name/email/profile fields.
- Location input UI and consent flow.
- Profile persistence endpoints.
- Validation and upload security.
- Location storage rules.

#### IV.3 Navigation

**Primary owner: Developer 2**

- Suggested profiles page.
- Sorting and filtering UI.
- Navigation shell between authenticated pages.

**Primary owner on backend rules: Developer 1**

- Matching endpoint/query logic.
- Sort/filter query contract.
- Geographic priority rules.

#### IV.4 Search

**Primary owner: Developer 2**

- Advanced search page.
- Search filters UI.
- Search results presentation.

**Primary owner on backend rules: Developer 1**

- Search endpoints.
- Search query validation.
- Search filtering/sorting execution.

#### IV.5 Profile consultation

**Split ownership**

**Developer 2**

- Profile details screen.
- Like/unlike buttons and visual states.
- Connected / liked-you / blocked state display.
- Popularity score display.
- Visitors and likes-received views.

**Developer 1**

- Record profile visits.
- Like/unlike backend rules.
- Block/report backend rules.
- Online status / last seen.
- Popularity score calculation.

#### IV.6 Chat

**Do this later, after auth + profiles + likes are stable**

**Developer 2**

- Chat UI.
- Message list and input UX.
- New message indicators in the app shell.

**Developer 1**

- Chat authorization: only matched users can chat.
- Message persistence.
- Real-time message delivery.

#### IV.7 Notifications

**Split ownership**

**Developer 2**

- Notification center UI.
- Unread badge visible from every page.
- Notification list rendering and states.

**Developer 1**

- Notification event generation.
- Real-time delivery.
- Read/unread persistence.

#### Bonus section

Only start after all mandatory sections above are complete.

**Best split**

- Developer 1: social login / OmniAuth if auth architecture is already clean.
- Developer 2: richer photo gallery or photo editing UX.

Avoid assigning video/audio chat as an early bonus because it overlaps with the hardest mandatory real-time work.

### Recommended delivery order by section

1. `IV.1` Developer 1 leads, Developer 2 stays out of auth internals.
2. `IV.2` Developer 2 starts immediately with mocks while Developer 1 finishes auth.
3. `IV.3` and `IV.4` Developer 2 continues frontend flows; Developer 1 defines and implements the supporting queries/endpoints.
4. `IV.5` integrate both sides once profiles and discovery are stable.
5. `IV.7` and `IV.6` come last among mandatory work because they depend on the earlier sections.
6. `V Bonus` only after all mandatory items are working end to end.

### Final recommendation

If one developer is already inside authentication, the second developer should not start chat or notifications first. The best non-conflicting parallel path is **profile, navigation, discovery, and search UI backed by stable contracts and mock data**, then integrate once auth exposes the current-user/session boundary.
