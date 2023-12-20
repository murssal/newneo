// Test database connection module
const mysql = require("mysql2/promise");

// Database connection parameters
const host = "newneo.cghqoxxyg0hl.us-west-1.rds.amazonaws.com";
const dbName = "newneo";
const username = "admin";
const password = "neopetsadmin";

// Function to connect to the database
async function connectToDB() {
  try {
    const connection = await mysql.createConnection({
      host,
      user: username,
      password,
      database: dbName,
    });

    console.log("Connected to the database");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    throw error;
  }
}

// Function to close the database connection
async function closeConnection(connection) {
  try {
    await connection.end();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error closing connection:", error.message);
  }
}

// Export the module functions
module.exports = {
  connectToDB,
  closeConnection,
};
