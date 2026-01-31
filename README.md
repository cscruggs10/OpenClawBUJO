# 📓 OpenClaw BUJO

**Digital Bullet Journal with Web Interface**

A mobile-friendly web app for managing your bullet journal system — quarterly goals, weekly planning, daily tasks, habit tracking, and weekly reviews.

## Features

- 📊 **Dashboard** — Overview with habit streaks and task previews
- 📝 **Daily Tasks** — Primary/secondary/additional tasks with notes
- 📅 **Weekly Planning** — Sunday planning sessions with task migration
- 🎯 **Quarterly Goals** — Track 3-5 SMART outcome goals per quarter
- ✅ **Habit Tracker** — Daily habit checkboxes with streak counting
- 🔍 **Weekly Review** — End-of-week reflection and improvements

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start

# Development mode with auto-reload
npm run dev
```

Access at: **http://localhost:3000**

## Structure

```
journal/
├── goals/           # Quarterly outcome goals (3-5 per quarter)
├── weeks/           # Weekly planning (Sunday sessions)
├── days/            # Daily execution (primary/secondary/additional)
├── habits/          # Habit tracking (start with 3, add 1 per quarter)
└── reviews/         # Weekly reviews (what worked, what didn't)
```

## Workflow

### Quarterly (Every 13 weeks)
1. Review previous quarter
2. Set 3-5 SMART outcome goals
3. Break each goal into 5 action steps
4. Define key motivation
5. Add one new habit to tracker

### Weekly (Sunday)
1. Review last week
2. Set weekly priority (aligns with quarterly goal)
3. List 10-14 secondary tasks
4. Migrate incomplete tasks

### Daily
1. Define primary task (most important)
2. List 2 secondary tasks (only after primary done)
3. Additional tasks and reminders
4. Track notes/ideas throughout the day
5. Update habit tracker

### Weekly Review (End of week)
1. What worked?
2. What didn't work?
3. How will you improve?
4. Update goal progress
5. Migrate tasks to next week

## Task Status Symbols

- `[ ]` To Do
- `[x]` Completed
- `[/]` In Progress
- `[-]` Canceled
- `[>]` Migrated

## Deployment

### Railway

```bash
# Connect to Railway
railway login

# Deploy
railway up
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```
PORT=3000
NODE_ENV=production
```

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JavaScript (no framework bloat)
- **Storage:** Markdown files (portable, version-controllable)
- **Style:** Mobile-first responsive design

## Philosophy

This is a **digital implementation of the Bullet Journal method** — a productivity system that combines todo lists, planning, and reflection.

The web interface makes it accessible from any device while keeping your data in simple markdown files that you own and control.

## License

MIT

## Author

Built by Corey Scruggs with Iris (Clawdbot)
