
Is it possible to use static compilation for route recognizer? Yes, but challenges:

- router.map would have to be statically analyzable
- route recognizer would have to be type script aware
- at the time of static analysis, all the interfaces would have to be specified

```
import { codeTemplate } from 'glimmer';

class Node {
  // This doesn't make sense. Model is stupid.
  // You MAYBE want temporarily added RIB
  model<T>(NodeArgs<T>) : someShit {
  },

  foo = 123,
  @tracked other = 999
  @codeTemplate children() {
    return ChildNode({ a: 123, infos: infos,  });
  }
}

class RootNode extends Node {
}



class UserNode extends Node {
  @inject @urlParam userId;



  buildChildren() {

  }
}

class PostsNode extends Node {
  // children can also inject URL params from their parent.
  // parents can provide params for their children???
  @inject @urlParam userId;


}

router.add([
  { path: "/", handler: IRootNode },
  { path: "/UserId/:userId", handler: IUserNode }
  { path: "/posts", handler: IPostsNode }
]);




import IRootNode from 'nodes/root';
import IUserNode from 'nodes/root';
import IPostsNode from 'nodes/root';

// these imports could be generated / assumed;
// stringly typed but statically analyzed.

router.add([
  { path: "/", handler: IRootNode },
  { path: "/UserId/:userId", handler: IUserNode }
  { path: "/posts", handler: IPostsNode }
]);








nodes.json

// TLDR youre "map" file generates stuff,
// modules that Provide injections, other things.
// If you change something 

// implicit root
export default {
  children: {
    main: {
      loggedIn: {
      },
      loggedOut: {
        loggedOut: {
        },
      },
    }
  }
};


```
import ChildNodeBuilder from 'builder:oh-shitch/child-node';

    buildChildren() {
      return {
        main: ChildNodeBuilder.build(
          state: wat(),
          props: wat(),
          di: di,
          di: EmptyDep(),

          // difference b/w di and props?
        )
      };
    }
```






// TODO:
assume no async, just get stuff working.



```
  // <A><B><C></C></B></A>
  // A.constructor
  // - this is created as part of the patch
  // A.render
  // B.constructor
  // B.render
  // C.constructor
  // C.render

  // then say we change A.state/props
  // A.render()
  // - returns <B> with same props {}. bprops.key is same, preserves component.
  // B.render()
  // - same, but let's pretend cProps is changed. We match on component type.
  // C.render()
```

The problem/challenge is it'd need to be end-to-end typescript.

```
  // tree.subscribe('root.wat', { eager: true })
  tree.changes('root.wat', { eager: true }).subscribe(() => {
  });
```

Random abstract idea that i think is ok:

Child, while it is "subscribed" to, while the tree is alive, can
subscribe to something. You could put something on the DI graph from root,
a subscribable/observable. Ultimately, your screen is a top level matrix of
pixels that "subscribes" to this nested-then-flattened tree. And there's
no issue with that. Parameterizing the tree is no different then what
the browser needs to do to recursively paint the DOM. It's a data structure,
it gets queried. Changes to inner nodes cause global repaints.


```
<Root>
  <Parent>
    <Child></Child>
  </Parent>
</Root>






so everything's a god damn vdom factory.


return ChildNodeBuilder




import WebService from 'my-app/services/web-service';
import { provides } from 'ember-di';

class ChildNode {
  @provides
  webService(hostUrl : URL) {
    return new WebService();
  }
}
```










## ember-later






```
import { later } from 'ember-later';
import { task } from 'ember-concurrency';

export default Component.extend({
  task(function * () {
    while(true) {
      doStuff();

      // timer loop that forever pauses tests
      yield timeout(5000, 'timer-tag');
    }
  }),
});









// in ember-concurrency

import { later } from 'ember-test-timers';


let 


export function timeout(ms, testLabel) {
  let timerId;
  let promise = new Promise(r => {
    timerId = later(r, ms, testLabel);
  });
  promise.__ec_cancel__ = () => {
    // remove from internal hash
    cancel(timerId);
  };
  return promise;
}








// in ember-test-timers

export function later(callback, ms, testLabel) {
  if (Ember.testing) {

  } else {
    Ember.run.later(callback, ms);
  }
}









