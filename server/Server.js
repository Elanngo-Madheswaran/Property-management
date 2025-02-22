require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON requests

// Define Schema and Model
const PropertySchema = new mongoose.Schema({
  name: String,
  address: String,
  phnnumber: Number,
  description: String,
  price: Number,
  img: String
});
const Property = mongoose.model('Property', PropertySchema);

// Routes
app.get('/properties', async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/properties', async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json({ message: 'Property created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving property' });
  }
});

app.put('/properties/:id', async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProperty) return res.status(404).json({ error: 'Property not found' });
    res.json(updatedProperty);
  } catch (err) {
    res.status(500).json({ error: 'Error updating property' });
  }
});

app.delete('/properties/:id', async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting property' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
