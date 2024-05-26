import { Request, Response } from "express";
import { deleteLog , haveLog, premissionLog } from "../../models/logs.model";

export default async function deleted (req: Request, res: Response) {
    
    if(!req.params.id){
        return res.status(400).json({status: false, message: 'Please provide required field log_id'});
    }

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    

    const have = await haveLog(parseInt(req.params.id));
    if(!have){
        return res.status(404).json({status: false, message: 'Log not found'});
    }

    const premission = await premissionLog(req.session.user_id, parseInt(req.params.id));

    if(!premission){
        return res.status(401).json({status: false, message: 'You are not premission to delete this'});
    }

    const result = await deleteLog(req.session.user_id, parseInt(req.params.id));

    if(!result.status){
        return res.status(500).json(result.message);
    }

    return res.status(200).json(result.message);
}