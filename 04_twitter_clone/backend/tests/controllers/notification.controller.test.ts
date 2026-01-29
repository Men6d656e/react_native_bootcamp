import { jest } from '@jest/globals';

const mockUser: any = { findOne: jest.fn() as any };
const mockNotificationModel: any = { find: jest.fn() as any, findOneAndDelete: jest.fn() as any };
const mockGetAuth: any = jest.fn() as any;

jest.unstable_mockModule('mongoose', () => {
    const m: any = {
        Types: { ObjectId: { isValid: (id: string) => /^[0-9a-fA-F]{24}$/.test(id) } },
        Document: class { }, Model: class { }, Schema: class { static Types = { ObjectId: String }; },
    };
    return { ...m, default: m };
});

jest.unstable_mockModule('../../src/models/user.model.js', () => ({ default: mockUser }));
jest.unstable_mockModule('../../src/models/notification.js', () => ({ default: mockNotificationModel }));
jest.unstable_mockModule('@clerk/express', () => ({ getAuth: mockGetAuth }));

const { getNotifications, deleteNotification } = await import('../../src/controllers/notification.controller.js');

describe('Notification Controller', () => {
    let req: any, res: any, next: any;

    beforeEach(() => {
        jest.clearAllMocks();
        req = { params: {}, body: {}, header: jest.fn() as any };
        res = { status: jest.fn().mockReturnThis() as any, json: jest.fn().mockReturnThis() as any };
        next = jest.fn() as any;
        mockGetAuth.mockReturnValue({ userId: 'test_user' });
    });

    describe('getNotifications', () => {
        it('should return 200 and notifications', async () => {
            // @ts-ignore
            (mockUser.findOne as any).mockReturnValue({ select: jest.fn().mockReturnThis() as any, lean: jest.fn().mockResolvedValue({ _id: 'u1' } as any) });
            // @ts-ignore
            (mockNotificationModel.find as any).mockReturnValue({ sort: jest.fn().mockReturnThis() as any, populate: jest.fn().mockReturnThis() as any, lean: jest.fn().mockResolvedValue([] as any) });
            await getNotifications(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteNotification', () => {
        it('should return 400 for invalid ID format', async () => {
            req.params.notificationId = 'invalid';
            await deleteNotification(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
        });

        it('should return 200 on successful deletion', async () => {
            req.params.notificationId = '507f1f77bcf86cd799439011';
            // @ts-ignore
            (mockUser.findOne as any).mockReturnValue({ select: jest.fn().mockReturnThis() as any, lean: jest.fn().mockResolvedValue({ _id: 'u1' } as any) });
            mockNotificationModel.findOneAndDelete.mockResolvedValue({ _id: 'n1' } as any);
            await deleteNotification(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
