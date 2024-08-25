import { makeRequest } from "../makeRequest";
import { GetLogProp, LogCardProps } from "../models/log.model";

// log
export const getRoleLogs = async () => {
    try {
      const response = await makeRequest({
        method: "get",
        url: "logs/get-role-logs",
      });
      return response.data;
    } catch (error) {
      throw new Error("Unable to fetch role logs" + error);
    }
  };
  
  export const getLogs = async (data: GetLogProp) => {
    try {
      const response = await makeRequest({
        method: "post",
        url: "logs/get-logs",
        data: { ...data },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to fetch action logs" + error);
    }
  };
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