"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFunction = void 0;
const semver = require("semver");
const url_1 = require("url");
const path = require("path");
const readPkgUp = require("read-pkg-up");
const MIN_NODE_VERSION_ESMODULES = "13.2.0";
async function isEsModule(modulePath) {
    const ext = path.extname(modulePath);
    if (ext === ".mjs") {
        return true;
    }
    if (ext === ".cjs") {
        return false;
    }
    const pkg = await readPkgUp({
        cwd: path.dirname(modulePath),
        normalize: false
    });
    // If package.json specifies type as 'module', it's an ES module.
    return (pkg === null || pkg === void 0 ? void 0 : pkg.packageJson.type) === "module";
}
/**
 * Dynamically load import function to prevent TypeScript from
 * transpiling into a require.
 *
 * See https://github.com/microsoft/TypeScript/issues/43329.
 */
const dynamicImport = new Function("modulePath", "return import(modulePath)"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
);
/**
 * Returns user's function from function file.
 * Returns null if function can't be retrieved.
 * @return User's function or null.
 */
async function getUserFunction(functionModulePath, targetFunction) {
    try {
        if (functionModulePath === null) {
            console.error("Provided code is not a loadable module.");
            return null;
        }
        let functionModule;
        const esModule = await isEsModule(functionModulePath);
        if (esModule) {
            if (semver.lt(process.version, MIN_NODE_VERSION_ESMODULES)) {
                console.error(`Cannot load ES Module on Node.js ${process.version}. ` +
                    `Please upgrade to Node.js v${MIN_NODE_VERSION_ESMODULES} and up.`);
                return null;
            }
            // Resolve module path to file:// URL. Required for windows support.
            const fpath = (0, url_1.pathToFileURL)(functionModulePath);
            functionModule = await dynamicImport(fpath.href);
        }
        else {
            functionModule = require(functionModulePath);
        }
        let userFunction = targetFunction.split(".").reduce((code, targetFunctionPart) => {
            if (typeof code === "undefined") {
                return undefined;
            }
            else {
                return code[targetFunctionPart];
            }
        }, functionModule);
        if (typeof userFunction === "undefined") {
            console.error(`Function '${targetFunction}' is not defined in the provided module.`);
        }
        if (typeof userFunction !== "function") {
            console.error(`'${targetFunction}' needs to be of type function. Got: ${typeof userFunction}`);
            return null;
        }
        return userFunction;
    }
    catch (ex) {
        const err = ex;
        let additionalHint;
        if (err.stack && err.stack.includes("Cannot find module")) {
            additionalHint = "Did you list all required modules in the package.json dependencies?\n";
        }
        else {
            additionalHint = "Is there a syntax error in function code?\n";
        }
        console.error(`Provided module can't be loaded.\n${additionalHint} Detailed stack trace: ${err.stack}`);
        return null;
    }
}
exports.getUserFunction = getUserFunction;
//# sourceMappingURL=loader.js.map