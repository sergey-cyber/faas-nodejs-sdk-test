"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = exports.helpText = void 0;
const minimist = require("minimist");
const path_1 = require("path");
/**
 * Helper class for parsing an configurable option from provided CLI flags
 * or environment variables.
 */
class ConfigurableOption {
    constructor(
    /**
     * The CLI flag that can be use to configure this option.
     */
    cliOption, 
    /**
     * The name of the environment variable used to configure this option.
     */
    envVar, 
    /**
     * The default value used when this option is not configured via a CLI flag
     * or environment variable.
     */
    defaultValue, 
    /**
     * A function used to valid the user provided value.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validator = (x) => x) {
        this.cliOption = cliOption;
        this.envVar = envVar;
        this.defaultValue = defaultValue;
        this.validator = validator;
    }
    parse(cliArgs, envVars) {
        return this.validator(cliArgs[this.cliOption] || envVars[this.envVar] || this.defaultValue);
    }
}
const PortOption = new ConfigurableOption("port", "PORT", "8082");
const FunctionTargetOption = new ConfigurableOption("target", "FUNCTION_TARGET", "handler");
const SourceLocationOption = new ConfigurableOption("source", "FUNCTION_SOURCE", "", path_1.resolve);
exports.helpText = `Example usage:
  npm start --target=handler --source=./function --port=8082`;
/**
 * Parse the configurable framework options from the provided CLI arguments and
 * environment variables.
 * @param cliArgs the raw command line arguments
 * @param envVars the environment variables to parse options from
 * @returns the parsed options that should be used to configure the framework.
 */
const parseOptions = (cliArgs = process.argv, envVars = process.env) => {
    const argv = minimist(cliArgs, {
        string: [PortOption.cliOption, FunctionTargetOption.cliOption, SourceLocationOption.cliOption]
    });
    return {
        serverPort: PortOption.parse(argv, envVars),
        targetFunction: FunctionTargetOption.parse(argv, envVars),
        sourceLocation: SourceLocationOption.parse(argv, envVars),
        printHelp: cliArgs[2] === "-h" || cliArgs[2] === "--help"
    };
};
exports.parseOptions = parseOptions;
//# sourceMappingURL=options.js.map