import { type Logger } from "./logger-manager";

export const testLogger = (): Logger => ({
  info: (_message: string): Promise<void> => Promise.resolve(),
  error: (_message: Error): Promise<void> => Promise.resolve(),
});
