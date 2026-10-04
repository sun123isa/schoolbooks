// =============================================================================
// Module RECHERCHE — service
// Responsable : Salem KONGOLO — relecture : HIRWA Jean Baptiste
// ÉTAT : SQUELETTE — la recherche s'appuie sur rechercherRessourcesMock.
// TODO (Salem) :
//   1. implémenter recherche.repository.js (requête paramétrée + COUNT) ;
//   2. remplacer l'appel au mock par le repository et construire la réponse
//      { items, total, page, limit, totalPages, filtres, tri, message } ;
//   3. BR07 : chaque filtre fourni restreint strictement les résultats ;
//   4. n'exposer que les ressources publiées et complètes (is_active, niveau,
//      matière et type renseignés — BR01/BR03/BR05) ;
//   5. ajouter les index nécessaires (migration dédiée) pour la performance.
// =============================================================================
import { MESSAGE_AUCUN_RESULTAT } from '@schoolbooks/shared';
import { rechercherRessourcesMock } from '@schoolbooks/shared/mocks';
import { verifierCompatibiliteFiliere } from '../referentiels/referentiels.service.js';

export async function rechercher(query) {
  // BR02 : une filière incompatible avec le niveau est une erreur explicite (400).
  await verifierCompatibiliteFiliere(query.niveau, query.filiere);

  const resultat = rechercherRessourcesMock(query);
  return {
    ...resultat,
    message: resultat.total === 0 ? MESSAGE_AUCUN_RESULTAT : null
  };
}
