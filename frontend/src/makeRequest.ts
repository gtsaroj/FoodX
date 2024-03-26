import axios from "axios";
import Cookies from "js-cookie";

export const makeRequest = axios.create({
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
  (response) => response,
  async (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      const refreshToken = Cookies.get("refreshToken");
      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }
      const response = await axios.post("/users/refresh-token", refreshToken);
      const responseData = response.data.data;
      const newRefreshToken = responseData.refreshToken;
      const newAcessToken = responseData.accessToken;
      Cookies.set("accessToken", newAcessToken);
      Cookies.set("refreshToken", newRefreshToken);
      //  try with original request
      return axios(error.config);
    }

    return Promise.reject(error);
  }
);
