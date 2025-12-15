import { useState } from "react";
import StartScreen from "./pages/StartScreen";
import GoalScreen from "./pages/GoalScreen";
import GameScreen from "./pages/GameScreen";

export default function App() {
  const [playerConfig, setPlayerConfig] = useState(null);
  const [goalSelection, setGoalSelection] = useState(null);

  if (!playerConfig) {
    return <StartScreen onStart={setPlayerConfig} />;
  }

  if (!goalSelection) {
    return <GoalScreen playerConfig={playerConfig} onSelect={setGoalSelection} />;
  }

  return (
    <GameScreen
      playerConfig={{
        ...playerConfig,
        goal: goalSelection.goal,
        level: goalSelection.level
      }}
    />
  );
}
