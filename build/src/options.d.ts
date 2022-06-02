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
export declare const helpText = "Example usage:\n  npm start --target=handler --source=./function --port=8082";
/**
 * Parse the configurable framework options from the provided CLI arguments and
 * environment variables.
 * @param cliArgs the raw command line arguments
 * @param envVars the environment variables to parse options from
 * @returns the parsed options that should be used to configure the framework.
 */
export declare const parseOptions: (cliArgs?: string[], envVars?: NodeJS.ProcessEnv) => FrameworkOptions;
//# sourceMappingURL=options.d.ts.map