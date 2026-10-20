export class ApiError extends Error {
  status: number
  error: string
  constructor(status: number, error: string) {
    super('Server Error')
    this.status = status
    this.error = error
    this.cause = error
  }
}
