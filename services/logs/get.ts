import { Request, Response } from "express";
import { getLog , haveLog, premissionLog } from "../../models/logs.model";


export default async function get (req: Request, res: Response) {

    if(!req.session.user_id){
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }

    if(!req.params.id){
        return res.status(400).json({status: false, message: 'Please provide required id'});
    }

    const have = await haveLog(parseInt(req.params.id));
    if(!have){
        return res.status(404).json({status: false, message: 'Log not found'});
    }

    const premission = await premissionLog(req.session.user_id, parseInt(req.params.id));

    if(!premission){
        return res.status(401).json({status: false, message: 'You are not premission to access this'});
    }

    const result = await getLog(req.session.user_id, parseInt(req.params.id));

    if(!result.status){
        return res.status(500).json(result.message);
    }

    if(!result.data){
        return res.status(404).json(result.message);
    }

    const new_list_log = result.data.map((log: any) => {
        return {
            id: log.id,
            content: log.content,
            date: new Date(log.created_at).toLocaleString('th-TH', {timeZone: 'Asia/Bangkok'}),
            created_at: new Date(log.date).toLocaleDateString('th-TH', {timeZone: 'Asia/Bangkok'})
        }
    })

    return res.status(200).json(result.data);
}