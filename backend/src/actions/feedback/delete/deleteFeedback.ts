import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const deleteFeedbackFromDatabase = async (id: string) => {
  const feedbackRef = db.collection("feedback");
  if (!feedbackRef) throw new APIError("No feedback collection found.", 404);
  try {
    await feedbackRef.doc(id).delete();
    return id;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to get feedback from database. " + error, 500);
  }
};
