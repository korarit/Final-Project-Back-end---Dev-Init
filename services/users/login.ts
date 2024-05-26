import { Request, Response } from 'express';
import moment from 'moment-timezone';
import bcrypt from 'bcrypt';


import { loginDB , updateLastLogin } from '../../models/users.model';

/*
    The login function will take in the email or username and password of the user and log the user into the system. 
    It will return a status of true if the login is successful, and false if there is an error.

    @param req: Request - The request object
    @param res: Response - The response object
    @returns res - The response object with a status and message
*/
export default async function login (req: Request, res: Response) {
    const data = req.body;

    if(!data.password) {
        return res.status(400).json({status: false, message: 'Please provide  required field password'});
    }

    if (data.email) {
        // ตรวจสอบความถูกต้องของ email
        if (!data.email.match(/\S+@\S+\.\S+/)) {
            return res.status(400).json({status: false, message: 'Please provide a valid email address'});
        }

        // เรียกใช้งานฟังก์ชัน loginDB จาก models/users.model.ts
        const loginStatus = await loginDB(data.email, 'email');

        // ตรวจสอบว่า email นี้อยู่ในระบบหรือไม่
        if (!loginStatus.status) {
            return res.status(400).json({status: false, message: 'Invalid email or password'});
        }

        // ตรวจสอบรหัสผ่าน ในกรณีที่ email ถูกต้อง
        if (!loginStatus.password) {
            return res.status(500).json({status: false, message: 'An error occurred'});
        }

        const passwordMatch = await bcrypt.compare(data.password, loginStatus.password);

        // ตรวจสอบรหัสผ่าน ว่าตรงกับที่อยู่ในฐานข้อมูลหรือไม่
        if (!passwordMatch) {
            return res.status(400).json({status: false, message: 'Invalid email or password'});
        }

        if (!loginStatus.user_id) {
            return res.status(500).json({status: false, message: 'An error occurred'});
        }

        // update last login
        const datetime_login = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
        const updateStatus = await updateLastLogin(loginStatus.user_id, datetime_login);

        if (!updateStatus) {
            return res.status(500).json({status: false, message: 'An error occurred'});
        }

        // สร้าง session สำหรับ user ที่เข้าสู่ระบบ
        req.session.user_id = loginStatus.user_id;

        // ส่งข้อความกลับไปยัง client ว่าเข้าสู่ระบบสำเร็จ
        return res.status(200).json({status: true, message: 'Login successful'});
        
    } else if (data.username) {

        // เรียกใช้งานฟังก์ชัน loginDB จาก models/users.model.ts
        const loginStatus = await loginDB(data.username, 'username');

        // ตรวจสอบว่า username นี้อยู่ในระบบหรือไม่
        if (!loginStatus.status) {
            return res.status(400).json({status: false, message: 'Invalid username or password'});
        }

        // ตรวจสอบรหัสผ่าน ในกรณีที่ username ถูกต้อง
        if (!loginStatus.password) {
            return res.status(500).json({status: false, message: 'An error occurred'});
        }

        const passwordMatch = await bcrypt.compare(data.password, loginStatus.password);

        // ตรวจสอบรหัสผ่าน ว่าตรงกับที่อยู่ในฐานข้อมูลหรือไม่
        if (!passwordMatch) {
            return res.status(400).json({status: false, message: 'Invalid username or password'});
        }

        if (!loginStatus.user_id) {
            return res.status(500).json({status: false, message: 'An error occurred'});
        }

        // update last login
        const datetime_login = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
        const updateStatus = await updateLastLogin(loginStatus.user_id, datetime_login);

        if (!updateStatus) {
            return res.status(500).json({status: false, message: 'An error occurred'});
        }


        // สร้าง session สำหรับ user ที่เข้าสู่ระบบ
        req.session.user_id = loginStatus.user_id;

        // ส่งข้อความกลับไปยัง client ว่าเข้าสู่ระบบสำเร็จ
        return res.status(200).json({status: true, message: 'Login successful'});

    } else {
        return res.status(400).json({status: false, message: 'Please provide required field (email or username)'});
    }

}
