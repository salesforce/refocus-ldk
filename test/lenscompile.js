/**
 * test/lenscompile.js
 */

const chai = require('chai');
const path = require('path');
const expect = chai.expect;
const fs = require('fs-extra');
const mock = require('mock-fs');
const childProcess = require('child_process');
const projectname = 'testlens';

describe('lens compile test >', function () {
  this.timeout(5000);
  beforeEach(() => fs.remove(`./${projectname}`));
  afterEach(() => fs.remove(`./${projectname}`));

  it('lens compile >', (done) => {

    //copy the example lens.js file into test folder
    //run lens compile script from Lenses/Example folder
    //compare two files from the test folder and from the compile

    const forkedProcess = childProcess.fork('../../bin/lenscompile.js', [] , { cwd:'./Lenses/Example' });
    forkedProcess.on('close', () => {
      expect(fs.existsSync('./Lenses/Example/lens.js')).to.be.true;
      const fileNew = fs.readFileSync('./Lenses/Example/lens.js');
      const fileTest = fs.readFileSync('./test/lensTest.js');
      expect(fileNew).to.not.be.null;
      const statTest = fs.statSync('./test/lensTest.js');
      const statNew = fs.statSync('./Lenses/Example/lens.js');
      const sizeTest = statTest['size'];
      const sizeNew = statNew['size'];
      expect(sizeNew).to.equal(sizeTest);
      expect(fileNew.toString() === fileTest.toString());
      done()
    });

  });
});
