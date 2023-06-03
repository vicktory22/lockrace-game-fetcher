import { getGames } from "../games";
import { server } from "../mocks/server";
import { afterAll, afterEach, assert, beforeAll, describe, expect, it } from "vitest";
import { ZodError } from "zod";

describe("getGames", () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should not return error on success", async () => {
    const [response, error] = await getGames("http://localhost/games/200");

    expect(error).toBeUndefined();
    expect(response).toMatchObject(
      expect.objectContaining({
        day: expect.any(String),
        games: expect.any(Array),
      }),
    );
  });

  it("should return an error if there is a network error", async () => {
    const [response, error] = await getGames("http://localhost/network-error");

    expect(response).toBeUndefined();
    expect(error).toBeDefined();
  });

  it("should return an error if we received an 4xx or 5xx response", async () => {
    const [response, error] = await getGames("http://localhost/500");

    expect(response).toBeUndefined();
    expect(error).toBeDefined();
  });

  it("should return an error if we receive invalid json", async () => {
    const [response, error] = await getGames("http://localhost/games/invalid-response");

    expect(response).toBeUndefined();
    expect(error).toBeDefined();
    expect(error).toBeInstanceOf(ZodError);
  });

  it("should return an error if we error during parsing of the returned json", async () => {
    const [response, error] = await getGames("http://localhost/games/bad-json");

    expect(response).toBeUndefined();
    expect(error).toBeDefined();
  });

  it("should handle when there are no odds in the payload", async () => {
    const [response, error] = await getGames("http://localhost/games/no-odds");

    expect(error).toBeUndefined();

    assert(response);

    const { away_odds, home_odds } = response.games[0];

    expect(away_odds).toBeUndefined();
    expect(home_odds).toBeUndefined();
  });
});
