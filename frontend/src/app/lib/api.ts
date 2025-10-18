import axios from "axios";

const api = axios.create({
    baseURL: "http://api.smkprestasiprima.sch.id/api",
})


export default api;