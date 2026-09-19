export type Result<T, E> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}
