/**
 * This is the main entry point for the lens. When you compile and build the
 * lens using the LDK, webpack generates a single file which has all the
 * external modules built right in--you can read more about webpack at
 * https://webpack.github.io/.
 */

/*
 * Curious about why we 'use strict'? Check out 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode.
 */
'use strict'; 

/*
 * Load other modules, stylesheets, templates, etc. using "require(...)".
 *
 * We recommend putting external libraries into the ./lib directory. For
 * example, if you needed jquery in your lens, you could add the (minified)
 * javascript file under the ./lib directory then load it here, like this:
 *
 *   require('./lib/jquery-3.1.1.min');
 *
 * Note that you don't need to include the ".js" suffix in your "require"
 * command for javascript files.
 */
require('./lens.css');

/*
 * We use handlebars for templates--you can read more about handlebars at
 * http://handlebarsjs.com/.
 */
const handlebars = require('handlebars-template-loader/runtime');
const loadingTemplate = require('./template/loading.handlebars');
const mainTemplate = require('./template/main.handlebars');
handlebars.registerPartial('subject',
  require('./template/subject.handlebars'));
handlebars.registerPartial('aspect', require('./template/aspect.handlebars'));
handlebars.registerPartial('sample', require('./template/sample.handlebars'));

handlebars.registerHelper('listClass', (array) => {
  if (array == null) {
    return '';
  }

  if (array.length <= 3) {
    return 'inline';
  } else {
    return 'multiline';
  }
});

/*
 * Just as a convenience, let's define a constant for the container div inside
 * of which we will add all our lens elements.
 */
const LENS = document.getElementById('lens');

/*
 * We're going to store all the subjects, aspects and samples in these Maps.
 */
let subjects = new Map();
let aspects = new Map();
let samples = new Map();

/*
 * Once the lens is loaded, we register event listeners for some of the other
 * refocus events.
 */
LENS.addEventListener('refocus.lens.load', () => {
  LENS.addEventListener('refocus.lens.hierarchyLoad', onHierarchyLoad);
  LENS.addEventListener('refocus.lens.realtime.change', onRealtimeChange);

  /*
   * Display a "Loading..." indicator while we wait for the browser to get all
   * the hierarchy data (which is loaded asynchronously). We'll get rid of this
   * "Loading..." indicator once we're able to render actual subjects and
   * aspects and samples.
   */
  LENS.innerHTML = loadingTemplate();
});

/**
 * Handle the refocus.lens.hierarchyLoad event. The hierarchy JSON is stored
 * in evt.detail. Here, we call "preprocess" to manipulate the hierarchy data,
 * we hide the loading indicator, then we call our "draw" function to add
 * elements to DOM which will represent our subjects, aspects and samples.
 */
function onHierarchyLoad(evt) {
  console.log(new Date(), '#lens => refocus.lens.hierarchyLoad');
  preprocess(evt.detail); // Manipulate the hierarchy data.

  // Hide the "Loading..." indicator now that we have real data to render.
  document.getElementById('loading').setAttribute('hidden', 'true');

  draw();
} // onHierarchyLoad

/**
 * Preprocess the hierarchy data: organize the data into some structure which
 * is optimized for how you want render it on the page.
 */
function preprocess(node) {
  formatDateFields(node);
  subjects.set(node.absolutePath, node);
  if (node.samples) {
    node.samples.forEach((sample) => {
      sample.subjectId = node.id;
      sample.subjectAbsolutePath = node.absolutePath;
      formatDateFields(sample);
      formatDateFields(sample.aspect);
      samples.set(sample.name, sample);
      aspects.set(sample.aspect.name, sample.aspect);
    });
  }

  if (node.children) {
    node.children.forEach(preprocess);
  }
} // preprocess

function formatDateFields(object) {
  let fields = ['createdAt', 'updatedAt', 'statusChangedAt'];
  fields.forEach((field) => {
    let currentValue = object[field];
    if (currentValue)
      object[field] = new Date(currentValue).toLocaleString();
  });
} // formatDateFields

/**
 * This function modifies the DOM by passing the data into our template(s).
 */
