import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/profileService";


const UserContext = createContext(null);


export function UserProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    async function refreshUser() {

        try {

            const userData = await getProfile();

            setUser(userData);
            // console.log("CONTEXT USER:", userData);

        } catch (error) {

            console.error(
                "Failed to fetch current user:",
                error
            );

            setUser(null);

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            refreshUser();
        } else {
            setLoading(false);
        }

    }, []);


    return (

        <UserContext.Provider
            value={{
                user,
                loading,
                refreshUser
            }}
        >
            {children}

        </UserContext.Provider>

    );
}


export function useUser() {
    return useContext(UserContext);
}