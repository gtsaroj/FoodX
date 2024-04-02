import axios from "axios";

export const globalRequest = axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
});
