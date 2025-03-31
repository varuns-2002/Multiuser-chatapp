import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import {app,server} from "./socket/socket.js"
import messageRoutes from "./routes/messageRoutes.js"

dotenv.config({})

const PORT = process.env.PORT || 5000;



// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json()); 
app.use(cookieParser());
const corsOption={
    origin:`${process.env.FRONTEND_URL}`,
    credentials:true
};
app.use(cors(corsOption)); 
 

server.listen(PORT, ()=>{
    connectDB();
    console.log(`Server listen at port ${PORT}`);
});


// routes
app.use("/api/v1/users",userRoutes); 
app.use("/api/v1/message",messageRoutes);
