#!/usr/bin/env node

import { getServer } from "./server";
import { getUserFunction } from "./loader";
import { helpText, parseOptions } from "./options";

const main = async () => {
    const options = parseOptions();

    if (options.printHelp) {
        console.error(helpText);
        return;
    }

    const { targetFunction, serverPort, sourceLocation } = options;

    const userFunction = await getUserFunction(sourceLocation, targetFunction!);

    const server = await getServer(userFunction!, sourceLocation);

    server.listen(serverPort, () => {
        console.log(`Function: ${targetFunction}\n🚀 Function ready at http://localhost:${serverPort}`);
    });
};

main();
