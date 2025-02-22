const http = require('http');  
const url = require('url');
const mongoose = require('mongoose');
const connectDB = require('./Database.js');

console.log("🟢 Starting server...");

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Define the Property schema and model
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
  console.log(`🔹 Received request: ${req.method} ${req.url}`);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log("ℹ️ Pre-flight request received");
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/properties') {
    console.log("📌 Fetching all properties...");
    try {
      const properties = await Property.find({});
      console.log(`✅ Found ${properties.length} properties`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(properties));
    } catch (err) {
      console.error("❌ Error fetching properties:", err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/property/')) {
    const id = parsedUrl.pathname.split('/')[2];
    console.log(`📌 Fetching property with ID: ${id}`);
    try {
      const property = await Property.findById(id);
      if (!property) {
        console.log(`❌ Property with ID ${id} not found`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Property not found');
      } else {
        console.log(`✅ Property found: ${property.name}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(property));
      }
    } catch (err) {
      console.error("❌ Error fetching property:", err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else if (req.method === 'POST' && parsedUrl.pathname === '/property') {
    console.log("📌 Creating new property...");
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { name, address, phnnumber, description, price } = JSON.parse(body);
        console.log(`📝 New Property: ${name}, Price: ${price}`);
        
        const newProperty = new Property({ name, address, phnnumber, description, price });
        await newProperty.save();

        console.log(`✅ Property "${name}" saved successfully`);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Property created successfully' }));
      } catch (error) {
        console.error("❌ Error saving property:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error while saving data');
      }
    });
  } else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/property/')) {
    const id = parsedUrl.pathname.split('/')[2];
    console.log(`📌 Updating property with ID: ${id}`);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { name, address, phnnumber, description, price } = JSON.parse(body);
        const updatedProperty = await Property.findByIdAndUpdate(
          id,
          { name, address, phnnumber, description, price },
          { new: true }
        );

        if (!updatedProperty) {
          console.log(`❌ Property with ID ${id} not found for update`);
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Property not found');
        } else {
          console.log(`✅ Property "${updatedProperty.name}" updated successfully`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedProperty));
        }
      } catch (error) {
        console.error("❌ Error updating property:", error.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error while updating data');
      }
    });
  } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/property/')) {
    const id = parsedUrl.pathname.split('/')[2];
    console.log(`📌 Deleting property with ID: ${id}`);
    try {
      const property = await Property.findByIdAndDelete(id);
      if (!property) {
        console.log(`❌ Property with ID ${id} not found for deletion`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Property not found');
      } else {
        console.log(`✅ Property "${property.name}" deleted successfully`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Property deleted successfully' }));
      }
    } catch (err) {
      console.error("❌ Error deleting property:", err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Server error');
    }
  } else {
    console.log(`❌ Route not found: ${req.url}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Route not found');
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on PORT: ${PORT}`);
});
