import api from "../api/axios";


export async function createReminder(reminderData) {

    try {

        const response = await api.post(
            "/reminders",
            reminderData
        );

        return response.data.data;

    } catch (error) {

        console.error(error);
        throw error;
    }
}

// ---------

export async function getTodayReminders() {
     try{
         const response = await api.get("/reminders/today-reminders");

         return response.data.data
     } catch(error){
        console.error(error);
        throw error;
     }
}

// -----------

export async function deleteReminder(reminderId) {
     try{
        const response = await api.delete(`/reminders/delete/${reminderId}`);

        return response.data;
     } catch(error){
        console.error(error);
        throw error;
     }
}