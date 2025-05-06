import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payments';
import registrationRoutes from './routes/registrations';

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
app.use('/api/payments', paymentRoutes);
app.use('/api/registrations', registrationRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
