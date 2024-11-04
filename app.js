const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serving static files from 'public' folder

// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB connection (simplified without deprecated options)
mongoose.connect('mongodb://localhost:27017/kiitEcell')
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('MongoDB connection error:', error));
// Define Mongoose schema and model for registrations
const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true },
    techDomain: { type: String, required: true },
    interest: { type: String, required: true },
    projectLink: { type: String }
});

// Define an array of daily thoughts or fetch from a database
const dailyThoughts = [
    "Innovation distinguishes between a leader and a follower.",
    "The best way to predict the future is to create it.",
    "Don't watch the clock; do what it does. Keep going.",
    "Your limitation—it's only your imagination."
];

// Daily Thought API route
app.get('/api/daily-thought', (req, res) => {
    const randomIndex = Math.floor(Math.random() * dailyThoughts.length);
    const thought = dailyThoughts[randomIndex];
    res.json({ thought });
});


const Registration = mongoose.model('Registration', registrationSchema);

// Routes
// Home page route
app.get('/', (req, res) => {
    res.render('index'); // Render index.ejs for the homepage
});

// Display registration form
app.get('/register', (req, res) => {
    res.render('register'); // Render register.ejs for the registration form
});

// Handle form submission
app.post('/register', async (req, res) => {
    const { name, roll, techDomain, interest, projectLink } = req.body;

    // Save registration to the database
    const newRegistration = new Registration({ name, roll, techDomain, interest, projectLink });
    try {
        await newRegistration.save();
        // After successful registration, redirect to home with a message
        res.render('index', { message: 'Thank you for registering!' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering.'); // Handle errors appropriately
    }
});


//for login 

// Add this to your routes in app.js
// Display login form
app.get('/login', (req, res) => {
    res.render('login'); // Render login.ejs for the login page
});

// Handle login submission
app.post('/login', async (req, res) => {
    const { roll } = req.body;

    // Replace this with actual logic to fetch user data from the database
    const userData = await Registration.findOne({ roll: roll });

    if (userData) {
        // Ensure tasks and upcomingMeetings are arrays to prevent errors
        const tasks = userData.tasks || [];
        const upcomingMeetings = userData.upcomingMeetings || [];

        res.render('dashboard', {
            techDomain: userData.techDomain,
            tasks: tasks,
            upcomingMeetings: upcomingMeetings
        });
    } else {
        res.render('login', { message: 'Roll number not found!' });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
