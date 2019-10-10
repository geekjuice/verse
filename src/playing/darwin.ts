import { exec } from 'child_process';
import { promisify } from 'util';
import { DarwinPlayers, PlayerCommand, PlayerResults } from './types';

const execute = promisify(exec);

type ExecuteResult = Promise<{ stdout: string; stderr: string }>;

const osascript = async (command: string): ExecuteResult =>
  execute(`osascript -e '${command}'`);

const running = async (player: DarwinPlayers): Promise<boolean> => {
  const { stdout } = await osascript(
    `tell app "System Events" to (name of processes) contains "${player}"`
  );
  return /true/.test(stdout);
};

const check = (callback: PlayerCommand): PlayerCommand => async (
  player: DarwinPlayers
): PlayerResults => {
  const active = await running(player);
  return active ? callback(player) : null;
};

const get = async (player: DarwinPlayers, command: string): ExecuteResult =>
  osascript(`tell app "${player}" to (${command}) as string`);

export const current = check(
  async (player: DarwinPlayers): PlayerResults => {
    const [{ stdout: artist }, { stdout: name }] = await Promise.all([
      get(player, 'artist of current track'),
      get(player, 'name of current track'),
    ]);
    return `${name.trim()} - ${artist.trim()}`;
  }
);
