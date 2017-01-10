"use strict";
var _ = require("lodash");
var fs = require("fs");
var yaml = require("js-yaml");
var mapper_1 = require("./mapper");
var ServerlessSwaggerPlugin = (function () {
    function ServerlessSwaggerPlugin(serverless, options) {
        var _this = this;
        this.generate = function () {
            _this.log('generate');
            var mapper = new mapper_1.Mapper(_this.swagger, _this.serverless.service.functions, _this.outputPath, _this.log);
            var functions = mapper.generate();
            var config = _this.loadServerless();
            _.merge(config.functions, functions);
            _this.writeServerless(config);
        };
        this.run = function () {
            _this.log('Run');
            var mapper = new mapper_1.Mapper(_this.swagger, _this.serverless.service.functions, _this.outputPath, _this.log);
            mapper.map();
        };
        this.log = function (msg) {
            _this.serverless.cli.log(msg);
        };
        this.serverless = serverless;
        this.provider = 'aws';
        this.swagger = this.load();
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
    ServerlessSwaggerPlugin.prototype.load = function () {
        if (this.hasSwaggerFile()) {
            return yaml.safeLoad(fs.readFileSync(this.swaggerFile, 'utf8'));
        }
        else {
            return {};
        }
    };
    ServerlessSwaggerPlugin.prototype.loadServerless = function () {
        return yaml.safeLoad(fs.readFileSync(this.serverlessFile, 'utf8'));
    };
    ServerlessSwaggerPlugin.prototype.writeServerless = function (obj) {
        return fs.writeFileSync('serverless.yml', yaml.safeDump(obj));
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
    return ServerlessSwaggerPlugin;
}());
module.exports = ServerlessSwaggerPlugin;
