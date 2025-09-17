import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://sih-client-mu.vercel.app",
  "http://localhost:3000"
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true); 
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));


//import routes

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";



//use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);





export { app };

