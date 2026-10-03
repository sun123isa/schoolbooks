import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  listBooksController,
  getBookController,
  downloadBookController,
  createBookController
} from '../controllers/books.controller.js';
import {
    validateParams,
  validateBody,
  listBooksQuerySchema,
  bookIdParamsSchema,
  createBookBodySchema
} from '../validators/books.validator.js';

const router = express.Router();

// Configuration de multer pour l'upload de PDF.
// On utilise diskStorage pour enregistrer les fichiers sur le disque.
const storage = multer.diskStorage({
  // Destination des fichiers uploadés.
  destination: (req, file, cb) => {
    // Dossier où seront stockés les PDF des livres.
    const uploadDir = 'uploads/books';
    cb(null, uploadDir);
  },
  // Nom du fichier : on génère un UUID + extension .pdf.
  // On ne fait jamais confiance au nom original envoyé par le client.
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}.pdf`;
    cb(null, uniqueName);
  }
});

// Filtre pour n'accepter que les PDF.
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    const err = new Error('Seuls les fichiers PDF sont autorisés');
    err.status = 400;
    err.code = 'INVALID_FILE_TYPE';
    cb(err, false);
  }
};

// Instance de multer avec limites de taille.
const upload = multer({
  storage,
  fileFilter,
  limits: {
    // Taille maximale : 25 Mo.
    fileSize: 25 * 1024 * 1024
  }
});

// GET /api/books
// Liste les livres avec filtres optionnels.
router.get(
  '/',
  listBooksController
);

// GET /api/books/:id
// Récupère un livre par son ID.
router.get(
  '/:id',
  validateParams(bookIdParamsSchema),
  getBookController
);

// GET /api/books/:id/download
// Télécharge le PDF du livre.
router.get(
  '/:id/download',
  validateParams(bookIdParamsSchema),
  downloadBookController
);

// POST /api/books
// Crée un nouveau livre avec upload de PDF.
// Le champ du formulaire doit s'appeler "file".
router.post(
  '/',
  upload.single('file'),
  validateBody(createBookBodySchema),
  createBookController
);

export default router;