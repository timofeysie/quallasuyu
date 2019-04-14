# Myorg

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

## Starting out

```
npx create-nx-workspace myorg // create a new workspace
ng g app todos // create the Angular app
ng serve todos // start it up
ng e2e todos-e2e --watch // run the e2e tests
ng g node-app api --frontendProject=todos // create the node app
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

look at what you have changed
```
npm run affected:apps -- --base=master
npm run affected:libs -- --base=master
run affected:test -- --base=master // retest all the affected projects.
npm run affected:test -- --base=master --only-failed // retest the failed projects.
```

ERROR in apps/todos/src/app/app.component.ts(3,22):
error TS2306: File '...index.ts' is not a module.
libs/ui/src/lib/todos/todos.component.ts(2,22):
error TS2306: File '...index.ts' is not a module.

The file is just an interface.  However, it wasn't being exported.  Easy fix.



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
