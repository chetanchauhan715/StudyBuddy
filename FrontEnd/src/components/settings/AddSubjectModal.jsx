import { useState } from "react";
import "./SubjectModal.css";
import { useEffect } from "react";

function AddSubjectModal({onClose , onSave , editingSubject}){

    const[name , setName]= useState("");
    const[saving , setSaving]=useState(false);

    
async function hanleSubmit(){
    try{
        setSaving(true);
        await onSave({name});
        console.log("Finished onSave");

    } catch(error){
        console.error(error);
    } finally{
        setSaving(false);
    }
        
    }

    useEffect( ()=>{
       if(editingSubject){
        setName(editingSubject.name);
       } else{
        setName("");
       }
    } ,[editingSubject])
    
    return (
        <div className="subject-modal-container">
            <h3>
               {editingSubject ? "Edit Subject" : "Add Subject"}
            </h3>
            <label htmlFor="">Subject Name</label>
            <input 
            type="text"
            value={name}
            onChange={ (e) => setName(e.target.value)} />

            <div className="subject-modal-btn-container">
                <button onClick={onClose}>Cancel</button>

                <button onClick={hanleSubmit}>
                    {saving 
                    ?"Saving"
                    :editingSubject
                    ?"Update"
                    :"Save"}
                    
                </button>
            </div>
        </div>
    )
}

export default AddSubjectModal;