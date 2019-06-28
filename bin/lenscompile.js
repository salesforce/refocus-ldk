#! /usr/bin/env node

/**
 * bin/lenscompile.js
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
 * - run : used to kicjstart all compilation work with a callback function
 * so the err and stats function will be the callback of run
 * - add a ' watch ' option in the command line if there is a watch option than call 'watch' on compiler instance
 * watch function will have options and callback func that deals with stats and errors
 * - close method will end the watch
 *Stat object in webpack:
 * - stats.hasErrors() - errors while compiling (returns true or false)
 * - stats.hasWarnings() - same thing for warnings
 * - stats.toString (can add colors option for console)
 *Error Handling: three types of error
 * - fatal webpack errors - wrong config
 * - compilation errors - missing modules & syntax errors
 * - compilation warnings
 * console.error / console.warn / err.details are useful
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

