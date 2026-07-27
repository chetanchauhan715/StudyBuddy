import api from "../api/axios";

export async function  getProfile() {

    try{

        const response = await api.get("/profile");

        return response.data.data.user;

    } catch (error){
        console.error(error);
        throw error;

    }
    
}

export async function updateProfile(updatedData) {
    try{
        const response = await api.put("/profile" , updatedData);
        return response.data.data.user;
    } catch(error){
        console.error(error);
        throw error;
    }
}