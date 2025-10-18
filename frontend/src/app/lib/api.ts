import axios from "axios";

const api = axios.create({
    baseURL: "api.smkprestasiprima.sch.id/api",
})


export default api;