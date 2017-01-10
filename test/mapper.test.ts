import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from 'chai';

import fs = require('fs');
const execSync = require('child_process').execSync;

import * as _ from 'lodash';

import { Mapper } from '../mapper';

/// <reference path="describe.d.ts" />

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

const functions = {
  postBlahVthaId: {
    handler: 'blah_vtha_id_post.main',
    events: []
  },
  vthaGet: {
    handler: 'vtha_get.main',
    events: []
  }
}

const expected = {
  postBlahVthaId: {
    handler: 'postBlahVthaId/handler.main',
    events: [
      {
        http: {
          method: 'post',
          path: '/blah/vtha/id'
        }
      }
    ]
  }
}

describe('Helpers', () => {
  @suite class PluginTest {
    mapper: Mapper

    before() {
      this.mapper = new Mapper(swagger, functions, './output', console.log);
    }

    @test functionHandler(){
      let result = this.mapper.functionHandler('blahGet')
      expect(result).to.include('module.exports.main');
      expect(result).to.include("name: 'blahGet'");
    }

    @test functionName(){
      let result = this.mapper.functionName('blah','get')
      expect(result).to.eq('getBlah');

      result = this.mapper.functionName('blah/{id}','get')
      expect(result).to.eq('getBlahId');

      result = this.mapper.functionName('{id}/blah/vtha/{id}','POST')
      expect(result).to.eq('postIdBlahVthaId');
    }

    @test generateEvent(){
      let result = this.mapper.generateEvent('blah/{id}','get')
      expect(result.http.method).to.eq('get');
      expect(result.http.path).to.eq('blah/{id}');
    }

    @test generate(){
      let result = this.mapper.generateEvent('blah/{id}','get')
      expect(result.http.method).to.eq('get');
      expect(result.http.path).to.eq('blah/{id}');
    }

  }
});

describe('Generate javascript handler', () => {
  @suite class PluginTest {
    mapper: Mapper

    before() {
      try {
        execSync('mkdir -p ./output');
        execSync('rm ./output/*.js');
      } catch(err) {
        console.log(err.message);
      }
      this.mapper = new Mapper(swagger, functions, './output', console.log);
    }

    @test generateHandlerFile(){
      this.mapper.generate();
      let file = './output/postBlahVthaId.js';
      let result = fs.existsSync(file);
      expect(result).to.eq(true);
    }

    @test generateHandlerLength(){
      let result = this.mapper.generate();
      expect(result).to.have.property('postBlahVthaId');
    }

    @test generateHandler(){
      let result:any = this.mapper.generate();
      expect(result.postBlahVthaId.handler).to.eq('postBlahVthaId.main');
    }
  }
});


describe('map swagger to http events', () => {
  @suite class PluginTest {
    mapper: Mapper

    before() {
      this.mapper = new Mapper(swagger, functions, '', (s) => {});
      this.mapper.map();
    }

    @test mapBlahVthaId(){
      let fn:any = functions.postBlahVthaId;
      expect(fn.events).to.not.be.empty;
    }

    @test mapVtha(){
      let fn:any = functions.vthaGet;
      expect(fn.events).to.be.empty;
    }

    @test hasPost(){
      let fn:any = functions.postBlahVthaId;
      expect(fn.events[0].http.method).to.eq('post');
    }

    @test hasPath(){
      let fn:any = functions.postBlahVthaId;
      expect(fn.events[0].http.path).to.eq('/blah/vtha/{id}');
    }
  }
});
