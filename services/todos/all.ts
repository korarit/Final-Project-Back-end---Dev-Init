import { Request, Response } from 'express';
import moment from 'moment-timezone';

export default async function All(req: Request, res: Response) {
    return res.status(200).json({message: 'all todos'});
}