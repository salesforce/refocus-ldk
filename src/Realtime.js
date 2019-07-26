/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Realtime.js
 *
 * This module controls how the LDK dispatches realtime events to the lens.
 */
'use strict';
const d3c = require('d3-collection');
const d3a = require('d3-array');
const Random = require('./Random');

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
