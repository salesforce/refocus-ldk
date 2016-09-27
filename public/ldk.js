/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * main.js
	 */
	'use strict';
	const cookies = __webpack_require__(2);
	const Realtime = __webpack_require__(3);

	let urlParams;
	(window.onpopstate = function() {
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
	  x.onreadystatechange = function() {
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
	})(); // hierarhcyLoad IIFE

	/**
	 * Immediately-invoked function expression to start the flow of random
	 * realtime events.
	 */
	(function onHierarchyLoad() {
	  const lens = document.getElementById('lens');
	  lens.addEventListener('refocus.lens.hierarchyLoad',
	    (evt) => new Realtime(conf.realtime, lens, evt.detail));
	})(); // onHierarhcyLoad IIFE


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Cookie utility package
	 * Based onto the quirksmode cookie post http://www.quirksmode.org/js/cookies.html
	 */
	(function () {
	    'use strict';
	    window.cookies = {};

	    cookies.write = function (name, value, days) {
	        var expires;
	        if (days) {
	            var date = new Date();
	            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	            expires = '; expires=' + date.toGMTString();
	        }
	        else {
	            expires = '';
	        }
	        document.cookie = name + ' = ' + value + expires + '; path=/';
	    };

	    cookies.read = function (name) {
	        var nameEQ = name + '=',
	            ca = document.cookie.split(';');
	        for (var i = 0; i < ca.length; i++) {
	            var c = ca[i];
	            while (c.charAt(0) === ' ') {
	                c = c.substring(1, c.length);
	            }
	            if (c.indexOf(nameEQ) === 0) {
	                return c.substring(nameEQ.length, c.length);
	            }
	        }
	        return null;
	    };

	    cookies.delete = function (name) {
	        this.write(name, '', -1);
	    };

	    if (typeof module === "object" && module.exports) {
		    module.exports = cookies;
	    }

	    return cookies;
	}());


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Realtime.js
	 *
	 * This module controls how the LDK dispatches realtime events to the lens.
	 */
	'use strict';
	const d3c = __webpack_require__(4);
	const d3a = __webpack_require__(5);
	const Random = __webpack_require__(6);

	module.exports = class Realtime {

	  prepareSampleUpdates() {
	    const retval = [];
	    const max = d3a.min([
	      this.conf.samples.maxUpdate,
	      d3c.keys(this.inventory.samples).length,
	    ]);
	    const x = Random.intBetween(0, max);
	    console.log('ldk.Realtime.prepareSampleUpdates', new Date(),
	      `Preparing a batch of ${x} sample updates`);
	    const sampleValues = d3c.values(this.inventory.samples);
	    if (x && sampleValues.length) {
	      [...Array(x).keys()].forEach(() => {
	        const sOld = sampleValues[Random.intBetween(0, x - 1)];
	        const sNew = Random.updateSample(sOld);
	        this.inventory.samples[sNew.name] = sNew;
	        retval.push({
	          'sample.update': {
	            old: sOld,
	            new: sNew,
	          },
	        });
	      });
	    }
	    return retval;
	  } // prepareSampleUpdates

	  prepareSampleAdds() {
	    const retval = [];
	    const x = Random.intBetween(0, this.conf.samples.maxAdd);
	    console.log('ldk.Realtime.prepareSampleAdds', new Date(),
	      `Preparing a batch of ${x} sample adds`);
	    const subjectValues = d3c.values(this.inventory.subjects);
	    if (x && subjectValues.length) {
	      [...Array(x).keys()].forEach(() => {
	        const idx = Random.intBetween(0, subjectValues.length - 1);
	        const subject = subjectValues[idx];
	        const s = Random.addSample(subject);
	        if (!this.inventory.samples[s.name]) {
	          this.inventory.samples[s.name] = s;
	          retval.push({ 'sample.add': s });
	        }
	      });
	    }
	    return retval;
	  } // prepareSampleAdds

	  prepareSampleDeletes() {
	    const retval = [];
	    const max = d3a.min([
	      this.conf.samples.maxRemove,
	      d3c.keys(this.inventory.samples).length,
	    ]);
	    const x = Random.intBetween(0, max);
	    console.log('ldk.Realtime.prepareSampleDeletes', new Date(),
	      `Preparing a batch of ${x} sample deletes`);
	    const sampleValues = d3c.values(this.inventory.samples);
	    if (x && sampleValues.length) {
	      [...Array(x).keys()].forEach(() => {
	        const s = sampleValues[Random.intBetween(0, x - 1)];
	        delete this.inventory.samples[s.name];
	        retval.push({ 'sample.remove': s });
	      });
	    }
	    return retval;
	  } // prepareSampleDeletes

	  prepareSubjectAdds() {
	    const retval = [];
	    const x = Random.intBetween(0, this.conf.subjects.maxAdd);
	    console.log('ldk.Realtime.prepareSubjectAdds', new Date(),
	      `Preparing a batch of ${x} subject adds`);
	    const subjectValues = d3c.values(this.inventory.subjects);
	    if (x && subjectValues.length) {
	      [...Array(x).keys()].forEach(() => {
	        const idx = Random.intBetween(0, subjectValues.length - 1);
	        const s = Random.addSubject(subjectValues[idx].absolutePath);
	        this.inventory.subjects[s.absolutePath] = s;
	        retval.push({ 'subject.add': s });
	      });
	    }
	    return retval;
	  } // prepareSubjectAdds

	  prepareSubjectUpdates() {
	    const retval = [];
	    const x = Random.intBetween(0, this.conf.subjects.maxUpdate);
	    console.log('ldk.Realtime.prepareSubjectUpdates', new Date(),
	      `Preparing a batch of ${x} subject updates`);
	    const subjectValues = d3c.values(this.inventory.subjects);
	    if (x && subjectValues.length) {
	      [...Array(x).keys()].forEach(() => {
	        const idx = Random.intBetween(0, subjectValues.length - 1);
	        const sOld = subjectValues[idx];
	        const sNew = Random.updateSubject(sOld);
	        this.inventory.subjects[sNew.absolutePath] = sNew;
	        retval.push({
	          'subject.update': {
	            old: sOld,
	            new: sNew,
	          },
	        });
	      });
	    }
	    return retval;
	  } // prepareSubjectUpdates

	  prepareSubjectDeletes() {
	    const retval = [];
	    const x = Random.intBetween(0, this.conf.subjects.maxRemove);
	    console.log('ldk.Realtime.prepareSubjectDeletes', new Date(),
	      `Preparing a batch of ${x} subject deletes`);
	    const subjectValues = d3c.values(this.inventory.subjects);
	    if (x && subjectValues.length) {
	      [...Array(x).keys()].forEach(() => {
	        const idx = Random.intBetween(0, subjectValues.length - 1);
	        const s = subjectValues[idx];
	        delete this.inventory.subjects[s.absolutePath];
	        retval.push({ 'subject.remove': s });
	      });
	    }
	    return retval;
	  } // prepareSubjectDeletes

	  constructor(conf, lens, hierarchyJson) {
	    this.conf = conf;
	    this.lens = lens;
	    this.intervalId = null;
	    this.inventory = null;
	    this.resetInventory();
	    this.traverse(hierarchyJson);
	    this.start();
	  } // constructor

	  addToInventory(subject) {
	    // Add this subject to the inventory.
	    this.inventory.subjects[subject.absolutePath] = subject;

	    // Add each of its samples to the inventory.
	    if (subject.samples && subject.samples.length) {
	      subject.samples.forEach((s) => {
	        this.inventory.samples[s.name] = s;
	      });
	    }
	  } // addToInventory

	  doDispatch() {
	    const toDispatch = [].concat(
	      this.prepareSampleUpdates(),
	      this.prepareSampleAdds(),
	      this.prepareSampleDeletes(),
	      this.prepareSubjectUpdates(),
	      this.prepareSubjectAdds(),
	      this.prepareSubjectDeletes()
	    );

	    if (toDispatch.length) {
	      console.log('ldk.Realtime.doDispatch', new Date(),
	        'Dispatching a refocus.lens.realtime.change event ' +
	        `with ${toDispatch.length} changes`);
	      lens.dispatchEvent(new CustomEvent('refocus.lens.realtime.change', {
	        detail: toDispatch,
	      }));
	    }
	  } // doDispatch

	  resetInventory() {
	    this.inventory = {
	      subjects: {},
	      samples: {},
	    };
	  } // resetInventory

	  start() {
	    if (this.conf.interval > 0) {
	      console.log('ldk.Realtime.start', new Date(),
	        'Start dispatching random realtime events ' +
	        `every ${this.conf.interval}ms`);
	      this.intervalId = window.setInterval(() => this.doDispatch(),
	        this.conf.interval);
	    }
	  } // start

	  stop() {
	    window.clearInterval(this.intervalId);
	  } // stop

	  traverse(node) {
	    this.addToInventory(node);
	    if (node.children) {
	      node.children.forEach((child) => this.traverse(child));
	    }
	  } // traverse

	}; // module.exports


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-collection/ Version 1.0.0. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  var prefix = "$";

	  function Map() {}

	  Map.prototype = map.prototype = {
	    constructor: Map,
	    has: function(key) {
	      return (prefix + key) in this;
	    },
	    get: function(key) {
	      return this[prefix + key];
	    },
	    set: function(key, value) {
	      this[prefix + key] = value;
	      return this;
	    },
	    remove: function(key) {
	      var property = prefix + key;
	      return property in this && delete this[property];
	    },
	    clear: function() {
	      for (var property in this) if (property[0] === prefix) delete this[property];
	    },
	    keys: function() {
	      var keys = [];
	      for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
	      return keys;
	    },
	    values: function() {
	      var values = [];
	      for (var property in this) if (property[0] === prefix) values.push(this[property]);
	      return values;
	    },
	    entries: function() {
	      var entries = [];
	      for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
	      return entries;
	    },
	    size: function() {
	      var size = 0;
	      for (var property in this) if (property[0] === prefix) ++size;
	      return size;
	    },
	    empty: function() {
	      for (var property in this) if (property[0] === prefix) return false;
	      return true;
	    },
	    each: function(f) {
	      for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
	    }
	  };

	  function map(object, f) {
	    var map = new Map;

	    // Copy constructor.
	    if (object instanceof Map) object.each(function(value, key) { map.set(key, value); });

	    // Index array by numeric index or specified key function.
	    else if (Array.isArray(object)) {
	      var i = -1,
	          n = object.length,
	          o;

	      if (f == null) while (++i < n) map.set(i, object[i]);
	      else while (++i < n) map.set(f(o = object[i], i, object), o);
	    }

	    // Convert object to map.
	    else if (object) for (var key in object) map.set(key, object[key]);

	    return map;
	  }

	  function nest() {
	    var keys = [],
	        sortKeys = [],
	        sortValues,
	        rollup,
	        nest;

	    function apply(array, depth, createResult, setResult) {
	      if (depth >= keys.length) return rollup != null
	          ? rollup(array) : (sortValues != null
	          ? array.sort(sortValues)
	          : array);

	      var i = -1,
	          n = array.length,
	          key = keys[depth++],
	          keyValue,
	          value,
	          valuesByKey = map(),
	          values,
	          result = createResult();

	      while (++i < n) {
	        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
	          values.push(value);
	        } else {
	          valuesByKey.set(keyValue, [value]);
	        }
	      }

	      valuesByKey.each(function(values, key) {
	        setResult(result, key, apply(values, depth, createResult, setResult));
	      });

	      return result;
	    }

	    function entries(map, depth) {
	      if (++depth > keys.length) return map;
	      var array, sortKey = sortKeys[depth - 1];
	      if (rollup != null && depth >= keys.length) array = map.entries();
	      else array = [], map.each(function(v, k) { array.push({key: k, values: entries(v, depth)}); });
	      return sortKey != null ? array.sort(function(a, b) { return sortKey(a.key, b.key); }) : array;
	    }

	    return nest = {
	      object: function(array) { return apply(array, 0, createObject, setObject); },
	      map: function(array) { return apply(array, 0, createMap, setMap); },
	      entries: function(array) { return entries(apply(array, 0, createMap, setMap), 0); },
	      key: function(d) { keys.push(d); return nest; },
	      sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
	      sortValues: function(order) { sortValues = order; return nest; },
	      rollup: function(f) { rollup = f; return nest; }
	    };
	  }

	  function createObject() {
	    return {};
	  }

	  function setObject(object, key, value) {
	    object[key] = value;
	  }

	  function createMap() {
	    return map();
	  }

	  function setMap(map, key, value) {
	    map.set(key, value);
	  }

	  function Set() {}

	  var proto = map.prototype;

	  Set.prototype = set.prototype = {
	    constructor: Set,
	    has: proto.has,
	    add: function(value) {
	      value += "";
	      this[prefix + value] = value;
	      return this;
	    },
	    remove: proto.remove,
	    clear: proto.clear,
	    values: proto.keys,
	    size: proto.size,
	    empty: proto.empty,
	    each: proto.each
	  };

	  function set(object, f) {
	    var set = new Set;

	    // Copy constructor.
	    if (object instanceof Set) object.each(function(value) { set.add(value); });

	    // Otherwise, assume it’s an array.
	    else if (object) {
	      var i = -1, n = object.length;
	      if (f == null) while (++i < n) set.add(object[i]);
	      else while (++i < n) set.add(f(object[i], i, object));
	    }

	    return set;
	  }

	  function keys(map) {
	    var keys = [];
	    for (var key in map) keys.push(key);
	    return keys;
	  }

	  function values(map) {
	    var values = [];
	    for (var key in map) values.push(map[key]);
	    return values;
	  }

	  function entries(map) {
	    var entries = [];
	    for (var key in map) entries.push({key: key, value: map[key]});
	    return entries;
	  }

	  exports.nest = nest;
	  exports.set = set;
	  exports.map = map;
	  exports.keys = keys;
	  exports.values = values;
	  exports.entries = entries;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-array/ Version 1.0.0. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function ascending(a, b) {
	    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	  }

	  function bisector(compare) {
	    if (compare.length === 1) compare = ascendingComparator(compare);
	    return {
	      left: function(a, x, lo, hi) {
	        if (lo == null) lo = 0;
	        if (hi == null) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) < 0) lo = mid + 1;
	          else hi = mid;
	        }
	        return lo;
	      },
	      right: function(a, x, lo, hi) {
	        if (lo == null) lo = 0;
	        if (hi == null) hi = a.length;
	        while (lo < hi) {
	          var mid = lo + hi >>> 1;
	          if (compare(a[mid], x) > 0) hi = mid;
	          else lo = mid + 1;
	        }
	        return lo;
	      }
	    };
	  }

	  function ascendingComparator(f) {
	    return function(d, x) {
	      return ascending(f(d), x);
	    };
	  }

	  var ascendingBisect = bisector(ascending);
	  var bisectRight = ascendingBisect.right;
	  var bisectLeft = ascendingBisect.left;

	  function descending(a, b) {
	    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
	  }

	  function number(x) {
	    return x === null ? NaN : +x;
	  }

	  function variance(array, f) {
	    var n = array.length,
	        m = 0,
	        a,
	        d,
	        s = 0,
	        i = -1,
	        j = 0;

	    if (f == null) {
	      while (++i < n) {
	        if (!isNaN(a = number(array[i]))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }

	    else {
	      while (++i < n) {
	        if (!isNaN(a = number(f(array[i], i, array)))) {
	          d = a - m;
	          m += d / ++j;
	          s += d * (a - m);
	        }
	      }
	    }

	    if (j > 1) return s / (j - 1);
	  }

	  function deviation(array, f) {
	    var v = variance(array, f);
	    return v ? Math.sqrt(v) : v;
	  }

	  function extent(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b,
	        c;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
	      while (++i < n) if ((b = array[i]) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = c = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null) {
	        if (a > b) a = b;
	        if (c < b) c = b;
	      }
	    }

	    return [a, c];
	  }

	  var array = Array.prototype;

	  var slice = array.slice;
	  var map = array.map;

	  function constant(x) {
	    return function() {
	      return x;
	    };
	  }

	  function identity(x) {
	    return x;
	  }

	  function range(start, stop, step) {
	    start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

	    var i = -1,
	        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	        range = new Array(n);

	    while (++i < n) {
	      range[i] = start + i * step;
	    }

	    return range;
	  }

	  var e10 = Math.sqrt(50);
	  var e5 = Math.sqrt(10);
	  var e2 = Math.sqrt(2);
	  function ticks(start, stop, count) {
	    var step = tickStep(start, stop, count);
	    return range(
	      Math.ceil(start / step) * step,
	      Math.floor(stop / step) * step + step / 2, // inclusive
	      step
	    );
	  }

	  function tickStep(start, stop, count) {
	    var step0 = Math.abs(stop - start) / Math.max(0, count),
	        step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	        error = step0 / step1;
	    if (error >= e10) step1 *= 10;
	    else if (error >= e5) step1 *= 5;
	    else if (error >= e2) step1 *= 2;
	    return stop < start ? -step1 : step1;
	  }

	  function sturges(values) {
	    return Math.ceil(Math.log(values.length) / Math.LN2) + 1;
	  }

	  function histogram() {
	    var value = identity,
	        domain = extent,
	        threshold = sturges;

	    function histogram(data) {
	      var i,
	          n = data.length,
	          x,
	          values = new Array(n);

	      for (i = 0; i < n; ++i) {
	        values[i] = value(data[i], i, data);
	      }

	      var xz = domain(values),
	          x0 = xz[0],
	          x1 = xz[1],
	          tz = threshold(values, x0, x1);

	      // Convert number of thresholds into uniform thresholds.
	      if (!Array.isArray(tz)) tz = ticks(x0, x1, tz);

	      // Remove any thresholds outside the domain.
	      var m = tz.length;
	      while (tz[0] <= x0) tz.shift(), --m;
	      while (tz[m - 1] >= x1) tz.pop(), --m;

	      var bins = new Array(m + 1),
	          bin;

	      // Initialize bins.
	      for (i = 0; i <= m; ++i) {
	        bin = bins[i] = [];
	        bin.x0 = i > 0 ? tz[i - 1] : x0;
	        bin.x1 = i < m ? tz[i] : x1;
	      }

	      // Assign data to bins by value, ignoring any outside the domain.
	      for (i = 0; i < n; ++i) {
	        x = values[i];
	        if (x0 <= x && x <= x1) {
	          bins[bisectRight(tz, x, 0, m)].push(data[i]);
	        }
	      }

	      return bins;
	    }

	    histogram.value = function(_) {
	      return arguments.length ? (value = typeof _ === "function" ? _ : constant(_), histogram) : value;
	    };

	    histogram.domain = function(_) {
	      return arguments.length ? (domain = typeof _ === "function" ? _ : constant([_[0], _[1]]), histogram) : domain;
	    };

	    histogram.thresholds = function(_) {
	      return arguments.length ? (threshold = typeof _ === "function" ? _ : Array.isArray(_) ? constant(slice.call(_)) : constant(_), histogram) : threshold;
	    };

	    return histogram;
	  }

	  function quantile(array, p, f) {
	    if (f == null) f = number;
	    if (!(n = array.length)) return;
	    if ((p = +p) <= 0 || n < 2) return +f(array[0], 0, array);
	    if (p >= 1) return +f(array[n - 1], n - 1, array);
	    var n,
	        h = (n - 1) * p,
	        i = Math.floor(h),
	        a = +f(array[i], i, array),
	        b = +f(array[i + 1], i + 1, array);
	    return a + (b - a) * (h - i);
	  }

	  function freedmanDiaconis(values, min, max) {
	    values = map.call(values, number).sort(ascending);
	    return Math.ceil((max - min) / (2 * (quantile(values, 0.75) - quantile(values, 0.25)) * Math.pow(values.length, -1 / 3)));
	  }

	  function scott(values, min, max) {
	    return Math.ceil((max - min) / (3.5 * deviation(values) * Math.pow(values.length, -1 / 3)));
	  }

	  function max(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
	    }

	    return a;
	  }

	  function mean(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1,
	        j = n;

	    if (f == null) {
	      while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
	    }

	    else {
	      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) s += a; else --j;
	    }

	    if (j) return s / j;
	  }

	  function median(array, f) {
	    var numbers = [],
	        n = array.length,
	        a,
	        i = -1;

	    if (f == null) {
	      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
	    }

	    else {
	      while (++i < n) if (!isNaN(a = number(f(array[i], i, array)))) numbers.push(a);
	    }

	    return quantile(numbers.sort(ascending), 0.5);
	  }

	  function merge(arrays) {
	    var n = arrays.length,
	        m,
	        i = -1,
	        j = 0,
	        merged,
	        array;

	    while (++i < n) j += arrays[i].length;
	    merged = new Array(j);

	    while (--n >= 0) {
	      array = arrays[n];
	      m = array.length;
	      while (--m >= 0) {
	        merged[--j] = array[m];
	      }
	    }

	    return merged;
	  }

	  function min(array, f) {
	    var i = -1,
	        n = array.length,
	        a,
	        b;

	    if (f == null) {
	      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
	    }

	    else {
	      while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
	      while (++i < n) if ((b = f(array[i], i, array)) != null && a > b) a = b;
	    }

	    return a;
	  }

	  function pairs(array) {
	    var i = 0, n = array.length - 1, p = array[0], pairs = new Array(n < 0 ? 0 : n);
	    while (i < n) pairs[i] = [p, p = array[++i]];
	    return pairs;
	  }

	  function permute(array, indexes) {
	    var i = indexes.length, permutes = new Array(i);
	    while (i--) permutes[i] = array[indexes[i]];
	    return permutes;
	  }

	  function scan(array, compare) {
	    if (!(n = array.length)) return;
	    var i = 0,
	        n,
	        j = 0,
	        xi,
	        xj = array[j];

	    if (!compare) compare = ascending;

	    while (++i < n) if (compare(xi = array[i], xj) < 0 || compare(xj, xj) !== 0) xj = xi, j = i;

	    if (compare(xj, xj) === 0) return j;
	  }

	  function shuffle(array, i0, i1) {
	    var m = (i1 == null ? array.length : i1) - (i0 = i0 == null ? 0 : +i0),
	        t,
	        i;

	    while (m) {
	      i = Math.random() * m-- | 0;
	      t = array[m + i0];
	      array[m + i0] = array[i + i0];
	      array[i + i0] = t;
	    }

	    return array;
	  }

	  function sum(array, f) {
	    var s = 0,
	        n = array.length,
	        a,
	        i = -1;

	    if (f == null) {
	      while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
	    }

	    else {
	      while (++i < n) if (a = +f(array[i], i, array)) s += a;
	    }

	    return s;
	  }

	  function transpose(matrix) {
	    if (!(n = matrix.length)) return [];
	    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
	      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
	        row[j] = matrix[j][i];
	      }
	    }
	    return transpose;
	  }

	  function length(d) {
	    return d.length;
	  }

	  function zip() {
	    return transpose(arguments);
	  }

	  exports.bisect = bisectRight;
	  exports.bisectRight = bisectRight;
	  exports.bisectLeft = bisectLeft;
	  exports.ascending = ascending;
	  exports.bisector = bisector;
	  exports.descending = descending;
	  exports.deviation = deviation;
	  exports.extent = extent;
	  exports.histogram = histogram;
	  exports.thresholdFreedmanDiaconis = freedmanDiaconis;
	  exports.thresholdScott = scott;
	  exports.thresholdSturges = sturges;
	  exports.max = max;
	  exports.mean = mean;
	  exports.median = median;
	  exports.merge = merge;
	  exports.min = min;
	  exports.pairs = pairs;
	  exports.permute = permute;
	  exports.quantile = quantile;
	  exports.range = range;
	  exports.scan = scan;
	  exports.shuffle = shuffle;
	  exports.sum = sum;
	  exports.ticks = ticks;
	  exports.tickStep = tickStep;
	  exports.transpose = transpose;
	  exports.variance = variance;
	  exports.zip = zip;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	const d3r = __webpack_require__(7);
	const d3a = __webpack_require__(5);

	const lorem = [
	  'Lorem ipsum dolor sit amet, in eos dolor essent, ea esse ridens efficiantur eam. Ne choro salutatus disputando mei. Ei virtute eruditi duo? Euismod maiestatis ex eum! Vel id elitr prodesset, an eos mazim labores admodum.',
	  'Incorrupte neglegentur mel ei, vim errem liberavisse ex, usu ex enim veri menandri! Est nihil deterruisset ne. Alia illud volutpat eam no, mei cu graeci molestie. Sea at verear meliore, pro legere graeci ea, singulis accusata no pri?',
	  'At sale dicunt signiferumque mea. Mei porro noster splendide et, et eam dolorum debitis. Ne recteque moderatius duo, iuvaret nonumes vocibus et nam, legimus percipitur sit no. An usu expetenda instructior, error utinam aperiam et per. Natum expetenda maluisset sit te, sumo accusamus iracundia et vix.',
	  'Expetenda constituto nec et, vix affert fabellas scripserit ad? Mea alienum oportere ex, sea ea saepe vocibus praesent, adhuc velit verterem cum te. Salutatus corrumpit repudiare pro ex. Cu hinc concludaturque cum, nec ea primis omnesque? At errem fabulas ius! Oportere maiestatis repudiandae eam ea.',
	  'Vim te populo veritus adversarium, his habemus gubergren pertinacia et? Quo suas novum corrumpit et, partiendo conceptam an pri, laoreet neglegentur an sit? Vivendum vituperatoribus ut per. Eu nec sonet lobortis facilisis, pro ignota numquam ad. Nominati periculis ut nec, movet mundi usu te, nec meis exerci ut. Vis alia ipsum hendrerit ea.',
	  'Mel blandit mandamus sadipscing ea! Dicam labores vel ei, eam fuisset voluptatibus ea! Eam meis saepe posidonium ad, falli postea eum ex? Pri te labores probatus, vel ad etiam falli laudem, ex autem modus detraxit ius! Per esse malis debet ea, ei eum epicurei efficiendi!',
	  'Eam ut quot latine vidisse. His et utinam tincidunt signiferumque, ad inciderint persequeris has, ius habeo idque constituam ea. Cu natum omnes cum. Mea ferri minim ex. Mel erat dicta inciderint in, cu tota primis pri? Nam in putent tamquam voluptatum, omnium sanctus evertitur te vix.',
	  'Sit ne omnes volumus vituperatoribus! Sed ignota debitis eligendi ad. Per eu adhuc verear. Et malis consequuntur has, has sale dicat veniam te, nominati abhorreant usu ut. Cum unum postulant id, et purto virtute fuisset est. Vix laudem mandamus ex. Ius ea veri aperiri, impedit constituam omittantur eum ne!',
	  'Illud aeterno probatus mea no, clita persequeris delicatissimi et sea! Has tale minimum eloquentiam ex, munere dignissim intellegat eu nam! Nullam minimum luptatum ne usu, quo at partem similique pertinacia? Ius doctus discere accumsan no, duo natum imperdiet deterruisset eu. Labore expetenda omittantur ut mea, et ius sumo nobis deserunt.',
	  'Ei vituperata deterruisset his. Nec aperiri propriae ei, euismod appetere corrumpit vis te? Quo agam affert utinam ex. Id quo malis iriure?',
	  'Natum nemore fabulas ne eos, cu sed propriae probatus complectitur! Cum altera probatus patrioque ne. An tota probo altera nam. Modo clita at eos! Cu justo dicam per, eos prompta propriae offendit no. Sit an solum mandamus?',
	  'Vis id timeam civibus gloriatur, vidisse sadipscing duo id. Etiam impedit eu mei, nam te viderer sadipscing. Sed id copiosae percipit? Fugit definiebas vix at, ex usu movet putant temporibus, vis velit molestiae et. Modo impedit id sed, ludus iisque feugait duo et. Illud aperiam oportere et has, soleat fabulas imperdiet pro in, sed virtute aliquid ei. Vivendo tacimates sadipscing ne sit, eos no quando detraxit mediocrem, at rebum falli eos?',
	  'Et libris similique mei, vim propriae constituto te, ut vel etiam qualisque. Eum error graeci ea. Ex pro homero detraxit, sit ne detraxit qualisque splendide. Eripuit eleifend instructior in vix, ex eum dolorem denique luptatum, sed case tibique ne? Ad sea viderer maluisset interesset.',
	  'Option scribentur pro at, mandamus sapientem per eu. Mel dicat saperet inermis in, vidisse tritani recteque ea per. Prompta omittam suavitate sit eu? Possit doctus corrumpit sit et!',
	  'Patrioque scribentur at est, et usu illum regione apeirian? Eu nam dolor sadipscing, vix ei alia scaevola. Ad euismod voluptua sit, eros modus vis ei. Movet platonem ad per.',
	  'Modo option sed ne, vix an tota luptatum expetenda, an per appetere comprehensam? Quis novum temporibus ei his, quo dico quodsi te. Sed an constituto posidonium, quo et affert aliquip. Nullam civibus no quo, usu alterum sadipscing consectetuer ei, mei te aliquam perpetua. Summo saepe ne ius.',
	  'Ea vix nibh salutatus contentiones, quando assentior eam eu, id duis oportere pri. Ad eam mucius efficiendi. Enim mnesarchum ex nam, vel aeterno tacimates vulputate te! Melius oporteat tincidunt sit cu. Vitae doctus labitur ne sea, ei suas oratio commodo mei.',
	  'Nam ea harum rationibus, viris invidunt facilisi nec at! Tamquam eruditi insolens an his, ad vix magna saepe tacimates, prima quando aliquip an cum. Per ne inermis feugait, in tritani viderer atomorum vis, ad fabellas detraxit sed. Tale ipsum ut pri, summo atomorum repudiandae at eos, usu homero interesset adversarium ea. Omnes vocibus cum ad, pri nemore integre ullamcorper cu, has in alia tempor perfecto. Qui choro discere splendide ut? Usu utroque dolorem urbanitas ad, nostrud luptatum id nam.',
	  'Pri audire viderer elaboraret te! Omnis prima mollis sit ne. Ex per case fabulas deseruisse, an saepe docendi eos, et has clita omittam. Tollit option mediocritatem per an, ad quod moderatius mei, repudiare dissentias pri cu. Qui nihil epicuri appellantur et, no equidem forensibus est.',
	  'Inani molestie vim et, sed in sonet option fierent. Has id habemus definiebas, sumo putant debitis id duo? Ex dicat zril altera has, est omnium recusabo persequeris ea. Cu sint libris volumus vel. Odio rationibus voluptatibus an eos, mel melius scripta at. Nec laoreet ocurreret instructior ex, ex pri dolor possit.',
	]; // lorem

	const statuses = ['Critical', 'Warning', 'Info', 'OK', 'Timeout', 'Invalid'];

	const wordlist = [
	  'abidingly', 'acapnia', 'accorder', 'accra', 'acerbate', 'acescency',
	  'acidy', 'adena', 'adenoidal', 'adfreeze', 'admission', 'advise', 'aeon',
	  'aeriferous', 'aerodonetic', 'aerophone', 'afghani', 'agave', 'aglycone',
	  'aigret', 'aim', 'aircraft', 'airlight', 'alack', 'albedo', 'alclad',
	  'alienable', 'allogenic', 'allured', 'almous', 'alternating', 'amati',
	  'ameiotic', 'amin', 'amis', 'ammophilous', 'amphictyon', 'amtrack',
	  'analogously', 'analyzable', 'anarchism', 'anastigmat', 'androgamone',
	  'anemone', 'animalculum', 'anisomerous', 'anorectous', 'anyone', 'aortal',
	  'apices', 'aplanospore', 'aportlast', 'appendicle', 'appertain', 'apposite',
	  'approvedly', 'arab', 'arcangelo', 'armary', 'arrogant', 'arrowless',
	  'arthrectomy', 'ashburn', 'ashikaga', 'asir', 'assidean', 'assuaged',
	  'astatically', 'aswampish', 'ating', 'atm', 'atry', 'attend', 'aural',
	  'autoicous', 'averagely', 'avestan', 'awing', 'awninged', 'azaa',
	  'aznavour', 'baalshem', 'backcomb', 'backfield', 'backgammon', 'backing',
	  'backs', 'bagios', 'baptism', 'barelegged', 'baresthesia', 'barrow', 'barth',
	  'bartley', 'bassetts', 'bath', 'baton', 'beal', 'beatable', 'beatty',
	  'beautifier', 'bebryces', 'becker', 'beclasp', 'becripple', 'begrudge',
	  'bely', 'bendel', 'benvenuto', 'beryl', 'bestiaries', 'bias', 'bichat',
	  'billycan', 'biota', 'biotype', 'bipack', 'bipartitely', 'bipyramid',
	  'birdied', 'bjneborg', 'blackballer', 'blackstone', 'blameful', 'blindfish',
	  'blottingly', 'bluepoint', 'bondage', 'bookkeeper', 'boots', 'boreas',
	  'borty', 'boyne', 'bradbury', 'brazilite', 'bregma', 'breloque', 'brendel',
	  'brinishness', 'brisance', 'broughtas', 'bulleted', 'bullfrog', 'bung',
	  'burghley', 'butcheries', 'butes', 'calfskin', 'canaletto', 'canalize',
	  'canara', 'candie', 'canorously', 'capability', 'capt', 'carbonic',
	  'carburettor', 'cardiology', 'carnify', 'carrol', 'cartist', 'cascading',
	  'castelli', 'casus', 'caudal', 'cellularly', 'champers', 'chancel',
	  'chanciest', 'chaprasi', 'chasidism', 'cheatable', 'chempaduk', 'child',
	  'chinaberry', 'chloette', 'cincinnati', 'cinereous', 'citruses', 'claremont',
	  'cleodaeus', 'clericalism', 'cletus', 'clink', 'cloque', 'coadunate',
	  'cochin', 'coded', 'coelomate', 'colluding', 'colonel', 'compigne',
	  'composition', 'confusional', 'consolute', 'containable', 'contumacity',
	  'convexity', 'coparcener', 'copernicus', 'cornstalk', 'corruptedly', 'corti',
	  'cortisol', 'cosimo', 'cotype', 'cowage', 'craftiest', 'crewel', 'criolla',
	  'crowded', 'crumply', 'cruzeiros', 'cryptically', 'crystaling', 'cubbish',
	  'culpa', 'culver', 'curityba', 'currier', 'curtilage', 'cute', 'czaristic',
	  'damara', 'dancette', 'dcollet', 'dealership', 'decadrachm', 'decembrist',
	  'deciduitis', 'declaratory', 'declared', 'defeminize', 'deletion',
	  'demivierge', 'denarii', 'dens', 'deprecate', 'deutschland', 'devilwood',
	  'dextrose', 'dialogize', 'diane', 'diatom', 'didrikson', 'dies', 'digresser',
	  'discalced', 'distensile', 'diyarbekir', 'djellabah', 'dobbin', 'doggone',
	  'dogmatizer', 'doha', 'domenick', 'dominium', 'doubtlessly', 'douppioni',
	  'dowie', 'dowiness', 'downing', 'drawknife', 'drench', 'driveler', 'driving',
	  'droving', 'dukhobors', 'duodena', 'durzi', 'dysphemia', 'dyspnoic',
	  'earthiest', 'ecthymatous', 'edaphon', 'effacer', 'effective', 'effects',
	  'effusively', 'egoism', 'egregiously', 'elastoplast', 'elegiacal', 'elman',
	  'embarred', 'endoenzyme', 'endogenesis', 'endoplasmic', 'engorged', 'ennui',
	  'epineuria', 'epitome', 'equalising', 'equipping', 'erebus', 'escribing',
	  'estivated', 'estremadura', 'estuarine', 'ethane', 'ethos', 'etzel',
	  'eviction', 'excitedness', 'excusively', 'execute', 'exogenously',
	  'exorbitance', 'exordial', 'explicator', 'extenuatory', 'extinguish',
	  'eyass', 'fad', 'fadge', 'falcon', 'falterer', 'farcical', 'fatimite',
	  'femininity', 'fenagler', 'fiddlededee', 'filamented', 'fils', 'finesse',
	  'fitment', 'fivepenny', 'flaw', 'fogless', 'forasmuch', 'forcipate',
	  'formaliser', 'foxed', 'freeborn', 'freyr', 'fromentin', 'fuckwit',
	  'furfuran', 'furtiveness', 'galet', 'galloglass', 'gannister', 'gastrotrich',
	  'gaugeable', 'gehenna', 'genre', 'genteelness', 'gentlefolks', 'germfree',
	  'germfree', 'ghazzah', 'ghebre', 'gina', 'gipseian', 'glossmeter',
	  'glycocoll', 'gonfalon', 'graverobber', 'gresham', 'grewsome', 'greynville',
	  'griege', 'griffinhood', 'groggery', 'grubstaker', 'gruenberg', 'grumphy',
	  'guarantying', 'guesthouses', 'gunmanship', 'gunned', 'halite', 'hallel',
	  'hamperedly', 'handsomeish', 'harridan', 'hasselt', 'haustorial',
	  'heathiest', 'heliography', 'hellbent', 'heller', 'herborize', 'heritable',
	  'hermiston', 'hesitating', 'hetairai', 'hetmanate', 'hexaplaric', 'hexapod',
	  'hexose', 'hitherward', 'hogan', 'holophyte', 'hopper', 'hoquiam',
	  'horrified', 'horseplayer', 'hostship', 'hotter', 'hovelling', 'hsian',
	  'hullaballoo', 'humpiest', 'hunger', 'hunlike', 'hypersomnia', 'hypertragic',
	  'icecap', 'ichthyornis', 'ideologise', 'idoism', 'idolatrise', 'illumed',
	  'ilmen', 'imbedding', 'imbuement', 'impecunious', 'impudence', 'inapt',
	  'incomplete', 'indienne', 'indirect', 'inedible', 'ineffably', 'inevasible',
	  'infraction', 'infrangibly', 'ingot', 'ingrowth', 'innovator', 'instigate',
	  'insulator', 'intercreate', 'intermittor', 'intervaried', 'intonation',
	  'intrinsic', 'iodin', 'islandlike', 'islandlike', 'isograph', 'isokeraunic',
	  'isometrical', 'issachar', 'istana', 'jacopo', 'jacquemart', 'janitorial',
	  'jazzman', 'jean', 'jehovist', 'jejunity', 'jeris', 'jet', 'joab',
	  'joyousness', 'jurisp', 'kadi', 'kafiristan', 'kantar', 'karlstad', 'keeno',
	  'kemp', 'keyway', 'kibosh', 'kildare', 'kilmarnock', 'kilovolt', 'kimonoed',
	  'kirkenes', 'knckebrd', 'knucklebone', 'kokobeh', 'kozlov', 'kurbash',
	  'laburnum', 'lagerkvist', 'lair', 'laminated', 'landslip', 'lanett',
	  'language', 'languor', 'lanuginose', 'lapwing', 'lat', 'lathe', 'lawbook',
	  'leachable', 'leadville', 'lecturer', 'legwork', 'lehighton', 'libra',
	  'libretto', 'lichenism', 'lightwood', 'limens', 'litho', 'litholapaxy',
	  'litter', 'locrus', 'logogriph', 'lohrmann', 'lonesome', 'looie', 'lordotic',
	  'loveably', 'lovelock', 'lucania', 'luke', 'lyncher', 'magellan',
	  'magnified', 'malraux', 'maltreat', 'manicotti', 'manutius', 'manway',
	  'margaritic', 'marmax', 'married', 'maryanne', 'materialize', 'matureness',
	  'mccormick', 'measly', 'med', 'medallic', 'megalopsia', 'megger',
	  'melanochroi', 'melioration', 'melodrama', 'menyie', 'meow', 'mercurius',
	  'meridianii', 'messene', 'metamere', 'mexico', 'mignon', 'military',
	  'milkmaid', 'milliard', 'millimole', 'milliohm', 'minhow', 'miracidia',
	  'miraflores', 'misthrow', 'mobbist', 'monadically', 'monkfish',
	  'monochasium', 'monochrome', 'mononuclear', 'monotron', 'monseigneur',
	  'monument', 'morphologic', 'mot', 'msl', 'mullocky', 'musagetes', 'museful',
	  'mythopoeist', 'nanism', 'nanterre', 'narrated', 'net', 'neumster',
	  'neurocoel', 'neuter', 'nguni', 'nibs', 'nicolaus', 'nig', 'noisiness',
	  'nondeported', 'nonoverhead', 'nonpause', 'nonpersonal', 'nonpremium',
	  'nonrelease', 'nonsalutary', 'nonselected', 'nord', 'nubbly', 'num',
	  'numerously', 'nummulite', 'nurl', 'nymphaeum', 'nymphean', 'obafemi',
	  'octonaries', 'odovacar', 'oil', 'okinesis', 'oliguria', 'onion', 'ontario',
	  'oont', 'orbit', 'organized', 'organizer', 'orogenic', 'orphan', 'oscar',
	  'outbragging', 'outgrown', 'outrapped', 'outscorn', 'outsumming', 'outworn',
	  'overbuying', 'overelegant', 'overgrowth', 'overhappy', 'overinvolve',
	  'overlaid', 'overproved', 'ovular', 'oxydation', 'oyes', 'pact',
	  'palladizing', 'pally', 'panfrying', 'pannier', 'pannonia', 'pantelleria',
	  'paperbound', 'parapodial', 'pastoralism', 'patriarchal', 'pause', 'pav',
	  'peacockism', 'pearlite', 'pekin', 'pennaceous', 'pentagon', 'peopleless',
	  'pericycle', 'peritrichic', 'peshawar', 'peskiest', 'pest', 'petiolate',
	  'petition', 'petrifiable', 'phenylene', 'phonotypist', 'phosphorate',
	  'photofit', 'phthia', 'pian', 'pianist', 'pica', 'pick', 'pilsner',
	  'pinguidity', 'planetary', 'plasmodesma', 'plummy', 'pocky', 'poof',
	  'porthole', 'postillion', 'posturising', 'powdove', 'praesepe', 'preamble',
	  'precensure', 'preclothing', 'preendorser', 'prehnite', 'preimpress',
	  'preliberate', 'premenaced', 'premonition', 'prenoting', 'prepublish',
	  'prepurchase', 'prerefining', 'prerequire', 'pretaught', 'preventoria',
	  'previsit', 'prim', 'proboxing', 'prohibiter', 'propacifism', 'proprietor',
	  'prose', 'proteolytic', 'protrude', 'pteridology', 'purdah', 'puritanism',
	  'pushto', 'putrescible', 'pyometra', 'pythoness', 'quaffer', 'quantitive',
	  'questioning', 'quinoxalin', 'qungur', 'quorum', 'racemize', 'radioed',
	  'radiologic', 'ragtag', 'ramanujan', 'ramous', 'rancher', 'rasing', 'ratio',
	  'reagitating', 'reckoner', 'reclimbing', 'recognitive', 'recoin',
	  'reconciler', 'recondense', 'redebated', 'redirect', 'reemerging',
	  'reencounter', 'reenjoin', 'reformedly', 'refutably', 'regina', 'reignited',
	  'reindorsed', 'reinstitute', 'reliantly', 'remissively', 'remix', 'remolade',
	  'reparative', 'replotting', 'reproval', 'researchist', 'reseda', 'resoak',
	  'responsory', 'restore', 'restorer', 'resumed', 'reswept', 'retwine',
	  'revealedly', 'revetoed', 'revoyaging', 'rewax', 'rhd', 'ride', 'rightness',
	  'rightwards', 'rode', 'romany', 'rompers', 'roscommon', 'roundabout', 'rpm',
	  'rutting', 'sagamore', 'sagger', 'sailoring', 'salade', 'salvator',
	  'sawhorse', 'scarlatina', 'scattered', 'scheiner', 'scholarship',
	  'scholiast', 'scioto', 'scofflaw', 'scrabbler', 'sedile', 'seductive',
	  'seedier', 'selfishness', 'semidefined', 'seminary', 'setting', 'setulose',
	  'shabbiness', 'shahdom', 'sharpfroze', 'sharpfroze', 'sheepdog', 'sheerness',
	  'shenandoah', 'shinily', 'shintoistic', 'sialagogue', 'sialoid', 'simba',
	  'simplified', 'sixthly', 'skidway', 'skylined', 'slimmest', 'smithsonite',
	  'smoke', 'smokiest', 'snarler', 'snootiness', 'solemnness', 'solidified',
	  'somebody', 'sonnetising', 'sorcerer', 'soter', 'southwest', 'spatchcock',
	  'sphagnum', 'sphincter', 'spiegel', 'spiflicated', 'spillikin', 'sporocarp',
	  'squarishly', 'squarrose', 'squeegeed', 'squeegeeing', 'squishier', 'stab',
	  'stabilizing', 'statical', 'staving', 'steger', 'stetted', 'stodge',
	  'stoniest', 'strasberg', 'stressfully', 'striges', 'strive', 'struma',
	  'stumble', 'stunt', 'subacromial', 'subdermal', 'subflora', 'subform',
	  'subglottic', 'subhatchery', 'submaid', 'subsect', 'subside', 'suctoria',
	  'suggestibly', 'sunset', 'supercredit', 'suppuration', 'sur', 'surge',
	  'suspicious', 'swale', 'sward', 'swinge', 'syllabaries', 'syntactic',
	  'tabby', 'tabulation', 'tact', 'tahopped', 'tailored', 'tannish', 'tarentum',
	  'tartarizing', 'tasty', 'telega', 'teleostean', 'tenfold', 'thegnly', 'then',
	  'theurgical', 'thia', 'threadless', 'tibur', 'toilsomely', 'toledo',
	  'tonality', 'totalling', 'touchmark', 'toughie', 'towardly', 'traceless',
	  'trailboard', 'tranship', 'traveled', 'traveling', 'travestied', 'trenton',
	  'trouvre', 'tsaritsyn', 'tularaemic', 'tundish', 'tungusic', 'tupelo',
	  'turanian', 'turbanless', 'turnoff', 'turquois', 'tutsan', 'tweed', 'tzar',
	  'ulema', 'uller', 'unaccusing', 'unawkward', 'unbendable', 'unbigamous',
	  'unbrutize', 'unbumped', 'unchancy', 'uncherished', 'under', 'undergirth',
	  'underlie', 'underpeep', 'understress', 'undervoice', 'unexponible',
	  'unfired', 'unfoliaged', 'unforward', 'unfrilly', 'unhanged', 'unimitated',
	  'unintruded', 'unknit', 'unlaughing', 'unloose', 'unmammalian',
	  'unmandatory', 'unmelodious', 'unopulent', 'unpeaceable', 'unprovided',
	  'unreceptive', 'unreckoned', 'unsignalled', 'unsmoked', 'unsnaky',
	  'unstatistic', 'unstep', 'unstitching', 'unstriving', 'untaloned',
	  'unurging', 'unvented', 'unvivified', 'utterness', 'varactor', 'vatic',
	  'velleity', 'velodrome', 'veritably', 'vexilla', 'victrices', 'victualling',
	  'vide', 'viewiest', 'virulently', 'visualizing', 'vitamin', 'vitamine',
	  'viticulture', 'vocalist', 'volatilizer', 'volumetric', 'waaf',
	  'waspishness', 'weighting', 'whistly', 'whitening', 'wilderness', 'windaus',
	  'womb', 'wordsmith', 'wrapround', 'wreckfishes', 'yarest', 'yaupon', 'yeysk',
	  'zernike', 'zidkijah', 'zincified', 'zoisite', 'zone', 'zoomorphism',
	  'zootomy',
	]; // wordlist

	module.exports = class Random {

	  static copyObject(obj) {
	    return JSON.parse(JSON.stringify(obj));
	  } // copyObject

	  static intBetween(min, max) {
	    return Math.round(d3r.randomUniform(min, max)());
	  } // intBetween

	  /**
	   * Returns some "Lorem ipsum..." text (random number of sentences).
	   */
	  static messageBody() {
	    const n = d3a.min([8, this.intBetween(1, lorem.length)]);
	    return lorem.slice(0, n).join(' ');
	  } // messageBody

	  /**
	   * Returns a random string of 0 to 5 alphanumeric characters.
	   */
	  static messageCode() {
	    return this.word().substring(0, 5);
	  } // messageCode

	  /**
	   * Random-ish... but with a boost to "OK" status.
	   */
	  static status() {
	    return statuses[this.intBetween(0, statuses.length + 3)] || 'OK';
	  } // status

	  /**
	   * Updates the specified sample:
	   *  - messageBody (a "Lorem ipsum..." string)
	   *  - messageCode (random string from 0 to 5 characters in length)
	   *  - status (random status, not tied to value)
	   *  - statusChangedAt (timestamp, only updated if the new status is different
	   *    from the previous status)
	   *  - updatedAt (timestamp)
	   *  - value (random number, not tied to status even though it is in real
	   *    life)
	   */
	  static updateSample(sample) {
	    const s = this.copyObject(sample);
	    s.messageBody = this.messageBody();
	    s.messageCode = this.messageCode();
	    s.previousStatus = s.status;
	    s.status = this.status();
	    s.updatedAt = new Date().toJSON();
	    s.value = this.value();
	    if (s.previousStatus !== s.status) {
	      s.statusChangedAt = s.updatedAt;
	    }
	    return s;
	  } // updateSample

	  static addSample(subject) {
	    const now = new Date().toJSON();
	    const aspectName = this.word();
	    return {
	      aspect: { name: aspectName },
	      messageBody: this.messageBody(),
	      messageCode: this.messageCode(),
	      name: subject.absolutePath + '|' + aspectName,
	      status: this.status(),
	      statusChangedAt: now,
	      subjectId: subject.id,
	      updatedAt: now,
	      value: this.value(),
	    };
	  } // addSample

	  /**
	   * For now, just update description and updatedAt.
	   */
	  static updateSubject(subject) {
	    const s = this.copyObject(subject);
	    s.description = s.description + ' [UPDATED]';
	    s.updatedAt = new Date().toJSON();
	    return s;
	  } // updateSubject

	  static addSubject(parentAbsolutePath) {
	    const now = new Date().toJSON();
	    const name = this.word();
	    const s = {
	      absolutePath: `${parentAbsolutePath}.${name}`,
	      description: this.messageBody(),
	      helpEmail: `${name}@foo.com`,
	      helpUrl: `http://${name}.foo.com`,
	      name,
	      updatedAt: now,
	    };
	    return s;
	  } // addSubject

	  static value() {
	    return this.intBetween(0, 100000);
	  } //value

	  static word() {
	    return wordlist[this.intBetween(0, wordlist.length - 1)] || '';
	  } // word

	}; // module.exports



