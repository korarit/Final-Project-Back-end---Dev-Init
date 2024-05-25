import dotenv from 'dotenv';
import { Request, Response } from 'express';
import moment from 'moment-timezone';
import bcrypt from 'bcrypt';

import UserRegister from '../services/users/register';
import UserLogin from '../services/users/login';

// Load environment variables
dotenv.config();

/*
    The register function will take in the username, email, and password of the user and register the user in the database. 
    It will return a status of true if the registration is successful, and false if there is an error.

    @param req: Request - The request object
    @param res: Response - The response object
    @returns res - The response object with a status and message
*/
async function register (req: Request, res: Response) {
    return UserRegister(req, res);
}

/*
    The login function will take in the email or username and password of the user and log the user into the system. 
    It will return a status of true if the login is successful, and false if there is an error.

    @param req: Request - The request object
    @param res: Response - The response object
    @returns res - The response object with a status and message
*/
async function login (req: Request, res: Response) {
    return UserLogin(req, res);
}

export { register, login }