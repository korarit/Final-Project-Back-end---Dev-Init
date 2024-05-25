import dotenv from 'dotenv';
import { Request, Response } from 'express';
import moment from 'moment-timezone';
import bcrypt from 'bcrypt';


import { registerDB , haveUser } from '../../models/users.model';

/*
    The register function will take in the username, email, and password of the user and register the user in the database. 
    It will return a status of true if the registration is successful, and false if there is an error.

    @param req: Request - The request object
    @param res: Response - The response object
    @returns res - The response object with a status and message
*/
export default async function register (req: Request, res: Response) {
    const { username, email, password } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลมาครบหรือไม่
    if (!username || !email || !password) {
        return res.status(400).json({status: false, message: 'Please provide all required fields'});
    }

    // ตรวจสอบความยาวของ password
    if (password.length < 6) {
        return res.status(400).json({status: false, message: 'Password must be at least 6 characters long'});
    }

    // ตรวจสอบความถูกต้องของ email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({status: false, message: 'Please provide a valid email address'});
    }

    // ตรวจสอบความถูกต้องของ username
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({status: false, message: 'Username must contain only english letters and numbers'});
    }

    // ตรวจสอบว่ามี username หรือ email นี้อยู่ในระบบแล้วหรือไม่
    if (await haveUser(username, email)) {
        return res.status(400).json({status: false, message: 'Username or email already exists'});
    }

    // สร้าง DATETIME ปัจจุบัน ในรูปแบบ DD-MM-YYYY HH:mm:ss โดยกำหนดให้ timezone เป็น Asia/Bangkok
    const created = moment().tz('Asia/Bangkok').format('DD-MM-YYYY HH:mm:ss');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {

        // เรียกใช้งานฟังก์ชัน registerDB จาก models/users.model.ts
        const registerStatus =  await registerDB(username, email, hashedPassword, created);

        // ตรวจสอบว่าการลงทะเบียนสำเร็จหรือไม่
        if (!registerStatus.status) {
            if (registerStatus.message === 'An error occurred') {
                return res.status(500).json({status: false, message: 'An error occurred'});
            } else {
                return res.status(400).json({status: false, message: 'Please provide all required fields'});
            }
        }
        
        // ส่งข้อความกลับไปยัง client ว่าลงทะเบียนสำเร็จ
        return res.status(201).json({status: true, message: 'User registered successfully'});
    } catch (error) {
        console.error(error);

        // ส่งข้อความกลับไปยัง client ว่าเกิดข้อผิดพลาด
        return res.status(500).json({status: false, message: 'An error occurred'});
    }


}