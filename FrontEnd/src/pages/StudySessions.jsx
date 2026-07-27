import { useEffect, useState, useTransition } from "react";
import SessionHeader from "../components/sessions/SessionHeader";
import SessionTable from "../components/sessions/SessionTable";
import StudySessionFilters from "../components/sessions/StudySessionFilters";
import AddSessionModal from "../components/sessions/AddSessionModal";

import { getSessions , createSession , updateSession , deleteSession} from "../services/studySessionService";
import DeleteConfirmationModal from "../components/sessions/DeleteConfirmationModal";
import Pagination from "../components/pagination/Pagination";


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
  {
    label: "Latest",
    sort: "createdAt",
    order: "desc"
  },
  {
    label: "Oldest",
    sort: "createdAt",
    order: "asc"
  }
];


function StudySessions(){

  const[isModalOpen , setIsModalOpen] = useState(false);

  const [sessions , setSessions]= useState([]);

  const [editingSession , setEditingSession] = useState(null);

  const[selectedSessionId , setSelectedSessionId] = useState(null);
  const[isDeleteModalOpen , setIsDeleteModalOpen] = useState(false);

  const[search , setSearch] = useState("");
  const [status , setStatus] = useState("All Status");
  const [subject , setSubject]= useState("All Subjects");
  const [sort , setSort] = useState(sortOptions[0]);
  const [currentPage , setCurrentPage] = useState(1);
  const [totalPages , setTotalPages] = useState(0);

  const [loading , setLoading]= useState(true);

  function onAddSession(){
    setEditingSession(null);
    setIsModalOpen(true);
  }

  function onClose(){
    setIsModalOpen(false);
  }


  function closeDeleteModal(){
    setIsDeleteModalOpen(false);
  }

  function onPageChange(page){
    setCurrentPage(page);
  }

  
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




async function handleUpdate(updatedSession){


  const savedSession = await updateSession(updatedSession);


  const updatedSessions = sessions.map( (session) => {
    if(session._id === savedSession._id){


      return savedSession;
    }
    return session;
  });

  setSessions(updatedSessions);
}

  

  async function handleDelete(id){

    setSelectedSessionId(id);
    setIsDeleteModalOpen(true);
   
  }

  async function confirmDelete() {
    await deleteSession(selectedSessionId);

    const filteredSessions = sessions.filter( (session) =>{
      return session._id !== selectedSessionId;
    });

    setSessions(filteredSessions);
    setIsDeleteModalOpen(false);
    setSelectedSessionId(null);

  }

  
  useEffect( () => {

    const filters = {
      search,
    };

    if(status !== "All Status"){
      filters.status = status;
    };

    if(subject !== "All Subjects"){
      filters.subject = subject;
    };

    filters.sort = sort.sort;
    filters.order = sort.order;
    filters.page = currentPage;


    async function  fetchedSessions() {
      const response = await getSessions(filters);
      console.log(response);

      setSessions(response.data);
      setCurrentPage(response.currentPage);
      setTotalPages(response.totalPages);
      setLoading(false);
    }

    fetchedSessions();

  } , [search , status, subject , sort, currentPage]);


  if (loading) {
    return (
        <div className="loading-state">
            Loading StudySessions...
        </div>
    );
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
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            subject={subject}
            setSubject={setSubject}
            sort={sort}
            setSort={setSort}
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

      
        {isDeleteModalOpen && (
          <DeleteConfirmationModal
          onClose={closeDeleteModal}
          sessionId={selectedSessionId}
          onDelete={confirmDelete}
          />
        )}
      
      <Pagination 
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      />

      
        </div>
        
    )
}

export default StudySessions;