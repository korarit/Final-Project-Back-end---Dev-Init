import App from './app';
import dotenv from "dotenv";
 
dotenv.config();

const PORT = process.env.SERVER_PORT || 3001;
App.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});