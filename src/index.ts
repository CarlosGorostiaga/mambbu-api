import express from 'express';
import cors from 'cors';
import propertyRoutes from './routes/properties.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mambbu API running' });
});

// Home
app.get('/', (req, res) => {
  res.json({ 
    message: 'Mambbu API v1.0',
    endpoints: {
      health: '/health',
      properties: '/api/properties'
    }
  });
});

// Routes
app.use('/api/properties', propertyRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});