import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "./index.js";
import { ApiError } from "../utils/ApiError.js";

export const paginateFnc = async (
  collection: string,
  orderBy: string,
  startAfterDoc: QueryDocumentSnapshot | null = null,
  startAtDoc: QueryDocumentSnapshot | null = null,
  pageSize: number = 10,
  sort: "asc" | "desc" = "asc",
  direction?: "prev" | "next"
) => {
  let query = db.collection(collection).orderBy(orderBy, sort);
  const lengthOfDoc = await query.get();
  const totalLength = lengthOfDoc.size;
  console.log(`Length in number : -> ${totalLength}`);
  if (direction === "next" && startAfterDoc) {
    query = query.startAfter(startAfterDoc).limit(pageSize);
  } else if (direction === "prev" && startAtDoc) {
    query = query.endBefore(startAtDoc).limitToLast(pageSize);
  } else {
    query = query.limit(pageSize);
  }
  return { query, totalLength } as {
    query: FirebaseFirestore.Query<
      FirebaseFirestore.DocumentData,
      FirebaseFirestore.DocumentData
    >;
    totalLength: number;
  };
};

export const searchItemInDatabase = async (
  collection: string,
  query: string,
  fieldName: string,
  limit: number = 10
) => {
  try {
    const snapshot = await db
      .collection(collection)
      .where(fieldName, ">=", query)
      .where(fieldName, "<=", query + "\uf8ff")
      .limit(limit)
      .get();
    return snapshot;
  } catch (error) {
    throw new ApiError(
      500,
      "Eror while searching item in database.",
      null,
      error as string[]
    );
  }
};
