import chalk from 'chalk';
import * as ask from './ask';
import { search, scrape } from './genius';
import { create } from './logger';
import prettify from './prettify';
import progress from './progress';

const { cyan } = chalk;

const logger = create('main');

const LYRICS_SELECTOR = '.lyrics';

type Options = {
  token: string;
  select: boolean;
  query: string;
};

export const request = async ({
  token,
  select,
  query,
}: Options): Promise<void> => {
  const spinner = progress().start();

  try {
    spinner.text = `searching genius for '${cyan(query)}'...`;
    logger.log(spinner.text);
    const results = await search(token, query);

    let result = results[0];
    if (select) {
      spinner.stop();
      result = await ask.song(results);
      spinner.start();
    }

    const { title, url } = result;

    spinner.text = `scraping lyrics for '${cyan(title)}'...`;
    logger.log(spinner.text);
    const lyrics = await scrape(url, LYRICS_SELECTOR);

    spinner.stop();

    console.log(prettify(title, lyrics));
  } catch (error) {
    spinner.fail();
    throw error;
  } finally {
    spinner.stop();
  }
};
