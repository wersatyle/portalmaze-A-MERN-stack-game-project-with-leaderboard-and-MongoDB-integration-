import { useMemo, useState } from "react";

const LEVELS = [
  { id: "small", label: "Easy 5x5", size: 5 },
  { id: "medium", label: "Medium 7x7", size: 7 },
  { id: "large", label: "Hard 9x9", size: 9 }
];

export default function GoalScreen({ playerConfig, onSelect }) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const goals = useMemo(() => {
    const isFemale = playerConfig?.avatar === "girl";
    return [
      { id: "money", label: "Money", emoji: "💰" },
      { id: "pet", label: "Pet", emoji: "🐶" },
      { id: "girl", label: isFemale ? "Boy" : "Girl", emoji: isFemale ? "👦" : "👧" },
      { id: "success", label: "Success", emoji: "🏆" },
      { id: "career", label: "Career", emoji: "💼" },
      { id: "health", label: "Health", emoji: "🧘" }
    ];
  }, [playerConfig]);

  const canContinue = selectedGoal && selectedLevel;

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0b0b0f", color: "#e6e6fa" }}>
      <div style={{ background: "#0b0b0f", padding: 24, borderRadius: 16, width: 380, boxShadow: "0 10px 40px rgba(0,0,0,0.45)", textAlign: "center", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <h1 style={{ margin: 0, marginBottom: 12 }}>Choose Your Goal</h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {goals.map(goal => {
              const active = goal.id === selectedGoal;
              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal.id)}
                  style={{
                    padding: "14px 10px",
                    borderRadius: 12,
                    border: active ? "2px solid #6b21a8" : "1px solid #2c2c38",
                    background: active ? "rgba(107, 33, 168, 0.25)" : "#111",
                    color: "#e6e6fa",
                    cursor: "pointer",
                    boxShadow: active ? "0 0 18px rgba(107, 33, 168, 0.55)" : "none",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{goal.emoji}</div>
                  <div style={{ fontWeight: "bold" }}>{goal.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h2 style={{ margin: "12px 0 10px 0", fontSize: 18 }}>Select Maze Size</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {LEVELS.map(level => {
              const active = selectedLevel?.id === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level)}
                  style={{
                    padding: "12px 10px",
                    borderRadius: 12,
                    border: active ? "2px solid #6b21a8" : "1px solid #2c2c38",
                    background: active ? "rgba(107, 33, 168, 0.25)" : "#111",
                    color: "#e6e6fa",
                    cursor: "pointer",
                    boxShadow: active ? "0 0 16px rgba(107, 33, 168, 0.45)" : "none",
                    transition: "all 0.2s ease",
                    fontWeight: "bold"
                  }}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          disabled={!canContinue}
          onClick={() => onSelect({ goal: selectedGoal, level: selectedLevel })}
          style={{
            marginTop: 4,
            padding: "14px 24px",
            width: "100%",
            border: "none",
            borderRadius: 10,
            background: canContinue ? "#6b21a8" : "#444",
            color: "#e6e6fa",
            cursor: canContinue ? "pointer" : "not-allowed",
            boxShadow: canContinue ? "0 0 18px rgba(107, 33, 168, 0.55)" : "none",
            fontSize: 16,
            fontWeight: "bold",
            transition: "all 0.2s ease"
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
