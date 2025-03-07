const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'https://organization-sandeeps-projects-22864139.vercel.app/', 'https://organization-2ygqwdo5q-sandeeps-projects-22864139.vercel.app/','https://organization-blond-two.vercel.app/'], // Allow requests from frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());


  
// MongoDB Connection
mongoose.connect(process.env.MONGOURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Database connection error:", err));

// Routes
app.use('/api/employees', employeeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
