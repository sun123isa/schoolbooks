// =============================================================================
// Landing page — route « / »
// Responsable : HIRWA Jean Baptiste — relecture : Salem KONGOLO
// Ticket Jira : « Parcours utilisateur : accéder aux ressources adaptées »
// ÉTAT : SQUELETTE — parcours niveau → série/filière → recherche fonctionnel, sans design.
// TODO (Jean Baptiste) :
//   - sections de présentation : problème, solution, types de ressources,
//     fonctionnement en quelques étapes (composants dans ./components/) ;
//   - remplacer les listes par un sélecteur de niveau puis de série/filière ;
//   - message invitant à choisir un niveau si l'utilisateur continue sans niveau ;
//   - responsive (ordinateur, tablette, smartphone).
// =============================================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cheminRecherche } from '../../app/routes.js';
import { useApi } from '../../shared/hooks/useApi.js';
import { ErrorMessage, Loader } from '../../shared/components/StatusMessages.jsx';
import { fetchFilieres, fetchNiveaux } from './landing.api.js';

function ChoixFiliere({ niveau }) {
  const filieres = useApi((signal) => fetchFilieres(niveau.code, signal), [niveau.code]);

  if (filieres.isLoading) return <Loader label="Chargement des séries/filières…" />;
  if (filieres.error) return <ErrorMessage error={filieres.error} onRetry={filieres.reload} />;

  return (
    <ul>
      <li>
        <Link to={cheminRecherche({ niveau: niveau.code })}>Tout le niveau {niveau.libelle}</Link>
      </li>
      {filieres.data.map((filiere) => (
        <li key={filiere.code}>
          <Link to={cheminRecherche({ niveau: niveau.code, filiere: filiere.code })}>{filiere.libelle}</Link>
        </li>
      ))}
    </ul>
  );
}

export function LandingPage() {
  const niveaux = useApi((signal) => fetchNiveaux(signal), []);
  const [niveauChoisi, setNiveauChoisi] = useState(null);

  return (
    <section>
      <h1>Trouvez vos sujets d'examens et ressources en quelques clics</h1>
      <p>Choisissez votre niveau, puis votre série ou filière.</p>

      {niveaux.isLoading && <Loader label="Chargement des niveaux…" />}
      {niveaux.error && <ErrorMessage error={niveaux.error} onRetry={niveaux.reload} />}
      {niveaux.data && (
        <div role="group" aria-label="Choix du niveau">
          {niveaux.data.map((niveau) => (
            <button
              key={niveau.code}
              type="button"
              aria-pressed={niveauChoisi?.code === niveau.code}
              onClick={() => setNiveauChoisi(niveau)}
            >
              {niveau.libelle}
            </button>
          ))}
        </div>
      )}

      {niveauChoisi ? <ChoixFiliere niveau={niveauChoisi} /> : <p>Sélectionnez un niveau pour continuer.</p>}
    </section>
  );
}
