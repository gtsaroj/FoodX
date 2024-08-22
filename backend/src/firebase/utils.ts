import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "./index.js";

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
