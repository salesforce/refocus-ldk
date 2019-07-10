#! /usr/bin/env node

/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * bin/lensInit.js
 */

const lensUtil = require('../src/lensinitUtils');
const startTime = Date.now();
const path = require('path');
const commander = require('commander');
const validate = require('validate-npm-package-name');
let lensName;
const cwd = process.cwd();

commander.arguments('<lens-name>')
  .action(name => {
    if (name) {
      lensName = name;
    } else {
      throw new Error('invalid lens name');
    }
  })
  .parse(process.argv);

const isValid = validate(lensName);

if (isValid.validForNewPackages) {
  const lensPath = path.resolve(cwd, lensName);
  const projectInit = `Creating lens project ${lensName} in ${lensPath}`;
  console.log(projectInit);

  //Project initialization:
  lensUtil.createDir(lensName) && lensUtil.copyPackages() && lensUtil.setupPackageJson();
  console.log(`Done creating project (${Date.now() - startTime} ms)`);
} else {
  const nameErrors = isValid.errors || isValid.warnings;
  throw new Error(nameErrors[0]);
}
