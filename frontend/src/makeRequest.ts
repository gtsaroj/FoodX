import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Store } from "./store";
import { authLogout } from "./reducer/user.reducer";
import { resetCart } from "./reducer/product.reducer";
import { resetFavourite } from "./reducer/favourite.reducer";
import { resetOrder } from "./reducer/order.reducer";

// Flag to track if the token is being refreshed
let isRefreshing = false;
// Queue to store requests waiting for the token to refresh
let failedRequestsQueue: Array<(token: string) => void> = [];
let hasLoggedOut = false;

export const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ensure this is set correctly in the environment file
});

makeRequest.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

makeRequest.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Unauthorized - likely due to an expired access token
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        // No refresh token, force logout
        if (!hasLoggedOut) {
          hasLoggedOut = true;
          Store.dispatch(authLogout());
          Store.dispatch(resetCart());
          Store.dispatch(resetFavourite());
          Store.dispatch(resetOrder());
          toast.error("Your session has expired. Please log in again.");
          return Promise.reject("Unauthorized: No refresh token available.");
        }
      }

      if (!isRefreshing) {
        isRefreshing = true;
        Cookies.remove("accessToken"); // Remove expired access token

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/users/refresh-token`,
            { refreshToken }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            response.data.data;

          // Store the new tokens in cookies
          Cookies.set("accessToken", newAccessToken, { secure: true });
          Cookies.set("refreshToken", newRefreshToken, { secure: true });

          // Retry all failed requests after refreshing token
          failedRequestsQueue.forEach((cb) => cb(newAccessToken));
          failedRequestsQueue = [];
          isRefreshing = false;

          // Retry the original request with the new access token
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return makeRequest(error.config);
        } catch (refreshError: any) {
          // Refresh token request failed, force logout
          if (refreshError.response.data.statusCode === 403)
            Cookies.remove("refreshToken");
          Store.dispatch(authLogout());
          toast.error(
            refreshError?.response?.data?.errors?.message ||
              "Session expired, please login again"
          );
          failedRequestsQueue = [];
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else {
        // If a token refresh is already in progress, queue the request
        return new Promise((resolve, _) => {
          failedRequestsQueue.push((token: string) => {
            error.config.headers["Authorization"] = `Bearer ${token}`;
            resolve(makeRequest(error.config));
          });
        });
      }
    }

    if (status === 403) {
      // Forbidden - Invalid or expired refresh token
      Cookies.remove("refreshToken");
      toast.error("Refresh token is invalid or expired. Please log in again.");
      Store.dispatch(authLogout());
      return Promise.reject("Forbidden: Invalid refresh token.");
    }

    // Handle other types of errors
    return Promise.reject(error);
  }
);
