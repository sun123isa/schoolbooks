// =============================================================================
// Socle frontend — page 404 (URL inconnue)
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// =============================================================================
import { Link } from 'react-router-dom';
import { ROUTES } from '../../app/routes.js';

export function NotFoundPage() {
  return (
    <section>
      <h1>Page introuvable</h1>
      <p>
        Cette page n'existe pas. <Link to={ROUTES.accueil}>Retour à l'accueil</Link>
      </p>
    </section>
  );
}
