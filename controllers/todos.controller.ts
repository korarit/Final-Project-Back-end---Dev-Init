import { Request, Response } from 'express';

import allTodo from '../services/todos/all'
import getTodo from '../services/todos/get'
import AddTodo from '../services/todos/add'
import updateTodo from '../services/todos/update'
import deleteTodo from '../services/todos/deleted'

export async function All(req: Request, res: Response) {
    return await allTodo(req, res);
}

export async function Get(req: Request, res: Response) {
    return await getTodo(req, res);
}

export async function Add(req: Request, res: Response) {
    return await AddTodo(req, res);
}

export async function Update(req: Request, res: Response) {
    return await updateTodo(req, res);
}

export async function Deleted(req: Request, res: Response) {
    return await deleteTodo(req, res);
}