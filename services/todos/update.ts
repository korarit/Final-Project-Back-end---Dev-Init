import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { updateTodo, haveTodo, permsissionToEdit } from '../../models/todos.model';

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

    //check if title is string
    if(req.body.title){
        if(typeof req.body.title !== 'string'){
            return res.status(400).json({status: false, message: 'Please provide a valid title (is a string)'});
        }

        // check length of title
        if(req.body.title.length > 0){
            return res.status(400).json({status: false, message: 'Title must be at least 0 characters'});
        }
    }

    //check if description is string
    if(req.body.description){
        if(typeof req.body.description !== 'string'){
            return res.status(400).json({status: false, message: 'Please provide a valid description (is a string)'});
        }

        // check length of description
        if(req.body.description.length > 0){
            return res.status(400).json({status: false, message: 'Description must be at least 0 characters'});
        }
    }

    // Check if the request body has due_date to validate
    if(req.body.due_date){
        //date format validation
        if(!moment(req.body.due_date).isValid()){
            return res.status(400).json({status: false, message: 'Please provide a valid due_date format YYYY-MM-DD'});
        }
    }

    // Check if the request body has priority to validate
    if(req.body.priority){
        if(isNaN(req.body.priority)){
            return res.status(400).json({status: false, message: 'Please provide a valid priority (is a number)'});
        }
    }

    // Check if the request body has status to validate
    if(req.body.status){
        if(typeof req.body.status !== 'boolean'){
            return res.status(400).json({status: false, message: 'Please provide a valid status (true or false)'});
        }
    }

    //check have todo id
    const haveTodoId = await haveTodo(parseInt(req.params.id));
    if(!haveTodoId){
        return res.status(400).json({status: false, message: 'Todo id not found'});
    }

    // check permission to edit
    const havePermission = await permsissionToEdit(req.session.user_id, parseInt(req.params.id));
    if(!havePermission){
        return res.status(401).json({status: false, message: 'You are not to access this'});
    }


    if(req.body.title){
        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.title, 'title');
        if(!result.status){
            return res.status(500).json({status: false, message: 'Update title failed'});
        }
    }
    if(req.body.description){
        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.description, 'description');
        if(!result.status){
            return res.status(500).json({status: false, message: 'Update description failed'});
        }
    }

    // Check if the request body has due_date
    if(req.body.due_date){

        // due_date
        let due_date = null;

        //format due_date to iso 8601
        const format_due_date = new Date(req.body.due_date).toISOString();

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

        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.due_date, 'due_date');
        if(!result.status){
            return res.status(500).json({status: false, message: 'Update due_date failed'});
        }
    }

    // Check if the request body has priority
    if(req.body.priority){

        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), req.body.priority, 'priority');
        if(!result.status){
            return res.status(500).json({status: false, message: 'Update priority failed'});
        }
    }

    // Check if the request body has status
    if(req.body.status){
        // status boolean to string
        const status_todo = req.body.status ? 'completed' : 'pending';

        const result = await updateTodo(req.session.user_id, parseInt(req.params.id), status_todo, 'status');
        if(!result.status){
            return res.status(500).json({status: false, message: 'Update status failed'});
        }
    }


    // Return the result
    return res.status(200).json({status: true, message: 'Update success'});
    
}