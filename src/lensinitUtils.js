/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * src/lensinitUtils.js
 *
 * Resources to create a new lens project
 */

const util = require('util');
const path = require('path');
const fs = require('fs-extra');
const process = require('process');

//current working directory
let cwd = process.cwd();
const ldkDependencies = require('../package.json').dependencies;
const execSync = require('child_process').execSync;

/* Formatting README.md file */
const readme = '%s Lens \n\n %s ';

/* dev dependencies to add to new lens project*/
const ldkDevDependencies = require('../package.json').devDependencies;
const packagesToAdd = Object.keys(ldkDependencies);
const devPackagesToAdd = Object.keys(ldkDevDependencies);

/* Scripts to add to new lens project */
const scriptsToAdd = {
  compile: 'lens-compile',
  watch: 'lens-compile --watch',
  zip: 'lens-zip',
  build: 'npm run compile && npm run zip',
  prototype: 'lens-prototype',
  test: 'mocha --recursive ./test/*.js',
};

function getAllDependencies(moduleNames, dependencyTree) {
  let allDependencies = new Set();
  moduleNames.forEach((moduleName) => {
    const module = dependencyTree[moduleName];
    if (module) allDependencies.add(moduleName);
    const nextDependencies = module && module.dependencies;
    if (nextDependencies) {
      getAllDependencies(Object.keys(nextDependencies), nextDependencies)
        .forEach((dep) => allDependencies.add(dep));
    }
  });
  return allDependencies;
}

/* Adding scripts and dependencies */
function addScriptsAndDependencies(packageJson) {
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  Object.keys(scriptsToAdd).forEach(n => {
    packageJson.scripts[n] = scriptsToAdd[n];
  });

  if (!packageJson.dependencies) {
    packageJson.dependencies = {};
  }

  Object.keys(ldkDependencies).forEach((m) => {
    packageJson.dependencies[m] = ldkDependencies[m];
  });

  if (!packageJson.devDependencies) {
    packageJson.devDependencies = {};
  }

  Object.keys(ldkDevDependencies).forEach((k) => {
    packageJson.devDependencies[k] = ldkDevDependencies[k];
  });

  packageJson.main = 'main.js';

}

module.exports = {

  //Create a new directory for the project w/ src/main.js & lens.css
  createDir: (lensName) => {
    console.log('Creating project directory...');
    const dir = path.resolve(cwd, lensName);
    fs.mkdirpSync(dir, { recursive: true }, (err) => {
      if (err) throw new Error(err);
    });

    cwd = dir;
    try {
      fs.accessSync(cwd, fs.constants.F_OK);
    } catch (err) {
      console.log(err);
      return false;
    }

    [path.resolve(dir, 'src'), path.resolve(dir, 'test'),
      path.resolve(dir, 'node_modules')].forEach(
      (d) => {
        fs.mkdirpSync(d, { recursive: true }, (err) => {
          if (err) throw new Error(err);
        });
      }
    );

    fs.appendFileSync(path.resolve(dir, 'src/main.js'),
      fs.readFileSync(path.resolve(__dirname, '../main.template'), 'utf8'));
    fs.appendFileSync(path.resolve(dir, 'src/lens.css'), '');
    return true;
  },
  getAllDependencies,

  //Copy devDependencies of LDK
  copyPackages: () => {
    console.log('Copying packages...');
    const list = execSync('npm ls --prod --json', { cwd: __dirname });
    const list2 = execSync('npm ls --dev --json', { cwd: __dirname });
    const dependencyTree = JSON.parse(list).dependencies;
    const devDepTree = JSON.parse(list2).dependencies;
    let allDep = getAllDependencies(packagesToAdd, dependencyTree);
    let devDep = getAllDependencies(devPackagesToAdd, devDepTree);
    devDep.forEach((dep) => {
      if (!allDep.has(dep)) {

        allDep.add(dep);
      }
    });
    allDep.forEach(module => {
      const fromDir = path.resolve(__dirname, '../node_modules', module);
      const toDir = path.resolve(cwd, 'node_modules', module);
      if (fs.existsSync(fromDir)) {
        fs.copySync(fromDir, toDir);
      }
    });
    return true;
  },

  //Set up package.json file & readme
  setupPackageJson: (dir = cwd) => {
    console.log('Setting up package.json...');
    execSync('npm init --yes', { cwd: dir, stdio: 'ignore', env: process.env });
    const p = fs.readJsonSync(path.resolve(dir, 'package.json'));
    addScriptsAndDependencies(p);
    fs.writeJsonSync(path.resolve(dir, 'package.json'), p, { spaces: 2 });
    const temp = fs.readJsonSync(path.resolve(dir, 'package.json'));
    console.log('Creating readme...');
    fs.writeFile(path.resolve(cwd, 'README.md'), util.format(readme, temp.name,
      temp.description || 'A new lens project for Refocus'));
    return true;
  },

  addScriptsAndDependencies,
};
