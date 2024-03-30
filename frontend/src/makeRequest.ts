import axios, { AxiosInstance } from "axios";
import Cookies from "js-cookie";

export const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

makeRequest.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  console.log(accessToken);
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

makeRequest.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  async (error) => {


    const status = error.response ? error.response.status : null;
    console.log(status)
    if (status === 403) {
      const refreshToken = Cookies.get("refreshToken");
      Cookies.remove("accessToken");
      if (!refreshToken) {
        return Promise.reject(`You have not access, please login again...`);
      }
      console.log(`RefreshToken = ${refreshToken}`);
      const response = await makeRequest.post("/users/refresh-token", {refreshToken});
      
      const responseData = response.data.data;
      const newRefreshToken = responseData.refreshToken;
      const newAcessToken = responseData.accessToken;
      Cookies.set("accessToken", newAcessToken);
      let previousRefreshToken = Cookies.get("refreshToken");
      if (previousRefreshToken) {
        Cookies.set("refreshToken", (previousRefreshToken = newRefreshToken));
        console.log(
          `${previousRefreshToken} ========================== ${newRefreshToken}`
        );
      }
      console.log(error);
      //  try with original request
      return axios(error.config);
    }

    return Promise.reject(error);
  }
);
