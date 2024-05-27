import { Request, Response } from 'express';

import { deleteEvent, haveEvent, permissionToEdit } from '../../models/events.model';


export default async function Deleted(req: Request, res: Response) {
    
        if(!req.params.id){
            return res.status(400).json({status: false, message: 'Please provide id'});
        }
    
        if(!req.session.user_id){
            return res.status(401).json({status: false, message: 'You are not authorized to access this'});
        }
    
        //check have event id
        const haveEventId = await haveEvent(parseInt(req.params.id));
        if(!haveEventId){
            return res.status(400).json({status: false, message: 'Event id not found'});
        }
    
        // Check if the user has permission to edit
        const havePermission = await permissionToEdit(req.session.user_id, parseInt(req.params.id));
        if(!havePermission){
            return res.status(401).json({status: false, message: 'You are not to access this'});
        }
    
        // Call the deleteEvent function from the events.model.ts
        const result = await deleteEvent(req.session.user_id, parseInt(req.params.id));
    
        // Check if error occurred
        if(!result.status){
            return res.status(500).json(result.message);
        }
    
        // Return the result
        return res.status(200).json(result.message);
}