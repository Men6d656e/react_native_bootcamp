import { jest } from '@jest/globals';
import { errorHandler } from '../../src/middlewares/errorMiddleware.js';

describe('Error Middleware', () => {
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = {};
        res = {
            statusCode: 200,
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        next = jest.fn();
    });

    it('should return 500 if statusCode is 200', () => {
        const error = new Error('Test Error');
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Test Error',
            stack: expect.any(String),
        });
    });

    it('should return the set statusCode if it is not 200', () => {
        const error = new Error('Not Found');
        res.statusCode = 404;
        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Not Found',
            stack: expect.any(String),
        });
    });

    it('should not return stack trace in production', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        const error = new Error('Prod Error');

        errorHandler(error, req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Prod Error',
            stack: null,
        });

        process.env.NODE_ENV = originalEnv;
    });
});
