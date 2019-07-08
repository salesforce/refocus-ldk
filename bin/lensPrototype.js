#! /usr/bin/env node

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
  console.log(`The LDK-Prototyper for your "${lensName}" lens is ` +
    `running at http://localhost:${PORT}`);
});

module.exports = app;
