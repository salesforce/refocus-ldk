/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const path = require('path');

module.exports = {
  init: () => {
    const error = {
      noLens: 'ERROR: Cannot execute task because no lens was specified.\n' +
        'Either set the npm config variable "refocus-ldk:lens" first, e.g.\n' +
        '  > npm config set refocus-ldk:lens SuperDuperLens\n' +
        'or include --lens=SuperDuperLens at the end of your command, e.g.\n' +
        '  > gulp zip --lens=SuperDuperLens\n' +
        '  > node prototype --lens=SuperDuperLens\n',
    };
    const lensArgPrefix = '--lens=';

    const filtered = process.argv.filter((arg) => arg.indexOf(lensArgPrefix) >= 0);
    if (filtered.length == 0) {
      console.log(error.noLens);
      process.exit(0);
    }

    if (filtered.length) {
      const lens = filtered[0].substring(lensArgPrefix.length);
      if (lens.length == 0) {
        console.log(error.noLens);
        process.exit(0);
      }

      const lensDir = path.join(__dirname, 'Lenses', lens);
      console.log(`*** lens=${lens}`);
      return {
        name: lens,
        dir: lensDir,
      };
    }
  },
};

