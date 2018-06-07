import _ = require('lodash');
import fs   = require('fs');
import yaml = require('js-yaml');

import { Serverless, Command } from './serverless';

import { generate, map, bindLog, Definition } from './generator';

class ServerlessSwaggerPlugin {

  private provider: string;
  private serverless: Serverless;
  private commands: {[key: string]: Command};
  private hooks: {[key: string]: Function};
  private swagger: any

  constructor(serverless: Serverless, options: any) {
    this.serverless = serverless;
    this.provider = 'aws';
    this.swagger = this.loadSwagger();

    bindLog(this.log)

    this.commands = {
      "swagger": {
        usage: 'Build an ECS cluster',
        lifecycleEvents: ['run']
      }
    };

    this.hooks = {
      'deploy:compileFunctions': this.run,
      'swagger:run': this.generate,
    }
  }

  generate = () => {
    this.log('generate');

    let definitions = generate(this.swagger.paths, this.namespace, this.outputPath);


    this.writeSlsFunctions(definitions)
  }

  run = () => {
    this.log('Mapping Function Definitions');
    let definitions = map(this.swagger.paths, this.serverless.service.functions);
    this.serverless.service.functions = definitions
    console.log(JSON.stringify(definitions));
  }

  log = (msg: string) => {
    this.serverless.cli.log(msg);
  }

  loadSwagger() {
    if (this.hasSwaggerFile()) {
      return yaml.safeLoad(fs.readFileSync(this.swaggerFile, 'utf8'));
    } else {
      return {}
    }
  }

  get swaggerFile() {
    let swagger_file = _.get(this.serverless, 'service.custom.swagger_file') || 'swagger.yml'
    return `${this.serverless.config.servicePath}/${swagger_file}`;
  }

  get serverlessFile() {
    return `${this.serverless.config.servicePath}/serverless.yml`;
  }

  get namespace() {
    return this.serverless.processedInput.options.output || ''
  }

  get outputPath() {
    if (this.serverless.processedInput.options.output) {
      return `${this.serverless.config.servicePath}/${this.serverless.processedInput.options.output}`
    } else {
      return this.serverless.config.servicePath
    }
  }

  hasSwaggerFile() {
    return fs.existsSync(this.swaggerFile);
  }

  writeSlsFunctions(definitions: {[fn:string]: Definition}) {
    let config = this.loadSls()
    config.functions = config.functions || {};
    _.merge(config.functions, definitions);

    fs.writeFileSync('serverless.yml', yaml.safeDump(config));
  }

  loadSls() {
    return yaml.safeLoad(fs.readFileSync(this.serverlessFile, 'utf8'));
  }

}

export = ServerlessSwaggerPlugin;
