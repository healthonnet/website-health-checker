'use strict';

const isHoncodeCertified = require('is-honcode-certified');
const { checkUrl } = require('check-url');
const request = require('request');
const extractor = require('unfluff');
const dns = require('dns');
const { URL } = require('url');


exports.isHealthy = (url, expectations = {}) => {

  const myURL = new URL(url);

  // Check global availabilty
  let isAvailable = new Promise((resolve) => {
    checkUrl(url, 'GET', {__method: 'GET'})
      .then((res) => {
        if (res.ok) {
          resolve({available: true});
        } else {
          resolve({available: false});
        }
      }).catch(() => resolve({available: false}));
  });

  // Check HON's certification
  let isCertified = new Promise((resolve) => {
    if (expectations.certifed) {
      isHoncodeCertified.isHONcodeCertified(url)
        .then((isCertified) => {
          if (isCertified) {
            resolve({certifed: true});
          } else {
            resolve({certifed: false});
          }
        });
    } else {
      resolve();
    }
  });

  // Check IP consistency
  let isIPOk = new Promise((resolve) => {
    if (expectations.ip) {
      dns.lookup(myURL.host, (err, address) => {
        if (err) {return resolve ({ip: false});}
        resolve({ip: expectations.ip === address});
      });
    } else {
      resolve();
    }
  });

  // Check content and language consistency
  let isContentOk = new Promise((resolve) => {

    request.get(url,{}, (err, res, body) => {
      let results = {};

      if (err) {
        return resolve({
          blacklist: false,
          contains: false,
          lang: false,
        });
      }

      let data = extractor(body);
      if (data.text === '') {
        return resolve({
          empty: false,
        });
      }

      // A blacklist was defined
      if (expectations.blacklist) {
        results.blacklist = true;
        expectations.blacklist.forEach((word) => {
          if (data.text.indexOf(word) > 0) {
            results.blacklist = false;
          }
        });
      }

      // Required text was defined
      if (expectations.contains) {
        results.contains = (data.text.indexOf(expectations.contains) > -1);
      }

      // Specific languages is expected
      if (expectations.lang) {
        results.lang = false;
        request.post({
          url: 'http://khresmoi.honservices.org:8080' +
          '/hon-ir-lang/languageDetect/detect',
          form: {
            detect: 'detect',
            text: data.text,
          },
        }, (err,httpResponse,body) => {
          if (err) {
            results.lang = false;
            return resolve(results);
          }
          expectations.lang.forEach((e) => {
            if (e === body) {results.lang = true;}
          });
          resolve(results);

        });
      } else {
        resolve(results);
      }
    });
  });


  return Promise.all([isAvailable, isCertified, isIPOk, isContentOk])
    .then((values) => {
      let res = {};
      Object.assign(res, ...values);
      return res;
    });
};