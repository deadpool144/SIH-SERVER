import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["*","sih-client-mu.vercel.app","http://localhost:3000"],
  credentials: true, // allow cookies
}));


//import routes

import authRoutes from "./routes/auth.routes.js";



//use routes
app.use("/api/auth", authRoutes);





export { app };

