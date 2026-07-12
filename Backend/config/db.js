// only job is connect to MongoDB 

import mongoose from "mongoose";

// not connecting directly , when someone calls then conenct 
const connectDB = async () => {

    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected Succesfully");
    } catch (error){
        console.log("MongoDB connection Failed");

        console.log(error);
        process.exit(1);
    }
};

export default connectDB;