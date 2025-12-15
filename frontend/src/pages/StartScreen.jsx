import { useEffect, useState } from "react";

const FemaleAvatar = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
    <circle cx="18" cy="18" r="14" fill="#f9d7b3" />
    <path d="M7 17c0-6 4-11 11-11s11 5 11 11v2H7v-2Z" fill="#5b21b6" />
    <circle cx="13" cy="18" r="2" fill="#1f2937" />
    <circle cx="23" cy="18" r="2" fill="#1f2937" />
    <path d="M14 24c1.5 1 6.5 1 8 0" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MaleAvatar = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
    <circle cx="18" cy="18" r="14" fill="#f9d7b3" />
    <path d="M6 16c0-5.5 5-10 12-10s12 4.5 12 10v2H6v-2Z" fill="#312e81" />
    <rect x="9" y="10" width="18" height="6" rx="3" fill="#1f2937" />
    <circle cx="13" cy="18" r="2" fill="#1f2937" />
    <circle cx="23" cy="18" r="2" fill="#1f2937" />
    <path d="M14 24c1.5 1 6.5 1 8 0" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function StartScreen({ onStart }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [mode, setMode] = useState("no-break");
  const [avatar, setAvatar] = useState("girl");
  const [isHovering, setIsHovering] = useState(false);
  const [isNameFocus, setIsNameFocus] = useState(false);

  useEffect(() => {
    if (step < 5) {
      const t = setTimeout(() => setStep(step + 1), 300);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0b0b0f" }}>
      <div style={{ background: "#0b0b0f", padding: 24, borderRadius: 16, width: 360, boxShadow: "0 10px 40px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column", gap: 16, minHeight: 420, justifyContent: "center" }}>

        {step >= 1 && <h1 className="animate-slide-in">PORTALMAZE</h1>}

        {step >= 2 && (
          <input
            className="animate-slide-in"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={() => setIsNameFocus(true)}
            onBlur={() => setIsNameFocus(false)}
            style={{
              width: "100%",
              padding: "14px 16px",
              marginBottom: 20,
              boxSizing: "border-box",
              borderRadius: 12,
              border: isNameFocus ? "2px solid #c4b5fd" : "1px solid #e5e7eb",
              boxShadow: isNameFocus
                ? "0 6px 18px rgba(196, 181, 253, 0.35)"
                : "0 3px 10px rgba(0, 0, 0, 0.06)",
              background: "#111",
              fontSize: 16,
              color: "#e6e6fa",
              transition: "all 0.25s ease"
            }}
          />
        )}

        {step >= 3 && (
          <div className="animate-slide-in" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
            <button 
              onClick={() => setAvatar("girl")}
              style={{ 
                fontSize: "18px", 
                padding: 0,
                width: 72,
                height: 72,
                border: avatar === "girl" ? "2px solid #c4b5fd" : "2px solid rgba(196,181,253,0.25)",
                borderRadius: "50%",
                background: avatar === "girl" ? "rgba(196,181,253,0.12)" : "rgba(196,181,253,0.08)",
                boxShadow: avatar === "girl" ? "0 0 24px rgba(196,181,253,0.55)" : "none",
                color: "#e6e6fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <span style={{ fontSize: 32 }}>👩</span>
            </button>
            <button 
              onClick={() => setAvatar("boy")}
              style={{ 
                fontSize: "18px", 
                padding: 0,
                width: 72,
                height: 72,
                border: avatar === "boy" ? "2px solid #c4b5fd" : "2px solid rgba(196,181,253,0.25)",
                borderRadius: "50%",
                background: avatar === "boy" ? "rgba(196,181,253,0.12)" : "rgba(196,181,253,0.08)",
                boxShadow: avatar === "boy" ? "0 0 24px rgba(196,181,253,0.55)" : "none",
                color: "#e6e6fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <span style={{ fontSize: 32 }}>👨</span>
            </button>
          </div>
        )}

        {step >= 4 && (
          <div className="animate-slide-in" style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 16 }}>
            <button 
              onClick={() => setMode("no-break")}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                border: mode === "no-break" ? "3px solid #6b21a8" : "2px solid #000",
                borderRadius: "8px",
                background: mode === "no-break" ? "#6b21a8" : "#fff",
                color: mode === "no-break" ? "#e6e6fa" : "#000",
                cursor: "pointer"
              }}
            >
              No Break
            </button>
            <button 
              onClick={() => setMode("wall-break")}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                border: mode === "wall-break" ? "3px solid #6b21a8" : "2px solid #000",
                borderRadius: "8px",
                background: mode === "wall-break" ? "#6b21a8" : "#fff",
                color: mode === "wall-break" ? "#e6e6fa" : "#000",
                cursor: "pointer"
              }}
            >
              Wall Break
            </button>
          </div>
        )}

        {step >= 5 && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <button
              className="animate-slide-in"
              disabled={!name}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onClick={() => {
                localStorage.setItem("playerName", name);
                onStart({ name, mode, avatar });
              }}
              style={{
                padding: "14px 32px",
                fontSize: "18px",
                fontWeight: "bold",
                border: "none",
                borderRadius: "8px",
                background: name ? "#6b21a8" : "#444",
                color: "#e6e6fa",
                cursor: name ? "pointer" : "not-allowed",
                transition: "all 0.3s",
                transform: name && isHovering ? "scale(1.05)" : "scale(1)",
                boxShadow: name && isHovering
                  ? "0 0 28px rgba(76, 29, 149, 0.8), 0 0 12px rgba(107, 33, 168, 0.6)"
                  : "0 3px 10px rgba(0, 0, 0, 0.35)"
              }}
            >
              START GAME
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
