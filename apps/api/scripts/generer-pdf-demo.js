// =============================================================================
// Script — génération des PDF de démonstration
// Responsable : Isaac LELO MAKAYA (jeu de données de démonstration) — relecture : Salem KONGOLO
// Usage : npm run storage:demo --workspace=apps/api
// Crée, dans STORAGE_DIR, un PDF lisible pour chaque chemin « ressources/....pdf »
// cité dans database/seeds/002_seed_referentiels_ressources.sql. Les chemins
// contenant « manquant » sont volontairement ignorés : ils servent à tester BR06.
// Aucun fichier réel n'est versionné : les PDF du catalogue restent hors Git.
// =============================================================================
import 'dotenv/config';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../src/config/env.js';

const racineDepot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const fichierSeed = path.join(racineDepot, 'database/seeds/002_seed_referentiels_ressources.sql');

// Le texte d'un PDF minimal est limité à l'ASCII : on retire les accents.
const ascii = (texte) =>
  texte.normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^\x20-\x7e]/g, '?').replace(/[()\\]/g, '\\$&');

// Construit un PDF valide d'une page (police standard Helvetica, sans dépendance).
export function creerPdf(lignes) {
  const texte = lignes
    .map((ligne, i) => `BT /F1 ${i === 0 ? 20 : 12} Tf 60 ${760 - i * 28} Td (${ascii(ligne)}) Tj ET`)
    .join('\n');
  const objets = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(texte)} >>\nstream\n${texte}\nendstream`
  ];
  let pdf = '%PDF-1.4\n';
  const positions = [];
  objets.forEach((objet, i) => {
    positions.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${objet}\nendobj\n`;
  });
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objets.length + 1}\n0000000000 65535 f \n`;
  pdf += positions.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objets.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(pdf, 'latin1');
}

async function main() {
  const seed = await fs.readFile(fichierSeed, 'utf8');
  const chemins = [...new Set(seed.match(/'ressources\/[a-z0-9-]+\.pdf'/g) ?? [])]
    .map((c) => c.slice(1, -1))
    .filter((c) => !c.includes('manquant'));

  for (const chemin of chemins) {
    const destination = path.join(env.storageDir, chemin);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    const titre = path.basename(chemin, '.pdf').replace(/-/g, ' ');
    await fs.writeFile(
      destination,
      creerPdf(['Schoolbooks - document de demonstration', titre, 'Contenu fictif genere pour le developpement.'])
    );
    console.log(`PDF créé : ${destination}`);
  }
  console.log(`${chemins.length} PDF de démonstration générés dans ${env.storageDir}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
