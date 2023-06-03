/* c8 ignore start */
import { rest } from "msw";

export const errorHandlers = [
  rest.get("http://localhost/500", (_req, res, ctx) => {
    return res(ctx.status(500));
  }),

  rest.post("http://localhost/500", (_req, res, ctx) => {
    return res(ctx.status(500));
  }),

  rest.get("http://localhost/network-error", (_req, res, _ctx) => {
    return res.networkError("Failed to connect");
  }),
];

export const defaultHandlers = [
  rest.post("http://localhost/200", (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
/* c8 ignore stop */
