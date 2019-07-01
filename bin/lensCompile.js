#! /usr/bin/env node

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

if (commander.watch) {
  compiler.watch({
    //watch options

  }, function (err, stats) {
    //error-handling
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.log(err.details);
      }
    }

    const statInfo = stats.toJson();
    if (stats.hasErrors()) {
      console.error(statInfo.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(statInfo.warnings);
    }
  });
} else {
  compiler.run(function (err, stats) {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.log(err.details);
      }
    }

    const statInfo = stats.toJson();
    if (stats.hasErrors()) {
      console.error(statInfo.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(statInfo.warnings);
    }
  });
}
