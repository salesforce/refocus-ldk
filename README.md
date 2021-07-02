# refocus-ldk

## Refocus Lens Developer Kit

Note: this repository is infrequently maintained.

The Refocus Lens Developer Kit (LDK) is a toolkit for developing, testing and packaging [Refocus](https://github.com/salesforce/refocus) lenses for deployment.

- [Introduction](#introduction)
- [Install](#install)
- [Create](#create)
- [Implement](#implement)
- [Prototype](#prototype)
- [Test](#test)
- [Build](#build)
- [Deploy](#deploy)

### Introduction

[Refocus](https://github.com/salesforce/refocus) is a platform for visualizing the status of some set of subjects under monitoring. The platform does not attempt to provide visualizations to satisfy every type of user. Instead, it allows users to install add-on modules, which we call *lenses*, to provide new visualizations. Each lens provides a new visualization to help users understand their data in a new way. 

The LDK lets you build and test a lens quickly and iteratively, *without* having to install it into a running Refocus application. The LDK also provides some dummy datasets and simulates realtime events so you can test how your lens handles hierarchy data and realtime events.

The LDK creates a new lens project that comes with templates you can use to get familiar with how a lens works and jump-start building your own new lens. 


### Install

```
git clone https://github.com/salesforce/refocus-ldk.git
cd refocus-ldk
npm install
npm link
```

### Create

Create a basic directory structure with some starter files so you can get right into developing, testing and packaging your new lens. When naming your new lens, you should follow npm package naming conventions (which can 
be found here https://github.com/npm/validate-npm-package-name).

```
lens-init <lens-name>
```

### Implement

See the [Lens Developer Guide](LensDeveloperGuide.md) for help, guidelines and reference materials.


### Prototype

In one terminal, from your lens directory, start the LDK-Prototyper, a local app server which renders your lens in a browser for rapid prototyping.

```
npm run prototype
```

In another terminal, also from your lens directory, automatically compile your code as you make changes so you can see the results in the browser immediately (just refresh http://localhost:3000).

```
npm run watch
```

### Test

Run all the tests under your lens's `test` directory.

```
npm run test
```

### Build

Before you build your lens, you should update your lens project data in `package.json` file in the project's root directory.

Package up all your lens resources into zip file in the project's root directory for deployment using the build script:

```
npm run build
```

During the build process, webpack bundles up all the javascript files and dependencies required by `main.js` file in `src` folder into `lens.js` file in the project's root directory, then that gets packaged into a zip file in your lens project along with `package.json` file.

### Deploy
When you are ready to install your new lens into Refocus, upload your zip file as your lens `library` file use the Refocus API (`/v1/lenses`) or Refocus UI.
