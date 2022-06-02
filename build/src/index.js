#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const loader_1 = require("./loader");
const options_1 = require("./options");
const main = async () => {
    const options = (0, options_1.parseOptions)();
    if (options.printHelp) {
        console.error(options_1.helpText);
        return;
    }
    const { targetFunction, serverPort, sourceLocation } = options;
    const userFunction = await (0, loader_1.getUserFunction)(sourceLocation, targetFunction);
    const server = await (0, server_1.getServer)(userFunction, sourceLocation);
    server.listen(serverPort, () => {
        console.log(`Function: ${targetFunction}\n🚀 Function ready at http://localhost:${serverPort}`);
    });
};
main();
//# sourceMappingURL=index.js.map