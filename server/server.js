require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hospital',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());

// Create patients table if it doesn't exist
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        gender TEXT NOT NULL,
        address TEXT,
        phone TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Patients table created or already exists');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

// Initialize database
createTable();

// Routes
app.post('/api/patients', async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, gender, address, phone, email } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !date_of_birth || !gender) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO patients (first_name, last_name, date_of_birth, gender, address, phone, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [first_name, last_name, date_of_birth, gender, address, phone, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registering patient:', err);
    res.status(500).json({ error: 'Error registering patient' });
  }
});

// SQL Query endpoint
app.post('/api/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Basic SQL injection prevention
    if (query.toLowerCase().includes('drop') || 
        query.toLowerCase().includes('delete') || 
        query.toLowerCase().includes('update') ||
        query.toLowerCase().includes('alter')) {
      return res.status(400).json({ error: 'Invalid query' });
    }

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Error executing query' });
  }
});

// Get all patients with pagination
app.get('/api/patients', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      'SELECT * FROM patients ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM patients');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      patients: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ error: 'Error fetching patients' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 