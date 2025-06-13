require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.SERVER_MONGODB_URI, {
    //   useNewUrlParser: true, // Deprecated
    //   useUnifiedTopology: true, // Deprecated
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON requests

// ...existing code...
// Property Schema and Model
const PropertySchema = new mongoose.Schema({
  name: String,
  address: String,
  phnnumber: Number,
  description: String,
  price: Number,
  img: String,
});
const Property = mongoose.model('Property', PropertySchema);

// Task Schema and Model
const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});
const Task = mongoose.model('Task', TaskSchema);

// Event Schema and Model
const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  eventDate: { type: Date, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
});
const Event = mongoose.model('Event', EventSchema);

// Monty Hall Stats Schema and Model
const MontyHallStatsSchema = new mongoose.Schema({
    identifier: { type: String, default: 'global_stats', unique: true, required: true },
    switchedWins: { type: Number, default: 0 },
    switchedLosses: { type: Number, default: 0 },
    notSwitchedWins: { type: Number, default: 0 },
    notSwitchedLosses: { type: Number, default: 0 },
    lastUpdatedAt: { type: Date, default: Date.now }
});
const MontyHallStats = mongoose.model('MontyHallStats', MontyHallStatsSchema);


const listRoutes = (app) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push(middleware.route);
    } else if (middleware.name === 'router') {
      // Routes added as router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push(handler.route);
        }
      });
    }
  });
  return routes;
};

app.get('/', (req, res) => {
  const routes = listRoutes(app);
  const formattedRoutes = routes.map((route) => {
    const methods = Object.keys(route.methods).join(', ').toUpperCase();
    return `<li><strong>${methods}:</strong> <a href="${route.path}">${route.path}</a></li>`;
  });

  res.send(`
    <h1>Server is running!</h1>
    <h2>Available Routes:</h2>
    <ul>
      ${formattedRoutes.join('')}
    </ul>
  `);
});
// Routes for Properties
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
  } catch (err)
{
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

// Routes for Tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task' });
  }
});

app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting task' });
  }
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is up and running!' });
});
// Routes for Events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

app.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event' });
  }
});

app.post('/events', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event' });
  }
});

app.put('/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error updating event' });
  }
});

app.delete('/events/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting event' });
  }
});

// --- Monty Hall Stats Routes ---
// GET global Monty Hall stats
app.get('/api/montyhall/stats', async (req, res) => {
    try {
        let stats = await MontyHallStats.findOne({ identifier: 'global_stats' });
        if (!stats) {
            // Create initial stats document if it doesn't exist
            stats = new MontyHallStats({ identifier: 'global_stats' });
            await stats.save();
        }
        res.json(stats);
    } catch (err) {
        console.error('Error fetching Monty Hall stats:', err);
        res.status(500).json({ error: 'Server error fetching stats' });
    }
});

// POST to record a game outcome and update stats
app.post('/api/montyhall/stats/record', async (req, res) => {
    const { strategy, outcome } = req.body; // strategy: 'switched' or 'notSwitched'; outcome: 'win' or 'loss'

    if (!['switched', 'notSwitched'].includes(strategy) || !['win', 'loss'].includes(outcome)) {
        return res.status(400).json({ error: 'Invalid strategy or outcome provided.' });
    }

    let fieldToIncrement;
    if (strategy === 'switched' && outcome === 'win') fieldToIncrement = 'switchedWins';
    else if (strategy === 'switched' && outcome === 'loss') fieldToIncrement = 'switchedLosses';
    else if (strategy === 'notSwitched' && outcome === 'win') fieldToIncrement = 'notSwitchedWins';
    else if (strategy === 'notSwitched' && outcome === 'loss') fieldToIncrement = 'notSwitchedLosses';
    else { 
        // This case should ideally not be reached due to prior validation
        return res.status(400).json({ error: 'Could not determine field to increment.' });
    }
    
    try {
        const updatedStats = await MontyHallStats.findOneAndUpdate(
            { identifier: 'global_stats' },
            { 
                $inc: { [fieldToIncrement]: 1 },
                $set: { lastUpdatedAt: Date.now() }
            },
            { new: true, upsert: true } // upsert: true creates the document if it doesn't exist
        );
        res.json(updatedStats);
    } catch (err) {
        console.error('Error updating Monty Hall stats:', err);
        res.status(500).json({ error: 'Server error updating stats' });
    }
});
// --- End of Monty Hall Stats Routes ---

// Start server and connect to MongoDB
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`);
  });
};

startServer();