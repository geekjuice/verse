export type DarwinPlayers = 'spotify' | 'itunes';

export type Players = DarwinPlayers;

export type PlayerCommand = (player: Players) => Promise<string | null>;

export type PlayerResults = ReturnType<PlayerCommand>;
