import dotenv from 'dotenv';
import mysql, { RowDataPacket } from 'mysql2/promise';

// Load environment variables
dotenv.config();

// Create a connection pool
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT as string),
    connectionLimit: 10
});

export async function addTodo(user_id: number, title: string, description: string, due_date: string, priority: number, status: number, created_at: string) {
    if (!user_id || !title || !description || !due_date || !priority || !status || !created_at) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        await connection.execute('INSERT INTO todos (user_id, title, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [user_id, title, description, due_date, priority, status, created_at]);
        
        return {status: true, message: 'Todo added successfully'};
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error occurred in adding todo'};
    }
}

export async function deleteTodo(user_id: number, todo_id: number) {
    if (!user_id || !todo_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        await connection.execute('DELETE FROM todos WHERE user_id = ? AND todo_id = ?', [user_id, todo_id]);
        
        return {status: true, message: 'Todo deleted successfully'};
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error occurred'};
    }

}

export async function updateTodo(user_id: number, todo_id: number, data: string | number, field: string) {

    if (!user_id || !todo_id || !data || !field) {
        return {status: false, message: 'Please provide all required fields'};
    }

    //allowed fields to update for protection against SQL injection
    const allowedFields = ['title', 'description', 'due_date', 'priority', 'status'];
    if (!allowedFields.includes(field)) {
        return {status: false, message: 'Invalid field'};
    }

    try {
        await connection.execute(`UPDATE todos SET ${field} = ? WHERE user_id = ? AND todo_id = ?`, [field, data, user_id, todo_id]);
        
        return {status: true, message: 'Todo status updated successfully'};
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error occurred'};
    }

}

export async function getAllTodos(user_id: number) {
    if (!user_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT todo_id, title, description, due_date, priority, status, created_at FROM todos WHERE user_id = ?', [user_id]);
        return {status: true, data: rows};
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error occurred'};
    }

}

export async function getTodoById(user_id: number, todo_id: number) {
    if (!user_id || !todo_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT todo_id, title, description, due_date, priority, status, created_at FROM todos WHERE user_id = ? AND todo_id = ? LIMIT 1', [user_id, todo_id]);
        return {status: true, data: rows};
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error occurred'};
    }

}

export async function haveTodo(todo_id: number) {
    if (!todo_id) {
        return false;
    }
    try {
        const [rows] = await connection.execute<RowDataPacket[]>('SELECT todo_id FROM todos WHERE todo_id = ? LIMIT 1', [todo_id]);
        return rows.length > 0;
    } catch (error) {
        console.error(error);

        return false;
    }
}



