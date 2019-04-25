# Quallasuyu

Checkout how the big enterprises share code in a mono-repo environment.

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

#
## Table of contents

* [Testing routing](#testing-routing)
* [100 Days of React Miniflix challenge](100 Days of React Miniflix challenge)
* [Managing state](#managing-state)
* [Starting out](#starting-out)
* [The dep-graph](#the-dep-graph)
* [Prettier](#prettier)
* [React commands](#react-commands)
* [Styled-components schematic](#styled-components-schematic)
* [Can't resolve and not a module errors](#can't-resolve-and-not-a-module-errors)
* [Fixing the tests](#fixing-the-tests)
* [Creating the React apps](#creating-the-React-apps)
* [Quick Start & Documentation](#1uick-Start-&-Documentation)
* [Generate an application](#generate-an-application)
* [Development server](#development-server)
* [Code scaffolding](#code-scaffolding)
* [Build](#build)
* [Running unit tests](#running-unit-tests)
* [Running end-to-end tests](#running-end-to-end-tests)
* [Further help](#further-help)


## Testing routing

What is the best way to setup routing with tests and all the other scaffolding stuff the cli and do.  

When creating an app, you can use a flag to generate the routing module:
```
ng new app-testing --routing
```

The docs say:
*When you generate a module, you can use the --routing option like ng g module my-module --routing to create a separate file my-module-routing.module.ts to store the module routes.  The file includes an empty Routes object that you can fill with routes to different components and/or modules.  You can use the --routing option with ng new to create a app-routing.module.ts file when you create or initialize a project.*

A bit of a tangent to get an in memory API setup and a few pages to use it.
```
 npm install --save angular-in-memory-web-api
 ng g s backend
 ng g s contact
 ng g c contact-list --frontendProject=todos
 ng g c contact-detail --frontendProject=todos
```

Setting up the [contacts](https://www.smashingmagazine.com/2018/11/a-complete-guide-to-routing-in-angular/) master/detail view was fine.  However, our todo add function is broken.  The console error is:
```
body: {error: "Collection 'addTodo' not found"}
headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
status: 404
statusText: "Not Found"
url: "/api/addTodo"
```

Even though the server is running, the app is not hitting it.  Have to deal with that later.  On a roll with the router testing right now.

```
Unexpected value 'HttpClient' imported by the module 'DynamicTestModule'. Please add a @NgModule annotation.
```

SO: *You have to import the module HttpClientModule and reference that in the imports.*

<rant>In Javascript, why cant the test code be the same as the app code?</rant>

Then our first router testing [from this article](https://codecraft.tv/courses/angular/unit-testing/routing/) works like this:
```
router.navigate(['']);
tick();
expect(location.path()).toBe('/contacts');
```

The reason we test for contacts is because that is our default rout in the routing module:
```
{ path: '', pathMatch: 'full', redirectTo: 'contacts' },
```

Next, testing the detail view route.  Ignoring the contact id, the tests are taking quite a long time to run, and the top of the output in the console says:
```
console.warn node_modules/@angular/core/bundles/core.umd.js:16879
  Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?
  ... x 4 ...
  ● Router: App › navigate to "contact" takes you to /contact
    Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'contact'
    Error: Cannot match any routes. URL Segment: 'contact'
```

I know there are two issues here.  Since the tests are taking about a minute and a half, fixing that first would allow a saner environment for fixing the second failing test.

One solution would be to wrap the tests inside a
```
fixture.ngZone.run(() => {
  ... test ...
});
```

The solution also calls for async, while we have been using the fakeAsync.  Using a real async works well.  Or at least it seemed to.  The two tests pass.  However, adding a third test like this failed after some time:
```
Cannot find name 'async'.
```

Switching back to fakeAsync and the three tests pass in about twenty seconds.  That a lot better than the usual 80 it was taking before, but still not speedy.  I wouldn't imaging that testing routing could take so long.

Another example of using fakeAsync looks like this:
```
it("fakeAsync works", fakeAsync(() => {
    let promise = new Promise(resolve => {
      setTimeout(resolve, 10);
    });
    let done = false;
    promise.then(() => (done = true));
    tick(50);
    expect(done).toBeTruthy();
}));
```

This test passes also, but with out three tests running between 30 to 50 seconds each time, it's not ideal.  Time to look at some route guard testing.  Maybe we can speed things up with a broader range of router testing methods.

Starting off with [this article](https://atom-morgan.github.io/how-to-test-angular-canactivate-guards/).  We will create another set of routes and an auth service for this:
```
ng g component restricted
ng g component unrestricted
ng g service services/auth/auth
ng g guard guards/auth/auth
```

After running prettier fix, we have a different situation.  Since only the affected files were tested before, we didn't know what kind of things were missing from the other tests.

```
Test Suites: 6 failed, 4 passed, 10 total
Tests:       10 failed, 5 passed, 15 total
Time:        441.638s
```

Let go thru these one at a time to get them out of the way:
```
 FAIL  apps/todos/src/app/contact-detail/contact-detail.component.spec.ts (260.874s)
        NullInjectorError: No provider for HttpClient!
 FAIL  apps/todos/src/app/contact-list/contact-list.component.spec.ts (260.873s)
  ● ContactListComponent › should create
    Template parse errors:
    Can't bind to 'routerLink' since it isn't a known property of 'a'. ("
        <td><a [ERROR ->][routerLink]="['/contact', contact.id]">Go to details</
  ● ContactListComponent › should create
 FAIL  apps/todos/src/app/app.component.spec.ts (260.89s)
  ● AppComponent › should create the app
    ReferenceError: Todo is not defined
    >  8 |       declarations: [AppComponent, Todo],
  ● AppComponent › should create the app
    Illegal state: Could not load the summary for directive AppComponent.
  ● AppComponent › should have as title 'todos'
    ReferenceError: Todo is not defined
    >  8 |       declarations: [AppComponent, Todo],
  ● AppComponent › should have as title 'todos'
    Illegal state: Could not load the summary for directive AppComponent.
  ● AppComponent › should render title in a h1 tag
    ReferenceError: Todo is not defined
    >  8 |       declarations: [AppComponent, Todo],
  ● AppComponent › should render title in a h1 tag
    Illegal state: Could not load the summary for directive AppComponent.
 FAIL  apps/todos/src/app/contact.service.spec.ts (30.221s)
  ● ContactService › should be created
        NullInjectorError: No provider for HttpClient!
 PASS  apps/todos/src/app/backend.service.spec.ts (31.009s)
 FAIL  apps/todos/src/app/app-routing.spec.ts (56.169s)
  ● Router: App › navigate to "" redirects you to /contacts
    Component UnrestrictedComponent is not part of any NgModule or the module has not been imported into your module.
  ● Router: App › navigate to "" redirects you to /contacts
    TypeError: Cannot read property 'ngZone' of undefined
    > 35 |     fixture.ngZone.run(() => {
  ● Router: App › navigate to "contact" takes you to /contact
    Component UnrestrictedComponent is not part of any NgModule or the module has not been imported into your module.
  ● Router: App › navigate to "contact" takes you to /contact
    TypeError: Cannot read property 'ngZone' of undefined
    > 43 |     fixture.ngZone.run(() => {
  ● Router: App › fakeAsync works
    Component UnrestrictedComponent is not part of any NgModule or the module has not been imported into your module.
 PASS  apps/todos/src/app/restricted/restricted.component.spec.ts (30.875s)
 PASS  apps/todos/src/app/unrestricted/unrestricted.component.spec.ts (56.203s)
 FAIL  apps/todos/src/app/guards/auth/auth.guard.spec.ts (60.718s)
  ● AuthGuard › should create
        NullInjectorError: No provider for Router!
 PASS  apps/todos/src/app/services/auth/auth.service.spec.ts (17.924s)
```

After a bit of work, things are only slightly better, now with errors that shouldn't be happening.
```
FAIL  apps/todos/src/app/contact-detail/contact-detail.component.spec.ts
 ● ContactDetailComponent › should create
   Unexpected value 'ActivatedRoute' imported by the module 'DynamicTestModule'. Please add a @NgModule annotation.
 ● ContactDetailComponent › should create
   Unexpected value 'ActivatedRoute' imported by the module 'DynamicTestModule'. Please add a @NgModule annotation.
 ● ContactDetailComponent › should create
   expect(received).toBeTruthy()
 ● Router: App › navigate to "" redirects you to /contacts
   Component UnrestrictedComponent is not part of any NgModule or the module has not been imported into your module.
 ● Router: App › navigate to "" redirects you to /contacts
   TypeError: Cannot read property 'ngZone' of undefined
   > 35 |     fixture.ngZone.run(() => {
 ● Router: App › navigate to "contact" takes you to /contact
   Component UnrestrictedComponent is not part of any NgModule or the module has not been imported into your module.
 ● Router: App › navigate to "contact" takes you to /contact
   TypeError: Cannot read property 'ngZone' of undefined
   > 43 |     fixture.ngZone.run(() => {
 ● Router: App › fakeAsync works
   Component UnrestrictedComponent is not part of any NgModule or the module has not been imported into your module.
FAIL  apps/todos/src/app/guards/auth/auth.guard.spec.ts
 ● AuthGuard › should create
   Component ContactListComponent is not part of any NgModule or the module has not been imported into your module.
FAIL  apps/todos/src/app/app.component.spec.ts
 ● AppComponent › should create the app
   ReferenceError: Todo is not defined
   >  8 |       declarations: [AppComponent, Todo],
 ● AppComponent › should create the app
   Illegal state: Could not load the summary for directive AppComponent.
 ● AppComponent › should have as title 'todos'
   ReferenceError: Todo is not defined
   >  8 |       declarations: [AppComponent, Todo],
 ● AppComponent › should have as title 'todos'
   Illegal state: Could not load the summary for directive AppComponent.
 ● AppComponent › should render title in a h1 tag
   ReferenceError: Todo is not defined
   >  8 |       declarations: [AppComponent, Todo],
 ● AppComponent › should render title in a h1 tag
   Illegal state: Could not load the summary for directive AppComponent.
FAIL  apps/todos/src/app/contact-list/contact-list.component.spec.ts
 ● ContactListComponent › should create
   Can't bind to 'routerLink' since it isn't a known property of 'a'. ("
  <td><a [ERROR ->][routerLink]="['/contact', contact.id]">Go to details</a></td>
 ● ContactListComponent › should create
   Template parse errors:
   Can't bind to 'routerLink' since it isn't a known property of 'a'. ("
  <td><a [ERROR ->][routerLink]="['/contact', contact.id]">Go to details</a></td>
 ● ContactListComponent › should create
   expect(received).toBeTruthy()
   Received: undefined
Test Suites: 5 failed, 4 passed, 9 of 10 total
Tests:       9 failed, 5 passed, 14 total
Time:        18.103s
```

After this, I was able to get the failing tests down to between 4 to 6.  Why the variation?  

Once it was even this:
```
Test Suites: 1 failed, 1 of 10 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1608.621s
```

That was after importing the AppModule into the app component spec tests. If you ignore the really mysterious/buggy ones, these are the main obstacles:
```
FAIL  apps/todos/src/app/guards/auth/auth.guard.spec.ts (13.672s)
 ● Console
       ● Test suite failed to run
         A "describe" callback must not return a value.
         Returning a value from "describe" will fail the test in a future version of Jest.
```

```
         const realDescribe = describe;
         describe = ((name, fn) => { realDescribe(name, () => { fn(); }); });
```

```
ReferenceError: Todo is not defined x 3
Illegal state: Could not load the summary for directive AppComponent. x 3
...
Test Suites: 2 failed, 8 passed, 10 total
Tests:       4 failed, 10 passed, 14 total
```

Those are *all* for the app.component.spec.  If we *don't* import the Todo class from the data library, then these are the errors:
```
FAIL  apps/todos/src/app/guards/auth/auth.guard.spec.ts
         A "describe" callback must not return a value.
         Returning a value from "describe" will fail the test in a future version of Jest.
         >  9 | describe('AuthGuard', () => {
 ● AuthGuard › encountered a declaration exception
   ReferenceError: AuthGuard is not defined
   > 18 |   it('should create', inject([AuthGuard], (guard: AuthGuard) => {
PASS  apps/todos/src/app/app-routing.spec.ts
PASS  apps/todos/src/app/contact-detail/contact-detail.component.spec.ts
PASS  apps/todos/src/app/backend.service.spec.ts
PASS  apps/todos/src/app/contact-list/contact-list.component.spec.ts
PASS  apps/todos/src/app/services/auth/auth.service.spec.ts
PASS  apps/todos/src/app/unrestricted/unrestricted.component.spec.ts
PASS  apps/todos/src/app/restricted/restricted.component.spec.ts
PASS  apps/todos/src/app/contact.service.spec.ts
FAIL  apps/todos/src/app/app.component.spec.ts (7.92s)
 ● AppComponent › should create the app
 ● AppComponent › should create the app
 ● AppComponent › should have as title 'todos'
 ● AppComponent › should have as title 'todos'
 ● AppComponent › should render title in a h1 tag
 ● AppComponent › should render title in a h1 tag
   Template parse errors:
   Can't bind to 'routerLink' since it isn't a known property of 'a'. ("<h1>Todos</h1>
   <h2><a [ERROR ->][routerLink]="'/contacts'">Contacts</a></h2>
Test Suites: 2 failed, 8 passed, 10 total
Tests:       4 failed, 10 passed, 14 total
Snapshots:   0 total
Time:        16.784s
```

Since the AuthGuard tests is still a work in progress, let's knock over the template parse errors in a way that's not going to cause other test errors.  Even though it's not used directly in that test, importing the router testing module fixes those.

The last error then is in the app.guard.spec where AuthGuard is not defined on this:
```
it('should create', inject([AuthGuard], (guard: AuthGuard) => {
  expect(guard).toBeTruthy();
}));
```

Since that's not the most important test in there, without it should pass all the tests.  But getting rid of it moves the error elsewhere.  And now we have four again.  If you fix up an issue in the AuthGuard spec, then we're getting six errors again on the app.component because of the file todo data model import.  
And the odd one out is:
```
FAIL  apps/todos/src/app/guards/auth/auth.guard.spec.ts (7.282s)
 ● AuthGuard › should create
   Component ContactListComponent is not part of any NgModule or the module has not been imported into your module.
```

This was happening a while ago.  The SO answers on this were all varied and not very helpful.

Removing the create test again and we are left only with the import @lib issue:
```
Test Suites: 1 failed, 9 passed, 10 total
Tests:       3 failed, 12 passed, 15 total
```



## 100 Days of React

This is an Instagram, Slack extraveganza of React learning.  Below are some of the projects and challenges.

### React To-Do App with React Hooks challenge

The week two challenge is more realistic.

https://scotch.io/tutorials/build-a-react-to-do-app-with-react-hooks-no-class-components

### Miniflix challenge

The code for this section lives in the minflex branch on Github.

Since this is an nx mono-repo project (many apps, one repo), we use the nx commands.  So instead of running this line from the [challenge](https://scotch.io/tutorials/build-a-mini-netflix-with-react-in-10-minutes):
```
create-react-app miniflix
```

We will run this line:
```
ng g app miniflix --framework=react
```

Ng is the Angular CLI, but notice we can use that power with React apps also.

p.s.  If you are curious about using nx to build an enterprise-class React (or other frontend/backend/full-stack) projects, checkout [this article](https://blog.nrwl.io/powering-up-react-development-with-nx-cf0a9385dbec).

Add [Bootstrap](https://getbootstrap.com/) (just remember Bootstrap is considered dangerous for serious projects).

Install these:
```
auth0-js react-router@3.0.0 jwt-decode axios
```

[jwt-decode](https://www.npmjs.com/package/jwt-decode) is a *jwt-decode is a small browser library that helps decoding JWTs token which are Base64Url encoded.*


Axios is an http lib.  I usually reach for Fetch, but Axios is pretty popular these days.

Next, and Auth0 lib which reveals what I'm assuming is the completed project [here](https://github.com/unicodeveloper/miniflix/blob/master/src/utils/AuthService.js).

The [linked to tutorial](https://github.com/auth0-blog/reactjs-authentication-tutorial) on Auth0 which I've used before with Angular I'm assuming will provide details of how to setup an Auth0 account and fill in the details needed to use Auth0:
```
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';
const CLIENT_ID = 'EeobY3jxsMoFREmqfmsZwAALQb73WeWm';
const CLIENT_DOMAIN = 'unicoder.auth0.com';
const REDIRECT = 'http://localhost:3000/callback';
const SCOPE = 'full:access';
const AUDIENCE = 'http://miniflix.com';
```

I would say that the hype at the beginning of the Scotch.io article which talks about 10 minutes from now as the finish time is now exposed as false.  Actually they sat the *app be ready in 8 minutes*.  Sure it will.  Nice clickbait.

The challenge is still valid.  When looking for my last role, I had quite a few tests like this that lasted anywhere from 100 on HackerRank to 3 or 4 hours of open ended implementations.

Rant over, there are some differences in the project structure created by nx and create-react-app.

### apps/miniflix/
```
src/app/app.tsx
```

### src/
```
index.js
```

In Nav.js:
```
import './app.css';
```

to this:
```
import '../app.scss';
```


When the tutorial says *open up index.js and add replace it with the code here*, we put that into src/app/app.tsx.

Then, when we run our project we have to specify which app to run in this mono-reopo world we created like this:
```
ng serve miniflix
```

### The service worker error

Running the app we get this error:
```
Failed to compile.
./app/app.tsx
Module not found: Error: Can't resolve './registerServiceWorker' in '/Users/tim/angular/myorg/apps/miniflix/src/app'
```

You might think that problems like this would inspire use to just follow along with the basic example and use create-react-app instead of a mono-repo built with nx.  Well, a little, but since I am trying to learn about using nx with all kinds of projects, this is a great way to get familiar with the workflow and the kinds of problems that arise during development.

If that line 23 of the app.tsx code is commented out:
```
//registerServiceWorker();
```

On the [Slack channel](https://code100days.slack.com/messages/DJ3DSR2RL/convo/CHJF83RPC-1555875663.326800/) Lenora Porter points out: *According to the article, the serviceWorker is called using*
```
import registerServiceWorker from './registerServiceWorker';
```
*and called again at the bottom of index.js with*
```
registerServiceWorker();
```
*I believe this is an old way of doing things.  Use this instead:*
```
import * as serviceWorker from './serviceWorker';
```
*and then*
```
serviceWorker.unregister();
```

### Cannot read property 'func' of undefined

After dealing with the service worker problem the error changes to this:
```
Uncaught TypeError: Cannot read property 'func' of undefined
    at Object.../../../node_modules/react-router/lib/PropTypes.js (PropTypes.js:8)
```

Going to clone the finished [repo here](https://github.com/unicodeveloper/miniflix.git) and see if it will run.  Actually, after reading the comments at the end of the Scoth.io article, I'm not going to bother.  Also, on the Slack channel, Tyrique Daniel said *noone found a fix will start a new tut tomorrow will share with the group*.

But, no, I don't like to give up so easy.  I want to know if that second function above is due to old router code.

The tutorial shows installing an exact version:
```
react-router@3.0.0
```

However, if we install it ourselves without the version number, we get:
```
react-router@3.2.1
```

But then the serve returns this runtime error (and warning that was maybe there before):
```
react-dom.development.js:62 Uncaught Invariant Violation: Target container is not a DOM element.
    at invariant (http://localhost:4200/vendor.js:4700:29)
    ...
client:148 [WDS] Warnings while compiling.
warnings @ client:148
client:154 ./main.tsx 4:36-39
"export 'App' was not found in './app/app'
warnings @ client:154
```


#
## Managing state

Managing state is a hard problem. Things that update the state concurrently need to coordinated:
* multiple backends
* web workers
* UI components

What should we store in memory, in the URL, or local UI state? How do we synchronize the persistent state, the URL, and the state on the server?

Types of states:
* Server state
* Persistent state
* The URL and router state
* Client state
* Transient client state
* Local UI state


It’s a good practice to reflect both the persistent and client state in the URL.
This is transient client state is not captured in this way.

Questions that can be asked about frontend state are:
Can it be shared? What is its lifetime.

Since the user can always interact with the URL directly, we should treat the router as the source of truth and the initiator of actions. The router should invoke the reducer

StoreRouterConnectingModule parses the URL and creates a router state snapshot. It then invokes the reducer with the snapshot, and only after the reducer is done it proceeds with the navigation.

The [example repo](https://github.com/vsavkin/state_management_ngrx4) shows how to implement the store router module connecting the reducer and its store to the router.  It follows the walkthrough in [this article](https://blog.nrwl.io/using-ngrx-4-to-manage-state-in-angular-applications-64e7a1f84b7b) by Victor Savkin, a co-founder of Nrwl used in this monotheistic project.


## Starting out

These are the commands walked thru by [the official nx articule](https://nx.dev/tutorial/12-summary).  There are also some variants on this list for demonstrative purposes.
```
npx create-nx-workspace myorg // create a new workspace
ng g app todos // create the Angular app
ng g app reactapp --framework=react // React
ng serve todos // start it up
ng e2e todos-e2e --watch // run the e2e tests
ng g node-app api --frontendProject=todos // create the node app
ng g s backend --frontendProject=todos // create the node app
yarn ng generate node-app --name=api --framework=nestjs --no-interactive
ng serve api // serve the app
ng build api // build the app
ng test api // test the app
ng g lib data // create shared interfaces
ng g lib ui // create ui lib
ng g component todos --project=ui --export
```
restart after ui lib changes
```
ng serve api
ng serve todos
```

Look at what has changed in the projects.
```
npm run affected:apps -- --base=master
npm run affected:libs -- --base=master
run affected:test -- --base=master // retest all the affected projects.
npm run affected:test -- --base=master --only-failed // retest the failed projects.
npm run affected:test -- --base=master --parallel // test all projects in parallel
npm run affected:build -- --base=master // By default, Nx builds libraries in the context of some application. mark a library as publishable to change it
npm run affected -- --target=build --base=master //  run any target against the affected projects in the graph
```

Affected commands Nx provides are:
```
affected:e2e // Runs E2E test for affected projects.
affected:lint // Lints affected projects.
affected:apps // Lists all affected apps.
affected:libs // Lists all affected libs.
affected:build // Builds all affected apps.
```


## The dep-graph


```
yarn dep-graph // generate the dependency graph which will open in a browser
yarn affected:dep-graph --base=master // affected nodes/paths highlighted in red
```

If an app depends on the api since it makes requests to it, modify nx.json to show this.

In nx.json, under projects, add an implicitDependencies section for the app.
```
  "projects": {
    "my-app": {
      "implicitDependencies": ["api"],
      "tags": []
    },
```



## Prettier
```
yarn format:check // Checks if files are formatted correctly.
yarn format:write // Updates files with correct formatting.
yarn lint
yarn test
yarn e2e --watch
```


## React commands

Use ```-dry-run``` to preview the changes before committing them.
```
yarn ng generate lib --name=home --no-interactive --framework=react
yarn add react-router react-router-dom
npm install react-router react-router-dom // npm version
yarn ng generate lib --name=gifs --no-interactive --framework=react
yarn add axios # Install HTTP client
```


## Styled-components schematic

The usual process goes like this:
1. Install styled-components as a dependency.
2. Create a new file for the component manually.
3. Create a test file for the component manually.
4. Add an entry to the index.ts file of the module.

Use a workspace schematic to automate this process.
```
yarn ng generate workspace-schematic react-component
```

Then, using parts of the @angular-devkit/schematics, @angular-devkit/core and @nrwl/schematics/src/utils/ast-utils libraries, create the boilerplate code in tools/schematics/react-component/index.ts.

You can see an example implementation [here](https://github.com/nrwl/react-nx-example/tree/master/tools).


## Can't resolve and not a module errors

Out of the box we were getting this error:
```
ERROR in apps/todos/src/app/app.component.ts(3,22):
error TS2306: File '...index.ts' is not a module.
libs/ui/src/lib/todos/todos.component.ts(2,22):
error TS2306: File '...index.ts' is not a module.
```

The file is just an interface.  However, it wasn't being exported.  Easy fix.

This happened again when adding the Giphy sample.  Alright, it's a slightly different error.
```
ERROR in ./app/app.tsx
Module not found: Error: Can't resolve '@my-app/gifs' in '/Users/tim/angular/myorg/apps/react-demo/src/app'
 @ ./app/app.tsx 5:0-36 18:105-109
 @ ./main.tsx
 @ multi (webpack)-dev-server/client?http://0.0.0.0:0 ./main.tsx
```

```
$ npm run affected:build -- --base=master
...
ERROR in apps/todos/src/app/app.module.ts(13,3): error TS2345: Argument of type '{ declarations: (typeof AppComponent)[]; imports: (typeof UiModule | typeof BrowserModule)[]; providers: undefined[]; bootstrap: (typeof AppComponent)[]; shemas: any[]; }' is not assignable to parameter of type 'NgModule'.
  Object literal may only specify known properties, but 'shemas' does not exist in type 'NgModule'. Did you mean to write 'schemas'?
apps/todos/src/app/app.module.ts(13,12): error TS2304: Cannot find name 'CUSTOM_ELEMENTS_SCHEMA'.
```

The following issue appears to be about to be resolved:
[fix(frontend): tsconfig paths resolution #1233](https://github.com/nrwl/nx/pull/1233)

A comment 13 days ago says *all Tsconfig paths should work*.  I should hope so.  However, it mentions paths with an asterix, not an '@', so maybe these issues are not related?




## Fixing the tests

```
FAIL  apps/todos/src/app/app.component.spec.ts (140.066s)
 AppComponent
   ✕ should create the app (4214ms)
   ✕ should have as title 'todos' (22ms)
   ✕ should render title in a h1 tag (20ms)
 ● AppComponent › should create the app
   Template parse errors:
   Can't bind to 'todos' since it isn't a known property of 'myorg-todos'.
```

Add Todo from '@myorg/data' to the imports and we get a different error.
```
ReferenceError: Todo is not defined
```

It is imported like this:
```
import { Todo } from '@myorg/data';
```

The '@' symbol indicates a scoped name.  That prefix allows related mpm packages to be grouped under a folder with that prefix to avoid polluting the node_modules.


Other failing tests probably related to the first failure:
```
● AppComponent › should create the app
  Illegal state: Could not load the summary for directive AppComponent.
    at syntaxError (../../../packages/compiler/src/util.ts:100:17)
```


## Creating the React apps

Changing my-app to react-demo.  [Source](https://blog.nrwl.io/powering-up-react-development-with-nx-cf0a9385dbec)
```
ng g app react-demo
yarn start
yarn ng generate lib --name=home --no-interactive --framework=react

yarn add react-router react-router-dom
npm install react-router react-router-dom
// (done) update our app component and styles

yarn ng generate lib --name=gifs --no-interactive --framework=react
yarn add axios // Install HTTP client
//  implement a Giphy search

// (done) to use the Gifs component from the app, update app.tsx
// (done) update environment.ts with the Giphy entry.

ng build my-app --prod // generate assets so that it can be served statically
```


#
## Quick Start & Documentation

[30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)

[Interactive tutorial](https://nx.dev/tutorial/01-create-application)

## Generate an application

Run `ng g app myapp` to generate an application. When using Nx, you can create multiple applications and libraries in the same CLI workspace.

## Development server

Run `ng serve myapp` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name --project=myapp` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build myapp` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Jest](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Cypress](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
