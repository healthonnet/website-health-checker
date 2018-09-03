Website Health Checker
======================

Website Health Guesser NPM module

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![NPM version][npm-image]][npm-url]


Install
-------

You can install it globally for commande usage:
```bash
$ npm install -g website-health-checker
```

or as a normal dependency:
```bash
$ npm install -S website-health-checker
```

Command Line
------------

```bash
$ website-health-checker --help

Usage: website-health-checker <url> [options][-?, --help]

Options:
  --version           Show version number                              [boolean]
  --certified, --hon  Optional: website should be HON certified        [boolean]
  --lang, -l          Optional: CountryCode of the expected languages. ie: en fr [array]
  --ip                Optional: Website should respond from this ip
  --contains          Optional: Page should contains those words
  --blacklist         Optional: List of suspicious words                 [array]
  -?, --help          Show help                                        [boolean]

```

Usage
-----

```js
const healthChecker = require('website-health-guesser');

healthChecker.isHealthy('https://www.example.com/', {
    certified: true, // Must be Honcode certified
    lang: ['en', 'fr'], // Must be in English or in French
    contains: 'example.com', // Must contain "example.com" string
  }).then(function(result) {
    console.log(result);
    /*
      result: {
        availability: true,
        certified: false,
        lang: true,
        contains: true,
      }
    */
});
```

API
---

### .isHealthy(url, expectations)

Type: `function`

Parameters:  
```
url: Url to test
expectations: {
     available: true,
     certifed: true, // Honcode certification
     lang: [countryCodes],
     ip: 127.0.0.1,
     contains: 'string that must be here',
     blacklist: [forbidden, words],
}
```
All expectations are optional. 

Return a Promise with booleans for all tested expectations.


See Also
--------

 * [HONcode Certification List](https://github.com/healthonnet/honcode-certification-list)
 * [HONcode Certification Utils](https://github.com/healthonnet/honcode-certification-utils)
 * [Is HONcode Certified](https://github.com/healthonnet/is-honcode-certified)

Contributing to Website Health Checker
------------------------------------

Contributions are always welcome, no matter how large or small.

See [Contributing](CONTRIBUTING.md).

Developer
---------

  * [Cedric FROSSARD](https://github.com/Adrion)

License
-------

Apache License 2.0


[npm-image]: https://img.shields.io/npm/v/website-health-checker.svg
[npm-url]: https://www.npmjs.com/package/website-health-checker
[travis-image]: https://travis-ci.org/healthonnet/website-health-checker.svg?branch=master
[travis-url]: https://travis-ci.org/healthonnet/website-health-checker
[coverage-image]: https://coveralls.io/repos/github/healthonnet/website-health-checker/badge.svg
[coverage-url]: https://coveralls.io/github/healthonnet/website-health-checker
