import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { addLog } from "../../models/logs.model";

export default async function (req: Request, res: Response) {
    const data = req.body;

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    // Check if the request body is empty
    if(!data.content){
        return res.status(400).json({status: false, message: 'Please provide required field content'});
    }

    // create a date in the format DD-MM-YYYY
    const now_date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
    // create a created_at in the format DD-MM-YYYY HH:mm:ss
    const created_at = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');

    // Call the addLog function from the logs.controller.ts
    const result = await addLog(req.session.user_id, data.content, now_date, created_at);

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    // Return the result
    return res.status(200).json(result.message);
}