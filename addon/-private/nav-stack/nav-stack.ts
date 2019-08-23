import Ember from 'ember';
import { Frame } from './frame';
import { Map, MapScope } from '../../-dsl';
import { assert } from '@ember/debug';
import { set } from '@ember/object';

export interface NavParams {
  scope: MapScope;
  params: any;
  key: string;
}

export class NavStack {
  frames: Frame[];
  recognizer: any;
  frameSequence: number;
  // dataNodeResolverCache: { [k: string]: DataNodeResolver };

  constructor(public map: Map, public owner) {
    const RouteRecognizer = (Ember as any).__loader.require('route-recognizer')['default']
    this.recognizer = new RouteRecognizer();

    map.forEach(r => {
      let path = r.options.path || r.name;
      this.recognizer.add([{ path, handler: r.name }]);
    });

    this.frames = [];
    this.frameSequence = 0;
    // this.dataNodeResolverCache = {};
  }

  recognize(url) : NavParams[] {
    let results = this.recognizer.recognize(url);
    assert(`failed to parse/recognize url ${url}`, results);
    let name = results[results.length - 1].handler;

    /*
    let mapScopes = this.map.getScopePath(name);

    assert(`unexpected empty map scopes for url ${url}`, mapScopes.length > 0);

    let r = 0;
    return mapScopes.map(ms => {
      let params;
      if (ms.type === 'route' && ms.name !== 'root') {
        let recog = results[r++];
        assert(`ran out of recognizer results`, recog.handler === ms.name);
        params = recog.params;
      } else {
        params = {};
      }

      let key = ms.computeKey(params);

      return { scope: ms, params, key };
    });
    */
  }

  didUpdateStateString(stateString: string) {
    // This is a poorly named method that's used for initializing
    // the nav stack to a particular URL
    this.buildInitialStack(stateString);
  }

  buildInitialStack(stateString: string) {
    let json = JSON.parse(stateString);

    let frames: any[] = [];
    json.forEach((j, index) => {
      frames.push(this.frameFromUrl(j.url, index));
    });

    this._updateFrames(frames);
  }

  // resolverFor(type: string, dasherizedName: string) : DataNodeResolver {
  //   let fullName = `${type}:${dasherizedName}`;
  //   if (fullName in this.dataNodeResolverCache) {
  //     return this.dataNodeResolverCache[fullName];
  //   }

  //   let dataNodeResolver = new DataNodeResolver(this.owner, type, dasherizedName);
  //   this.dataNodeResolverCache[fullName] = dataNodeResolver;
  //   return dataNodeResolver;
  // }

  frameFromUrl(url, index: number) : Frame {
    let navParamsArray = this.recognize(url);

    /*
    let dataScope = new DataScope(baseScope);
    let componentName = navParamsArray[navParamsArray.length-1].scope.name;
    let frame = new Frame(url, dataScope, componentName, this.frameSequence++);

    navParamsArray.forEach(navParams => {
      let dasherizedName = navParams.scope.name;

      // 
      let dataNodeResolver = this.resolverFor('route', dasherizedName);

      let dataNode = dataScope.lookup(dasherizedName, navParams.key) ||
        new RouteDataNode(navParams.scope.name, navParams.key, dataNodeResolver, dataScope, navParams.params);

      dataScope.register(dasherizedName, dataNode);

      dataNode.provides.forEach(p => {
        frame.dataNode.addDependency(p)
      });
    });

    let dataNode = new SimpleDataNode('myRouter', `my-router-${frame.id}`, this.makeRouter(url, index));
    dataScope.register(dataNode.name, dataNode);
    dataScope.start();
    return frame;
    */

    return new Frame(url, "wat", 123)
  }

  navigate() {
    // TODO
  }

  push(url) {
    let frames = this.frames.slice();

    let lastFrame = frames[frames.length - 1];
    // let lastScope = lastFrame && lastFrame.dataScope;

    frames.push(this.frameFromUrl(url, frames.length));
    this._updateFrames(frames);
  }

  pop() {
    let frames = this.frames.slice();
    frames.pop();
    this._updateFrames(frames);
  }

  _updateFrames(frames) {
    set(this, 'frames', frames);
  }

  makeRouter(url: string, index: number) {
    return new MicroRouter(this, url, index);
  }
}

export class MicroRouter {
  constructor(public navStack: NavStack, public url: string, public index: number) { }

  transitionTo(o, ...args) {
    this.navStack.push(o);
  }

  goBack() {
    this.navStack.pop();
  }
}