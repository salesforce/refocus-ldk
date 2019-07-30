/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/lensInit.js
 */

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
const childProcess = require('child_process');
const projectname = 'testlens';

describe('lens init test>', function () {
  this.timeout(20000);
  beforeEach(() => fs.remove(`./${projectname}`));
  afterEach(() => fs.remove(`./${projectname}`));

  it('new lens created ', (done) => {
    expect(fs.existsSync(`./${projectname}`)).to.be.false;
    const forkedProcess = childProcess.fork('./bin/lensInit.js', [projectname], {});
    forkedProcess.on('close', () => {
      /* createDir */
      expect(fs.existsSync(`./${projectname}`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/src`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/test`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/src/main.js`)).to.be.true;
      expect(fs.readFileSync(`./${projectname}/src/main.js`)).to.not.be.null;
      expect(fs.existsSync(`./${projectname}/src/lens.css`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/src/Utils.js`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/src/RealtimeChangeHandler.js`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/test/SampleTest.js`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/test/SampleUtilTest.js`)).to.be.true;
      expect(fs.existsSync(`./${projectname}/test/sample-json.json`)).to.be.true;

      /* copyPackages */

      expect(fs.existsSync(`./${projectname}/node_modules`)).to.be.true;
      expect(fs.readdirSync(`./${projectname}/node_modules`)).to.include.members(['chai',
        'dateformat', 'eslint', 'express', 'gulp', 'jsdom', 'mocha', 'rimraf', 'webpack']);

      /* set up package.json & readme */

      expect(fs.existsSync(`./${projectname}/package.json`)).to.be.true;
      const jsonfile = fs.readJsonSync(`./${projectname}/package.json`);
      expect(jsonfile.dependencies).to.have.keys(
        'commander', 'cookie-jeep', 'fs', 'fs-extra',
        'handlebars', 'handlebars-loader', 'istanbul', 'jscs',
        'mock-fs', 'moment', 'moment-timezone', 'mustache',
        'mustache-loader', 'unzipper', 'validate-npm-package-name');
      expect(jsonfile.scripts).to.have.keys('compile', 'zip', 'build', 'prototype', 'test');
      expect(fs.existsSync(`./${projectname}/README.md`)).to.be.true;
      expect(fs.readFileSync(`./${projectname}/README.md`)).to.not.be.null;
      done();
    });
  });
});
