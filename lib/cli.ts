#!/usr/bin/env node

'use strict';

require('dotenv').config();

import { cyan, gray, magenta } from 'chalk';
import * as minimist from 'minimist';
import * as token from './token';

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

const info = (): void => {
  console.log(description);
  process.exit(0);
};

if (h === true || help === true) {
  info();
}

if (clear === true) {
  token.clear();
} else if (_.length) {
  const inputs = _.join(' ');
  require('./main.js').run(inputs);
} else {
  info();
}
