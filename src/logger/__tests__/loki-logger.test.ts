import { Env } from "../..";
import { getConfig } from "../../config/config-manager";
import { server } from "../../mocks/server";
import { encasePromise } from "../../result";
import { buildLokiMessage, lokiLogger, sendToLoki } from "../loki-logger";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

describe("lokiLogger", () => {
  it("should expose an 'info' and 'error' function", async () => {
    const config = getConfig({ LOKI_URL: "http://localhost/500" } as Env);

    const logger = lokiLogger(config);

    await expect(logger.info("test")).rejects.toThrowError();
    await expect(logger.error(new Error("test"))).rejects.toThrowError();
  });
});

describe("sendToLoki", () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("should handle a 500 response", async () => {
    const config = getConfig({ LOKI_URL: "http://localhost/500" } as Env);

    const [result, error] = await encasePromise(sendToLoki("network error", "error", config));

    expect(result).toBeUndefined();
    expect(error).toMatchInlineSnapshot(
      "[Error: Invalid response received from Loki logging service: [500 - Internal Server Error]]",
    );
  });

  it("should return an error if the fetch fails", async () => {
    const config = getConfig();

    config.lokiUrl = "http://localhost/network-error";

    const [result, error] = await encasePromise(sendToLoki("network error", "error", config));

    expect(result).toBeUndefined();
    expect(error).toMatchInlineSnapshot("[TypeError: fetch failed]");
  });
});

describe("buildLokiMessage", () => {
  it("should return a loki message", () => {
    const message = "test-message";
    const logTime = "1685217141801000000";

    const result = buildLokiMessage(message, "info", logTime);

    expect(result).toMatchInlineSnapshot(`
      {
        "streams": [
          {
            "stream": {
              "app": "game-fetcher",
              "level": "info",
            },
            "values": [
              [
                "1685217141801000000",
                "test-message",
              ],
            ],
          },
        ],
      }
    `);
  });
});
