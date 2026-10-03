// =============================================================================
// Module RESSOURCES — accès au stockage des PDF
// Responsable : Emmanuel AYA — relecture : Salem KONGOLO
// Les PDF sont stockés sur disque, hors Git, sous env.storageDir (STORAGE_DIR).
// Ils ne sont JAMAIS servis en statique : uniquement via les routes /fichier et
// /telechargement, après vérification des droits (BR08, BR10).
// =============================================================================
import fs from 'fs/promises';
import path from 'path';
import { env } from '../../config/env.js';

// Convertit un chemin relatif (books.file_path) en chemin absolu, en refusant
// toute sortie du dossier de stockage (« ../ », chemin absolu...).
export function resoudreChemin(cheminRelatif) {
  const absolu = path.resolve(env.storageDir, cheminRelatif);
  if (!absolu.startsWith(env.storageDir + path.sep)) {
    throw new Error(`Chemin de fichier hors du stockage : ${cheminRelatif}`);
  }
  return absolu;
}

// BR06 — true si le fichier existe et est lisible.
export async function fichierLisible(cheminRelatif) {
  try {
    await fs.access(resoudreChemin(cheminRelatif), fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}
