#!/usr/bin/env node

'use strict';

const Table = require('cli-table');
const clc = require("cli-color");

const yargs = require('yargs')
  .usage('Usage: $0 <url> [options][-?, --help]')
  .options({
    certified: {
      alias: 'hon',
      describe: 'Optional: website should be HON certified',
      boolean: true,
    },
    lang: {
      alias: 'l',
      type: 'array',
      describe: 'Optional: CountryCode of the expected languages. ie: en fr',
    },
    ip: {
      describe: 'Optional: Website should respond from this ip',
    },
    contains: {
      describe: 'Optional: Page should contains those words',
    },
    blacklist: {
      type: 'array',
      describe: 'Optional: List of suspicious words',
    },
  })
  .help('?')
  .alias('?', 'help');

const argv  = yargs.argv;
const tool   = require('../lib/index.js');
const utils = require('honcode-certification-utils');

const analyseValues = (values, expectations) => {

  let table = new Table({
    head: ['Check', 'parameter', 'result'],
    colWidths: [40, 20, 20],
  });

  for (let check in values) {
    if (values.hasOwnProperty(check)) {
      table.push([check, expectations[check], values[check] ? clc.green('Ok') : clc.red("Problem")]);
    }
  }
  console.log(table.toString());
};

if (utils.isValidUrl(argv._[0])) {
  let expectations = {};
  expectations.available = true;
  expectations.certifed = argv.certified;
  expectations.lang = argv.lang;
  expectations.ip = argv.ip;
  expectations.contains = argv.contains;
  expectations.blacklist = argv.blacklist;

  tool.isHealthy(argv._[0], expectations).then((values) => {analyseValues(values, expectations);});
} else {
  console.log(argv.url + ' is not a valid url');
}