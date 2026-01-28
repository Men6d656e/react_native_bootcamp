import { jest } from '@jest/globals';

// Mocking dependencies before importing the app
// Using unstable_mockModule for ESM support
jest.unstable_mockModule('@clerk/express', () => ({
    clerkMiddleware: () => (req: any, res: any, next: any) => next(),
    getAuth: () => ({ userId: 'test-user-id' }),
    clerkClient: {
        users: {
            getUser: () => Promise.resolve({}),
        },
    },
}));

jest.unstable_mockModule('../src/middlewares/arcjet.middleware.js', () => ({
    arcjetMiddleware: (req: any, res: any, next: any) => next(),
}));

// Mock DB and other side-effect heavy modules
jest.unstable_mockModule('../src/lib/db.js', () => ({
    default: () => Promise.resolve(),
}));

jest.unstable_mockModule('../src/lib/utils.js', () => ({
    aj: {
        protect: () => Promise.resolve({ isDenied: () => false, results: [] }),
    },
    uniqueNameGenrator: () => 'test-user',
}));

// Import app after mocks are registered
const { default: app } = await import('../src/app.js');
const { default: request } = await import('supertest');

describe('App Endpoints', () => {
    it('GET / should return a success message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Welcome to the Twitter Clone API!');
    });

    it('GET /api/users/me should be handled (passed middlewares)', async () => {
        const response = await request(app).get('/api/users/me');
        // Success is not 403 (Arcjet) or 401 (Clerk unauthorized - though 401 might come from controller if it checks DB)
        expect(response.status).not.toBe(403);
    });
});
