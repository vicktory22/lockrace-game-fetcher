import { getConfig } from "../../config/config-manager";
import { server } from "../../mocks/server";
import { encasePromise } from "../../result";
import { buildLokiMessage, sendToLoki } from "../loki-logger";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

describe("loki-logger", () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  it("should return an error if the fetch fails", async () => {
    const config = getConfig();

    config.lokiUrl = "http://localhost/network-error";

    const [result, error] = await encasePromise(sendToLoki("network error", "error", config));

    expect(error).toMatchInlineSnapshot("[TypeError: fetch failed]");
    expect(result).toBeUndefined();
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
              "app": "lockrace",
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
