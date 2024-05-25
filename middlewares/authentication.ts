import e, { Request, Response, NextFunction } from 'express';


async function auth(req : Request, res: Response, next: NextFunction){
    if(req.session.user_id){
        return next();
    }else{
        return res.status(401).json({status: false, message: 'You are not authorized to access this'});
    }
}

export default auth;