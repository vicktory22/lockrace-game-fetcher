/* c8 ignore start */
import { rest } from "msw";

export const logHandlers = [
  rest.post(import.meta.env.VITE_LOKI_URL, (_req, res, ctx) => {
    return res(ctx.status(204), ctx.set("content-type", "application/json"));
  }),
];
/* c8 ignore stop */
