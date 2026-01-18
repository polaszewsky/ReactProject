"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database")); // Using default import now
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Routes
const cars_1 = __importDefault(require("./routes/cars"));
const reservations_1 = __importDefault(require("./routes/reservations"));
const auth_1 = __importDefault(require("./routes/auth"));
const external_1 = __importDefault(require("./routes/external"));
app.use('/api/cars', cars_1.default);
app.use('/api/reservations', reservations_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/external', external_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: database_1.default ? 'connected' : 'disconnected'
    });
});
// Root endpoint
app.get('/', (req, res) => {
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
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not found' });
});
// Error handler
app.use((err, req, res, next) => {
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
//# sourceMappingURL=server.js.map