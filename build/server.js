"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServer = void 0;
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const path = require("path");
const readPkgUp = require("read-pkg-up");
const fs = require("fs");
async function getServer(userFunction, sourceLocation) {
    // App to use for function executions.
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.text({ type: "text/*" }));
    app.use(bodyParser.raw());
    app.disable("x-powered-by");
    const pkg = await readPkgUp({
        cwd: path.dirname(require.resolve(sourceLocation)),
        normalize: false
    });
    const staticFolders = pkg === null || pkg === void 0 ? void 0 : pkg.packageJson.staticContentFolders;
    // Set static folders
    if (staticFolders && staticFolders.length !== 0) {
        staticFolders.forEach((folder) => {
            let folderPath = path.join(sourceLocation, folder);
            if (!fs.existsSync(folderPath)) {
                throw new Error("There is no folder with static content(as said in package.json):" + folderPath);
            }
            else {
                app.use(express.static(folderPath, { index: false }));
                console.log("Added static folder:", folderPath);
            }
        });
    }
    app.all("/*", (req, res) => {
        userFunction(req, res);
    });
    return http.createServer(app);
}
exports.getServer = getServer;
//# sourceMappingURL=server.js.map