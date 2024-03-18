import { User, AccessType } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addUserToFirestore = async (
  user: User,
  access: AccessType["privilage"]
) => {
  if (!user) throw new ApiError(401, "No data to update the database.");
  const customerDocRef = db.collection(access);
  if (!customerDocRef) throw new ApiError(501, "No document found.");
  try {
    await customerDocRef.add(user);
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while adding user to the database."
    );
  }
};

const deleteUserFromFireStore = async (
  uid: string,
  access: AccessType["privilage"]
) => {
  if (!uid) throw new ApiError(400, "UID is required to delete user.");
  const customerDocRef = db.collection(access);

  try {
    const query = customerDocRef.where("uid", "==", uid);
    const doc = await query.get();

    const user = doc.docs[0];
    if (!user.exists) throw new ApiError(404, "User not found.");
    user.ref.delete();
  } catch (error) {
    throw new ApiError(401, "Unable to delete user from database.");
  }
};

const updateUserDataInFirestore = async (
  uid: string,
  access: AccessType["privilage"],
  field: keyof User,
  data: string
) => {
  if (!uid) throw new ApiError(400, "UID is required to update user.");
  const customerDocRef = db.collection(access);
  try {
    const query = customerDocRef.where("uid", "==", uid);
    const doc = await query.get();
    const userDoc = doc.docs[0];
    if (!userDoc.exists) throw new ApiError(404, "User doesnt exist");

    await customerDocRef.doc(userDoc.id).update({
      [`${field}`]: data,
    });
  } catch (error) {
    console.error(error);
    throw new ApiError(400, "Unable to update data.");
  }
};

export {
  addUserToFirestore,
  deleteUserFromFireStore,
  updateUserDataInFirestore,
};
