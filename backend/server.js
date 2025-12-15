import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Score from "./models/Score.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://wersatyle:nrneharani9900@cluster0.9f8adf9.mongodb.net/portalmaze?retryWrites=true&w=majority&appName=Cluster0");

// Save game result
app.post("/api/scores", async (req, res) => {
  try {
    const { playerName, mazeId, mode, goal, levelId, levelSize, steps, time, bombsUsed = 0, teleports = 0 } = req.body;
    const safeSteps = Math.max(steps || 0, 1);
    const rawAccuracy = ((safeSteps - bombsUsed) / safeSteps) * 100;
    const accuracy = Math.max(0, Math.min(100, Math.round(rawAccuracy)));

    const score = new Score({
      playerName,
      mazeId,
      mode,
      goal,
      levelId,
      levelSize,
      steps,
      time,
      accuracy,
      bombsUsed,
      teleports
    });

    await score.save();
    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaderboard
app.get("/api/leaderboard", async (req, res) => {
  try {
    const { mazeId, mode, goal, levelId, levelSize } = req.query;
    const query = {};
    if (mazeId) query.mazeId = mazeId;
    if (mode) query.mode = mode;
    if (goal) query.goal = goal;
    if (levelId) query.levelId = levelId;
    if (levelSize) query.levelSize = Number(levelSize);

    const scores = await Score.find(query)
      .sort({ accuracy: -1, steps: 1, time: 1 })
      .limit(15);

    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get rank for a score context
app.get("/api/rank", async (req, res) => {
  try {
    const { mazeId, mode, goal, levelId, levelSize, accuracy, steps, time } = req.query;
    if (accuracy === undefined || steps === undefined || time === undefined) {
      return res.status(400).json({ error: "accuracy, steps, and time are required" });
    }

    const query = {};
    if (mazeId) query.mazeId = mazeId;
    if (mode) query.mode = mode;
    if (goal) query.goal = goal;
    if (levelId) query.levelId = levelId;
    if (levelSize) query.levelSize = Number(levelSize);

    const acc = Number(accuracy);
    const st = Number(steps);
    const tm = Number(time);

    const better = await Score.countDocuments({
      ...query,
      $or: [
        { accuracy: { $gt: acc } },
        { accuracy: acc, steps: { $lt: st } },
        { accuracy: acc, steps: st, time: { $lt: tm } }
      ]
    });

    const total = await Score.countDocuments(query);
    res.json({ rank: better + 1, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Backend running on port 5000"));

