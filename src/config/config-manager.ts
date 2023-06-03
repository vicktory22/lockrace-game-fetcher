/* c8 ignore start */
import { Env } from "../index";

export type AppConfig = {
  gamesUrl: string;
  lokiUrl: string;
  lokiBasicAuthToken: string;
};

export const getConfig = (env?: Env): AppConfig => {
  if (import.meta.env.NODE_ENV === "test") {
    return testConfig(env);
  }

  if (!env) {
    return getFromMeta();
  }

  return getFromEnv(env);
};

const testConfig = (env?: Env): AppConfig => ({
  gamesUrl: env?.GAMES_URL || "http://localhost/games/200",
  lokiUrl: env?.LOKI_URL || "http://localhost/200",
  lokiBasicAuthToken: "test-loki-auth-token",
});

const getFromMeta = (): AppConfig => {
  const { VITE_GAMES_URL, VITE_LOKI_URL, VITE_LOKI_USER, VITE_LOKI_API_KEY } = import.meta.env;

  return {
    gamesUrl: VITE_GAMES_URL,
    lokiUrl: VITE_LOKI_URL,
    lokiBasicAuthToken: createToken(VITE_LOKI_USER, VITE_LOKI_API_KEY),
  };
};

const getFromEnv = (env: Env): AppConfig => {
  const { GAMES_URL, LOKI_URL, LOKI_USER, LOKI_API_KEY } = env;

  return {
    gamesUrl: GAMES_URL,
    lokiUrl: LOKI_URL,
    lokiBasicAuthToken: createToken(LOKI_USER, LOKI_API_KEY),
  };
};

const createToken = (user: string, apiKey: string): string => btoa(`${user}:${apiKey}`);
/* c8 ignore end */
