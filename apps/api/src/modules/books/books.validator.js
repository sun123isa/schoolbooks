// =============================================================================
// Module BOOKS (historique, antérieur au MVP « ressources ») — /api/books
// Responsable : Emmanuel AYA (catalogue) — relecture : Salem KONGOLO
// Code conservé tel quel. Les nouvelles fonctionnalités passent par les modules
// referentiels, recherche et ressources. POST /api/books (upload) est hors MVP
// pour les utilisateurs : il pourra servir de base à l'intégration au catalogue.
// =============================================================================
import { z } from 'zod';

// Schéma pour la création d'un livre (sans le fichier).
export const createBookBodySchema = z.object({
  title: z.string().min(3).max(255),
  author: z.string().max(255).nullish(),
  isbn: z.string().max(50).nullish(),
  category: z.string().max(100).nullish(),
  description: z.string().nullish(),
  level: z.string().min(3).max(50),
  subject: z.string().min(3).max(100)
});

// Schéma pour les paramètres d'URL (ex : /api/books/:id).
export const bookIdParamsSchema = z.object({
  id: z.string().uuid()
});

// Schéma pour les query params : version qui ne rejette rien.
// On transforme tout en objet avec level, subject, q optionnels.
export const listBooksQuerySchema = z.object({
  level: z.string().optional(),
  subject: z.string().optional(),
  q: z.string().optional()
});

// Fonction utilitaire pour valider req.body avec Zod.
export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      const err = new Error('Données invalides');
      err.status = 400;
      err.code = 'VALIDATION_ERROR';
      err.details = error.errors;
      next(err);
    }
  };
}

// Fonction utilitaire pour valider req.params avec Zod.
export function validateParams(schema) {
  return (req, res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      const err = new Error('Paramètres invalides');
      err.status = 400;
      err.code = 'VALIDATION_ERROR';
      err.details = error.errors;
      next(err);
    }
  };
}