function draw() {
  const subjectList = Array.from(subjects.values());
  const aspectList = Array.from(aspects.values());
  const sampleList = Array.from(samples.values())
  subjectList.sort(subjectSorter);
  subjectList.forEach(s => s.samples.sort(sampleSorter));
  sampleList.sort(sampleSorter);
  aspectList.sort(aspectSorter);
  const context = {
    "subjects": subjectList,
    "aspects": aspectList,
    "samples": sampleList,
  };
  LENS.innerHTML = mainTemplate(context);
} // draw

function subjectSorter(subject1, subject2) {
  const string1 = subject1.parentAbsolutePath + '.' + (subject1.sortBy || subject1.name);
  const string2 = subject2.parentAbsolutePath + '.' + (subject2.sortBy || subject2.name);
  return ascending(string1, string2);
} // subjectSorter

function sampleSorter(sample1, sample2) {
  const subject1 = subjects.get(sample1.subjectAbsolutePath);
  const subject2 = subjects.get(sample2.subjectAbsolutePath);
  let ret = subjectSorter(subject1, subject2);
  if (ret === 0) {
    ret = aspectSorter(sample1.aspect, sample2.aspect);
  }

  return ret;
} // sampleSorter

function aspectSorter(a, b) {
  let ret;
  if (a.rank != null && b.rank != null) {
    ret = a.rank - b.rank;
  } else if (a.rank == null && b.rank == null) {
    ret = 0;
  } else if (a.rank == null && b.rank != null) {
    ret = 1;
  } else if (a.rank != null && b.rank == null) {
    ret = -1;
  }

  if (ret === 0) {
    ret = ascending(a.name, b.name);
  }

  return ret;
} // aspectSorter

function ascending(a, b) {
  if (a.toLowerCase() > b.toLowerCase()) {
    return 1;
  } else if (a.toLowerCase() < b.toLowerCase()) {
    return -1;
  } else {
    return 0;
  }
} // ascending

/**
 * Handle the refocus.lens.realtime.change event. The array of changes is
 * stored in evt.detail. Iterate over the array to perform any preprocessing
 * if needed, then call draw only once after all the data manipulation is
 * done.
 */
function onRealtimeChange(evt) {
  console.log(new Date(), 'refocus.lens.realtime.change',
    'contains ' + evt.detail.length + ' changes');
  if (!Array.isArray(evt.detail) || evt.detail.length == 0) {
    return;
  }

  evt.detail.forEach((chg) => {
    if (chg['sample.add']) {
      realtimeChangeHandler.onSampleAdd(chg['sample.add']);
    } else if (chg['sample.remove']) {
      realtimeChangeHandler.onSampleRemove(chg['sample.remove']);
    } else if (chg['sample.update']) {
      realtimeChangeHandler.onSampleUpdate(chg['sample.update']);
    } else if (chg['subject.add']) {
      realtimeChangeHandler.onSubjectAdd(chg['subject.add']);
    } else if (chg['subject.remove']) {
      realtimeChangeHandler.onSubjectRemove(chg['subject.remove'])
    } else if (chg['subject.update']) {
      realtimeChangeHandler.onSubjectUpdate(chg['subject.update'])
    }
  }); // evt.detail.forEach

  // Now that we've processed all these changes, call draw!
  draw();
} // onRealtimeChange

const realtimeChangeHandler = {
  onSampleAdd(sample) {
    samples.set(sample.name, sample);
    let [subject] = getSubjectAndIndex(sample);
    subject.samples.push(sample);
  },
  onSampleRemove(sample) {
    samples.delete(sample.name);
    let [subject, index] = getSubjectAndIndex(sample);
    subject.samples.splice(index, 1);
  },
  onSampleUpdate(change) {
    let sample = change.new;
    samples.set(sample.name, sample);
    let [subject, index] = getSubjectAndIndex(sample);
    subject.samples[index] = sample;
  },
  onSubjectAdd(subject) {
    subjects.set(subject.absolutePath, subject);
  },
  onSubjectRemove(subject) {
    subjects.delete(subject.absolutePath);
  },
  onSubjectUpdate(change) {
    let subject = change.new;
    subjects.set(subject.absolutePath, subject);
  }
}; // realtimeChangeHandler

function getSubjectAndIndex(sample) {
  let subjectPath = sample.name.split('|')[0];
  let subject = subjects.get(subjectPath);
  let index = subject.samples.findIndex( (s) => s.name === sample.name );
  return [subject, index];
} // getSubjectAndIndex
