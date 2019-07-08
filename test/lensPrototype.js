/**
 * test/lensPrototype.js
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const path = require('path');
const expect = chai.expect;
const fs = require('fs-extra');
const childProcess = require('child_process');

chai.use(chaiHttp);
chai.should();

describe('lens prototype test>', function () {
  this.timeout(5000);
  let server;
  beforeEach(function () {
    server = require('../bin/lensPrototype');
  });

  afterEach(function () {
    //server.close();
  });

  it('responds to /', function testSlash(done) {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html;
        res.body.should.be.a('object');
        done();
      });
  });

  it('404 everything else', function testPath(done) {
    chai.request(server)
      .get('/foo/bar')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
