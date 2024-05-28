import { Request, Response } from 'express';

import { getAllLog } from "../../models/logs.model";

export default async function (req: Request, res: Response) {
    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    const result = await getAllLog(req.session.user_id);

    if(!result.status){
        return res.status(500).json(result.message);
    }

    if(!result.data){
        return res.status(404).json(result.message);
    }

    const new_list_log = result.data.map((log: any) => {
        return {
            id: log.log_id,
            content: log.content,
            date: new Date(log.created_at).toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'}),
            created_at: new Date(log.date).toLocaleDateString('th-TH', {timeZone: 'Asia/Bangkok'})
        }
    })

    return res.status(200).json(new_list_log);
}