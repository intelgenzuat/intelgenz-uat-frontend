import axios from "axios"

const apiUrl = import.meta.env.VITE_API_URL;
let headers = {};

const axiosInstance = axios.create({
    baseURL: apiUrl,
    headers
})



export default axiosInstance
