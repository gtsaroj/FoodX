import { makeRequest } from "../makeRequest";
import { LogCardProps } from "../models/log.model";

export const addLogs = async (data: LogCardProps) => {
    try {
      const response = await makeRequest({
        method: "post",
        url: "logs/add-logs",
        data: { ...data },
      });
      return response.data;
    } catch (error) {
      throw new Error("Unable to fetch action logs" + error);
    }
  };