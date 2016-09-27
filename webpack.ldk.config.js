/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    ldk: ['./src/main'],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'public'),
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
}; // module.exports
