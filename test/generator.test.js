"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mocha_typescript_1 = require("mocha-typescript");
var chai_1 = require("chai");
var fs = require("fs");
var execSync = require('child_process').execSync;
var fn = require("../generator");
/// <reference path="describe.d.ts" />
fn.bindLog(console.log);
var opts = {
    swagger: {},
    functions: [],
    log: console.log
};
var swagger = {
    paths: {
        '/blah/vtha/{id}': {
            post: {
                summary: "Get blah vtha by id"
            }
        },
        '/blah': {
            get: {
                summary: "Get blah"
            }
        }
    }
};
describe('Function Helpers', function () {
    var PluginTest = (function () {
        function PluginTest() {
        }
        PluginTest.prototype.name = function () {
            var result = fn.name('blah', 'get');
            chai_1.expect(result).to.eq('getBlah');
            result = fn.name('blah/{id}', 'get');
            chai_1.expect(result).to.eq('getBlahId');
            result = fn.name('{id}/blah/vtha/{id}', 'POST');
            chai_1.expect(result).to.eq('postIdBlahVthaId');
        };
        PluginTest.prototype.definition = function () {
            var result = fn.definition('blah.main', 'blah/{id}', 'get');
            chai_1.expect(result).to.be.any;
            chai_1.expect(result.handler).to.eq('blah.main');
        };
        PluginTest.prototype.handler = function () {
            var result = fn.handler('', 'get');
            chai_1.expect(result).to.eq('get.main');
            result = fn.handler('vtha', 'get');
            chai_1.expect(result).to.eq('vtha/get.main');
        };
        PluginTest.prototype.httpEvent = function () {
            var result = fn.httpEvent('blah/{id}', 'get');
            chai_1.expect(result.http.method).to.eq('get');
            chai_1.expect(result.http.path).to.eq('blah/{id}');
        };
        PluginTest.prototype.src = function () {
            var result = fn.src('blahGet');
            chai_1.expect(result).to.include('module.exports.main');
            chai_1.expect(result).to.include("name: 'blahGet'");
        };
        return PluginTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "name", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "definition", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "handler", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "httpEvent", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "src", null);
    PluginTest = __decorate([
        mocha_typescript_1.suite
    ], PluginTest);
});
describe('Generates handler file', function () {
    var PluginTest = (function () {
        function PluginTest() {
            this.path = './output/';
            this.name = 'blahVtha';
        }
        PluginTest.prototype.before = function () {
            try {
                execSync('mkdir -p ./output');
                execSync('rm ./output/*.js');
            }
            catch (err) {
                console.log(err.message);
            }
        };
        PluginTest.prototype.generateHandlerFile = function () {
            fn.writeHandler(this.path, this.name);
            var file = './output/blahVtha.js';
            var result = fs.existsSync(file);
            chai_1.expect(result).to.eq(true);
        };
        return PluginTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generateHandlerFile", null);
    PluginTest = __decorate([
        mocha_typescript_1.suite
    ], PluginTest);
});
describe('Generates function config and handler files', function () {
    var PluginTest = (function () {
        function PluginTest() {
            this.namespace = 'output';
            this.outputPath = './output/';
        }
        PluginTest.prototype.before = function () {
            try {
                execSync('mkdir -p ./output');
                execSync('rm ./output/*.js');
            }
            catch (err) {
                console.log(err.message);
            }
        };
        PluginTest.prototype.generatesFunctionDefinitions = function () {
            var result = fn.generate(swagger.paths, this.namespace, this.outputPath);
            chai_1.expect(result.postBlahVthaId).to.have.property('handler');
            chai_1.expect(result.getBlah).to.have.property('handler');
        };
        PluginTest.prototype.generatesHandlerFile = function () {
            fn.generate(swagger.paths, this.namespace, this.outputPath);
            var file = './output/postBlahVthaId.js';
            var result = fs.existsSync(file);
            chai_1.expect(result).to.eq(true);
        };
        return PluginTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generatesFunctionDefinitions", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generatesHandlerFile", null);
    PluginTest = __decorate([
        mocha_typescript_1.suite
    ], PluginTest);
});
