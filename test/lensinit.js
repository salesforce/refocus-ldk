/**
 * test/lensinit.js
 */

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const childProcess = require('child_process');
const projectname = 'testlens';

describe('lens init test>', function () {
  this.timeout(5000);
  beforeEach(() => fs.remove(`./${projectname}`));
  afterEach(() => fs.remove(`./${projectname}`));

  it('lens init >', (done) => {
    expect(fs.existsSync(`./${projectname}`)).to.be.false;
    const forkedProcess = childProcess.fork('./bin/lensinit.js', [projectname], {});
    forkedProcess.on('close', () => {
      /* createDir */
      expect(fs.existsSync(`./${projectname}`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/src`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/test`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/src/main.js`)).to.be.true;
      expect(fs.readFileSync(`./${projectname}/src/main.js`)).to.not.be.null;
      expect(fs.existsSync(`./${projectname}/src/lens.css`)).to.be.true;

      /* copyPackages */

      expect(fs.existsSync(`./${projectname}/node_modules`)).to.be.true;
      expect(fs.readdirSync(`./${projectname}/node_modules`)).to.have.members('chai',
        'dateformat', 'eslint', 'express', 'gulp', 'jsdom', 'mocha', 'rimraf', 'webpack');

      /* set up package.json & readme */

      expect(fs.existsSync(`./${projectname}/package.json`)).to.be.true;
      const jsonfile = fs.readJsonSync(`./${projectname}/package.json`);
      expect(jsonfile.dependencies).to.have.keys('commander', 'cookie-jeep', 'fs', 'fs-extra',
        'handlebars', 'handlebars-loader', 'mock-fs', 'moment', 'moment-timezone', 'mustache',
        'mustache-loader', 'validate-npm-package-name');
      expect(jsonfile.scripts).to.have.keys('compile', 'zip', 'build', 'prototype', 'test');
      expect(fs.existsSync(`./${projectname}/README.md`)).to.be.true;
      expect(fs.readFileSync(`./${projectname}/README.md`)).to.not.be.null;
      done();
    });
  });
});
