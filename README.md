# PortalMaze - A MERN Stack Game with Leaderboard

A real-time multiplayer maze game built with React (Vite), Express, and MongoDB. Navigate mazes, use portals to teleport, and compete on the global leaderboard. Works seamlessly online and offline with automatic score synchronization.

## Features

- **Dynamic Maze Generation**: Procedurally generated 5x5, 7x7, and 9x9 mazes with randomized walls and portals
- **Portal Teleportation**: Step onto colored portals; press Enter to teleport to the matching pair (free move, no steps counted)
- **Multiple Goals**: Money, Pet, Girl/Boy, Success, Career, Health with avatar-dependent icons
- **Game Modes**: No-Break (standard) and Wall-Break (use 3 bombs to break walls via Shift+Arrow)
- **Online Leaderboard**: Top 15 global scores per goal/level combo with real-time rank display
- **Offline Support**: Scores queue locally when offline; auto-sync on reconnect
- **Responsive Design**: Dark theme with lavender accents, smooth animations, circular accuracy badge

## Tech Stack

- **Frontend**: React (Vite), CSS animations
- **Backend**: Express.js, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Ready for Vercel/Netlify (frontend) and Render/Heroku (backend)

## How It Works - Online & Offline

### Online Mode
1. **Play Game**: User completes a maze while connected to the internet
2. **Instant Save**: Score is immediately POST'd to `/api/scores` endpoint
3. **Database Storage**: MongoDB stores playerName, goal, level, mode, steps, time, accuracy, bombs, teleports
4. **Leaderboard Fetch**: Frontend fetches Top 15 leaderboard for that goal/level combo
5. **Rank Calculation**: Your rank is computed against all scores
6. **Display Results**: Accuracy circle, stats, and Top 15 appear instantly

### Offline Mode
1. **Play Game**: All maze logic runs client-side; works without internet
2. **Local Queue**: On completion, score is saved to **browser localStorage** (key: `portalmaze_pending_scores`)
3. **No Leaderboard**: Leaderboard won't load (backend unreachable)
4. **Stored JSON**: Queue persists as JSON array in localStorage until reconnection

### Reconnection & Auto-Sync
1. **Back Online**: When you reconnect and revisit results screen
2. **Auto Flush**: `flushPending()` automatically sends all queued scores to `/api/scores`
3. **Batch Upload**: Each offline run is POST'd; failed ones stay in queue
4. **Leaderboard Refresh**: Updated Top 15 including your offline runs
5. **Rank Update**: Your rank recalculated with all synced scores
6. **Queue Cleared**: Successfully uploaded scores removed from localStorage

### File Storage Details

**Server (Online)**:
- Endpoint: `POST /api/scores`
- Database: MongoDB (stores playerName, goal, levelId, levelSize, steps, time, accuracy, bombsUsed, teleports, createdAt)
- Persistence: Permanent; survives logout/browser clear
- Accessible: From any device/browser once deployed

**Client (Offline)**:
- Storage Type: Browser localStorage
- Key: `portalmaze_pending_scores`
- Format: JSON array of score objects
- Persistence: Survives browser restart; lost on "Clear browsing data"
- Scope: Single browser/device only

## Local Setup

### Prerequisites
- Node.js v16+
- MongoDB Atlas account (or local MongoDB)
- Git Bash / PowerShell

### Installation

1. Clone the repo:
```bash
git clone https://github.com/wersatyle/portalmaze-A-MERN-stack-game-project-with-leaderboard-and-MongoDB-integration-.git
cd PortalMaze
```

2. Backend setup:
```bash
cd backend
npm install
# Create .env with:
# MONGODB_URI=your_mongodb_connection_string
node server.js  # Runs on port 5000
```

3. Frontend setup:
```bash
cd frontend
npm install
npm run dev  # Runs on port 5173
```

## Gameplay

1. **Start**: Enter name, choose avatar (👩 or 👨), select mode
2. **Goal Selection**: Pick a goal and maze size (Easy 5x5, Medium 7x7, Hard 9x9)
3. **Play**: Use arrow keys to move, Shift+Arrow to break walls, Enter to teleport on portals
4. **Results**: See stats, accuracy circle, your rank, and Top 15 leaderboard (if online)

## API Endpoints

### POST /api/scores
Saves a game result to MongoDB.
```json
{
  "playerName": "Neha",
  "mazeId": "goal-money-level-small",
  "mode": "wall-break",
  "goal": "money",
  "levelId": "small",
  "levelSize": 5,
  "steps": 42,
  "time": 120,
  "bombsUsed": 1,
  "teleports": 3,
  "accuracy": 95
}
```

### GET /api/leaderboard
Fetches Top 15 scores for a given goal/level/mode combo.
```
Query: ?mazeId=goal-money-level-small&mode=wall-break
Response: [{ playerName, accuracy, steps, time, teleports }, ...]
```

### GET /api/rank
Computes your rank and total entries for the leaderboard.
```
Query: ?mazeId=...&mode=...&accuracy=95&steps=42&time=120
Response: { rank: 7, total: 143 }
```

## Deployment Guide

### Backend (Render / Heroku / Railway)
1. Create a new service on Render/Heroku
2. Connect your GitHub repo
3. Add environment variable: `MONGODB_URI=your_mongodb_connection_string`
4. Deploy `backend` folder
5. Note the backend URL (e.g., `https://portalmaze-api.onrender.com`)

### Frontend (Vercel / Netlify)
1. Create a new project on Vercel/Netlify
2. Connect your GitHub repo
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL=https://portalmaze-api.onrender.com`
6. Deploy

### Test Offline Sync
1. Open the deployed game in browser
2. Open DevTools → Network tab
3. Set to "Offline" mode
4. Play and complete a game
5. Observe: score saved to localStorage, leaderboard empty
6. Set Network to "Online"
7. Refresh results page
8. Observe: pending score flushed, leaderboard updated, your rank shown

## Project Structure

```
PortalMaze/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── StartScreen.jsx     (name, avatar, mode selection)
│   │   │   ├── GoalScreen.jsx      (goal & level selection)
│   │   │   ├── GameScreen.jsx      (maze gameplay)
│   │   │   └── ResultScreen.jsx    (stats, leaderboard, rank, offline queue)
│   │   ├── App.jsx                 (routing & state)
│   │   └── index.css               (dark theme, animations)
│   └── package.json
├── backend/
│   ├── models/
│   │   └── Score.js                (MongoDB schema)
│   ├── server.js                   (Express routes + CORS)
│   └── package.json
└── README.md
```

## Future Enhancements

- Leaderboard pagination / filter by date
- User authentication & profiles
- Daily/weekly challenges
- Mobile app (React Native)
- Real-time multiplayer (Socket.io)
- Sound effects & music
- Difficulty tiers with multipliers

## Troubleshooting

**Leaderboard shows empty when online?**
- Check backend is running: `http://localhost:5000` (or deployed URL)
- Ensure `VITE_API_URL` is set correctly in frontend `.env`
- Check browser console for fetch errors

**Offline scores not syncing?**
- Verify `navigator.onLine` returns true after reconnecting
- Refresh the results page to trigger `flushPending()`
- Check localStorage in DevTools for pending scores

**MongoDB connection failed?**
- Verify MongoDB Atlas IP whitelist includes your backend server
- Check `MONGODB_URI` format and credentials

## License

MIT

---

**Created by**: Neha Rani  
**Repository**: [GitHub](https://github.com/wersatyle/portalmaze-A-MERN-stack-game-project-with-leaderboard-and-MongoDB-integration-)
