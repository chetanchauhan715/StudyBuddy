import { useState , useEffect } from "react";
import { createSubject, deleteSubject, getSubjects, updateSubject } from "../../services/subjectService";
import "./SubjectManager.css";
import AddSubjectModal from "./AddSubjectModal";
import SubjectItem from "./SubjectItem";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function SubjectManager() {

  const[subjects , setSubjects] = useState([]);
  const[loading , setLoading ] = useState(true);
  const[isModalOpen , setIsModalOpen] = useState(false);
  const[editingSubject , setEditingSubject]= useState(null);
  const[deletingSubject, setDeletingSubject] = useState(null);

  function handleOpenModal(){
    setEditingSubject(null);
    setIsModalOpen(true);
  }

  function handleCloseModal(){
    setIsModalOpen(false);
  }


  async function handleSave(subjectData) {
            console.log("Finished onSave");

    try{
      if(editingSubject){
        await updateSubject(editingSubject._id , subjectData);
      } else {
        await createSubject(subjectData);
      }

      await fetchSubjects();

      setEditingSubject(null);
      setIsModalOpen(false);

    } catch(error){
      console.error(error);
    }
  }

  async function fetchSubjects() {
      try{
      const subjectData = await getSubjects();
      setSubjects(subjectData.subjects);
      setLoading(false);
      } catch(error){
        console.error(error);
        setLoading(false);
      }
    }

  
    
  async function  handleEdit(subject) {
    setEditingSubject(subject);
    setIsModalOpen(true);
  }  


  async function  handleDelete(subject) {
    setDeletingSubject(subject);
  }

  async function handleConfirmDelete() {
    try{
      await deleteSubject(deletingSubject._id);
      await fetchSubjects();
      setDeletingSubject(null);
    } catch(error){
      console.error(error);
    }
  }



  useEffect( ()=>{
    fetchSubjects();
  } ,[]);

  return (
    <div className="subject-manager">

      <div className="subject-manager-header">
        <h2>Subject Manager</h2>
        <p>Create, edit or remove your study subjects.</p>
      </div>

      <div className="subject-manager-body">

  {loading ? (
    <p>Loading...</p>
  ) : subjects.length === 0 ? (
    <p>No subjects added yet.</p>
  ) : (
    <div className="subject-items">
        {subjects.map( (subject) =>(
          <SubjectItem
          key={subject._id}
          subject={subject}
          onEdit={handleEdit}
          onDelete={handleDelete}
          />
        ))}

    </div>
  )}

</div>
      <div className="subject-manager-footer">
        <button 
        className="add-subject-btn"
        onClick={handleOpenModal}
        >
          + Add Subject
        </button>
      </div>

      {isModalOpen&&(
        <div className="modal-overlay">  
        <AddSubjectModal 
        onClose={handleCloseModal}
        onSave={handleSave}
        editingSubject={editingSubject}
        />
        </div>
      )}

      {deletingSubject &&(
        <ConfirmDeleteModal 
        onClose={ ()=> setDeletingSubject(null)}
        onDelete={handleConfirmDelete}
        />

      )}


    </div>
  );
}


export default SubjectManager;