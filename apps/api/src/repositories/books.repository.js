import { pool } from '../config/database.js';

// Le repository contient uniquement les requêtes SQL liées aux livres.
// Il ne contient pas de logique métier, juste l'accès à PostgreSQL.

// Récupère tous les livres, avec filtres optionnels (niveau, matière, recherche).
export async function listBooks({ level, subject, q } = {}) {
  // On construit la requête de base.
  let query = `
    SELECT
      id,
      title,
      author,
      isbn,
      category,
      description,
      level,
      subject,
      file_name,
      file_size,
      mime_type,
      download_count,
      is_active,
      trainer_id,
      created_at,
      updated_at
    FROM books
    WHERE is_active = TRUE
  `;

  const values = [];
  let conditionIndex = 1;

  // Filtre par niveau si fourni.
  if (level) {
    query += ` AND level = $${conditionIndex}`;
    values.push(level);
    conditionIndex++;
  }

  // Filtre par matière si fourni.
  if (subject) {
    query += ` AND subject = $${conditionIndex}`;
    values.push(subject);
    conditionIndex++;
  }

  // Recherche textuelle sur titre et description si q est fourni.
  if (q && q.trim().length > 0) {
    query += ` AND (
      title ILIKE $${conditionIndex}
      OR description ILIKE $${conditionIndex}
    )`;
    values.push(`%${q}%`);
    conditionIndex++;
  }

  // Tri par titre, puis par niveau.
  query += ' ORDER BY title ASC, level ASC';

  const result = await pool.query(query, values);
  return result.rows;
}

// Récupère un livre par son identifiant UUID.
export async function getBookById(id) {
  const query = `
    SELECT
      id,
      title,
      author,
      isbn,
      category,
      description,
      level,
      subject,
      file_name,
      file_path,
      file_size,
      mime_type,
      download_count,
      is_active,
      trainer_id,
      created_at,
      updated_at
    FROM books
    WHERE id = $1
  `;

  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

// Crée un nouveau livre dans la base.
// Les paramètres correspondent aux champs de la table books.
export async function createBook({
  title,
  author,
  isbn,
  category,
  description,
  level,
  subject,
  file_name,
  file_path,
  file_size,
  mime_type,
  trainer_id
}) {
  const query = `
    INSERT INTO books (
      title,
      author,
      isbn,
      category,
      description,
      level,
      subject,
      file_name,
      file_path,
      file_size,
      mime_type,
      download_count,
      is_active,
      trainer_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `;

  const values = [
    title,
    author || null,
    isbn || null,
    category || null,
    description || null,
    level,
    subject,
    file_name,
    file_path,
    file_size || null,
    mime_type || 'application/pdf',
    0, // download_count initial à 0
    true, // is_active par défaut
    trainer_id || null
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Incrémenter le compteur de téléchargements d'un livre.
export async function incrementDownloadCount(id) {
  const query = `
    UPDATE books
    SET download_count = download_count + 1
    WHERE id = $1
  `;

  await pool.query(query, [id]);
}