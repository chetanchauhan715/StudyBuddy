import api from "../api/axios";

export async function createOrder(plan) {

    try{
         const response = await api.post("/payments/create-order" , {
            plan
         });

        return response.data.data;

    } catch(error){
        console.error(error);
        throw error;
    }
   
}

export async function verifyPayment(response) {
    try{
        const orderResponse = await api.post("/payments/verify-order", {
            response
        });

        return orderResponse.data.data;
    } catch(error){
        console.error(error);
        throw error;
    }
}