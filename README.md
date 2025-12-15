# PortalMaze - MERN Game with Online/Offline Support

A multiplayer maze game with portal teleportation and real-time leaderboard.

## What's Used

**Frontend**: React (Vite), CSS animations  
**Backend**: Express.js, Mongoose  
**Database**: MongoDB Atlas  
**Storage**: Browser localStorage (offline queue)

## How It Works

### Online
- Play maze → Score sent to MongoDB instantly → Leaderboard updates → Your rank shown
- All data saved permanently on server; visible to all players

### Offline
- Play maze → Score saved to browser localStorage → No leaderboard (offline)
- When you reconnect → Scores auto-sync to server → Leaderboard updates with your offline runs

## Key Features

✅ Dynamic 5x5, 7x7, 9x9 mazes with random walls and portals  
✅ Colored portal pairs (A-F) — step on, press Enter to teleport free  
✅ 6 goals: Money, Pet, Girl/Boy, Success, Career, Health  
✅ 2 modes: No-Break, Wall-Break (3 bombs to break walls)  
✅ Top 15 global leaderboard per goal/level  
✅ Auto-sync offline runs when reconnected  
✅ Dark theme with lavender accents, circular accuracy badge  

## Gameplay

1. Enter name → Choose avatar → Select mode
2. Pick goal + maze level (Easy/Medium/Hard)
3. Arrow keys to move, Shift+Arrow to break walls, Enter on portal to teleport
4. See stats, accuracy circle, leaderboard, and your rank

## Offline Behavior

- **Can't Connect?** Game still works locally; your score is stored in browser
- **Reconnect?** Your offline scores auto-upload to MongoDB when you reload results page
- **On Server?** All synced scores appear on leaderboard immediately

## API Endpoints

- `POST /api/scores` → Save score to MongoDB
- `GET /api/leaderboard` → Fetch Top 15 scores
- `GET /api/rank` → Get your rank

## Deploy

1. **Backend** → Render/Heroku with MongoDB URI
2. **Frontend** → Vercel/Netlify with VITE_API_URL env var pointing to backend
3. **Test Offline** → Set network offline, play, sync when back online
