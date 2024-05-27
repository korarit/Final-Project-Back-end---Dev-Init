import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { addEvent } from '../../models/events.model';

export default async function Add(req: Request, res: Response) {

    if(!req.body.title || !req.body.description || !req.body.start_date || !req.body.end_date){
        return res.status(400).json({status: false, message: 'Please provide required field (title, description, start_date, end_date)'});
    }

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    if(!moment(req.body.start_date, "YYYY-MM-DD HH:mm:ss", true).isValid()){
        return res.status(400).json({status: false, message: 'Please provide a valid start_date format YYYY-MM-DD HH:mm:ss'});
    }

    if(!moment(req.body.end_date, "YYYY-MM-DD HH:mm:ss", true).isValid()){
        return res.status(400).json({status: false, message: 'Please provide a valid end_date format YYYY-MM-DD HH:mm:ss'});
    }

    // start_date
    let start_date = null;
    //format start_date to iso 8601
    const format_start_date = new Date(req.body.start_date).toISOString();
    //check year of start_date is Buddhist or Christ
    const year_start = moment(format_start_date).tz('Asia/Bangkok').format('YYYY');
    if(parseInt(year_start) > 2400){
        // convert Buddhist year to Christ year
        start_date = moment(format_start_date,).tz('Asia/Bangkok').subtract(543, 'years').format('YYYY-MM-DD HH:mm:ss');
    } else {
        start_date = moment(format_start_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    }


    // end_date
    let end_date = null;
    //format end_date to iso 8601
    const format_end_date = new Date(req.body.end_date).toISOString();
    //check year of end_date is Buddhist or Christ
    const year_end = moment(format_end_date).tz('Asia/Bangkok').format('YYYY');
    if(parseInt(year_end) > 2400){
        // convert Buddhist year to Christ year
        end_date = moment(format_end_date).tz('Asia/Bangkok').subtract(543, 'years').format('YYYY-MM-DD HH:mm:ss');
    } else {
        end_date = moment(format_end_date).tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');
    }

    //create a created_at in the format YYYY-MM-DD HH:mm:ss
    const created_at = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm:ss');

    // Call the addEvent function from the events.model.ts
    const result = await addEvent(req.session.user_id, req.body.title, req.body.description, start_date, end_date, created_at);

    // Check if error occurred
    if(!result.status){
        return res.status(500).json(result.message);
    }

    // Return the result
    return res.status(200).json(result.message);


}