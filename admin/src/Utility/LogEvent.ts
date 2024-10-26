export class LogEvent {
  constructor(
    public action: "Logging" | "Register" | "Create" | "Update" | "Delete",
    public message: string = "Message was successfully send",
    public uid: string,
    public success: boolean,
    public timestamp: Date,
    public data?: string | string[] | object
  ) {
    this.data = data;
    this.message = message;
    this.success = true;
    this.action = action;
    this.uid = uid;
    this.timestamp = timestamp;
  }
}
