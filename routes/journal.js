const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const JOURNAL_BASE = path.join(__dirname, '..', 'journal');

// Helper: Get current date string (YYYY-MM-DD)
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Helper: Get week number (ISO 8601)
function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// Helper: Get quarter string (YYYY-Qn)
function getCurrentQuarter() {
  const now = new Date();
  const quarter = Math.floor(now.getMonth() / 3) + 1;
  return `${now.getFullYear()}-Q${quarter}`;
}

// Helper: Ensure directory exists
async function ensureDir(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Helper: Read file with fallback to template
async function readFileOrTemplate(filePath, templatePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (err) {
    if (err.code === 'ENOENT' && templatePath) {
      try {
        return await fs.readFile(templatePath, 'utf-8');
      } catch {
        return '';
      }
    }
    throw err;
  }
}

// GET /api/journal/dashboard - Get dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const today = getCurrentDate();
    const currentWeek = getWeekNumber(new Date());
    
    // Get today's tasks
    const dayPath = path.join(JOURNAL_BASE, 'days', `${today}.md`);
    let dayContent = '';
    try {
      dayContent = await fs.readFile(dayPath, 'utf-8');
    } catch (err) {
      // File doesn't exist yet
    }
    
    // Get current week
    const weekPath = path.join(JOURNAL_BASE, 'weeks', `${currentWeek}.md`);
    let weekContent = '';
    try {
      weekContent = await fs.readFile(weekPath, 'utf-8');
    } catch (err) {
      // File doesn't exist yet
    }
    
    // Get habits
    const habitsPath = path.join(JOURNAL_BASE, 'habits', 'tracker.md');
    let habitsContent = '';
    try {
      habitsContent = await fs.readFile(habitsPath, 'utf-8');
    } catch (err) {
      // File doesn't exist yet
    }
    
    // Calculate habit streak for today
    const habitStreak = calculateHabitStreak(habitsContent, today);
    
    res.json({
      today,
      currentWeek,
      dayContent,
      weekContent,
      habitStreak
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Helper: Calculate habit completion for today
function calculateHabitStreak(habitsContent, date) {
  const day = parseInt(date.split('-')[2], 10);
  const lines = habitsContent.split('\n');
  
  let completed = 0;
  let total = 0;
  let inHabitSection = false;
  
  for (const line of lines) {
    if (line.startsWith('### ') && /^\d+\./.test(line.split('### ')[1])) {
      inHabitSection = true;
      total++;
    } else if (line.startsWith('##') && !line.startsWith('###')) {
      inHabitSection = false;
    }
    
    if (inHabitSection) {
      // Look for checkbox patterns with the day number
      const dayPattern = new RegExp(`\\[([x\\-/])\\]\\s*${day}\\b`);
      const match = line.match(dayPattern);
      if (match && match[1] === 'x') {
        completed++;
        inHabitSection = false;
      }
    }
  }
  
  return { completed, total };
}

// GET /api/journal/goals/:quarter - Get quarterly goals
router.get('/goals/:quarter?', async (req, res) => {
  try {
    const quarter = req.params.quarter || getCurrentQuarter();
    const filePath = path.join(JOURNAL_BASE, 'goals', `${quarter}.md`);
    const content = await readFileOrTemplate(filePath, null);
    
    res.json({ quarter, content });
  } catch (err) {
    console.error('Get goals error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/journal/goals/:quarter - Update quarterly goals
router.put('/goals/:quarter', async (req, res) => {
  try {
    const { quarter } = req.params;
    const { content } = req.body;
    
    const dirPath = path.join(JOURNAL_BASE, 'goals');
    await ensureDir(dirPath);
    
    const filePath = path.join(dirPath, `${quarter}.md`);
    await fs.writeFile(filePath, content, 'utf-8');
    
    res.json({ success: true, quarter });
  } catch (err) {
    console.error('Update goals error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/journal/week/:week? - Get weekly plan
router.get('/week/:week?', async (req, res) => {
  try {
    const week = req.params.week || getWeekNumber(new Date());
    const filePath = path.join(JOURNAL_BASE, 'weeks', `${week}.md`);
    const content = await readFileOrTemplate(filePath, null);
    
    res.json({ week, content });
  } catch (err) {
    console.error('Get week error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/journal/week/:week - Update weekly plan
router.put('/week/:week', async (req, res) => {
  try {
    const { week } = req.params;
    const { content } = req.body;
    
    const dirPath = path.join(JOURNAL_BASE, 'weeks');
    await ensureDir(dirPath);
    
    const filePath = path.join(dirPath, `${week}.md`);
    await fs.writeFile(filePath, content, 'utf-8');
    
    res.json({ success: true, week });
  } catch (err) {
    console.error('Update week error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/journal/day/:date? - Get daily tasks
router.get('/day/:date?', async (req, res) => {
  try {
    const date = req.params.date || getCurrentDate();
    const filePath = path.join(JOURNAL_BASE, 'days', `${date}.md`);
    const content = await readFileOrTemplate(filePath, null);
    
    res.json({ date, content });
  } catch (err) {
    console.error('Get day error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/journal/day/:date - Update daily tasks
router.put('/day/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { content } = req.body;
    
    const dirPath = path.join(JOURNAL_BASE, 'days');
    await ensureDir(dirPath);
    
    const filePath = path.join(dirPath, `${date}.md`);
    await fs.writeFile(filePath, content, 'utf-8');
    
    res.json({ success: true, date });
  } catch (err) {
    console.error('Update day error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/journal/habits - Get habit tracker
router.get('/habits', async (req, res) => {
  try {
    const filePath = path.join(JOURNAL_BASE, 'habits', 'tracker.md');
    const content = await readFileOrTemplate(filePath, null);
    
    res.json({ content });
  } catch (err) {
    console.error('Get habits error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/journal/habits - Update habit tracker
router.put('/habits', async (req, res) => {
  try {
    const { content } = req.body;
    
    const dirPath = path.join(JOURNAL_BASE, 'habits');
    await ensureDir(dirPath);
    
    const filePath = path.join(dirPath, 'tracker.md');
    await fs.writeFile(filePath, content, 'utf-8');
    
    res.json({ success: true });
  } catch (err) {
    console.error('Update habits error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/journal/review/:week? - Get weekly review
router.get('/review/:week?', async (req, res) => {
  try {
    const week = req.params.week || getWeekNumber(new Date());
    const filePath = path.join(JOURNAL_BASE, 'reviews', `${week}-review.md`);
    const content = await readFileOrTemplate(filePath, null);
    
    res.json({ week, content });
  } catch (err) {
    console.error('Get review error:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/journal/review/:week - Update weekly review
router.put('/review/:week', async (req, res) => {
  try {
    const { week } = req.params;
    const { content } = req.body;
    
    const dirPath = path.join(JOURNAL_BASE, 'reviews');
    await ensureDir(dirPath);
    
    const filePath = path.join(dirPath, `${week}-review.md`);
    await fs.writeFile(filePath, content, 'utf-8');
    
    res.json({ success: true, week });
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/journal/dates - Get available dates for navigation
router.get('/dates', async (req, res) => {
  try {
    const daysDir = path.join(JOURNAL_BASE, 'days');
    const weeksDir = path.join(JOURNAL_BASE, 'weeks');
    const reviewsDir = path.join(JOURNAL_BASE, 'reviews');
    
    const days = await fs.readdir(daysDir).catch(() => []);
    const weeks = await fs.readdir(weeksDir).catch(() => []);
    const reviews = await fs.readdir(reviewsDir).catch(() => []);
    
    res.json({
      days: days.filter(f => f.endsWith('.md')).map(f => f.replace('.md', '')),
      weeks: weeks.filter(f => f.endsWith('.md')).map(f => f.replace('.md', '')),
      reviews: reviews.filter(f => f.endsWith('.md')).map(f => f.replace('-review.md', ''))
    });
  } catch (err) {
    console.error('Get dates error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
