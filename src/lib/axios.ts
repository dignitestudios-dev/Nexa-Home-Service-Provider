import axios from "axios";
import Cookies from "js-cookie";

// export const baseURL = "https://d3d7-101-53-226-103.ngrok-free.app";
export const baseURL = "https://api.dev.nexahomeapp.com"

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
    const token = Cookies.get("token");
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }

    config.headers["devicemodel"] = "Web Browser";
    config.headers["deviceuniqueid"] = getDeviceId();
    config.headers["ngrok-skip-browser-warning"] = "true";

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const requestUrl = error?.config?.url || "";
      const isAuthRequest = requestUrl.startsWith("/auth/");
      if (!isAuthRequest) {
        Cookies.remove("token");
        if (typeof window !== "undefined") {
          // window.location.href = "/auth/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
