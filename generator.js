"use strict";
var _ = require("lodash");
var fs = require("fs");
function log(s) { }
function bindLog(fn) {
    this.log = fn;
}
exports.bindLog = bindLog;
function definition(handler, url, method) {
    return {
        handler: "" + handler,
        events: [
            httpEvent(url, method)
        ]
    };
}
exports.definition = definition;
function handler(namespace, name) {
    if (namespace == '') {
        return name + ".main";
    }
    else {
        return namespace + "/" + name + ".main";
    }
}
exports.handler = handler;
function httpEvent(url, method) {
    return {
        http: {
            method: method,
            path: url
        }
    };
}
exports.httpEvent = httpEvent;
function name(url, method) {
    var m = _.upperFirst(method);
    // let n = url.replace(/{(.*?)}/g, '');
    return _.camelCase(m + " " + url);
}
exports.name = name;
function src(name) {
    return "\nmodule.exports.main = (event, context, callback) => {\n  const response = {\n    statusCode: 200,\n    body: JSON.stringify({\n      name: '" + name + "'\n    }),\n  };\n  callback(null, response);\n};";
}
exports.src = src;
function writeHandler(path, name) {
    var file = path + "/" + name + ".js";
    if (fs.existsSync(file)) {
        log("Function handler exists " + name);
    }
    else {
        log("Creating function handler " + name);
        fs.writeFileSync(file, src(name));
    }
}
exports.writeHandler = writeHandler;
function generate(swaggerPaths, namespace, outputPath) {
    var functions = {};
    _.each(swaggerPaths, function (path, url) {
        _.each(path, function (options, method) {
            var fn = name(url, method);
            var hn = handler(namespace, fn);
            var def = definition(hn, url, method);
            writeHandler(outputPath, fn);
            functions[fn] = def;
        });
    });
    return functions;
}
exports.generate = generate;
function mapDefinitionEvent(definition, event) {
    var match = _.find(definition.events, function (e) {
        return e.hasOwnProperty('http');
    });
    if (match) {
        var index = _.indexOf(definition.events, match);
        definition.events.splice(index, 1, event);
    }
    else {
        definition.events.push(event);
    }
    return definition;
}
exports.mapDefinitionEvent = mapDefinitionEvent;
function map(swaggerPaths, functions) {
    var definitions = _.clone(functions);
    _.each(swaggerPaths, function (path, url) {
        _.each(path, function (options, method) {
            var fn = name(url, method);
            var definition = definitions[fn];
            if (!definition) {
                log("Missing Handler: " + fn);
                return false;
            }
            var event = httpEvent(url, method);
            definitions[fn] = mapDefinitionEvent(definition, event);
            log("Mapped Handler: " + fn + " - " + method + " - " + url);
        });
    });
    return definitions;
}
exports.map = map;
