import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './src/routes/index.js';

const app = express();
const PORT = process.env.PORT || 4000;

// ─────────────────────────────────────────────
// Security Middleware
// ─────────────────────────────────────────────
app.use(helmet());

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://smart-venue-navigator-597869973826.us-central1.run.app',
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '20kb' })); // Prevent large payload attacks
app.use(express.urlencoded({ extended: false }));

// ─────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────
app.use('/api', routes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏟️  Smart Venue Navigator Backend`);
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🔒 CORS allowed origin: ${process.env.FRONTEND_URL}`);
  console.log(`📡 Firebase Admin SDK initialized\n`);
});
