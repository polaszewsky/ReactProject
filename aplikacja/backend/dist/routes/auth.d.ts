import express, { Request, Response, NextFunction } from 'express';
declare const router: import("express-serve-static-core").Router;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): express.Response<any, Record<string, any>> | undefined;
export default router;
//# sourceMappingURL=auth.d.ts.map