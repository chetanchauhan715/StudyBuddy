import "./SessionRow.css";

function SessionRow({session , onEdit , onDelete}){
    return( 
        <tr>
            <td>{session.subject}</td>
            <td>{session.topic}</td>
            <td>{session.duration}</td>
            <td>{session.status}</td>
            <td>{session.date}</td>
            <td><button onClick={ ()=> onEdit(session)}>Edit</button></td>
            <td><button onClick={ () => onDelete(session.id)}>Delete</button></td>
        </tr>
        
       
    )
}
export default SessionRow;