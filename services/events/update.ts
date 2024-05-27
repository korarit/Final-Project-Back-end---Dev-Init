import { Request, Response } from 'express';
import moment from 'moment-timezone';

import { updateEvent, haveEvent, permissionToEdit } from '../../models/events.model';


export default async function Update(req: Request, res: Response) {

    // Check if the user authorized
    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    // Check if the user provided the id
    if(!req.params.id){
        return res.status(400).json({status: false, message: 'Please provide id'});
    }

    // Check if the user  title is string
    if(req.body.title){
        if(typeof req.body.title !== 'string'){
            return res.status(400).json({status: false, message: 'Please provide a valid title (is a string)'});
        }
    }

    // Check if the user description is string
    if(req.body.description){
        if(typeof req.body.description !== 'string'){
            return res.status(400).json({status: false, message: 'Please provide a valid description (is a string)'});
        }
    }

    // Check if the user start_date is string and valid date
    if(req.body.start_date){
        if(typeof req.body.start_date !== 'string'){
            return res.status(400).json({status: false, message: 'Please provide a valid start_date (is a string)'});
        }

        if(!moment(req.body.start_date, "YYYY-MM-DD HH:mm:ss", true).isValid()){
            return res.status(400).json({status: false, message: 'Please provide a valid start_date format YYYY-MM-DD HH:mm:ss'});
        }
    }

    // Check if the user end_date is string and valid date
    if(req.body.end_date){
        if(typeof req.body.end_date !== 'string'){
            return res.status(400).json({status: false, message: 'Please provide a valid end_date (is a string)'});
        }

        if(!moment(req.body.end_date, "YYYY-MM-DD HH:mm:ss", true).isValid()){
            return res.status(400).json({status: false, message: 'Please provide a valid end_date format YYYY-MM-DD HH:mm:ss'});
        }
    }

    // Check if the user has event id
    const haveEventId = await haveEvent(parseInt(req.params.id));
    if(!haveEventId){
        return res.status(400).json({status: false, message: 'Event id not found'});
    }

    // Check if the user has permission to edit
    const havePermission = await permissionToEdit(req.session.user_id, parseInt(req.params.id));
    if(!havePermission){
        return res.status(401).json({status: false, message: 'You are not to access this'});
    }

    // update title
    if(req.body.title){
        const result = await updateEvent(req.session.user_id, parseInt(req.params.id), req.body.title, 'title');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }

    // update description
    if(req.body.description){
        const result = await updateEvent(req.session.user_id, parseInt(req.params.id), req.body.description, 'description');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }

    // update start_date
    if(req.body.start_date){
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

        const result = await updateEvent(req.session.user_id, parseInt(req.params.id), start_date, 'start_date');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }

    // update end_date
    if(req.body.end_date){
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

        const result = await updateEvent(req.session.user_id, parseInt(req.params.id), end_date, 'end_date');
        if(!result.status){
            return res.status(500).json(result.message);
        }
    }
}