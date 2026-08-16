import api from "../api/axios";


export async function getNotifications() {
     try{
        const response = await api.get("/notifications");

        return response.data.notifications;
     } catch(error){
        console.error(error);
        throw error;
     }
}


export async function getUnreadNotificationCount() {
    try{
        const response = await api.get("/notifications/unread-count");

        return response.data.unreadCount;
    } catch(error){
        console.error(error);
        throw error;
    }
}

export async function markNotificationAsRead(notification_id) {
    try{

        const response = await api.patch(`/notifications/${notification_id}`);

        return response.data;

    } catch(error){
        console.error(error);
        throw error;
    }
}