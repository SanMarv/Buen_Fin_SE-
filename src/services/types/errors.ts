export type ErrorFormat = { status: number; error: string };

export const ERROR_CODES = {
  NOT_FOUND: { status: 404, error: "Record not found" },
  INCOMPLETE: { status: 400, error: "Bad request" },
  UNAUTHORIZED: { status: 401, error: "Unauthorized access request" },
  FORBIDDEN: { status: 403, error: "Forbidden request" },
  TOO_LARGE: { status: 413, error: "Content is too large" },
  TIMEOUT: { status: 408, error: "Request timeout" },
  NOT_SUPPORTED: { status: 415, error: "File type not supported" },
  SERVER_ERROR: { status: 500, error: "Unexpected server error" },
  BAD_GATEWAY: { status: 502, error: "Bad Gateway" },
} satisfies Record<string, ErrorFormat>;

export function MakeError(error: keyof typeof ERROR_CODES) {
  return ERROR_CODES[error];
}
