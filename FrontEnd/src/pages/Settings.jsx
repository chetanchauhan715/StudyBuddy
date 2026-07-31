import SubjectManager from "../components/settings/SubjectManager";
import "./Settings.css";

function Settings() {
  return (
    <section className="settings-page page-container">

      <div className="settings-header">

        <h1>Settings</h1>

        <p>
          Manage your StudyBuddy preferences and subjects.
        </p>

      </div>

      <SubjectManager />

    </section>
  );
}

export default Settings;