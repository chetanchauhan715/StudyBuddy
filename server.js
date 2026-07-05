const users = [];
const studySessions = [];
let nextSessionId = 1;

import express from "express";

const app = express();

app.use(express.json());

app.get("/"  , (req, res) =>{
    res.send("StudyBuddy API Running ");
})


// --------------- signup Api

app.post("/signup" , (req, res) =>{
    const {name , email , password} = req.body;

    const newUser = {
        name,
        email,
        password
    };

    if(!name || !email || !password){
       return  res.send("please fill all required fields");
    } 

    for(const user of users){
        if(user.email.toLowerCase() === newUser.email.toLowerCase()){
            return res.send(`${newUser.email} alraedy Exist`);
        }
    }

    
    users.push(newUser);
    console.log(users);

    return res.send("Signup Succesfull");

    
})



// ------------------ login Api 

app.post("/login" , (req, res) =>{
    const {email , password} = req.body;

    if(!email || !password){
        return res.send("Please Fill all the fileds");
    }

    for(const user of users){
        if(email.toLowerCase()  === user.email.toLowerCase()){
            if(password === user.password){
                return res.send("Succesfull Login");
            } else{
                return res.send("Invalid Password");
            }
        }
    }

    return res.send("User Not Found");

})




//-------------------Study sesssion Api 

app.post("/study-sessions" , (req, res) => {
    const {subject , topic , duration , status} = req.body;

    if(!subject || !topic || !duration || !status){
        return res.send("Please fill all the requied Fields");
    }

    const newStudySession = {
        id:nextSessionId,
        subject , 
        topic , 
        duration,
        status, 
        createdAt: new Date()
    }

    
    studySessions.push(newStudySession);

    nextSessionId++;


    console.log(studySessions);

    return res.send("Study Session created succesfully ")

})




//--------------study Session get Api 

app.get("/study-sessions" , (req , res) =>{

    
    res.send(studySessions);
})


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
})


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
})
//-------------- server Listen on Port 3000 

app.listen(3000 , () => {
    console.log("Server Started");
})