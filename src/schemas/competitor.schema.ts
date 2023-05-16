import { z } from "zod";

export const Competitor = z.object({
  team: z.object({
    id: z.string(),
  }),
});
