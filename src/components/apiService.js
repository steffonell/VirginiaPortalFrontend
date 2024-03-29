import axios from "axios";
import EventEmitter from 'events';

export const eventEmitter = new EventEmitter();

/* const API_URL = "https://virdzinijaportal.com/api/"; */
const API_URL = "http://3.74.1.110:9191/api/";
/* const API_URL = "http://localhost:9191/api/";   */

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    /* console.log("Token set:", token); */
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

let token;
try {
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  token = user?.accessToken;
} catch (error) {
  console.error("Error parsing localStorage user data:", error);
  token = null;
}

if (token) {
  setAuthToken(token);
}

axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        setAuthToken(null);
        eventEmitter.emit('unauthorized'); // emit event here
      }
  
      return Promise.reject(error);
    }
);

export default axiosInstance;
