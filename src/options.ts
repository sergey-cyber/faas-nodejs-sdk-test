import * as minimist from "minimist";
import { resolve } from "path";

/**
 * The set of all options that can be used to configure the behaviour of
 * the framework.
 */
export interface FrameworkOptions {
    /**
     * The port on which this server listens to all HTTP requests.
     */
    serverPort: string;
    /**
     * The name of the function within user's node module to execute. If such a
     * function is not defined, then falls back to 'handler' name.
     */
    targetFunction: string;
    /**
     * The path to the source code file containing the client function.
     */
    sourceLocation: string;
    /**
     * Whether or not the --help CLI flag was provided.
     */
    printHelp: boolean;
}

/**
 * Helper class for parsing an configurable option from provided CLI flags
 * or environment variables.
 */
class ConfigurableOption<T> {
    constructor(
        /**
         * The CLI flag that can be use to configure this option.
         */
        public readonly cliOption: string,
        /**
         * The name of the environment variable used to configure this option.
         */
        private envVar: string,
        /**
         * The default value used when this option is not configured via a CLI flag
         * or environment variable.
         */
        private defaultValue: T,
        /**
         * A function used to valid the user provided value.
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private validator: (x: any) => T = (x) => x as T
    ) {}

    parse(cliArgs: minimist.ParsedArgs, envVars: NodeJS.ProcessEnv): T {
        return this.validator(cliArgs[this.cliOption] || envVars[this.envVar] || this.defaultValue);
    }
}

const PortOption = new ConfigurableOption("port", "PORT", "8082");
const FunctionTargetOption = new ConfigurableOption("target", "FUNCTION_TARGET", "handler");
const SourceLocationOption = new ConfigurableOption("source", "FUNCTION_SOURCE", "handlers/handler.js", resolve);

export const helpText = `Example usage:
  npm start --target=handler --source=./function --port=8082`;

/**
 * Parse the configurable framework options from the provided CLI arguments and
 * environment variables.
 * @param cliArgs the raw command line arguments
 * @param envVars the environment variables to parse options from
 * @returns the parsed options that should be used to configure the framework.
 */
export const parseOptions = (
    cliArgs: string[] = process.argv,
    envVars: NodeJS.ProcessEnv = process.env
): FrameworkOptions => {
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
