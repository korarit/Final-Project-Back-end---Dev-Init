import express, { Express } from "express";
import session from "express-session";
import dotenv from "dotenv";

// Import routes
import userRouter from "./routes/users";

declare module 'express-session' {
    interface SessionData {
        user_id: number;
    }
}

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware for parsing JSON
app.use(express.json());

// Middleware for session
app.use(session({
    name: 'sessionAuth',
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: (3600000 * 24) * 1, // 24hr
        secure: true // cookie is only accessible over HTTP, requires HTTPS
    }
}));

// Routes
app.use("/users", userRouter);


// run the server
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});