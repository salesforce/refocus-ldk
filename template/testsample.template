/*
* ./test/SampleRealtimeTest.js
*
* Starter test file for RealtimeChangeHandler.js
*/

const expect = require('chai').expect;
const fs = require('fs-extra');
const RealtimeChangeHandler = require('../src/RealtimeChangeHandler');
const util = require('../src/Utils');

// Here is the sample data you can use to test your Util functions.
// This data is also used to prototype your new lens.

let sampleData = util.processNode(JSON.parse(fs.readFileSync('./test/weatherByCountry.json')));

const updatedSample = {
  "previousStatus": "Warning",
  "name": "rfx.Central_America.Belize|rfx-Humidity",
  "statusChangedAt": "2019-07-26T22:25:05.990Z",
  "status": "OK",
  "value": "69",
  "messageCode": "69",
  "updatedAt": "2019-07-26T22:29:15.732Z",
  "createdAt": "2019-07-16T22:15:54.566Z",
  "aspect": {
    "name": "rfx-Humidity",
    "helpEmail": "refocus-init@noreply.com",
    "okRange": [
      0,
      75
    ],
    "warningRange": [
      75,
      90
    ],
    "criticalRange": [
      90,
      199
    ],
  }
};
const newSample = {
  "name": "rfx.Central_America.Belize|rfx-Fog",
  "status": "OK",
  "value": "15",
  "aspect": {
    "name": "rfx-Fog",
  }
};
const outsideRootSample = {
  "name": "Central_America.Belize|rfx-Fog",
  "status": "OK",
  "value": "15",
  "aspect": {
    "name": "rfx-Fog",
  }
}


// Here is an example showing how you can test RealtimeChangeHandler.js functions
// For each describe block, you can define an event flow to see if real time
// changes are handled correctly. In the example below, you are give different cases
// to consider while making changes to RealtimeChangeHandler.js

describe('./test/SampleRealtimeTest.js handle: onSampleUpdate >', () => {

  it('onSampleUpdate should be called for a sample update', () => {

    RealtimeChangeHandler.handle({'sample.update' : updatedSample}, sampleData);

    expect(sampleData.samples.get('rfx.Central_America.Belize|rfx-Humidity')).to.be.eq(updatedSample);
  });

  it('onSampleUpdate should add new sample if not found', () => {

    RealtimeChangeHandler.handle({'sample.update' : newSample}, sampleData);

    expect(sampleData.samples.has('rfx.Central_America.Belize|rfx-Fog')).to.be.true;
    expect(sampleData.samples.get('rfx.Central_America.Belize|rfx-Fog')).to.be.eQ(newSample);
  });
});

describe('./test/SampleRealtimeTest.js handle: onSampleRemove and onSampleAdd', () => {

  it('onSampleRemove should be called to remove a sample and then add it back', () => {

    RealtimeChangeHandler.handle({'sample.remove' : updatedSample}, sampleData);

    expect(sampleData.samples.has(updatedSample.name)).to.be.not.true;

    RealtimeChangeHandler.handle({'sample.add' : updatedSample}, sampleData);

    expect(sampleData.samples.has(updatedSample.name)).to.be.true;
  });

  it('onSampleRemove should not add outside of root', () => {

    RealtimeChangeHandler.handle({'sample.add' : outsideRootSample}, sampleData);

    expect(sampleData.samples.has(outsideRootSample.name)).to.be.not.true;

  });
});


