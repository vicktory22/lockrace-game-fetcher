import { AppConfig } from "../config/config-manager";
import { lokiLogger } from "./loki-logger";

export const getLogger = (config: AppConfig) => lokiLogger(config);
