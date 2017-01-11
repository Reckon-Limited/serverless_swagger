import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from 'chai';

import fs = require('fs');
const execSync = require('child_process').execSync;

import * as _ from 'lodash';

import * as fn from '../generator';

/// <reference path="describe.d.ts" />


fn.bindLog(console.log)

const opts = {
  swagger: {},
  functions: [],
  log: console.log
}

const swagger = {
  paths: {
    '/blah/vtha/{id}': {
      post: {
        summary: "Get blah vtha by id"
      }
    },
    '/blah': {
      get: {
        summary: "Get blah"
      }
    }
  }
}

describe('Function Helpers', () => {
  @suite class PluginTest {

    @test name(){
      let result = fn.name('blah','get')
      expect(result).to.eq('getBlah');

      result = fn.name('blah/{id}','get')
      expect(result).to.eq('getBlahId');

      result = fn.name('{id}/blah/vtha/{id}','POST')
      expect(result).to.eq('postIdBlahVthaId');
    }

    @test definition(){
      let result = fn.definition('blah.main','blah/{id}','get')
      expect(result).to.be.any;
      expect(result.handler).to.eq('blah.main');
    }

    @test handler(){
      let result = fn.handler('','get')
      expect(result).to.eq('get.main');

      result = fn.handler('vtha','get')
      expect(result).to.eq('vtha/get.main');
    }

    @test httpEvent(){
      let result = fn.httpEvent('blah/{id}','get')
      expect(result.http.method).to.eq('get');
      expect(result.http.path).to.eq('blah/{id}');
    }

    @test src(){
      let result = fn.src('blahGet')
      expect(result).to.include('module.exports.main');
      expect(result).to.include("name: 'blahGet'");
    }
  }
});

describe('Generates handler file', () => {
  @suite class PluginTest {

    path = './output/'
    name = 'blahVtha'

    before() {
      try {
        execSync('mkdir -p ./output');
        execSync('rm ./output/*.js');
      } catch(err) {
        console.log(err.message);
      }
    }

    @test generateHandlerFile(){
      fn.writeHandler(this.path, this.name);
      let file = './output/blahVtha.js';
      let result = fs.existsSync(file);
      expect(result).to.eq(true);
    }
  }
});

describe('Generates function config and handler files', () => {
  @suite class PluginTest {

    namespace = 'output'
    outputPath = './output/'


    before() {
      try {
        execSync('mkdir -p ./output');
        execSync('rm ./output/*.js');
      } catch(err) {
        console.log(err.message);
      }
    }

    @test generatesFunctionDefinitions(){
      let result: any = fn.generate(swagger.paths, this.namespace, this.outputPath );
      
      expect(result.postBlahVthaId).to.have.property('handler');
      expect(result.getBlah).to.have.property('handler');
    }

    @test generatesHandlerFile(){
      fn.generate(swagger.paths, this.namespace, this.outputPath);
      let file = './output/postBlahVthaId.js';
      let result = fs.existsSync(file);
      expect(result).to.eq(true);
    }

  }
});
