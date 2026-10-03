// =============================================================================
// Socle frontend — états communs : chargement, erreur, aucun résultat
// Responsable : HIRWA Jean Baptiste (Lead Dev) — relecture : Salem KONGOLO
// À réutiliser dans toutes les pages pour une interface homogène.
// =============================================================================

export function Loader({ label = 'Chargement…' }) {
  return (
    <p className="etat" role="status" aria-live="polite">
      {label}
    </p>
  );
}

// Messages lisibles par code d'erreur (ERROR_CODES du contrat). Une page peut
// fournir son propre message via la prop `message`.
const MESSAGES = {
  RESEAU: 'Impossible de joindre le serveur. Vérifiez votre connexion puis réessayez.',
  RESSOURCE_INTROUVABLE: "Cette ressource n'existe pas ou n'est plus disponible.",
  FICHIER_INDISPONIBLE: 'Le document de cette ressource est momentanément inaccessible.',
  TELECHARGEMENT_NON_AUTORISE: "Cette ressource peut être consultée mais pas téléchargée.",
  VALIDATION_ERROR: 'Certains critères de recherche sont invalides.',
  FILIERE_INCOMPATIBLE: "La série/filière choisie ne correspond pas au niveau sélectionné."
};

export function ErrorMessage({ error, message, onRetry }) {
  const texte = message ?? MESSAGES[error?.code] ?? 'Une erreur inattendue est survenue.';
  return (
    <div className="etat etat--erreur" role="alert">
      <p>{texte}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
}

export function EmptyState({ children }) {
  return <div className="etat">{children}</div>;
}
