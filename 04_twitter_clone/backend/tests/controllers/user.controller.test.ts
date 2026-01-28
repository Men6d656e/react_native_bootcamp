import { jest } from '@jest/globals';

// Define mocks
const mockUser = {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
};

const mockGetAuth = jest.fn();
const mockClerkClient = {
    users: {
        getUser: jest.fn(),
    },
};

const mockNotification = {
    create: jest.fn(),
};

const mockUtils = {
    aj: {
        protect: jest.fn(),
    },
    uniqueNameGenrator: jest.fn(() => 'unique-name'),
};

// Use unstable_mockModule for ESM mocking
jest.unstable_mockModule('../../src/models/user.model.js', () => ({
    default: mockUser,
}));

jest.unstable_mockModule('@clerk/express', () => ({
    getAuth: mockGetAuth,
    clerkClient: mockClerkClient,
    clerkMiddleware: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

jest.unstable_mockModule('../../src/models/notification.js', () => ({
    default: mockNotification,
}));

jest.unstable_mockModule('../../src/lib/utils.js', () => mockUtils);

// Import the controller and other dependencies after mocking
const { getUserProfile, getCurrentUser } = await import(
    '../../src/controllers/user.controller.js'
);

describe('User Controller', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        jest.clearAllMocks();
        req = {
            params: {},
            body: {},
            header: jest.fn(),
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    describe('getUserProfile', () => {
        it('should return user profile if found', async () => {
            const userData = { username: 'testuser', firstName: 'Test' };
            req.params.username = 'testuser';

            mockUser.findOne.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(userData),
            });

            await getUserProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(userData);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if user not found', async () => {
            req.params.username = 'nonexistent';

            mockUser.findOne.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(null),
            });

            await getUserProfile(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe('User not found');
        });
    });

    describe('getCurrentUser', () => {
        it('should return current user if authenticated', async () => {
            const userData = { clerkId: 'user_123', username: 'me' };
            mockGetAuth.mockReturnValue({ userId: 'user_123' });

            mockUser.findOne.mockReturnValue({
                lean: jest.fn().mockResolvedValue(userData),
            });

            await getCurrentUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(userData);
        });

        it('should return 401 if no userId present', async () => {
            mockGetAuth.mockReturnValue({ userId: null });

            await getCurrentUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe('Unauthorized access');
        });
    });
});
