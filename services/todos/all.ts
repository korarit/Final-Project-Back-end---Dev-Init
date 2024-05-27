import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { getAllTodos } from '../../models/todos.model';

export default async function All(req: Request, res: Response) {
    const data = req.body;

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    // Call the getAllTodos function from the todos.model.ts
    const result = await getAllTodos(req.session.user_id);

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    const list_todo = result.data?.map((todo: any) => {
        return {
            todo_id: todo.todo_id,
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
    return res.status(200).json(list_todo);
}