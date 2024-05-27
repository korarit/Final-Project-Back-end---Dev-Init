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

export async function addLog(user_id: number, content: string, date: string, created_at: string) {
    if (!user_id || !content || !date || !created_at) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();
        try{
            await connection.execute('INSERT INTO daily_logs (user_id, content, date, created_at) VALUES (?, ?, ?, ?)', [user_id, content, date, created_at]);
        
            return {status: true, message: 'Log added successfully'};

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

export async function deleteLog(user_id: number, log_id: number) {
    if (!user_id || !log_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();

        try {
            await connection.execute('DELETE FROM daily_logs WHERE user_id = ? AND log_id = ?', [user_id, log_id]);
        
            return {status: true, message: 'Log deleted successfully'};
        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in deleting log'};
        } finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database'};
    }

}

export async function updateContentLog(user_id: number, log_id: number, content: string) {
    if (!user_id || !log_id || !content) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {

        const connection = await pool.getConnection();
        try {
            // update the content of the log
            await connection.execute('UPDATE daily_logs SET content = ? WHERE user_id = ? AND log_id = ?', [content, user_id, log_id]);
        
            return {status: true, message: 'Log updated successfully'};
        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in updating log'};
        } finally {
            // close the connection
            connection.release();
        }

    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database'};
    }
}

export async function getAllLog(user_id: number) {
    if (!user_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        const connection = await pool.getConnection();

        try {
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT log_id, content, date, created_at FROM daily_logs WHERE user_id = ?', [user_id]);
            
            return {status: true, data: rows};
        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in getting all logs'};
        } finally {
            // close the connection
            connection.release();
        }
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database'};
    }
}

export async function haveLog(log_id: number) {
    if (!log_id) {
        return false;
    }
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT log_id FROM daily_logs WHERE log_id = ?', [log_id]);
            if (rows.length > 0) {
                return true;
            } else {
                return false;
            }
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

export async function premissionLog(user_id: number, log_id: number) : Promise<boolean> {
    if (!user_id || !log_id) {
        return false;
    }
    try {
        const connection = await pool.getConnection();

        try {
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT log_id FROM daily_logs WHERE user_id = ? AND log_id = ?', [user_id, log_id]);
            if (rows.length > 0) {
                return true;
            } else {
                return false;
            }
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

export async function getLog(user_id: number, log_id: number) {
    if (!user_id || !log_id) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {

        const connection = await pool.getConnection();
        try {
            // get the log by user_id and log_id
            const [rows] = await connection.execute<RowDataPacket[]>('SELECT log_id, content, date, created_at FROM daily_logs WHERE user_id = ? AND log_id = ?', [user_id, log_id]);
        
            // return the log
            return {status: true, data: rows};
        } catch (error) {
            console.error(error);

            return {status: false, message: 'An error occurred in getting log'};
        } finally {
            // close the connection
            connection.release();
        }

    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error created connecting to database'};
    }
}