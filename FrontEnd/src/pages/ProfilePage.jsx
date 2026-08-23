import { useEffect } from "react";
import { useState } from "react";
import { getProfile, updateProfile } from "../services/profileService";
import ProfileCard from "../components/profilePage/ProfileCard";

import "./profilePage.css";
import EditProfileModal from "../components/profilePage/EditProfilePageModal";

import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import ChangePasswordCard from "../components/profilePage/ChangePasswordCard";

import WeeklyGoalCard from "../components/profilePage/WeeklyGoalCard";


function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    dailyGoal: 0,
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const[loading , setLoading]= useState(true);

  function handleEditClick() {
    setFormData({
      name: profile.name,
      dailyGoal: profile.dailyGoal,
    });

    setIsEditOpen(true);
  }

  async function handleSave() {
    try {
      if (!formData.name.trim()) {
        toast.error("Name cannot be empty")
        return;
      }

      if (formData.dailyGoal < 1) {
        toast.error("Daily goal must be greater than 0");
        return;
      }

      if (formData.dailyGoal > 24) {
        toast.error("Daily goal should not exceeds 24 hours");
        return;
      }

      setIsSaving(true);

      const updatedUser = await updateProfile(formData);

      setProfile(updatedUser);

      toast.success("Profile updated successfully!");

      setIsEditOpen(false);
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
      setIsSaving(false);
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchProfile();
  }, []);

   
if(loading){
    return <Loader/>
}

  return (
    <section className="profile-page-container page-container">
      <div className="profile-page-header">
        <h2>Profile</h2>
        <p>Manage Your Account Information</p>
      </div>

{/* profile card  */}
      {profile && <ProfileCard profile={profile} onEdit={handleEditClick} />}


{/* weekly goal card ---------- */}
      <WeeklyGoalCard
  weeklyGoal={profile?.weeklyGoal}

  onGoalUpdated={(newGoal) => {

    setProfile((prev) => ({
      ...prev,
      weeklyGoal: newGoal
    }));

  }}
/>

      {/* change pass ----------- */}

      {<ChangePasswordCard />}

      <EditProfileModal
        isOpen={isEditOpen}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        saving={isSaving}
      />

      <section className="upcoming-features-card">
        <div className="upcoming-header">
          <h3>🚀 Coming Soon</h3>
          <p>Features planned for future StudyBuddy updates.</p>
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <span>🤖</span>

            <div>
              <h4>AI Study Planner</h4>
              <p>Get personalized study plans based on your learning habits.</p>
            </div>
          </div>

          <div className="feature-item">
            <span>👥</span>

            <div>
              <h4>Study Groups</h4>
              <p>Create or join study groups and stay accountable together.</p>
            </div>
          </div>

          <div className="feature-item">
            <span>📅</span>

            <div>
              <h4>Calendar Integration</h4>
              <p>Sync study sessions directly with your Google Calendar.</p>
            </div>
          </div>

          <div className="feature-item">
            <span>🌙</span>

            <div>
              <h4>Dark Mode</h4>
              <p>A comfortable interface for late-night study sessions.</p>
            </div>
          </div>

          <div className="feature-item">
            <span>🏆</span>

            <div>
              <h4>Achievements</h4>
              <p>Unlock milestones and maintain your study consistency.</p>
            </div>
          </div>

          <div className="feature-item">
            <span>📈</span>

            <div>
              <h4>Advanced Analytics</h4>
              <p>
                Track long-term performance with deeper insights and reports.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </section>
  );
}

export default ProfilePage;
