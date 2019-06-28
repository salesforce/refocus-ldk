/**
 * test/lensinitUtils.js
 */

const chai = require('chai');
const path = require('path');
const expect = chai.expect;
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
    beforeEach(() => mock);
    afterEach(() => mock.restore());

    it('new directory created', () => {
      expect(fs.existsSync('./newlens')).to.be.false;
      lensUtil.createDir('newlens');
      expect(fs.existsSync('./newlens')).to.be.true;
      expect(fs.existsSync('./newlens/src/main.js')).to.be.true;
      expect(fs.existsSync('./newlens/src/lens.css')).to.be.true;
    });
  });

  describe('copy packages test > ', function () {

    this.timeout(3000);
    beforeEach(() => {
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

    it('packages copied', () => {
      expect(fs.readdirSync('./newlens/node_modules')).to.be.empty;
      lensUtil.copyPackages();
      expect(fs.readdirSync('./newlens/node_modules')).to.have.members('chai',
        'dateformat', 'eslint',
        'express', 'gulp', 'jsdom',
        'mocha', 'rimraf', 'webpack');
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

    it('package.json created >', () => {
      expect(fs.existsSync('newlens/package.json')).to.be.false;
      lensUtil.setupPackageJson();
      expect(fs.existsSync('newlens/package.json')).to.be.true;
      const jsonfile = fs.readJsonSync('./newlens/package.json');
      expect(jsonfile.dependencies).to.have.keys('commander',
        'cookie-jeep', 'fs', 'fs-extra', 'handlebars',
        'handlebars-loader', 'mock-fs', 'moment',
        'moment-timezone', 'mustache', 'mustache-loader',
        'validate-npm-package-name');
      expect(jsonfile.scripts).to.have.keys('compile',
        'zip',
        'build',
        'prototype',
        'test');
      expect(fs.existsSync(`./newlens/README.md`)).to.be.true;
      expect(fs.readFileSync(`./newlens/README.md`)).to.not.be.null;
    });

  });

  describe('AddscriptsandDependencies', () => {
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
        'mock-fs', 'moment',
        'moment-timezone',
        'mustache',
        'mustache-loader',
        'validate-npm-package-name');
      expect(packageJson.scripts).to.have.keys('compile',
        'zip',
        'build',
        'prototype',
        'test');
    });
  });
});
