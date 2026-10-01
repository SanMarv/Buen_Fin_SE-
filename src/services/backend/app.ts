import express from "express";
import userRouter from "./routes/users.routes.ts";
process.loadEnvFile(); 

const app = express();
const port = process.env.BACKEND_PORT; 

app.listen(port, () : void => console.log(` App listening on port ${port}...`)); 

app.use('auth/', userRouter); 
