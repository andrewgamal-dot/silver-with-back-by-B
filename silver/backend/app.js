require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const i18n = require('./config/i18n'); // Import i18n

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// i18n middleware
app.use(i18n.init);

// Define Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send(req.__('auth_service_running'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 