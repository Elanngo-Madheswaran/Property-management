const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const Student = require('./DataModel'); 

const app = express();
connectDB();

app.use(express.json());
app.use(cors());

app.get('/readfromserver', (req, res) => {
  res.json({ message: 'Hey man from server' });
});

app.post('/writetodatabase', async (req, res) => {
  try {
    const { name, class: studentClass, rollNo, yearOfStudying, mobileNo, emailId } = req.body;
    const newStudent = new Student({ 
      name, 
      class: studentClass, 
      rollNo, 
      yearOfStudying, 
      mobileNo, 
      emailId 
    });
    await newStudent.save();
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