import api from "../api/axios";

export async function getAdminDashboard() {
    try{

        const response = await api.get("/admin/dashboard");
        return response.data;

    } catch(error){
        throw error;
    }
}