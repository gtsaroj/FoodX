import { DefaultEventsMap } from "socket.io";
import { UserInfo } from "./user.model.ts";

declare module "socket.io" {
  interface Socket {
    user?: UserInfo;
  }
}
