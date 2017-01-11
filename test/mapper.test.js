"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var mocha_typescript_1 = require("mocha-typescript");
var chai_1 = require("chai");
var fn = require("../generator");
/// <reference path="describe.d.ts" />
fn.bindLog(console.log);
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
var functions = {
    postBlahVthaId: {
        handler: 'postBlahVthaId.main',
        events: [
            {
                http: 'blah'
            }
        ]
    },
    vthaGet: {
        handler: 'vthaGet.main',
        events: []
    }
};
var expected = {
    postBlahVthaId: {
        handler: 'postBlahVthaId/handler.main',
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
var MapTest = (function () {
    function MapTest() {
    }
    MapTest.prototype.before = function () {
        this.definitions = fn.map(swagger.paths, functions);
    };
    MapTest.prototype.mapBlahVthaId = function () {
        var fn = this.definitions.postBlahVthaId;
        chai_1.expect(fn.events).to.not.be.empty;
    };
    MapTest.prototype.mapVtha = function () {
        var fn = this.definitions.vthaGet;
        chai_1.expect(fn.events).to.be.empty;
    };
    MapTest.prototype.hasPost = function () {
        var fn = functions.postBlahVthaId;
        chai_1.expect(fn.events[0].http.method).to.eq('post');
    };
    MapTest.prototype.hasPath = function () {
        var fn = functions.postBlahVthaId;
        chai_1.expect(fn.events[0].http.path).to.eq('/blah/vtha/{id}');
    };
    MapTest.prototype.replacesHttp = function () {
        var fn = functions.postBlahVthaId;
        chai_1.expect(fn.events[0].http).to.not.eq('blah');
    };
    return MapTest;
}());
__decorate([
    mocha_typescript_1.test
], MapTest.prototype, "mapBlahVthaId", null);
__decorate([
    mocha_typescript_1.test
], MapTest.prototype, "mapVtha", null);
__decorate([
    mocha_typescript_1.test
], MapTest.prototype, "hasPost", null);
__decorate([
    mocha_typescript_1.test
], MapTest.prototype, "hasPath", null);
__decorate([
    mocha_typescript_1.test
], MapTest.prototype, "replacesHttp", null);
MapTest = __decorate([
    mocha_typescript_1.suite
], MapTest);
