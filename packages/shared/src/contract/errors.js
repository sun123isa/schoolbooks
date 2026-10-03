// =============================================================================
// Contrat d'API — format d'erreur commun et codes d'erreur
// Responsable : Isaac LELO MAKAYA (socle backend) — relecture : Salem KONGOLO
// Périmètre : toutes les réponses en erreur de l'API respectent ApiErrorSchema.
// Le frontend s'appuie sur `error.code` (jamais sur le message) pour choisir
// le message à afficher.
// =============================================================================
import { z } from 'zod';

export const ERROR_CODES = {
  // Socle (Isaac)
  VALIDATION_ERROR: 'VALIDATION_ERROR', // 400 — paramètres ou corps invalides
  ROUTE_INTROUVABLE: 'ROUTE_INTROUVABLE', // 404 — route inconnue
  INTERNAL_ERROR: 'INTERNAL_ERROR', // 500 — erreur inattendue

  // Référentiels (Isaac)
  NIVEAU_INTROUVABLE: 'NIVEAU_INTROUVABLE', // 404 — code de niveau inconnu
  FILIERE_INCOMPATIBLE: 'FILIERE_INCOMPATIBLE', // 400 — BR02 : filière hors du niveau

  // Ressources et fichiers (Emmanuel)
  RESSOURCE_INTROUVABLE: 'RESSOURCE_INTROUVABLE', // 404 — id inconnu ou ressource retirée
  FICHIER_INDISPONIBLE: 'FICHIER_INDISPONIBLE', // 404 — BR06 : PDF absent ou illisible
  TELECHARGEMENT_NON_AUTORISE: 'TELECHARGEMENT_NON_AUTORISE', // 403 — BR08

  // Intégration au catalogue (Emmanuel)
  RESSOURCE_INCOMPLETE: 'RESSOURCE_INCOMPLETE', // 422 — BR01/BR03/BR05/BR04
  DOUBLON: 'DOUBLON' // 409 — BR09
};

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    // Détails de validation (liste des champs en erreur), optionnels.
    details: z
      .array(
        z.object({
          champ: z.string(),
          message: z.string()
        })
      )
      .optional()
  })
});

// Enveloppe de succès commune : { success: true, data: ... }.
export function successEnvelope(dataSchema) {
  return z.object({
    success: z.literal(true),
    data: dataSchema
  });
}
