import {
  addLogToFirestore,
  getLogsBasedOnActionFromFirestore,
  getLogsOfRolesFromFirestore,
} from "../firebase/db/logs.firestore.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const getLogsBasedOnRoles = asyncHandler(async (req: any, res: any) => {
  const { role }: { role: "customer" | "admin" | "chef" } = req.body;
  try {
    const response = await getLogsOfRolesFromFirestore(`${role}Logs`);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response,
          `${role} Logs fetched successfully`,
          true
        )
      );
  } catch (error) {
    throw new ApiError(
      501,
      "Error fetching logs from database.",
      null,
      error as string[]
    );
  }
});
const getLogsBasedOnAction = asyncHandler(async (req: any, res: any) => {
  const {
    role,
    action,
  }: {
    role: "customer" | "admin" | "chef";
    action:
      | "login"
      | "register"
      | "logout"
      | "create"
      | "update"
      | "delete"
      | "checkout";
  } = req.body;
  try {
    const response = await getLogsBasedOnActionFromFirestore(
      `${role}Logs`,
      action
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          response,
          "Logs fetched successfully based on actions.",
          true
        )
      );
  } catch (error) {
    throw new ApiError(
      501,
      "Error fetching logs from database.",
      null,
      error as string[]
    );
  }
});

const addLogs = asyncHandler(async (req: any, res: any) => {
  const { uid, avatar, role, fullName } = req.user as User;
  const {
    action,
    date,
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
  } = req.body;
  try {
    const response = await addLogToFirestore(
      {
        uid,
        profile: avatar,
        name: fullName,
        action,
        date,
        id: "",
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
    throw new ApiError(
      501,
      "Error adding logs in database.",
      null,
      error as string[]
    );
  }
});
export { getLogsBasedOnRoles, getLogsBasedOnAction, addLogs };
