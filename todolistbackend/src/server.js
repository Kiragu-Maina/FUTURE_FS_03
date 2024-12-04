const express = require('express');
const bodyParser = require('body-parser');
const todosRoutes = require('./routes/todos');
const cors = require('cors')
const app = express();
const port = 8080;

// Middleware
// CORS configuration options
const corsOptions = {
  origin: '*', // Allow all origins (you can restrict this if needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Middleware
app.use(cors(corsOptions));  // Use CORS middleware with options
app.use(bodyParser.json());
app.use('/api/todos', todosRoutes);

// Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
