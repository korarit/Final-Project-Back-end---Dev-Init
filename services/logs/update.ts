import { Request, Response } from "express";
import { updateContentLog , haveLog, premissionLog } from "../../models/logs.model";

export default async function update (req: Request, res: Response) {
    const data = req.body;

    if(!data.content){
        return res.status(400).json({status: false, message: 'Please provide required field content'});
    }

    if(!req.params.id){
        return res.status(400).json({status: false, message: 'Please provide required id'});
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

    const result = await updateContentLog(req.session.user_id, parseInt(req.params.id), data.content);

    if(!result.status){
        return res.status(500).json(result.message);
    }

    return res.status(200).json(result.message);
}