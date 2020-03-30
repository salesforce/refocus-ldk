/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * main.js
 */
'use strict';
const cookies = require('cookie-jeep');
const Realtime = require('./Realtime');

let urlParams;
(window.onpopstate = function () {
  function decode(s) {
    const pl = /\+/g;  // Regex for replacing addition symbol with a space
    return decodeURIComponent(s.replace(pl, ' '));
  } // decode

  const search = /([^&=]+)=?([^&]*)/g;
  const query  = window.location.search.substring(1);
  let match;
  urlParams = {};
  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }
})();

const urlParamToNumber = function (str, def) {
  return (urlParams[str] === undefined) ? (def || 0) : +urlParams[str];
};

const conf = {
  load: {
    dataset: urlParams['load-dataset'] || 'sample-sysinfra.json',
    time: urlParamToNumber('load-time', 250),
  },
  realtime: {
    interval: urlParamToNumber('realtime-interval'),
    samples: {
      maxAdd: urlParamToNumber('realtime-max-sample-add'),
      maxRemove: urlParamToNumber('realtime-max-sample-remove'),
      maxUpdate: urlParamToNumber('realtime-max-sample-update'),
    },
    subjects: {
      maxAdd: urlParamToNumber('realtime-max-subject-add'),
      maxRemove: urlParamToNumber('realtime-max-subject-remove'),
      maxUpdate: urlParamToNumber('realtime-max-subject-update'),
    },
  },
};
cookies.write('ldk-conf', JSON.stringify(conf));

/**
 * Immediately-invoked function expression to send the refocus.lens.load event.
 */
(function lensLoad() {
  const lens = document.getElementById('lens');
  console.log('ldk.lensLoad', new Date(),
    'Dispatching "refocus.lens.load" event');
  lens.dispatchEvent(new CustomEvent('refocus.lens.load'));
})(); // lensLoad IIFE

/**
 * Immediately-invoked function expression to load the hierarchy data file,
 * parse the data file's contents into JSON, and send the
 * refocus.lens.hierarchyLoad event with the hierarchy JSON attached.
 */
(function hierarchyLoad() {
  const x = new XMLHttpRequest();
  x.onreadystatechange = function () {
    if (x.readyState == 4 && x.status == 200) {
      const hierarchy = x.responseText;
      console.log('ldk.hierarchyLoad', new Date(),
        `Wait ${conf.load.time}ms ` +
        'to simulate hierarchy loading time');
      window.setTimeout(() => {
        console.log('ldk.hierarchyLoad', new Date(),
          'Dispatching "refocus.lens.hierarchyLoad" event');
        lens.dispatchEvent(new CustomEvent('refocus.lens.hierarchyLoad', {
          detail: JSON.parse(hierarchy),
        }));
      }, conf.load.time);
    }
  };

  const file = `datasets/${conf.load.dataset}`;
  console.log('ldk.hierarchyLoad', new Date(), `Loading ${file}`);
  x.open('GET', file, true);
  x.send();
})(); // hierarchyLoad IIFE

/**
 * Immediately-invoked function expression to start the flow of random
 * realtime events.
 */
(function onHierarchyLoad() {
  const lens = document.getElementById('lens');
  lens.addEventListener('refocus.lens.hierarchyLoad',
    (evt) => new Realtime(conf.realtime, lens, evt.detail));
})(); // onHierarchyLoad IIFE
