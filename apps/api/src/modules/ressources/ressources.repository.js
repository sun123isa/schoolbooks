// =============================================================================
// Module RESSOURCES — repository (requêtes SQL uniquement)
// Responsable : Emmanuel AYA — relecture : Salem KONGOLO
// ÉTAT : À IMPLÉMENTER.
//
// Signatures attendues :
//   findRessourceById(id) -> Promise<ligne | null>
//     ligne = colonnes de books + code/libellé du niveau, de la filière, de la
//     matière et du type (jointures sur levels, tracks, subjects, document_types),
//     y compris file_path (usage interne uniquement, jamais renvoyé au client).
//     Ne renvoyer que les ressources publiées : is_active = TRUE.
//   incrementerTelechargements(id) -> Promise<void>
//   findDoublon({ fileChecksum, titre, niveau, matiere, type, annee }) -> Promise<ligne | null>  (BR09)
//
// Connexion : import { pool } from '../../config/database.js';
// =============================================================================

export async function findRessourceById(id) {
  throw new Error('findRessourceById : non implémenté (TODO Emmanuel)');
}

export async function incrementerTelechargements(id) {
  throw new Error('incrementerTelechargements : non implémenté (TODO Emmanuel)');
}

export async function findDoublon(criteres) {
  throw new Error('findDoublon : non implémenté (TODO Emmanuel)');
}
