import { logProps } from "../../models/logs.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addLogToFirestore = async (
  logs: logProps,
  role: "adminLogs" | "customerLogs" | "chefLogs"
) => {
  const logDocRef = db.collection(role);
  if (!logDocRef) throw new ApiError(404, `Couldn't find ${role} collection.`);
  try {
    const { uid, name, profile, detail, date, action } = logs;
    await logDocRef
      .add({
        id: "",
        uid,
        name,
        profile,
        detail,
        date,
        action,
      })
      .then((docRef) => {
        docRef.update({
          id: docRef.id,
        });
      });
  } catch (err) {
    throw new ApiError(400, "Unable to add logs in database.");
  }
};

const getLogsOfRolesFromFirestore = async (
  role: "adminLogs" | "customerLogs" | "chefLogs"
) => {
  const logDocRef = db.collection(role);
  if (!logDocRef) throw new ApiError(404, `Couldn't find ${role} collection.`);
  const logs: logProps[] = [];
  try {
    const logRef = await logDocRef.get();
    if (logRef.empty) {
      throw new ApiError(404, "Couldn't find logs.");
    }
    logRef.forEach((doc) => {
      const log = doc.data() as logProps;
      logs.push(log);
    });
    return logs;
  } catch (error) {
    throw new ApiError(400, "Unable to get logs based on roles from database.");
  }
};

const getLogsBasedOnActionFromFirestore = async (
  role: "adminLogs" | "customerLogs" | "chefLogs",
  action:
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout"
) => {
  const logDocRef = db.collection(role);
  if (!logDocRef) throw new ApiError(404, `Couldn't find ${role} collection.`);
  const logs: logProps[] = [];
  try {
    const logQuery = await logDocRef.where("action", "==", action).get();
    if (logQuery.empty)
      throw new ApiError(404, "Couldn't find action based logs from database.");
    logQuery.docs.forEach((doc) => {
      const log = doc.data() as logProps;
      logs.push(log);
    });
    return logs;
  } catch (error) {
    throw new ApiError(
      500,
      "Error while getting logs based on action from database."
    );
  }
};

const deleteAllLogs = async (
  role: "adminLogs" | "customerLogs" | "chefLogs"
) => {
  const logDocRef = db.collection(role);
  if (!logDocRef) throw new ApiError(404, `Couldn't find ${role} collection.`);
  try {
  } catch (error) {
    throw new ApiError(500, "Error deleting logs from database.");
  }
};

export {
  addLogToFirestore,
  getLogsOfRolesFromFirestore,
  getLogsBasedOnActionFromFirestore,
};
