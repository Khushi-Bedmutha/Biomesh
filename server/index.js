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
import walletRoutes from './routes/wallet.js';

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
app.use('/api/wallet', walletRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// API_KEY=3f8f21787e702705afd4
// API_SECRET=7fecddcc198f02f06596e418cc515f2cdfee03179dbbe3d953d197249593e410
// JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MjFmYzAwMS04YjMxLTQxMzAtOWNhZS03OGM0MzYxMDFiZWUiLCJlbWFpbCI6InNhcnRoYWtwODA3NEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiM2Y4ZjIxNzg3ZTcwMjcwNWFmZDQiLCJzY29wZWRLZXlTZWNyZXQiOiI3ZmVjZGRjYzE5OGYwMmYwNjU5NmU0MThjYzUxNWYyY2RmZWUwMzE3OWRiYmUzZDk1M2QxOTcyNDk1OTNlNDEwIiwiZXhwIjoxNzc0MTI5NzIzfQ.oDqiR5blLy9LPYcbTVn-3pHwmfVh_jDQKdlxz2DteaQ