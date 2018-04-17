/* @flow */

import type { Debugger } from 'debug';
import type { AxiosPromise } from 'axios';
import type { Response } from 'verse';

const axios = require('axios');
const { magenta, cyan, red } = require('chalk');
const debug = require('debug');
const nightmare = require('nightmare');
const ora = require('ora');
const { getAuthToken } = require('./auth');
const Results = require('./results');

const DEBUG: Debugger = debug('verse:main');

const stub: Object = {
  start: () => stub,
  stop: () => stub,
  fail: () => stub,
  text: ''
};

const progress = (message: ?string): Object =>
  DEBUG.enabled ? stub : ora(message);

const search = (token: string, query: string): AxiosPromise<Response> =>
  axios.get('https://api.genius.com/search', {
    params: { q: query },
    headers: { Authorization: `Bearer ${token}` }
  });

const scrape = (url: string, selector: string): Promise<string> =>
  nightmare({ show: false })
    .goto(url)
    .wait(selector)
    .evaluate(
      ($: string): string => (document.querySelector($) || {}).textContent,
      selector
    )
    .end();

const format = (lyrics: string = ''): string =>
  lyrics.trim().replace(/\[.*\]/g, match => magenta(match));

module.exports.run = async (query: string): Promise<void> => {
  const spinner = progress();
  try {
    DEBUG('getting genius api client token');
    const token = await getAuthToken();
    spinner.start();

    DEBUG(`searching '${query}'`);
    spinner.text = `Searching for '${cyan(query)}' using the Genius API...`;
    const { data } = await search(token, query);

    DEBUG('parsing response');
    const { url, title } = new Results(data).get(0);

    DEBUG(`scraping '${title}' from ${url}`);
    spinner.text = `Scraping lyrics for '${cyan(title)}' from Genius ...`;
    const lyrics = await scrape(url, '.lyrics');

    spinner.stop();
    console.log();
    console.log([cyan(title), format(lyrics)].join('\n\n'));
    process.exit(0);
  } catch (exception) {
    DEBUG(`error ${exception}`);
    spinner.fail(red('Something went wrong... (╯°□°）╯︵ ┻━┻'));
    process.exit(1);
  } finally {
    spinner.stop();
  }
};
