#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const chalk_1 = require("chalk");
const minimist = require("minimist");
const token = require("./token");
const { argv: [, , ...args] } = process;
const { _, h, help, clear } = minimist(args);
const description = `
  Usage
    $ ${chalk_1.cyan('verse')} ${chalk_1.magenta('<search>')}

  Options
    ${chalk_1.gray('--clear')} Clear Genius API access token

  Examples
    $ ${chalk_1.cyan('verse')} ${chalk_1.magenta('"Humble - Kendrick Lamar"')}
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
}
else if (_.length) {
    const inputs = _.join(' ');
    require('./main.js').run(inputs);
}
else {
    info();
}
//# sourceMappingURL=cli.js.map