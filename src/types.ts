export type GetGamesResponse = {
  day: string;
  games: Game[];
};

export type Game = {
  id: number;
  home_team_id: number;
  away_team_id: number;
  game_time: string;
  home_odds: number | undefined;
  away_odds: number | undefined;
  home_score: number | undefined;
  away_score: number | undefined;
};
