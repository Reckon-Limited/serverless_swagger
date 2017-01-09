"use strict";
var _ = require("lodash");
var fs = require("fs");
var yaml = require("js-yaml");
var mapper_1 = require("./mapper");
var ServerlessSwaggerPlugin = (function () {
    function ServerlessSwaggerPlugin(serverless, options) {
        var _this = this;
        this.run = function () {
            _this.log('Run');
            if (_this.hasSwaggerFile()) {
                var swagger = _this.load();
                var mapper = new mapper_1.Mapper(swagger, _this.serverless.service.functions, _this.log);
                mapper.map();
            }
        };
        this.log = function (msg) {
            _this.serverless.cli.log(msg);
        };
        this.serverless = serverless;
        this.provider = 'aws';
        this.commands = {
            "swagger": {
                usage: 'Build an ECS cluster',
                lifecycleEvents: ['run']
            }
        };
        this.hooks = {
            'deploy:compileFunctions': this.run,
            'swagger:run': this.run,
        };
    }
    ServerlessSwaggerPlugin.prototype.load = function () {
        return yaml.safeLoad(fs.readFileSync(this.swaggerFile, 'utf8'));
    };
    Object.defineProperty(ServerlessSwaggerPlugin.prototype, "swaggerFile", {
        get: function () {
            var swagger_file = _.get(this.serverless, 'service.custom.swagger_file') || 'swagger.yml';
            return this.serverless.config.servicePath + "/" + swagger_file;
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
