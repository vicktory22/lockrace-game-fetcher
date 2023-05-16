import { getGames } from "./games";
import { encasePromise } from "./result";

export interface Env {
  GAMES_URL: string;
  DB: KVNamespace;
}

export default {
  async scheduled(_event: unknown, env: Env, _ctx: unknown) {
    const [getGamesResponse, getGamesError] = await getGames(env.GAMES_URL);

    if (getGamesError) {
      // TODO - add logging
      return;
    }

    const { day, games } = getGamesResponse;

    const [, saveGamesError] = await encasePromise(env.DB.put(day, JSON.stringify(games)));

    if (saveGamesError) {
      // TODO - add logging
      return;
    }
  },
};
