// only job is connect to MongoDB 

import mongoose from "mongoose";

// not connecting directly , when someone calls then conenct 
const connectDB = async () => {

    try{

        await mongoose.connect(process.env.MONGO_URI);

        
    } catch (error){
        

        console.error(error);
        process.exit(1);
    }
};

export default connectDB;