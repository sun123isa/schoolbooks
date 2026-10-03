// =============================================================================
// Module BOOKS (historique, antérieur au MVP « ressources ») — /api/books
// Responsable : Emmanuel AYA (catalogue) — relecture : Salem KONGOLO
// Code conservé tel quel. Les nouvelles fonctionnalités passent par les modules
// referentiels, recherche et ressources. POST /api/books (upload) est hors MVP
// pour les utilisateurs : il pourra servir de base à l'intégration au catalogue.
// =============================================================================
import path from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { fileURLToPath } from 'url';
import * as booksService from './books.service.js';

// __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/books
// Liste les livres avec filtres optionnels (level, subject, q).
export async function listBooksController(req, res, next) {
  try {
    // On récupère les query params bruts.
    const rawQuery = req.query || {};

    // Validation très simple : on ne garde que des chaînes ou undefined.
    const level =
      typeof rawQuery.level === 'string' && rawQuery.level.trim() !== ''
        ? rawQuery.level.trim()
        : undefined;

    const subject =
      typeof rawQuery.subject === 'string' && rawQuery.subject.trim() !== ''
        ? rawQuery.subject.trim()
        : undefined;

    const q =
      typeof rawQuery.q === 'string' && rawQuery.q.trim() !== ''
        ? rawQuery.q.trim()
        : undefined;

    const books = await booksService.listBooks({ level, subject, q });

    res.json({
      success: true,
      data: {
        items: books,
        count: books.length
      }
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/books/:id
// Récupère les détails d'un livre.
export async function getBookController(req, res, next) {
  try {
    const { id } = req.params;

    const book = await booksService.getBookById(id);

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/books/:id/download
// Télécharge le fichier PDF du livre.
export async function downloadBookController(req, res, next) {
  try {
    const { id } = req.params;

    // On récupère le livre pour avoir son file_path.
    const book = await booksService.getBookById(id);

    // Chemin absolu vers le fichier PDF.
    const rootDir = path.resolve(__dirname, '../../../');
    const filePath = path.join(rootDir, book.file_path);

    // Vérifie que le fichier existe.
    try {
      await fs.access(filePath);
    } catch {
      const err = new Error('Fichier non trouvé sur le serveur');
      err.status = 404;
      err.code = 'FILE_NOT_FOUND';
      throw err;
    }

    // Incrémenter le compteur de téléchargements.
    await booksService.incrementDownloadCount(id);

    // Envoi du fichier avec les bons en-têtes.
    res.setHeader('Content-Type', book.mime_type || 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${book.file_name}"`
    );

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
}

// POST /api/books
// Crée un nouveau livre (avec upload de PDF).
export async function createBookController(req, res, next) {
  try {
    // req.file vient de multer (fichier PDF uploadé).
    // req.body vient du formulaire (champs texte).
    const { title, author, isbn, category, description, level, subject } = req.body;

    if (!req.file) {
      const err = new Error('Aucun fichier PDF fourni');
      err.status = 400;
      err.code = 'FILE_REQUIRED';
      throw err;
    }

    // Construction des informations de fichier.
    const file_name = req.file.filename;
    const file_path = req.file.path.replace(/\\/g, '/'); // normaliser pour Windows
    const file_size = req.file.size;
    const mime_type = req.file.mimetype;

    const newBook = await booksService.createBook({
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
      trainer_id: null // on pourra ajouter l'authentification plus tard
    });

    res.status(201).json({
      success: true,
      data: newBook
    });
  } catch (error) {
    next(error);
  }
}