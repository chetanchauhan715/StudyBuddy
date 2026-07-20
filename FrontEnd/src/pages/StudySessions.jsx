import { useEffect, useState } from "react";
import SessionHeader from "../components/sessions/SessionHeader";
import SessionTable from "../components/sessions/SessionTable";
import StudySessionFilters from "../components/sessions/StudySessionFilters";
import AddSessionModal from "../components/sessions/AddSessionModal";

import { getSessions , createSession , updateSession , deleteSession} from "../services/studySessionService";


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


function StudySessions(){

  const[isModalOpen , setIsModalOpen] = useState(false);

  const [sessions , setSessions]= useState([]);

  const [editingSession , setEditingSession] = useState(null);

  function onAddSession(){
    setEditingSession(null);
    setIsModalOpen(true);
  }

  function onClose(){
    setIsModalOpen(false);
  }


  // function handleSave(newSession){
  //   console.log(newSession);
  //   setSessions(prev => [...prev , newSession]);
  // }

  async function handleSave(newSession){
    const savedSession = await createSession(newSession);
    const normalizedSession = {
      ...savedSession,
      id: savedSession._id,
    };

    setSessions( (prev)=> [  normalizedSession , ...prev ]);
  }

  function handleEdit(session){
    setEditingSession(session);
    setIsModalOpen(true);
  }

//   function handleUpdate(updatedSession){
//     const updatedSessions = sessions.map( (session) => {
//       if(session.id === updatedSession.id){
//         return updatedSession;
//       }
//       return session;
//     });

// // console.log(updatedSession);
// // console.log(sessions);

//     setSessions(updatedSessions);
//   }


async function handleUpdate(updatedSession){

  // console.log("1. Sending:", updatedSession);

  const savedSession = await updateSession(updatedSession);

  // console.log("2. Backend returned:", savedSession);

  const updatedSessions = sessions.map( (session) => {
    if(session._id === savedSession._id){

      // console.log("3. Replacing:", session);

      return savedSession;
    }
    return session;
  });
  // console.log("4. Final array:", updatedSessions);

  setSessions(updatedSessions);
}

  // function handleDelete(id){
  //   const filteredSessions = sessions.filter( (session) =>{
  //     return session._id !== id;
  //   });
  //   setSessions(filteredSessions);
  // }

  async function handleDelete(id){
   await deleteSession(id);

   const filteredSessions = sessions.filter( (session) => {
    return session._id !== id;
   }) ;
   setSessions(filteredSessions);
  }

  useEffect( ()=> {
    async function fetchSessions(){
      const fetchedSessions = await getSessions();
      const normalizedSessions = fetchedSessions.map((session) => ({
        ...session,
        id: session._id,
      }));
      setSessions(normalizedSessions);
    }
    fetchSessions();
  } , []);

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