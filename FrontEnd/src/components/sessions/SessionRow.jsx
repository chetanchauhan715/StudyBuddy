import "./SessionRow.css";

function SessionRow({session , onEdit , onDelete}){
    return( 
        <tr>
            <td>{session.subject}</td>
            <td>{session.topic}</td>
            <td>{ Math.ceil(session.duration / 60 )}hrs</td>
            <td>{session.status}</td>
            <td>{session.studyDate?.split("T")[0]}</td>
            <td><button onClick={ ()=> onEdit(session)}>Edit</button></td>
            <td><button onClick={ () => onDelete(session._id)}>Delete</button></td>
        </tr>
        
       
    )
}
export default SessionRow;