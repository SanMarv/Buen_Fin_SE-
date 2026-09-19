export class BucketError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(BucketError.defineError(status));

    this.name = "BucketError";
    this.status = status;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  private static defineError(status: number): string {
    const errors: Record<number, string> = {
      // Client errors
      400: "Invalid bucket request",
      401: "Authentication required",
      403: "Permission denied",
      404: "Bucket or key not found",
      405: "Method not allowed",
      406: "Requested response format is not supported",
      408: "Bucket request timed out",
      409: "Bucket operation conflict",
      410: "Bucket or key is no longer available",
      412: "Bucket request precondition failed",
      413: "Uploaded object is too large",
      415: "Unsupported object content type",
      416: "Requested object range is not satisfiable",
      422: "Bucket request could not be processed",
      429: "Too many bucket requests",

      // Server errors
      500: "Bucket service encountered an internal error",
      501: "Bucket operation is not implemented",
      502: "Bucket service received an invalid response",
      503: "Bucket service is temporarily unavailable",
      504: "Bucket service request timed out",
    };

    return errors[status] ?? `Bucket request failed with status ${status}`;
  }
}
