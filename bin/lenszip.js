#! /usr/bin/env node

/**
 * bin/lenszip.js
 * */

'use strict'
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const zip = require('gulp-zip');
const fs = require('fs');
const path = require('path');
const process = require('process');

/**
 *Gulp notes:
 * - You can run gulp tasks without a gulpfile if you include gulp.start('task name')
 *
 * -Instead of lens.json - zipped package.json
 */

const lensInfo = {
  name: path.basename(process.cwd()),
  dir: process.cwd(),
};

//currently saving the zip in the project folder
const gulpdist = lensInfo.dir;

gulp.task('zip', zipFunc); // zip

function zipFunc(done) {
  if (!fs.existsSync(lensInfo.dir)) {
    console.log('ERROR: Cannot execute task because the lens ' +
      'directory does not exist.');
    process.exitCode = 0;

  }

  let zipFilePath = `${lensInfo.dir}/package.json`;

  if (!fs.existsSync(zipFilePath)) {
    zipFilePath = `${lensInfo.dir}/lens.json`;
  }

  const toZip = [
    zipFilePath,
    `${lensInfo.dir}/lens.js`,
  ];
  return gulp.src(toZip)
    .pipe(zip(`${lensInfo.name}.zip`))
    .pipe(gulp.dest(gulpdist));
  if (done) done();
}

//Call gulp task
zipFunc();
