import { FieldValue } from "firebase-admin/firestore";
import { User, AccessType } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const addUserToFirestore = async (user: User, access: AccessType) => {
  if (!user) throw new ApiError(401, "No data to update the database.");
  const customerDocRef = db.collection("users").doc(access.privilage);
  try {
    if (!customerDocRef) throw new ApiError(501, "No document found.");
    await customerDocRef.update({
      users: FieldValue.arrayUnion(user),
    });
    console.log("successfully add user")
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while adding user to the database."
    );
  }
};

const deleteUserFromFireStore = async (uid: string, access: AccessType) => {
  if (!uid) throw new ApiError(400, "UID is required to delete user.");
  const customerDocRef = db.collection("users").doc(access.privilage);

  try {
    const doc = await customerDocRef.get();
    if (!doc.exists) throw new ApiError(404, "Document doesn't exist.");

    //get data from database in a proper format
    const docData = doc.data();
    const userData = docData?.users as User[];

    //find and remove user from the array of users
    const deleteFoundUser = userData.find((user) => user.uid === uid);
    if (!deleteFoundUser) throw new ApiError(404, "User not found");
    await customerDocRef.update({
      users: FieldValue.arrayRemove(deleteFoundUser),
    });
  } catch (error) {
    throw new ApiError(401, "Unable to delete user from database.");
  }
};

const updateUserDataInFirestore = async (
  uid: string,
  access: AccessType,
  field: keyof User,
  data: string
) => {
  if (!uid) throw new ApiError(400, "UID is required to update user.");
  const customerDocRef = db.collection("users").doc(access.privilage);
  try {
    const doc = await customerDocRef.get();
    if (!doc.exists) throw new ApiError(404, "Document doesn't exist.");

    const docData = doc.data();
    const userData = docData?.users as User[];

    const foundUser = userData.find((user) => user.uid === uid);
    if (!foundUser) throw new ApiError(401, "User not found to update.");

    foundUser[`${field}`] = data;
    await customerDocRef.update({
      users: userData,
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
