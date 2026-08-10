import api from "../api/axios";

export async function getAdminDashboard() {
    try{

        const response = await api.get("/admin/dashboard");
        return response.data;

    } catch(error){
        throw error;
    }
}


export async function getUsers(page=1, limit=10, search="") {
    try{

         const response = await api.get("/admin/users" , {
            params:{
                page,
                limit,
                search
            }
         });
         return response.data;
    } catch(error){
        console.error(error);
        throw error;
    }
   
}


export async function deleteUser(id) {
    try {
        const response = await api.delete(`/admin/users/${id}`);

        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}