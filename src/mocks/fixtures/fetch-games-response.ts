import { FetchGamesResponse } from "../../schemas/fetch-games.schema";
import { assert } from "vitest";
import { createFixture } from "zod-fixture";

export const generateFetchGamesResponse = () => {
  const fixture = createFixture(FetchGamesResponse);

  fixture.events.forEach((event) => {
    event.competitions.forEach((competition) => {
      assert(competition.odds?.[0]?.provider?.name);

      competition.odds[0].provider.name = "consensus";
    });
  });

  return fixture;
};
