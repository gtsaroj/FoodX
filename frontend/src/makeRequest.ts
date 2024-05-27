import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRrefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

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

    const originalRequest = error.config;

    if (status === 401 && !originalRequest._retry) {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        return Promise.reject("You have not access, please login again...");
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const response = await makeRequest.post("/users/refresh-token", {
            refreshToken,
          });

          const responseData = response.data.data;
          const newAccessToken = responseData.accessToken;
          const newRefreshToken = responseData.refreshToken;

          Cookies.set("accessToken", newAccessToken);
          Cookies.set("refreshToken", newRefreshToken);

          isRefreshing = false;
          onRrefreshed(newAccessToken);
        } catch (err) {
          isRefreshing = false;
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          toast.error("Session Expired, Please Login Again");
          return Promise.reject("You have not access, please login again...");
        }
      }

      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newAccessToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(axios(originalRequest));
        });
      });
    }

    if (status === 403) {
      Cookies.remove("refreshToken");
      toast.error("Session Expired, Please Login Again");
      return Promise.reject("You have not access, please login again...");
    }

    return Promise.reject(error);
  }
);
