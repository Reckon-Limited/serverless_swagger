import { suite, test, slow, timeout, skip, only } from "mocha-typescript";

import { expect } from 'chai';

import * as _ from 'lodash';

import { Mapper } from '../mapper';

/// <reference path="describe.d.ts" />

const swagger = {
  paths: {
    '/blah/vtha/id': {
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
  getBlahVthaById: {
    handler: 'getBlahVthaById/handler.main',
    events: []
  },
  getVtha: {
    handler: 'getBlahVthaById/handler.main',
    events: []
  }
}

describe('Generate http event for function', () => {
  @suite class PluginTest {
    mapper: Mapper

    before() {
      this.mapper = new Mapper(swagger, functions, (s) => {});
      this.mapper.map();
    }

    @test maps_blah_vtha_by_id(){
      let fn:any = functions.getBlahVthaById;
      expect(fn.events).to.not.be.empty;
    }

    @test maps_vtha(){
      let fn:any = functions.getVtha;
      expect(fn.events).to.be.empty;
    }

    @test has_post(){
      let fn:any = functions.getBlahVthaById;
      expect(fn.events[0].http.method).to.eq('post');
    }

    @test has_path(){
      let fn:any = functions.getBlahVthaById;
      expect(fn.events[0].http.path).to.eq('/blah/vtha/id');
    }
  }
});
