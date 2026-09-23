export class UnexpectedError extends Error {
  constructor(cause: string) {
    const mss = `Unexpected Error in: ${cause}`;
    super(mss);
  }
}
