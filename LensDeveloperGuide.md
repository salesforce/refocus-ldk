# Lens Developer Guide

## Introduction

Refocus is a platform for visualizing the status of some set of subjects under monitoring. The platform does not attempt to provide visualizations to satisfy every type of user. Instead, it allows users to install add-on modules, which we call *lenses*, to provide new visualizations. Each lens provides a new visualization to help users understand their data in a new way.

A *lens* is a collection of resources which renders its own particular visualization of Refocus hierarchy data. In its simplest form, a lens can be a single JavaScript file which registers and implements an event listener to handle one or more custom Refocus events. A more robust lens might include additional resources to help render the visualization like stylesheets, templates, images and additional JavaScript helper files.

A *perspective* is the combination of a lens, a root subject, and an optional filter. When a user loads a perspective in the browser:

1. Refocus delivers a response back to the browser containing:
  * A perspective html page with an empty `div#lens` element.
  * A Lens Utility Library, i.e. `lensUtils.js`.
  * All of the javascript, stylesheet and image resources contained in the lens library (zip).
1. The perspective initiates a Refocus API request to retrieve the initial state of the hierarchy under the specified root subject, filtered by any filters specified for the perspective.
1. Refocus subscribes the browser client to a realtime event stream for all the subjects and samples under the specified root subject, filtered by any filters specified for the perspective.

The lens is then responsible for modifying the DOM under the #lens element to:

1. Display the initial state of the subject hierarchy.
1. Update the display in response to real time changes.

A lens fulfills these responsibilities by registering event listeners for the [`refocus.lens.*`](#realtime-event-reference) custom events.

The LDK lets you build and test a lens quickly and iteratively, *without* having to install it into a running Refocus application. The LDK provides some dummy datasets and simulates realtime events so you can test how your lens handles hierarchy data and realtime events.

## Developing a Lens with the LDK

The main entry point for your lens is `./Lenses/SuperDuperLens/src/main.js`. Look for `// TODO implement me!` comments in that file to help you get started.

## Modularize!

Use [Node.js `require`](https://nodejs.org/api/globals.html#globals_require) syntax to load external libraries and css files and other javascript modules. The build step uses webpack to compile and consolidate all the resources into a single browser-ready `lens.js` file.

> Use `require('script!./myScript')` if you need to execute `myScript.js` *once* in global context.

## Best Practices

* Add a `/lib` directory inside the lens's `/src` directory and keep all your external libraries there.
* Isolate all your data manipulation and helper functions into separate modules with no DOM dependencies--this makes it super easy to reuse stuff (maybe even contribute commonly used stuff to the Lens Utility Library!) AND write straightforward unit tests which don't have to run in a browser context!
* When your lens makes any changes to the DOM which require a repaint or reflow in the browser, wrap those changes in a call to  [window.requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) so the browser can schedule the execution in coordination with its next repaint.
* Refocus will render a perspective overlay component in the upper left corner of the page, so don't put anything crucial up there. In the LDK protyper, we put the "Config" link in that same location ;)
* Every lens must be generic--you must not hard-code any references to data like tag names or subject names or aspect names.

## Realtime Event Reference

### `refocus.lens.load`

This event is dispatched by the perspective immediately after the perspective page is loaded in the browser, but *before* the hierarchy data has been returned to the browser.

#### Recommended Usage

1. Register event listeners for [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) events (e.g. `blur`, `focus`, `hashchange`, `resize`).
1. Register an event listener for the `refocus.lens.hierarchyLoad` event.
1. Render any DOM elements which are *not* dependent on the hierarchy data (e.g. page header, page footer, legend, animated "Loading..." indicator, etc.).

#### Event Payload

```json
{
  "detail": {
    "userId": "..."
  }
}
```

### `refocus.lens.hierarchyLoad`

This event is dispatched after the initial hierarchy data has completely downloaded.

#### Recommended Usage

1. Register an event listener for `refocus.lens.realtime.change` events.
1. Preprocess the hierarchy. You may find that you want to store the hierarchy data in a *different* kind of data structure based on the kind of visualization you are creating. If so, you would want to preprocess the hierarchy data here.
1. Modify the DOM to render the initial visualization of the hierarchy data.
1. Hide your "Loading..." indicator if you rendered one in your `refocus.lens.load` handler.

#### Event Payload

TODO

### `refocus.lens.realtime.change`

This event is dispatched by the Refocus server when any of the following changes occur:

* a sample is created
* a sample is updated
* a sample is deleted
* a new or unpublished subject is published
* a published subject is updated
* a published subject is unpublished or deleted

#### Recommended Usage

1. Update the hierarchy (or your own data structure) based on each of the changes received. 
1. Modify the DOM to re-render the visualization based on the changes.

#### Event Payload

TODO

Note: The array of changes in the event's `detail` attribute are sorted by time in ascending order--it is important to process them in that same order!

## Lens Utility Library Reference

The Lens Utility Library provides some functions which may be helpful to you as you implement your lens.

TODO

## Writing Unit Tests

TODO
