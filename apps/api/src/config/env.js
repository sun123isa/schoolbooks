// =============================================================================
// Socle backend — configuration lue depuis les variables d'environnement
// Responsable : Isaac LELO MAKAYA — relecture : Salem KONGOLO
// Toute nouvelle variable est ajoutée ici ET dans apps/api/.env.example.
// =============================================================================
import path from 'path';
import { fileURLToPath } from 'url';

const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  // Dossier racine des PDF du catalogue, hors Git. Les colonnes books.file_path
  // des ressources sont relatives à ce dossier (ex : « ressources/bac-c-2023.pdf »).
  storageDir: path.resolve(apiRoot, process.env.STORAGE_DIR || 'storage')
};
