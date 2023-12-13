//Backend Node 
const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
//app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// Enable CORS for all routes
//app.use(cors());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'newneo')));

app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// Generate a random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Use the generated key in your express-session configuration
app.use(
  session({
    secret: generateSecretKey(),
    resave: false,
    saveUninitialized: true,
  })
);

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
    const [users] = await connection.execute(selectQuery, [username, password]);

    if (users.length === 1) {
      // Store user information in the session
      req.session.user = {
        id: users[0].user_id,
        username: users[0].username,
        email: users[0].email,
      };

      res.status(200).json({ message: 'Login successful!', user: req.session.user });
    } else {
      res.status(401).json({ error: 'Invalid credentials.' });
    }

    connection.release();
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  const user = req.session.user;

  if (!user || !user.id) {
    return res.status(401).json({ error: 'User not authenticated.' });
  }

  next(); // Continue to the next middleware or route handler
};

// New user-pets insert route
app.post('/api/user-pets', authenticateUser, async (req, res) => {
  try {
    const { pet_name, pet_type } = req.body;

    if (!pet_name || !pet_type) {
      return res.status(400).json({ error: 'Pet name and pet type are required.' });
    }

    const user_id = req.session.user.id;

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

    const insertQuery = 'INSERT INTO user_pets (user_id, pet_name, pet_type) VALUES (?, ?, ?)';
    const [result] = await connection.execute(insertQuery, [user_id, pet_name, pet_type]);

    connection.release();

    res.status(200).json({ message: 'Pet added successfully!' });
  } catch (error) {
    console.error('Error adding pet:', error.message);
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
