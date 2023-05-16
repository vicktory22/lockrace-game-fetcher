import { createFixture } from "zod-fixture";
import { FetchGamesResponse } from "../../schemas/fetch-games.schema";

export const generateFetchGamesResponse = () => {
  const fixture = createFixture(FetchGamesResponse);

  fixture.events.forEach((event) => {
    event.competitions.forEach((competition) => {
      competition.odds[0].provider.name = "consensus";
    });
  });

  return fixture;
};
