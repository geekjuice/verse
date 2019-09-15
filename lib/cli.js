"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const meow_1 = __importDefault(require("meow"));
const auth_1 = require("./auth");
const exception_1 = require("./exception");
const logger_1 = require("./logger");
const main_1 = require("./main");
const { blue, cyan, gray, magenta, red } = chalk_1.default;
const logger = logger_1.create('index');
(async () => {
    try {
        logger.log('starting verse');
        const { input, flags: { select, filepath, clear, help, version }, showHelp, showVersion, } = meow_1.default(
        // prettier-ignore
        `
    usage: ${magenta('verse')} ${blue('[options]')} ${cyan('[query]')}

    options:
      ${blue('-f, --filepath')}  path to configuration      ${gray('[~/.verse]')}
      ${blue('-s, --select')}    select from query results
      ${blue('-c, --clear')}     clear genius api token
      ${blue('-v, --version')}   show version
      ${blue('-h, --help')}      show help`, {
            autoHelp: false,
            autoVersion: false,
            flags: {
                select: {
                    alias: 's',
                    type: 'boolean',
                },
                filepath: {
                    alias: 'f',
                    type: 'string',
                },
                clear: {
                    alias: 'c',
                    type: 'boolean',
                },
                help: {
                    alias: 'h',
                    type: 'boolean',
                },
                version: {
                    alias: 'v',
                    type: 'boolean',
                },
            },
        });
        if (help) {
            logger.log(`showing help`);
            showHelp();
        }
        if (version) {
            logger.log(`showing version`);
            showVersion();
        }
        if (clear) {
            await auth_1.reset(filepath);
            process.exit(0);
        }
        if (input.length === 0) {
            logger.warn(`no query provided`);
            showHelp();
        }
        const token = await auth_1.ensure(filepath);
        const query = input.join(' ');
        await main_1.request({ token, select, query });
        logger.log('exiting verse');
        process.exit(0);
    }
    catch (error) {
        logger.error(error);
        if (error[exception_1.MESSAGE]) {
            const message = `\n${error[exception_1.MESSAGE]}`;
            console.log(red(message));
        }
        console.log(red('\n(╯°□°)╯︵ ┻━┻'));
        process.exit(1);
    }
})();
