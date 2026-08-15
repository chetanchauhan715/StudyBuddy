import "dotenv/config";

import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import studySessionRoutes from "./routes/studySessionRoutes.js"; 
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import NotificationRoutes from "./routes/notificationRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";



const app = express();

app.use(cors());    // allow multiple origins 

app.use(express.json({
    verify:(req , res, buf) =>{
        if(req.originalUrl=== "/payments/webhook"){
            req.rawBody = buf;
        }
    }
}));     // for normal user express.json for razor pay - req.rawBody = original body not in json



// database connection ----
connectDB();



app.use(userRoutes); // user routes - sign up & login 

app.use(studySessionRoutes); // - crud routes (Study session)

app.use(profileRoutes); // - profile routes 

app.use(dashboardRoutes) // - dashboard routes 

app.use(subjectRoutes) // -- subject routes 

app.use(adminRoutes) // -- admin routes 

app.use(paymentRoutes) // -- payment routes 

app.use(NotificationRoutes) // - notification routes

app.use(errorMiddleware);  // global error middleware 


//--------- base 

app.get("/"  ,  (req, res) =>{
    res.send("StudyBuddy API Running ");
});

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});