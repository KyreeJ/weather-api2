import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3002;

// Serve static files from the "dist" directory
app.use(express.static('../client/dist'));// Adjust to 'public' or another folder if necessary

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect the routes
app.use(routes);

// Start the server on the specified port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
