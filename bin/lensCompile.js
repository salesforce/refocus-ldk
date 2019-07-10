#! /usr/bin/env node

/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * bin/lensCompile.js
 * */

'use strict'
const path = require('path');
const webpack = require('webpack');
const commander = require('commander');
const process = require('process');
const dir = process.cwd();
const lensDir = path.resolve(dir, 'src/main.js');

/**
 * Webpack notes:
 *Stat object in webpack:
 * - stats.hasErrors() - errors while compiling (returns true or false)
 * - stats.hasWarnings() - same thing for warnings
 * - stats.toString (can add colors option for console)
 *Error Handling: three types of error
 * - fatal webpack errors - wrong config
 * - compilation errors - missing modules & syntax errors
 * - compilation warnings
 */

commander.option('--watch').parse(process.argv);

const compiler = webpack({
  entry: [
    lensDir,
  ],
  output: {
    filename: 'lens.js',
    path: dir,
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style!css',
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-template-loader',
      },
    ],
  },
  stats: {
    progress: true,
    colors: true,
  },
  plugins: {
  },
});

function errorFunction (err,stats) {
  //error-handling
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.log(err + ' details');
      console.log(err.details);
    }
  }

  const statInfo = stats.toJson();
  if (stats.hasErrors()) {
    console.log('Errors: ');
    console.error(statInfo.errors);
  }

  if (stats.hasWarnings()) {
    console.log('Warnings: ');
    console.warn(statInfo.warnings);
  }
}

if (commander.watch) {
  compiler.watch({
    //watch options
  }, function(err, stats){
    errorFunction(err, stats)
  });
} else {
  compiler.run(function(err, stats){
    errorFunction(err, stats)
  });
}
