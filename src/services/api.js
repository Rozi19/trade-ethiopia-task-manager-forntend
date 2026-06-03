import axios from "axios";

const api = axios.create({
  baseURL: "https://trade-ethiopia-task-manager-backend-7ntp.onrender.com/api",
});

export default api;