import chalk from 'chalk';

const { cyan, magenta } = chalk;

const NEWLINE = '\n';

const format = (lyrics: string): string =>
  lyrics.trim().replace(/\[.+\]/g, match => magenta(match));

export default (title: string, lyrics: string): string =>
  [NEWLINE, cyan(title), NEWLINE, format(lyrics)].join(NEWLINE);
