/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/lensinitUtils.js
 */

const chai = require('chai');
const path = require('path');
const expect = chai.expect;
const should = chai.should;
const lensUtil = require('../src/lensinitUtils');
const fs = require('fs-extra');
const mock = require('mock-fs');

describe('lensinitUtils test > ', () => {

  function mockDirectory(path1) {
    const dir = {};
    fs.readdirSync(path1).forEach(file => {
      const filepath = path.resolve(path1, file);
      if (fs.statSync(filepath).isDirectory()) {
        dir[file] = mockDirectory(filepath);
      } else {
        dir[file] = fs.readFileSync(filepath);
      }
    });

    return dir;
  }

  describe('create dir test > ', () => {
    before(() => fs.remove('./newlens'));
    //after(() => fs.remove('./newlens'));

    it('new directory created', () => {
      expect(fs.existsSync('./newlens')).to.be.false;
      lensUtil.createDir('newlens');
      expect(fs.existsSync('./newlens')).to.be.true;
      expect(fs.existsSync('./newlens/src/main.js')).to.be.true;
      expect(fs.existsSync('./newlens/src/lens.css')).to.be.true;
      expect(fs.existsSync('./newlens/src/Utils.js')).to.be.true;
      expect(fs.existsSync('./newlens/src/RealtimeChangeHandler.js')).to.be.true;
      expect(fs.readFileSync('./newlens/src/main.js')).to.not.be.null;
      expect(fs.readFileSync('./newlens/src/lens.css')).to.not.be.null;
      expect(fs.readFileSync('./newlens/src/Utils.js')).to.not.be.null;
      expect(fs.readFileSync('./newlens/src/RealtimeChangeHandler.js')).to.not.be.null;
      expect(fs.existsSync('./newlens/test')).to.be.true;
      expect(fs.existsSync('./newlens/test/SampleUtilTest.js')).to.be.true;
      expect(fs.existsSync('./newlens/template/loading.handlebars')).to.be.true;
    });
  });

  describe('copy packages test > ', function () {

    this.timeout(10000);
    const tempPath = path.resolve(process.cwd(), 'newlens');
    beforeEach(() => {
      //   fs.mkdirSync(tempPath);
      //   if (fs.existsSync(tempPath)) {
      //     fs.mkdirSync(path.resolve(tempPath,'node_modules'));
      //   }
      mock({
        newlens: {
          node_modules: {},
        },
        node_modules: {
          chai: mockDirectory('./node_modules/chai'),
          dateformat: mockDirectory('./node_modules/dateformat'),
          eslint: mockDirectory('./node_modules/eslint'),
          express: mockDirectory('./node_modules/express'),
          gulp: mockDirectory('./node_modules/gulp'),
          jsdom: mockDirectory('./node_modules/jsdom'),
          mocha: mockDirectory('./node_modules/mocha'),
          rimraf: mockDirectory('./node_modules/rimraf'),
          webpack: mockDirectory('./node_modules/webpack'),
        },
      });
    });
    afterEach(() => mock.restore());

    it('packages copied', (done) => {
      expect(fs.readdirSync('./newlens/node_modules')).to.be.empty;
      lensUtil.copyPackages();
      expect(fs.readdirSync('./newlens/node_modules')).to.include.members(['chai', 'dateformat',
        'eslint', 'express', 'gulp', 'jsdom',
        'mocha', 'rimraf', 'webpack']);
      done();
    });
  });

  describe('Set up package json test>', () => {
    //beforeEach(function(){
    //    mock({
    //        'newlens' :{
    //            //'package.json' : ''
    //        }
    //    });
    //});
    //afterEach(() => mock.restore());

    it('package.json created ', () => {
      expect(fs.existsSync('newlens/package.json')).to.be.false;
      lensUtil.setupPackageJson();
      expect(fs.existsSync('newlens/package.json')).to.be.true;
      const jsonfile = fs.readJsonSync('./newlens/package.json');
      expect(jsonfile.dependencies).to.have.keys('commander',
        'cookie-jeep',
        'fs',
        'fs-extra',
        'handlebars',
        'handlebars-loader',
        'istanbul',
        'jscs',
        'mock-fs', 'moment',
        'moment-timezone',
        'mustache',
        'mustache-loader',
        'unzipper',
        'validate-npm-package-name');
      expect(jsonfile.scripts).to.have.keys('compile',
        'zip',
        'build',
        'prototype',
        'watch',
        'test');
      expect(fs.existsSync(`./newlens/README.md`)).to.be.true;
      expect(fs.readFileSync(`./newlens/README.md`)).to.not.be.null;
    });

  });

  describe('AddscriptsandDependencies >', () => {
    let packageJson = {
      name: 'temp_lens',
      version: '1.0.0',
      description: 'lens test',
      scripts: '',
      dependencies: '',
    };
    it('script and dependency added', () => {
      lensUtil.addScriptsAndDependencies(packageJson);
      expect(packageJson.dependencies).to.have.keys('commander',
        'cookie-jeep',
        'fs',
        'fs-extra',
        'handlebars',
        'handlebars-loader',
        'istanbul',
        'jscs',
        'mock-fs', 'moment',
        'moment-timezone',
        'mustache',
        'mustache-loader',
        'unzipper',
        'validate-npm-package-name');
      expect(packageJson.scripts).to.have.keys('compile',
        'zip',
        'build',
        'prototype',
        'watch',
        'test');
    });
  });

  describe('getAllDependencies >', () => {
    const dependencyTree = {
      a: {
        version: '1.0.0',
        dependencies: {
          f: { version: '1.0.0' },
          g: { version: '1.0.0' },
        },
      },
      b: { version: '1.0.0' },
      c: {
        version: '1.0.0',
        dependencies: {
          f: { version: '1.0.0' },
          i: {
            version: '1.0.0',
            dependencies: {
              k: { version: '1.0.0' },
              m: { version: '1.0.0' },
            },
          },
        },
      },
      d: { version: '1.0.0' },
      e: { version: '1.0.0' },
    };
    const packagesNeeded = ['a', 'b', 'c'];

    it('get all dependencies', () => {
      const dep = lensUtil.getAllDependencies(packagesNeeded, dependencyTree);
      let depArray = Array.from(dep);
      expect(depArray).to.have.members(['a', 'b', 'c', 'f', 'g', 'i', 'k', 'm']);
    });
  });
});
