import api from "../api/axios";

export async function forgotPassword({email}) {
    const response = await api.post("/forgot-password" , {email});

    return response.data;
}

export async function  resetPassword({token , newPassword, confirmPassword}) {
    const response = await api.put("/reset-password" , {token , newPassword, confirmPassword} );

    return response.data;
}