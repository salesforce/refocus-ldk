/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * ./webpack.lens.config.js
 *
 * Webpack configuration for transpiling the lens.
 *
 * NOTE: we cannot use --optimize-minimize (webpack.optimize.UglifyJsPlugin)
 *  because it does not yet support ES6 :(
 */
const path = require('path');
const webpack = require('webpack');

const lens = process.env.npm_package_config_lens;

module.exports = {
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
      // {
      //   test: /\.handlebars$/,
      //   loader: 'handlebars-loader',
      //   // query: {
      //   //   debug: true,
      //   // },
      // },
    ],
  },
}; // module.exports
