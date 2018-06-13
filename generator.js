"use strict";
var _ = require("lodash");
var fs = require("fs");
var dsk = require('path');

function log(s) {
    console.info(s);
}
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
function handler(namespace, name, dir) {
    var result = name + ".main";

    if (namespace == '') {
        if(dir)
            return dsk.join(dir,result);
        else 
            return result;
    }
    else {
        if(dir)
            return dsk.join(namespace,dir,result);
        else 
            return dsk.join(namespace,result);
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
function writeHandler(path, name , dir) {
    var file = '';  

    if (dir){
        dir = dsk.join(path,dir);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        file = dsk.join(dir,name + ".js");
    } else {
        file = path + "/" + name + ".js"
    }   

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

            var dir = _.camelCase(options ? options.tags[0] : null);
            var fn = name(url, method);
            var hn = handler(namespace, fn, dir);
            var def = definition(hn, url, method);
            writeHandler(outputPath, fn, dir);
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
