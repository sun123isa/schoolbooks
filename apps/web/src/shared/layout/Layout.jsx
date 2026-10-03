// =============================================================================
// Socle frontend — gabarit commun à toutes les pages (en-tête, contenu, pied de page)
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// =============================================================================
import { Outlet } from 'react-router-dom';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';
import './layout.css';

export function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main" id="contenu">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
