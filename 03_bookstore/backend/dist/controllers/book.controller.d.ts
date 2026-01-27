import type { Request, Response } from "express";
interface CreateBookRequestBody {
    title: string;
    caption: string;
    rating: number;
    image: string;
}
export declare const createBook: (req: Request<{}, {}, CreateBookRequestBody>, res: Response) => Promise<Response>;
export declare const getAllBooks: (req: Request, res: Response) => Promise<Response>;
export declare const getUserBooks: (req: Request, res: Response) => Promise<Response>;
export declare const deleteBook: (req: Request<{
    id: string;
}>, res: Response) => Promise<Response>;
export {};
//# sourceMappingURL=book.controller.d.ts.map