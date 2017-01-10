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
var mapper_1 = require("../mapper");
/// <reference path="describe.d.ts" />
var swagger = {
    paths: {
        '/blah/vtha/id': {
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
var functions = {
    blahVthaIdPost: {
        handler: 'blah_vtha_id_post.main',
        events: []
    },
    vthaGet: {
        handler: 'vtha_get.main',
        events: []
    }
};
var expected = {
    blahVthaIdPost: {
        handler: 'blahVthaIdPost/handler.main',
        events: [
            {
                http: {
                    method: 'post',
                    path: '/blah/vtha/id'
                }
            }
        ]
    }
};
describe('Helpers', function () {
    var PluginTest = (function () {
        function PluginTest() {
        }
        PluginTest.prototype.before = function () {
            this.mapper = new mapper_1.Mapper(swagger, functions, './output', console.log);
        };
        PluginTest.prototype.functionHandler = function () {
            var result = this.mapper.functionHandler('blahGet');
            chai_1.expect(result).to.include('module.exports.main');
            chai_1.expect(result).to.include("name: 'blahGet'");
        };
        PluginTest.prototype.functionName = function () {
            var result = this.mapper.functionName('blah', 'get');
            chai_1.expect(result).to.eq('blahGet');
            result = this.mapper.functionName('blah/{id}', 'get');
            chai_1.expect(result).to.eq('blahIdGet');
            result = this.mapper.functionName('{id}/blah/vtha/{id}', 'POST');
            chai_1.expect(result).to.eq('idBlahVthaIdPost');
        };
        PluginTest.prototype.generateEvent = function () {
            var result = this.mapper.generateEvent('blah/{id}', 'get');
            chai_1.expect(result.http.method).to.eq('get');
            chai_1.expect(result.http.path).to.eq('blah/{id}');
        };
        PluginTest.prototype.generate = function () {
            var result = this.mapper.generateEvent('blah/{id}', 'get');
            chai_1.expect(result.http.method).to.eq('get');
            chai_1.expect(result.http.path).to.eq('blah/{id}');
        };
        return PluginTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "functionHandler", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "functionName", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generateEvent", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generate", null);
    PluginTest = __decorate([
        mocha_typescript_1.suite
    ], PluginTest);
});
describe('Generate javascript handler', function () {
    var PluginTest = (function () {
        function PluginTest() {
        }
        PluginTest.prototype.before = function () {
            try {
                execSync('mkdir -p ./output');
                execSync('rm ./output/*.js');
            }
            catch (err) {
                console.log(err.message);
            }
            this.mapper = new mapper_1.Mapper(swagger, functions, './output', console.log);
        };
        PluginTest.prototype.generateHandlerFile = function () {
            this.mapper.generate();
            var file = './output/blahVthaIdPost.js';
            var result = fs.existsSync(file);
            chai_1.expect(result).to.eq(true);
        };
        PluginTest.prototype.generateHandlerLength = function () {
            var result = this.mapper.generate();
            chai_1.expect(result).to.have.property('blahVthaIdPost');
        };
        PluginTest.prototype.generateHandler = function () {
            var result = this.mapper.generate();
            chai_1.expect(result.blahVthaIdPost.handler).to.eq('blahVthaIdPost.main');
        };
        return PluginTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generateHandlerFile", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generateHandlerLength", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "generateHandler", null);
    PluginTest = __decorate([
        mocha_typescript_1.suite
    ], PluginTest);
});
describe('map swagger to http events', function () {
    var PluginTest = (function () {
        function PluginTest() {
        }
        PluginTest.prototype.before = function () {
            this.mapper = new mapper_1.Mapper(swagger, functions, '', function (s) { });
            this.mapper.map();
        };
        PluginTest.prototype.mapBlahVthaId = function () {
            var fn = functions.blahVthaIdPost;
            chai_1.expect(fn.events).to.not.be.empty;
        };
        PluginTest.prototype.mapVtha = function () {
            var fn = functions.vthaGet;
            chai_1.expect(fn.events).to.be.empty;
        };
        PluginTest.prototype.hasPost = function () {
            var fn = functions.blahVthaIdPost;
            chai_1.expect(fn.events[0].http.method).to.eq('post');
        };
        PluginTest.prototype.hasPath = function () {
            var fn = functions.blahVthaIdPost;
            chai_1.expect(fn.events[0].http.path).to.eq('/blah/vtha/id');
        };
        return PluginTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "mapBlahVthaId", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "mapVtha", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "hasPost", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "hasPath", null);
    PluginTest = __decorate([
        mocha_typescript_1.suite
    ], PluginTest);
});
