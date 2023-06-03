import { generateFetchGamesResponse } from "../fixtures/fetch-games-response";
import { rest } from "msw";

export const gameHandlers = [
  rest.get("http://localhost/games/200", (_req, res, ctx) => {
    const fetchGamesResponse = generateFetchGamesResponse();
    return res(ctx.json(fetchGamesResponse));
  }),

  rest.get("http://localhost/games/bad-json", (_req, res, ctx) => {
    return res(ctx.text("<html></html>"));
  }),

  rest.get("http://localhost/games/invalid-response", (_req, res, ctx) => {
    return res(ctx.json(invalidGame));
  }),

  rest.get("http://localhost/games/no-odds", (_req, res, ctx) => {
    const fetchGamesResponse = generateFetchGamesResponse();
    fetchGamesResponse.events[0].competitions[0].odds = undefined;
    return res(ctx.json(fetchGamesResponse));
  }),
];

const invalidGame = {
  day: {
    date: "2023-05-12",
  },
  events: "this should be a list of events",
};
