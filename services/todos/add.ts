import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { addTodo } from '../../models/todos.model';

export default async function Add(req: Request, res: Response) {
    const data = req.body;

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    // Check if the request body is empty
    if(!data.title || !data.description || !data.priority || !data.status){
        return res.status(400).json({status: false, message: 'Please provide required field (title, description, priority, status)'});
    }

    // create a date in the format DD-MM-YYYY
    const due_date = moment().tz('Asia/Bangkok').format('YYYY-MM-DD');
    // create a created_at in the format YYYY-MM-DD HH:mm:ss
    const created_at = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');

    // Call the addTodo function from the todos.model.ts
    const result = await addTodo(req.session.user_id, data.title, data.description, due_date, data.priority, data.status, created_at);

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    // Return the result
    return res.status(200).json(result.message);
}