timerLoop: task(function * () {
  while(true) {
    this.incrementProperty('lol');
    yield timeout(5000, 'test-timer-tag');

    // once you opt into tagging a timer, you
    // risk breaking other tests that expect it to run
    // to completion. maybe the logic should be:
    // execute first one 

  }
}).on('init')




import { fetchTimers, setTimerBehavior } from 'ember-concurrency/testing';

setTimerBehavior(() => {
});

test('something', async function() {
  let timer = timeout(5000, 'test-tag'):

  while(true) {
    yield timer;
  }

  await visit('/route-w-test-timer-tag');

  // normally this would block forever due to timer loop,
  // but since a test tag ("test-timer-tag") is specified, this timer
  // doesn't resume the task (and doesn't block test settling)
  // unless explicitly queried/resumed in the test
});

```


## Difference between node and all other run of the mill objects?


Answer: probably not a lot.








```
import HasUserSessionNode from 'nodes/has-user-session';
import GetUserSessionNode from 'nodes/get-user-session';

class RootNode extends Node {
  @build
  childNode(userSession : UserSession) {
    if (userSession) {
      return new HasUserSessionNode();
    } else {
      return new GetUserSessionNode();
    }
  }

  userSession: UserSession;
}









class LoggedInNode extends Node {
  @build
  childNodes(parent : Dependency) {
  }

  wsUrl: String;

  @build
  loginService(wsUrl: String) {
  }
}
```



## childNode vs childNodes

```
  @build
  childNodes(userSession : UserSession) {
    let wat = {};

    if (thing) {
      wat.borf = new SomeNode();
    }

    if (thing2) {
      wat.borf = new SomeNode2();
    }

    if (thing3) {
      wat.borf = new SomeNode3();
    }

    return wat;
  }
