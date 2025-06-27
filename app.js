import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import errorHandler from './src/middleware/errorHandler.js';
import authRoutes from './src/routes/AuthRoutes/authRoutes.js';
import userRoutes from './src/routes/UserRoutes/userRoutes.js';
import aiRoutes from './src/routes/aiRoutes.js';
import interviewRoutes from './src/routes/interviewRoutes.js';
import courseRoutes from './src/routes/courseRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/course", courseRoutes);

// Error handler
app.use(errorHandler);

export default app;