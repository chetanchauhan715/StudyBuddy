import UserRow from "./UserRow";
import "./UsersTable.css";

function UsersTable({ users }) {
    return (
        <section className="users-table-section">

            <div className="users-table-header">
                <h2>All Users</h2>
            </div>

            <table className="users-table">

                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Study Time</th>
                        <th>Sessions</th>
                        <th>Joined</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <UserRow
                            key={user._id}
                            user={user}
                        />
                    ))}
                </tbody>

            </table>

        </section>
    );
}

export default UsersTable;