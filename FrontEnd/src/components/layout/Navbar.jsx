import "./Navbar.css";
import {
  Menu,
  Bell
} from "lucide-react";
import Avatar from "../common/Avatar";
import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from "../../services/notificationService";
import { useUser } from "../../context/UserContext";
import PremiumBadge from "../premium/PremiumBadge";

function Navbar({sidebarOpen, setSidebarOpen}) {


  const [notifications , setNotifications] = useState([]);
  const [unreadCount , setUnreadCount] = useState(0);
  const [isNotificationOpen , setIsNotificationOpen]= useState(false); 

  const navigate = useNavigate();

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


        setUnreadCount(prev => Math.max(prev - 1, 0));

    } catch (error) {
        console.error(error);
    }
}

// ----

async function handleMarkAllAsRead() {

    try {

        await markAllNotificationsAsRead();

        setNotifications(prev =>
            prev.map(notification => ({
                ...notification,
                read: true
            }))
        );

        setUnreadCount(0);

    } catch (error) {
        console.error(error);
    }
}

// --------

  useEffect( ()=>{
    async function fetchNotifications() {
      const notification_result = await  getNotifications();
      const notification_count = await getUnreadNotificationCount();

      setNotifications(notification_result);
      setUnreadCount(notification_count)

    }

    fetchNotifications();

    
  }, []);


  const {user} = useUser();

  const now = new Date();

  const isPremium = 
      user?.subscription?.plan === "premium" && 
      user?.subscription?.startDate &&
      user?.subscription?.endDate &&
      new Date(user.subscription.startDate) <= now && 
      new Date(user.subscription.endDate) > now ;


  return (
    <header className="navbar-container">

      <div className="navbar-left">
        <button className="icon-btn">
          <Menu 
          size={20}
          className="menu-btn"
          onClick={ ()=> setSidebarOpen(!sidebarOpen)}
          />
        </button>
      </div>

      <div className="navbar-right">

        <div className="notification-wrapper">

        <button className="icon-btn notification-btn" onClick={handleClick}>
          <Bell size={20}/>
          {unreadCount > 0 && (
    <span className="notification-badge">
      {unreadCount}
    </span>
  )}
        </button>

        {isNotificationOpen && (
    <div className="notification-panel">

      <div className="notification-panel-header">

    <span>
        Notifications
    </span>

    {unreadCount > 0 && (
        <button
            type="button"
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
        >
            Mark all as read
        </button>
    )}

</div>

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

        <div 
        className="navbar-user"
        onClick={ ()=> navigate("/profile")}
        onKeyDown={ (e) =>{
          if(e.key === "Enter"){
            navigate("/profile")
          }
        }}
        role="button"
        tabIndex={0}
        >

  <Avatar
    name={user?.name}
    size={42}
  />

  <div className="navbar-user-info">
    <span>Hello,</span>
    <h4>{user?.name}</h4>
  </div>

  {isPremium && (
    <PremiumBadge />
  )}

</div>

      </div>

    </header>
  );
}

export default Navbar;