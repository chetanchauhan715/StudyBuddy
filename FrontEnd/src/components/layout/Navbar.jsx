import "./Navbar.css";
import { FaBars, FaBell } from "react-icons/fa";
import Avatar from "../common/Avatar";
import { useState , useEffect } from "react";
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead } from "../../services/notificationService";

function Navbar({sidebarOpen, setSidebarOpen}) {


  const [notifications , setNotifications] = useState([]);
  const [unreadCount , setUnreadCount] = useState(0);
  const [isNotificationOpen , setIsNotificationOpen]= useState(false); 

  function handleClick(){
    setIsNotificationOpen(!isNotificationOpen);
  }

  async function handleNotificationClick(notification) {
    try {
        if (notification.read) return;

        await markNotificationAsRead(notification._id);

        setNotifications(prev =>
            prev.map(item =>
                item._id === notification._id
                    ? { ...item, read: true }
                    : item
            )
        );

        console.log("Clicked notification:", notification);
console.log("Unread before:", unreadCount);

        setUnreadCount(prev => Math.max(prev - 1, 0));

    } catch (error) {
        console.error(error);
    }
}


  useEffect( ()=>{
    async function fetchNotifications() {
      const notification_result = await  getNotifications();
      const notification_count = await getUnreadNotificationCount();

      setNotifications(notification_result);
      setUnreadCount(notification_count)

      console.log(notification_result);
    console.log(notification_count);
    }

    fetchNotifications();

    
  }, []);


  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="navbar-container">

      <div className="navbar-left">
        <button className="icon-btn">
          <FaBars 
          className="menu-btn"
          onClick={ ()=> setSidebarOpen(!sidebarOpen)}
          />
        </button>
      </div>

      <div className="navbar-right">

        <div className="notification-wrapper">

        <button className="icon-btn notification-btn" onClick={handleClick}>
          <FaBell/>
          {unreadCount > 0 && (
    <span className="notification-badge">
      {unreadCount}
    </span>
  )}
        </button>

        {isNotificationOpen && (
    <div className="notification-panel">
          <ul>
            {notifications.map((notification) => (
  <li 
  key={notification._id}
  className="notification-item"
  onClick={ ()=> handleNotificationClick(notification)}
  >
    <div className="notification-content">
      {notification.content}
    </div>
          
    <span className="notification-time">
      {new Date(notification.createdAt).toLocaleString()}
    </span>
  </li>
))}
          </ul>
    </div>
  )}

        </div>

        <div className="navbar-user">
          <Avatar
            name={user?.name}
            size={42}
          />

          <div className="navbar-user-info">
            <span>Hello,</span>
            <h4>{user?.name}</h4>
          </div>
        </div>

      </div>

    </header>
  );
}

export default Navbar;