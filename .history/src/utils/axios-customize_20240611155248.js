
import axios from "axios";
import { TOKEN, USER } from "./constant";

const handleLogOut = () => {
    localStorage.removeItem(USER);
    localStorage.removeItem(TOKEN);
    window.location.href = "/";
  };
const api = axios.create({
  baseURL: `http://14.248.100.78:2345`,
  timeout: 30000,
});
// api.interceptors.request.use(
//   function (config) {
//     const token = localStorage.getItem(TOKEN);
//     config.headers.Authorization = `Bearer ${token}`;
//     // config.headers["Content-Type"] = "Application/json";
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     if (error.response?.status === 401) {
//       handleLogOut();
//     }

//     return Promise.reject(error);
//   }
// );
export default api;