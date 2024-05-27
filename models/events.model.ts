import dotenv from 'dotenv';
import mysql, { Pool , RowDataPacket } from 'mysql2/promise';

// Load environment variables
dotenv.config();

// database pool connection configuration
const pool : Pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT as string),
    connectionLimit: 20
});



export async function addEvent(user_id: number, title: string, description: string, start_date: string, end_date: string, created_at: string) {
    if (!user_id || !title || !description || !start_date || !end_date || !created_at) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();
        try{
            await connection.execute('INSERT INTO celendar_events (user_id, title, description, start_date, end_date, created_at) VALUES (?, ?, ?, ?, ?, ?)', 
            [user_id, title, description, start_date, end_date, created_at]);
        
            return {status: true, message: 'celendar event added successfully'};

        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in adding log'}; 
        }finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database '};
    }
}





export async function deleteEvent(user_id: number, event_id: number) {
    if (!user_id || !event_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();

        try {
            await connection.execute('DELETE FROM celendar_events WHERE user_id = ? AND event_id = ?', [user_id, event_id]);
        
            return {status: true, message: 'celendar event deleted successfully'};
        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in deleting log'};
        } finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database '};
    }
}




export async function updateEvent(user_id: number, event_id: number, data: string, field: string) {
    if (!user_id || !event_id || !data || !field) {
        return {status: false, message: 'Please provide all required fields'};
    }

    //check if field is valid for protection sql injection
    const validField = ['title', 'description', 'start_date', 'end_date'];
    if(!validField.includes(field)){
        return {status: false, message: 'Please provide a valid field (title, description, start_date, end_date)'};
    }
    
    try {
        const connection = await pool.getConnection();
        try {
            await connection.execute(`UPDATE celendar_events SET ${field} = ? WHERE user_id = ? AND event_id = ?`, [data, user_id, event_id]);
        
            return {status: true, message: 'celendar event updated successfully'};
        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in updating log'};
        } finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database '};
    }

}

export async function permissionToEdit(user_id: number, event_id: number) {
    if (!user_id || !event_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT event_id FROM celendar_events WHERE user_id = ? AND event_id = ? LIMIT 1', [user_id, event_id]);
        
            if(rows.length === 0){
                return false;
            }

            return true;
        } catch (error) {
            console.error(error);

            return false;
        } finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return false;
    }
}

export async function haveEvent(event_id: number) {
    if (!event_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT event_id FROM celendar_events WHERE event_id = ? LIMIT 1', [event_id]);
        
            if(rows.length === 0){
                return false;
            }

            return true;
        } catch (error) {
            console.error(error);

            return false;
        } finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return false;
    }

}

export async function getEventById(user_id: number, event_id: number) {
    if (!user_id || !event_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();
        try{
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT event_id, title, description, start_date, end_date, created_at FROM celendar_events WHERE user_id = ? AND event_id = ?', [user_id, event_id]);
        
            return {status: true, data: rows};

        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in getting event'}; 
        }finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database '};
    }
}

export async function getAllEvent(user_id: number) {
    if (!user_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();
        try{
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT event_id, title, description, start_date, end_date, created_at FROM celendar_events WHERE user_id = ?', [user_id]);
        
            return {status: true, data: rows};

        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in getting all event'}; 
        }finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database '};
    }
}