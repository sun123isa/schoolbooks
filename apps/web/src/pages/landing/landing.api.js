// =============================================================================
// Landing page — appels API
// Responsable : HIRWA Jean Baptiste — relecture : Salem KONGOLO
// Consomme : GET /api/niveaux, GET /api/niveaux/:code/filieres (module référentiels, Isaac)
// =============================================================================
import { API_ROUTES, ERROR_CODES } from '@schoolbooks/shared';
import { ApiError, apiGet } from '../../shared/api/client.js';

const mocks = () => import('@schoolbooks/shared/mocks');

export function fetchNiveaux(signal) {
  return apiGet(API_ROUTES.niveaux, {
    signal,
    mock: async () => (await mocks()).NIVEAUX
  });
}

export function fetchFilieres(codeNiveau, signal) {
  return apiGet(API_ROUTES.filieresDuNiveau(codeNiveau), {
    signal,
    mock: async () => {
      const filieres = (await mocks()).listerFilieresMock(codeNiveau);
      if (!filieres) throw new ApiError(404, ERROR_CODES.NIVEAU_INTROUVABLE, 'Niveau introuvable');
      return filieres;
    }
  });
}
