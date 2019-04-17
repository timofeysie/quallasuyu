# Myorg

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

## Managing state
## Starting out
## The dep-graph
## Prettier

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


### React only commands

Use ```-dry-run``` to preview the changes before committing them.
```
yarn ng generate lib --name=home --no-interactive --framework=react
yarn add react-router react-router-dom
npm install react-router react-router-dom // npm version
yarn ng generate lib --name=gifs --no-interactive --framework=react
yarn add axios # Install HTTP client
```


### Styled-components schematic

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


### Not a module errors

Out of the box we were getting this error:
```
ERROR in apps/todos/src/app/app.component.ts(3,22):
error TS2306: File '...index.ts' is not a module.
libs/ui/src/lib/todos/todos.component.ts(2,22):
error TS2306: File '...index.ts' is not a module.
```

The file is just an interface.  However, it wasn't being exported.  Easy fix.


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


#
## Quick Start & Documentation

[30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)

[Interactive tutorial](https://nx.dev/tutorial/01-create-application)

## Generate your first application

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
