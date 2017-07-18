#!/usr/bin/env node

/*  */

'use strict';

require('dotenv').config();

const minimist = require('minimist');
const { cyan, gray, magenta } = require('chalk');
const { clearAuthToken } = require('./auth');

const { argv: [, , ...args] } = process;

const { _: inputs, h, help, clear } = minimist(args);

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

if (h === true || help === true || inputs.length === 0) {
  info();
}

if (clear === true) {
  clearAuthToken();
} else if (inputs.length) {
  const query = inputs.join(' ');
  require('./main.js').run(query);
} else {
  info();
}
