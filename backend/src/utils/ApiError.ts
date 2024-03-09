class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string = "Something went wrong",
    public data?: null,
    public errors?: string[],
    public stack?: string,
    public success?: boolean
  ) {
    super(message);

    this.statusCode = statusCode > 399 ? statusCode : 400;
    this.errors = errors;
    this.message = message;
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack  = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
