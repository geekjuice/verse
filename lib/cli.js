#!/usr/bin/env node

'use strict';

require('dotenv').config();

const minimist = require('minimist');
const { cyan, gray, magenta } = require('chalk');
const token = require('./token');

const { argv: [, , ...args] } = process;

const { _, h, help, clear } = minimist(args);

const description = `
  Usage
    $ ${cyan('verse')} ${magenta('<search>')}

  Options
    ${gray('--clear')} Clear Genius API access token

  Examples
    $ ${cyan('verse')} ${magenta('"Humble - Kendrick Lamar"')}
`;

const info = () => {
  console.log(description);
  process.exit(0);
};

if (h === true || help === true) {
  info();
}

if (clear === true) {
  token.clear();
} else if (_.length) {
  require('./index.js').run(_.join(' '));
} else {
  info();
}
