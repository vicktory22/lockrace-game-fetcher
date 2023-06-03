import { Err, Ok, Result, encasePromise } from "./result";
import { Event } from "./schemas/event.schema";
import { FetchGamesResponse } from "./schemas/fetch-games.schema";
import { Game, GetGamesResponse } from "./types";
import { fetchWithTimeout } from "./utils/fetcher";

export const getGames = async (gamesUrl: string): Promise<Result<GetGamesResponse, Error>> => {
  const [fetchResponse, fetchNetworkError] = await encasePromise(fetchWithTimeout(gamesUrl));

  if (fetchNetworkError) {
    return Err(fetchNetworkError);
  }

  if (!fetchResponse.ok) {
    return Err(new Error(`${fetchResponse.status} - ${fetchResponse.statusText}`));
  }

  const [jsonResponse, jsonParsingError] = await encasePromise<FetchGamesResponse>(fetchResponse.json());

  if (jsonParsingError) {
    return Err(jsonParsingError);
  }

  const [validatedResponse, validationError] = await encasePromise(FetchGamesResponse.parseAsync(jsonResponse));

  if (validationError) {
    return Err(validationError);
  }

  return Ok(parseGamesResponse(validatedResponse));
};

export const parseGamesResponse = (response: FetchGamesResponse): GetGamesResponse => {
  return {
    day: response.day.date,
    games: parseGames(response.events),
  };
};

const parseGames = (games: Event[]): Game[] => games.map(parseGame);

const parseGame = (game: Event): Game => {
  const competition = game.competitions[0];
  const consensusOdds = competition.odds?.find((odd) => odd.provider.name === "consensus");

  const { awayTeamOdds, homeTeamOdds } = consensusOdds || {};
  const [{ team: homeTeam, score: homeTeamScore }, { team: awayTeam, score: awayTeamScore }] = competition.competitors;

  return {
    id: +game.id,
    home_team_id: +homeTeam.id,
    away_team_id: +awayTeam.id,
    game_time: game.date,
    home_odds: homeTeamOdds?.moneyLine,
    away_odds: awayTeamOdds?.moneyLine,
    home_score: homeTeamScore,
    away_score: awayTeamScore,
  };
};
