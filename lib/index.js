const ora = require('ora');
const debug = require('debug');
const { magenta, cyan, red } = require('chalk');
const request = require('request');
const Nightmare = require('nightmare');
const { fromJS } = require('immutable');
const { get } = require('./token.js');

const DEBUG = debug('verse');

const noop = () => {};
const progress = (...args) =>
  DEBUG.enabled ? { start: () => ({ stop: noop, fail: noop }) } : ora(...args);

const options = (token, query) => ({
  url: 'https://api.genius.com/search',
  headers: { Authorization: `Bearer ${token}` },
  qs: { q: query }
});

const search = (token, query) =>
  new Promise((resolve, reject) =>
    request(options(token, query), (err, { statusCode, body }) => {
      DEBUG(`status code ${statusCode}`);
      if (err) {
        reject(err);
      } else if (statusCode !== 200) {
        reject(body);
      } else {
        resolve(body);
      }
    })
  );

const scrape = (url, selector) =>
  Nightmare({ show: false })
    .goto(url)
    .wait(selector)
    .evaluate($ => document.querySelector($).innerText, selector)
    .end();

const format = lyrics => lyrics.replace(/\[.*\]/g, match => magenta(match));

module.exports.run = async query => {
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
