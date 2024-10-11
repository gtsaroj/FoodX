import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Store } from "./Store";
import { authLogout } from "./Reducer/user.reducer";

export const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

makeRequest.interceptors.request.use(async (config) => {
  const accessToken = Cookies.get("accessToken");
  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

makeRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        Store.dispatch(authLogout());
        toast.error("Your session was expired")
        return Promise.reject("You have not access, please login again...");
      }
      Cookies.remove("accessToken");
      console.log(
        `==================STEP-1===================================`
      );
      const response = await makeRequest.post("/users/refresh-token", {
        refreshToken,
      });

      const responseData = await response.data.data;
      const newRefreshToken = await responseData.refreshToken;
      const newAcessToken = await responseData.accessToken;
      Cookies.set("accessToken", newAcessToken);
      let previousRefreshToken = Cookies.get("refreshToken");
      if (previousRefreshToken) {
        Cookies.set("refreshToken", (previousRefreshToken = newRefreshToken));
      }
      //  try with original request
      return await makeRequest(error.config);
    }

    if (status === 403) {
      sessionStorage.setItem("Error", error);
      Cookies.remove("refreshToken");
      toast.error("Refresh token is used or expired");
      return Promise.reject("You have not access, please login again...");
    }

    return Promise.reject(error);
  }
);
