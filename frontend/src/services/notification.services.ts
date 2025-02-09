import { makeRequest } from "../makeRequest";


export const addNotification = async ({
  userId,
  message,
  title,
}: Actions.AddNotification) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "notification/add",
      data: { userId, message, title },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Error while adding notification " + error);
  }
};
export const fetchNotifications = async ({
  currentFirstDoc,
  currentLastDoc,
  pageSize,
  sort,
  uid,
  direction,
}: Api.FetchNotification) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "notification/fetch",
      data: {
        currentFirstDoc,
        currentLastDoc,
        pageSize,
        sort,
        uid,
        direction,
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Error while fetching notification " + error);
  }
};
export const deleteNotification = async ({ id }: Actions.DeleteNotification) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "notification/delete",
      data: { id },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Error while deleting notification " + error);
  }
};
