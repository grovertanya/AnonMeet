// src/server.ts
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { setupWebSocket } from './websocket';
import meetingRoutes from './routes/meetings';
import { meetings } from './controllers/meetingControllers';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/meetings', meetingRoutes);

// Setup WebSocket
setupWebSocket(server);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Add some test data
const testMeeting = {
  id: '1',  // Use the same ID as in the frontend mock
  title: 'Senior Frontend Developer Interview',
  hostId: 'interviewer-1',
  participants: [],
  createdAt: new Date(),
  isActive: true,
};

// @ts-ignore - Accessing the meetings Map from the controller
meetings.set(testMeeting.id, testMeeting);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`💾 Test meeting created with ID: ${testMeeting.id}`);
});