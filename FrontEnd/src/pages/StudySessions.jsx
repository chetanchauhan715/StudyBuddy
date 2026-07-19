import { useState } from "react";
import SessionHeader from "../components/sessions/SessionHeader";
import SessionTable from "../components/sessions/SessionTable";
import StudySessionFilters from "../components/sessions/StudySessionFilters";
import "./StudySessions.css";
import AddSessionModal from "../components/sessions/AddSessionModal";


const subjectOptions = [
    "All Subjects",
    "React",
    "DSA",
    "Node.js",
    "JavaScript"
  ];
  
  const statusOptions = [
    "All Status",
    "Completed",
    "Pending"
  ];
  
  const sortOptions = [
    "Newest",
    "Oldest",
    "Duration"
  ];

  const sessionData = [
    {   id:1,
        subject: "React",
        topic: "Hooks",
        duration: "2h",
        status: "Completed",
        date: "Today"
    },

    {   id:2,
        subject: "React",
        topic: "Hooks",
        duration: "2h",
        status: "Completed",
        date: "Today"
    },

    {   id:3,
        subject: "React",
        topic: "Hooks",
        duration: "2h",
        status: "Completed",
        date: "Today"
    }


  ]

function StudySessions(){

  const[isModalOpen , setIsModalOpen] = useState(false);

  const [sessions , setSessions]= useState(sessionData);

  const [editingSession , setEditingSession] = useState(null);

  function onAddSession(){
    setEditingSession(null);
    setIsModalOpen(true);
  }

  function onClose(){
    setIsModalOpen(false);
  }


  function handleSave(newSession){
    console.log(newSession);
    setSessions(prev => [...prev , newSession]);
  }

  function handleEdit(session){
    setEditingSession(session);
    setIsModalOpen(true);
  }

  function handleUpdate(updatedSession){
    const updatedSessions = sessions.map( (session) => {
      if(session.id === updatedSession.id){
        return updatedSession;
      }
      return session;
    });
    setSessions(updatedSessions);
  }

  function handleDelete(id){
    const filteredSessions = sessions.filter( (session) =>{
      return session.id !== id;
    });
    setSessions(filteredSessions);
  }

    return(

        <div>
            <div className="session-header">
<SessionHeader
onAddSession={onAddSession}/>
        </div>

        <div className="filters">
            <StudySessionFilters 
            subjectOptions={subjectOptions}
            statusOptions={statusOptions}
            sortOptions={sortOptions}
            />
        </div>

        <SessionTable 
        sessionData={sessions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        />
 
        {isModalOpen && (
        <AddSessionModal 
        onClose={onClose}
        onSave={handleSave}
        editingSession={editingSession}
        onUpdate={handleUpdate}
        />
      )}

      



        </div>
        
        
    )
}

export default StudySessions;