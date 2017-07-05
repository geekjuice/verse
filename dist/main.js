"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const ora = require("ora");
const chalk_1 = require("chalk");
const request = require("request");
const nightmare = require("nightmare");
const immutable_1 = require("immutable");
const token_js_1 = require("./token.js");
/* eslint-enable no-unused-vars */
const DEBUG = debug_1.default('verse');
const noop = () => { };
const progress = (message) => DEBUG.enabled
    ? { start: () => ({ stop: noop, fail: noop }) }
    : ora(message);
const options = (token, query) => ({
    url: 'https://api.genius.com/search',
    headers: { Authorization: `Bearer ${token}` },
    qs: { q: query }
});
const search = (token, query) => new Promise((resolve, reject) => request(options(token, query), (err, { statusCode, body }) => {
    DEBUG(`status code ${statusCode}`);
    if (err) {
        reject(err);
    }
    else if (statusCode !== 200) {
        reject(body);
    }
    else {
        resolve(body);
    }
}));
const scrape = (url, selector) => nightmare({ show: false })
    .goto(url)
    .wait(selector)
    .evaluate(($) => document.querySelector($).innerText, selector)
    .end();
const format = (lyrics) => lyrics.replace(/\[.*\]/g, match => chalk_1.magenta(match));
exports.run = async (query) => {
    let spinner;
    try {
        const token = await token_js_1.get();
        DEBUG(`searching ${query}`);
        spinner = progress(`Searching for '${chalk_1.cyan(query)}' using the Genius API...`).start();
        const body = await search(token, query);
        const json = immutable_1.fromJS(JSON.parse(body));
        const path = ['response', 'hits', 0, 'result'];
        if (json.hasIn(path)) {
            const result = json.getIn(path);
            const url = result.get('url');
            const title = result.get('full_title');
            DEBUG(`scraping ${title} at ${url}`);
            spinner.text = `Scraping lyrics for '${chalk_1.cyan(title)}' from the Genius website...`;
            const lyrics = await scrape(url, '.lyrics');
            spinner.stop();
            console.log();
            console.log([chalk_1.cyan(title), format(lyrics.trim())].join('\n\n'));
            process.exit(0);
        }
    }
    catch (exception) {
        DEBUG(`error ${exception}`);
        spinner.fail(chalk_1.red('Something went wrong... (╯°□°）╯︵ ┻━┻'));
        process.exit(1);
    }
};
//# sourceMappingURL=main.js.map