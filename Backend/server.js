import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js"; 
import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


// database connection ----
connectDB();



app.use(userRoutes); // user routes - sign up & login 

app.use(studySessionRoutes); // - crud routes (Study session)

app.use(errorMiddleware);  // global error middleware 


//--------- base 

app.get("/"  ,  (req, res) =>{
    res.send("StudyBuddy API Running ");
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});