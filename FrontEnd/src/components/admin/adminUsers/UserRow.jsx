import "./UserRow.css";

function UserRow({ user }) {
    const studyTime = (user.studyTime / 60).toFixed(1);

    const joinDate = new Date(user.joinDate).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

    return (
        <tr>

            <td>
                <span className="user-row-name">
                    {user.name}
                </span>
            </td>

            <td>
                <span className="user-row-email">
                    {user.email}
                </span>
            </td>

            <td>
                <span className="user-study-time">
                    {studyTime} hrs
                </span>
            </td>

            <td>
                <span className="user-session-count">
                    {user.totalSessions}
                </span>
            </td>

            <td>
                <span className="user-join-date">
                    {joinDate}
                </span>
            </td>

            <td>
                <button className="delete-user-btn">
                    Delete
                </button>
            </td>

        </tr>
    );
}

export default UserRow;