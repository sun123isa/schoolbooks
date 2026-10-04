// =============================================================================
// Module RESSOURCES — service
// Responsable : Emmanuel AYA — relecture : Salem KONGOLO
// ÉTAT : SQUELETTE — détail issu des mocks, fichier = PDF d'exemple (fixtures/).
// TODO (Emmanuel) :
//   1. implémenter ressources.repository.js et remplacer trouverRessourceMock ;
//   2. calculer `disponible` en vérifiant que le fichier existe et est lisible
//      dans le stockage (storage.js) — BR06 ;
//   3. servir le vrai fichier (books.file_path) au lieu de la fixture ;
//   4. ne jamais exposer file_path ni le chemin disque dans les réponses ;
//   5. incrémenter books.download_count après un téléchargement réussi.
// =============================================================================
import path from 'path';
import { fileURLToPath } from 'url';
import { ERROR_CODES } from '@schoolbooks/shared';
import { trouverRessourceMock } from '@schoolbooks/shared/mocks';
import { HttpError } from '../../utils/http-error.js';

const FICHIER_EXEMPLE = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures',
  'exemple.pdf'
);

// Nom proposé au navigateur : dérivé du titre, sans caractère problématique.
function nomDeFichier(ressource) {
  const base = ressource.titre
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
  return `${base || 'ressource'}.pdf`;
}

// RESSOURCE_INTROUVABLE (404) si l'id est inconnu ou la ressource retirée.
export async function obtenirRessource(id) {
  const ressource = trouverRessourceMock(id);
  if (!ressource) {
    throw new HttpError(404, ERROR_CODES.RESSOURCE_INTROUVABLE, "Cette ressource n'existe pas ou n'est plus disponible.");
  }
  return ressource;
}

// BR06 — FICHIER_INDISPONIBLE (404) si le PDF ne peut pas être ouvert.
export async function obtenirFichierConsultable(id) {
  const ressource = await obtenirRessource(id);
  if (!ressource.disponible) {
    throw new HttpError(404, ERROR_CODES.FICHIER_INDISPONIBLE, 'Le document PDF de cette ressource est inaccessible.');
  }
  return { cheminAbsolu: FICHIER_EXEMPLE, nomFichier: nomDeFichier(ressource) };
}

// BR08 — TELECHARGEMENT_NON_AUTORISE (403) si la ressource n'est pas téléchargeable.
export async function obtenirFichierTelechargeable(id) {
  const fichier = await obtenirFichierConsultable(id);
  const ressource = await obtenirRessource(id);
  if (!ressource.telechargeable) {
    throw new HttpError(403, ERROR_CODES.TELECHARGEMENT_NON_AUTORISE, "Cette ressource est consultable en ligne mais n'est pas téléchargeable.");
  }
  return fichier;
}
