// =============================================================================
// Socle frontend — client API
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// Périmètre : unique point d'accès HTTP vers l'API. Les pages n'appellent jamais
// fetch directement : elles passent par leur fichier <page>.api.js, qui utilise
// apiGet(). Gère l'URL de base, la query string, le format d'erreur commun et
// le mode mock (VITE_USE_MOCKS=true) pour travailler sans backend.
// =============================================================================
import { API_PREFIX } from '@schoolbooks/shared';

// En développement, Vite redirige /api vers le backend (voir vite.config.js) :
// frontend et API partagent la même origine (pas de souci CORS ni d'iframe PDF).
export const API_BASE_URL = import.meta.env.VITE_API_URL || API_PREFIX;
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Erreur normalisée : `code` correspond à ERROR_CODES (@schoolbooks/shared).
export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Construit /api/xxx?a=1&b=2 en ignorant les paramètres vides.
export function buildUrl(path, params = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      query.append(key, String(value).trim());
    }
  }
  const qs = query.toString();
  return `${API_BASE_URL}${path}${qs ? `?${qs}` : ''}`;
}

// Transforme un chemin renvoyé par l'API (ex : /api/ressources/:id/fichier) en
// URL utilisable par le navigateur (lien, iframe, visionneuse).
export function resolveApiUrl(apiPath) {
  if (!apiPath) return null;
  if (/^https?:\/\//.test(apiPath)) return apiPath;
  return apiPath.startsWith(API_PREFIX) ? `${API_BASE_URL}${apiPath.slice(API_PREFIX.length)}` : apiPath;
}

/**
 * GET JSON sur l'API. Renvoie directement `data` de l'enveloppe { success, data }.
 * @param {string} path - chemin relatif à /api (utiliser API_ROUTES).
 * @param {{ params?: object, mock?: () => Promise<any>, signal?: AbortSignal }} options
 *   mock : fonction utilisée à la place de l'appel réseau si USE_MOCKS est actif.
 */
export async function apiGet(path, { params, mock, signal } = {}) {
  if (USE_MOCKS && mock) {
    // Petit délai pour rendre visibles les états de chargement.
    await new Promise((resolve) => setTimeout(resolve, 250));
    return mock();
  }

  let response;
  try {
    response = await fetch(buildUrl(path, params), {
      headers: { Accept: 'application/json' },
      signal
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError(0, 'RESEAU', 'Impossible de joindre le serveur. Vérifiez votre connexion.');
  }

  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new ApiError(
      response.status,
      body?.error?.code ?? 'INTERNAL_ERROR',
      body?.error?.message ?? `Erreur HTTP ${response.status}`,
      body?.error?.details
    );
  }
  return body.data;
}
