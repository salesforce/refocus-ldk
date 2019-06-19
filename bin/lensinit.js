#! /usr/bin/env node

/**
 * bin/lens-init.js
 */

const lensUtil = require('../src/lensinitUtils');
const startTime = Date.now();
//ADD commander as a dev dependency?
const commander = require('commander');
let lensName;

commander.arguments('<lens-name>')
    .action(name => lensName = name)
    .parse(process.argv);

const projectInit = `creating lens project ${lensName}`;
console.log(projectInit);
//Project initialization:
lensUtil.createDir(lensName);
lensUtil.copyPackages();
lensUtil.setupPackageJson();
console.log(`Done creating project (${Date.now() - startTime} ms)`);