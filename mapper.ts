import _ = require('lodash');

import fs   = require('fs');
import yaml = require('js-yaml');

export class Mapper {
  private swagger: any;
  private functions: any;
  private path: string;
  private log: {(msg: string): void};

  constructor(swagger: any, functions: any, path: string, log: {(msg: string): void} ) {
    this.swagger = swagger;
    this.functions = functions;
    this.path = path;
    this.log = log;
  }

  generate() {
    let functions:{[key: string]: any} = {}
      _.each(this.swagger.paths, (path: Array<any>, url: string) => {
        _.each(path, (options, method: string) => {
        let name = this.functionName(url, method);
        let handler = this.generateHandler(name);
        let event = this.generateEvent(url, method);

        functions[name] = {
          handler: handler,
          events: [event]
        };
      })
    });
    return functions;
  }

  map() {
    _.each(this.swagger.paths, (path: Array<any>, url: string) => {
      _.each(path, (options, method: string) => {

        let name = this.functionName(url, method);

        let fn = this.functions[name];

        if (!fn) {
          this.log(`Missing Handler: ${name}`)
          return false
        }

        let event = this.generateEvent(url, method);

        fn.events.push(event)
        this.log(`Mapped Handler: ${name} - ${method} - ${url}`);
      })
    });
  }

  generateEvent(url: string, method: string) {
    return {
      http: {
        method: method,
        path: url
      }
    }
  }

  generateHandler(name: string) {
    let file = `${this.path}/${name}.js`

    if (fs.existsSync(file)) {
      this.log(`Function handler exists ${name}`);
    } else {
      this.log(`Creating function handler ${name}`);
      let handler = this.functionHandler(name);
      fs.writeFileSync(file, handler);
    }

    return `${name}.main`;
  }

  functionName(url:string, method: string) {
    return _.camelCase(`${url}${_.upperFirst(method)}`)
  }

  functionHandler(name: string) {
    return `\n\
    module.exports.main = (event, context, callback) => {\n\
      const response = {\n\
        statusCode: 200,\n\
        body: JSON.stringify({\n\
          name: '${name}'\n\
        }),\n\
      };\n\
      callback(null, response);\n\
    };`
  }
}
