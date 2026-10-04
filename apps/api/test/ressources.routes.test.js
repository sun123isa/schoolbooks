// Tests des routes — ressources et fichiers.
// Responsables : Emmanuel AYA (code testé), Salem KONGOLO (tests des routes).
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { ERROR_CODES, RessourceDetailSchema, successEnvelope } from '@schoolbooks/shared';
import app from '../src/app.js';

// Identifiants des données fictives (packages/shared/src/mocks/ressources.mock.js).
const TELECHARGEABLE = '0b6f2a4e-1c3d-4e5f-8a9b-000000000001';
const CONSULTATION_SEULE = '0b6f2a4e-1c3d-4e5f-8a9b-000000000004';
const FICHIER_MANQUANT = '0b6f2a4e-1c3d-4e5f-8a9b-000000000011';
const INCONNU = '0b6f2a4e-1c3d-4e5f-8a9b-999999999999';

describe('GET /api/ressources/:id', () => {
  it('renvoie le détail conforme au contrat', async () => {
    const res = await request(app).get(`/api/ressources/${TELECHARGEABLE}`);
    expect(res.status).toBe(200);
    expect(() => successEnvelope(RessourceDetailSchema).parse(res.body)).not.toThrow();
  });

  it('id inconnu : 404 RESSOURCE_INTROUVABLE', async () => {
    const res = await request(app).get(`/api/ressources/${INCONNU}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe(ERROR_CODES.RESSOURCE_INTROUVABLE);
  });

  it('id mal formé : 400 VALIDATION_ERROR', async () => {
    const res = await request(app).get('/api/ressources/pas-un-uuid');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });
});

describe('GET /api/ressources/:id/fichier', () => {
  it('sert le PDF en ligne', async () => {
    const res = await request(app).get(`/api/ressources/${CONSULTATION_SEULE}/fichier`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/pdf');
    expect(res.headers['content-disposition']).toMatch(/^inline/);
  });

  it('BR06 : fichier absent : 404 FICHIER_INDISPONIBLE', async () => {
    const res = await request(app).get(`/api/ressources/${FICHIER_MANQUANT}/fichier`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe(ERROR_CODES.FICHIER_INDISPONIBLE);
  });
});

describe('GET /api/ressources/:id/telechargement', () => {
  it('sert le PDF en pièce jointe si téléchargeable', async () => {
    const res = await request(app).get(`/api/ressources/${TELECHARGEABLE}/telechargement`);
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toMatch(/^attachment/);
  });

  it('BR08 : non téléchargeable : 403 TELECHARGEMENT_NON_AUTORISE', async () => {
    const res = await request(app).get(`/api/ressources/${CONSULTATION_SEULE}/telechargement`);
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe(ERROR_CODES.TELECHARGEMENT_NON_AUTORISE);
  });
});
