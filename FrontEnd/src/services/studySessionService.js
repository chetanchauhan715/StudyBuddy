import api from "../api/axios";

export async function getSessions(filters){
    const response = await api.get("/study-sessions", 
        {
            params:filters
        }
    );

    return response.data;
}

export async function createSession(sessionData){
    console.log(sessionData);

    try{
        const response = await api.post("/study-sessions" , sessionData);

    return response.data.data.session;
    } catch (error){
        console.log(error.response.data);
        throw error;
    }
    
}

export async function updateSession(sessionData){
    try{

        const id = sessionData.id;
        const response = await api.put(`/study-sessions/${id}` , sessionData);
        return response.data.data.session;
    } catch(error){
        console.error(error);
        throw error;
    }
}


export async function deleteSession(id){
    try{
        const response = await api.delete(`/study-sessions/${id}`);
        return response.data;
    } catch (error){
        console.error(error);
        throw error;
    }
}


// ---------//------------//

export async function  getStatistics() {
    try{
        const response = await api.get("/study-sessions/statistics");

        return response.data.data;
    } catch(error){
        console.error(error);
        throw error;
    }
}

export default api;