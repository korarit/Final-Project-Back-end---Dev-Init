import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { updateTodo, permsissionToEdit } from '../../models/todos.model';

export default async function update(req: Request, res: Response) {
    
    // Check if the request body is empty
    if(!req.body.title && !req.body.description && !req.body.priority && !req.body.status && !req.body.due_date){
        return res.status(400).json({status: false, message: 'Please provide required field (title, description, priority, status)'});
    }

    // check id
    if(!req.params.id){
        return res.status(400).json({status: false, message: 'Please provide id'});
    }

    // check user_id
    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    // check permission to edit
    const havePermission = await permsissionToEdit(req.session.user_id, parseInt(req.params.id));
    if(!havePermission){
        return res.status(401).json({status: false, message: 'You are not to access this'});
    }

    if(req.body.title){
        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.title, 'title');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }
    if(req.body.description){
        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.description, 'description');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }
    if(req.body.due_date){
        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.due_date, 'due_date');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }
    if(req.body.priority){
        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.priority, 'priority');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }
    if(req.body.status){
        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.status, 'status');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }


    // Return the result
    return res.status(200).json({status: true, message: 'Update success'});
    
}