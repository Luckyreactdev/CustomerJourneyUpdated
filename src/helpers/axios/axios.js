import axios from "axios";
import Cookies from "js-cookie";
import { baseURL, refreshTokenUrl } from "../endpoints/api_endpoints";

// console.log("base url is >>>>", baseURL);

export const axiosInstance = axios.create({
  baseURL: baseURL,
  // debouncing the request for limiting the reuqest rate 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken"),
    "X-Api-Key": process.env.REACT_APP_API_KEY,
  },
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== "/auth/signin" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const rs = await axios.post(`${baseURL}${refreshTokenUrl}`, {
            refresh: localStorage.getItem("refreshToken"),
          });
          // const { accessToken } = rs.data;
          // // axios.headers.Authorization = `Bearer ${accessToken}`;
          // axios.defaults.headers.common[
          //   "Authorization"
          // ] = `Bearer ${accessToken}`;
          // localStorage.setItem("accessToken", accessToken);

          const { access } = rs.data;
          axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
          localStorage.setItem("accessToken", access);

          return axios(originalConfig);
        } catch (_error) {
          if (_error.response.status == "401") {
            localStorage.clear();
            window.location.href = "/";
          }
          if (_error.response.status == "403") {
            localStorage.clear();
            window.location.href = "/";
          }
          return Promise.reject(_error);
          
        }
      }
    }

    return Promise.reject(err);
  }
);

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});


