"use strict";
// Copyright 2022 АО «СберТех»
//
// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const supertest = require("supertest");
const server_1 = require("../src/server");
describe("HTTP Function", () => {
    let callCount = 0;
    const getTestServer = async () => {
        const userFunction = (req, res) => {
            ++callCount;
            if (req.query.crash) {
                throw "I crashed";
            }
            res.send({
                result: req.body.text,
                query: req.query.param
            });
        };
        return await (0, server_1.getServer)(userFunction, "");
    };
    beforeEach(() => {
        callCount = 0;
    });
    const testData = [
        {
            name: "POST to empty path",
            httpVerb: "POST",
            path: "/",
            expectedBody: { result: "hello" },
            expectedStatus: 200,
            expectedCallCount: 1
        },
        {
            name: "POST to empty path",
            httpVerb: "POST",
            path: "/foo",
            expectedBody: { result: "hello" },
            expectedStatus: 200,
            expectedCallCount: 1
        },
        {
            name: "GET with query params",
            httpVerb: "GET",
            path: "/foo?param=val",
            expectedBody: { query: "val" },
            expectedStatus: 200,
            expectedCallCount: 1
        },
        {
            name: "GET throws exception",
            httpVerb: "GET",
            path: "/foo?crash=true",
            expectedBody: {},
            expectedStatus: 500,
            expectedCallCount: 1
        }
    ];
    testData.forEach((test) => {
        it(test.name, async () => {
            const server = await getTestServer();
            const st = supertest(server);
            await (test.httpVerb === "GET" ? st.get(test.path) : st.post(test.path).send({ text: "hello" }))
                .set("Content-Type", "application/json")
                .expect(test.expectedBody)
                .expect(test.expectedStatus);
            assert.strictEqual(callCount, test.expectedCallCount);
        });
    });
});
//# sourceMappingURL=server.js.map