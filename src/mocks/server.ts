import { defaultHandlers, errorHandlers } from "./handlers/errors";
import { gameHandlers } from "./handlers/games";
import { logHandlers } from "./handlers/logs";
import { setupServer } from "msw/node";

export const server = setupServer(...gameHandlers, ...errorHandlers, ...defaultHandlers, ...logHandlers);
