import { Ticket, NewTicket } from "../../models/ticket.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addTicketToFirestore = async (ticket: Ticket) => {
  if (!ticket) throw new ApiError(401, "No data to update the database.");
  const ticketRef = db.collection("ticket");
  if (!ticketRef) throw new ApiError(501, "No document found.");
  try {
    const { uid, title, description, status, category, date } = ticket;
    const id = "";
    await ticketRef
      .add({ id, uid, title, description, status, category, date })
      .then((docRef) => docRef.update({ id: docRef.id }));
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

const getAllTicketFromFirestore = async () => {
  const ticketRef = db.collection("ticket");
  try {
    const tickets: NewTicket[] = [];
    const docs = await ticketRef.get();
    if (!docs) throw new ApiError(404, "No document found.");
    docs.forEach((doc) => {
      tickets.push(doc.data() as NewTicket);
    });

    return tickets as NewTicket[];
  } catch (error) {
    throw new ApiError(440, "No tickets found.");
  }
};

const getTicketByStatusFromFirestore = async (
  status: "Pending" | "Resolved" | "Rejected"
) => {
  const ticketRef = db.collection("ticket");
  try {
    const tickets: NewTicket[] = [];
    const query = await ticketRef.where("status", "==", status).get();
    if (query.empty) return tickets;
    query.docs.forEach((doc) => {
      const data = doc.data() as NewTicket;
      tickets.push(data);
    });
    return tickets;
  } catch (error) {
    throw new ApiError(440, "No tickets found.");
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
  getAllTicketFromFirestore,
  updateTicketInFirestore,
  deleteTicketFromDatabase,
  getTicketByStatusFromFirestore,
};
