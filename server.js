import express from "express";

const app = express();

app.get("/"  , (req, res) =>{
    res.send("StudyBuddy API Running ");
})

app.listen(3000 , () => {
    console.log("Server Started");
})