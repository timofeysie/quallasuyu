# Quallasuyu

Checkout how the big enterprises share code in a mono-repo environment.

This has a number of front end projects written in both React and Angular, some shared UI and JavaScript libraries, and some NodeJS backend services.

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

## Table of contents

* [Workflow](#workflow)
* [Project history](#project-history)
* [Adding NgRx to the customer portal](#adding-NgRx-to-the-customer-portal)
* [NgRx and Nx](#ngRx-and-Nx)
* [@nxtend/ionic-react](*@nxtend/ionic-react)
* [The pros and cons of a monorepo projects](#the-pros-and-cons-of-a-monorepo)
* [Converting code to Typescript in NodeJS](#converting-code-to-Typescript-in-NodeJS)
* [Running on Minikube](#running-on-Minikube)
* [Fixing the Todos](#fixing-the-Todos)
* [Testing routing](#testing-routing)
* [Testing routing](#testing-routing)
* [100 Days of React](100-Days-of-React)
* [Auth0](#auth0)
* [The Miniflix challenge](#the-Miniflix-challenge)
* [To-Do App with React Hooks](#to-Do-App-with-React-Hooks)
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

## workflow

```bash
ng serve todos // start up the React app
ng e2e todos-e2e --watch // run the e2e tests
ng serve api // serve the Node app
ng build api // build the app
ng test api // test the app
npm run server // start the mock backend on http://localhost:3000
ng serve customer-portal // the Duncan
ng build --prod --app=customer-portal
ng build --prod -app=customer-portal --stats-json
npm run bundle-report-customer-portal
npm run dep-graph
```

Node server listens on http://localhost:3333/api

Endpoints:

```link
http://localhost:3333/api/todos
```

### How to Update Nx

```bash
yarn update
npm run update
```

### Install the nx CLI

```bash
yarn global add @nrwl/cli
npm install -g @nrwl/cli
```

Note: [This article suggests](https://dev.to/stereobooster/typescript-monorepo-for-react-project-3cpa) using yarn instead of npm in a monorepo because it supports workspaces to link cross-dependencies.

## Project history

The customer-portal app was created while following along with Duncan Hunter's [Workshop: Enterprise Angular applications with NgRx and Nx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/).

The completed source code can be found [here](https://github.com/duncanhunter/workshop-enterprise-angular-applications-with-ngrx-and-nx-cli-only).

At the end of the [Adding NgRx to the customer portal](#adding-NgRx-to-the-customer-portal) section, just after completing the app, some kind of versioning error killed the app.  The code is more that two years old, and changes in NgRx and possibly RxJS understandably will arise without taking great care of the code.

The error encountered is:

```bash
>ng serve customer-portal
Object prototype may only be an Object or null: undefined
TypeError: Object prototype may only be an Object or null: undefined
```

The following command should update Angular and other dependencies:

```bash
yarn add @nrwl/angular
...
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack   File \"<string>\", line 1
gyp ERR! stack     import sys; print \"%s.%s.%s\" % sys.version_info[:3];
...
gyp ERR! node -v v12.0.0
success Saved lockfile.
success Saved 2 new dependencies.
info Direct dependencies
└─ @nrwl/angular@9.2.2
info All dependencies
├─ @nrwl/angular@9.2.2
└─ jasmine-marbles@0.6.0
```

But this doesn't help the situation.  And there are breaking changes between Angular 7 and 9, so more work would have to be put into upgrading this project.

But since what we really want is to use this workshop to create a step by step guide for creating a generic feature that will include NgRx.

Starting with a current workspace and going through the workshop accounting for breaking changes, as well as paying attention to the unit tests to keep them passing will be the next goal.

As a proof of concept, the lightweight counter example from the NgRx official docs was implemented and unit tested using Angular 9.2 with Nrwl 9.2 in [the Clades workspace](https://github.com/timofeysie/clades).  Next the same steps completed here will be played out there.

In that project, we use ```nx test``` to run the unit tests.  However, this doesn't run in the Quallasuyu workspace.


```bash
> nx test
internal/modules/cjs/loader.js:613
    throw err;
    ^
Error: Cannot find module '@nrwl/workspace/src/command-line/supported-nx-commands'
Require stack:
- C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\@nrwl\cli\lib\init-local.js
```

Tried this:

```bash
> yarn add global @nrwl/workspace
```

Still same issue.  See work continuing on Clades for now.

## Adding NgRx to the customer portal

```bash
> ng g ngrx app --module=apps/customer-portal/src/app/app.module.ts  --onlyEmptyRoot
> ng generate ngrx auth --module=libs/auth/src/lib/auth.module.ts
```

Answered no to both of these questions:
```bash
? Is this the root state of the application? No
? Would you like to add a Facade to your ngrx state No
```

Is this a typo?
*Add NgRx Auth lib making it0 a state state*

Whichever, the second command creates the plus directory:
```bash
libs/auth/src/lib/+state/auth.x
```

The x is for these x.ts files:

* actions
* effects/spec
* reducer/spec
* selectors/spec

And that's it for that section.  Next is *Strong Typing the State and Actions*.  I think it's worth a commit just so we have a record of what the changes for the strong typing are.

Aside from the strong typings, the actions are more specific.  The generic actions were:

```bash
  LoadAuth = '[Auth] Load Auth',
  AuthLoaded = '[Auth] Auth Loaded',
  AuthLoadError = '[Auth] Auth Load Error'
```

The new actions are:

```bash
  Login = '[Auth Page] Login',
  LoginSuccess = '[Auth API] Login Success',
  LoginFail = '[Auth API] Login Fail'
```

The errors now on serve are:

```bash
ERROR in libs/auth/src/lib/+state/auth.effects.ts(7,3): error TS2305: 
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'LoadAuth'.

libs/auth/src/lib/+state/auth.effects.ts(8,3): error TS2305: 
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'AuthLoaded'.

libs/auth/src/lib/+state/auth.effects.ts(9,3): error TS2305: 
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'AuthLoadError'.

libs/auth/src/lib/+state/auth.effects.ts(15,68): error TS2339: 
Property 'LoadAuth' does not exist on type 'typeof AuthActionTypes'.

libs/auth/src/lib/+state/auth.reducer.ts(1,10): error TS2724: 
Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.actions"' has no exported member 'AuthAction'. Did you mean 'AuthActions'?

libs/auth/src/lib/+state/auth.reducer.ts(37,26): error TS2339: 
Property 'AuthLoaded' does not exist on type 'typeof AuthActionTypes'.
```

The default actions created do not match what is imported in the default reducer.

```bash
import { AuthAction, AuthActionTypes } from './auth.actions';
```

```bash
export type AuthActions = Login | LoginSuccess | LoginFail;
```

So yes, we need an 's'.  Then we get this:
```bash
WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/auth.module.ts 28:39-55
"export 'AUTH_FEATURE_KEY' was not found in './+state/auth.reducer'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.selectors.ts 4:41-57
"export 'AUTH_FEATURE_KEY' was not found in './auth.reducer'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.effects.ts 17:27-40
"export 'AuthLoadError' was not found in './auth.actions'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.effects.ts 13:27-37
"export 'AuthLoaded' was not found in './auth.actions'

WARNING in Duplicated path in loadChildren detected during a rebuild. We will take the latest version detected and override it to save rebuild time. You should perform a full build to validate that your routes don't overlap.
i ｢wdm｣: Compiled with warnings.
```

The app also has this in the console:

```bash
Error: StaticInjectorError(AppModule)[AuthEffects -> DataPersistence]: 
  StaticInjectorError(Platform: core)[AuthEffects -> DataPersistence]: 
    NullInjectorError: No provider for DataPersistence!
```

There are still some changes missing from this section.  Step 12 just finishes with the action file and some partial reduces.  Looking at the code for the completed project, there is no auth.selectors.ts file.  After removing that, the app runs, and there are just these warnings remaining:

```bash
WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/auth.module.ts 28:39-55
"export 'AUTH_FEATURE_KEY' was not found in './+state/auth.reducer'

WARNING in C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.selectors.ts 4:41-57
"export 'AUTH_FEATURE_KEY' was not found in './auth.reducer'
```

At this point, we have logged and logged out states, and we can see this in the Redux Chrome dev tools tab.

That says:

```bash
[Auth Page] Login {
  undefined: {
    loading: false => true
  }
}
[Auth API] Login Success {
  undefined: {
    loading: true => false
  }
}
```

So that's true.  Login succeeds, and the loader turns false.

But, the undefined is not helpful, and it seems that the Login action should not be about loading.  Shouldn't it say something like "authenticated: false => true"?

Other things to notice at this point is that the logout function doesn't register in the Redux tab.  After a break, starting the server again, we see this error:

```bash
ERROR in libs/auth/src/lib/auth.module.ts(12,3): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src/lib/+state/auth.reducer"' has no exported member 'AUTH_FEATURE_KEY'.
```

That was some old code in the auth module.  After that, a new Effect action was added to navigate on LoginSuccess, update AuthGuard to use the store and in the customer portal component on-load, check local storage and dispatch a LoginSuccess action and we navigate to the products page, which is still not implemented.

Next, selectors.  [The first step](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/14-ngrx-selectors) is to create in index file for the store.  Wait, didn't we have a selector file and delete it?  Why not call it auth.selector.ts, and not index.ts, which is like a barrel file?

The sample code shows the libs/auth/src/lib/+state/products.selectors.ts file.  In this file, it references files that don't exist yet.

```TypeScript
import { ProductsState, ProductsData } from './products.reducer';
import * as fromProduct from './products.reducer';
```

There is actually an auth reducer in the source file.  Maybe Duncan made a mistake with the source files he posted?  The next step is to add the products feature module, so instead of trying to figure out what was intended in this short step with almost no explanations, it might be just better to move on to step 15 for now.

Moving on, there is a typo on the next step brief: *In this section we challenge you understanding by adding a Products module like we did for login*.  "You" should be "your".

Going along with it,

```bash
ng generate ngrx products --module=libs/products/src/lib/products.module.ts
? Is this the root state of the application? No
? Would you like to add a Facade to your ngrx state No
```

Not sure if those are the correct answers.  It would be nice if the Duncan prepared the reader for this kind of thing, or most likely, these questions were added to the schema after he wrote this tutorial.  And the scale of the tutorial made updating it troublesome.

Add Products Action Creators

```TypeScript
  LoadProducts = '[Products Page] Load Products',
  LoadProductsSuccess = '[Products API] Load Products Success',
  LoadProductsFail = '[Products API] LoadProducts Fail'
```

Next, make a new ProductsService in products module, add an effect, a reducer

```bash
ng g service services/products/products --project=products
```

Decided to change the non-standard class urls from this:

```TypeScript
selector: 'demo-app-products',
```

To this:

```TypeScript
selector: 'app-products',
```

Also tried to change this:

```bash
import { productsQuery } from './../../+state';
```

To this:

```bash
import { productsQuery } from '../../+state/products.selectors';
```

The productsQuery is used like this:

```bash
this.products$ = this.store.pipe(select(productsQuery.getProducts)
```

But that causes this mouseover VSCode TypeScript error:

```bash
Property 'getProducts' does not exist on type '{ getLoaded: MemoizedSelector<object, any>; getError: MemoizedSelector<object, any>; getAllProducts: MemoizedSelector<object, any>; getSelectedProducts: MemoizedSelector<...>; }'.ts(2339)
```

getProducts is in effects, but productsQuery is in selectors.

The selector looks like this:

```TypeScript
import { productsQuery } from '../../+state/products.selectors';
export const productsQuery = {
  
  getLoaded,
  getError,
  getAllProducts,
  getSelectedProducts
};
...
this.products$ = this.store.pipe(select(productsQuery.getAllProducts))
```

See, no getProducts.  Can we use getAllProducts?

There is another error after a bit more work:

```bash
ERROR in C:/Users/timof/repos/timofeysie/quallasuyu/libs/products/src/lib/containers/products/products.component.ts
Module not found: Error: Can't resolve '../../+state/products.selectors' in 'C:\Users\timof\repos\timofeysie\quallasuyu\libs\products\src\lib\containers\products'
```

Instead of the productsQuery import shown above, this works:

```bash
import { getProducts } from './../../+state';
...
this.products$ = this.store.pipe(select(getProducts));
```

That was just trial an error there.  And then the product list shows up.

This is looking good for a follow up article which focuses on setting up NgRx with Nx.

### Use the entity adapter in the products reducer

To get the previous step going we jumped ahead to the code from the completed project.  It's worth noting some details about this step, since there actually is a bit of a description this time.
Duncan says:  *Extend ProductState with EntityState. By default it will make an entities and ids dictionary. You Add to this any state properties you desire.  Create an adapter and use it 's getInitialState method to make the initial state.*

Why would we need this?  The name is a bit deceiving.  If you look at the products component template from the previous step, you can see that it just dumps the json into the page.  Why is this?  Material design would make it easy to create a beautiful list, right?

```TypeScript
<div *ngFor="let product of products">
  {{product.name}}
</div>
```

The real reason you need entity is that the above causes this classic error:

```bash
Cannot find a differ supporting object '[object Object]' of type 'object'. NgFor only supports binding to Iterables such as Arrays.
```

Making a commit and getting the serve starting again showed this error on the previously working code:

```bash
Cannot find module '@angular/compiler'
Require stack:
- C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\@angular\compiler-cli\index.js
```

Tried this:

```bash
yarn
```

Then there was this error:

```bash
ERROR in libs/layout/src/lib/containers/layout/layout.component.ts(8,10): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src"' has no exported member 'productsQuery'.
libs/products/src/index.ts(2,15): error TS2307: Cannot find module './lib/+state/products.selectors'.0
```

Restarted and also restarted the editor and the same code now runs.

So back to entity, it's installed like this:

```bash
npm install @ngrx/entity
```

[The official docs](https://ngrx.io/guide/entity) say *Entity State adapter for managing record collections.*

There is no code on that page.  Despite the one line to install it, the following link is provided: *Detailed installation instructions can be found on the Installation page.*.  Thanks.  That's not what we need more detail on.

There is actually a lot of details [thanks to Duncan's like](https://github.com/ngrx/platform/blob/master/docs/entity/adapter.md).

Here are some more detail:

```TypeScript
export interface ProductsData extends EntityState<Product> {
```

This is the first time I notice that the whole project in the complete project code in named user-portal and not customer-portal like it is here.  That could be why the file in the Duncan code shows a file called users.reducer.ts.  So we should be able to just change the name of the file, which is all about products anyhow.  I'm waiting for the product list component by the way.

There were some intermittent errors that were soled by running yarn, restarting the server and restarting VSCode.  Not sure what's causing this and wish I knew exactly when and how to fix this kind of issue:

```bash
ERROR in libs/layout/src/lib/containers/layout/layout.component.ts(8,10): error TS2305: Module '"C:/Users/timof/repos/timofeysie/quallasuyu/libs/auth/src"' has no exported member 'productsQuery'.
```

That was an old issue, so I'm guessing there is a compiled file somewhere that wasn't updated.

Anyhow, on to the next step.  The last for the development side of things.

### Step 17 - Router Store

It says it's about the router, but includes the needed product list component.

```bash
ng g c components/product-list --project=products
```

It's nice that the CLI adds the new component to the products module for us.

When the markup to pass down the product is added to the container components template, we get another classic Angular error:

```VSCode
Can't bind to 'products' since it isn't a known property of 'app-product-list'.
```

That's because we need to add an Input reference in the list component.  Then we can add the list markup to the template, although Duncan lists the file as product-list.component.ts, not .html.  Getting used to this by the end of the tutorial.

After implementing all the steps, we have our products list, and a selector to filter by category.  No explanation of any of the steps except for the header of each step.  And when it's all done, nothing.  Just a link to the next section, which is about deployments.

```bash
> ng build --prod -a=admin-portal
Unknown option: '-a'
```

I think that should either be customer-portal as it shows in step 2, or user-portal as it's called in the completed project code.

As for the error, try a double dash:

```bash
C:\Users\timof\repos\timofeysie\quallasuyu>ng build --prod --a=customer-portal
You seem to not be depending on "@angular/core" and/or "rxjs". This is an error.
```

That's not good.  What I think Duncan means is "--app=customer-portal":

But the error remains.  Worse still, the serve is broken with this error:

```bash
Error: Cannot find module '@angular/compiler'
```

The usual yarn and restart doesn't work now.  Trying this long and drawn out approach:

```bash
> yarn add @angular/compiler-cli --save-dev
*delete node_modules?*
> yarn cache clean
> ng serve customer-portal
Object prototype may only be an Object or null: undefined
TypeError: Object prototype may only be an Object or null: undefined
    at setPrototypeOf (<anonymous>)
    at Object.__extends (C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\tslib\tslib.js:64:9)
```

That was a nice idea.  I recommend not to use a folder to delete node_modules on Windows.  It goes through this discovery process for about a minute and then deleting the 141,242 files it "discovered".

According to [these answers](https://stackoverflow.com/questions/57421582/typeerror-object-prototype-may-only-be-an-object-or-null-undefined-angular-8), it's an Angular issue fixed by an upgrade.  Not a bad idea actually.  According to [this answer](https://stackoverflow.com/questions/53122751/typeerror-object-prototype-may-only-be-an-object-or-null-undefined/53123468), it's a circular dependency.

The code was running before stopping the serve and doing the last commit.  So it's something that was compiling before, but not now, for whatever reason.

There is not that much on Google about this.  Things like *I suspect that many will see this error in the future, because a lot of us reexport from a central index.ts. Since we are doing that, it's tempting to import from index.ts in order to shorten the import path instead of importing the module directly.* from [the TS GitHub](https://github.com/Microsoft/TypeScript/issues/283140).

And *We find that they essentially always indicate poor layering in the engineering design.* as a duplicate [of this](https://github.com/microsoft/TypeScript/pull/21780).

If *cyclical dependencies lead to maintainability problems*, but the app was working fine at this point, could we ignore this particular instance?  There is nothing helpful in the stack trace to let us know where the problem lies.

There is a noImportCycles option.  Not sure how to set it, but this doesn't work:

```TypeScript
    "eslint.options": {
        "rules": {
            "noImportCycles": false
        }
    }
```

At this point, it's worth just committing the code.  It did work.  It might for someone else, who knows.  Until I can either fix the circular dependencies or upgrade Angular to fix it, right now, not sure.

Here are the remaining commands from step 18:

```bash
npm install  --save-dev webpack-bundle-analyzer
ng build --prod -a=customer-portal --stats-json
npm run bundle-report-customer-portal
npm run dep-graph
```

Then, the 18 step guide is done.  No thank you, no debrief.  Nothing.  Feeling like I can contribute to this subject on my own now.  Might try and write a blog about the RxJs used in the effects which is difficult to read for someone who may not be so familiar with the subject.

A note on the current system version used during creation of this project:

```bash
Angular CLI: 7.3.1
Node: 12.0.0
OS: win32 x64
Angular: 7.2.13
... common, compiler, core, forms, language-service
... platform-browser, platform-browser-dynamic, router

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.901.0
@angular-devkit/build-angular     0.13.8
@angular-devkit/build-optimizer   0.13.8
@angular-devkit/build-webpack     0.901.0
@angular-devkit/core              9.1.0
@angular-devkit/schematics        7.3.1
@angular/animations               7.2.16
@angular/cdk                      7.3.7
@angular/cli                      7.3.1
@angular/compiler-cli             9.1.1
@angular/flex-layout              7.0.0-beta.24
@angular/material                 7.3.7
@schematics/angular               7.3.1
@schematics/update                0.13.1
rxjs                              6.3.3
typescript                        3.2.2
webpack                           4.42.0
```

## NgRx and Nx

This is also know as "The Duncan Hunter".  Looking for any articles that show examples of how to do this is not easy.  The overwhelming results are all Duncan Hunter.  So, this is the saga of implementing the samples from his GitHub book on the subject.

Despite it being two years old now, there is not that much out there that covers using NgRx with the nx CLI.  Duncan kind of owns the field, so it's worth going through [his process](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/3-generating-components-and-nx-lib) as it was two years ago figuring there are a lot of people in Sydney who started off with that also.  And since this repo is a year behind also, should be a decent fit for all the deps.

```bash
ng g application customer-portal --style=scss --routing --prefix=app
ng g lib auth --routing --prefix=app --parent-module=apps/customer-portal/src/app/app.module.ts
ng s --project=customer-portal
```

There was a problem on the next step.

```bash
ng g c containers/login --project=auth
Could not find an NgModule. Use the skip-import option to skip importing in NgModule.
```

There is no accepted answer to [this question](https://stackoverflow.com/questions/51200919/could-not-find-an-ngmodule-use-the-skip-import-option-to-skip-importing-in-ngmo).

If we cd into the app directory, will the --project=auth still work?

Worth answering.  Using the --skip-import flag:

```bash
>ng g c containers/login --project=auth --skip-import
CREATE libs/auth/src/lib/containers/login/login.component.html (24 bytes)
CREATE libs/auth/src/lib/containers/login/login.component.spec.ts (621 bytes)
CREATE libs/auth/src/lib/containers/login/login.component.ts (266 bytes)
CREATE libs/auth/src/lib/containers/login/login.component.scss (0 bytes)
```

Moving on.  This is step 3 and it isn't until step 11 that ngrx starts.

```bash
>ng g c components/login-form --project=auth --skip-import
CREATE libs/auth/src/lib/components/login-form/login-form.component.html/spec.ts/.ts.scss
```

Why are we putting a login form in an auth lib?  And where is the AuthModule?

There is this file:

libs\auth\src\index.ts

But the Duncan shows this file:

libs/auth/src/auth.module.ts

Should the latter be created and added to the former?

There is a [GitHub](https://github.com/duncanhunter/Demo-App-NDC-Oslo-2018-Enterprise-Angular-applications-with-ngrx-and-nx) that should have all the completed code in it.

The index.ts 'barrel' file looks like this:

```bash
export * from './lib/auth.module';
export { AuthService } from './lib/services/auth/auth.service';
export { AuthGuard } from './lib/guards/auth/auth.guard';
export { AuthState } from './lib/+state/auth.reducer';
export * from './lib/+state/auth.actions';
export * from './lib/+state';
```

But the auth module is here:

```bash
libs\auth\src\lib\auth.module.ts
```

So if we just move our auth module file into the lib directory, that would be OK?  Just a little worried because Duncan didn't say it was a new file.  It just said:
*3. Add a default route to the auth module*

Anyhow, making that changes works.  The /auth/login route works.

Remaining work in this section:

* Add presentational component to container component
* Add new folder for shared interfaces
* Change the ChangeDetectionStrategy to OnPush

Added shared interface, container and presentational components, now it's on to step 4, Add JSON server.

```bash
npm i json-server ts-node --save-dev
```

After problems with npm in a mono-repo setting, the new rule is yarn every time.  There is a package-lock and a yarn.lock file already.  Should package-lock go?  The warning says:

```bash
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by un-synchronized lock files. To clear this warning, remove package-lock.json.
```

So, yes, it should go.

Without much explanation, we create a mock backend and it's on to 5 - Angular Services.

```bash
ng g service services/auth/auth --project=auth
```

The login component has this code with the comment: *.subscribe() is needed to make sure the observer is registered with the observable returned from our AuthService.  Later in the workshop we will learn to use NgRx to get entities from a server, but for now this is normal angular code without NgRx*

```TypeScript
this.authService.login(authenticate).subscribe();
```

Looking forward to that NgRx part!

In the meantime, the serve is failing due to this:

```bash
ERROR in libs/auth/src/lib/components/login-form/login-form.component.ts(2,30): error TS2307: Cannot find module '@myorg/data-models'.
libs/auth/src/lib/containers/login/login.component.ts(3,30): error TS2307: Cannot find module '@myorg/data-models'.
libs/auth/src/lib/services/auth/auth.service.ts(2,30): error TS2307: Cannot find module '@myorg/data-models'.
```

I'm pretty sure this was running before.  There is a list of myorg indexes in the tsconfig.json file.  Try adding it there.

```bash
...
      "@myorg/auth": ["libs/auth/src/index.ts"],
      "@myorg/data-models": ["libs/data-models/src/index.ts"]
```

That doesn't help.  Also, it's not in the complete tutorial code.  The only thing needed seems to be a type definition .d.ts file and an index exporting it.  Fine.  We already have a data lib for the same purpose that has a todo interface in it.  Just add the authentication interface there and move on.

```bash
npm install @angular/material @angular/cdk @angular/flex-layout @angular/animations
yarn add @angular/material @angular/cdk @angular/flex-layout @angular/animations
```

There was no indication of the kind of component lib to use.  Just assuming Angular, but Duncan, dude, you could do a bit better with the explanations.

```bash
? What framework should this library use? Angular    [ https://angular.io/ ]
```

Next issue:

```bash
ERROR in libs/material/src/lib/material.module.ts(16,8): error TS2306: File 'C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/@angular/material/index.d.ts' is not a module.
```

Thanks to [this SO answer](https://stackoverflow.com/questions/58594311/angular-material-index-d-ts-is-not-a-module), we know that it's a Angular 9 breaking change probably for tree shaking purposes.  So instead of doing a single line import with stuff like this:

```bash
import {
  ...
  MatSelectModule
} from '@angular/material';
```

We have to do this:

```bash
...
import { MatSelectModule } from '@angular/material/select';
```

Then however, there are more errors:

```bash
ERROR in node_modules/@angular/cdk/coercion/array.d.ts(10,60): error TS1005: ',' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,61): error TS1005: ',' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,75): error TS1144: '{' or ';' expected.
node_modules/@angular/cdk/coercion/array.d.ts(10,77): error TS1011: An element access expression should take an argument.
```

We may not be so lucky this time, the only whiff of this on Google is this [as yet unanswered question](https://stackoverflow.com/questions/60949170/cannot-import-matdialogmodule-in-app-module).  The asker has an Angular version mismatch:

```TypeScript
        "@angular/animations": "^7.2.16",
        "@angular/cdk": "^9.2.0",
        "@angular/common": "~7.2.0",
        "@angular/compiler": "~7.2.0",
        "@angular/core": "~7.2.0",
        "@angular/forms": "~7.2.0",
        "@angular/material": "^9.2.0",
```

Since we have Angular 7, we actually need to install Material 7.  Duncan did actually point this out at the top of section 6: *Always use the same Major version of Material as your Angular CLI and packages.*

Manually changed those imports to 7.0.0.  Then got this error running yar (same as npm i by the way):

```bash
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack   File \"<string>\", line 1
gyp ERR! stack     import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:304:12)
```

However, this does not stop the serve and we get our styles, even with the separate imports.  I was thinking I would have to revert all those import changes.  Thanks Dunkan.  Sorry about the earlier comment.  There is even a link to some [flex examples](
https://tburleson-layouts-demos.firebaseapp.com/#/docs).

Getting to the enterprise stuff, mainly, forms.

A nice comment Duncan makes at the start is great: *To save injecting the formBuilder and keeping this a presentational component with no injected dependencies we can just new up a simple FormGroup. You can read more about it here.*

He's talking React there and functional components.  I mean, keeping the constructor clear of injections as much as possible, and reducing member variables is the way to keep Angular from getting too "classy".  I mean, a form group is like state management for a particular part of the app.  Hello Redux.

A few errors to get through:

```bash
compiler.js:2430 Uncaught Error: Unexpected module 'ReactiveFormsModule' declared by the module 'AuthModule'. Please add a @Pipe/@Directive/@Component annotation.
```

Also, this line:

```bash
  <form [formGroup]="loginForm" fxLayout="column" fxLayoutAlign="center none">
```

Causes this VSCode squiggly mouseover error:

```bash
Can't bind to 'formGroup' since it isn't a known property of 'form'.
```

Should ReactiveFormsModule be in the imports, not the declarations?  This went away after opening a different project in VSCode and then switching back here again.  Faster than a restart.

Next, step 8 - Layout Lib and BehaviorSubjects.

```bash
ng g lib layout --prefix app
ng g c containers/layout --project=layout
```

warning Lockfile has incorrect entry for "@angular/flex-layout@^7.0.0". Ignoring it.
? Please choose a version of "@angular/flex-layout" from this list: (Use arrow keys)
The later version 7 choice on the list was 7.0.0-beta-24.  In fact all choices were beta.  If this was for work I would actually look into this a bit more.

Getting the gyp configure error which ends like this:
```bash
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\@angular-devkit\\build-angular\\node_modules\\node-sass
```

Might just need to rebuild node-sass?  As it is, the new layout "lib" is there and the app compiles and runs.  

There are a few typos and mistakes on this step.  Duncan!  But, we do get some juicy stuff at the end when he says: *Extras: Convert Layout component into a pure container component  Add a toolbar presentational component. Pass user into presentational component via inputs.*

That's the functional stuff coming out again.  Good idea.  Except, who here is ready to get on with the NgRx state management implementation?  I am!  Only one more step to go: step 9 - Route Guards and Products Lib.

```bash
ng g lib products --routing --lazy --prefix=app --parent-module=apps/customer-portal/src/app/app.module.ts
ng g c containers/products --project=products
ng g guard guards/auth/auth --project=auth
```

Again had to choose the version and see the gyp error on the products generation line up there.
I chose a version of "@angular/flex-layout" from this list: 7.0.0-beta.24 again.

I saw this in the code for the previous section but there was no mention of adding it in any of the steps so far:

```bash
import { NxModule } from '@nrwl/nx';
```

Looks like it first showed up in step 6 when adding Material.  It doesn't show up in the "// Added" comments that usually accompany new lines of code in the articles.  It is a pretty long tutorial, and high difficulty level, so there's a lot to cover.  I don't hold it against Duncan at all.  It's just it pays to pay attention to the quality of samples from the internet to weigh the veracity of the concepts being used.  Knowing Duncan personally through meetups, I can vouch for the accuracy of the material.  However, again in step 9 there are some silly errors in the docs, such as repeated and unused imports.  I know editing is hard.  I don't like to edit which is why I never want to go the extra steps to publish any blogs although these readme files are almost blogs in themselves.  It's good to be reminded of the level of work needed to produce a tutorial of this length, and what users feel like about the last 1% of editing.

The auth guard generation also asked some questions:
*? Which interfaces would you like to implement? CanActivate*.  There are other interfaces to implement, but that is the only one used in the sample code.

Again there are Extras in this step, such as "Add logout functionality" and "Add angular interceptor".

If we want to update the auth service to set a token in local storage, we can come back to this later.

Finally, [step 10: NgRx](https://duncanhunter.gitbook.io/enterprise-angular-applications-with-ngrx-and-nx/10-ngrx-introduction)

## Fixing existing issues from 2019

Since dusting off this project to get back into development with nrwl and nx, it's time to fix some of the issues that were left hanging from last year.

### UnauthorizedError: No authorization token was found

This error is causes by running the api app workflow:

```bash
ng serve api // serve the Node app
```

Node server listens on http://localhost:3333/api

```bash
Building the app causes this error:
ERROR in C:/Users/timof/repos/timofeysie/quallasuyu/apps/api/src/app/app.controller.ts
ERROR in C:/Users/timof/repos/timofeysie/quallasuyu/apps/api/src/app/app.controller.ts(11,39):
TS2339: Property 'user' does not exist on type 'Request'.
```

That is just from printing out the user name to console.  This allows the build to continue.

```TypeScript
console.log('req.user.name',req['user'].name);
```

If we check for undefined before trying that, and comment out the jwt check:

```Typescript
app.use(checkJwt);
```

Then our stupid todos will be served.  I'm still not sure if Nest is the best way to go.  I'm not really a backend dev, but I had a better time [learning and implementing the NodeJS best practices by hand in the Strumosa project](https://github.com/timofeysie/strumosa-pipe), without relying on magical solutions like annotations.  I suppose it's a powerful tool.  It does seem to limit the developers to the Angular way of doing things.  And since the role of Angular in the developer community has been diminished, so has Nest by association.

### "Collection 'addTodo' not found"

```bash
ng serve todos // start up the React app
ng e2e todos-e2e --watch // run the e2e tests
ng serve api // serve the Node app
ng build api // build the app
ng test api // test the app
```

Node server listens on http://localhost:3333/api

## The @nxtend/ionic-react plugin

Trying out the [Ionic/React plugin](https://github.com/devinshoemaker/nxtend) featured in a [recent blog by the NrWl team](https://blog.nrwl.io/computation-caching-out-of-the-box-revamped-docs-community-plugins-and-more-in-nx-9-2-e97801116e02).

```bash
yarn add --dev @nxtend/ionic-react
nx generate @nxtend/ionic-react:application ionic-sam
Error: Cannot find module 'C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\@nrwl\cli\bin\nx.js'
Require stack:
- C:\Users\timof\AppData\Local\Yarn\Data\global\node_modules\@nrwl\cli\lib\init-global.js
- C:\Users\timof\AppData\Local\Yarn\Data\global\node_modules\@nrwl\cli\bin\nx.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:610:15)
    at Function.Module._load (internal/modules/cjs/loader.js:526:27)
```

Also tried with npx:

```bash
npx nx generate @nxtend/ionic-react:application ionic-sam
```

After this there is no output, but the project is not created.

Opened [this issue](https://github.com/devinshoemaker/nxtend/issues/83) with the plugin for this.

The repo maintainers said don't use npx.  Doing this seems to work:

```bash
yarn add @nrwl/workspace.
yarn add @nxtend/ionic-react
nx generate @nxtend/ionic-react:application ionic-sam
```

Still seeing the node-sass warning:

```bash
warning Error running install script for optional dependency: "C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\@angular-devkit\\build-angular\\node_modules\\node-sass: Command failed.
Exit code: 1
Command: node scripts/build.js
Arguments:
Directory: C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\@angular-devkit\\build-angular\\node_modules\\node-sass
```

However, the serve fails:

```bash
ng serve ionic-sam
Schema validation failed with the following errors:
  Data path ".builders['build']" should have required property 'class'.
Error: Schema validation failed with the following errors:
  Data path ".builders['build']" should have required property 'class'.
    at MergeMapSubscriber.project (C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\@angular\cli\node_modules\@angular-devkit\core\src\workspace\workspace.js:215:42)
    at MergeMapSubscriber._tryNext (C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\rxjs\internal\operators\mergeMap.js:69:27)
```

## Nrwl 9.1

I haven't looked at this code in 7 to 12 months.  So upgrading to the (second) latest Nrwl will take a bit of refreshing.

Updating to the latest using the [official blog](https://blog.nrwl.io/dependency-graph-enhancements-eslint-plugin-buildable-library-dependencies-ngrx-9-and-more-in-e7b896c4fbca) as a guide.

```bash
>yarn update
yarn run v1.17.3
$ ng update @nrwl/schematics
Using package manager: 'npm'
Collecting installed dependencies...
Found 55 dependencies.
Package '@nrwl/schematics' is not a dependency.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

I think yarn is a bit old here?

```bash
>yarn self-update
yarn run v1.17.3
error Command "self-update" not found.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

So how does one update yarn?

```bash
C:\Users\timof\repos\timofeysie\quallasuyu>curl --compressed -o- -L https://yarnpkg.com/install.sh | bash
'bash' is not recognized as an internal or external command,
operable program or batch file.
```

When cloning this project on a new lappy, this is what happens:

```bash
gyp verb `which` succeeded C:\\Windows\\py.exe C:\\Windows\\py.exe
gyp ERR! configure error
gyp ERR! stack Error: Command failed: C:\\Windows\\py.exe -c import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack   File \"<string>\", line 1
gyp ERR! stack     import sys; print \"%s.%s.%s\" % sys.version_info[:3];
gyp ERR! stack                                ^
gyp ERR! stack SyntaxError: invalid syntax
gyp ERR! stack
gyp ERR! stack     at ChildProcess.exithandler (child_process.js:304:12)
gyp ERR! stack     at ChildProcess.emit (events.js:196:13)
gyp ERR! stack     at maybeClose (internal/child_process.js:1000:16)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:267:5)
gyp ERR! System Windows_NT 10.0.18363
gyp ERR! command \"C:\\\\Program Files\\\\nodejs\\\\node.exe\" \"C:\\\\Users\\\\timof\\\\repos\\\\timofeysie\\\\quallasuyu\\\\node_modules\\\\node-gyp\\\\bin\\\\node-gyp.js\" \"rebuild\" \"--verbose\" \"--libsass_ext=\" \"--libsass_cflags=\" \"--libsass_ldflags=\" \"--libsass_library=\"
gyp ERR! cwd C:\\Users\\timof\\repos\\timofeysie\\quallasuyu\\node_modules\\node-sass
gyp ERR! node -v v12.0.0
gyp ERR! node-gyp -v v3.8.0
gyp ERR! not ok
warning Your current version of Yarn is out of date. The latest version is "1.22.4", while you're on "1.17.3".
info To upgrade, download the latest installer at "https://yarnpkg.com/latest.msi".
Done in 594.06s.
```

That installer works.  Now we is rolling with 1.22.4.

Next issue:

```bash
ng serve todos
ERROR in ./src/styles.scss (C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/postcss-loader/src??embedded!C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/sass-loader/lib/loader.js??ref--14-3!./src/styles.scss)
Module build failed (from C:/Users/timof/repos/timofeysie/quallasuyu/node_modules/sass-loader/lib/loader.js):
Error: Cannot find module 'node-sass'
Require stack:
- C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\sass-loader\lib\loader.js
```

```bash
yarn add node-sass
```

Then the ng serve works.

```bash
ng serve todos
yarn start hooks-todo
```

Both working at <http://localhost:4200/>

```bash
ng serve api // serve the Node app
```

```json
{"statusCode":500,"message":"Internal server error"}
```

Not very descriptive there.  My first guess is that we introduced auth last year since mothballing this repo, and that work was still in progress.

```bash
ng build api // build the app
...
ERROR in C:/Users/timof/repos/timofeysie/quallasuyu/apps/api/src/app/app.controller.ts
ERROR in C:/Users/timof/repos/timofeysie/quallasuyu/apps/api/src/app/app.controller.ts(11,39):
```

```bash
ng test api // test the app
Can't find a root directory while resolving a config file path.
Provided path to resolve: C:\C\Users\timof\repos\timofeysie\quallasuyu\apps\api\jest.config.js
cwd: C:\Users\timof\repos\timofeysie\quallasuyu
Error: Can't find a root directory while resolving a config file path.
Provided path to resolve: C:\C\Users\timof\repos\timofeysie\quallasuyu\apps\api\jest.config.js
cwd: C:\Users\timof\repos\timofeysie\quallasuyu
    at _default (C:\Users\timof\repos\timofeysie\quallasuyu\node_modules\jest-config\build\resolveConfigPath.js:69:11)
```

Run the e2e tests"

```bash
ng e2e todos-e2e --watch
  1 failing
  1) TodoApps should display todos:
     CypressError: Timed out retrying: Expected to find element: 'li.todo', but never found it.
```

That's the current status of this repo.  Next up, a little more Ionic for using [this plugin](https://github.com/devinshoemaker/nxtend/blob/master/libs/ionic-react/README.md).

Wait, there are a few more apps to test.  Don't tell anyone they are still using Angular 7.

```bash
ng serve sunday
ERROR in multi ./src/styles.scss
Module not found: Error: Can't resolve 'C:\Users\timof\repos\timofeysie\quallasuyu\apps\sunday\src\styles.scss' in 'C:\Users\timof\repos\timofeysie\quallasuyu\apps\sunday'
```

I've seen that "error in multi" message before.  Where was that?

Next, the official docs say:
*To upgrade from a Nx 7 workspace to a Nx 8 workspace, run:*

```bash
ng update @nrwl/schematics@8.4.8 to update the workspace to the Nx 8 format.
ng update @nrwl/workspace@8.4.8 to update the workspace to 8.4.8.
```

And:

The current laptop versions are:

```bash
Angular CLI: 7.3.1
Node: 12.0.0
OS: win32 x64
Angular: 7.2.13
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... router
@angular-devkit/architect         0.901.0
@angular-devkit/build-angular     0.13.8
@angular-devkit/build-optimizer   0.13.8
@angular-devkit/build-webpack     0.13.8
@angular-devkit/core              9.1.0
@angular-devkit/schematics        7.3.1
@angular/cli                      7.3.1
@ngtools/webpack                  7.3.8
@schematics/angular               7.3.1
@schematics/update                0.13.1
rxjs                              6.3.3
typescript                        3.2.2
webpack                           4.29.0
```

## Comparing enterprise boiler plates for Ionic with NgxRocket & Nrwl

### NgxRocket

First, the competition.  Using the basic [ngX-Rocket](https://github.com/ngx-rocket/generator-ngx-rocket/) version 7.0.2

```bash
$ ngx new
          __   __
 _ _  __ _\ \./ / ____ ____ ____ _  _ ____ ___
| ' \/ _` |>   <  |--< [__] |___ |-:_ |===  |
|_||_\__, /_/°\_\ ENTERPRISE APP STARTER -~*=>
     |___/ v7.0.2
  ? What is the name of your app? saturday
? What kind of app do you want to create? (Press <space> to select, <a> to toggle all, <i> to invert selection)Web app
? Do you want a progressive web app? (with manifest and service worker) Yes
? Which UI framework do you want? Ionic (more mobile-oriented)
? Which kind of layout do you want? Side menu with split panels (more app-oriented)
? Do you want authentication? Yes
? Do you want lazy loading? Yes
? Do you want analytics support (with Angulartics2)? No
? Do you want additional tools? (Press <space> to select, <a> to toggle all, <i> to invert selection)Prettier (automatic code formatting), Hads (markdown-based doc system)
? Do you want additional libraries? (Press <space> to select, <a> to toggle all, <i> to invert selection)
```

### Tasks

```bash
 npm start // start dev server with live reload on http://localhost:4200
 npm run build // build web app for production
 npm test // run unit tests in watch mode for TDD
 npm run test:ci // lint code and run units tests with coverage
 npm run e2e // launch e2e tests
 npm run docs // show docs and coding guides
 npm run prettier // format your code automatically
```

### Features

Along with Angular (with the usual unit & e2e testing) and Ionic, we get the following up and running:

* [ngx-translate](https://github.com/ngx-translate/core)
* Cross-browser CSS with [autoprefixer](https://github.com/postcss/autoprefixer) and
  [browserslist](https://github.com/ai/browserslist)
* Asset revisioning for [better cache management](https://webpack.github.io/docs/long-term-caching.html)
* Unit tests using [Jasmine](http://jasmine.github.io) and [Karma](https://karma-runner.github.io)
* End-to-end tests using [Protractor](https://github.com/angular/protractor)
* Static code analysis: [TSLint](https://github.com/palantir/tslint), [Codelyzer](https://github.com/mgechev/codelyzer),
  [Stylelint](http://stylelint.io) and [HTMLHint](http://htmlhint.com/)
* Local knowledge base server using [Hads](https://github.com/sinedied/hads)
* Automatic code formatting with [Prettier](https://prettier.io)

### building

```bash
$ ionic build
> ng run app:build
An unhandled exception occurred: Project 'app' could not be found in workspace.
See "/private/var/folders/jn/xzs5tlvd2wb3dccpknvkxczh0000gn/T/ng-fzq2Ll/angular-errors.log" for further details.
[ERROR] An error occurred while running subprocess ng.
        ng run app:build exited with exit code 127.
        Re-running this command with the --verbose flag may provide more information.
```

Searching for answers on Google ironically shows nrwl answers for this error.

Why is it looking for 'app'?  The name of the project is Saturday.  App appears nowhere but the readme.

But does the project use the Ionic CLI or just the Ionic components>  If I recall, it said Cordova in the project setup.

*Use cordova directly through npm script.*

### NrWl Ionic app

There is an [issue from last year](https://github.com/nrwl/nx/issues/619).  It uses [xplat](https://nstudio.io/xplat).  Anyone know what that is?

*xplat is an added value pack for Nx which provides additional app generators and optional supporting architecture for different platform/framework combinations.  Currently supported platforms are Electron, Ionic and NativeScript.*  

At the end of the issue someone links to this [this setup guide](https://medium.com/mean-fire/nx-nrwl-ionic-1baf3a43db74).

```bash
ionic init --type=angular
ng g app sunday --style=scss --unit-test-runner=jest --e2e-test-runner=cypress --routing --prefix=app
yarn add @ionic-native/core @ionic-native/http @ionic-native/splash-screen @ionic-native/status-bar @ionic/angular
yarn add @ionic/angular-toolkit -D
```

*This will install required dependencies and create an angular app that we will replace with ionic implementation.*  Sounds like fun.  First a commit.

Next steps:

1. replaces default app generated by angular with one produced with ionic start
2. modifies angular.json to reflect one from ionic start
3. modifies tslint.json to allow components with “Page” suffix

1. is easy and 2. is already done.  But 2. seems impossible.  There needs to be more details.  I'm sure they don't mean all the paths should be erased.  Anyhow I was not able to get it to work even with the [commit](https://github.com/Bielik20/nx-mean-starter/commit/aacbfa66dbd6465a0e0087fe6dcccd1b805619c3) provided by the article as a reference.

There is a huge article with a MERN stack:
https://github.com/Bielik20/nx-mean-starter/tree/93850e2733c4eeeb40eb85b3921eb08e76fccf69

But we don't need a backend.

## The pros and cons of a monorepo

This section is to capture notes are we go adding, developing and using project in this NrWl monorepo.  They are not definitive problems or advantages, but rather items to either be looked into (for cons) or confirmed as helpful (for pros).

These items are also specific to the NrWl/Nx approach.  I can't speak for other monorepo styles as I haven't tried any others yet.  The closes I have gotten before is just putting related projects in one directory and opening that directory in the editor, which is not a bad way to go really.

### Pros

Ease of creating a server/client project.
The dependency graph looks great.
Changes that affect dependencies can be easy tested.

### Cons

Global search searches all the projects.
Single package.json file.

## Converting code to Typescript in NodeJS

```JavaScript
const jwksRsa = require('jwks-rsa');
```

You would think that would become this:

```TypeScript
import { jwksRsa } from ('jwks-rsa');
```

But we would then get this error:

```TypeScript
TS1141: String literal expected.
```

Despite this error the file still compiles and runs.  It's a TypeScript error (indicated by the TS in the error code), and in an Angular app this would break the build and the app wouldn't run.  Interesting.

This would be my next guess:

```TypeScript
import * as jwksRsa from ('jwks-rsa');
```

No errors.  But we still don't really know how to use the jwksRsa Express middleware in a NestJS project.

The next challenge will be to put the check token function in the appropriate place.

```TypeScript
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({ ... });
})
```

The main.ts file is configured by Nest like this:

```TypeScript
const app = await NestFactory.create(AppModule);
```

Other than set up the port and the global prefix, that's all that file should do.  It's the S in S.O.L.I.D.  Then, in the app module just it just sets up imports, providers (services) and controllers.

The controller class uses annotations (or decorators) no doubt Nest uses to work it's magic:

```TypeScript
@Get('todos')
@Post('addTodo')
```

So, actually it seems like the main.ts file is the place where the configuration code *should* go.  Our first guess would be to just do this:

```TypeScript
app.use(checkJwt);
```

Since NestJS is magic, maybe it can use it's magic to use that for API calls.  But what if we want some routes public, and some protected?

Anyhow, the app compiles, but now when using the get API, we get this runtime error:

```bash
UnauthorizedError: No authorization token was found
    at middleware (/Users/tim/repos/quallasuyu/node_modules/express-jwt/lib/index.js:76:21)
    at Layer.handle [as handle_request] (/Users/tim/repos/quallasuyu/node_modules/@nestjs/core/node_modules/express/lib/router/layer.js:95:5)
```

Hey, that's magic for you!~  But still, it would be nice to have an unprotected route.  Save that feature for later?

First, we will need to put actual Auth0 domain and client key in the check to see if we can then authenticate calls.  This will need a lot of front end code to get working, so stay tuned.

We will also need to use the .env library to hide our Auth0 secrets from GitHub.  How do we do that again?

Step 1: create a .env files

This goes something like this:

```JavaScript
PUBLIC_KEY=...secret..
PRIVATE_KEY=...also secret...
```

Step 2: install dotenv
Our dependencies should look like this:

```JSON
    "dependencies": {
      "dotenv": "^7.0.0",
```

Step 3: use the secrets in NodeJS
That could look like this:

```JavaScript
require('dotenv').config();
const public_key = process.env.PUBLIC_KEY;
const private_key = process.env.PRIVATE_KEY;
```

Except, of course we are using NestJS with TypeScript, so again, not sure what is the best practice for this.  Once again we will most likely put that in the main.ts file, but it would be a good idea to also look at some other NestJS docs to see if they have a recommendation for this type of config issue.

The next issue is that we want to check the user name passed in by the request.  Like this:

```JavaScript
req.user.name
```

However, yes, you guessed it, there is no request object in the NestJS code.  It's hidden inside the NrWl/Nest magic bag.

As we know from Node best practices, a good app is a layered app.  Keeping the request objects out of the lower layers is part of this.  So, in search of the correct layer.  Or not.  Probably that property will just get passed to the response automatically so we shouldn't worry about it.

The Nest docs provide the answer.  Another decorator type arg:

```TypeScript
@Get('todos')
getData(@Req() req: Request) {
  console.log('req.user.name',req.user.name);
  return this.appService.getData();
}
```

There are decorators for all the objects Express uses, such as params, next, body, query, headers, etc.

And step 4 is to put the .env in the .gitignore file so it's not pushed to the server.

Step 5 is realizing that none of that is needed because the id and domain name for the Auth0 app is actually OK to commit to the repo.  The id *looks* like a secret but it's not.  And there are no secrets on the front end, which is why OAuth was created in the first place: so some trusted organization can provide authentication and the app trusts that organization.

## Running on Minikube

There is a brief section about deployment in the sample code repo.  This is for Minikube which I have never heard of before.  I am however interested in Kubernetes and dev ops, so I would like to give it a try.

The docs reference two links:

- https://medium.com/@awkwardferny/getting-started-with-kubernetes-ingress-nginx-on-minikube-d75e58f52b6c
- https://medium.freecodecamp.org/learn-kubernetes-in-under-3-hours-a-detailed-guide-to-orchestrating-containers-114ff420e882

Create all the resources (deployment, services, and ingress):

```bash
kubectl apply -f resources-manifests/deployment.yaml
kubectl apply -f resources-manifests/backend-service.yaml
kubectl apply -f resources-manifests/frontend-service.yaml
kubectl apply -f resources-manifests/ingress.yaml
```

Then, find out the IP address of the Minikube cluster:

```bash
minikube ip
```

Finally, head to a web browser and hit the IP address returned by the command above. Also, if needed you can use the following commands to shutdown everything:

```bash
kubectl delete -f resources-manifests/deployment.yaml
kubectl delete -f resources-manifests/backend-service.yaml
kubectl delete -f resources-manifests/frontend-service.yaml
kubectl delete -f resources-manifests/ingress.yaml
```

How this would work with this NrWl monorepo, I'm not sure.  Have to read those docs first.

## Fixing the Todos

While unit testing the auth guard implementation, it was noticed that our add todo function was failing, and that there is no default list of sample todos.  This is the error that shows up when choosing the add todo button.

```bash
body: {error: "Collection 'addTodo' not found"}
headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
status: 404
statusText: "Not Found"
url: "/api/addTodo"
```

The first step is actually running the API server, then run the app:

```bash
ng serve api
ng serve todos
```

Both calls return 404s.

```bash
"/api/todos"
"/api/addTodo"
status: 404
statusText: "Not Found"
```

Did this happen because we implemented the backend service for in-memory data?  The first guess is that yes, this will sabotage any APIs to our server:

```TypeScript
imports: [
  ...
  InMemoryWebApiModule.forRoot(BackendService)
```

What we could do is conditionally use this if the user is offline.  Is that possible? Otherwise, get rid of that and move the contacts functionality into the backend.  Since it's just a demo, probably not worth worrying about.  The todos app is just a test bed for unit test practice, etc.

We will be creating a more serious app based on this work, so I am less concerned with this breakage right now.  The *more serious app* will use NgRx for state management, so we definitely won't be needing the code for the todos except maybe as a model for tying the libraries, the API server and the front end together using nx and the monorepo style.

Later, I came across [this StackOverflow answer](contact1@email.com) which solved the issue mentioned above where http.get was not working.  Adding the following to the app.module fixes that.  It was really bugging me.

```Typescript
InMemoryWebApiModule.forRoot(BackendService, {passThruUnknownUrl: true}),
```

## Testing routing

What is the best way to setup routing with tests and all the other scaffolding stuff the cli and do.  

When creating an app, you can use a flag to generate the routing module:

```bash
ng new app-testing --routing
```

The docs say:
*When you generate a module, you can use the --routing option like ng g module my-module --routing to create a separate file my-module-routing.module.ts to store the module routes.  The file includes an empty Routes object that you can fill with routes to different components and/or modules.  You can use the --routing option with ng new to create a app-routing.module.ts file when you create or initialize a project.*

A bit of a tangent to get an in memory API setup and a few pages to use it.

```bash
 npm install --save angular-in-memory-web-api
 ng g s backend
 ng g s contact
 ng g c contact-list --frontendProject=todos
 ng g c contact-detail --frontendProject=todos
```

Setting up the [contacts](https://www.smashingmagazine.com/2018/11/a-complete-guide-to-routing-in-angular/) master/detail view was fine.  However, our todo add function is broken.  The console error is:

```bash
body: {error: "Collection 'addTodo' not found"}
headers: HttpHeaders {normalizedNames: Map(0), lazyUpdate: null, lazyInit: ƒ}
status: 404
statusText: "Not Found"
url: "/api/addTodo"
```

Even though the server is running, the app is not hitting it.  Have to deal with that later.  On a roll with the router testing right now.

```bash
Unexpected value 'HttpClient' imported by the module 'DynamicTestModule'. Please add a @NgModule annotation.
```

SO: *You have to import the module HttpClientModule and reference that in the imports.*

<rant>In Javascript, why cant the test code be the same as the app code?</rant>

Then our first router testing [from this article](https://codecraft.tv/courses/angular/unit-testing/routing/) works like this:

```JavaScript
router.navigate(['']);
tick();
expect(location.path()).toBe('/contacts');
```

The reason we test for contacts is because that is our default rout in the routing module:

```JSON
{ path: '', pathMatch: 'full', redirectTo: 'contacts' },
```

Next, testing the detail view route.  Ignoring the contact id, the tests are taking quite a long time to run, and the top of the output in the console says:

```bash
console.warn node_modules/@angular/core/bundles/core.umd.js:16879
  Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?
  ... x 4 ...
  ● Router: App › navigate to "contact" takes you to /contact
    Uncaught (in promise): Error: Cannot match any routes. URL Segment: 'contact'
    Error: Cannot match any routes. URL Segment: 'contact'
```

I know there are two issues here.  Since the tests are taking about a minute and a half, fixing that first would allow a saner environment for fixing the second failing test.

One solution would be to wrap the tests inside a

```TypeScript
fixture.ngZone.run(() => {
  ... test ...
});
```

The solution also calls for async, while we have been using the fakeAsync.  Using a real async works well.  Or at least it seemed to.  The two tests pass.  However, adding a third test like this failed after some time:

```bash
Cannot find name 'async'.
```

Switching back to fakeAsync and the three tests pass in about twenty seconds.  That a lot better than the usual 80 it was taking before, but still not speedy.  I wouldn't imaging that testing routing could take so long.

Another example of using fakeAsync looks like this:

```TypeScript
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

```bash
ng g component restricted
ng g component unrestricted
ng g service services/auth/auth
ng g guard guards/auth/auth
```

After running prettier fix, we have a different situation.  Since only the affected files were tested before, we didn't know what kind of things were missing from the other tests.

```bash
Test Suites: 6 failed, 4 passed, 10 total
Tests:       10 failed, 5 passed, 15 total
Time:        441.638s
```

Let go thru these one at a time to get them out of the way:

```bash
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

```bash
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

```bash
Test Suites: 1 failed, 1 of 10 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1608.621s
```

That was after importing the AppModule into the app component spec tests. If you ignore the really mysterious/buggy ones, these are the main obstacles:

```bash
FAIL  apps/todos/src/app/guards/auth/auth.guard.spec.ts (13.672s)
 ● Console
       ● Test suite failed to run
         A "describe" callback must not return a value.
         Returning a value from "describe" will fail the test in a future version of Jest.
```

```bash
         const realDescribe = describe;
         describe = ((name, fn) => { realDescribe(name, () => { fn(); }); });
```

```bash
ReferenceError: Todo is not defined x 3
Illegal state: Could not load the summary for directive AppComponent. x 3
...
Test Suites: 2 failed, 8 passed, 10 total
Tests:       4 failed, 10 passed, 14 total
```

Those are *all* for the app.component.spec.  If we *don't* import the Todo class from the data library, then these are the errors:

```bash
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

```TypeScript
it('should create', inject([AuthGuard], (guard: AuthGuard) => {
  expect(guard).toBeTruthy();
}));
```

Since that's not the most important test in there, without it should pass all the tests.  But getting rid of it moves the error elsewhere.  And now we have four again.  If you fix up an issue in the AuthGuard spec, then we're getting six errors again on the app.component because of the file todo data model import.  
And the odd one out is:

```bash
FAIL  apps/todos/src/app/guards/auth/auth.guard.spec.ts (7.282s)
 ● AuthGuard › should create
   Component ContactListComponent is not part of any NgModule or the module has not been imported into your module.
```

This was happening a while ago.  The SO answers on this were all varied and not very helpful.

Removing the create test again and we are left only with the import @lib issue:

```bash
Test Suites: 1 failed, 9 passed, 10 total
Tests:       3 failed, 12 passed, 15 total
```

If you quit the test watch and run it again, you will get only the modified tests running and you can focus on those.  The last test for the auth guard is this one:

```TypeScript
it('should navigate to contacts for a logged out user', () => {
  authService = { isLoggedIn: () => false };
  router = new MockRouter();
  authGuard = new AuthGuard(authService, router);
  spyOn(router, 'navigate');
  expect(authGuard.canActivate()).toEqual(false);
  expect(router.navigate).toHaveBeenCalledWith(['/']);
});
```

It changes the return value of isLoggedIn and creates an instance of the class.  It also adds a spy to the navigate method of router.  Now calling canActivate should return false and the navigate method will be called to redirect users to the root path.  

In this case it is the /contacts route.  So why do we check for /?  I guess that's just the way the Angular router works.  The translated root path doesn't show up in the test.

Running ng serve on the Angular app now has this issue:

```bash
ERROR in apps/todos/src/app/app.module.ts(27,5): error TS2693: 'Todo' only refers to a type, but is being used as a value here.
```

The data model was added to the imports of the main module to try and solve some of the errors for the app component.  Have to remove that now.

```TypeScript
import { Todo } from '@myorg/data';
...
imports: [
  ...
  Todo,
```

One more thing to play with before finishing up this section is setting the auth.service to return false so that restricted is now restricted.  Create some test links in the component template and the restricted page is now restricted.

Next up, implement a real auth solution with AWS Cognito!

## 100 Days of React

This is an Instagram, Slack extravaganza of React learning.  Below are some of the projects and challenges.

### Week 1

Miniflix challenge.

### Week 2

Hooks todos.

### Week 3

Auth0.

### Week 4

Elasticsearch.

## Auth0

This is the week 3 challenge which uses Auth0 to secure routes.

To secure the Node.js API we use these two libraries:

* express-jwt: A middleware that validates a JSON Web Token (JWT) and set the req.user with its attributes.
* jwks-rsa: A library to retrieve RSA public keys from a JWKS (JSON Web Key Set) endpoint.

To secure the React application with Auth0, yinstall only one library:

* auth0-js:  the official library provided by Auth0

### Setup for the backend includes creating an Express "check Jwt" middleware object that will validate ID tokens with this kind of info:

```JavaScript
secret: jwksRsa.expressJwtSecret({
  cache, rateLimit: true, jwksRequestsPerMinute, jwksUri
  // Validate the audience and the issuer.
  audience: CLIENT_ID, issuer: `https://<AUTH0_DOMAIN>/`, algorithms
```

The Client ID and Domain field are from the Auth0 dashboard.  Then make the endpoints to secure use the check Jwt middleware like this:

```JavaScript
app.post('/', checkJwt, (req, res) => {
```

Then you can use the user name like this:

```JavaScript
author: req.user.name,
```

### Setup for the frontend includes using only one library

```JavaScript
npm install auth0-js
```

Then create a helper class with these functions:

```Javascript
import auth0 from 'auth0-js';
class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: '<AUTH0_DOMAIN>',
      audience: 'https://<AUTH0_DOMAIN>/userinfo',
      clientID: '<AUTH0_CLIENT_ID>',
      redirectUri: 'http://localhost:3000/callback',
      responseType: 'id_token',
      scope: 'openid profile'
    });
    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }
  getProfile() {  }
  getIdToken() {  }
  isAuthenticated() {  }
  signIn() {  }
  handleAuthentication() {  }
  signOut() {  }
}
const auth0Client = new Auth();
```

(After setting up the backend which included installing the dotenv lib to hide the Auth0 secrets from GitHub, how do we hide these secrets in the front end?  When the app is deployed, there will be server settings which are service dependant.  But locally, can the front end also use that lib to get the secrets in the .env file?  Looks like we can do the same thing we did in the Node app in the frontend also.)

Somewhere like the navbar, this:

```HTML
{
  !auth0Client.isAuthenticated() &&
  <button className="btn btn-dark" onClick={auth0Client.signIn}>Sign In</button>
}
{
  auth0Client.isAuthenticated() &&
  <div>
    <label className="mr-2 text-white">{auth0Client.getProfile().name}</label>
    <button className="btn btn-dark" onClick={() => {signOut()}}>Sign Out</button>
  </div>
}
```

A component is then needed to handle the callback route ```http://localhost:3000/callback``` is needed.

```JavaScript
async componentDidMount() {
  await auth0Client.handleAuthentication();
  this.props.history.replace('/');
}
```

It shows a message while fetching the user info and then redirects to the home page after it finishes.

It is used in the App.js file like this:

```TSX
<Route exact path='/callback' component={Callback}/>
```

To add protected routes a helper class can be used.  It is a functional component that takes a Component, so it can render it in case the user is authenticated, and a path so it can configure the default Route component provided by React Router. First it checks if the user isAuthenticated, and either redirects to login or renders the component passed in.

```TSX
SecuredRoute(props) {
  const {component: Component, path} = props;
  return (
    <Route path={path} render={() => {
        if (!auth0Client.isAuthenticated()) {
          auth0Client.signIn();
          return <div></div>;
        }
        return <Component />
    }} />
  );
}
```

Then in the App.js file, we can use that route like this:

```TSX
<SecuredRoute path='/new-question' component={NewQuestion} />
```

And provide a link somewhere:

```TSX
<Link to="/new-question">
```

The SubmitAnswer class does this to submit an answer to a question:

```TSX
submit() {
    this.props.submitAnswer(this.state.answer);
```

In the Question class, this handles the event and provides the axios.post functionality:

```TSX
class Question extends Component {
  constructor(props) {
    this.submitAnswer = this.submitAnswer.bind(this);
  }
```

It's not very clear how the props are used to handle the submit function.  The clear explanation will have to wait for now.

### Adding the Q&A code to the todo apps

The todo app is a simple one file affair.  The Q&A app is layered using better practices.  Some of the files needed are:

```bash
Auth.js
NavBar.js
Callback.js
```

Using Callback in the App.tsx shows the first big difference.  The todo app doesn't use routing.  Further work includes:

```bash
SecuredRoute/SecuredRoute.js
NewQuestion/NewQuestion.js
register the new route in your App.js file:
Questions.js
question/SubmitAnswer.js
```

The main issue then is merging the two apps within the app.tsx file with the code from the App.js file in the Q&A sample.

The app structure however consists of just directories with a single file and the same name as their containing files.  What I recommend is a single directory called Q&A.  Can you put & in a directory and paths?  Called it q_and_a for now.

Next, the todo app is build on hooks.  The Q&A app is build with classes.  Is it a good idea to try and mix the two?  It's a good exercise for a senior and I can answer my own question.

### The port number

The sample app uses localhost:8081 for the API server.  Using NrWl, we run:

```bash
ng serve api
...
Listening at http://localhost:3333/api
```

So then if we use curl to look at the server we get this:

```bash
curl localhost:3333
UnauthorizedError: No authorization token was found
    at middleware (/Users/tim/repos/quallasuyu/node_modules/express-jwt/lib/index.js:76:21)
```

All the routes are protected now by out auth middleware.  If we do login, we will also need to replace 8081 with 3333 in places that use Axios for http calls within the app such as Quststion, Questions, NewQuestion.

On the Auth0 dashboard, we have set *Allowed Callback URLs*, *Allowed Logout URLs* and *Allowed Web Origins* as http://localhost:3000.

Now, with the changes in place, the page loads and we get this error:

```bash
Request URL: http://localhost:3333/
Request Method: GET
Status Code: 500 Internal Server Error
```

Trying the login button out returns:

```bash
This site can’t be reached https’s server IP address could not be found.
DNS_PROBE_FINISHED_NXDOMAIN
```

Then I notice this:

```bash
https://https//hakea.auth0.com/authorize?client_id=7MlVhNgye9YsRstn0yLtydbkSc3FZi1p&response_type=id_token&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&scope=openid%20profile&audience=https%3A%2F%2Fhttps%3A%2F%2Fhakea.auth0.com%2Fuserinfo&state=A4nBa-JEBiFB4gpi8wj8Bu5s0cxEI.vZ&nonce=tZFg-ob~qhENKXP2QnycVn8CYwv49~xa&auth0Client=eyJuYW1lIjoiYXV0aDAuanMiLCJ2ZXJzaW9uIjoiOS4xMC4yIn0%3D
```

As Jamie Hyderman says: "We'll, there's yr' problem!"

On the server, our AUTH0_DOMAIN = 'hakea.auth0.com'.  Both occurances of that variable appear *with* the https string in index.js.  For us, that's the main.ts file.

In the front end, that string appears both with and without the https string.

```bash
domain: '<YOUR_AUTH0_DOMAIN>',
audience: 'https://<YOUR_AUTH0_DOMAIN>/userinfo',
```

No where are we adding 'authorize' to the string, so it is being created in either the express-jwt or the jwks-rsa libraries.

In main.ts, trying it like this without the https:

```bash
jwksUri: AUTH0_DOMAIN+'/.well-known/jwks.json'
```

Doing that changes the error message.  Had to add this full url with the callback string to the allowed callbacks field in the Auth0 dashboard like this:

```bash
http://localhost:3000/callback
```

Then we are back to an error, this time with the url showing:

```bash
http://localhost:3000/callback#error=access_denied&error_description=Service%20not%20found%3A%20hakea.auth0.com%2Fuserinfo&state=HAIhy8zp5dDC4bjf_gwzjsds~8Yj8jCT
```

## To-Do App with React Hooks

The week two challenge is more realistic.  It's a 100% hooks todo list from [another Scotch.io article](https://scotch.io/tutorials/build-a-react-to-do-app-with-react-hooks-no-class-components).

Instead of using create-react-app direcly, we use the nx command to start the project:

```bash
ng g app hooks-todo --framework=react
```

It calls for:

```bash
npm i react@16.7.00alpha.2 react-dom@16.7.0-alpha.2
```

We already have React 16.8 in our global package.json file.  That's right, a global package.json file.  It has everything for all of the projects.  It feels a little uncomfortable doing it this way, and seems to be breaking some kind of un-written rule that each project has its own package.  I suppose tree-shaking takes care of only including the used packages during deploy.

The article links to a writeup on array destructuring if you want to know more info about the [todos, setTodos] syntax [here](https://scotch.io/tutorials/getting-started-with-react-hooks#toc-what-is-this-usestate-syntax-).

### object destructuring vs array destructuring

#### *object destructuring*

```JavaScript
const users = { admin: 'chris', user: 'nick' };

// grab the admin and user but rename them to SuperAdmin and SuperUser
const { admin: SuperAdmin, user: SuperUser } = users;
```

#### *array destructuring*

```JavaScript
const users = ['chris', 'nick'];
// grab in order and rename at the same time
const [SuperAdmin, SuperUser] = users;
```

However, running the app stirs up these console errors:

```bash
Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
warningWithoutStack @ react.development.js:188
react-dom.development.js:62 Uncaught Invariant Violation: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
    at invariant (http://localhost:4200/vendor.js:1751:29)
```

The same code ran in it's own project created the normal way.  Anyhow, I won't bore you with any other details, but the src/main.tsx file had to change its import from this:

```JavaScript
import { App } from './app/app';
```

to this:

```JavaScript
import App from './app/app';
```

After finishing the CRUD functions, I decided to add a select action that would let the user choose an item to display in another section of the app.  A basic master/detail pattern thingy.

Using a hook, it works like this:

```JavaScript
function Todo({ todo, index, completeTodo, removeTodo, selectTodo }) {
  return (
    <div className="todo">
      <div onClick={() => selectTodo(index)}>{todo.text}</div>
      ...
function App() {
  const [todo, setTodo] = useState({});
  const [todos, setTodos] = useState([ ... ]);
  const addTodo = text => { };
  const completeTodo = index => { };
  const removeTodo = index => { };
  const selectTodo = index => {
    setTodo(todos[index]);
  };
  return (
    <div className="app">
      ...
        <div className="selectedTodo">{todo.text}</div>
```

That's a pretty nice skeleton of functionality to hang an app off if you ask me.

To do (pun intended) is to clear the selected item when

Next we want to use Fetch or Axium to get our data from an API.

## Miniflix challenge

The code for this section lives in the minflex branch on Github.

Since this is an nx mono-repo project (many apps, one repo), we use the nx commands.  So instead of running this line from the [challenge](https://scotch.io/tutorials/build-a-mini-netflix-with-react-in-10-minutes):

```bash
create-react-app miniflix
```

We will run this line:

```bash
ng g app miniflix --framework=react
```

Ng is the Angular CLI, but notice we can use that power with React apps also.

p.s.  If you are curious about using nx to build an enterprise-class React (or other frontend/backend/full-stack) projects, checkout [this article](https://blog.nrwl.io/powering-up-react-development-with-nx-cf0a9385dbec).

Add [Bootstrap](https://getbootstrap.com/) (just remember Bootstrap is considered dangerous for serious projects).

Install these:

```base
auth0-js react-router@3.0.0 jwt-decode axios
```

[jwt-decode](https://www.npmjs.com/package/jwt-decode) is a *jwt-decode is a small browser library that helps decoding JWTs token which are Base64Url encoded.*

Axios is an http lib.  I usually reach for Fetch, but Axios is pretty popular these days.

Next, and Auth0 lib which reveals what I'm assuming is the completed project [here](https://github.com/unicodeveloper/miniflix/blob/master/src/utils/AuthService.js).

The [linked to tutorial](https://github.com/auth0-blog/reactjs-authentication-tutorial) on Auth0 which I've used before with Angular I'm assuming will provide details of how to setup an Auth0 account and fill in the details needed to use Auth0:

```JavaScript
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

```bash
src/app/app.tsx
```

### src/

```bash
index.js
```

In Nav.js:

```bash
import './app.css';
```

to this:

```bash
import '../app.scss';
```

When the tutorial says *open up index.js and add replace it with the code here*, we put that into src/app/app.tsx.

Then, when we run our project we have to specify which app to run in this mono-reopo world we created like this:

```bash
ng serve miniflix
```

### The service worker error

Running the app we get this error:

```bash
Failed to compile.
./app/app.tsx
Module not found: Error: Can't resolve './registerServiceWorker' in '/Users/tim/angular/myorg/apps/miniflix/src/app'
```

You might think that problems like this would inspire use to just follow along with the basic example and use create-react-app instead of a mono-repo built with nx.  Well, a little, but since I am trying to learn about using nx with all kinds of projects, this is a great way to get familiar with the workflow and the kinds of problems that arise during development.

If that line 23 of the app.tsx code is commented out:

```JavaScript
//registerServiceWorker();
```

On the [Slack channel](https://code100days.slack.com/messages/DJ3DSR2RL/convo/CHJF83RPC-1555875663.326800/) Lenora Porter points out: *According to the article, the serviceWorker is called using*

```JavaScript
import registerServiceWorker from './registerServiceWorker';
```

#### *and called again at the bottom of index.js with*

```JavaScript
registerServiceWorker();
```

#### *I believe this is an old way of doing things.  Use this instead:*

```JavaScript
import * as serviceWorker from './serviceWorker';
```

#### *and then*

```JavaScript
serviceWorker.unregister();
```

### Cannot read property 'func' of undefined

After dealing with the service worker problem the error changes to this:

```bash
Uncaught TypeError: Cannot read property 'func' of undefined
    at Object.../../../node_modules/react-router/lib/PropTypes.js (PropTypes.js:8)
```

Going to clone the finished [repo here](https://github.com/unicodeveloper/miniflix.git) and see if it will run.  Actually, after reading the comments at the end of the Scoth.io article, I'm not going to bother.  Also, on the Slack channel, Tyrique Daniel said *noone found a fix will start a new tut tomorrow will share with the group*.

But, no, I don't like to give up so easy.  I want to know if that second function above is due to old router code.

The tutorial shows installing an exact version:

```JavaScript
react-router@3.0.0
```

However, if we install it ourselves without the version number, we get:

```JavaScript
react-router@3.2.1
```

But then the serve returns this runtime error (and warning that was maybe there before):

```JavaScript
react-dom.development.js:62 Uncaught Invariant Violation: Target container is not a DOM element.
    at invariant (http://localhost:4200/vendor.js:4700:29)
    ...
client:148 [WDS] Warnings while compiling.
warnings @ client:148
client:154 ./main.tsx 4:36-39
"export 'App' was not found in './app/app'
warnings @ client:154
```

## Managing state

Managing state is a hard problem. Things that update the state concurrently need to coordinated:

* multiple back-ends
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

```bash
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

```bash
ng serve api
ng serve todos
```

Look at what has changed in the projects.

```bash
npm run affected:apps -- --base=master
npm run affected:libs -- --base=master
run affected:test -- --base=master // retest all the affected projects.
npm run affected:test -- --base=master --only-failed // retest the failed projects.
npm run affected:test -- --base=master --parallel // test all projects in parallel
npm run affected:build -- --base=master // By default, Nx builds libraries in the context of some application. mark a library as publishable to change it
npm run affected -- --target=build --base=master //  run any target against the affected projects in the graph
```

Affected commands Nx provides are:

```bash
affected:e2e // Runs E2E test for affected projects.
affected:lint // Lints affected projects.
affected:apps // Lists all affected apps.
affected:libs // Lists all affected libs.
affected:build // Builds all affected apps.
```

## The dep-graph

``` bash
yarn dep-graph // generate the dependency graph which will open in a browser
yarn affected:dep-graph --base=master // affected nodes/paths highlighted in red
```

If an app depends on the api since it makes requests to it, modify nx.json to show this.

In nx.json, under projects, add an implicitDependencies section for the app.

```JSON
  "projects": {
    "my-app": {
      "implicitDependencies": ["api"],
      "tags": []
    },
```

## Prettier

```bash
yarn format:check // Checks if files are formatted correctly.
yarn format:write // Updates files with correct formatting.
yarn lint
yarn test
yarn e2e --watch
```

## React commands

Use ```-dry-run``` to preview the changes before committing them.

```bash
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

```bash
yarn ng generate workspace-schematic react-component
```

Then, using parts of the @angular-devkit/schematics, @angular-devkit/core and @nrwl/schematics/src/utils/ast-utils libraries, create the boilerplate code in tools/schematics/react-component/index.ts.

You can see an example implementation [here](https://github.com/nrwl/react-nx-example/tree/master/tools).

## Can't resolve and not a module errors

Out of the box we were getting this error:

```bash
ERROR in apps/todos/src/app/app.component.ts(3,22):
error TS2306: File '...index.ts' is not a module.
libs/ui/src/lib/todos/todos.component.ts(2,22):
error TS2306: File '...index.ts' is not a module.
```

The file is just an interface.  However, it wasn't being exported.  Easy fix.

This happened again when adding the Giphy sample.  Alright, it's a slightly different error.

```bash
ERROR in ./app/app.tsx
Module not found: Error: Can't resolve '@my-app/gifs' in '/Users/tim/angular/myorg/apps/react-demo/src/app'
 @ ./app/app.tsx 5:0-36 18:105-109
 @ ./main.tsx
 @ multi (webpack)-dev-server/client?http://0.0.0.0:0 ./main.tsx
```

```bash
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

```bash
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

```bash
ReferenceError: Todo is not defined
```

It is imported like this:

```JavaScript
import { Todo } from '@myorg/data';
```

The '@' symbol indicates a scoped name.  That prefix allows related mpm packages to be grouped under a folder with that prefix to avoid polluting the node_modules.

Other failing tests probably related to the first failure:

```bash
● AppComponent › should create the app
  Illegal state: Could not load the summary for directive AppComponent.
    at syntaxError (../../../packages/compiler/src/util.ts:100:17)
```

## Creating the React apps

Changing my-app to react-demo.  [Source](https://blog.nrwl.io/powering-up-react-development-with-nx-cf0a9385dbec)

```bash
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

## Old Documentation

Part of the automatically generated docs.

```bash
ng g app myapp` to generate an application. When using Nx, you can create multiple applications and libraries in the same CLI workspace.
ng serve myapp` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
ng e2e
ng generate component component-name --project=myapp` to generate a new component. You can also ng generate directive|pipe|service|class|guard|interface|enum|module`.
ng build myapp` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
ng test` to execute the unit tests via [Jest](https://karma-runner.github.io).
ng e2e` to execute the end-to-end tests via [Cypress](http://www.protractortest.org/).
```

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
[30-minute video showing all Nx features](https://nx.dev/getting-started/what-is-nx)
[Interactive tutorial](https://nx.dev/tutorial/01-create-application)
