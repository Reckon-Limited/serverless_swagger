# Serverless Swagger #

Maps swagger configuration to serverless handlers.

## Installation ##

If you don't have a serverless project, create one now:

```
sls create -t aws-nodejs --path MyService
cd MyService

```
then
```
yarn init 
```
or
```
npm init
```

Inside your serverless project directory:

```
yarn add serverless_framework_swagger_integration
```
or
```
npm install serverless_framework_swagger_integration
```

Add the following to serverless.yml:

```
plugins:
  - serverless_framework_swagger_integration
```

## Configuration ##

The plugin looks for a `swagger.yml` in your serverless project.
You can provide a different name by specifying a custom variable:

```
custom:
  swagger_file: swagger.yml
```

## Generation ##

A complete set of JS handlers and the appropriate serverless.yml configuration can be generated

```
sls swagger
```
Existing files should not be overwritten, meaning that the swagger can be updated and new functions generated without losing customisations.

Generated files can be output to a specified directory using the `--output` flag and a destination directory (which must exist).

```
sls swagger --output output
```

## Mapping ##

At deploy, each function will be mapped to API Gateway events based on the swagger specification.

Functions are mapped by parsing the path and method in the swagger spec to a function name in serverless.yml.

For example, given the following `serverless.yml` and `swagger.yml` definitions
```
functions:
  getClientById:
    handler: getClientById/handler.main
  getClientByName:
    handler: getClientByName/handler.main
```

```
  paths:
    /client/{id}:
      get:
        summary: "Get client  id"      
    /blah
      get:
        summary: "Get blah"      
```

The *getClientById* function will be mapped to an API gateway event in the form:

```
events:
  - http:
      method: get
      path: /client/{id}
```

The *getClientByName* does not match any summary information and will not have an event
