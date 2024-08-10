import { logProps } from "../../models/logs.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc } from "../utils.js";

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
        detail: detail || "",
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
const getLogsFromDatabase = async (
  path: "adminLogs" | "chefLogs" | "customerLogs",
  pageSize: number,
  filter: keyof logProps,
  sort: "asc" | "desc" = "asc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  action?:
    | "login"
    | "register"
    | "logout"
    | "create"
    | "update"
    | "delete"
    | "checkout"
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      path,
      filter,
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction
    );
    let logsDoc;
    if (action) {
      logsDoc = await query.where("action", "==", action).get();
    } else {
      logsDoc = await query.get();
    }
    const logs: logProps[] = [];

    logsDoc.docs.forEach((doc) => {
      logs.push(doc.data() as logProps);
    });

    const firstDoc = logsDoc.docs[0]?.data().id || null;
    const lastDoc = logsDoc.docs[logsDoc.docs.length - 1]?.data().id || null;
    return {
      logs,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error fetching products from database.",
      null,
      error as string[]
    );
  }
};
export {
  addLogToFirestore,
  getLogsOfRolesFromFirestore,
  getLogsBasedOnActionFromFirestore,
  getLogsFromDatabase,
};
