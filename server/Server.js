const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.SERVER_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Task Schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

// Task Model
const Task = mongoose.model('Task', taskSchema);

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is up and running!' });
});

// API Routes

// Fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
app.post('task', async (req, res) => {
  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task' });
  }
});

// Update a task
app.put('task/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

// Delete a task
app.delete('/api/task/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task' });
  }
});

// Start server and connect to MongoDB
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Export the app for Vercel
module.exports = (req, res) => {
  startServer();
  app(req, res);
};

// Start server locally if needed
if (process.env.NODE_ENV !== 'production') {
  startServer();
}
