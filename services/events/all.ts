import { Request, Response } from 'express';

import { getAllEvent } from '../../models/events.model';

export default async function getEventAll(req: Request, res: Response) {

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    // Call the getAllEvent function from the events.model.ts
    const result = await getAllEvent(req.session.user_id);
    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    // check if have data
    if(!result.data){
        return res.status(400).json({status: false, message: 'You have no event'});
    }

    // check if have event
    if(result.data.length === 0){
        return res.status(400).json({status: false, message: 'You have no event'});
    }

    // Return the result
    const events = result.data?.map((event: any) => {
        return {
            event_id: event.event_id,
            title: event.title,
            description: event.description,
            start_date: new Date(event.start_date).toLocaleDateString('th-TH', {timeZone: 'Asia/Bangkok'}),
            end_date: new Date(event.end_date).toLocaleDateString('th-TH', {timeZone: 'Asia/Bangkok'}),
            created_at: new Date(event.created_at).toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'}),
        }
    });



    // Return the result
    return res.status(200).json();
}