import { FieldValue } from "firebase-admin/firestore";
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
          createdAt: FieldValue.serverTimestamp(),
        });
      });
  } catch (error) {
    throw new ApiError(
      400,
      "Unable to add logs in database.",
      null,
      error as string[]
    );
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
export { addLogToFirestore, getLogsFromDatabase };
