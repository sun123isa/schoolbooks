
# Schoolbooks

Plateforme de gestion et de téléchargement de livres scolaires (PDF) pour apprenants et formateurs.

Objectif :  mettre en place une plateforme de recherche des documents scolaires aidant ainsi les apprenants a avoir les ressources d'apprentissage sans trop de difficultés.

Ce projet est un **monorepo** contenant :

- un **backend** Node.js + Express (API REST) ;
- un **frontend** React + Vite ;
- une base de données **PostgreSQL** ;
- des scripts SQL de migration et de seed.

---


# Technologie Utilisé 
| Partie           | Technologie              | Rôle                                  |
| ---------------- | ------------------------ | ------------------------------------- |
| Frontend         | React + Vite             | Interface utilisateur                 |
| Style            | CSS classique au départ  | Comprendre clairement la présentation |
| Backend          | Node.js + Express        | API HTTP                              |
| Base de données  | PostgreSQL               | Stockage durable des données          |
| Accès PostgreSQL | pg                       | Communication directe avec PostgreSQL |
| Validation       | Zod                      | Vérification des données reçues       |
| Sécurité         | Helmet, CORS, rate limit | Protection de l’API                   |
| Tests            | Vitest, Supertest        | Vérification du code                  |
| Qualité          | ESLint, Prettier         | Code cohérent et lisible              |
| Environnement    | dotenv                   | Lecture des variables secrètes        |


# Mode de fonctionnement  : 
React → API Express → PostgreSQL

# exécution coté API  : 
Route HTTP
   ↓
Contrôleur
   ↓
Service
   ↓
Requête SQL
   ↓
PostgreSQL





## 📋 Prérequis

Avant de commencer, assure-toi d'avoir installé :

