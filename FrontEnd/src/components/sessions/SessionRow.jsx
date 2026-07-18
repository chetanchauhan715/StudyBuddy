import "./SessionRow.css";

function SessionRow({session}){
    return( 
        <tr>
            <td>{session.subject}</td>
            <td>{session.topic}</td>
            <td>{session.duration}</td>
            <td>{session.status}</td>
            <td>{session.date}</td>
        </tr>
        
       
    )
}
export default SessionRow;