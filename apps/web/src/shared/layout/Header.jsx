// =============================================================================
// Socle frontend — en-tête et navigation principale
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// TODO (Jean Baptiste) : logo, menu responsive (smartphone), lien d'évitement clavier.
// =============================================================================
import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '../../app/routes.js';

export function Header() {
  return (
    <header className="layout__header">
      <Link to={ROUTES.accueil} className="layout__brand">
        Schoolbooks
      </Link>
      <nav aria-label="Navigation principale" className="layout__nav">
        <NavLink to={ROUTES.accueil} end>
          Accueil
        </NavLink>
        <NavLink to={ROUTES.recherche}>Rechercher une ressource</NavLink>
      </nav>
    </header>
  );
}
