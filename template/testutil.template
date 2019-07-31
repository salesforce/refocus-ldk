/*
* ./test/SampleUtilTest.js
*
* Starter test file for Utils.js 
*/

const chai = require('chai');
const expect = chai.expect;
const fs = require('fs-extra');
chai.use(require("chai-sorted"));
const u = require('../src/Utils.js');

let subjectMap = new Map();
let sampleMap = new Map();
let aspectMap = new Map();

// Here is the sample data you can use to test your Util functions.
// This data is also used to prototype your new lens.

const sampleData = JSON.parse(fs.readFileSync('./test/weatherByCountry.json'));

describe('Sample Test for Utils.js> ', () => {

  // For each function you use in Utils.js you can create a specific test
  // Here is an example to check if our Utils.js functions are processing the sample data correctly:

  it('processNode should contain all the aspects', () =>{
  	const node = u.processNode(sampleData);
  	subjectMap = node.subjects;
  	sampleMap = node.samples;
  	aspectMap = node.aspects;

    expect(Array.from(aspectMap.keys())).to.have.members(["rfx-Humidity", "rfx-TooCold", "rfx-TooHot", "rfx-WindSpeed", "rfx-Snowfall", "rfx-Rainfall"]);

  });

  it('sortMap should sort subjectMap', () => {
    const node = u.processNode(sampleData);
    subjectMap = node.subjects;
    sampleMap = node.samples;
    aspectMap = node.aspects;
    const sortedSubject = u.sortMap(subjectMap);
    expect(Array.from(sortedSubject.keys())).to.be.sorted();

  });

});
