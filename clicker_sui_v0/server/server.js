import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(join(__dirname, 'scores.db'));

// Create scores table if it doesn't exist (stores clicker game scores)
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT NOT NULL UNIQUE,
    total_score INTEGER NOT NULL DEFAULT 0,
    last_score INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create time_earned table to track quiz time earned (separate from clicker scores)
db.exec(`
  CREATE TABLE IF NOT EXISTS time_earned (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT NOT NULL UNIQUE,
    available_time INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create index on wallet_address for faster lookups
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_wallet_address ON scores(wallet_address)
`);

// Helper function to update timestamp
const updateTimestamp = db.prepare(`
  UPDATE scores SET updated_at = CURRENT_TIMESTAMP WHERE wallet_address = ?
`);

// GET /api/scores - Get all scores (for scoreboard)
app.get('/api/scores', (req, res) => {
  try {
    const scores = db.prepare(`
      SELECT 
        wallet_address,
        total_score,
        last_score,
        updated_at,
        created_at
      FROM scores
      ORDER BY total_score DESC
      LIMIT 100
    `).all();
    
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// GET /api/scores/:walletAddress - Get score for specific wallet
app.get('/api/scores/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    const score = db.prepare(`
      SELECT 
        wallet_address,
        total_score,
        last_score,
        updated_at,
        created_at
      FROM scores
      WHERE wallet_address = ?
    `).get(walletAddress);
    
    if (!score) {
      return res.status(404).json({ error: 'Score not found' });
    }
    
    res.json(score);
  } catch (error) {
    console.error('Error fetching score:', error);
    res.status(500).json({ error: 'Failed to fetch score' });
  }
});

// POST /api/scores - Save clicker game score
app.post('/api/scores', (req, res) => {
  try {
    const { walletAddress, score } = req.body;
    
    if (!walletAddress || score === undefined) {
      return res.status(400).json({ error: 'walletAddress and score are required' });
    }
    
    // Check if wallet already exists
    const existing = db.prepare(`
      SELECT total_score FROM scores WHERE wallet_address = ?
    `).get(walletAddress);
    
    if (existing) {
      // Update existing score - keep the highest score
      const newTotalScore = Math.max(existing.total_score, score);
      db.prepare(`
        UPDATE scores 
        SET total_score = ?,
            last_score = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE wallet_address = ?
      `).run(newTotalScore, score, walletAddress);
      
      res.json({
        wallet_address: walletAddress,
        total_score: newTotalScore,
        last_score: score,
        message: 'Score updated successfully'
      });
    } else {
      // Insert new score
      db.prepare(`
        INSERT INTO scores (wallet_address, total_score, last_score)
        VALUES (?, ?, ?)
      `).run(walletAddress, score, score);
      
      res.json({
        wallet_address: walletAddress,
        total_score: score,
        last_score: score,
        message: 'Score created successfully'
      });
    }
  } catch (error) {
    console.error('Error saving score:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// POST /api/time - Earn time from quiz (adds to available time)
app.post('/api/time', (req, res) => {
  try {
    const { walletAddress, timeEarned } = req.body;
    console.log('POST /api/time - Received:', { walletAddress, timeEarned });
    
    if (!walletAddress || timeEarned === undefined) {
      console.error('Missing required fields:', { walletAddress, timeEarned });
      return res.status(400).json({ error: 'walletAddress and timeEarned are required' });
    }
    
    // Check if wallet already exists
    const existing = db.prepare(`
      SELECT available_time FROM time_earned WHERE wallet_address = ?
    `).get(walletAddress);
    
    console.log('Existing time record:', existing);
    
    if (existing) {
      // Add to existing time
      const newTime = existing.available_time + timeEarned;
      console.log('Updating time from', existing.available_time, 'to', newTime);
      db.prepare(`
        UPDATE time_earned 
        SET available_time = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE wallet_address = ?
      `).run(newTime, walletAddress);
      
      res.json({
        wallet_address: walletAddress,
        available_time: newTime,
        message: 'Time updated successfully'
      });
    } else {
      // Insert new time
      console.log('Creating new time record with', timeEarned);
      db.prepare(`
        INSERT INTO time_earned (wallet_address, available_time)
        VALUES (?, ?)
      `).run(walletAddress, timeEarned);
      
      res.json({
        wallet_address: walletAddress,
        available_time: timeEarned,
        message: 'Time created successfully'
      });
    }
  } catch (error) {
    console.error('Error saving time:', error);
    res.status(500).json({ error: 'Failed to save time' });
  }
});

// GET /api/time/:walletAddress - Get available time for wallet
app.get('/api/time/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    console.log('GET /api/time/:walletAddress - Requested for:', walletAddress);
    
    const timeData = db.prepare(`
      SELECT available_time FROM time_earned WHERE wallet_address = ?
    `).get(walletAddress);
    
    console.log('Time data from DB:', timeData);
    
    if (!timeData) {
      console.log('No time data found, returning 0');
      return res.json({ wallet_address: walletAddress, available_time: 0 });
    }
    
    console.log('Returning time data:', timeData);
    res.json(timeData);
  } catch (error) {
    console.error('Error fetching time:', error);
    res.status(500).json({ error: 'Failed to fetch time' });
  }
});

// PUT /api/time/:walletAddress - Update available time (for clicker game usage)
app.put('/api/time/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { availableTime } = req.body;
    
    if (availableTime === undefined) {
      return res.status(400).json({ error: 'availableTime is required' });
    }
    
    const result = db.prepare(`
      UPDATE time_earned 
      SET available_time = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE wallet_address = ?
    `).run(Math.max(0, availableTime), walletAddress);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Time record not found' });
    }
    
    const updated = db.prepare(`
      SELECT * FROM time_earned WHERE wallet_address = ?
    `).get(walletAddress);
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating time:', error);
    res.status(500).json({ error: 'Failed to update time' });
  }
});

// PUT /api/scores/:walletAddress - Update score (for clicker time deduction)
app.put('/api/scores/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { totalScore } = req.body;
    
    if (totalScore === undefined) {
      return res.status(400).json({ error: 'totalScore is required' });
    }
    
    const result = db.prepare(`
      UPDATE scores 
      SET total_score = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE wallet_address = ?
    `).run(Math.max(0, totalScore), walletAddress);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }
    
    const updated = db.prepare(`
      SELECT * FROM scores WHERE wallet_address = ?
    `).get(walletAddress);
    
    res.json(updated);
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: scores.db`);
});

