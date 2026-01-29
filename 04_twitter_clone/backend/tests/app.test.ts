import { jest } from '@jest/globals';

// Simple Integration Smoke Test
jest.unstable_mockModule('@clerk/express', () => ({
    clerkMiddleware: () => (req: any, res: any, next: any) => next(),
    getAuth: () => ({ userId: 'test-user-id' }),
    clerkClient: { users: { getUser: () => Promise.resolve({}) } },
}));

jest.unstable_mockModule('../src/middlewares/arcjet.middleware.js', () => ({
    arcjetMiddleware: (req: any, res: any, next: any) => next(),
}));

jest.unstable_mockModule('../src/lib/db.js', () => ({ default: () => Promise.resolve() }));

jest.unstable_mockModule('mongoose', () => {
    const m: any = {
        // @ts-ignore
        connect: jest.fn().mockResolvedValue({}),
        Schema: class { static Types = { ObjectId: String }; },
        model: jest.fn().mockReturnValue({}),
        models: {},
        Document: class { },
        Model: class { },
        Types: { ObjectId: { isValid: (id: string) => /^[0-9a-fA-F]{24}$/.test(id) } },
    };
    m.default = m;
    return m;
});

const { default: app } = await import('../src/app.js');
const { default: request } = await import('supertest');

describe('API Smoke Tests', () => {
    it('GET / should return 200', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    });

    it('API users/me endpoint should be hit', async () => {
        const res = await request(app).get('/api/users/me');
        // It should not be a 404 or 403
        expect(res.status).not.toBe(404);
        expect(res.status).not.toBe(403);
    });
});
