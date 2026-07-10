import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req,res , next){

    const {name , email , password} = req.body;

    try{

    const existingUser = await User.findOne( {email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"Email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password , 10); // password hashing

    const newUser = {
        name,
        email,
        password:hashedPassword
    };

        await User.create(newUser);
        return res.status(201).json({
            success:true,
            message:"Signup Succesfull"
        });

    } catch (error) {
        next(error);
    }
}


//=======-------------


export async function login(req,res, next){
    const {email , password} = req.body;

    try{
        const existingUser = await User.findOne( {email});

        if(!existingUser){
            return res.status(404).json({
                success:false,
                message:"User Not Found"
            });

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

           return  res.status(200).json({
            success:true,
            message:"Login Succesful",
            data:{
                token
            }

           }); // login 
        }

        return res.status(401).json({
            success:false,
            message:"Invalid Password"
        });

    } catch (error){
        next(error);
    }
}