import debug from 'debug';
import * as ora from 'ora';
import { magenta, cyan, red } from 'chalk';
import * as request from 'request';
import * as nightmare from 'nightmare';
import { fromJS } from 'immutable';
import { get } from './token.js';

/* eslint-disable no-unused-vars */
import { RequestMeta } from '../types/verse';
/* eslint-enable no-unused-vars */

const DEBUG = debug('verse');

const noop = (): void => {};

const progress = (message: string): ora.Instance =>
  DEBUG.enabled
    ? { start: (): ora.Instance => ({ stop: noop, fail: noop }) }
    : ora(message);

const options = (token: string, query: string): RequestMeta => ({
  url: 'https://api.genius.com/search',
  headers: { Authorization: `Bearer ${token}` },
  qs: { q: query }
});

const search = (token: string, query: string): Promise<string> =>
  new Promise<
    string
  >((resolve: (result: any) => void, reject: (error: any) => void) =>
    request(
      options(token, query),
      (err: Error, { statusCode, body }: request.RequestResponse): void => {
        DEBUG(`status code ${statusCode}`);
        if (err) {
          reject(err);
        } else if (statusCode !== 200) {
          reject(body);
        } else {
          resolve(body);
        }
      }
    )
  );

const scrape = (url: string, selector: string): Promise<string> =>
  nightmare({ show: false })
    .goto(url)
    .wait(selector)
    .evaluate(
      ($: string): string => (<HTMLElement>document.querySelector($)).innerText,
      selector
    )
    .end();

const format = (lyrics: string): string =>
  lyrics.replace(/\[.*\]/g, match => magenta(match));

export const run = async (query: string): Promise<void> => {
  let spinner;

  try {
    const token = await get();

    DEBUG(`searching ${query}`);
    spinner = progress(
      `Searching for '${cyan(query)}' using the Genius API...`
    ).start();

    const body = await search(token, query);
    const json = fromJS(JSON.parse(body));
    const path = ['response', 'hits', 0, 'result'];

    if (json.hasIn(path)) {
      const result = json.getIn(path);
      const url = result.get('url');
      const title = result.get('full_title');

      DEBUG(`scraping ${title} at ${url}`);
      spinner.text = `Scraping lyrics for '${cyan(
        title
      )}' from the Genius website...`;

      const lyrics = await scrape(url, '.lyrics');

      spinner.stop();
      console.log();
      console.log([cyan(title), format(lyrics.trim())].join('\n\n'));
      process.exit(0);
    }
  } catch (exception) {
    DEBUG(`error ${exception}`);
    spinner.fail(red('Something went wrong... (╯°□°）╯︵ ┻━┻'));
    process.exit(1);
  }
};
