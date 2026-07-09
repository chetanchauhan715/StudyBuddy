import bcrypt from "bcrypt";
import User from "../models/User.js";

export async function signup(req,res){

    const {name , email , password} = req.body;

    if(!name || !email || !password){
        return res.status(400).send("please fill all required fields");
     } 
 
    
    const hashedPassword = await bcrypt.hash(password , 10); // password hashing

    const newUser = {
        name,
        email,
        password:hashedPassword
    };

    try{


    const existingUser = await User.findOne( {email});
    if(existingUser){
        return res.status(400).send("Email alraedy exist");
    }

        await User.create(newUser);
        return res.status(201).send("Signup Succesfull");

    } catch (error) {
        console.log(error);
        return res.status(500).send("Something went Wrong");
    }
}


//=======-------------


export async function login(req,res){
    const {email , password} = req.body;

    if(!email || !password){
        return res.status(400).send("Please Fill all the fileds");
    }

    try{
        const existingUser = await User.findOne( {email});

        if(!existingUser){
            return res.status(404).send("User Not Found");
        } 


        const isMatch = await bcrypt.compare(password , existingUser.password);
        if(isMatch){
            // jwt token -------------
            const token = jwt.sign(
                {   
                    userId:existingUser._id
                },
                process.env.JWT_SECRET
            );

           return  res.status(200).send(token); // login 
        }

        return res.status(401).send("Invalid Password");

    } catch (error){
        console.log(error);
        res.status(500).send("Unexpected Error Occurred");
    }
}