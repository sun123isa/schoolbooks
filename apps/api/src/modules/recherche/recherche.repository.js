// =============================================================================
// Module RECHERCHE — repository (requêtes SQL uniquement)
// Responsable : Salem KONGOLO — relecture : HIRWA Jean Baptiste
// ÉTAT : À IMPLÉMENTER.
//
// Signature attendue :
//   rechercherRessources(query) -> Promise<{ rows: RessourceResume[], total: number }>
//   où query = sortie de RechercheQuerySchema (q, niveau, filiere, matiere,
//   annee, type, page, limit, tri) déjà validée.
//
// Repères :
//   - table books jointe à levels, tracks, subjects, document_types (migrations 003 à 005) ;
//   - conditions de publication : is_active = TRUE AND level_id, subject_id,
//     document_type_id IS NOT NULL ;
//   - filtres sur les codes (l.code = $n, t.code = $n, ...) et year = $n ;
//   - mot-clé : ILIKE sur title et description (ou recherche plein texte) ;
//   - pagination : LIMIT $n OFFSET $n ; total : COUNT(*) OVER() ou requête séparée ;
//   - toujours des requêtes paramétrées ($1, $2...), jamais de concaténation de valeurs ;
//   - renvoyer les champs au format du contrat (titre, niveau { code, libelle }, ...).
//   - connexion : import { pool } from '../../config/database.js';
// =============================================================================

export async function rechercherRessources(query) {
  throw new Error('rechercherRessources : non implémenté (TODO Salem)');
}
