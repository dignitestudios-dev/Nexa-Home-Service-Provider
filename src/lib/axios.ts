import axios from "axios";

import { clearAuthTokenCookie, getAuthTokenCookie } from "@/lib/auth-session";



// export const baseURL = "https://0hw8tf6g-3050.inc1.devtunnels.ms";

 // export const baseURL = "https://api.dev.nexahomeapp.com";

  export const baseURL = "https://api.staging.nexahomeapp.com";



const headers = {

  "Content-Type": "application/json",

};



function getDeviceId(): string {

  if (typeof window === "undefined") return "web-ssr";

  let deviceId = localStorage.getItem("deviceUniqueId");

  if (!deviceId) {

    deviceId = "web_" + crypto.randomUUID();

    localStorage.setItem("deviceUniqueId", deviceId);

  }

  return deviceId;

}



export const API = axios.create({

  baseURL,

  timeout: 1000000,

  headers,

});



API.interceptors.request.use(

  (config) => {

    const token = getAuthTokenCookie();



    // Skip Authorization header for change-password endpoint with resetToken in body

    // const isChangePasswordWithReset =

    //   config.url === "/auth/change-password" &&

    //   (config.data as any)?.resetToken;



    // if (token && !isChangePasswordWithReset) {

    //   config.headers.authorization = `Bearer ${token}`;

    // }



    if (token) {

      config.headers.authorization = `Bearer ${token}`;

    }



    config.headers["devicemodel"] = "Web Browser";

    config.headers["deviceuniqueid"] = getDeviceId();

    config.headers["ngrok-skip-browser-warning"] = "true";



    return config;

  },

  (error) => Promise.reject(error),

);



API.interceptors.response.use(

  (response) => response,

  (error) => {

    if (error?.response?.status === 401) {

      const requestUrl = error?.config?.url || "";

      const isAuthRequest = requestUrl.startsWith("/auth/");

      if (!isAuthRequest) {

        clearAuthTokenCookie();

        if (typeof window !== "undefined") {

          // window.location.href = "/auth/login";

        }

      }

    }

    return Promise.reject(error);

  },

);

