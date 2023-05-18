import { Competitor } from "./competitor.schema";
import { Odd } from "./odds.schema";
import { z } from "zod";

export type Competition = typeof Competition;

export const Competition = z.object({
  competitors: z.array(Competitor).max(2).min(2),
  odds: z.array(Odd).optional(),
});
