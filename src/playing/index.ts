import { platform } from 'os';
import * as darwin from './darwin';
import { Players, PlayerResults } from './types';

const commands = {
  darwin: darwin.current,
};

export const current = async (player: Players): PlayerResults => {
  const command = commands[platform()];
  const output = typeof command === 'function' ? command(player) : null;
  return output;
};
