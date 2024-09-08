import { ApiError } from "../../utils/ApiError.js";
import { auth } from "../index.js";


export const getUserDataById = async (uid: string) => {
  if (!uid) throw new ApiError(400, "Uid required.");
  try {
    const user = await auth.getUser(uid).then((userData) => {
      const { uid, email, displayName, phoneNumber, photoURL } = userData;
      return {
        uid: uid as string,
        email: email as string,
        fullName: displayName as string,
        phoneNumber: phoneNumber as string,
        avatar: photoURL || "",
        refreshToken: "" as string,
      };
    });
    return user;
  } catch (error) {
    throw new ApiError(401, "Something went wrong.");
  }
};

export const getUserDataByEmail = async (email: string) => {
  if (!email) throw new ApiError(400, "Please enter necessary information.");
  try {
    const user = await auth.getUserByEmail(email).then((userData) => {
      const { uid, email, displayName, phoneNumber, photoURL } = userData;
      return {
        uid: uid as string,
        email: email as string,
        fullName: displayName as string,
        phoneNumber: phoneNumber as string,
        avatar: photoURL || "",
        refreshToken: "" as string,
      };
    });
    return user;
  } catch (err) {
    throw new ApiError(404, "User not found.");
  }
};
export const deleteUserFromFirebase = async (userId: string) => {
  try {
    const deletedUser = await auth.deleteUser(userId);
    return deletedUser;
  } catch (error) {
    throw new ApiError(
      500,
      "Error while deleting user from firebase.",
      null,
      error as string[]
    );
  }
};

export const bulkDeleteUsersFromFirebase = async (userIds: string[]) => {
  try {
    const deletedUsers = await auth.deleteUsers(userIds);
    return deletedUsers;
  } catch (error) {
    throw new ApiError(
      500,
      "Error while deleting users from firebase.",
      null,
      error as string[]
    );
  }
};
