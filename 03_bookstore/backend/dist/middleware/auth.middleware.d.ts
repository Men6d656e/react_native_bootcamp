import type { NextFunction, Request, Response } from "express";
declare const protectRoute: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default protectRoute;
//# sourceMappingURL=auth.middleware.d.ts.map