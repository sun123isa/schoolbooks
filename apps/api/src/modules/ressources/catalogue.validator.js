// =============================================================================
// Module RESSOURCES — validation d'une ressource avant intégration au catalogue
// Responsable : Emmanuel AYA — relecture : Salem KONGOLO
// ÉTAT : SQUELETTE — le schéma couvre BR01/BR03/BR05/BR10 ; restent à écrire
// les contrôles qui nécessitent la base (voir validerRessourceCatalogue).
// Utilisé par l'intégration au catalogue (script d'import ou route
// d'administration, à décider) ; pas exposé aux utilisateurs (hors MVP).
// =============================================================================
import { z } from 'zod';
import { CodeSchema } from '@schoolbooks/shared';

export const RessourceCatalogueSchema = z.object({
  titre: z.string().trim().min(3).max(255),
  description: z.string().trim().optional(),
  auteur: z.string().trim().max(255).optional(),
  niveau: CodeSchema, // BR01 — obligatoire
  filiere: CodeSchema.optional(), // BR02 — compatibilité vérifiée plus bas
  matiere: CodeSchema, // BR03 — obligatoire
  type: CodeSchema, // BR05 — obligatoire
  annee: z.number().int().min(1950).max(2100).optional(), // BR04 — obligatoire selon le type
  telechargeable: z.boolean(),
  droits: z.string().trim().min(3) // BR10 — source / licence / ayant droit obligatoire
});

// TODO (Emmanuel) : à compléter, en s'appuyant sur referentiels.service.js et ressources.repository.js :
//   - BR01/BR03/BR05 : les codes niveau, matière et type existent ;
//   - BR02 : verifierCompatibiliteFiliere(niveau, filiere) ;
//   - BR04 : annee obligatoire si le type a requiertAnnee = true ;
//   - BR06 : le fichier est un PDF lisible (fichierLisible) ;
//   - BR09 : aucun doublon (même empreinte SHA-256, ou même titre/niveau/matière/type/année).
// Erreurs : RESSOURCE_INCOMPLETE (422) et DOUBLON (409) — voir ERROR_CODES.
export async function validerRessourceCatalogue(donnees) {
  return RessourceCatalogueSchema.parse(donnees);
}
