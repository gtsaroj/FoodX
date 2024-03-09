export class ApiResponse {
  constructor(
    public statusCode: number,
    public data: string | string[] | object,
    public message: string = "Message was successfully send",
    public success: boolean
  ) {
    this.data = data;
    this.message = message;
    this.success = true;
    this.statusCode = statusCode > 399 ? 400 : statusCode;
  }
}
