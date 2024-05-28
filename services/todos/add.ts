import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { addTodo } from '../../models/todos.model';

export default async function Add(req: Request, res: Response) {
    const data = req.body;

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    // Check if the request body is empty
    if(!data.title || !data.description || !data.due_date || !data.priority || !data.status){
        return res.status(402).json({status: false, message: 'Please provide required field (title, description, due_date, priority, status)'});
    }

    if(isNaN(data.priority)){
        return res.status(402).json({status: false, message: 'Please provide a valid priority (is a number)'});
    }

    if(typeof data.status !== 'boolean'){
        return res.status(402).json({status: false, message: 'Please provide a valid status (true or false)'});
    }

    //date format validation
    if(!moment(data.due_date).isValid()){
        return res.status(402).json({status: false, message: 'Please provide a valid due_date format YYYY-MM-DD'});
    }



    // due_date
    let due_date = null;

    //format due_date to iso 8601
    const format_due_date = new Date(data.due_date).toISOString();

    //check year of due_date is Buddhist or Christ
    const year = moment(format_due_date).format('YYYY');
    if(parseInt(year) > 2400){
        // convert Buddhist year to Christ year
        due_date = moment(format_due_date).subtract(543, 'years').format('YYYY-MM-DD');
    } else {
        due_date = moment(format_due_date).format('YYYY-MM-DD');
    }

    if(!due_date){
        return res.status(400).json({status: false, message: 'Please provide a valid due_date'});
    }

    // console.log(due_date);

    // create a created_at in the format YYYY-MM-DD HH:mm:ss
    const created_at = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');

    // status boolean to string
    const status_todo = data.status ? 'completed' : 'pending';

    // Call the addTodo function from the todos.model.ts
    const result = await addTodo(req.session.user_id, data.title, data.description, due_date, data.priority, status_todo, created_at);

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    // Return the result
    return res.status(200).json(result.message);
}