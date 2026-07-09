import express from "express";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js";

const app = express();

app.use(express.json());

// database connection ----
connectDB();

app.use(userRoutes); // user routes - sign up & login 

app.use(studySessionRoutes); // - crud routes (Study session)


//--------- base 

app.get("/"  ,  (req, res) =>{
    res.send("StudyBuddy API Running ");
});


app.listen(3000 , () => {
    console.log("Server Started");
});