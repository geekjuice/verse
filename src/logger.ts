import debug from 'debug';

type Logger = {
  log: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

const key = (...suffix: string[]): string => ['verse', ...suffix].join(':');

export const create = (suffix: string): Logger => ({
  log: debug(key(suffix)),
  warn: debug(key(suffix, 'warn')),
  error: debug(key(suffix, 'error')),
});
