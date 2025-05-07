import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentsRoutes from './src/routes/payments';
import registrationsRoutes from './src/routes/registrations';
import serverless from 'serverless-http';

dotenv.config();

const app = express();
const port = process.env['PORT'] || 3000;

// Middleware
app.use(cors({
  origin: ['https://vilakids-inscricoes.vercel.app', 'http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/payments', paymentsRoutes);
app.use('/api/registrations', registrationsRoutes);

// Export as serverless function
export const handler = serverless(app);
