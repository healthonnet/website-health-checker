Website Health Checker
======================

Website Health Guesser NPM module

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

Usage: website-health-guesser <url> [options][-?, --help]

Options:
  --version           Show version number                              [boolean]
  --certified, --hon  Optional: website should be HON certified        [boolean]
  --lang, -l          Optional: CountryCode of the expected languages. ie: en fr [array]
  --ip                Optional: Website should respond from this ip
  --contains          Optional: Page should contains those words
  --blacklist         Optional: List of suspicious words                 [array]
  --url, -u           url to check                                    [required]
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