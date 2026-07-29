import "./SubjectItem.css";

function SubjectItem({subject , onEdit ,onDelete}){
    return(
        <div className="subject-item">
            <span>{subject.name}</span>

            <div className="subject-actions">
                <button onClick={ ()=> onEdit(subject)}>Edit</button>
                <button onClick={ ()=> onDelete(subject)}>Delete</button>

            </div>
        </div>
    )
}

export default SubjectItem;