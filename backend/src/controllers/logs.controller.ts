import {
  addLogToFirestore,
  getLogsFromDatabase,
} from "../firebase/db/logs.firestore.js";
import { getUserFromDatabase } from "../firebase/db/user.firestore.js";
import { logProps } from "../models/logs.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const addLogs = asyncHandler(async (req: any, res: any) => {
  const {
    action,
    date,
    detail,
    userId,
    userRole,
  }: {
    action:
      | "login"
      | "register"
      | "logout"
      | "create"
      | "update"
      | "delete"
      | "checkout";
    date: Date;
    detail?: string;
    userId?: string;
    userRole?: "customer" | "admin" | "chef";
  } = req.body;

  try {
    if (userId && userRole && (action === "login" || action === "register")) {
      var { uid, avatar, role, fullName } = await getUserFromDatabase(
        userId,
        userRole
      );
    } else {
      var { uid, avatar, role, fullName } = req.user as User;
    }
    const response = await addLogToFirestore(
      {
        uid,
        profile: avatar,
        name: fullName,
        action,
        date,
        id: "",
        detail,
      },
      `${role}Logs`
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { response },
          "Logs fetched successfully based on actions.",
          true
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Error adding logs in database.",
          null,
          error as string[]
        )
      );
  }
});
const fetchLogs = asyncHandler(async (req: any, res: any) => {
  let {
    path,
    pageSize,
    filter,
    sort,
    direction,
    currentFirstDoc,
    currentLastDoc,
    action,
  }: {
    path: "adminLogs" | "chefLogs" | "customerLogs";
    pageSize: number;
    filter: keyof logProps;
    sort: "asc" | "desc";
    currentFirstDoc: any | null;
    currentLastDoc: any | null;
    direction?: "prev" | "next";
    action?:
      | "login"
      | "register"
      | "logout"
      | "create"
      | "update"
      | "delete"
      | "checkout";
  } = req.body;

  try {
    let { logs, firstDoc, lastDoc, length } = await getLogsFromDatabase(
      path,
      pageSize,
      filter,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      action ? action : undefined
    );
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { logs, currentFirstDoc: firstDoc, currentLastDoc: lastDoc, length },
          "Successfully fetched logs from database",
          true
        )
      );
  } catch (error) {
    throw new ApiError(
      401,
      "Something went wrong while fetching logs from database",
      null,
      error as string[]
    );
  }
});

export { addLogs, fetchLogs };
