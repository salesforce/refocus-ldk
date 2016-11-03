# refocus-ldk

## Refocus Lens Developer Kit

The Refocus Lens Developer Kit (LDK) is a toolkit for developing, testing and packaging [Refocus](https://github.com/salesforce/refocus) lenses for deployment.

- [Introduction](#introduction)
- [Install](#install)
- [Configure](#configure)
- [Create](#create)
- [Implement](#implement)
- [Prototype](#prototype)
- [Test](#test)
- [Build](#build)
- [Deploy](#deploy)

### Introduction

[Refocus](https://github.com/salesforce/refocus) is a platform for visualizing the status of some set of subjects under monitoring. The platform does not attempt to provide visualizations to satisfy every type of user. Instead, it allows users to install add-on modules, which we call *lenses*, to provide new visualizations. Each lens provides a new visualization to help users understand their data in a new way. 

The LDK lets you build and test a lens quickly and iteratively, *without* having to install it into a running Refocus application. The LDK also provides some dummy datasets and simulates realtime events so you can test how your lens handles hierarchy data and realtime events.

### Install

```
git clone https://github.com/salesforce/refocus-ldk.git
cd refocus-ldk
npm install
```

### Configure

Since you can work on multiple lenses in the LDK, in this step you specify the name of the lens you want to work on (or create) right now.

> **Note: All the other `npm run ...` scripts depend on this config setting!**

```
npm config set refocus-ldk:lens SuperDuperLens
```

> If you are working on multiple lenses and you aren't sure which lens you are currently using, you can run `npm config list | grep refocus-ldk:lens`.

### Create

Create a basic directory structure with some starter files so you can get right into developing, testing and packaging your new lens.

```
npm run create
```

### Implement

See the [Lens Developer Guide](LensDeveloperGuide.md) for help, guidelines and reference materials.

### Prototype

In one terminal, from your `refocus-ldk` directory, start the LDK-Prototyper, a local app server which renders your lens in a browser for rapid prototyping.

```
npm run prototype
```

In another terminal, also from your `refocus-ldk` directory, automatically compile your code as you make changes so you can see the results in the browser immediately (just refresh http://localhost:3000).

```
npm run compile-watch
```

### Test

Run all the tests under your lens's `test` directory.

```
npm run test
```

### Build

Before you build your lens, you should update your lens metadata in `./SuperDuperLens/lens.json`.

Package up all your lens resources into `./dist/SuperDuperLens.zip` for deployment using the build script:

```
npm run build
```

During the build process, webpack bundles up all the javascript files and dependencies required by `./SuperDuperLens/src/main.js` into `./SuperDuperLens/lens.js`, then that gets zipped up into `./dist/SuperDuperLens.zip` along with `./SuperDuperLens/lens.json`.

### Deploy
When you are ready to install your new lens into Refocus, upload `./dist/SuperDuperLens.zip` as your lens `library` file use the Refocus API (`/v1/lenses`) or Refocus UI.
