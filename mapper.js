"use strict";
var _ = require("lodash");
var Mapper = (function () {
    function Mapper(swagger, functions, log) {
        this.swagger = swagger;
        this.functions = functions;
        this.log = log;
    }
    Mapper.prototype.map = function () {
        var _this = this;
        _.each(this.swagger.paths, function (path, url) {
            _.each(path, function (options, method) {
                var name = _.camelCase(options.summary);
                var fn = _this.functions[name];
                if (!fn) {
                    _this.log("Missing Handler: " + name);
                    return false;
                }
                var event = {
                    http: {
                        method: method,
                        path: url
                    }
                };
                fn.events.push(event);
                _this.log("Mapped Handler: " + name + " - " + method + " - " + url);
            });
        });
    };
    return Mapper;
}());
exports.Mapper = Mapper;
