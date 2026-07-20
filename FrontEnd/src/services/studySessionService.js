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


export default api;