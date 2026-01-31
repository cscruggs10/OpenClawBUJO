# Bullet Journal Web UI

A mobile-friendly web interface for the bullet journal system.

## Access

**URL:** http://localhost:3000/journal (local)  
**Production:** Port 8080 when deployed

## Features

### 📊 Dashboard
- Overview of current week and today's date
- Habit completion streak for today
- Today's priority task preview
- This week's priority task preview

### 📝 Daily Tasks
- View and edit daily task files (days/YYYY-MM-DD.md)
- Date picker with "Today" quick button
- Full markdown editing support
- Preserves bullet journal symbols: [ ], [x], [/], [-], [>]

### 📅 Weekly Planning
- View and edit weekly plans (weeks/YYYY-Wnn.md)
- Week selector with "Current Week" quick button
- Supports ISO 8601 week numbering (YYYY-Wnn)

### 🎯 Quarterly Goals
- View and edit quarterly goal files (goals/YYYY-Qn.md)
- Quarter selector with "Current Quarter" quick button
- CRUD for goal entries with action steps and progress tracking

### ✅ Habit Tracker
- View and edit habit tracker (habits/tracker.md)
- Supports multiple habits with daily checkboxes
- Preserves markdown formatting and checkbox states

### 🔍 Weekly Review
- View and edit weekly review files (reviews/YYYY-Wnn-review.md)
- Week selector with "Current Week" quick button
- Reflection prompts and action items

## API Endpoints

All endpoints are prefixed with `/api/journal`:

- `GET /dashboard` - Dashboard summary data
- `GET /goals/:quarter` - Get quarterly goals (default: current quarter)
- `PUT /goals/:quarter` - Update quarterly goals
- `GET /week/:week` - Get weekly plan (default: current week)
- `PUT /week/:week` - Update weekly plan
- `GET /day/:date` - Get daily tasks (default: today)
- `PUT /day/:date` - Update daily tasks
- `GET /habits` - Get habit tracker
- `PUT /habits` - Update habit tracker
- `GET /review/:week` - Get weekly review (default: current week)
- `PUT /review/:week` - Update weekly review
- `GET /dates` - List available dates for navigation

## Technical Details

### File Structure
```
routes/journal.js     - API route handlers
public/journal.html   - Single-page web UI
```

### Design
- Mobile-first responsive design
- Purple gradient theme (matches AutoIntel)
- Card-based layout
- Sticky header with navigation
- Clean, fast-loading interface

### Storage
- All data stored as markdown files in journal/ directory
- No database required
- Preserves markdown formatting
- Auto-creates files if they don't exist

## Usage Tips

1. **Mobile Access:** The UI is optimized for phone access (great for Telegram users!)
2. **Quick Navigation:** Use the nav buttons at the top to switch between sections
3. **Save Often:** Click the save button after making changes
4. **Date Formats:**
   - Days: YYYY-MM-DD (e.g., 2026-01-30)
   - Weeks: YYYY-Wnn (e.g., 2026-W05)
   - Quarters: YYYY-Qn (e.g., 2026-Q1)

## Testing

```bash
# Start server
cd /root/clawd
node server.js

# Test API endpoints
curl http://localhost:3000/api/journal/dashboard
curl http://localhost:3000/api/journal/day/2026-01-30
curl http://localhost:3000/api/journal/week/2026-W05

# Access UI
open http://localhost:3000/journal
```

## Notes

- All markdown files are preserved exactly as written
- Bullet journal symbols are supported: [ ], [x], [/], [-], [>]
- Files are created automatically if they don't exist
- Changes are saved immediately to disk
- No authentication (runs locally/trusted environment)
