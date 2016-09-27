'use strict';
require('./lens.css');
// TODO implement me!
// Add any "require" statements to import modules here, e.g.:
//   const MyUtils = require('./MyUtils');
//   const d3 = require('./d3.v3.min');

const LENS_ELEMENT = document.getElementById('lens');

const realtimeChangeHandler = {
  onSampleAdd(sample) {
    console.log(new Date(), 'onSampleAdd', sample);
    // TODO implement me!
    // For example, you may need to preprocess and add this new sample to some
    // data structure.
  },
  onSampleRemove(sample) {
    console.log(new Date(), 'onSampleRemove', sample);
    // TODO implement me!
    // For example, you may need to preprocess and remove this sample from some
    // data structure.
  },
  onSampleUpdate(change) {
    console.log(new Date(), 'onSampleUpdate', change);
    // TODO implement me!
    // For example, you may need to preprocess and update this sample in some
    // data structure.
  },
  onSubjectAdd(subject) {
    console.log(new Date(), 'onSubjectAdd', subject);
    // TODO implement me!
    // For example, you may need to preprocess and add this new subject to some
    // data structure.
  },
  onSubjectRemove(subject) {
    console.log(new Date(), 'onSubjectRemove', subject);
    // TODO implement me!
    // For example, you may need to preprocess and remove this subject from
    // some data structure.
  },
  onSubjectUpdate(change) {
    console.log(new Date(), 'onSubjectUpdate', change);
    // TODO implement me!
    // For example, you may need to preprocess and update this subject in some
    // data structure.
  },
}; // realtimeChangeHandler

/**
 * It can be useful to separate out any data manipulation you need to do
 * before rendering--you want to keep the draw function as tight as possible!
 */
function preprocess(hierarchy) {
  console.log(new Date(), 'preprocessing hierarchy');
  // TODO implement me!
  // For example, you may want to manipulate the hierarchy and store it in
  // some data structure.
} // preprocess

/**
 * Perform your DOM manipulation here.
 */
function draw() {
  console.log(new Date(), 'drawing');
  // TODO implement me!
  // For example, you may want to generate DOM elements corresponding to each
  // subject and sample in some data structure.
} // draw

const eventTarget = {
  document: document,
  lens: LENS_ELEMENT,
  window: window,
};

/**
 * All the event handlers configured here will be registered on
 * refocus.lens.load.
 */
const eventHandler = {
  document: {
  },
  lens: {
    /**
     * Handle the refocus.lens.hierarchyLoad event. The hierarchy JSON is stored
     * in evt.detail. Preprocess the hierarchy if needed, then call draw.
     */
    'refocus.lens.hierarchyLoad': (evt) => {
      console.log(new Date(), '#lens => refocus.lens.hierarchyLoad');
      preprocess(evt.detail);
      draw();
    }, // refocus.lens.hierarchyLoad

    /**
     * Handle the refocus.lens.realtime.change event. The array of changes is
     * stored in evt.detail. Iterate over the array to perform any preprocessing
     * if needed, then call draw only once after all the data manipulation is
     * done.
     */
    'refocus.lens.realtime.change': (evt) => {
      console.log(new Date(), 'refocus.lens.realtime.change',
        'contains ' + evt.detail.length + ' changes');
      if (!Array.isArray(evt.detail) || evt.detail.length == 0) {
        return;
      }

      evt.detail.forEach((chg) => {
        if (chg['sample.add']) {
          realtimeChangeHandler.onSampleAdd(chg['sample.add'])
        } else if (chg['sample.remove']) {
          realtimeChangeHandler.onSampleRemove(chg['sample.remove'])
        } else if (chg['sample.update']) {
          realtimeChangeHandler.onSampleUpdate(chg['sample.update']);
        } else if (chg['subject.add']) {
          realtimeChangeHandler.onSubjectAdd(chg['subject.add'])
        } else if (chg['subject.remove']) {
          realtimeChangeHandler.onSubjectRemove(chg['subject.remove'])
        } else if (chg['subject.update']) {
          realtimeChangeHandler.onSubjectUpdate(chg['subject.update'])
        }
      }); // evt.detail.forEach

      // Now that we've processed all these changes, draw!
      draw();
    }, // refocus.lens.realtime.change
  },
  window: {
    /**
     * Handle when the browser/tab loses focus, e.g. user switches away from this
     * tab or browser is minimized or browser goes into background.
     */
    blur: () => {
      console.log(new Date(), 'window => blur');
      // TODO implement me!
    }, // blur

    /**
     * Handle when the browser/tab regains focus, e.g. user switches back to this
     * tab or browser is restored from minimized state or browser comes back into
     * foreground.
     */
    focus: () => {
      console.log(new Date(), 'window => focus');
      // TODO implement me!
    }, // focus

    /**
     * Handle when the fragment identifier of the URL has changed (the part of the
     * URL that follows the # symbol, including the # symbol).
     */
    hashchange: (evt) => {
      console.log(new Date(), 'window => hashchange',
        'oldURL=' + evt.oldURL, 'newURL=' + evt.newURL);
      // TODO implement me!
      // For example, if the fragment identifier is a subject or sample, you
      // may want to move focus to the DOM element representing that subject or
      // sample, or open the corresponding modal.
    }, // hashchange

    /**
     * Handle when the view has been resized.
     */
    resize: () => {
      console.log(new Date(), 'window => resize');
      // TODO implement me!
      // For example, you may want to show/hide/move/resize some DOM elements
      // based on the new viewport height and width.
    }, // resize
  },
}; // eventHandler

/*
 * Handle the load event. Register listeners for interesting window and lens
 * events here. This would also be a good place to render any DOM elements
 * which are not dependent on the hierarchy data (e.g. page header, page
 * footer, legend, etc.).
 */
LENS_ELEMENT.addEventListener('refocus.lens.load', () => {
  console.log(new Date(), '#lens => refocus.lens.load');

  // Register all the event listeners configured in eventHandler.
  Object.keys(eventHandler).forEach((target) => {
    Object.keys(eventHandler[target]).forEach((eventType) => {
      eventTarget[target].addEventListener(eventType, eventHandler[target][eventType]);
    });
  });

  // TODO implement me!
  // For example, you may want to render any DOM elements which are not
  // dependent on hierarchy data.
}); // "load" event listener
