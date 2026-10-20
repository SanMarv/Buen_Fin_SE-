import z from "zod";

export const errorSchema = z.object({ status: z.number(), error: z.string() });

export type ApiError = z.infer<typeof errorSchema>;
