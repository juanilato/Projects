import express from 'express';  // Importing the Express library to create the server
import helmet from 'helmet';    // Importing Helmet for setting secure HTTP headers
import { generateNonce } from './util/utils.js';  // Importing the function to generate a nonce for CSP


const app = express();
const PORT = process.env.PORT || 3000;  // Setting the port, using an environment variable if available

// Apply Helmet to automatically set security headers like XSS protection, frameguards, etc.
// Helmet is a good practice for basic security.
app.use(helmet());

// Middleware to dynamically set CSP headers with a nonce
// This ensures that only scripts and styles with a matching nonce can be executed,
// providing a good layer of security against XSS attacks.
app.use((req, res, next) => {
    const nonce = generateNonce();  // Generating a nonce for each request
    res.locals.nonce = nonce;  // Storing the nonce for use in templating (e.g., in HTML files)

    // Setting Content Security Policy (CSP) header to control what resources can be loaded on the page
    res.setHeader("Content-Security-Policy", 
        `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}';`
    );
    next();  // Moving to the next middleware/route handler
});

// Handling favicon.ico requests by returning a 204 No Content response, which indicates no favicon is provided.
// This prevents the browser from logging a 404 error for a missing favicon.
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Parsing incoming JSON payloads in requests
app.use(express.json());  // A useful middleware to automatically parse JSON bodies in requests

// Serving static files from the 'public' directory
// This is useful if you have assets like stylesheets, images, or JavaScript files
app.use(express.static('public'));





// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Starting the server and listening for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
