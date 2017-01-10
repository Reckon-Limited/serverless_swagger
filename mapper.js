"use strict";
var _ = require("lodash");
var fs = require("fs");
var Mapper = (function () {
    function Mapper(swagger, functions, path, log) {
        this.swagger = swagger;
        this.functions = functions;
        this.path = path;
        this.log = log;
    }
    Mapper.prototype.generate = function () {
        var _this = this;
        var functions = {};
        _.each(this.swagger.paths, function (path, url) {
            _.each(path, function (options, method) {
                var name = _this.functionName(url, method);
                var handler = _this.generateHandler(name);
                var event = _this.generateEvent(url, method);
                functions[name] = {
                    handler: handler,
                    events: [event]
                };
            });
        });
        return functions;
    };
    Mapper.prototype.map = function () {
        var _this = this;
        _.each(this.swagger.paths, function (path, url) {
            _.each(path, function (options, method) {
                var name = _this.functionName(url, method);
                var fn = _this.functions[name];
                if (!fn) {
                    _this.log("Missing Handler: " + name);
                    return false;
                }
                var event = _this.generateEvent(url, method);
                fn.events.push(event);
                _this.log("Mapped Handler: " + name + " - " + method + " - " + url);
            });
        });
    };
    Mapper.prototype.generateEvent = function (url, method) {
        return {
            http: {
                method: method,
                path: url
            }
        };
    };
    Mapper.prototype.generateHandler = function (name) {
        var file = this.path + "/" + name + ".js";
        if (fs.existsSync(file)) {
            this.log("Function handler exists " + name);
        }
        else {
            this.log("Creating function handler " + name);
            var handler = this.functionHandler(name);
            fs.writeFileSync(file, handler);
        }
        return name + ".main";
    };
    Mapper.prototype.functionName = function (url, method) {
        var m = _.upperFirst(method);
        // let n = url.replace(/{(.*?)}/g, '');
        return _.camelCase(m + " " + url);
    };
    Mapper.prototype.functionHandler = function (name) {
        return "\n    module.exports.main = (event, context, callback) => {\n      const response = {\n        statusCode: 200,\n        body: JSON.stringify({\n          name: '" + name + "'\n        }),\n      };\n      callback(null, response);\n    };";
    };
    return Mapper;
}());
exports.Mapper = Mapper;
