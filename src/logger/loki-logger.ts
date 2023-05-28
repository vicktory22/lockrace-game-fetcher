import { AppConfig } from "../config/config-manager";
import { encasePromise } from "../result";
import { fetchWithTimeout } from "../utils/fetcher";

export const lokiLogger = (config: AppConfig) => {
  return {
    info: (message: string) => sendToLoki(message, "info", config),
    error: (error: Error) => sendToLoki(error.message, "error", config),
  };
};

export const sendToLoki = async (payload: string, level: string, config: AppConfig): Promise<void> => {
  const URL = config.lokiUrl;

  const nanoseconds = String(Date.now() * 1e6);

  const message = JSON.stringify(buildLokiMessage(payload, level, nanoseconds));

  const [fetchResponse, fetchNetworkError] = await encasePromise(
    fetchWithTimeout(URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Basic ${config.lokiBasicAuthToken}`,
      },
      body: message,
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
        app: "lockrace",
      },
      values: [[nanoseconds, message]],
    },
  ],
});
