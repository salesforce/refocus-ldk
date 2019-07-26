#! /usr/bin/env node

/**
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * bin/lensPrototype.js
 * */

'use strict';
const express = require('express');
const path = require('path');
const app = express();
const cwd = process.cwd();
const lensName = path.basename(cwd);
const PORT = 8000;

app.use(express.static(path.resolve(__dirname, '../public')));
app.use(express.static(cwd));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(PORT, function () {
  console.log(`The LDK-Prototyper for "${lensName}" is ` +
    `running at http://localhost:${PORT}`);
});

module.exports = app;
