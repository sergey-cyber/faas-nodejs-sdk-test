import * as express from "express";
import * as http from "http";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import * as path from "path";
import * as readPkgUp from "read-pkg-up";
import * as fs from "fs";

export interface HandlerFunction {
    (req: Request, res: Response): any;
}

export async function getServer(userFunction: HandlerFunction, sourceLocation: string): Promise<http.Server> {
    // App to use for function executions.
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.text({ type: "text/*" }));
    app.use(bodyParser.raw());
    app.disable("x-powered-by");

    const pkg = await readPkgUp({
        cwd: path.join(__dirname, sourceLocation),
        normalize: false
    });

    const staticFolders = pkg?.packageJson.staticContentFolders as string[] | undefined;

    // Set static folders
    if (staticFolders && staticFolders.length !== 0) {
        staticFolders.forEach((folder) => {
            let folderPath = path.join(sourceLocation, folder);
            if (!fs.existsSync(folderPath)) {
                throw new Error("There is no folder with static content(as said in package.json):" + folderPath);
            } else {
                app.use(express.static(folderPath, { index: false }));
                console.log("Added static folder:", folderPath);
            }
        });
    }

    app.all("/*", (req: Request, res: Response) => {
        userFunction(req, res);
    });

    return http.createServer(app);
}
