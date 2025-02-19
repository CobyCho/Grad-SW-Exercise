const express = require('express');
const sql = require('mssql');  // Import the mssql package for SQL Server interaction
const cors = require('cors');  // Import the CORS package

const app = express();
const port = 3025; // Or whichever port you choose

app.use(cors());  // This line allows all domains to access your API
app.use(express.json());  // Middleware to parse JSON in request bodies

// SQL Server configuration (using Windows Authentication)
const dbConfig = {
  server: 'LAPTOP-RDAVLNK1', // Your SQL Server host
  database: 'internet_statistics', // Your database name
  user: 'sa', // Use the 'sa' login
  password: 'Cindy1547896123', // The password you set for 'sa'
  options: {
    encrypt: true,  // Use encryption if needed
    trustServerCertificate: true,  // Accept self-signed certificates if needed
  },
};

// API Key for authentication
const API_KEY = 'your-16-digit-api-key';  // Replace with your actual API key

// Middleware to check for API key
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];  // Get API key from the headers

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }

  next();  // Proceed to the next middleware/route handler if API key is valid
}

// Test Database Connection
async function testConnection() {
  try {
    await sql.connect(dbConfig);
    console.log('Successfully connected to SQL Server');
  } catch (err) {
    console.error('Failed to connect to SQL Server:', err);
  }
}
testConnection();  // Call the test connection function

// Route for root (home) page
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Welcome to the API!');
});

// Route to fetch all countries (secured with API key)
app.get('/countries', authenticateApiKey, async (req, res) => {
  console.log('Received request for /countries');
  try {
    await sql.connect(dbConfig);
    console.log('Successfully connected to the database');
    
    const result = await sql.query`
    SELECT c.country_name, c.country_code, i.[Rate (WB)] AS rate_wb
    FROM Countries c
    JOIN InternetUsage i ON c.country_code = i.Location
  `;    
    console.log('Query executed, data retrieved:', result.recordset);
    
    if (result.recordset.length === 0) {
      console.log('No countries found');
      return res.status(404).json({ error: 'No countries found in the database' });
    }

    res.json(result.recordset);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch countries' });
  } finally {
    await sql.close();
  }
});

// Route to get internet statistics for a specific country (secured with API key)
app.get('/countries/:code', authenticateApiKey, async (req, res) => {
  const countryCode = req.params.code;
  console.log('Fetched Country Code:', countryCode);  // Log the country code received by the backend
  
  if (!countryCode) {
    return res.status(400).json({ error: 'Country code is missing' });
  }

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT 
        [Rate (WB)] AS rate_wb, 
        [Year] AS year_wb, 
        [Rate (ITU)] AS rate_itu, 
        [Year 1] AS year_itu, 
        [Users (CIA)] AS users_cia, 
        [Year 2] AS year_cia
      FROM 
        InternetUsage
      WHERE 
        Location = ${countryCode}
    `;

    console.log('Fetched statistics:', result.recordset);  // Log the result from SQL query

    if (result.recordset.length === 0) {
      console.log('No data found for this country.');
      return res.status(404).json({ error: 'Country not found or no internet data available' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch internet statistics' });
  } finally {
    await sql.close();
  }
});


// Route to update internet statistics for a specific country
app.put('/countries/:code', authenticateApiKey, async (req, res) => {
  const countryCode = req.params.code;
  console.log(`Fetching internet statistics for country code: ${countryCode}`);
  const { rate_wb } = req.body;

  console.log('Received request for country:', countryCode, 'with rate:', rate_wb);  // Log the received values

  if (!rate_wb || isNaN(rate_wb) || rate_wb < 0 || rate_wb > 100) {
    return res.status(400).json({ error: 'Invalid Rate (WB) value.' });
  }

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      UPDATE InternetUsage
      SET [Rate (WB)] = ${rate_wb}, [Year] = ${new Date().getFullYear()}
      WHERE Location = ${countryCode}`;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Country not found' });
    }

    res.status(200).json({ message: 'Country data updated successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to update country data' });
  } finally {
    await sql.close();
  }
});

// Export app for testing
module.exports = app;

// Start the server only if this file is directly run (not when required in tests)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