```


## Gameplan

- [ ] get sync navigation working
- [ ] get observables working as a method of subscribing to changes
- [ ] explore typescript

## RenderComponent vs StateTree

In React you do RenderComponent(<App />, domElement).

I think... the DOM element is the atom. But in our case, our atom is the
in memory tree.


## So how can i use microstates here?

When something does a setState then omg... we're in the right
place to use microstates. Next up: use setState.

## McRIB vs Microstates vs React vs Glimmer:

We re-render the state tree every time.






So, maybe the rule is anything that anything that can
be swapped out is a node? Unlike React, which has to model
DOM, we have names of things. Should we make it possible to render
nodes as data? And just have the data live on the nodes?

Goals to keep in mind:

1. Strong decoupling between parent and child; parent should not
   be able to reach into children and futz around with data.
   Observables down (props?)... something/callbacks/listeners up?
2. We like the idea of state changing in a way that things are well
   scoped and get cleaned up. This might not be a real concern.
   Stable references good. So maybe just CPs.
3. What's the difference between a child node (which we should never
   touch) and a service that we materialize for downstream use? I don't know.

I like the idea of scoped computeds that get destroyed when invalidated.
Maybe they're more like owned getters with no dep keys. The worry in the past
was what if you pass the service to someone and then they outlive you?
Maybe this is something that can be prevented with DI scopes?





Cool, so anyway, how do we render to the screen?


- root
  - foo
    - bar



{{outlet 'main'}}
{{outlet 'header'}}
{{outlet 'other'}}

So render destinations should be passed in like any other destination.
For react, the render destination is passed in by way of the parent.


// ParentComponent
render() {
  return <ChildComponent />
}

// ChildComponent
render() {
  return <SubComponent />
}

// SubComponent
render() {
  return <div></div>
}

in all of these cases, render constructs a renderable. Each one implicitly gets
passed a location to render, which is... right there.


What if you could do:

// ParentComponent

render() {
  return [
    RenderBinding(<HeaderComponent />, this.props.headerComponent),
    RenderBinding(<BodyComponent />, this.props.BodyComponent),
    RenderBinding(<FooterComponent />, this.props.footerComponent),
    // presumably there'd be a default called "here"
  ];
}

class Node {
  @provides
  myService: owned(() => 
}


Would be great if we could use the Type system prevent render into something
that's already filled in; make it explicit what's a stack.


## React / Glimmer

Re-render app state everytime. As part of reconciliation, we'll make as
small changes as possible, in exactly where they need to change. Glimmer will see
these changes and efficiently render on next tick and what not. Best of both worlds?

## So how to get stuff rendering

Depends on navigation.

Imagine a transition type where you push it. You have options for
how to model that. Rules:

1. Some but not all nodes has a component/template
2. In order to render component from a node, it needs to have
   some kind of target ("outlet"?) to render into it.
   liquid-outlet is just one kind. You could also imagine
   another kind of outlet that is logical... it's a slot, that's yours
   to consume or delegate, it might logically represent the top of a stack,
   but then you render into it and you WIN! If the old pod is still around
   then it'll support sliding back. You never actually leave the route.

FlowPod
- Screen1Pod
- NavStack: []

FlowPod
- Screen1Pod
- Screen2Pod
- NavStack: [Screen1Pod]

FlowPod
- Screen1Pod
- Screen2Pod
- Screen3Pod
- NavStack: [Screen1Pod, Screen2Pod]

FlowPod
- Screen1Pod
- Screen2Pod
- Screen3Pod
- Screen4Pod
- NavStack: [Screen1Pod, Screen2Pod, Screen3Pod]

As you can see, you're adding more pods.
Possible to represent as:

FlowPod
- Screen1Pod
  - Screen2Pod
    - Screen3Pod
      - Screen4Pod
- NavStack: [Screen1Pod, Screen2Pod, Screen3Pod]

## What are blocks in this realm?

You're passing a component with some interesting binding guarantees (TCP)

The rendering component basically says, "while i'm alive, you're alive,
and during that time, you render to this slot I provide you... it's
inside me".

## Glimmer QQ: is component instance coupled to dom it maintains?

What if I wanted to teardown all the stuff on a component.

## Ember portal header use case?

How do you render into a portal that might not exist yet?

- Today the intermediary is a server that stores portal names
  in a hash.
- Technically that could still work, but much better would be:
- Declare the header slot in JS, and DI it into the header,
  and DI it into whoever wants to render into it (e.g. body).
- voila, runtime errors (especially quite ones) now fixed at compile time :)

- What's the difference between an outlet and portal/elsewhere?
  - basically both have 3 components:
    - a. the JS object/identity/atom/pipe
    - b. the component that renders into the pipe
    - c. the component that decides where to render to
  - outlet currently just reads off outlet state
    - `{{outlet}}` is c
    - the outlet name is kind of `a.` but very implicit
    - the child route that renders into requested parent outlet

## Outlet is one usecase for a pipe. So is ember-elsewhere.

## DI revelation

What's so bad about hidden dependencies?

- kinda bad but OK: they serve as documentation, so if they're hidden,
  it's hard to look at a piece of code and know what needs to change
- Much Worse: refactoring / moving things around calls late runtime breakage.
- If you want the documentation and have the means for it then drill holes,
  otherwise use the type system (I guess this is why they added types to Context?
  it's not quite DI... but it does type check... but it only type checks what
  you put in).

## Outlets

We shouldn't change terminology. Pods with components need an outlet to render into.

## Flattening the tree?




```
class DIContainer<T> {
  requiredProps: T;
}


type Token = { authToken: string };
class LoggedInNode {
  di: DIContainer<Token>;
}

class Node<R = {}> {
  di: DIContainer<R>
}

type Token = { authToken: string };

type SubContainer<N, T> = DIContainer<T & N['parent']['di']>
type DependentContainer<T> = DIContainer<T>

class LoggedInNode extends Node {
  di: DependentContainer<Token>
}

class CoolerThingThatKnowsALot extends Node {
  parent: RootNode;
  di: SubContainer<CoolerThingThatKnowsALot, Token>
  // or maybe `SubContainer<ThisType, Token>`
}


export class Node {


  // Node gets provided a compliant di container

  di : DIContainer;

  constructor(props, di) {
    this.props = props;
    this.di = di;
  }

  buildChildren() {
    return {};
  }

  willDestroy() {}

  destroy() {
    this.willDestroy();
  }
}


class RootNode extends Node {

  di : DIContainer;
}

class LoggedInNode extends Node {

  // authToken

  di : DIContainer<RootDiContainer + LoggedInStuff>;

}
```





