import { Err, Ok, Result, encasePromise } from "./result";
import { Event } from "./schemas/event.schema";
import { FetchGamesResponse } from "./schemas/fetch-games.schema";
import { Game, GetGamesResponse } from "./types";

export const getGames = async (gamesUrl: string): Promise<Result<GetGamesResponse, Error>> => {
  const [fetchResponse, fetchNetworkError] = await encasePromise(fetch(gamesUrl));

  if (fetchNetworkError) {
    // TODO - add logging
    return Err(fetchNetworkError);
  }

  if (!fetchResponse.ok) {
    // TODO - add logging
    return Err(new Error(`${fetchResponse.status} - ${fetchResponse.statusText}`));
  }

  const [jsonResponse, jsonParsingError] = await encasePromise<FetchGamesResponse>(fetchResponse.json());

  if (jsonParsingError) {
    // TODO - add logging
    return Err(jsonParsingError);
  }

  const [validatedResponse, validationError] = await encasePromise(FetchGamesResponse.parseAsync(jsonResponse));

  if (validationError) {
    // TODO - add logging
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
  const consensusOdds = competition.odds.find((odd) => odd.provider.name === "consensus");

  /* c8 ignore next 4 */
  // coverage for this proivded in zod schema
  if (!consensusOdds) {
    throw new Error("No consensus odds provider found");
  }

  const { awayTeamOdds, homeTeamOdds } = consensusOdds;
  const [{ team: homeTeam }, { team: awayTeam }] = competition.competitors;

  return {
    id: +game.id,
    home_team_id: +homeTeam.id,
    away_team_id: +awayTeam.id,
    game_time: game.date,
    home_odds: homeTeamOdds?.moneyLine,
    away_odds: awayTeamOdds?.moneyLine,
    home_score: undefined,
    away_score: undefined,
  };
};
