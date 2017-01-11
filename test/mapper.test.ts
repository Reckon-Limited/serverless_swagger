import { suite, test, slow, timeout, skip, only } from "mocha-typescript";
import { expect } from 'chai';

import * as _ from 'lodash';

import * as fn from '../generator';

/// <reference path="describe.d.ts" />

fn.bindLog(console.log)

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
    handler: 'postBlahVthaId.main',
    events: [
      {
        http: 'blah'
      }
    ]
  },
  vthaGet: {
    handler: 'vthaGet.main',
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

@suite class MapTest {
  definitions: any

  before() {
    this.definitions = fn.map(swagger.paths, functions)
  }

  @test mapBlahVthaId(){
    let fn:any = this.definitions.postBlahVthaId;
    expect(fn.events).to.not.be.empty;
  }

  @test mapVtha(){
    let fn:any = this.definitions.vthaGet;
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

  @test replacesHttp(){
    let fn:any = functions.postBlahVthaId;
    expect(fn.events[0].http).to.not.eq('blah');
  }
}
