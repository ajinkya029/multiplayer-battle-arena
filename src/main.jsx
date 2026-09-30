import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Crosshair, Crown, Flame, Gamepad2, Heart, Menu, MessageCircle,
  Minus, Plus, Shield, Swords, Trophy, Users, Zap, X
} from "lucide-react";
import "./styles.css";

const heroes = [
  { id: "vex", name: "Vex", role: "Duelist", level: 24, color: "#8b5cf6", hp: 92, mana: 78, weapon: "Void Blade", emoji: "⚔️" },
  { id: "nova", name: "Nova", role: "Ranger", level: 21, color: "#22d3ee", hp: 81, mana: 94, weapon: "Star Bow", emoji: "🏹" },
  { id: "brakk", name: "Brakk", role: "Tank", level: 27, color: "#f97316", hp: 98, mana: 52, weapon: "Titan Hammer", emoji: "🔨" },
  { id: "lyra", name: "Lyra", role: "Support", level: 23, color: "#ec4899", hp: 88, mana: 100, weapon: "Pulse Staff", emoji: "✨" }
];

const initialPlayers = [
  { name: "Vex", team: "blue", hero: "vex", kills: 8, deaths: 2, assists: 5, alive: true },
  { name: "Nova", team: "blue", hero: "nova", kills: 5, deaths: 4, assists: 9, alive: true },
  { name: "Brakk", team: "red", hero: "brakk", kills: 7, deaths: 6, assists: 3, alive: true },
  { name: "Lyra", team: "red", hero: "lyra", kills: 4, deaths: 7, assists: 11, alive: true }
];

