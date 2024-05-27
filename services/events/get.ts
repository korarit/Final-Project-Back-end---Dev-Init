import { Request, Response } from 'express';

import { getEventById, haveEvent, permissionToEdit } from '../../models/events.model';

export default async function GetEvent(req: Request, res: Response) {
   
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

    // Call the getEventById function from the events.model.ts
    const result = await getEventById(req.session.user_id, parseInt(req.params.id));

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    if(!result.data){
        return res.status(400).json({status: false, message: 'You have no event'});
    }

    // check if have event
    if(result.data.length === 0){
        return res.status(400).json({status: false, message: 'You have no event'});
    }

    const event = result.data?.map((event: any) => {
        return {
            event_id: event.event_id,
            title: event.title,
            description: event.description,
            start_date: new Date(event.start_date).toLocaleDateString('th-TH', {timeZone: 'Asia/Bangkok'}),
            end_date: new Date(event.end_date).toLocaleDateString('th-TH', {timeZone: 'Asia/Bangkok'}),
            created_at: new Date(event.created_at).toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'}),
        }
    }
    );

    // Return the result
    return res.status(200).json(event);


}