- **Node.js** (version 18 ou supérieure)  
  [Télécharger Node.js](https://nodejs.org/)
- **npm** (fourni avec Node.js)
- **PostgreSQL** (version 14 ou supérieure)  
  [Télécharger PostgreSQL](https://www.postgresql.org/download/)
- **Git**  
  [Télécharger Git](https://git-scm.com/)

---

## 🚀 Installation pas à pas

### 1. Cloner le dépôt

```bash
git clone https://github.com/TON_UTILISATEUR/schoolbooks.git
cd schoolbooks
```

Remplace `TON_UTILISATEUR` par ton nom d'utilisateur GitHub.

---

### 2. Installer les dépendances

À la racine du projet :

```bash
npm install
```

Cette commande installe les dépendances pour :

- le monorepo (racine) ;
- le backend (`apps/api`) ;
- le frontend (`apps/web`).

---

### 3. Configurer la base de données PostgreSQL

#### a. Créer la base de données

Ouvre un terminal et connecte-toi à PostgreSQL :

```bash
psql -U postgres
```

Puis crée la base :

```sql
CREATE DATABASE schoolbooks_db;
\q
```

#### b. Configurer le mot de passe de l'utilisateur `postgres`

Toujours dans `psql` :

```sql
\password postgres
```

Entre un mot de passe simple (par exemple `dbpassword`) et confirme-le.

> ⚠️ Note ce mot de passe, tu en auras besoin pour le fichier `.env`.

---

### 4. Configurer le backend

#### a. Créer le fichier `.env` du backend

Dans le dossier `apps/api`, crée un fichier nommé `.env` (pas d'extension) :

```text
apps/api/.env
```

#### b. Ajouter le contenu suivant

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:TON_MOT_DE_PASSE@localhost:5432/schoolbooks_db
CLIENT_URL=http://localhost:5173
```

Remplace `TON_MOT_DE_PASSE` par le mot de passe que tu as défini à l'étape précédente.

> ⚠️ Ne mets **pas de guillemets** autour du mot de passe.  
> Exemple correct : `postgresql://postgres:dbpassword@localhost:5432/schoolbooks_db`

---

### 5. Exécuter les migrations SQL

Les migrations créent les tables nécessaires dans la base de données.

Depuis la racine du projet :

```bash
psql -U postgres -d schoolbooks_db -f database/migrations/001_create_learners.sql
psql -U postgres -d schoolbooks_db -f database/migrations/002_create_trainers.sql
psql -U postgres -d schoolbooks_db -f database/migrations/003_create_books.sql
```

Si `psql` te demande un mot de passe, utilise celui que tu as défini.

---

### 6. Peupler la base avec des données de test (seed)

Toujours depuis la racine :

```bash
psql -U postgres -d schoolbooks_db -f database/seeds/001_seed_schoolbooks.sql
```

Cela va insérer :

- des formateurs ;
- des apprenants ;
- des livres (avec des chemins de fichiers PDF fictifs).

---

## ▶️ Démarrer le projet

### 1. Démarrer le backend (API)

Ouvre un premier terminal, à la racine du projet :

```bash
npm run dev:api
```

Tu devrais voir :

```text
✅ Connexion PostgreSQL OK: ...
API démarrée sur http://localhost:3000
```

> Laisse ce terminal ouvert.

---

### 2. Démarrer le frontend (React)

Ouvre un **deuxième terminal**, toujours à la racine du projet :

```bash
npm run dev:web
```

Tu devrais voir quelque chose comme :

```text
VITE v6.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

> Laisse ce terminal ouvert aussi.

---

### 3. Tester l'application

Ouvre ton navigateur et va à l'adresse :

```text
http://localhost:5173
```

Tu devrais voir :

- le titre **Schoolbooks** ;
- la liste des livres provenant de la base de données.

---

## 🧪 Tester l'API directement

Tu peux tester l'API sans passer par le frontend.

### Lister tous les livres

```bash
curl http://localhost:3000/api/books
```

### Filtrer par niveau

```bash
curl "http://localhost:3000/api/books?level=3e"
```

### Filtrer par matière

```bash
curl "http://localhost:3000/api/books?subject=Mathématiques"
```

### Recherche textuelle

```bash
curl "http://localhost:3000/api/books?q=manuel"
```

### Récupérer un livre par son ID

Remplace `<UUID>` par l'ID d'un livre (visible dans la réponse de `/api/books`) :

```bash
curl http://localhost:3000/api/books/<UUID>
```

### Télécharger un livre (PDF)

```bash
curl -O http://localhost:3000/api/books/<UUID>/download
```

---

## 📁 Structure du projet

```text
schoolbooks/
├── .env.example                 # Exemple de variables d'environnement (racine)
├── .gitignore                   # Fichiers ignorés par Git
├── package.json                 # Configuration principale du monorepo
├── package-lock.json            # Versions exactes des dépendances
├── README.md                    # Ce fichier
│
├── apps/
│   ├── api/                     # Backend Node.js + Express
│   │   ├── .env                 # Variables d'environnement DU BACKEND (IMPORTANT)
│   │   ├── package.json
│   │   └── src/
│   │       ├── config/
│   │       │   └── database.js
│   │       ├── controllers/
│   │       ├── middlewares/
│   │       ├── repositories/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── validators/
│   │       ├── app.js
│   │       └── server.js
│   │
│   └── web/                     # Frontend React + Vite
│       ├── .env
│       ├── package.json
│       └── src/
│           ├── components/
│           │   └── BooksList.jsx
│           ├── services/
│           │   └── books.api.js
│           ├── App.jsx
│           └── main.jsx
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_learners.sql
│   │   ├── 002_create_trainers.sql
│   │   └── 003_create_books.sql
│   └── seeds/
│       └── 001_seed_schoolbooks.sql
│
├── docs/                        # Documentation future
│
└── packages/
    └── shared/                  # Code partagé (futur)
```

---

## 🛠️ Commandes utiles

Depuis la **racine** du projet :

```bash
# Installer toutes les dépendances
npm install

# Démarrer le backend uniquement
npm run dev:api

# Démarrer le frontend uniquement
npm run dev:web

# Démarrer les deux en même temps (si configuré)
npm run dev

# Linter le code
npm run lint

# Formater le code avec Prettier
npm run format
```

---

## 🔧 Résolution de problèmes courants

### Erreur de connexion PostgreSQL

Message :  
`SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`

**Cause** : le mot de passe dans `DATABASE_URL` est incorrect ou manquant.

**Solution** :

1. Vérifie que `apps/api/.env` existe et contient :

   ```env
   DATABASE_URL=postgresql://postgres:TON_MOT_DE_PASSE@localhost:5432/schoolbooks_db
   ```

2. Vérifie que le mot de passe de l'utilisateur `postgres` dans PostgreSQL est bien le même.

3. Redémarre le backend :

   ```bash
   npm run dev:api
   ```

---

### Erreur de validation sur `/api/books`

Message :  
`"Paramètres de requête invalides"`

**Cause** : problème de validation des paramètres de requête (query params).

**Solution** :

- Vérifie que tu utilises bien la version corrigée de `src/validators/books.validator.js` ;
- Ou temporairement, désactive la validation des query params dans `src/routes/books.routes.js` comme indiqué dans la documentation interne.

---

### Le frontend ne charge pas les livres

**Vérifications** :

1. Le backend tourne-t-il ?  
   Ouvre `http://localhost:3000/api/health` dans ton navigateur. Tu dois voir :

   ```json
   { "success": true, "message": "Schoolbooks API fonctionne" }
   ```

2. L'URL de l'API dans `apps/web/src/services/books.api.js` est-elle correcte ?

   ```js
   const API_BASE_URL = 'http://localhost:3000/api';
   ```

3. Regarde la console du navigateur (F12 → Console) pour voir s'il y a des erreurs CORS ou réseau.

---

## 📝 Prochaines étapes (idées d'amélioration)

Tu peux enrichir le projet avec :

- une interface de recherche avancée (filtres par niveau, matière, mot-clé) ;
- une page de détail pour chaque livre ;
- un formulaire d'upload de nouveaux livres (pour les formateurs) ;
- un système d'authentification (login/mot de passe) ;
- une gestion des rôles (admin, formateur, apprenant) ;
- un stockage des PDF sur un service objet (S3, MinIO) au lieu du disque local.

---

## 📄 Licence

Ce projet est fourni à titre éducatif. Tu peux l'utiliser et le modifier selon tes besoins.

---

## 🤝 Contribution

Si tu souhaites contribuer :

1. Fork le dépôt ;
2. Crée une branche pour ta fonctionnalité ;
3. Soumets une pull request.

---

## 📞 Besoin d'aide ?

Si tu rencontres un problème :

1. Vérifie ce README et la section **Résolution de problèmes courants** ;
2. Consulte les logs du backend et du frontend ;
3. Ouvre une issue sur GitHub avec :
   - une description claire du problème ;
   - les messages d'erreur complets ;
   - les étapes pour reproduire.

---

**Bon développement !** 🚀

