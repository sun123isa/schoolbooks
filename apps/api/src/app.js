import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware.js';
import booksRoutes from './routes/books.routes.js';

const app = express();

// Middleware de sécurité : ajoute des en-têtes HTTP protecteurs.
app.use(helmet());

// Middleware CORS : autorise le frontend React à appeler l'API.
app.use(cors());

// Middleware pour parser le JSON des requêtes.
app.use(express.json());

// Logger HTTP : affiche les requêtes dans le terminal en développement.
app.use(morgan('dev'));

// Routes publiques de test.
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Schoolbooks API fonctionne'
  });
});

// Routes liées aux livres.
app.use('/api/books', booksRoutes);

// Middleware de gestion des erreurs (doit être après les routes).
app.use(errorMiddleware);

export default app;