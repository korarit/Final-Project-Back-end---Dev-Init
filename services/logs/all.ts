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

    return res.status(200).json(result.data);
}