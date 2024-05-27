import { Request, Response } from 'express';

import Add from '../services/events/add'
import Update from '../services/events/update'
import Delete from '../services/events/deleted'
import GetEvent from '../services/events/get';
import All from '../services/events/all';

export async function addEvent(req: Request, res: Response) {
    return await Add(req, res);
}

export async function updateEventById(req: Request, res: Response) {
    return await Update(req, res);
}

export async function deletedEventById(req: Request, res: Response) {
    return await Delete(req, res);
}

export async function getEventById(req: Request, res: Response) {
    return await GetEvent(req, res);
}

export async function getEventAll(req: Request, res: Response) {
    return await All(req, res);
}