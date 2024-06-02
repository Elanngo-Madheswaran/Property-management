const express = require('express');
const cors = require('cors');
const connectDB = require('./Database');
const Property = require('./DataModel'); 

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.get('/readfromserver', (req, res) => {
  res.json({ message: 'Hey man from server' });
});

app.post('/writetodatabase', async (req, res) => {
  try {
    const { name, address , phnnumber , description , price} = req.body;
    const newProperty = new Property({ 
      name, 
      address, 
      phnnumber, 
      description, 
      price
    });
    await newProperty.save();
    res.json({ message: 'Data saved successfully ' });
  } catch (error) {
    console.error( error.message);
    res.status(500).send('Server error while saving data ');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});