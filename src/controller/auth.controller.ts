import { Request, Response } from "express";
import { RegisterBody, LoginBody } from "../schemas/auth.schemas.js";
import { hashPassword, verifyPassword } from '../utils/password.js';
import { REFRESH_COOKIE_NAME, refreshCookieOptions } from "../utils/refresh-token.js";
import * as services from '../services/auth.service.js'

//Registration
export async function registering(req: Request, res: Response){
    try {
        //Extract credentials from request
        const { email, password, name} = req.body as RegisterBody;
    
        //check if user already exists
        const userExists = await services.checkUser(email);
        if(userExists){
            return res.status(409).json({message: "User already exists"});
        }

        const passwordHash = await hashPassword(password);
    
        //Store user information to the database
        const user = await services.createUser(email, passwordHash, name);

        return res.status(201).json({
            message: "Successfully Registered!",
            user
        });
    } catch (error) {
        if(services.checkError(error)){
            return res.status(409).json({message: "A user with that email already exists!"})
        }
        throw error;
    };
};

//Login 
export async function loging(req: Request, res: Response){
    //Extract credentials from request
    const {email, password} = req.body as LoginBody;

    //check if user exists
    const user = await services.checkUser(email);
    if(!user?.passwordHash){
        return res.status(404).json({message: "Invalid Email or Password!"})
    };
    const isValid = user ?  verifyPassword(password, user.passwordHash) : false;

    if(!user || !isValid || !user.isActive){
        return res.status(400).json({message: "Invalid Email or Password!"})
    }

    const { accessToken, refreshCredential} = await services.giveToken(user);

    res.cookie(
        REFRESH_COOKIE_NAME,
        refreshCredential,
        refreshCookieOptions
    )

    res.status(200).json({
        message: "Login Successful!",
        accessToken,
        user: {
            id: user.id,
            email: user.email,
            role: user.role.name,
            isActive: user.isActive,
            createdAt: user.createdAt,
        }
    })
};