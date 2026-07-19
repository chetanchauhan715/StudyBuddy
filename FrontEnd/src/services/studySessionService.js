import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:3000",
});

api.interceptors.request.use( (config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

});

export async function getSessions(){
    const response = await api.get("/study-sessions");

    return response.data.data;
}


export default api;