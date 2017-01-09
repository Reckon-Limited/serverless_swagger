import _ = require('lodash');
import fs   = require('fs');
import yaml = require('js-yaml');

import { Mapper } from './mapper'
import {Serverless, Command} from './serverless';

class ServerlessSwaggerPlugin {

  private provider: string;
  private serverless: Serverless;
  private commands: {[key: string]: Command};
  private hooks: {[key: string]: Function};

  constructor(serverless: Serverless, options: any) {
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
    }
  }

  run = () => {
    this.log('Run');
    if (this.hasSwaggerFile()) {

      let swagger = this.load();
      let mapper = new Mapper(swagger, this.serverless.service.functions, this.log);
      mapper.map();
    }
  }

  log = (msg: string) => {
    this.serverless.cli.log(msg);
  }

  load() {
    return yaml.safeLoad(fs.readFileSync(this.swaggerFile, 'utf8'));
  }

  get swaggerFile() {
    let swagger_file = _.get(this.serverless, 'service.custom.swagger_file') || 'swagger.yml'
    return `${this.serverless.config.servicePath}/${swagger_file}`;
  }

  hasSwaggerFile() {
    return fs.existsSync(this.swaggerFile);
  }
}

export = ServerlessSwaggerPlugin;
