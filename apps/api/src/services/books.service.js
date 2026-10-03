import {
  listBooks as listBooksRepo,
  getBookById as getBookByIdRepo,
  createBook as createBookRepo,
  incrementDownloadCount as incrementDownloadCountRepo
} from '../repositories/books.repository.js';

// Le service contient la logique métier liée aux livres.
// Il utilise le repository pour accéder aux données.

// Liste les livres avec filtres optionnels.
export async function listBooks(filters) {
  // Ici, on pourrait ajouter de la logique supplémentaire :
  // - vérifier des permissions,
  // - transformer les données,
  // - appliquer des règles métier.
  return listBooksRepo(filters);
}

// Récupère un livre par son ID.
export async function getBookById(id) {
  const book = await getBookByIdRepo(id);

  if (!book) {
    const err = new Error('Livre non trouvé');
    err.status = 404;
    err.code = 'BOOK_NOT_FOUND';
    throw err;
  }

  return book;
}

// Crée un nouveau livre.
// data contient les champs validés + les informations du fichier uploadé.
export async function createBook(data) {
  // On pourrait ici :
  // - vérifier que le formateur existe,
  // - vérifier des quotas, etc.
  return createBookRepo(data);
}

// Incrémenter le compteur de téléchargements.
export async function incrementDownloadCount(id) {
  await incrementDownloadCountRepo(id);
}