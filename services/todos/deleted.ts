import { Request, Response } from 'express';

import { deleteTodo, haveTodo, permsissionToEdit } from '../../models/todos.model';

export default async function Deleted(req: Request, res: Response) {

    if(!req.params.id){
        return res.status(400).json({status: false, message: 'Please provide id'});
    }

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    //check have todo id
    const haveTodoId = await haveTodo(parseInt(req.params.id));
    if(!haveTodoId){
        return res.status(400).json({status: false, message: 'Todo id not found'});
    }

    // Check if the user has permission to edit
    const havePermission = await permsissionToEdit(req.session.user_id, parseInt(req.params.id));
    if(!havePermission){
        return res.status(401).json({status: false, message: 'You are not to access this'});
    }

    // Call the deleteTodo function from the todos.model.ts
    const result = await deleteTodo(req.session.user_id, parseInt(req.params.id));

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    // Return the result
    return res.status(200).json(result.message);
}