import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  mazeId: { type: String, required: true },
  mode: { type: String, required: true },
  goal: { type: String },
  levelId: { type: String },
  levelSize: { type: Number },
  steps: { type: Number, required: true },
  time: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  bombsUsed: { type: Number, default: 0 },
  teleports: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Score", scoreSchema);
