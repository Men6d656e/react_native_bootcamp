import type { Request, Response } from "express";
interface RegisterRequestBody {
    email: string;
    username: string;
    password: string;
}
interface LoginRequestBody {
    email: string;
    password: string;
}
export declare const register: (req: Request<{}, {}, RegisterRequestBody>, res: Response) => Promise<Response>;
export declare const login: (req: Request<{}, {}, LoginRequestBody>, res: Response) => Promise<Response>;
export declare const logout: (_req: Request, res: Response) => Promise<Response>;
export {};
//# sourceMappingURL=auth.controller.d.ts.map