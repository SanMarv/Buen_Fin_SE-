import z from "zod"

const ERRORS_ENUM = {
  not_string: "NOT_STRING",
  not_provided: "NOT_PROVIDED",
  max: "TOO_LARGE",
  special_char: "SPECIAL_CHARACTER",
} as const

const ERRORS_PASS = {
  not_provided: "PASSWORD_NOT_PROVIDED",
  password_short: "PASSWORD_SHORT"
} as const

export type ERRORS_NAME = typeof ERRORS_ENUM[keyof typeof ERRORS_ENUM]
export type ERRORS_PASSWORD = typeof ERRORS_PASS[keyof typeof ERRORS_PASS]

const name = z.string(ERRORS_ENUM.not_string).min(1, ERRORS_ENUM.not_provided).max(30, ERRORS_ENUM.max).regex(/^[\p{L}\p{M}\s'-]+$/u, ERRORS_ENUM.special_char)// ask ai for regex that checks for special caracters like $,#... etc

export const userRegisterInput = z.object({
  email: z.email("INVALID_EMAIL"),
  name,
  lastname: name,
  password: z.string(ERRORS_PASS.not_provided).min(8, ERRORS_PASS.password_short) // TODO extra config for password
})

export type UserRegisterInput = z.infer<typeof userRegisterInput>
