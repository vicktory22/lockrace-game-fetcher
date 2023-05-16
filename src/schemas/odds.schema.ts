import { z } from "zod";

export const Odd = z.object({
  provider: z.object({
    name: z.string(),
  }),
  homeTeamOdds: z.object({
    moneyLine: z.number(),
  }),
  awayTeamOdds: z.object({
    moneyLine: z.number(),
  }),
});
