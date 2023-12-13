//Backend Node 
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Enable CORS for all routes
app.use(cors());

app.use(express.static(path.join(__dirname, 'newneo')));

app.use(express.json());

//User Register
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required.' });
    }

    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();

    const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    const [result] = await connection.execute(insertQuery, [username, password, email]);

    connection.release();

    res.status(200).json({ message: 'User added successfully!' });
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login route

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();

    const selectQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const [result] = await connection.execute(selectQuery, [username, password]);

    connection.release();

    if (result.length > 0) {
      res.status(200).json({ message: 'Login successful!' });
    } else {
      res.status(401).json({ error: 'Invalid username or password.' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Serve the default public/index.html created by Create React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
