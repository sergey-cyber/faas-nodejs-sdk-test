/// <reference types="node" />
import * as http from "http";
import { Request, Response } from "express";
export interface HandlerFunction {
    (req: Request, res: Response): any;
}
export declare function getServer(userFunction: HandlerFunction, sourceLocation: string): Promise<http.Server>;
//# sourceMappingURL=server.d.ts.map