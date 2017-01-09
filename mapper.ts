import _ = require('lodash');

export class Mapper {
  private swagger: any;
  private functions: any;
  private log: {(msg: string): void}

  constructor(swagger: any, functions: any,log: {(msg: string): void} ) {
    this.swagger = swagger;
    this.functions = functions;
    this.log = log;
  }

  map() {
    _.each(this.swagger.paths, (path: Array<any>, url: string) => {
      _.each(path, (options, method: string) => {

        let name = _.camelCase(options.summary)
        let fn = this.functions[name];

        if (!fn) {
          this.log(`Missing Handler: ${name}`)
          return false
        }

        let event = {
          http: {
            method: method,
            path: url
          }
        }
        fn.events.push(event)
        this.log(`Mapped Handler: ${name} - ${method} - ${url}`);
      })
    });

  }
}
