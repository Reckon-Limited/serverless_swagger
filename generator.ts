import _ = require('lodash');

import fs   = require('fs');
import yaml = require('js-yaml');

export interface HttpEvent {
  http: {
    method: string,
    path: string
  }
}

export interface Definition {
  handler: string
  events: Array<HttpEvent>
}

function log(s: string) {
  console.info(s);
}

export function bindLog(fn: {(msg: string): void}) {
  this.log = fn;
}

export function definition(handler: string, url: string, method: string): Definition {
  return {
    handler: `${handler}`,
    events: [
      httpEvent(url, method)
    ]
  };
}

export function handler(namespace: string, name: string) {
  if (namespace == '') {
    return `${name}.main`;
  } else {
    return `${namespace}/${name}.main`;
  }
}

export function httpEvent(url: string, method: string):HttpEvent {
  return {
    http: {
      method: method,
      path: url
    }
  }
}

export function name(url:string, method: string) {
  let m = _.upperFirst(method);
  // let n = url.replace(/{(.*?)}/g, '');
  return _.camelCase(`${m} ${url}`)
}

export function src(name: string) {
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


export function writeHandler(path: string, name: string) {
  let file = `${path}/${name}.js`

  if (fs.existsSync(file)) {
    log(`Function handler exists ${name}`);
  } else {
    log(`Creating function handler ${name}`);
    fs.writeFileSync(file, src(name));
  }
}

export function generate(swaggerPaths: any, namespace: string, outputPath: string): {[fn:string]: Definition} {
  let functions:{[key: string]: any} = {}

  _.each(swaggerPaths, (path: Array<any>, url: string) => {
    _.each(path, (options, method: string) => {

      let fn = name(url, method);
      let hn = handler(namespace, fn);

      let def = definition(hn, url, method)

      writeHandler(outputPath, fn);

      functions[fn] = def
    })
  });

  return functions;
}

export function mapDefinitionEvent(definition: Definition, event: HttpEvent) {
  let match = _.find(definition.events, (e) => {
    return e.hasOwnProperty('http')
  });
  if(match){
    let index = _.indexOf(definition.events, match);
    definition.events.splice(index, 1, event);
  } else {
    definition.events.push(event);
  }
  return definition;
}

export function map(swaggerPaths: any, functions: any) {
  let definitions = _.clone(functions)

  _.each(swaggerPaths, (path: Array<any>, url: string) => {
    _.each(path, (options, method: string) => {

      let fn = name(url, method);
      let definition = definitions[fn];

      if (!definition) {
        log(`Missing Handler: ${fn}`)
        return false
      }

      let event = httpEvent(url, method);

      definitions[fn] = mapDefinitionEvent(definition, event);

      log(`Mapped Handler: ${fn} - ${method} - ${url}`);
    })
  });

  return definitions;
}
