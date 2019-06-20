#! /usr/bin/env node

/**
 * bin/lenscompile.js
 * */

const path = require('path');
const webpack = require('webpack');
const commander = require('commander');
const dir = cwd;

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

const compiler = webpack({
    entry: [
        `./Lenses/${lens}/src/main`,
    ],
    output: {
        filename: 'lens.js',
        path: path.join(__dirname, 'Lenses', lens),
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
        colors : true
    },
    plugins: {
        //new webpack.optimize.DedupePlugin() since dedupeplugin is no longer available in webpack v4
    }
});

compiler.run(function(err,stat){
    //err object does not include compilation errors andthose must be handled separately using stats.hasErrors()
    console.log(stat.toString());
    console.log(err);
});

