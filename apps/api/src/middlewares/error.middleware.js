// Middleware centralisé pour gérer les erreurs dans toute l'API.
// Il évite de répéter try/catch + res.status dans chaque contrôleur.

export function errorMiddleware(err, req, res, next) {
  // En développement, on affiche l'erreur complète dans les logs.
  console.error('Erreur API:', err);

  // Si l'erreur a déjà un statut HTTP, on l'utilise.
  const status = err.status || err.statusCode || 500;

  // Message d'erreur envoyé au client.
  const message = err.message || 'Erreur interne du serveur';

  // En production, on n'expose pas les détails techniques (stack trace).
  res.status(status).json({
    success: false,
    error: {
      message,
      // Optionnel : on peut ajouter un code d'erreur métier plus tard.
      code: err.code || 'INTERNAL_ERROR'
    }
  });
}