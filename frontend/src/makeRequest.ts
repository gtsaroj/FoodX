import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";



export const globalRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

makeRequest.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

makeRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;
    console.log(status);
    if (status === 401) {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
          return console.log("Please Login First")
      }
      Cookies.remove("accessToken");
      const response = await makeRequest.post("/users/refresh-token", {
        refreshToken,
      });

      const responseData = response.data.data;
      const newRefreshToken = responseData.refreshToken;
      const newAcessToken = responseData.accessToken;
      Cookies.set("accessToken", newAcessToken);
      let previousRefreshToken = Cookies.get("refreshToken");
      if (previousRefreshToken) {
        Cookies.set("refreshToken", (previousRefreshToken = newRefreshToken));
      }
      //  try with original request
      return makeRequest(error.config);
    }
    if (status === 403) {
      Cookies.remove("refreshToken");
      return Promise.reject("You have not access, please login again...");
    }

    return Promise.reject(error);
  }
);
