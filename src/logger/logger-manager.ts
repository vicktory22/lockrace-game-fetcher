import { AppConfig } from "../config/config-manager";
import { isTestEnv } from "../utils/testing-setup";
import { lokiLogger } from "./loki-logger";
import { testLogger } from "./test-logger";

export type Logger = {
  info: (message: string) => Promise<void>;
  error: (message: Error) => Promise<void>;
};

export const getLogger = (config: AppConfig) => {
  if (isTestEnv()) {
    return testLogger();
  }

  return lokiLogger(config);
};
