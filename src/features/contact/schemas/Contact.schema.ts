import { z } from "zod";

export const createContactSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).min(1, {
    message: "Email is required",
  }),
});

export type CreateContact = z.infer<typeof createContactSchema>;
