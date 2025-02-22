const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./Database.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Automatically handles CORS
app.use(express.json()); // Parse JSON requests

// Define the Property schema and model
const PropertySchema = new mongoose.Schema({
  name: String,
  address: String,
  phnnumber: Number,
  description: String,
  price: Number,
});
const Property = mongoose.model('Property', PropertySchema);

// Routes
app.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

app.post('/property', async (req, res) => {
  try {
    const { name, address, phnnumber, description, price } = req.body;
    const newProperty = new Property({ name, address, phnnumber, description, price });
    await newProperty.save();
    res.status(201).json({ message: 'Property created successfully' });
  } catch (error) {
    res.status(500).send('Server error while saving data');
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
