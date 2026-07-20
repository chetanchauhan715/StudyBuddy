import SessionRow from "./SessionRow";
import "./SessionTable.css";

function SessionTable({sessionData , onEdit , onDelete}){
    return (
        <table className="session-table">
            <thead >
                <tr>
                    <th>Subject</th>
                    <th>Topic</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
        {
            sessionData.map( (session) => (
                <SessionRow 
                key={session._id}
                session={session}
                onEdit={onEdit}
                onDelete={onDelete}
                />
            ))
        }
            </tbody>
        </table>
    )
}

export default SessionTable;