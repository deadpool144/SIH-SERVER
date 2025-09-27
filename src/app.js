import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "https://sih-client-mu.vercel.app",
  "http://localhost:3000",
  /\.vercel\.app$/   // regex match for any Vercel subdomain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));



//import routes

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import alumniRoutes from "./routes/alumni.routes.js";
import eventRoutes from "./routes/event.routes.js";
import postRoutes from "./routes/post.routes.js";
import messageRoutes from "./routes/message.routes.js";

//use routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chats", messageRoutes);





export { app };

