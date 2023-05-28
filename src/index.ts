import { getConfig } from "./config/config-manager";
import { getGames } from "./games";
import { getLogger } from "./logger/logger-manager";
import { encasePromise } from "./result";

export interface Env {
  GAMES_URL: string;
  LOKI_URL: string;
  LOKI_USER: string;
  LOKI_API_KEY: string;
  DB: KVNamespace;
}

export default {
  async scheduled(_event: unknown, env: Env, ctx: ExecutionContext) {
    const config = getConfig(env);
    const logger = getLogger(config);

    const [getGamesResponse, getGamesError] = await getGames(config.gamesUrl);

    if (getGamesError) {
      ctx.waitUntil(logger.error(getGamesError));
      return;
    }

    const { day, games } = getGamesResponse;

    const [, saveGamesError] = await encasePromise(env.DB.put(day, JSON.stringify(games)));

    if (saveGamesError) {
      ctx.waitUntil(logger.error(saveGamesError));
      return;
    }

    ctx.waitUntil(logger.info("Games were pulled successfully"));
  },
};
