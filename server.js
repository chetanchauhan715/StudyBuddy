
import express from "express";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import StudySession from "./models/StudySession.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

function authMiddleware (req , res , next){
   
    const token = req.headers.authorization;

    if(!token){
        return res.send("Please Login ");
    }

    console.log(token);

   next();
} 

// app.use(authMiddleware);


// database connection ----
connectDB();

//--------- base 

app.get("/"  ,  (req, res) =>{
    res.send("StudyBuddy API Running ");
});


// --------------- signup Api

app.post("/signup" , async (req, res) =>{ 
    const {name , email , password} = req.body;

    const hashedPassword = await bcrypt.hash(password , 10); // password hashing

    const newUser = {
        name,
        email,
        password:hashedPassword
    };

    if(!name || !email || !password){
       return  res.send("please fill all required fields");
    } 


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

    try{
        const existingUser = await User.findOne( {email});

        if(!existingUser){
            return res.send("User Not Found");
        } 


        const isMatch = await bcrypt.compare(password , existingUser.password);
        if(isMatch){
            // jwt token -------------
            const token = jwt.sign(
                {   
                    userId:existingUser._id
                },
                "mySecretKey"
            );

           return  res.send(token);
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
        subject , 
        topic , 
        duration,
        status, 
    }

    try{

        await StudySession.create(newStudySession);
        console.log("New Study session created Succesfully");
        return res.send("Succesfull creation");
    } catch (error){
        console.log("DELETE ERROR:");
        console.log(error);
        return res.status(500).send(error.message);
    }

});


//--------------study Session get Api 

app.get("/study-sessions" , async (req , res) =>{

    try{
       const session =  await StudySession.find();
       return res.send(session);
    }
    catch (error){
        console.log(error);
        res.send("Unexpected error occurred");
    }
   
});


//---------------study sessions update API

app.put("/study-sessions/:id" , async (req, res) =>{
    
    try{
        const {id} = req.params;
        const session = await StudySession.findById(id);
        if(!session){
            
            return res.send("Session Not Found");
        } else {
            session.status = "Completed";
            await session.save();
            return res.send("Study Session Update Succesfully");
        }
        

    } catch (error){
        console.log(error);
        return res.send("Unexpected Error occurred");
    }



    
});


//----------- study session delete API

app.delete("/study-sessions/:id" , async (req , res) =>{

    try{
        const {id} = req.params;
        const session = await StudySession.findById(id);
        if(!session){
            return res.send("Study session Not Found");
        } 

        await session.deleteOne();
        return res.send("Study session Deleted succesfully");
    } catch (error){
        console.log(error);
        return res.send("Unexpected Error Occurred");
    }

});
//-------------- server Listen on Port 3000 

app.listen(3000 , () => {
    console.log("Server Started");
});