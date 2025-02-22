const http = require('http');  
const url = require('url');
const mongoose = require('mongoose');
const connectDB = require('./Database.js');

connectDB();

// Define the Student schema and model
const PropertySchema = new mongoose.Schema({
  name: String,
  address: String,
  phnnumber: Number,
  description: String,
  price: Number,
});

const Property = mongoose.model('Property', PropertySchema);

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  console.log(`Received request: ${req.method} ${req.url}`);

  if (req.method === 'GET' && parsedUrl.pathname === '/properties') {
    // Read all students
    try {
      const properties = await Property.find({});
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(properties));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/property/')) {
    // Read a single student by ID
    const id = parsedUrl.pathname.split('/')[2];
    try {
      const property = await Property.findById(id);
      if (!property) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Property not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(property));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else if (req.method === 'POST' && parsedUrl.pathname === '/property') {
    // Create a new student
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { name, address, phnnumber, description, price } = JSON.parse(body);

        const newProperty = new Property({
          name,
          address,
          phnnumber,
          description,
          price,
        });

        await newProperty.save();
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Property created successfully' }));
      } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error while saving data');
      }
    });
  } else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/property/')) {
    // Update a student by ID
    const id = parsedUrl.pathname.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { name, address, phnnumber, description, price} = JSON.parse(body);
        const updatedProperty = await Property.findByIdAndUpdate(id, { name, address,
          phnnumber,
          description,
          price, }, { new: true });

        if (!updatedProperty) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Property not found');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedProperty));
        }
      } catch (error) {
        console.error(error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error while updating data');
      }
    });
  } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/property/')) {
    // Delete a student by ID
    const id = parsedUrl.pathname.split('/')[2];
    try {
      const property = await Property.findByIdAndDelete(id);
      if (!property) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Property not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Property deleted successfully' }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
