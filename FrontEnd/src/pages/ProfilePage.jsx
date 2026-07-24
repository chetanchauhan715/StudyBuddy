import { useEffect } from "react";
import { useState } from "react";
import { getProfile } from "../services/profileService";
import ProfileCard from "../components/profilePage/ProfileCard";

import "./profilePage.css";

function ProfilePage(){

    const [profile , setProfile] = useState(null);

    useEffect( ()=> {

       
            async function fetchProfile() {

                try{
                     const data = await getProfile()
                     setProfile(data);
                } catch(error){
                    console.error(error);
                    throw error;
                }
        }
        
        fetchProfile();
    } , []);


    return(
        <section className="profile-page-container">
            <div className="profile-page-header">
                <h2>Profile</h2>
                <p>Manage Your Account Information</p>
            </div>

            {profile && 
            <ProfileCard 
            profile={profile}
            />
            }
            
        </section>
    )
}

export default ProfilePage;