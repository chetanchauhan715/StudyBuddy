const users = [];

import express from "express";

const app = express();

app.use(express.json());

app.get("/"  , (req, res) =>{
    res.send("StudyBuddy API Running ");
})

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

app.listen(3000 , () => {
    console.log("Server Started");
})