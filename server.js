// server.js - TrekGear Hub
const express = require('express');

const trekkersRouter = require('./routes/trekkers');
const tentsRouter = require('./routes/tents');
const joinRouter = require('./routes/join');
const rentalsRouter = require('./routes/rentals');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TrekGear Hub API is running' });
});

app.use('/trekkers', trekkersRouter);
app.use('/tents', tentsRouter);

// join has to be before rentals, otherwise /rentals/details
// gets treated like /rentals/:id
app.use('/rentals', joinRouter);
app.use('/rentals', rentalsRouter);

// anything else = 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// error handler
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
