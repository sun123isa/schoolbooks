// =============================================================================
// Socle frontend — racine de l'application
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// =============================================================================
import { RouterProvider } from 'react-router-dom';
import { router } from './router.jsx';

export function App() {
  return <RouterProvider router={router} />;
}
