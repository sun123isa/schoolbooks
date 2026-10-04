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

import { pool } from '../../config/database.js';

export async function rechercherRessources(query) {
  const {
    q,
    niveau,
    filiere,
    matiere,
    annee,
    type,
    page,
    limit,
    tri
  } = query;

  const conditions = [
    'b.is_active = TRUE',
    'b.level_id IS NOT NULL',
    'b.subject_id IS NOT NULL',
    'b.document_type_id IS NOT NULL'
  ];

  const params = [];

  if (q) {
    params.push(`%${q}%`);
    const qParam = `$${params.length}`;

    conditions.push(`
      (
        unaccent(lower(b.title)) LIKE unaccent(lower(${qParam}))
        OR unaccent(lower(COALESCE(b.description, ''))) LIKE unaccent(lower(${qParam}))
      )
    `);
  }

  if (niveau) {
    params.push(niveau);
    conditions.push(`l.code = $${params.length}`);
  }

  if (filiere) {
    params.push(filiere);
    conditions.push(`t.code = $${params.length}`);
  }

  if (matiere) {
    params.push(matiere);
    conditions.push(`s.code = $${params.length}`);
  }

  if (annee) {
    params.push(annee);
    conditions.push(`b.year = $${params.length}`);
  }

  if (type) {
    params.push(type);
    conditions.push(`d.code = $${params.length}`);
  }

  let orderBy;

  switch (tri) {
    case 'titre':
      orderBy = 'b.title ASC, b.id ASC';
      break;

    case 'recent':
      orderBy = 'b.created_at DESC, b.id DESC';
      break;

    case 'pertinence':
    default:
      if (q) {
        orderBy = `
          CASE
            WHEN unaccent(lower(b.title)) LIKE unaccent(lower($1)) THEN 0
            ELSE 1
          END,
          b.created_at DESC,
          b.id DESC
        `;
      } else {
        orderBy = 'b.created_at DESC, b.id DESC';
      }
      break;
  }

  const offset = (page - 1) * limit;

  params.push(limit);
  const limitParam = `$${params.length}`;

  params.push(offset);
  const offsetParam = `$${params.length}`;

  const sql = `
    SELECT
      b.id,
      b.title AS titre,

      json_build_object(
        'code', l.code,
        'libelle', l.label
      ) AS niveau,

      CASE
        WHEN t.id IS NULL THEN NULL
        ELSE json_build_object(
          'code', t.code,
          'libelle', t.label
        )
      END AS filiere,

      json_build_object(
        'code', s.code,
        'libelle', s.label
      ) AS matiere,

      json_build_object(
        'code', d.code,
        'libelle', d.label
      ) AS type,

      b.year AS annee,
      'PDF' AS format,
      b.is_downloadable AS telechargeable,

      COUNT(*) OVER() AS total_count

    FROM books b

    INNER JOIN levels l
      ON l.id = b.level_id

    LEFT JOIN tracks t
      ON t.id = b.track_id
      AND t.level_id = b.level_id

    INNER JOIN subjects s
      ON s.id = b.subject_id

    INNER JOIN document_types d
      ON d.id = b.document_type_id

    WHERE ${conditions.join('\n      AND ')}

    ORDER BY ${orderBy}

    LIMIT ${limitParam}
    OFFSET ${offsetParam}
  `;

  const result = await pool.query(sql, params);

  const total = result.rows.length > 0
    ? Number(result.rows[0].total_count)
    : 0;

  const rows = result.rows.map(({ total_count, ...row }) => row);

  return {
    rows,
    total
  };
}
