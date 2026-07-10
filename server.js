import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js"; 
    import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

app.use(express.json());

// database connection ----
connectDB();

dotenv.config();

app.use(userRoutes); // user routes - sign up & login 

app.use(studySessionRoutes); // - crud routes (Study session)

app.use(errorMiddleware);  // global error middleware 


//--------- base 

app.get("/"  ,  (req, res) =>{
    res.send("StudyBuddy API Running ");
});


app.listen(3000 , () => {
    console.log("Server Started");
});