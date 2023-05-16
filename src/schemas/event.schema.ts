import { Competition } from "./competition.schema";
import { z } from "zod";

export type Event = z.infer<typeof Event>;

export const Event = z.object({
  id: z.string(),
  date: z.string(),
  competitions: z.array(Competition).max(1).min(1),
});
