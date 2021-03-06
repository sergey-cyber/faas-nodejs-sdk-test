import { HandlerFunction } from "./server";
export declare const MIN_NODE_VERSION_ESMODULES = "13.2.0";
/**
 * Returns user's function from function file.
 * Returns null if function can't be retrieved.
 * @return User's function or null.
 */
export declare function getUserFunction(functionModulePath: string, targetFunction: string): Promise<HandlerFunction | null>;
//# sourceMappingURL=loader.d.ts.map