// =============================================================================
// Module RÉFÉRENTIELS — repository (requêtes SQL uniquement, aucune logique métier)
// Responsable : Isaac LELO MAKAYA — relecture : Salem KONGOLO
// ÉTAT : SQUELETTE — requêtes prêtes à brancher dans referentiels.service.js.
// Tables : levels, tracks, subjects, document_types (database/migrations/004).
// Les colonnes SQL sont en anglais (convention existante) ; le repository
// renvoie directement les noms du contrat (code, libelle, niveau, requiertAnnee).
// =============================================================================
import { pool } from '../../config/database.js';

export async function findNiveaux() {
  const { rows } = await pool.query(
    'SELECT code, label AS libelle FROM levels ORDER BY sort_order, label'
  );
  return rows;
}

// Renvoie null si le niveau n'existe pas (pour distinguer « aucun » de « inconnu »).
export async function findFilieresByNiveau(codeNiveau) {
  const niveau = await pool.query('SELECT id FROM levels WHERE code = $1', [codeNiveau]);
  if (niveau.rowCount === 0) return null;
  const { rows } = await pool.query(
    `SELECT t.code, t.label AS libelle, $1::text AS niveau
       FROM tracks t
      WHERE t.level_id = $2
      ORDER BY t.sort_order, t.label`,
    [codeNiveau, niveau.rows[0].id]
  );
  return rows;
}

export async function findMatieres() {
  const { rows } = await pool.query('SELECT code, label AS libelle FROM subjects ORDER BY label');
  return rows;
}

// Uniquement les années des ressources publiées (mêmes conditions que la recherche).
export async function findAnnees() {
  const { rows } = await pool.query(
    `SELECT DISTINCT year AS annee
       FROM books
      WHERE is_active = TRUE AND level_id IS NOT NULL AND year IS NOT NULL
      ORDER BY year DESC`
  );
  return rows.map((row) => row.annee);
}

export async function findTypesDocuments() {
  const { rows } = await pool.query(
    'SELECT code, label AS libelle, requires_year AS "requiertAnnee" FROM document_types ORDER BY sort_order, label'
  );
  return rows;
}
