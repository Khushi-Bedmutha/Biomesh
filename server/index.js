import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import healthDataRoutes from './routes/healthData.js';
import transactionRoutes from './routes/transactions.js';
import researchRoutes from './routes/research.js';
import clinicalTrialRoutes from './routes/clinicalTrials.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect('mongodb+srv://dbadmin:admin%402407@cluster0.9xgro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/health-data', healthDataRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/clinical-trials', clinicalTrialRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});