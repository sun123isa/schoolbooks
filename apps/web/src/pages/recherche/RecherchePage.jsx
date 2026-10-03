// =============================================================================
// Page de recherche — route « /recherche »
// Responsable : Graciel MBEMBA — relecture : Salem KONGOLO
// Tickets Jira : « Recherche par mot-clé », « Filtres par niveau, série/filière,
// matière, année, type », « Résultats de recherche », « Message en l'absence de résultat »
// ÉTAT : SQUELETTE — lecture des critères dans l'URL, appel de l'API, liste brute.
// TODO (Graciel) :
//   - barre de recherche par mot-clé (critère q) ;
//   - panneau de filtres (niveau, série/filière dépendant du niveau, matière,
//     année, type) alimenté par fetchReferentielsFiltres / fetchFilieres ;
//   - cartes de résultats (./components/) menant à la fiche, avec titre, niveau,
//     série/filière, matière, année, type ;
//   - pagination (ou chargement progressif) et tri ;
//   - états : chargement, erreur, aucun résultat (data.message) ;
//   - responsive.
// =============================================================================
import { Link, useLocation } from 'react-router-dom';
import { cheminRessource } from '../../app/routes.js';
import { useApi } from '../../shared/hooks/useApi.js';
import { EmptyState, ErrorMessage, Loader } from '../../shared/components/StatusMessages.jsx';
import { rechercherRessources } from './recherche.api.js';
import { useCriteresUrl } from './useCriteresUrl.js';

export function RecherchePage() {
  const location = useLocation();
  const { criteres, modifierCriteres } = useCriteresUrl();
  const resultats = useApi((signal) => rechercherRessources(criteres, signal), [location.search]);

  return (
    <section>
      <h1>Rechercher une ressource</h1>

      <form
        key={criteres.q ?? ''}
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          modifierCriteres({ q: new FormData(event.currentTarget).get('q') });
        }}
      >
        <input name="q" type="search" defaultValue={criteres.q ?? ''} placeholder="Mot-clé, matière, année…" aria-label="Mot-clé" />
        <button type="submit">Rechercher</button>
      </form>

      {resultats.isLoading && <Loader label="Recherche en cours…" />}
      {resultats.error && <ErrorMessage error={resultats.error} onRetry={resultats.reload} />}
      {resultats.data && resultats.data.total === 0 && <EmptyState>{resultats.data.message}</EmptyState>}
      {resultats.data && resultats.data.total > 0 && (
        <>
          <p>{resultats.data.total} ressource(s) trouvée(s)</p>
          <ul>
            {resultats.data.items.map((ressource) => (
              <li key={ressource.id}>
                <Link to={cheminRessource(ressource.id)} state={{ retour: location.search }}>
                  {ressource.titre}
                </Link>{' '}
                — {ressource.niveau.libelle} · {ressource.matiere.libelle} · {ressource.type.libelle}
                {ressource.annee ? ` · ${ressource.annee}` : ''}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
