"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const ask = __importStar(require("./ask"));
const genius_1 = require("./genius");
const logger_1 = require("./logger");
const prettify_1 = __importDefault(require("./prettify"));
const progress_1 = __importDefault(require("./progress"));
const { cyan } = chalk_1.default;
const logger = logger_1.create('main');
const LYRICS_SELECTOR = '.lyrics';
exports.request = async ({ token, select, query, }) => {
    const spinner = progress_1.default().start();
    try {
        spinner.text = `searching genius for '${cyan(query)}'...`;
        logger.log(spinner.text);
        const results = await genius_1.search(token, query);
        let result = results[0];
        if (select) {
            spinner.stop();
            result = await ask.song(results);
            spinner.start();
        }
        const { title, url } = result;
        spinner.text = `scraping lyrics for '${cyan(title)}'...`;
        logger.log(spinner.text);
        const lyrics = await genius_1.scrape(url, LYRICS_SELECTOR);
        spinner.stop();
        console.log(prettify_1.default(title, lyrics));
    }
    catch (error) {
        spinner.fail();
        throw error;
    }
    finally {
        spinner.stop();
    }
};
