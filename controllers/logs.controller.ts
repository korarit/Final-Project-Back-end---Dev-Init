import { Request, Response } from 'express';

import addLog from '../services/logs/add';
import updateLog from '../services/logs/update';
import deleteLog from '../services/logs/delete';
import getLog from '../services/logs/get';
import getAllLogs from '../services/logs/all';


export async function add(req: Request, res: Response) {
    return await addLog(req, res);
}

export async function updateLogById(req: Request, res: Response) {
    return await updateLog(req, res);
}

export async function deleteLogById(req: Request, res: Response) {
    return await deleteLog(req, res);
}

export async function getLogById(req: Request, res: Response) {
    return await getLog(req, res);
}

export async function getAllLog(req: Request, res: Response) {
    return await getAllLogs(req, res);
}

