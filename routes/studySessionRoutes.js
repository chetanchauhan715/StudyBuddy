import express from "express";
import StudySession from "../models/StudySession.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// crud operation API 

// - create API 

router.post("/study-sessions" , authMiddleware ,  async (req, res) => {
    const {subject , topic , duration , status} = req.body;

    if(!subject || !duration || !status){
        return res.status(400).send("Please fill all the requied Fields");
    }

    const newStudySession = {
        subject , 
        topic , 
        duration,
        status, 
        user:req.user.userId
    }

    try{

        await StudySession.create(newStudySession);
        console.log("New Study session created Succesfully");
        return res.status(201).send("Succesfull creation");
    } catch (error){
        console.log("CREATE ERROR:");
        console.log(error);
        return res.status(500).send(error.message);
    }

});

//  study session - get Api 

router.get("/study-sessions" , authMiddleware , async (req , res) =>{

    try{
       const sessions =  await StudySession.find({user:req.user.userId});
       return res.status(200).send(sessions);
    }
    catch (error){
        console.log(error);
        res.status(500).send("Unexpected error occurred");
    }
   
});

//----- update ------ 

router.put("/study-sessions/:id" , authMiddleware ,  async (req, res) =>{
    
    try{
        const {id} = req.params;
        const session = await StudySession.findOne({
            _id:id , 
            user:req.user.userId
        });
        if(!session){
            
            return res.status(404).send("Session Not Found");
        } else {
            session.status = "Completed";
            await session.save();
            return res.status(200).send("Study Session Update Succesfully");
        }
        

    } catch (error){
        console.log(error);
        return res.status(500).send("Unexpected Error occurred");
    }

});

// ------ delete ---

router.delete("/study-sessions/:id" , authMiddleware ,  async (req , res) =>{

    try{
        const {id} = req.params;
        const session = await StudySession.findOne({
            _id:id,
            user:req.user.userId
        });
        if(!session){
            return res.status(404).send("Study session Not Found");
        } 

        await session.deleteOne();
        return res.status(200).send("Study session Deleted succesfully");
    } catch (error){
        console.log(error);
        return res.status(500).send("Unexpected Error Occurred");
    }

});



// ------- export 
export default router;