/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// https://d3js.org/d3-random/ Version 1.0.0. Copyright 2016 Mike Bostock.
	(function (global, factory) {
	   true ? factory(exports) :
	  typeof define === 'function' && define.amd ? define(['exports'], factory) :
	  (factory((global.d3 = global.d3 || {})));
	}(this, function (exports) { 'use strict';

	  function uniform(min, max) {
	    min = min == null ? 0 : +min;
	    max = max == null ? 1 : +max;
	    if (arguments.length === 1) max = min, min = 0;
	    else max -= min;
	    return function() {
	      return Math.random() * max + min;
	    };
	  }

	  function normal(mu, sigma) {
	    var x, r;
	    mu = mu == null ? 0 : +mu;
	    sigma = sigma == null ? 1 : +sigma;
	    return function() {
	      var y;

	      // If available, use the second previously-generated uniform random.
	      if (x != null) y = x, x = null;

	      // Otherwise, generate a new x and y.
	      else do {
	        x = Math.random() * 2 - 1;
	        y = Math.random() * 2 - 1;
	        r = x * x + y * y;
	      } while (!r || r > 1);

	      return mu + sigma * y * Math.sqrt(-2 * Math.log(r) / r);
	    };
	  }

	  function logNormal() {
	    var randomNormal = normal.apply(this, arguments);
	    return function() {
	      return Math.exp(randomNormal());
	    };
	  }

	  function irwinHall(n) {
	    return function() {
	      for (var sum = 0, i = 0; i < n; ++i) sum += Math.random();
	      return sum;
	    };
	  }

	  function bates(n) {
	    var randomIrwinHall = irwinHall(n);
	    return function() {
	      return randomIrwinHall() / n;
	    };
	  }

	  function exponential(lambda) {
	    return function() {
	      return -Math.log(1 - Math.random()) / lambda;
	    };
	  }

	  exports.randomUniform = uniform;
	  exports.randomNormal = normal;
	  exports.randomLogNormal = logNormal;
	  exports.randomBates = bates;
	  exports.randomIrwinHall = irwinHall;
	  exports.randomExponential = exponential;

	  Object.defineProperty(exports, '__esModule', { value: true });

	}));

/***/ }
/******/ ]);