import { readFile, writeFile } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { promisify } from 'util';
import * as ask from './ask';
import { NODE_ENV, GENIUS_ACCESS_TOKEN } from './env';
import { create } from './logger';

const logger = create('auth');

const read = promisify(readFile);
const write = promisify(writeFile);

const DEFAULT_CONFIG = join(homedir(), '.verse');

const getConfigPath = (filepath: string = DEFAULT_CONFIG): string => {
  logger.log(`resolving path for '${filepath}'`);
  const normalized = filepath.startsWith('~')
    ? filepath.replace(/^~/, homedir())
    : filepath;
  return resolve(normalized);
};

export const get = async (
  filepath: string | undefined
): Promise<string | null> => {
  if (NODE_ENV === 'development' && GENIUS_ACCESS_TOKEN) {
    logger.log('using genius token from environment');
    return GENIUS_ACCESS_TOKEN;
  }

  const configPath = getConfigPath(filepath);

  try {
    logger.log('reading token from config');
    const config = await read(configPath);

    if (config) {
      logger.log('genius token found');
      return config.toString();
    }

    logger.log('no config found');
  } catch (error) {
    logger.error('failed to read config');
  }

  logger.warn(`no genius token found`);
  return null;
};

export const set = async (
  filepath: string | undefined,
  token: string
): Promise<void> => {
  const configPath = getConfigPath(filepath);

  try {
    logger.log(`writing token to '${configPath}'`);
    await write(configPath, token);
  } catch (error) {
    logger.error(`failed to write config`);
  }
};

export const reset = async (filepath: string | undefined): Promise<void> => {
  logger.log(`clearing genius token`);
  await set(filepath, '');
};

export const ensure = async (filepath: string | undefined): Promise<string> => {
  logger.log(`ensuring genius token`);

  const cached = await get(filepath);

  if (cached) {
    logger.log(`using cached genius token`);
    return cached;
  }

  const token = await ask.token();

  await set(filepath, token);

  return token;
};
