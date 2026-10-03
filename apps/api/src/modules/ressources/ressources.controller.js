// =============================================================================
// Module RESSOURCES — contrôleurs
// Responsable : Emmanuel AYA — relecture : Salem KONGOLO
// Détail : { success: true, data: RessourceDetail } (packages/shared/src/contract/ressources.schema.js)
// Fichiers : flux PDF binaire ; en cas d'erreur, JSON au format d'erreur commun.
// =============================================================================
import * as service from './ressources.service.js';

// En-têtes communs aux deux routes de fichier : pas de mise en cache partagée,
// pas d'interprétation du contenu par le navigateur (BR10, protection des documents).
const ENTETES_FICHIER = {
  'Content-Type': 'application/pdf',
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff'
};

export async function obtenirRessource(req, res) {
  res.json({ success: true, data: await service.obtenirRessource(req.valid.params.id) });
}

export async function consulterFichier(req, res) {
  const fichier = await service.obtenirFichierConsultable(req.valid.params.id);
  res.set({
    ...ENTETES_FICHIER,
    'Content-Disposition': `inline; filename="${fichier.nomFichier}"`
  });
  res.sendFile(fichier.cheminAbsolu);
}

export async function telechargerFichier(req, res) {
  const fichier = await service.obtenirFichierTelechargeable(req.valid.params.id);
  res.set(ENTETES_FICHIER);
  res.download(fichier.cheminAbsolu, fichier.nomFichier);
}
