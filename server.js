// const users = [];
// console.log("VERSION 2 - " + new Date().toLocaleTimeString());
// const studySessions = [];
let nextSessionId = 1;

import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import StudySession from "./models/StudySession.js";

const app = express();

app.use(express.json());

// database connection ----
connectDB();

//--------- base 

app.get("/"  ,  (req, res) =>{
    res.send("StudyBuddy API Running ");
});


// --------------- signup Api

app.post("/signup" , async (req, res) =>{ 
    const {name , email , password} = req.body;

    const newUser = {
        name,
        email,
        password
    };

    if(!name || !email || !password){
       return  res.send("please fill all required fields");
    } 

    // for(const user of users){
    //     if(user.email.toLowerCase() === newUser.email.toLowerCase()){
    //         return res.send(`${newUser.email} alraedy Exist`);
    //     }
    // }

    try{

    const existingUser = await User.findOne( {email});
    if(existingUser){
        return res.send("Email alraedy exist");
    }
    
        await User.create(newUser);
        return res.send("Signup Succesfull");

    } catch (error) {
        console.log(error);
        return res.send("Something went Wrong");
    }

});

// ------------------ login Api 

app.post("/login" , async (req, res) =>{

    const {email , password} = req.body;

    if(!email || !password){
        return res.send("Please Fill all the fileds");
    }

    // for(const user of users){
    //     if(email.toLowerCase()  === user.email.toLowerCase()){
    //         if(password === user.password){
    //             return res.send("Succesfull Login");
    //         } else{
    //             return res.send("Invalid Password");
    //         }
    //     }
    // }

    try{
        const existingUser = await User.findOne( {email});

        if(!existingUser){
            return res.send("User Not Found");
        } 

        if(existingUser.password === password){
            return res.send("Login Succesfull");
        }

        return res.send("Invalid Password");

    } catch (error){
        console.log(error);
        res.send("Unexpected Error Occurred");
    }
});




//-------------------Study sesssion Api 

app.post("/study-sessions" , async (req, res) => {
    const {subject , topic , duration , status} = req.body;

    if(!subject || !duration || !status){
        return res.send("Please fill all the requied Fields");
    }

    const newStudySession = {
        // id:nextSessionId,
        subject , 
        topic , 
        duration,
        status, 
        // createdAt: new Date()
    }

    try{

        await StudySession.create(newStudySession);
        console.log("New Study session created Succesfully");
        return res.send("Succesfull creation");
    } catch (error){

        console.log(error);
        return res.send("Unexpected error occurred");
    }



    
    // studySessions.push(newStudySession);

    // nextSessionId++;


    // console.log(studySessions);

    // return res.send("Study Session created succesfully ")

});




//--------------study Session get Api 

app.get("/study-sessions" , (req , res) =>{

    
    res.send(studySessions);
});


//---------------study sessions update API

app.put("/study-sessions/:id" , (req, res) =>{
    const {id} = req.params;

    for(const session of studySessions){
        if(Number(id) === session.id){
            session.status = "Completed";
            return res.send("Status updated Succesfully");
        } 
    } 

    return res.send("Study session not Found");
});


//----------- study session delete API

app.delete("/study-sessions/:id" , (req , res) =>{
    const {id} = req.params;
    for(let i=0; i<studySessions.length; i++){
        if(studySessions[i].id === Number(id)){
            studySessions.splice(i,1);
            return res.send("Delte session succesfully");
        }
    }
    return res.send("Studdy session not found");
});
//-------------- server Listen on Port 3000 

app.listen(3000 , () => {
    console.log("Server Started");
});