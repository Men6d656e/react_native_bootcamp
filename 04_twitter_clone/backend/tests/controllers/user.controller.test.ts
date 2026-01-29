import { jest } from '@jest/globals';

const mockSession = () => ({
    startTransaction: jest.fn() as any,
    commitTransaction: jest.fn() as any,
    abortTransaction: jest.fn() as any,
    endSession: jest.fn() as any,
});

const mockUser: any = {
    findOne: jest.fn() as any,
    findOneAndUpdate: jest.fn() as any,
    create: jest.fn() as any,
    findByIdAndUpdate: jest.fn() as any,
};

const mockGetAuth: any = jest.fn() as any;
const mockClerkClient: any = {
    users: {
        getUser: jest.fn() as any,
    },
};

const mockNotification: any = {
    create: jest.fn() as any,
};

const mockUtils: any = {
    aj: {
        protect: jest.fn() as any,
    },
    uniqueNameGenrator: jest.fn(() => 'unique-name') as any,
};

// Robust mongoose mock for ESM
jest.unstable_mockModule('mongoose', () => {
    const mongooseMock: any = {
        startSession: jest.fn(async () => mockSession()),
        Types: {
            ObjectId: class {
                id: string;
                constructor(id?: string) {
                    this.id = id || '507f1f77bcf86cd799439011';
                }
                static isValid(id: string) {
                    return /^[0-9a-fA-F]{24}$/.test(id);
                }
                toString() {
                    return this.id;
                }
            },
        },
        Document: class { }, Model: class { }, Schema: class { static Types = { ObjectId: String }; },
    };
    mongooseMock.default = mongooseMock;
    return mongooseMock;
});

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

jest.unstable_mockModule('../../src/lib/utils.js', () => ({ default: mockUtils, ...mockUtils }));

const { getUserProfile, getCurrentUser, updateProfile, syncUser, followUser } =
    await import('../../src/controllers/user.controller.js');
const { default: mongoose } = (await import('mongoose')) as any;

describe('User Controller', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { params: {}, body: {}, header: jest.fn() as any };
        res = {
            status: jest.fn().mockReturnThis() as any,
            json: jest.fn().mockReturnThis() as any,
        };
        next = jest.fn() as any;
        mockGetAuth.mockReturnValue({ userId: 'test_user' });
        (mongoose.startSession as any).mockResolvedValue(mockSession());
    });

    describe('getUserProfile', () => {
        it('should return user profile if found', async () => {
            req.params.username = 'testuser';
            // @ts-ignore
            (mockUser.findOne as any).mockReturnValue({
                select: jest.fn().mockReturnThis() as any,
                // @ts-ignore
                lean: jest.fn().mockResolvedValue({ username: 'testuser' } as any),
            });
            await getUserProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ username: 'testuser' });
        });
    });

    describe('updateProfile', () => {
        it('should update profile successfully', async () => {
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            // @ts-ignore
            (mockUser.findOneAndUpdate as any).mockReturnValue({
                // @ts-ignore
                select: jest.fn().mockResolvedValue({ bio: 'updated' } as any),
            });
            await updateProfile(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('syncUser', () => {
        it('should create user if it does not exist', async () => {
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            mockUser.findOne.mockResolvedValue(null);
            mockClerkClient.users.getUser.mockResolvedValue({
                emailAddresses: [{ emailAddress: 'a@a.com' }],
            } as any);
            mockUser.create.mockResolvedValue({ clerkId: 'clerk_123' });
            await syncUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('followUser', () => {
        it('should follow user successfully', async () => {
            const targetId = '507f1f77bcf86cd799439011';
            req.params.targetUserId = targetId;
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            mockUser.findOne.mockResolvedValue({
                _id: 'user_123',
                following: []
            });
            await followUser(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
