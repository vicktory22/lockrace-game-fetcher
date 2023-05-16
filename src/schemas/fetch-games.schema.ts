import { Event } from "./event.schema";
import { z } from "zod";

export type FetchGamesResponse = z.infer<typeof FetchGamesResponse>;

export const FetchGamesResponse = z.object({
  events: z.array(Event),
  day: z.object({
    date: z.string(),
  }),
});
