import axios from "axios";
import Cookies from "js-cookie";

const accessToken = Cookies.get("accessToken");
export const makeRequest = () =>
  axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": "application/json",
    },
  });
