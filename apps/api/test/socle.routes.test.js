// Tests des routes — socle backend (santé, 404, format d'erreur).
// Responsables : Isaac LELO MAKAYA (code testé), Salem KONGOLO (tests des routes).
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { ApiErrorSchema, ERROR_CODES } from '@schoolbooks/shared';
import app from '../src/app.js';

describe('socle', () => {
  it('GET /api/health répond', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('une route inconnue renvoie 404 au format commun', async () => {
    const res = await request(app).get('/api/inconnue');
    expect(res.status).toBe(404);
    expect(() => ApiErrorSchema.parse(res.body)).not.toThrow();
    expect(res.body.error.code).toBe(ERROR_CODES.ROUTE_INTROUVABLE);
  });
});
