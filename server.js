const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt'); // For password hashing
const fs = require('fs'); // For file system operations

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // For parsing JSON requests

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock user database with hashed passwords
const users = [
    { username: 'Ethan', password: bcrypt.hashSync('HGpodcast', 10) },
    { username: 'Alex', password: bcrypt.hashSync('HGpodcast', 10) },
    { username: 'Aleksey', password: bcrypt.hashSync('HGpodcast', 10) },
    { username: 'Pavel', password: bcrypt.hashSync('HGpodcast', 10) }
];

// Path to the logbook JSON file
const logbookFilePath = path.join(__dirname, 'data.json');

// Function to load logbook entries from JSON file
function loadLogbookEntries() {
    if (fs.existsSync(logbookFilePath)) {
        try {
            const rawData = fs.readFileSync(logbookFilePath);
            return JSON.parse(rawData);
        } catch (err) {
            console.error("Error loading logbook data:", err);
            return [];
        }
    } else {
        return [];
    }
}

// Function to save logbook entries to the JSON file
function saveLogbookEntries(logbookEntries) {
    try {
        fs.writeFileSync(logbookFilePath, JSON.stringify(logbookEntries, null, 2));
        console.log("Logbook entries saved successfully.");
    } catch (err) {
        console.error("Error saving logbook data:", err);
    }
}

// In-memory logbook entries, initially loaded from the JSON file
let logbookEntries = loadLogbookEntries();

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Fetch all logbook entries
app.get('/api/logbook', (req, res) => {
    res.json(logbookEntries);
});

// Add a logbook entry
app.post('/api/logbook', (req, res) => {
    const newLogEntry = req.body;
    logbookEntries.push(newLogEntry);
    saveLogbookEntries(logbookEntries); // Save to JSON file
    res.status(201).json(logbookEntries);
});

// Fallback route for frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
