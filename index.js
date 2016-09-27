/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

'use strict';
const express = require('express');
const app = express();
const lensarg = require('./lensarg');

const lensInfo = lensarg.init();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.static(`Lenses/${lensInfo.name}`));

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(3000, function () {
  console.log(`The LDK-Prototyper for your "${lensInfo.name}" lens is ` +
    `running at http://localhost:${PORT}`);
});
