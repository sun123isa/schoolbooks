// =============================================================================
// Page de consultation — route « /ressources/:id »
// Responsable : Karene MOUSSOUNDA — relecture : Salem KONGOLO
// Tickets Jira : « Consulter la fiche d'une ressource »,
// « Télécharger uniquement les documents disponibles au téléchargement »
// ÉTAT : SQUELETTE — chargement du détail, métadonnées brutes, lien de retour.
// TODO (Karene) :
//   - fiche : titre, niveau, série/filière, matière, année, type, format ;
//   - visionneuse PDF intégrée (./components/) : zoom, navigation entre pages,
//     plein écran, à partir de data.urls.fichier. Ne pas utiliser la visionneuse
//     native du navigateur (elle propose son propre bouton de téléchargement, BR08) ;
//   - bouton « Télécharger » affiché UNIQUEMENT si data.telechargeable et
//     data.urls.telechargement (BR08) ;
//   - messages adaptés : ressource introuvable (RESSOURCE_INTROUVABLE),
//     PDF inaccessible (data.disponible = false ou échec de chargement) ;
//   - responsive.
// =============================================================================
import { Link, useLocation, useParams } from 'react-router-dom';
import { cheminRetourRecherche } from '../../app/routes.js';
import { useApi } from '../../shared/hooks/useApi.js';
import { EmptyState, ErrorMessage, Loader } from '../../shared/components/StatusMessages.jsx';
import { fetchRessource } from './ressource.api.js';

export function RessourcePage() {
  const { id } = useParams();
  const location = useLocation();
  const ressource = useApi((signal) => fetchRessource(id, signal), [id]);
  const data = ressource.data;

  return (
    <section>
      <p>
        <Link to={cheminRetourRecherche(location.state)}>← Retour aux résultats</Link>
      </p>

      {ressource.isLoading && <Loader label="Chargement de la ressource…" />}
      {ressource.error && <ErrorMessage error={ressource.error} />}
      {data && (
        <article>
          <h1>{data.titre}</h1>
          <dl>
            <dt>Niveau</dt>
            <dd>{data.niveau.libelle}</dd>
            <dt>Série / filière</dt>
            <dd>{data.filiere?.libelle ?? '—'}</dd>
            <dt>Matière</dt>
            <dd>{data.matiere.libelle}</dd>
            <dt>Année</dt>
            <dd>{data.annee ?? '—'}</dd>
            <dt>Type</dt>
            <dd>{data.type.libelle}</dd>
            <dt>Format</dt>
            <dd>{data.format}</dd>
          </dl>

          {data.disponible ? (
            <EmptyState>Visionneuse PDF à intégrer ici (source : {data.urls.fichier}).</EmptyState>
          ) : (
            <ErrorMessage error={{ code: 'FICHIER_INDISPONIBLE' }} />
          )}

          {data.telechargeable && data.urls.telechargement && (
            <a href={data.urls.telechargement} download>
              Télécharger
            </a>
          )}
        </article>
      )}
    </section>
  );
}
