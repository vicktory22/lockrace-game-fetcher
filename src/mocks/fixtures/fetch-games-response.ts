import { FetchGamesResponse } from "../../schemas/fetch-games.schema";
import { createFixture } from "zod-fixture";

export const generateFetchGamesResponse = () => {
  const fixture = createFixture(FetchGamesResponse);

  fixture.events.forEach((event) => {
    event.competitions.forEach((competition) => {
      competition.odds[0].provider.name = "consensus";
    });
  });

  return fixture;
};
