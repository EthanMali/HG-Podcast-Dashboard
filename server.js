const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing JSON requests

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Hardcoded login credentials
const users = [
    { username: 'Ethan', password: 'HGpodcast' },
    { username: 'Alex', password: 'HGpodcast' },
    { username: 'Aleksey', password: 'HGpodcast' },
    { username: 'Pavel', password: 'HGpodcast' }
];

// In-memory logbook entries
const logbookEntries = [

];

// Handle the login request
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the username and password are correct
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.status(200).send('Login successful');
    } else {
        res.status(401).send('Invalid username or password');
    }
});

// Middleware to parse JSON data
app.use(express.json());

// Endpoint to fetch all logbook entries
app.get('/api/logbook', (req, res) => {
    res.json(logbookEntries);  // Send the logbook entries as a JSON response
});

// Endpoint to add a logbook entry
app.post('/api/logbook', (req, res) => {
    const newLogEntry = req.body;
    logbookEntries.push(newLogEntry);  // Add the new log entry to the array
    res.status(201).json(logbookEntries);  // Return all log entries after adding
});

// Serve static files for the frontend (if needed)
app.use(express.static('public'));



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
