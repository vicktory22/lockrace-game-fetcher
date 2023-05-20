import { getGames } from "./games";
import { LoggerManager } from "./logger/logger-manager";
import { encasePromise } from "./result";

export interface Env {
  WORKERS_ENV: string;
  GAMES_URL: string;
  DB: KVNamespace;
}

export default {


  async scheduled(_event: unknown, env: Env, _ctx: unknown) {
    const logger = LoggerManager().getLogger(env.WORKERS_ENV);

    const [getGamesResponse, getGamesError] = await getGames(env.GAMES_URL);

    if (getGamesError) {
      logger.error(getGamesError);
      // TODO - add logging
      return;
    }

    const { day, games } = getGamesResponse;

    const [, saveGamesError] = await encasePromise(env.DB.put(day, JSON.stringify(games)));

    if (saveGamesError) {
      logger.error(saveGamesError);
      // TODO - add logging
      return;
    }
  },

  async fetch(_request: Request, env: Env, _ctx: unknown) {
    const logger = LoggerManager().getLogger(env.WORKERS_ENV);

    const [schduledResult, scheduledError] = await encasePromise(this.scheduled(null, env, null));

    if (scheduledError) {
      logger.error(scheduledError);
      // TODO - add logging
      return new Response("Error", { status: 500 });
    }

    return new Response(JSON.stringify(schduledResult), { status: 200 });
  },
};
