import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { getTodoById, permsissionToEdit } from '../../models/todos.model';

export default async function GetTodoById(req: Request, res: Response) {

    if(!req.params.id){
        return res.status(400).json({status: false, message: 'Please provide id'});
    }

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    //check permission to edit
    const havePermission = await permsissionToEdit(req.session.user_id, parseInt(req.params.id));
    if(!havePermission){
        return res.status(401).json({status: false, message: 'You are not to access this'});
    }

    
    // Call the getTodoById function from the todos.model.ts
    const result = await getTodoById(req.session.user_id, parseInt(req.params.id));

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    const todo = result.data?.map((todo: any) => {
        return {
            id: todo.id,
            title: todo.title,
            description: todo.description,
            due_date: new Date(todo.due_date).toLocaleDateString('th-TH', {timeZone: 'Asia/Bangkok'}),
            priority: todo.priority,
            status: todo.status,
            created_at: new Date(todo.created_at).toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'}),
        }
    }
    );

    // Return the result
    return res.status(200).json(todo);
}