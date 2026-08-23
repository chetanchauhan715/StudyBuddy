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

export async function changePassword(passwordData) {
    const response = await api.put("/change-password" , passwordData);
    return response.data;
}

// - premium 
export async function updateWeeklyGoal(weeklyGoal) {
    try{
        const response = await api.put("/profile/weekly-goal", {
            weeklyGoal
        });

        return response.data.data;
    } catch(error){
        console.error(error);
        throw error;
    }
}