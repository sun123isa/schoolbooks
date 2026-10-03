// =============================================================================
// Socle backend — application Express
// Responsable : Isaac LELO MAKAYA — relecture : Salem KONGOLO
// Périmètre : middlewares globaux et montage des modules. Chaque module (dossier
// src/modules/<domaine>) expose un routeur ; un développeur n'ajoute ici qu'une
// ligne app.use(...) pour son module, ce qui limite les conflits de merge.
// =============================================================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import booksRoutes from './modules/books/books.routes.js';
import referentielsRoutes from './modules/referentiels/referentiels.routes.js';
import rechercheRoutes from './modules/recherche/recherche.routes.js';
import ressourcesRoutes from './modules/ressources/ressources.routes.js';

const app = express();

// Middleware de sécurité : ajoute des en-têtes HTTP protecteurs.
app.use(helmet());

// Middleware CORS : autorise le frontend React à appeler l'API.
// TODO (Isaac) : restreindre l'origine à env.clientUrl (CLIENT_URL).
app.use(cors());

// Middleware pour parser le JSON des requêtes.
app.use(express.json());

// Logger HTTP : affiche les requêtes dans le terminal en développement.
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes publiques de test.
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Schoolbooks API fonctionne'
  });
});

// Référentiels — Isaac LELO MAKAYA : /api/niveaux, /api/matieres, /api/annees, /api/types-documents
app.use('/api', referentielsRoutes);

// Recherche — Salem KONGOLO : GET /api/ressources (doit rester AVANT le module ressources)
app.use('/api/ressources', rechercheRoutes);

// Ressources et fichiers — Emmanuel AYA : GET /api/ressources/:id[/fichier|/telechargement]
app.use('/api/ressources', ressourcesRoutes);

// Routes historiques liées aux livres (avant le MVP « ressources ») — conservées.
app.use('/api/books', booksRoutes);

// Route inconnue : 404 au format d'erreur commun.
app.use('/api', notFoundMiddleware);

// Middleware de gestion des erreurs (doit être après les routes).
app.use(errorMiddleware);

export default app;
