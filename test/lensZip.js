/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * test/lensZip.js
 */

const chai = require('chai');
const path = require('path');
const expect = chai.expect;
const fs = require('fs-extra');
const childProcess = require('child_process');
const unzip = require('unzipper');

describe('lens zip test >', function () {
  this.timeout(5000);

  it('lens zip created', (done) => {
    const forkedProcess = childProcess.fork('../../bin/lensZip.js',
      [], { cwd: './Lenses/Example' });
    const forkedCWD = './Lenses/Example';
    forkedProcess.on('close', () => {
      const projectName = path.basename('./Lenses/Example');
      const zipPath = path.resolve(forkedCWD, `${projectName}.zip`);
      expect(fs.existsSync(zipPath)).to.be.true;
      const readStream = fs.createReadStream(zipPath);
      readStream
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
          expect(entry.size).to.not.be.null;
          expect(entry.path).to.be.oneOf(['lens.js', 'package.json', 'lens.json']);
        });

      done();
    });
  });
});
