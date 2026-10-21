import type { ResponseLocals } from "@backend/types.js";
import type { Response } from "express";
import { VISIBILITY } from "@db/enums.js";
import z from "zod";

export const checkVisibility = z.object(
  {
    visibility: z.enum(
      [VISIBILITY.public, VISIBILITY.private],
      "INVALID_VALUE",
    ),
  },
  "INVALID_VALUE",
);
export type RequestWithVisibilty<
  Key extends PropertyKey,
  T extends Response = Response,
> = ResponseLocals<
  { [K in Key]: z.infer<typeof checkVisibility> } & T["locals"]
>;

export const checkRequestParameter = (key: string, data: unknown) => {
  const result = z
    .object({
      [key]: z.uuidv7(),
    })
    .safeParse(data);
  if (!result.success) return result;
  return { ...result, data: result.data[key] };
};

export const checkRequestParameterV4 = (key: string, data: unknown) => {
  const result = z
    .object({
      [key]: z.uuidv4(),
    })
    .safeParse(data);
  if (!result.success) return result;
  return { ...result, data: result.data[key] };
};
