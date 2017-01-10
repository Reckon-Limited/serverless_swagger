import _ = require('lodash');
import fs   = require('fs');
import yaml = require('js-yaml');

import { Mapper } from './mapper'
import { Serverless, Command } from './serverless';

class ServerlessSwaggerPlugin {

  private provider: string;
  private serverless: Serverless;
  private commands: {[key: string]: Command};
  private hooks: {[key: string]: Function};
  private swagger: any

  constructor(serverless: Serverless, options: any) {
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
    }
  }

  generate = () => {
    this.log('generate');

    let mapper = new Mapper(this.swagger, this.serverless.service.functions, this.outputPath, this.log);
    let functions = mapper.generate();

    let config = this.loadServerless()

    _.merge(config.functions, functions);

    this.writeServerless(config)
  }

  run = () => {
    this.log('Run');

    let mapper = new Mapper(this.swagger, this.serverless.service.functions, this.outputPath, this.log);
    mapper.map();

  }

  log = (msg: string) => {
    this.serverless.cli.log(msg);
  }

  load() {
    if (this.hasSwaggerFile()) {
      return yaml.safeLoad(fs.readFileSync(this.swaggerFile, 'utf8'));
    } else {
      return {}
    }
  }

  loadServerless() {
    return yaml.safeLoad(fs.readFileSync(this.serverlessFile, 'utf8'));
  }

  writeServerless(obj: any) {
    return fs.writeFileSync('serverless.yml', yaml.safeDump(obj));
  }

  get swaggerFile() {
    let swagger_file = _.get(this.serverless, 'service.custom.swagger_file') || 'swagger.yml'
    return `${this.serverless.config.servicePath}/${swagger_file}`;
  }

  get serverlessFile() {
    return `${this.serverless.config.servicePath}/serverless.yml`;
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
}

export = ServerlessSwaggerPlugin;
