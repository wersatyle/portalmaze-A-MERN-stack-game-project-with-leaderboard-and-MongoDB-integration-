import { useEffect, useMemo, useState } from "react";
import ResultScreen from "./ResultScreen";

const PORTAL_KEYS = ["A", "B", "C", "D", "E", "F"];
const PORTAL_COLOR_MAP = {
  A: "#fcd34d",
  B: "#38bdf8",
  C: "#34d399",
  D: "#f472b6",
  E: "#a78bfa",
  F: "#f97316"
};

function isReachable(maze, size) {
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const seen = Array.from({ length: size }, () => Array(size).fill(false));
  const queue = [[0,0]];
  seen[0][0] = true;
  while (queue.length) {
    const [r,c] = queue.shift();
    if (maze[r][c] === 'G') return true;
    for (const [dr,dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr<0||nc<0||nr>=size||nc>=size) continue;
      if (seen[nr][nc]) continue;
      if (maze[nr][nc] === '#') continue;
      seen[nr][nc] = true;
      queue.push([nr,nc]);
    }
  }
  return false;
}

function randomCell(taken, size) {
  while (true) {
    const r = Math.floor(Math.random()*size);
    const c = Math.floor(Math.random()*size);
    const key = `${r},${c}`;
    if (!taken.has(key)) return [r,c];
  }
}

function buildPortalMap(maze) {
  const map = {};
  maze.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (PORTAL_KEYS.includes(cell)) {
        if (!map[cell]) map[cell] = [];
        map[cell].push([r, c]);
      }
    });
  });
  return map;
}

function generateMaze(size, wallCount, portalPairs) {
  let last = null;
  for (let attempt = 0; attempt < 80; attempt++) {
    const grid = Array.from({ length: size }, () => Array(size).fill('.'));
    const used = new Set();
    grid[0][0] = 'S';
    used.add('0,0');
    grid[size-1][size-1] = 'G';
    used.add(`${size-1},${size-1}`);

    // portal pairs with matching colors
    for (let i=0; i<portalPairs; i++) {
      const key = PORTAL_KEYS[i % PORTAL_KEYS.length];
      for (let j=0; j<2; j++) {
        const [r,c] = randomCell(used, size);
        grid[r][c] = key;
        used.add(`${r},${c}`);
      }
    }

    // walls
    for (let i=0; i<wallCount; i++) {
      const [r,c] = randomCell(used, size);
      grid[r][c] = '#';
      used.add(`${r},${c}`);
    }

    last = grid;
    if (isReachable(grid, size)) return grid;
  }
  return last || [
    ['S', '.', '#', '.', 'A'],
    ['#', '.', '#', '.', '#'],
    ['.', '.', '.', '.', '.'],
    ['#', '#', '#', '.', 'A'],
    ['.', '.', '.', '.', 'G']
  ];
}

