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
const express = require("express");
const semver = require("semver");
const loader = require("../src/loader");
describe("loading function", () => {
    const testData = {
        name: "default function handler",
        codeLocation: "/test/data/default_func/foo.js",
        target: "testFunction"
    };
    it(`should load ${testData.name}`, async () => {
        const userFunction = await loader.getUserFunction(process.cwd() + testData.codeLocation, testData.target);
        const returned = userFunction(express.request, express.response);
        assert.strictEqual(returned, "PASS");
    });
    const esmTestData = {
        name: "specified in package.json type field",
        codeLocation: "/test/data/esm_type/foo.js",
        target: "testFunction"
    };
    const loadFn = async () => {
        const loadedFunction = await loader.getUserFunction(process.cwd() + esmTestData.codeLocation, esmTestData.target);
        return loadedFunction;
    };
    if (semver.lt(process.version, loader.MIN_NODE_VERSION_ESMODULES)) {
        it(`should fail to load function in an ES module ${esmTestData.name}`, async () => {
            assert.rejects(loadFn);
        });
    }
    else {
        it(`should load function in an ES module ${esmTestData.name}`, async () => {
            const loadedFunction = await loadFn();
            const returned = loadedFunction(express.request, express.response);
            assert.strictEqual(returned, "PASS");
        });
    }
});
//# sourceMappingURL=loader.js.map