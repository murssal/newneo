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

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  const user = req.session.user;

  if (!user || !user.id) {
    return res.status(401).json({ error: 'User not authenticated.' });
  }

  next(); // Continue to the next middleware or route handler
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

const secretKey = generateSecretKey(); // Generate once
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Use 'true' in production with HTTPS
      maxAge: 86400000, // Session duration in milliseconds (e.g., 1 day)
    },
  })
);



// Add debugging middleware
app.use((req, res, next) => {
  console.log('Session data:', req.session);
  next();
});



//User Register
app.post('/api/users', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required.' });
    }

  

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



app.get('/api/user-pets', authenticateUser, async (req, res) => {
  try {
    const user_id = req.session.user.id;

    const connection = await pool.getConnection();

    const selectQuery = 'SELECT pet_id, pet_name, pet_type, health, happiness, image_data FROM user_pets WHERE user_id = ?';
    const [pets] = await connection.execute(selectQuery, [user_id]);

    connection.release();

    console.log('User Pets:', pets); // Log the pets to the console

    res.status(200).json({ pets });
  } catch (error) {
    console.error('Error fetching user pets:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// get user-pets route
app.get('/api/get-user-pets', authenticateUser, async (req, res) => {
  try {
    const { username } = req.body;

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

    const selectQuery = 'select user_pets (user_id, pet_name, pet_type, image_data) where username = ?';
    const [pets] = await connection.execute(selectQuery, [username]);

    connection.release();

    res.status(200).json({ message: 'Pets retrieved successfully!' });
    return pets
  } catch (error) {
    console.error('Error finding pets:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// route to fetch items
app.get('/api/items', authenticateUser, async (req, res) => {
  console.log('/api/items - Session:', req.session);
  try {

    const user_id = req.session.user.id;

  

    const connection = await pool.getConnection();

    const selectQuery = 'SELECT item_id, item_name, item_photo, price FROM items';
    const [items] = await connection.execute(selectQuery);

    connection.release();

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/buy-item', authenticateUser, async (req, res) => {
  console.log('/api/buy-item - Session:', req.session);
  
  try {
   

    const { itemId } = req.body;
    console.log('Item ID from request:', itemId);
    const user_id = req.session.user.id;
    console.log('print user id in queryTest for debugging', user_id);

    if (!user_id || !itemId) {
      return res.status(400).json({ error: 'User ID and item ID are required.' });
    }

    const connection = await pool.getConnection();

    try {
      // Start a transaction
      await connection.beginTransaction();
      console.log('transaction started...waiting on query...');
      // Check the user's neopoints
      const [userResult] = await connection.execute('SELECT neopoints FROM users WHERE user_id = ?', [user_id]);
      console.log('print user neopoints in queryTest for debugging', userResult);

      if (!userResult || userResult.length === 0) {
        // User not found
        return res.status(404).json({ error: 'User not found.' });
      }

      const userNeopoints = userResult[0].neopoints;
      // Example getItemPrice implementation
async function getItemPrice(connection, itemId) {
  try {
      const [result] = await connection.execute('SELECT price FROM items WHERE item_id = ?', [itemId]);

      if (!result || result.length === 0) {
          // Item not found
          console.error('Item not found for itemId:', itemId);
          return null;
      }

      const itemPrice = result[0].price;
      console.log('Item price retrieved for itemId:', itemId, '-', itemPrice);
      return itemPrice;
  } catch (error) {
      console.error('Error getting item price:', error.message);
      throw error; // You may choose to handle or propagate the error based on your needs
  }
}


      // Get the item price
      const itemPrice = await getItemPrice(connection, itemId);

      if (itemPrice === null) {
        // Item not found
        return res.status(404).json({ error: 'Item not found.' });
      }

      // Check if the user has enough neopoints to buy the item
      if (userNeopoints >= itemPrice) {
        // Deduct the neopoints from the user
        const remainingNeopoints = userNeopoints - itemPrice;
        await connection.execute('UPDATE users SET neopoints = ? WHERE user_id = ?', [remainingNeopoints, user_id]);

        // Add the item to the user's pocket
        await connection.execute('INSERT INTO user_pocket (user_id, item_id, quantity) VALUES (?, ?, 1)', [user_id, itemId]);

        // Commit the transaction
        await connection.commit();

        res.status(200).json({ message: 'Item purchased successfully!' });
      } else {
        res.status(403).json({ error: 'Insufficient neopoints to buy the item.' });
      }

    } catch (error) {
      // If an error occurs, rollback the transaction
      await connection.rollback();
      console.error('Error buying item:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      // Always release the connection back to the pool, whether there was an error or not
      connection.release();
    }
  } catch (error) {
    console.error('Error buying item:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// User logout route
app.post('/api/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Logout successful!' });
    }
  });
});

// Serve the default public/index.html created by Create React App
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