export default function GameScreen({ playerConfig }) {
  const gridSize = useMemo(() => playerConfig.level?.size || 5, [playerConfig]);
  const wallCount = useMemo(() => Math.max(6, Math.floor(gridSize * gridSize * 0.22)), [gridSize]);
  const portalPairs = useMemo(() => (gridSize >= 9 ? 4 : gridSize >= 7 ? 3 : 2), [gridSize]);
  const cellSize = useMemo(() => (gridSize >= 9 ? 44 : gridSize >= 7 ? 52 : 60), [gridSize]);
  const startingBombs = playerConfig.mode === "wall-break" ? 3 : 0;
  const [player, setPlayer] = useState({ r: 0, c: 0 });
  const [steps, setSteps] = useState(0);
  const [bombs, setBombs] = useState(startingBombs);
  const [startTime, setStartTime] = useState(Date.now());
  const [done, setDone] = useState(false);
  const [mazeState, setMazeState] = useState(() => generateMaze(gridSize, wallCount, portalPairs));
  const [showStartHint, setShowStartHint] = useState(true);
  const [teleports, setTeleports] = useState(0);
  const portalMap = useMemo(() => buildPortalMap(mazeState), [mazeState]);

  useEffect(() => {
    const t = setTimeout(() => setShowStartHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setPlayer({ r: 0, c: 0 });
    setSteps(0);
    setBombs(startingBombs);
    setDone(false);
    setStartTime(Date.now());
    setShowStartHint(true);
    setMazeState(generateMaze(gridSize, wallCount, portalPairs));
    setTeleports(0);
  }, [gridSize, wallCount, portalPairs, playerConfig.mode, startingBombs]);

  useEffect(() => {
    const move = e => {
      if (done) return;
      if (e.key === "Enter" || e.key === "NumpadEnter") {
        const cell = mazeState[player.r][player.c];
        const portalHop = portalMap[cell];
        if (portalHop && portalHop.length === 2) {
          const [[r1,c1],[r2,c2]] = portalHop;
          const [tr, tc] = (player.r === r1 && player.c === c1) ? [r2, c2] : [r1, c1];
          setPlayer({ r: tr, c: tc });
          setTeleports(t => t + 1);
          if (mazeState[tr][tc]==='G') setDone(true);
        }
        return;
      }

      const map = { ArrowUp: [-1,0], ArrowDown: [1,0], ArrowLeft: [0,-1], ArrowRight: [0,1] };
      if (!map[e.key]) return;

      const [dr, dc] = map[e.key];
      const nr = player.r + dr;
      const nc = player.c + dc;
      if (nr<0||nc<0||nr>=gridSize||nc>=gridSize) return;

      const targetCell = mazeState[nr][nc];

      if (targetCell==='#') {
        if (e.shiftKey && bombs>0) {
          const newMaze = mazeState.map(row => [...row]);
          newMaze[nr][nc]='.';
          setMazeState(newMaze);
          setBombs(b=>b-1);
        } else return;
      }

      setPlayer({r:nr,c:nc});
      setSteps(s=>s+1);
      if (mazeState[nr][nc]==='G') {
        setDone(true);
      }
    };
    window.addEventListener("keydown", move);
    return ()=>window.removeEventListener("keydown", move);
  }, [player,bombs,done,mazeState,gridSize,portalMap]);

  if (done) {
    return <ResultScreen steps={steps} time={Math.floor((Date.now()-startTime)/1000)} bombsUsed={startingBombs-bombs} teleports={teleports} playerConfig={playerConfig} gridSize={gridSize} />;
  }

  const COLORS = {
    '.': '#fff',
    '#': '#333',
    'S': '#6b21a8',
    'G': '#4c1d95'
  };

  const goalIconMap = {
    money: "💰",
    pet: "🐶",
    girl: "👧",
    success: "🏆",
    career: "💼",
    health: "🧘"
  };
  const goalIcon =
    playerConfig.goal === "girl" && playerConfig.avatar === "girl"
      ? "👦"
      : goalIconMap[playerConfig.goal] || "🎯";
  const avatarIcon = playerConfig.avatar === "girl" ? "👩" : "👨";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#0b0b0f", color: "#e6e6fa" }}>
      <h1 style={{ color: "#e6e6fa", marginBottom: 32 }}>PORTALMAZE - {playerConfig.name}</h1>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gap: 2,
        background: "#ddd",
        padding: 4,
        borderRadius: 8,
        marginBottom: 20
      }}>
        {mazeState.map((row, r) => 
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                width: cellSize,
                height: cellSize,
                background: PORTAL_KEYS.includes(cell) ? PORTAL_COLOR_MAP[cell] : (COLORS[cell] || '#fff'),
                border: "1px solid #999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
                position: "relative"
              }}
            >
              {PORTAL_KEYS.includes(cell) && <span>{cell}</span>}
              {r === player.r && c === player.c && <span>{avatarIcon}</span>}
              {cell === 'G' && <span>{goalIcon}</span>}
              {cell === 'S' && showStartHint && (
                <span className="bounce-arrow" style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)" }}>
                  ⬇️
                </span>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: "center", fontSize: 18 }}>
        <p>Steps: <strong>{steps}</strong></p>
        <p>Bombs Left: <strong>{bombs}</strong></p>
        <p style={{ fontSize: 14, color: "#666" }}>Use Arrow Keys to move | Shift + Arrow to break walls | Enter to teleport when on a portal (teleport is free)</p>
      </div>
    </div>
  );
}
