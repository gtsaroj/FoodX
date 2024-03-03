class ApiError extends Error {
  constructor(
    public data: null,
    public statusCode: number,
    public message: string = "Something went wrong",
    public error: string[],
    public stack: string,
    public success: boolean
  ) {
    super(message);

    (this.statusCode = statusCode > 399 ? statusCode : 400),
      (this.error = error),
      (this.message = message);
    this.data = null;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this);
    }
  }
}

export {ApiError}
