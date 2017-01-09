"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mocha_typescript_1 = require("mocha-typescript");
var chai_1 = require("chai");
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
    getBlahVthaById: {
        handler: 'getBlahVthaById/handler.main',
        events: []
    },
    getVtha: {
        handler: 'getBlahVthaById/handler.main',
        events: []
    }
};
describe('Generate http event for function', function () {
    var PluginTest = (function () {
        function PluginTest() {
        }
        PluginTest.prototype.before = function () {
            this.mapper = new mapper_1.Mapper(swagger, functions, function (s) { });
            this.mapper.map();
        };
        PluginTest.prototype.maps_blah_vtha_by_id = function () {
            var fn = functions.getBlahVthaById;
            chai_1.expect(fn.events).to.not.be.empty;
        };
        PluginTest.prototype.maps_vtha = function () {
            var fn = functions.getVtha;
            chai_1.expect(fn.events).to.be.empty;
        };
        PluginTest.prototype.has_post = function () {
            var fn = functions.getBlahVthaById;
            chai_1.expect(fn.events[0].http.method).to.eq('post');
        };
        PluginTest.prototype.has_path = function () {
            var fn = functions.getBlahVthaById;
            chai_1.expect(fn.events[0].http.path).to.eq('/blah/vtha/id');
        };
        return PluginTest;
    }());
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "maps_blah_vtha_by_id", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "maps_vtha", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "has_post", null);
    __decorate([
        mocha_typescript_1.test
    ], PluginTest.prototype, "has_path", null);
    PluginTest = __decorate([
        mocha_typescript_1.suite
    ], PluginTest);
});
