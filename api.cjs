const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper function to execute SQL queries
const query = (text, params) => pool.query(text, params);

// ... API endpoints will go here ...

// Get Schedule for a Date
router.get('/schedule/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const result = await query('SELECT * FROM events WHERE date = $1', [date]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Events for a Date Range
router.get('/events', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await query('SELECT * FROM events WHERE date BETWEEN $1 AND $2', [startDate, endDate]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add New Event
router.post('/events', async (req, res) => {
  try {
    const { date, day_letter, week_color, school_level, class_name, start_time, duration, period_color, minor, title, note } = req.body;
    const result = await query(
      'INSERT INTO events (date, day_letter, week_color, school_level, class_name, start_time, duration, period_color, minor, title, note) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [date, day_letter, week_color, school_level, class_name, start_time, duration, period_color, minor, title, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Existing Event
router.put('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, day_letter, week_color, school_level, class_name, start_time, duration, period_color, minor, title, note } = req.body;
    const result = await query(
      'UPDATE events SET date = $1, day_letter = $2, week_color = $3, school_level = $4, class_name = $5, start_time = $6, duration = $7, period_color = $8, minor = $9, title = $10, note = $11 WHERE id = $12 RETURNING *',
      [date, day_letter, week_color, school_level, class_name, start_time, duration, period_color, minor, title, note, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Event
router.delete('/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Unique Day Letters
router.get('/dayLetters', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT day_letter FROM events ORDER BY day_letter');
    res.json(result.rows.map(row => row.day_letter));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Unique Week Colors
router.get('/weekColors', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT week_color FROM events ORDER BY week_color');
    res.json(result.rows.map(row => row.week_color));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get School Levels
router.get('/schoolLevels', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT school_level FROM events ORDER BY school_level');
    res.json(result.rows.map(row => row.school_level));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Date Range Schedule (for print view)
router.get('/scheduleRange', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await query('SELECT * FROM events WHERE date BETWEEN $1 AND $2 ORDER BY date, start_time', [startDate, endDate]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Today and Next 5 Weekdays
router.get('/nextWeekdays', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT date
      FROM events
      WHERE date >= CURRENT_DATE
        AND EXTRACT(DOW FROM date) BETWEEN 1 AND 5
      ORDER BY date
      LIMIT 6
    `);
    res.json(result.rows.map(row => row.date));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get All Period Colors
router.get('/periodColors', async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT period_color FROM events ORDER BY period_color');
    res.json(result.rows.map(row => row.period_color));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;