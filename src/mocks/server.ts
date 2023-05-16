import { setupServer } from "msw/node";
import { gameHandlers } from "./handlers/games";
import { errorHandlers } from "./handlers/errors";

export const server = setupServer(...gameHandlers, ...errorHandlers);

