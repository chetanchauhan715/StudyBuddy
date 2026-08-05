import "./Topbar.css";

function Topbar() {
  return (
    <header className="admin-topbar">

      <div>
        <h1>Dashboard</h1>
        <p>Welcome back, Admin 👋</p>
      </div>

      <div className="admin-profile">
        <div className="profile-avatar">
          A
        </div>

        <div>
          <h4>Admin</h4>
          <span>Administrator</span>
        </div>
      </div>

    </header>
  );
}

export default Topbar;