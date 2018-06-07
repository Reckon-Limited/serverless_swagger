"use strict";
var _ = require("lodash");
var fs = require("fs");
var yaml = require("js-yaml");
var generator_1 = require("./generator");
var ServerlessSwaggerPlugin = (function () {
    function ServerlessSwaggerPlugin(serverless, options) {
        var _this = this;
        this.generate = function () {
            _this.log('generate');
            var definitions = generator_1.generate(_this.swagger.paths, _this.namespace, _this.outputPath);
            _this.writeSlsFunctions(definitions);
        };
        this.run = function () {
            _this.log('Mapping Function Definitions');
            var definitions = generator_1.map(_this.swagger.paths, _this.serverless.service.functions);
            _this.serverless.service.functions = definitions;
            console.log(JSON.stringify(definitions));
        };
        this.log = function (msg) {
            _this.serverless.cli.log(msg);
        };
        this.serverless = serverless;
        this.provider = 'aws';
        this.swagger = this.loadSwagger();
        generator_1.bindLog(this.log);
        this.commands = {
            "swagger": {
                usage: 'Build an ECS cluster',
                lifecycleEvents: ['run']
            }
        };
        this.hooks = {
            'deploy:compileFunctions': this.run,
            'swagger:run': this.generate,
        };
    }
    ServerlessSwaggerPlugin.prototype.loadSwagger = function () {
        if (this.hasSwaggerFile()) {
            return yaml.safeLoad(fs.readFileSync(this.swaggerFile, 'utf8'));
        }
        else {
            return {};
        }
    };
    Object.defineProperty(ServerlessSwaggerPlugin.prototype, "swaggerFile", {
        get: function () {
            var swagger_file = _.get(this.serverless, 'service.custom.swagger_file') || 'swagger.yml';
            return this.serverless.config.servicePath + "/" + swagger_file;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerlessSwaggerPlugin.prototype, "serverlessFile", {
        get: function () {
            return this.serverless.config.servicePath + "/serverless.yml";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerlessSwaggerPlugin.prototype, "namespace", {
        get: function () {
            return this.serverless.processedInput.options.output || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerlessSwaggerPlugin.prototype, "outputPath", {
        get: function () {
            if (this.serverless.processedInput.options.output) {
                return this.serverless.config.servicePath + "/" + this.serverless.processedInput.options.output;
            }
            else {
                return this.serverless.config.servicePath;
            }
        },
        enumerable: true,
        configurable: true
    });
    ServerlessSwaggerPlugin.prototype.hasSwaggerFile = function () {
        return fs.existsSync(this.swaggerFile);
    };
    ServerlessSwaggerPlugin.prototype.writeSlsFunctions = function (definitions) {
        var config = this.loadSls();
        config.functions = config.functions || {};
        _.merge(config.functions, definitions);
        fs.writeFileSync('serverless.yml', yaml.safeDump(config));
    };
    ServerlessSwaggerPlugin.prototype.loadSls = function () {
        return yaml.safeLoad(fs.readFileSync(this.serverlessFile, 'utf8'));
    };
    return ServerlessSwaggerPlugin;
}());
module.exports = ServerlessSwaggerPlugin;
