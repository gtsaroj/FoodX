import { FieldValue } from "firebase-admin/firestore";
import { Ticket, NewTicket } from "../../models/ticket.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";
import { paginateFnc } from "../utils.js";

const addTicketToFirestore = async (ticket: Ticket) => {
  if (!ticket) throw new ApiError(401, "No data to update the database.");
  const ticketRef = db.collection("ticket");
  if (!ticketRef) throw new ApiError(501, "No document found.");
  try {
    const { uid, title, description, status, category, date } = ticket;
    const id = "";
    await ticketRef
      .add({ id, uid, title, description, status, category, date })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: null,
        })
      );
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while adding ticket to the database."
    );
  }
};

const getTicketByIdFromFirestore = async (id: string) => {
  const ticketRef = db.collection("ticket");
  try {
    let tickets: NewTicket[] = [];
    const query = await ticketRef.where("id", "==", id).get();
    const doc = query.docs[0];
    if (query.empty) return { tickets, doc: doc.id };
    query.docs.forEach((doc) => {
      const data = doc.data() as NewTicket;
      tickets.push(data);
    });

    console.log(tickets);
    return { tickets, doc: doc.id };
  } catch (error) {
    throw new ApiError(400, "No ticket found.");
  }
};

const getTicketsFromFirestore = async (
  pageSize: number = 10,
  sort: "asc" | "desc" = "desc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  status?: "pending" | "resolved" | "cancelled",
  uid?: string,
  category?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "ticket",
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction,
      uid,
      undefined,
      undefined,
      status,
      category
    );
    const ticketsDoc = await query.get();

    const tickets: NewTicket[] = [];

    ticketsDoc.docs.forEach((doc) => {
      tickets.push(doc.data() as NewTicket);
    });

    const firstDoc = ticketsDoc.docs[0]?.data().id || null;
    const lastDoc =
      ticketsDoc.docs[ticketsDoc.docs.length - 1]?.data().id || null;
    return {
      tickets,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Error fetching tickets from database.",
      null,
      error as string[]
    );
  }
};

const updateTicketInFirestore = async (
  id: string,
  newData: "Pending" | "Resolved" | "Rejected"
) => {
  const ticketRef = db.collection("ticket");
  if (!ticketRef) throw new ApiError(400, "No collection available.");
  try {
    const res = await getTicketByIdFromFirestore(id);
    console.log(res);

    await ticketRef.doc(res.doc).update({
      [`status`]: newData,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
    throw new ApiError(401, "Unable to update ticket data.");
  }
};
const deleteTicketFromDatabase = async (id: string) => {
  if (!id) throw new ApiError(400, "ID is required to delete ticket.");
  const ticketRef = db.collection("ticket");

  try {
    const query = ticketRef.doc(id);
    const doc = await query.get();
    if (!doc.exists) throw new ApiError(404, "Ticket not found.");
    doc.ref.delete();
  } catch (error) {
    throw new ApiError(401, "Unable to delete ticket from database.");
  }
};
export {
  addTicketToFirestore,
  updateTicketInFirestore,
  deleteTicketFromDatabase,
  getTicketsFromFirestore,
};
