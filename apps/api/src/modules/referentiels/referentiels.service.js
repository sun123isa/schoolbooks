// =============================================================================
// Module RÉFÉRENTIELS — service (logique métier)
// Responsable : Isaac LELO MAKAYA — relecture : Salem KONGOLO
// ÉTAT : SQUELETTE — renvoie les données fictives de @schoolbooks/shared/mocks.
// TODO (Isaac) : remplacer chaque mock par l'appel au repository correspondant
// (tables levels, tracks, subjects, document_types — migration 004).
// Ce service est aussi utilisé par le module recherche (Salem) pour BR02.
// =============================================================================
import { ERROR_CODES } from '@schoolbooks/shared';
import {
  MATIERES,
  NIVEAUX,
  TYPES_DOCUMENTS,
  listerAnneesMock,
  listerFilieresMock
} from '@schoolbooks/shared/mocks';
import { HttpError } from '../../utils/http-error.js';

export async function listerNiveaux() {
  return NIVEAUX;
}

// Lève NIVEAU_INTROUVABLE (404) si le code de niveau n'existe pas.
export async function listerFilieres(codeNiveau) {
  const filieres = listerFilieresMock(codeNiveau);
  if (filieres === null) {
    throw new HttpError(404, ERROR_CODES.NIVEAU_INTROUVABLE, `Niveau introuvable : ${codeNiveau}`);
  }
  return filieres;
}

export async function listerMatieres() {
  return MATIERES;
}

// Années distinctes des ressources publiées, ordre décroissant.
export async function listerAnnees() {
  return listerAnneesMock();
}

export async function listerTypesDocuments() {
  return TYPES_DOCUMENTS;
}

// BR02 — vérifie qu'une filière appartient bien au niveau donné.
// Lève FILIERE_INCOMPATIBLE (400) sinon. Sans niveau ou sans filière : rien à vérifier.
export async function verifierCompatibiliteFiliere(codeNiveau, codeFiliere) {
  if (!codeNiveau || !codeFiliere) return;
  const filieres = await listerFilieres(codeNiveau);
  if (!filieres.some((filiere) => filiere.code === codeFiliere)) {
    throw new HttpError(
      400,
      ERROR_CODES.FILIERE_INCOMPATIBLE,
      `La série/filière « ${codeFiliere} » n'appartient pas au niveau « ${codeNiveau} »`
    );
  }
}
