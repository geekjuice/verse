import chalk from 'chalk';
import meow from 'meow';
import { reset, ensure } from './auth';
import { MESSAGE } from './exception';
import { create } from './logger';
import { request } from './main';

const { blue, cyan, gray, magenta, red } = chalk;

const logger = create('index');

(async (): Promise<void> => {
  try {
    logger.log('starting verse');

    const {
      input,
      flags: { select, filepath, clear, help, version },
      showHelp,
      showVersion,
    } = meow(
      // prettier-ignore
      `
    usage: ${magenta('verse')} ${blue('[options]')} ${cyan('[query]')}

    options:
      ${blue('-f, --filepath')}  path to configuration      ${gray('[~/.verse]')}
      ${blue('-s, --select')}    select from query results
      ${blue('-c, --clear')}     clear genius api token
      ${blue('-v, --version')}   show version
      ${blue('-h, --help')}      show help`,
      {
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
      }
    );

    if (help) {
      logger.log(`showing help`);
      showHelp();
    }

    if (version) {
      logger.log(`showing version`);
      showVersion();
    }

    if (clear) {
      await reset(filepath);
      process.exit(0);
    }

    if (input.length === 0) {
      logger.warn(`no query provided`);
      showHelp();
    }

    const token = await ensure(filepath);
    const query = input.join(' ');
    await request({ token, select, query });

    logger.log('exiting verse');
    process.exit(0);
  } catch (error) {
    logger.error(error);
    if (error[MESSAGE]) {
      const message = `\n${error[MESSAGE]}`;
      console.log(red(message));
    }
    console.log(red('\n(╯°□°)╯︵ ┻━┻'));
    process.exit(1);
  }
})();
