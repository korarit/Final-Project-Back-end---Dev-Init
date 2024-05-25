import { Request, Response } from 'express';

export async function addLog(req: Request, res: Response) {
    return res.status(200).json({status: true, message: 'Add logs'});
}

export async function updateLogById(req: Request, res: Response) {
    return res.status(200).json({status: true, message: 'Update log by id'});
}

export async function deleteLogById(req: Request, res: Response) {
    return res.status(200).json({status: true, message: 'Delete log by id'});
}

export async function getLogById(req: Request, res: Response) {
    return res.status(200).json({status: true, message: 'Get log by id'});
}

export async function getAllLog(req: Request, res: Response) {
    return res.status(200).json({status: true, message: 'Get all logs'});
}

