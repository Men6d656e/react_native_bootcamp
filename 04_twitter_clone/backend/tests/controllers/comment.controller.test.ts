import { jest } from '@jest/globals';

const mockSession = () => ({
    startTransaction: jest.fn() as any,
    commitTransaction: jest.fn() as any,
    abortTransaction: jest.fn() as any,
    endSession: jest.fn() as any,
});

const mockComment: any = {
    find: jest.fn() as any,
    create: jest.fn() as any,
    findById: jest.fn() as any,
    findByIdAndDelete: jest.fn() as any,
    findByIdAndUpdate: jest.fn() as any
};
const mockPost: any = { findById: jest.fn() as any, findByIdAndUpdate: jest.fn() as any };
const mockUser: any = { findOne: jest.fn() as any };
const mockNotification: any = { create: jest.fn() as any, deleteMany: jest.fn() as any };
const mockGetAuth: any = jest.fn() as any;

jest.unstable_mockModule('mongoose', () => {
    const m: any = {
        startSession: jest.fn(async () => mockSession()),
        Types: { ObjectId: class { static isValid = (id: string) => /^[0-9a-fA-F]{24}$/.test(id); } },
        Document: class { }, Model: class { }, Schema: class { static Types = { ObjectId: String }; },
    };
    return { ...m, default: m };
});

jest.unstable_mockModule('../../src/models/comment.model.js', () => ({ default: mockComment }));
jest.unstable_mockModule('../../src/models/post.model.js', () => ({ default: mockPost }));
jest.unstable_mockModule('../../src/models/user.model.js', () => ({ default: mockUser }));
jest.unstable_mockModule('../../src/models/notification.js', () => ({ default: mockNotification }));
jest.unstable_mockModule('@clerk/express', () => ({ getAuth: mockGetAuth }));

const { getComments, createComment, deleteComment } = await import('../../src/controllers/comment.controller.js');
const { default: mongoose } = (await import('mongoose')) as any;

describe('Comment Controller', () => {
    let req: any, res: any, next: any;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { params: {}, body: {}, header: jest.fn() as any };
        res = { status: jest.fn().mockReturnThis() as any, json: jest.fn().mockReturnThis() as any };
        next = jest.fn() as any;
        mockGetAuth.mockReturnValue({ userId: 'test_user' });
        (mongoose.startSession as any).mockResolvedValue(mockSession());
    });

    it('should return 400 if content is empty', async () => {
        req.params.postId = '507f1f77bcf86cd799439011';
        req.body.content = '';
        await createComment(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should delete comment successfully', async () => {
        const commentId = '507f1f77bcf86cd799439011';
        req.params.commentId = commentId;
        mockUser.findOne.mockResolvedValue({ _id: 'u1' });
        mockComment.findById.mockResolvedValue({ _id: commentId, user: 'u1', post: 'p1' });
        await deleteComment(req, res, next);
        expect(res.status).toHaveBeenCalledWith(200);
    });
});