function App() {
  const [activeTab, setActiveTab] = useState("arena");
  const [players, setPlayers] = useState(initialPlayers);
  const [messages, setMessages] = useState([
    ["System", "Match started. Good luck, warriors!", "system"],
    ["Nova", "Push mid after the next wave.", "blue"],
    ["Brakk", "I'm rotating top.", "red"]
  ]);
  const [chat, setChat] = useState("");
  const [seconds, setSeconds] = useState(12 * 60 + 42);
  const [score, setScore] = useState({ blue: 1240, red: 1175 });
  const [energy, setEnergy] = useState(68);
  const [flash, setFlash] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const blueKills = players.filter(p => p.team === "blue").reduce((a,p) => a + p.kills, 0);
  const redKills = players.filter(p => p.team === "red").reduce((a,p) => a + p.kills, 0);

  function attack() {
    if (energy < 15) return;
    setEnergy(e => e - 15);
    setFlash(true);
    setScore(s => ({ ...s, blue: s.blue + 25 }));
    setPlayers(ps => ps.map(p => p.name === "Vex" ? { ...p, kills: p.kills + 1 } : p));
    setMessages(m => [...m.slice(-4), ["You", "⚡ Void Strike landed! +25 score", "blue"]]);
    setTimeout(() => setFlash(false), 260);
  }

  function useAbility() {
    if (energy < 30) return;
    setEnergy(e => e - 30);
    setScore(s => ({ ...s, blue: s.blue + 45 }));
    setMessages(m => [...m.slice(-4), ["You", "🔥 Ultimate ability activated!", "blue"]]);
  }

  function sendChat(e) {
    e?.preventDefault();
    if (!chat.trim()) return;
    setMessages(m => [...m.slice(-4), ["You", chat.trim(), "blue"]]);
    setChat("");
  }

  const leaderboard = useMemo(() =>
    [...players].sort((a,b) => (b.kills * 3 + b.assists) - (a.kills * 3 + a.assists)), [players]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><Swords size={22}/></div><div><b>BATTLE ARENA</b><span>NEON FRONTIER</span></div></div>
        <nav className="nav">
          {["arena", "leaderboard", "profile"].map(tab => (
            <button key={tab} className={activeTab === tab ? "nav-btn active" : "nav-btn"} onClick={() => setActiveTab(tab)}>
              {tab === "arena" ? <Gamepad2 size={17}/> : tab === "leaderboard" ? <Trophy size={17}/> : <Users size={17}/>}
              {tab}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <div className="online"><i/> 1,284 ONLINE</div>
          <button className="icon-btn" onClick={() => setMenu(!menu)}><Menu size={20}/></button>
        </div>
      </header>

      {menu && <div className="mobile-menu"><button onClick={() => setMenu(false)}><X size={16}/> Close</button><span>Server: NA-East</span><span>Ping: 42ms</span></div>}

      {activeTab === "arena" && (
        <main className="arena-layout">
          <aside className="left-panel">
            <section className="panel match-panel">
              <div className="panel-head"><span>MATCH</span><span className="live">LIVE</span></div>
              <div className="match-mode"><div className="mode-icon"><Crosshair/></div><div><b>DOMINATION</b><small>4v4 • Ranked</small></div></div>
              <div className="match-time"><small>TIME REMAINING</small><strong>{time}</strong></div>
              <div className="scoreboard">
                <div><span className="blue-dot"/> <b>{score.blue}</b><small>BLUE</small></div>
                <div className="vs">VS</div>
                <div><span className="red-dot"/> <b>{score.red}</b><small>RED</small></div>
              </div>
              <div className="objective"><span>OBJECTIVE</span><b>Capture and hold all zones</b><div className="progress"><i style={{width: `${Math.min(100, 38 + (score.blue-score.red)/10)}%`}}/></div></div>
            </section>

            <section className="panel squad">
              <div className="panel-head"><span>YOUR SQUAD</span><span>{players.filter(p=>p.team==="blue").length}/4</span></div>
              {players.filter(p => p.team === "blue").map(p => <PlayerRow key={p.name} p={p}/>)}
            </section>

            <section className="panel controls">
              <div className="panel-head"><span>CONTROLS</span></div>
              <div className="control-row"><kbd>W A S D</kbd><span>Move</span></div>
              <div className="control-row"><kbd>SPACE</kbd><span>Dash</span></div>
              <div className="control-row"><kbd>Q</kbd><span>Ability</span></div>
              <div className="control-row"><kbd>R</kbd><span>Reload</span></div>
            </section>
          </aside>

          <section className="battlefield-wrap">
            <div className="battlefield">
              <div className="arena-grid"/>
              <div className="arena-glow"/>
              <div className="zone zone-a"><span>A</span></div>
              <div className="zone zone-b"><span>B</span></div>
              <div className="zone zone-c"><span>C</span></div>
              <div className="obstacle o1"/><div className="obstacle o2"/><div className="obstacle o3"/>
              <div className={`hero-token player ${flash ? "hit" : ""}`}><span>⚔</span><label>VEX</label><div className="mini-hp"><i style={{width:"82%"}}/></div></div>
              <div className="hero-token enemy e1"><span>🔨</span><label>BRAKK</label><div className="mini-hp"><i style={{width:"61%"}}/></div></div>
              <div className="hero-token enemy e2"><span>✨</span><label>LYRA</label><div className="mini-hp"><i style={{width:"44%"}}/></div></div>
              <div className="projectile p1"/>
              <div className="crosshair-target">+</div>
              <div className="battle-toast">ZONE B CONTESTED</div>
              <div className="minimap"><div className="mm-grid"/><i className="mm-player"/><i className="mm-enemy e"/><i className="mm-zone z1"/><i className="mm-zone z2"/></div>
              <div className="combat-hud">
                <div className="hud-hero"><div className="portrait">⚔️</div><div><b>VEX</b><small>LEVEL 24 • DUELIST</small><div className="bars"><i className="hp"/><i className="mana" style={{width:`${energy}%`}}/></div></div></div>
                <div className="abilities">
                  <button className="ability" onClick={attack}><span>⚡</span><kbd>LMB</kbd></button>
                  <button className="ability" onClick={useAbility}><span>🔥</span><kbd>Q</kbd></button>
                  <button className="ability"><span>🛡️</span><kbd>E</kbd></button>
                  <button className="ability"><span>💨</span><kbd>SPACE</kbd></button>
                </div>
                <div className="ammo"><b>24</b><span>/ 96</span><small>VOID BLADE</small></div>
              </div>
            </div>
          </section>

          <aside className="right-panel">
            <section className="panel enemy-panel">
              <div className="panel-head"><span>ENEMY SQUAD</span><span>4/4</span></div>
              {players.filter(p => p.team === "red").map(p => <PlayerRow key={p.name} p={p}/>)}
            </section>

            <section className="panel feed">
              <div className="panel-head"><span>COMBAT FEED</span><Flame size={15}/></div>
              <div className="feed-item"><b>VEX</b><span>eliminated</span><b className="red-txt">RAIDER</b><em>+100</em></div>
              <div className="feed-item"><b className="red-txt">BRAKK</b><span>eliminated</span><b>NOVA</b><em>+100</em></div>
              <div className="feed-item"><b>NOVA</b><span>captured</span><b className="zone-txt">ZONE C</b><em>+50</em></div>
            </section>

            <section className="panel chat-panel">
              <div className="panel-head"><span>TEAM CHAT</span><MessageCircle size={15}/></div>
              <div className="messages">{messages.map((m,i) => <div className={`message ${m[2]}`} key={i}><b>{m[0]}</b><span>{m[1]}</span></div>)}</div>
              <form onSubmit={sendChat} className="chat-form"><input value={chat} onChange={e=>setChat(e.target.value)} placeholder="Press Enter to chat..."/><button>➤</button></form>
            </section>

            <section className="panel tips"><div><Zap size={15}/><b>TIP</b></div><span>Use abilities together with your squad to secure objectives.</span></section>
          </aside>
        </main>
      )}

      {activeTab === "leaderboard" && <Leaderboard leaderboard={leaderboard} />}
      {activeTab === "profile" && <Profile />}
    </div>
  );
}

function PlayerRow({p}) {
  const hero = heroes.find(h => h.id === p.hero);
  return <div className="player-row">
    <div className="avatar" style={{borderColor: hero.color}}>{hero.emoji}</div>
    <div className="player-name"><b>{p.name}</b><small>{hero.role} • LVL {hero.level}</small></div>
    <div className="kda"><b>{p.kills}/{p.deaths}</b><small>{p.assists} AST</small></div>
    <span className={`status ${p.alive ? "alive" : ""}`}/>
  </div>
}

function Leaderboard({leaderboard}) {
  return <main className="standalone"><div className="standalone-head"><div><span className="eyebrow">RANKED SEASON 08</span><h1>LEADERBOARD</h1><p>Live match performance across the current arena.</p></div><div className="rank-card"><Crown/><b>#127</b><span>YOUR RANK</span></div></div>
    <div className="leader-table panel">{leaderboard.map((p,i)=><div className="leader-line" key={p.name}><strong>#{i+1}</strong><PlayerRow p={p}/><div className="stat"><b>{p.kills*3+p.assists}</b><small>PTS</small></div></div>)}</div>
  </main>
}

function Profile() {
  return <main className="standalone profile-page"><span className="eyebrow">PLAYER PROFILE</span><h1>VEX</h1><div className="profile-grid"><div className="profile-card panel"><div className="big-avatar">⚔️</div><h2>VEX</h2><p>Void Duelist</p><div className="xp"><span>LEVEL 24</span><b>7,420 / 9,000 XP</b><i><em/></i></div></div><div className="profile-card panel"><h3>SEASON STATS</h3><div className="stat-grid"><div><b>68</b><span>WINS</span></div><div><b>1.84</b><span>K/D</span></div><div><b>72%</b><span>OBJECTIVE</span></div><div><b>2,418</b><span>RATING</span></div></div></div></div></main>
}

createRoot(document.getElementById("root")).render(<App />);
