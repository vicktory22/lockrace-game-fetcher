import { AppConfig } from "../config/config-manager";
import { encasePromise } from "../result";
import { fetchWithTimeout } from "../utils/fetcher";
import { type Logger } from "./logger-manager";

export const lokiLogger = (config: AppConfig): Logger => {
  return {
    info: (message: string) => sendToLoki(message, "info", config),
    error: (error: Error) => sendToLoki(error.message, "error", config),
  };
};

export const sendToLoki = async (message: string, level: string, config: AppConfig): Promise<void> => {
  const nanoseconds = String(Date.now() * 1e6);

  const [fetchResponse, fetchNetworkError] = await encasePromise(
    fetchWithTimeout(config.lokiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${config.lokiBasicAuthToken}`,
      },
      body: JSON.stringify(buildLokiMessage(message, level, nanoseconds)),
    }),
  );

  if (fetchNetworkError) {
    throw fetchNetworkError;
  }

  if (!fetchResponse.ok) {
    throw new Error(
      `Invalid response received from Loki logging service: [${fetchResponse.status} - ${fetchResponse.statusText}]`,
    );
  }
};

export const buildLokiMessage = (message: string, level: string, nanoseconds: string) => ({
  streams: [
    {
      stream: {
        level,
        app: "game-fetcher",
      },
      values: [[nanoseconds, message]],
    },
  ],
});
