import axios from "axios";

/* const API_URL = "https://virginia-portal-backend.herokuapp.com/api/"; */

const API_URL = "http://localhost:9191/api/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Token set:", token);
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const token = JSON.parse(localStorage.getItem("user"))?.accessToken;

if (token) {
  setAuthToken(token);
}

axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        setAuthToken(null);
      }
  
      return Promise.reject(error);
    }
  );

export default axiosInstance;
