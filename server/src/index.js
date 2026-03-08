const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const transportRequestRoutes = require('./routes/transportRequestRoutes');
const storageFacilityRoutes = require('./routes/storageFacilityRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transport-requests', transportRequestRoutes);
app.use('/api/storage', storageFacilityRoutes);
app.use('/api/orders', orderRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
