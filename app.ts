import express, { Express } from "express";
import session from "express-session";
import dotenv from "dotenv";

// Import routes
import userRouter from "./routes/users";
import logsRouter from "./routes/logs";
import todoRouter from "./routes/todos";
import eventRouter from "./routes/events";

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
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false // cookie is only accessible over HTTP, requires HTTPS
    }
}));

// Routes
app.use("/users", userRouter);
app.use("/logs", logsRouter);
app.use("/todos", todoRouter);
app.use("/events", eventRouter);


export default app;