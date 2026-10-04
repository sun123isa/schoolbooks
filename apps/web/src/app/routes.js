// =============================================================================
// Socle frontend — chemins des pages
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// Toujours construire les liens avec ces fonctions (jamais de chaîne en dur),
// pour qu'un changement de route ne casse pas les autres pages.
// =============================================================================

export const ROUTES = {
  accueil: '/', // Landing page — Jean Baptiste
  recherche: '/recherche', // Recherche — Graciel
  ressource: '/ressources/:id' // Consultation — Karene
};

// /recherche?niveau=lycee&filiere=serie-c — mêmes noms de paramètres que l'API.
export function cheminRecherche(criteres = {}) {
  const params = new URLSearchParams();
  for (const [cle, valeur] of Object.entries(criteres)) {
    if (valeur !== undefined && valeur !== null && String(valeur) !== '') {
      params.set(cle, String(valeur));
    }
  }
  const qs = params.toString();
  return `${ROUTES.recherche}${qs ? `?${qs}` : ''}`;
}

// /ressources/:id — pour permettre le retour aux mêmes résultats, la page de
// recherche passe sa query string dans l'état de navigation :
//   <Link to={cheminRessource(id)} state={{ retour: location.search }}>
// et la page de consultation revient vers cheminRetourRecherche(location.state).
export function cheminRessource(id) {
  return ROUTES.ressource.replace(':id', encodeURIComponent(id));
}

// Lien « Retour aux résultats » : recherche d'origine si connue, sinon recherche vide.
export function cheminRetourRecherche(etatNavigation) {
  const retour = etatNavigation?.retour;
  return typeof retour === 'string' && retour.startsWith('?') ? `${ROUTES.recherche}${retour}` : ROUTES.recherche;
}
