import "./Avatar.css";

function Avatar({ name = "User", size = 45 }) {
  return (
    <div
      className="avatar"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2.3}px`,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default Avatar;