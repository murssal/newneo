//Backend Node
const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const MySQLStore = require("express-mysql-session")(session);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: ["https://newneo.vercel.app", "http://localhost:3000"],
  credentials: true,
};

//db connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  const user = req.session.user;

  if (!user || !user.id) {
    return res.status(401).json({ error: "User not authenticated." });
  }

  next();
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static(path.join(__dirname, "newneo")));

// use cookie-parser middleware
app.use(cookieParser());

const sessionStore = new MySQLStore(
  {
    checkExpirationInterval: 900000, // Check for expired sessions every 15 minutes
    expiration: 86400000, // Sessions expire after 24 hours
    connectionLimit: 10, // Allow up to 10 concurrent database connections
    endConnectionOnClose: false, // Keep the MySQL connection open when the store is closed
  },
  pool
);

// generate a random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

const secretKey = generateSecretKey(); // generate only once
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      secure: true, // Use 'true' in production with HTTPS
      sameSite: "None",
      maxAge: 86400000, // session duration in milliseconds (1 day)
    },
  })
);

// debugging, make sure user session is working
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});

//Register
app.post("/api/users", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ error: "Username, password, and email are required." });
    }

    const connection = await pool.getConnection();

    const insertQuery =
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
    const [result] = await connection.execute(insertQuery, [
      username,
      password,
      email,
    ]);

    connection.release();

    res.status(200).json({ message: "User added successfully!" });
  } catch (error) {
    console.error("Error adding user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User login route
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    const connection = await pool.getConnection();

    const selectQuery =
      "SELECT * FROM users WHERE username = ? AND password = ?";
    const [users] = await connection.execute(selectQuery, [username, password]);

    if (users.length === 1) {
      // Store user information in the session
      req.session.user = {
        id: users[0].user_id,
        username: users[0].username,
        email: users[0].email,
      };

      res
        .status(200)
        .json({ message: "Login successful!", user: req.session.user });
    } else {
      res.status(401).json({ error: "Invalid credentials." });
    }

    connection.release();
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New user-pets insert route
app.post("/api/user-pets", authenticateUser, async (req, res) => {
  try {
    const { pet_name, pet_type, image_data } = req.body;

    if (!pet_name || !pet_type) {
      return res
        .status(400)
        .json({ error: "Pet name and pet type are required." });
    }

    const user_id = req.session.user.id;

    const connection = await pool.getConnection();

    const insertQuery =
      "INSERT INTO user_pets (user_id, pet_name, pet_type, image_data) VALUES (?, ?, ?, ?)";
    const [result] = await connection.execute(insertQuery, [
      user_id,
      pet_name,
      pet_type,
      image_data,
    ]);

    connection.release();

    res.status(200).json({ message: "Pet added successfully!" });
  } catch (error) {
    console.error("Error adding pet:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// route to fetch items for page display
app.get("/api/items", authenticateUser, async (req, res) => {
  console.log("/api/items - Session:", req.session);
  try {
    const user_id = req.session.user.id;

    const connection = await pool.getConnection();

    const selectQuery =
      "SELECT item_id, item_name, item_photo, price FROM items";
    const [items] = await connection.execute(selectQuery);

    connection.release();

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Rock, Paper, Scissors game route
app.post("/api/playRockPaperScissors", authenticateUser, async (req, res) => {
  console.log("/playRockPaperScissors - Session:", req.session);
  const connection = await pool.getConnection();
  const user_id = req.session.user.id;
  const userChoice = req.body.userChoice;

  if (!userChoice || !["rock", "paper", "scissors"].includes(userChoice)) {
    return res.status(400).json({ error: "Invalid user choice." });
  }

  // Generate a random choice for the computer
  const computerChoices = ["rock", "paper", "scissors"];
  const computerChoice =
    computerChoices[Math.floor(Math.random() * computerChoices.length)];

  // Determine the winner
  let result;
  if (userChoice === computerChoice) {
    result = "It's a tie! Try again!";
  } else if (
    (userChoice === "rock" && computerChoice === "scissors") ||
    (userChoice === "paper" && computerChoice === "rock") ||
    (userChoice === "scissors" && computerChoice === "paper")
  ) {
    // Check the user's neopoints
    const [userResult] = await connection.execute(
      "SELECT neopoints FROM users WHERE user_id = ?",
      [user_id]
    );
    console.log(
      "print user neopoints in queryTest for debugging mini game",
      userResult
    );

    if (!userResult || userResult.length === 0) {
      // User not found
      return res.status(404).json({ error: "User not found." });
    }

    const userNeopoints = userResult[0].neopoints;
    const updatedNeopoints = userNeopoints + 100;
    await pool.execute("UPDATE users SET neopoints = ? WHERE user_id = ?", [
      updatedNeopoints,
      user_id,
    ]);
    result = "You have been awarded 100 neopoints!";
  } else {
    result = "Sorry, you lose. Try again!";
  }

  res.json({ result, computerChoice, win: result.includes("win") });
});

app.post("/api/buy-item", authenticateUser, async (req, res) => {
  console.log("/api/buy-item - Session:", req.session);

  try {
    const { itemId } = req.body;
    console.log("Item ID from request:", itemId);
    const user_id = req.session.user.id;
    console.log("print user id in queryTest for debugging", user_id);

    if (!user_id || !itemId) {
      return res
        .status(400)
        .json({ error: "User ID and item ID are required." });
    }

    const connection = await pool.getConnection();

    try {
      // Start a transaction
      await connection.beginTransaction();
      console.log("transaction started...waiting on query...");
      // Check the user's neopoints
      const [userResult] = await connection.execute(
        "SELECT neopoints FROM users WHERE user_id = ?",
        [user_id]
      );
      console.log(
        "print user neopoints in queryTest for debugging",
        userResult
      );

      if (!userResult || userResult.length === 0) {
        // User not found
        return res.status(404).json({ error: "User not found." });
      }

      const userNeopoints = userResult[0].neopoints;
      // Example getItemPrice implementation
      async function getItemPrice(connection, itemId) {
        try {
          const [result] = await connection.execute(
            "SELECT price FROM items WHERE item_id = ?",
            [itemId]
          );

          if (!result || result.length === 0) {
            // Item not found
            console.error("Item not found for itemId:", itemId);
            return null;
          }

          const itemPrice = result[0].price;
          console.log(
            "Item price retrieved for itemId:",
            itemId,
            "-",
            itemPrice
          );
          return itemPrice;
        } catch (error) {
          console.error("Error getting item price:", error.message);
          throw error; // You may choose to handle or propagate the error based on your needs
        }
      }

      // Get the item price
      const itemPrice = await getItemPrice(connection, itemId);

      if (itemPrice === null) {
        // Item not found
        return res.status(404).json({ error: "Item not found." });
      }

      // Check if the user has enough neopoints to buy the item
      if (userNeopoints >= itemPrice) {
        // Deduct the neopoints from the user
        const remainingNeopoints = userNeopoints - itemPrice;
        await connection.execute(
          "UPDATE users SET neopoints = ? WHERE user_id = ?",
          [remainingNeopoints, user_id]
        );

        // Add the item to the user's pocket
        await connection.execute(
          "INSERT INTO user_pocket (user_id, item_id, quantity) VALUES (?, ?, 1)",
          [user_id, itemId]
        );

        // Commit the transaction
        await connection.commit();

        res.status(200).json({ message: "Item purchased successfully!" });
      } else {
        res
          .status(403)
          .json({ error: "Insufficient neopoints to buy the item." });
      }
    } catch (error) {
      // If an error occurs, rollback the transaction
      await connection.rollback();
      console.error("Error buying item:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      // Always release the connection back to the pool, whether there was an error or not
      connection.release();
    }
  } catch (error) {
    console.error("Error buying item:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/user-pets", authenticateUser, async (req, res) => {
  try {
    const user_id = req.session.user.id;

    const connection = await pool.getConnection();

    const selectQuery =
      "SELECT pet_id, pet_name, pet_type, health, happiness, image_data FROM user_pets WHERE user_id = ?";
    const [pets] = await connection.execute(selectQuery, [user_id]);

    connection.release();

    console.log("User Pets:", pets); // Log the pets to the console

    res.status(200).json({ pets });
  } catch (error) {
    console.error("Error fetching user pets:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// New route for updating pet hunger
app.post("/api/update-pet-hunger", authenticateUser, async (req, res) => {
  try {
    const user_id = req.session.user.id;
    const petId = req.body.petId; // Extract petId from the request body

    const connection = await pool.getConnection();

    // Fetch current health for the specific pet from the database
    const [pet] = await connection.execute(
      "SELECT health FROM user_pets WHERE user_id = ? AND pet_id = ?",
      [user_id, petId]
    );

    if (!pet || pet.length === 0) {
      return res.status(404).json({ error: "Pet not found." });
    }

    const currentHealth = pet[0].health;
    console.log(currentHealth);

    // Calculate the new health (assuming it's being increased by 10)
    const newHealth = Math.min(currentHealth + 10, 100);
    console.log(newHealth);

    // Update health only if the new health is 10 higher than the current value
    if (newHealth > currentHealth) {
      await connection.execute(
        "UPDATE user_pets SET health = ? WHERE user_id = ? AND pet_id = ?",
        [newHealth, user_id, petId]
      );

      res.status(200).json({ message: "Pet hunger updated successfully." });
    } else {
      res.status(200).json({ message: "Pet hunger is already at maximum." });
    }

    connection.release();
  } catch (error) {
    console.error("Error updating pet hunger:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get user-pets route
app.get("/api/user-pets", authenticateUser, async (req, res) => {
  try {
    const user_id = req.session.user.id;

    const connection = await pool.getConnection();

    const selectQuery =
      "SELECT pet_name, pet_type, image_data FROM user_pets WHERE user_id = ?";
    const [pets] = await connection.execute(selectQuery, [user_id]);

    connection.release();

    res.status(200).json({ pets });
  } catch (error) {
    console.error("Error finding pets:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//account page user info - displays username and neopoints
app.get("/api/account-user-info", authenticateUser, async (req, res) => {
  try {
    console.log("/api/account-user-info - Session:", req.session); //printing in console for debugging
    const userId = req.session.user.id;
    const connection = await pool.getConnection();
    console.log(userId); //printing in console for debugging
    // Fetch user information (username and neopoints) from the users table
    const [userInfo] = await connection.execute(
      "SELECT username, neopoints FROM users WHERE user_id = ?", //query database
      [userId]
    );
    console.log(userInfo); //printing in console for debugging
    if (!userInfo || userInfo.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Send the user information as JSON response
    res.json({
      username: userInfo[0].username,
      neopoints: userInfo[0].neopoints,
    });
  } catch (error) {
    console.error("Error fetching user info:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//acount page - displays users items
app.get("/api/account-user-items", authenticateUser, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const connection = await pool.getConnection();

    // Fetch user items by joining user_pocket and items tables
    const [userItems] = await connection.execute(
      "SELECT items.item_name FROM user_pocket " +
        "JOIN items ON user_pocket.item_id = items.item_id " +
        "WHERE user_pocket.user_id = ?",
      [userId]
    );
    console.log(userItems);
    // Extract item names from the result
    const itemNames = userItems.map((item) => item.item_name);

    // Send the user items as JSON response
    res.json({ items: itemNames });
  } catch (error) {
    console.error("Error fetching user items:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//account page - displays users pets
app.get("/api/account-user-pets", authenticateUser, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const connection = await pool.getConnection();

    // Fetch user pets from the user_pets table
    const [userPets] = await connection.execute(
      "SELECT pet_name, pet_type FROM user_pets WHERE user_id = ?",
      [userId]
    );

    // Send the user pets as JSON response
    res.json({ pets: userPets });
  } catch (error) {
    console.error("Error fetching user pets:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User logout route
app.post("/api/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Logout successful!" });
    }
  });
});

// Serve the default public/index.html created by Create React App
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
