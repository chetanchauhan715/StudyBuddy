import api from "../api/axios";

export async function getSubjects() {

    try{

        const response = await api.get("/subjects");
        return response.data.data;

    } catch(error){
        console.error(error);
        throw error;
    }
    
}

export async function createSubject(subjectData) {
    try{
        const response = await api.post("/subjects" , subjectData);
        return response.data.data;
    } catch(error){
        console.error(error);
        throw error;
    }
}


export async function updateSubject(id,subjectData) {
    try{
        const response = await api.put( `/subjects/${id}` , subjectData);
        return response.data.data;

    } catch(error){
        console.error(error);
        throw error;
    }
}

export async function deleteSubject(id) {
    try{

        const response = await api.delete(`/subjects/${id}`);
        return response.data
    } catch (error){
        console.error(error);
        throw error;
    }
}
