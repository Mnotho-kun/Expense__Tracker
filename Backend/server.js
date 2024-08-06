const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Create a connection to the database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bankai02#',
    database: 'expense_database'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Middleware to serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


// Route to serve the register.html page
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register.html'));
});

// Route to handle the form submission from register.html
app.post('/register.html', async (req, res) => {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password || !phone) {
        return res.status(400).send('Missing required fields.');
    }

    // Hash the password
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into the database
        const query = 'INSERT INTO users (username, email, password, phone) VALUES (?, ?, ?, ?)';
        db.query(query, [username, email, hashedPassword, phone], (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).send('Server error');
                return;
            }
            res.redirect('/expense-tracker.html');
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Server error');
    }
});

// Route to serve the login.html page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Route to handle the form submission from login.html
app.post('/login.html', (req, res) => {
    const { email, password } = req.body;

    // Authenticate user
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error querying data:', err);
            res.status(500).send('Server error');
            return;
        }
        if (results.length > 0) {
            const user = results[0];
            // Compare hashed password
            try {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    res.redirect('/expense-tracker.html'); // Redirect to the expense tracker page
                } else {
                    res.status(401).send('Invalid email or password');
                }
            } catch (error) {
                console.error('Error comparing passwords:', error);
                res.status(500).send('Server error');
            }
        } else {
            res.status(401).send('Invalid email or password');
        }
    });
});

// Route to serve the expense-tracker.html page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'expense-tracker.html'));
});

// Route to handle saving expense entries
app.post('/save-entry', (req, res) => {
    let { amount, description } = req.body;

    if (!description || !amount) {
        return res.status(400).send('Missing required fields.');
    }

    // Convert amount to a number and validate it
    amount = parseFloat(amount);
    if (isNaN(amount)) {
        return res.status(400).send('Invalid amount.');
    }

    // Insert expense entry into the database
    const query = 'INSERT INTO expenses (description, amount) VALUES (?, ?)';
    db.query(query, [description, amount], (err, results) => {
        if (err) {
            console.error('Error inserting expense entry:', err);
            res.status(500).send('Server error');
            return;
        }
        res.status(200).send('Entry saved');
    });
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
