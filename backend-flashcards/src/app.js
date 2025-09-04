const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
// Middleware
app.use(express.json());

// Routes
const cardRoutes = require('./routes/cards');
app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
  res.send('Flashcards Backend API is running 🚀');
});

module.exports = app;