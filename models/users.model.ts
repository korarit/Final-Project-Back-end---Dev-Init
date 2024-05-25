import dotenv from 'dotenv';
import e from 'express';
import mysql from 'mysql2/promise';

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

interface registerResponse {
    status: boolean;
    message: string;
}
/*
    The register function will take in the username, email, password, and created date of the user and insert 
    it into the users table in the database. It will return true if the insertion is successful, and false if there is an error.

    @param username: string - The username of the user
    @param email: string - The email of the user
    @param password: string - The password of the user
    @param created: string - The created date of the user
    @returns registerResponse - An object containing the status of the registration and a message (status: boolean, message: string)
*/
async function registerDB (username: string, email: string, password: string, created: string) : Promise<registerResponse> {
    if (!username || !email || !password || !created) {
        return {status: false, message: 'Please provide all required fields'};
    }
    try {
        await connection.execute('INSERT INTO users (username, email, password, created) VALUES (?, ?, ?, ?)', [username, email, password, created]);
        
        return {status: true, message: 'User registered successfully'};
    } catch (error) {
        console.error(error);

        return {status: false, message: 'An error occurred'};
    } finally {
        connection.end();
    }
}

interface loginResponse {
    status: boolean;
    user_id?: number | null;
    password?: string | null;
}

/*
    The login function will take in the email or username of the user and check if it exists in the users table in the database. 
    It will return true if the user exists, and false if the user does not exist.

    @param email: string - The email of the user
    @param username: string - The username of the user
    @returns loginResponse - An object containing the status of the login and the user_id of the user (status: boolean, user_id: number | null)
*/
async function loginDB (login_data: string, type: string) : Promise<loginResponse> {
    try {
        if (type === 'email') {
            const [rows] = await connection.query('SELECT user_id , password FROM users WHERE email = ? LIMIT 1', [login_data]);

            // Check if the user exists
            if (rows) {
                return {status: true, user_id: rows[0].user_id, password: rows[0].password};
            } else {
                return {status: false};
            }

        } else if (type === 'username') {
            const [rows] = await connection.query('SELECT user_id , password FROM users WHERE username = ? LIMIT 1', [login_data]);

            // Check if the user exists
            if (rows) {
                return {status: true, user_id: rows[0].user_id, password: rows[0].password};
            } else {
                return {status: false};
            }

        } else {
            return {status: false};
        }
    } catch (error) {
        console.error(error);

        return {status: false};
    } finally {
        connection.end();
    }
}

async function haveUser(username:string, email: string) : Promise<boolean>{
    try {
        const [rows] = await connection.execute('SELECT user_id FROM users WHERE email = ? OR username = ? LIMIT 1', [email, username]);

        // Check if the user exists
        if (Array.isArray(rows) && rows.length > 0){
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error(error);

        return false;
    } finally {
        connection.end();
    }
}

export { registerDB, loginDB, haveUser }