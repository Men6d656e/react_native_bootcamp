import { jest } from '@jest/globals';

const mockSession = () => ({
    startTransaction: jest.fn() as any,
    commitTransaction: jest.fn() as any,
    abortTransaction: jest.fn() as any,
    endSession: jest.fn() as any,
});

const mockPost: any = {
    find: jest.fn() as any,
    findById: jest.fn() as any,
    create: jest.fn() as any,
    findByIdAndUpdate: jest.fn() as any,
    findByIdAndDelete: jest.fn() as any,
};

const mockUser: any = {
    findOne: jest.fn() as any,
};

const mockComment: any = {
    deleteMany: jest.fn() as any,
};

const mockNotification: any = {
    create: jest.fn() as any,
    deleteMany: jest.fn() as any,
};

const mockCloudinary: any = {
    uploader: {
        upload: jest.fn() as any,
        destroy: jest.fn() as any,
    },
};

const mockGetAuth: any = jest.fn() as any;

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

const { getPosts, getPost, getUserPosts, createPost, likePost, deletePost } =
    await import('../../src/controllers/post.controller.js');
const { default: mongoose } = (await import('mongoose')) as any;

describe('Post Controller', () => {
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

    describe('getPosts', () => {
        it('should return all posts', async () => {
            // @ts-ignore
            (mockPost.find as any).mockReturnValue({
                sort: jest.fn().mockReturnThis() as any,
                populate: jest.fn().mockReturnThis() as any,
                // @ts-ignore
                lean: jest.fn().mockResolvedValue([{ content: 'test' }] as any),
            });
            await getPosts(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([{ content: 'test' }]);
        });
    });

    describe('getPost', () => {
        it('should return a single post by ID', async () => {
            const postId = '507f1f77bcf86cd799439011';
            req.params.postId = postId;
            // @ts-ignore
            (mockPost.findById as any).mockReturnValue({
                sort: jest.fn().mockReturnThis() as any,
                populate: jest.fn().mockReturnThis() as any,
                // @ts-ignore
                lean: jest.fn().mockResolvedValue({ _id: postId, content: 'Single' } as any),
            });
            await getPost(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('createPost', () => {
        it('should create a post successfully', async () => {
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            req.body.content = 'hello';
            mockUser.findOne.mockResolvedValue({ _id: 'user_123' });
            mockPost.create.mockResolvedValue({ content: 'hello', user: 'user_123' });
            await createPost(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('likePost', () => {
        it('should like a post', async () => {
            const postId = '507f1f77bcf86cd799439011';
            const userId = 'user_123';
            req.params.postId = postId;
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            mockUser.findOne.mockResolvedValue({ _id: userId });
            mockPost.findById.mockResolvedValue({ _id: postId, likes: [], user: 'author_id' });

            await likePost(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deletePost', () => {
        it('should delete post if owner', async () => {
            const postId = '507f1f77bcf86cd799439011';
            const userId = 'user_123';
            req.params.postId = postId;
            mockGetAuth.mockReturnValue({ userId: 'clerk_123' });
            mockUser.findOne.mockResolvedValue({ _id: userId });
            mockPost.findById.mockResolvedValue({ _id: postId, user: userId });

            await deletePost(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
