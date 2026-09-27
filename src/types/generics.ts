export type Result<T, E> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}

export type NoContentResult =
  | { success: true; status: 204; error?: never }
  | { success: false; status: number; error: string };

export function successNoContent(): NoContentResult {
  return { success: true, status: 204 };
}

export function noContentError({
  status,
  error,
}: {
  status: number;
  error: string;
}): NoContentResult {
  return { success: false, status, error };
}
