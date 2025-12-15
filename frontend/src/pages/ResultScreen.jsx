import { useEffect, useMemo, useState, Fragment } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PENDING_KEY = "portalmaze_pending_scores";

export default function ResultScreen({ steps, time, bombsUsed, teleports, playerConfig, gridSize }) {
  const accuracy = useMemo(() => {
    const safeSteps = Math.max(steps || 0, 1);
    const raw = ((safeSteps - bombsUsed) / safeSteps) * 100;
    return Math.max(0, Math.min(100, Math.round(raw)));
  }, [steps, bombsUsed]);

  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const playerName = playerConfig?.name || localStorage.getItem("playerName") || "Guest";
  const goal = playerConfig?.goal || "na";
  const levelId = playerConfig?.level?.id || String(gridSize || "na");
  const mode = playerConfig?.mode || "no-break";
  const mazeId = `goal-${goal}-level-${levelId}`;

  const loadPending = () => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const savePending = items => {
    try {
      localStorage.setItem(PENDING_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  };

  const enqueuePending = payload => {
    const pending = loadPending();
    pending.push(payload);
    savePending(pending);
  };

  const flushPending = async () => {
    const pending = loadPending();
    if (!pending.length) return;
    const remaining = [];
    for (const item of pending) {
      try {
        await fetch(`${API_BASE}/api/scores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      } catch {
        remaining.push(item);
      }
    }
    savePending(remaining);
  };

  useEffect(() => {
    // try syncing any queued scores first
    flushPending();
    if (!navigator.onLine) {
      enqueuePending({
        playerName,
        mazeId,
        mode,
        goal,
        levelId,
        levelSize: gridSize,
        steps,
        time,
        bombsUsed,
        teleports,
        accuracy
      });
      return;
    }

    const payload = {
      playerName,
      mazeId,
      mode,
      goal,
      levelId,
      levelSize: gridSize,
      steps,
      time,
      bombsUsed,
      teleports,
      accuracy
    };

    fetch(`${API_BASE}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(() => enqueuePending(payload));

    fetch(`${API_BASE}/api/leaderboard?mazeId=${mazeId}&mode=${mode}`)
      .then(r => r.json())
      .then(d => setLeaderboard(d))
      .catch(() => console.log("Could not fetch leaderboard"));

    fetch(`${API_BASE}/api/rank?mazeId=${mazeId}&mode=${mode}&goal=${goal}&levelId=${levelId}&levelSize=${gridSize}&accuracy=${accuracy}&steps=${steps}&time=${time}`)
      .then(r => r.json())
      .then(d => setMyRank(d))
      .catch(() => console.log("Could not fetch rank"));
  }, [playerName, mazeId, mode, goal, levelId, gridSize, steps, time, bombsUsed, teleports, accuracy]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#0b0b0f", color: "#e6e6fa" }}>
      <div style={{ background: "#111", padding: 32, borderRadius: 16, maxWidth: 520, width: "90%", boxShadow: "0 10px 40px rgba(0,0,0,0.55)" }}>
        <h1>🎯 Game Over!</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: 10, borderRadius: 12, background: "#161626", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #c084fc)",
                border: "3px solid #c084fc",
                boxShadow: "0 0 18px rgba(192, 132, 252, 0.4)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: "bold"
              }}>
                <span>{accuracy}%</span>
              </div>
              <p style={{ margin: 0 }}>Accuracy</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "#4f46e5", margin: 0 }}>{time}s</h2>
              <p style={{ margin: 0, opacity: 0.8 }}>Time</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ color: "#4f46e5", margin: 0 }}>{steps}</h2>
              <p style={{ margin: 0, opacity: 0.8 }}>Steps</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, padding: 10, borderRadius: 12, background: "#161626", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "#c4b5fd" }}>Player</div><div>{playerName}</div>
            <div style={{ color: "#c4b5fd" }}>Goal</div><div>{goal}</div>
            <div style={{ color: "#c4b5fd" }}>Level</div><div>{playerConfig?.level?.label || gridSize}</div>
            <div style={{ color: "#c4b5fd" }}>Mode</div><div>{mode}</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 14 }}>
          <p style={{ margin: 0 }}><strong>Bombs Used:</strong> {bombsUsed}</p>
          <p style={{ margin: 0 }}><strong>Teleports:</strong> {teleports}</p>
        </div>

        <div style={{ borderTop: "1px solid #2a2a36", paddingTop: 20 }}>
          <div style={{ background: "#0f0f19", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
            <h3 style={{ marginTop: 0 }}>🏆 Top 15 Leaderboard</h3>
            {leaderboard.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 90px 90px 90px", gap: 8, alignItems: "center" }}>
                <div style={{ opacity: 0.8, fontSize: 12 }}>#</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>Player</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>Accuracy</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>Steps</div>
                <div style={{ opacity: 0.8, fontSize: 12 }}>Time</div>
                {leaderboard.map((p, i) => (
                  <Fragment key={i}>
                    <div style={{ color: "#c084fc" }}>{i+1}</div>
                    <div>{p.playerName}</div>
                    <div>{p.accuracy}%</div>
                    <div>{p.steps}</div>
                    <div>{p.time}s</div>
                  </Fragment>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999", margin: 0 }}>No scores yet. Be the first!</p>
            )}
            {myRank && (
              <p style={{ marginTop: 12, color: "#c4b5fd" }}>Your rank: <strong>{myRank.rank}</strong> / {myRank.total || "?"}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
