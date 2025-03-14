import axios from "axios";

import { BASE_URL } from "../utils/apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        console.error(
          "Acceso no autorizado. Regresando a la pantalla de inicio."
        );
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error(
          "Hubo un error con el servidor. Por favor, intentar más tarde."
        );
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Tiempo de respuesta expiró. Inténtelo nuevamente.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
