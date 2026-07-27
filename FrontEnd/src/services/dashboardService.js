import api from "../api/axios";

export async function getDashboard() {
    try{
        const response = await api.get("/dashboard");
        return response.data.data;

    } catch(error){
        console.error(error);
        throw error;
       }
}