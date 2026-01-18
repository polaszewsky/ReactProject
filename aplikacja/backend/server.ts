import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import pool from './config/database'; // Using default import now
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
import carsRoutes from './routes/cars';
import reservationsRoutes from './routes/reservations';
import authRoutes from './routes/auth';
import externalRoutes from './routes/external';

app.use('/api/cars', carsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/external', externalRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: pool ? 'connected' : 'disconnected'
    });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Car Rental API',
        version: '1.0.0',
        endpoints: {
            cars: '/api/cars',
            reservations: '/api/reservations',
            auth: '/api/auth',
            external: '/api/external',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚗 Car Rental API server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
