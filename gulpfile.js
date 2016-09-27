/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * gulpfile.js
 */
'use strict';
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const zip = require('gulp-zip');
const fs = require('fs');
const path = require('path');
const lensarg = require('./lensarg');

const error = {
  lensDirDoesNotExist: 'ERROR: Cannot execute task because the lens ' +
    'directory does not exist.',
  lensDirAlreadyExists: 'ERROR: Cannot execute task because the lens ' +
    'directory already exists.',
};
const lensInfo = lensarg.init();

gulp.task('zip', () => {
  if (!fs.existsSync(lensInfo.dir)) {
    console.log(error.lensDirDoesNotExist);
    process.exit(0);
  }

  // TODO deal with images

  const toZip = [
    `${lensInfo.dir}/lens.json`,
    `${lensInfo.dir}/lens.js`,
  ];
  return gulp.src(toZip)
    .pipe(zip(`${lensInfo.name}.zip`))
    .pipe(gulp.dest('./dist'));
}); // zip

/**
 * Creates directories for the new lens; creates a "starter" lens.json; creates
 * a "starter" src/main.js based on template. Fails if the lens directory
 * already exists.
 */
gulp.task('create', () => {
  if (fs.existsSync(lensInfo.dir)) {
    console.log(error.lensDirAlreadyExists);
    process.exit(0);
  }

  const lensesDir = path.join(__dirname, 'Lenses');
  if (!fs.existsSync(lensesDir)) {
    fs.mkdirSync(lensesDir);
  }

  [lensInfo.dir, `Lenses/${lensInfo.name}/src`, `Lenses/${lensInfo.name}/test`]
    .forEach((d) => fs.mkdirSync(d));
  fs.appendFileSync(`Lenses/${lensInfo.name}/lens.json`,
    JSON.stringify({
      name: `${lensInfo.name}`,
      description: '',
      helpEmail: '',
      helpUrl: '',
      license: '',
      version: '0.0.1',
    }, null, 2));
  fs.appendFileSync(`Lenses/${lensInfo.name}/src/main.js`,
    fs.readFileSync('main.template', 'utf8'));
  fs.appendFileSync(`Lenses/${lensInfo.name}/src/lens.css`, '');
  return true;
}); // create
