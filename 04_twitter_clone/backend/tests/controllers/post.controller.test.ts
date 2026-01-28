import { jest } from '@jest/globals';

// Define mocks
const mockPost = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
};

const mockUser = {
    findOne: jest.fn(),
};

const mockComment = {
    deleteMany: jest.fn(),
};

const mockNotification = {
    create: jest.fn(),
    deleteMany: jest.fn(),
};

const mockCloudinary = {
    uploader: {
        upload: jest.fn(),
        destroy: jest.fn(),
    },
};

const mockGetAuth = jest.fn();

// Use unstable_mockModule for ESM mocking
jest.unstable_mockModule('../../src/models/post.model.js', () => ({
    default: mockPost,
}));

jest.unstable_mockModule('../../src/models/user.model.js', () => ({
    default: mockUser,
}));

jest.unstable_mockModule('../../src/models/comment.model.js', () => ({
    default: mockComment,
}));

jest.unstable_mockModule('../../src/models/notification.js', () => ({
    default: mockNotification,
}));

jest.unstable_mockModule('../../src/lib/cloudinary.js', () => ({
    default: mockCloudinary,
}));

jest.unstable_mockModule('@clerk/express', () => ({
    getAuth: mockGetAuth,
}));

// Import the controller and other dependencies after mocking
const { getPosts, createPost } = await import(
    '../../src/controllers/post.controller.js'
);

describe('Post Controller', () => {
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

    describe('getPosts', () => {
        it('should return all posts with populated data', async () => {
            const postsData = [{ content: 'Hello' }, { content: 'World' }];

            mockPost.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(postsData),
            });

            await getPosts(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(postsData);
        });
    });

    describe('createPost', () => {
        it('should create a post without image', async () => {
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            req.body.content = 'New post content';
            const userData = { _id: 'mongo_user_123' };
            const postData = { content: 'New post content', user: 'mongo_user_123' };

            mockUser.findOne.mockResolvedValue(userData);
            mockPost.create.mockResolvedValue(postData);

            await createPost(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(postData);
            expect(mockCloudinary.uploader.upload).not.toHaveBeenCalled();
        });

        it('should throw error if both content and image are missing', async () => {
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            req.body.content = '';
            req.file = undefined;

            await createPost(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
            expect(next.mock.calls[0][0].message).toBe(
                'Post must contain either text or image',
            );
        });
    });
});
