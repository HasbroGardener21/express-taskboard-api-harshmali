const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
require('./src/jobs/cleanup');

const adminRoutes = require('./src/routes/adminRoutes');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security HTTP Headers
app.use(helmet());

// Rate Limiting (Max 100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'))
app.use('/api/tasks', require('./src/routes/taskRoutes'))
app.use('/api/admin', adminRoutes);

app.use('/api/upload', require('./src/routes/UploadRoutes.js'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Task Board API running' })
})

// Only connect and listen if we are NOT running tests
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected')
      app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`)
      })
    })
    .catch(err => {
      console.error('MongoDB connection failed:', err.message)
      process.exit(1)
    })
}
const errorHandler = require('./src/middleware/ErrorHandler');
app.use(errorHandler);
module.exports = app;