import { Request, Response } from "express";
import { RegisterBody, LoginBody } from "../schemas/auth.schemas.js";
import * as services from '../services/auth.service.js'

//Registration
export async function registering(req: Request, res: Response){
    try {
        //Extract credentials from request
        const { email, password, name} = req.body as RegisterBody;
    
        //check if user already exists
        const userExists = await services.checkUser(email);
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        const passwordHash = await services.hashing(password);
    
        //Store user information to the database
        const user = await services.createUser(email, passwordHash, name);

        return res.status(201).json({
            message: "Successfully Registered!",
            user
        });
    } catch (error) {
        if(services.chechError(error)){
            return res.status(409).json({message: "A user with that email already exists!"})
        }
        throw error;
    };
};