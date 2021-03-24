# MicroClientLibraryStarter
A quickstart project that quickly/easily bootstraps a testable/deployable Angular library that supports both
dev-time angular class(components, services, etc) libraries and run-time Angular element libraries.

---
## Quickstart

1.  Build the default library

    $ `npm run build:weja-library`

2.  Build the default library

    $ `npm run build:weja-elements`

3.  Open the index.html file found in the root of the project. If you get a message like the following:
---
<h2 style="background-color: mintcream; text-align: center">
    Your very own Angular custom web component says: Hello, world!
</h2>

---
...then congrats, you just built a static web component that you can proudly deploy anywhere and run anywhere! 

Feel free to try [micro-realm](https://github.com/Micro-cosm/micro-realm) and just as quickly deploy to firebase and integrate to your enterprise GCP services.



# Now, build your own from scratch using Angular CLI
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.5, but can be reproduced from scratch using the following:

Inspired by -- Angular Elements: Create a Component Library for Angular and the Web	source: https://notiz.dev/blog/create-a-component-library-for-angular-and-the-web#try-it-out   
(repurposed for the latest Angular/Webpack)

<p style="color: red">
    <strong>NOTE:</strong>  As of the last commit, the default Angular CLI configuration still seems to struggle delivering multiple elements to the same SPA window.
    As a workaround use the following resolution that applies a custom webpack build configuration that precludes the conflict:			
</p>

---
<h2 style="color: steelblue;"> webpackJsonp Global Namespace Conflict Resolution </h2>
<span style="font-size: x-small;"> source: https://medium.com/@sri1980/multiple-angular-elements-apps-loading-in-one-window-7bcc95887ff4</span>

<p style="color: red">
    <strong>RESOLUTION UPDATE:</strong>  Webpack 5 will provide a new identifier -- <strong>output.uniqueName</strong> 
    that is rumored to preclude step 3b at some point.  Angular 12 is rumored to include Webpack 5 at some point, so...
</p>

**Problem:**  The root cause is attributed to the global scope of the variable webpackJsonp.  When loading multiple angular elements from different microapps, conflicts inevitably occur as each new element is loaded and successfully commandeers the the 
value, globally. When loaded, the first angular element creates the “webpackJsonp” variable(a function or an array depending on the wp version) inside the window object, without issue.
However,  the second element comes along and suddenly overriddes the previous initialization,  obviously, confusion ensues for the first element loaded.  This conflict continues as each app is loaded, leaving in the loaders wake, a trail of hopelessly confused elements that never really got loaded and a confused browser that believes they already were."			

**Solution:** To resolve this conflict, the default “webpackJsonp” variable name can be renamed with a variable name unique to each angular app/element,
which can be accomplished with the following steps:	

1. Install custom-webpack from angular-builders module		
    $ 	`npm i -D @angular-builders/custom-webpack`
   
2. a.	Change the builder property to:	`@angular-builders/custom-webpack:browser`

   b.	Add customWebpackConfig property as below:		
```json
    {   ...
        "architect": {
            "build": {
                "builder": "@angular-builders/custom-webpack:browser",
                    "options": {
                        "customWebpackConfig": {
                            "path": "./extra-webpack.config.js",
                            "mergeStrategies": { "externals": "replace" }
                    }
                }
            }
        },
        ...
    }
```

3.  a.	Create a config file `extra-webpack.config.js` in the project root folder.		
    b.  Provide a unique name for **jsonpFunction** and **library** and place in the new config file
    
```typescript
    module.exports = {
        output: {
            jsonpFunction: "webpackJsonpWejaLibrary",
            library: "WejaLibrary"
        }
    }
```
4.  When you build the project you will see the main.js content as below:

**NOTE:** ""webpackJsonp"" should be replaced with the name specified in your configuration file(extra-webpack.config.js) 
and everything below should just work as expected


----
<h2 style="color: steelblue;"> Publish an Angular component and Custom Elements from a unified Angular CLI project</h2>

#####  Create the project			
  Initialize a new Angular application (include routing or any stylesheet)			
  $	ng new APP_NAME --collection=@angular-eslint/schematics
  ... which assumes ...
  $	npm i -g @angular/cli @angular-devkit/{core,schematics} @angular-eslint/schematics
  From the new project directory, generate a new share-ready library(projects/components) with sample component:			
  $	ng g library weja-library
  Build the component library:			
  $	ng build weja-library
  "Since Angular Elements only supports application project types, creation of an additional application was required as a mechanism to deliver the Custom Elements via import.  This will require cleaning up the default application files under ./weja-elements/src/app after they are created.

#####  Create a new app(./projects/elements),  NOTE:  No routing is necessary and any styling option can be selected."			

  $	`ng g application weja-elements`

Install the necessary dependencies/polyfills via elements schematic, tooling the new application with the required support for elements:			

  $	`ng add @angular/elements --project weja-elements`

Optionally, publish your components as Custom Elements by creating package.json from: `./projects/weja-elements/  ` 		

  $	`npm init`

Update the newly created package.json:
```json
{   ...
    "files": [
        "weja-elements.js",
        "styles.css"
    ],
    ...
}
```

#####  Configure Angular Elements

Excluding app.module.ts, delete all files in the new weja-elements' application directory(./projects/elements/src/app).

Define your own bootstrapping method by making the following changes to:  `<ELEMENTS_SRC_DIR>/app/app.module.ts`

    - Remove the bootstrap array from NgModule declaration
    - Import ComponentsModule and ComponentsComponent from the components library
    - Add ngDoBootstrap hook
    - For every component create an element using the createCustomElement function from @angular/elements
    - Define the element using web's native customElemments.define function, specifying a selector."			

The `app.module.ts` should look something like:

```typescript
import { BrowserModule           } from '@angular/platform-browser';
import { NgModule                } from '@angular/core';
import { Injector                } from '@angular/core';
import { createCustomElement     } from '@angular/elements';
import { WejaComponentsModule    } from 'weja-library';
import { WejaComponentsComponent } from 'weja-library';

@NgModule({ imports: [BrowserModule, WejaComponentsModule], providers: []})

export class AppModule {

    constructor( private injector: Injector ){}

    ngDoBootstrap(){
        const element = createCustomElement( WejaComponentsComponent, {injector: this.injector})
        customElements.define( "weja-library", element );
    }
}
```

---
#### Remove zone.js (optional):			

Removing zone.js is probably a good idea, just keep in mind that you need to handle change detection yourself.			

Update `main.ts` to be similar to the following:

```typescript
    import { enableProdMode         } from '@angular/core';
    import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
    import { AppModule              } from './app/app.module';
    import { environment            } from './environments/environment';
    
    if ( environment.production ) { enableProdMode(); }
    
    platformBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' }).catch(err => console.error(err));
```


#### Build the root project:			

Update the project root's `package.json` script dictionary:			

```json
{   ...
    "scripts": {
        "build:weja-elements":  "ng build --prod --project weja-elements --output-hashing none && npm run pack:weja-elements && cp projects/weja-elements/package.json dist/weja-elements",
        "pack:weja-elements":   "cat ./dist/weja-elements/{runtime,polyfills,main}.js > dist/weja-elements/weja-elements.js && ls -lah dist/weja-elements/weja-elements.js",
        "build:weja-library":   "ng build --prod --project weja-library",
        ...
    },
    ...
}
```

#### Build amd Deploy

  $	`npm run build:weja-elements`

#### Update and Run Angular components

Update the root module in:  `./src/app/app.module.ts`

```typescript
    import { BrowserModule        } from '@angular/platform-browser';
    import { NgModule             } from '@angular/core';
    import { AppComponent         } from './app.component';
    import { WejaComponentsModule } from 'components';
    
    @NgModule({
    declarations: [AppComponent],
    imports:      [BrowserModule, WejaComponentsModule],
    providers:    [],
    bootstrap:    [AppComponent]
    })
    
    export class AppModule {}
```

Update and the root app view in:  `./src/app/app.component.html` 		

```html
    <h1> Angular component </h1>
    <lib-components></lib-components>"
```

Consume custom elements a static html with the following:			

```html
    <!DOCTYPE html>
    <html lang="en">                
        <head>                
            <meta charset="UTF-8">                
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title> Document </title>
            <link rel="stylesheet" href="dist/elements/styles.css">
            <script src="dist/elements/weja-elements.js"></script>
        </head>
        <body>
            <h1> Web Component (Custom Elements) </h1>
            <weja-library-element-hello></weja-library-element-hello>
        </body>
    </html>
```

If the above test works statically, it should work pretty much anywhere!

#### Extra Credit:  Publish to npm

**NOTE:**  Before releasing, might be a good idea to recheck project metadata(e.g. name, version, etc)			

Publish components and/or custom elements, using:			

  $	`npm publish dist/components`	

...  and / or  ...			

  $	`npm publish dist/elements`	


----
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
