import { errorHandlers } from "./handlers/errors";
import { gameHandlers } from "./handlers/games";
import { setupServer } from "msw/node";

export const server = setupServer(...gameHandlers, ...errorHandlers);
