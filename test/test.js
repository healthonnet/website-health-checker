'use strict';

require('chai').should();
const websiteHealthGuesser = require('../src/lib/index.js');

describe('website Health availability check', function() {
  this.timeout(15000);

  it('should return false for http://getstatuscode.com/404', function(done) {
    websiteHealthGuesser.isHealthy('https://getstatuscode.com/404')
      .then((health) => {
        health.available.should.equal(false);
        done();
      }
    );
  });

  it('should return false for http://getstatuscode.com/500', function(done) {
    websiteHealthGuesser.isHealthy('https://getstatuscode.com/500')
      .then((health) => {
          health.available.should.equal(false);
          done();
        }
      );
  });

  it('should return true for http://getstatuscode.com/200', function(done) {
    websiteHealthGuesser.isHealthy('https://getstatuscode.com/200')
      .then((health) => {
          health.available.should.equal(true);
          done();
        }
      );
  });
});

describe('website Health certification check', function() {
  this.timeout(15000);

  it('should return false for non certified', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com', {
      certifed: true,
    }).then((health) => {
          health.available.should.equal(true);
          health.certifed.should.equal(false);
          done();
        }
      );
  });

  it('should return true for certified', (done) => {
    websiteHealthGuesser.isHealthy('https://www.provisu.ch', {
      certifed: true,
    }).then((health) => {
        health.available.should.equal(true);
        health.certifed.should.equal(true);
        done();
      }
    );
  });

  it('should return nothing if not specified', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com').then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      done();
    });
  });
});

describe('website Health IP check', function() {
  this.timeout(15000);

  it('should return false for non consistent IP', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com', {
      ip: '127.0.0.1',
    }).then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      health.ip.should.equal(false);
      done();
    });
  });

  it('should return true for consistent IP', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com', {
      ip: '93.184.216.34',
    }).then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      health.ip.should.equal(true);
      done();
    });
  });

  it('should return nothing if not specified', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com').then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      done();
    });
  });
});

describe('website Health blacklist check', function() {
  this.timeout(15000);

  it('should return false if word is found', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com', {
      blacklist: ['Example', 'domain'],
    }).then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      health.blacklist.should.equal(false);
      done();
    });
  });

  it('should return true if it finds nothing from blacklist', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com', {
      blacklist: ['awordthatdidntexist', 'verystrangeword'],
    }).then((health) => {
        health.available.should.equal(true);
        (typeof health.certifed).should.be.equal('undefined');
        (typeof health.ip).should.be.equal('undefined');
        health.blacklist.should.equal(true);
        done();
      }
    );
  });

  it('should return nothing if not specified', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com').then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      (typeof health.blacklist).should.be.equal('undefined');
      done();
    });
  });
});

describe('website Health contains check', function() {
  this.timeout(15000);

  it('should return false if not found', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com', {
      contains: 'it does not contain this',
    }).then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      (typeof health.blacklist).should.be.equal('undefined');
      health.contains.should.equal(false);
      done();
    });
  });

  it('should return true if founded', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com', {
      contains: 'illustrative examples',
    }).then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      (typeof health.blacklist).should.be.equal('undefined');
      health.contains.should.equal(true);
      done();
    });
  });

  it('should return nothing if not specified', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com').then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      (typeof health.blacklist).should.be.equal('undefined');
      (typeof health.contains).should.be.equal('undefined');
      done();
    });
  });
});

describe('website Health lang check', function() {
  this.timeout(15000);

  it('should return false if no correct lang is found', (done) => {
    websiteHealthGuesser.isHealthy({
      url: 'https://www.example.com',
      lang: ['fr', 'it', 'pt'],
    }).then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      (typeof health.blacklist).should.be.equal('undefined');
      (typeof health.contains).should.be.equal('undefined');
      health.lang.should.equal(false);
      done();
    });
  });

  it('should return true if correct lang founded', (done) => {
    websiteHealthGuesser.isHealthy('https://www.provisu.ch', {
      lang: ['en'],
    }).then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      (typeof health.blacklist).should.be.equal('undefined');
      (typeof health.contains).should.be.equal('undefined');
      health.lang.should.equal(true);
      done();
    });
  });

  it('should return nothing if not specified', (done) => {
    websiteHealthGuesser.isHealthy('https://www.example.com').then((health) => {
      health.available.should.equal(true);
      (typeof health.certifed).should.be.equal('undefined');
      (typeof health.ip).should.be.equal('undefined');
      (typeof health.blacklist).should.be.equal('undefined');
      (typeof health.contains).should.be.equal('undefined');
      (typeof health.lang).should.be.equal('undefined');
      done();
    });
  });
});