#! /usr/bin/env node

/**
 * bin/lens-init.js
 */

const lensUtil = require('../src/lensinitUtils');
const startTime = Date.now();
const commander = require('commander');
const validate = require('validate-npm-package-name');
let lensName;

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
  const projectInit = `creating lens project ${lensName}`;
  console.log(projectInit);

  //Project initialization:
  lensUtil.createDir(lensName) && lensUtil.copyPackages() && lensUtil.setupPackageJson();
  console.log(`Done creating project (${Date.now() - startTime} ms)`);
} else {
  const nameErrors = isValid.errors || isValid.warnings;
  throw new Error(nameErrors[0]);
}
