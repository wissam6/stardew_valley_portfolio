'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Volume2, VolumeX } from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin, FaYoutube as Youtube, FaInstagram as Instagram } from 'react-icons/fa';

// ── SOUND ENGINE ──────────────────────────────────────────────────────────────
class SoundEngine {
  ctx: AudioContext | null = null;
  muted = false;
  setMuted(m: boolean) { this.muted = m; }
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  beep(freq: number, dur: number, type: OscillatorType = 'square', vol = 0.07) {
    if (this.muted || !this.ctx) return;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g); g.connect(this.ctx.destination);
    o.start(); o.stop(this.ctx.currentTime + dur);
  }
  hover() { this.beep(880, 0.05, 'square', 0.04); }
  click() { this.beep(660, 0.08); setTimeout(() => this.beep(990, 0.1), 60); }
  harvest() { this.beep(523, 0.08); setTimeout(() => this.beep(659, 0.08), 80); setTimeout(() => this.beep(784, 0.12), 160); }
  mailbox() { this.beep(440, 0.1, 'triangle', 0.1); setTimeout(() => this.beep(330, 0.15, 'triangle', 0.08), 100); }
}
const S = new SoundEngine();

// ── PIXEL SPRITES ─────────────────────────────────────────────────────────────
const Character = () => (
  <svg viewBox="0 0 16 20" width="56" height="70" style={{ imageRendering: 'pixelated' }} shapeRendering="crispEdges">
    <rect x="4" y="0" width="8" height="2" fill="#3a2818" />
    <rect x="3" y="2" width="10" height="1" fill="#3a2818" />
    <rect x="4" y="3" width="8" height="2" fill="#5a3a1a" />
    <rect x="5" y="4" width="6" height="3" fill="#f4c896" />
    <rect x="6" y="5" width="1" height="1" fill="#000" />
    <rect x="9" y="5" width="1" height="1" fill="#000" />
    <rect x="4" y="7" width="8" height="5" fill="#3a6ea5" />
    <rect x="5" y="8" width="6" height="3" fill="#4a8ed5" />
    <rect x="3" y="8" width="1" height="3" fill="#f4c896" />
    <rect x="12" y="8" width="1" height="3" fill="#f4c896" />
    <rect x="4" y="12" width="8" height="4" fill="#2a4a7a" />
    <rect x="4" y="16" width="3" height="3" fill="#3a2818" />
    <rect x="9" y="16" width="3" height="3" fill="#3a2818" />
  </svg>
);

const Tree = ({ s = 1 }) => (
  <svg viewBox="0 0 16 24" width={28 * s} height={42 * s} style={{ imageRendering: 'pixelated' }} shapeRendering="crispEdges">
    <rect x="7" y="16" width="2" height="8" fill="#5a3a1a" />
    <rect x="6" y="18" width="1" height="6" fill="#3a2410" />
    <rect x="5" y="2" width="6" height="2" fill="#2d5a2d" />
    <rect x="3" y="4" width="10" height="4" fill="#3a7a3a" />
    <rect x="2" y="8" width="12" height="6" fill="#2d5a2d" />
    <rect x="4" y="14" width="8" height="2" fill="#1a3a1a" />
    <rect x="4" y="6" width="2" height="2" fill="#5aaa5a" />
    <rect x="6" y="10" width="2" height="2" fill="#5aaa5a" />
  </svg>
);

const Crop = ({ color = '#e85a5a' }) => (
  <svg viewBox="0 0 16 16" width="40" height="40" style={{ imageRendering: 'pixelated' }} shapeRendering="crispEdges">
    <rect x="2" y="13" width="12" height="3" fill="#5a3a1a" />
    <rect x="2" y="12" width="12" height="1" fill="#7a4a2a" />
    <rect x="7" y="6" width="2" height="7" fill="#3a7a3a" />
    <rect x="4" y="8" width="3" height="2" fill="#3a7a3a" />
    <rect x="9" y="8" width="3" height="2" fill="#3a7a3a" />
    <rect x="5" y="3" width="6" height="5" fill={color} />
    <rect x="6" y="2" width="4" height="1" fill={color} />
    <rect x="6" y="4" width="1" height="1" fill="#fff" opacity="0.5" />
  </svg>
);

const House = () => (
  <svg viewBox="0 0 32 28" width="140" height="122" style={{ imageRendering: 'pixelated' }} shapeRendering="crispEdges">
    <rect x="4" y="6" width="24" height="2" fill="#8a2525" />
    <rect x="2" y="8" width="28" height="2" fill="#a83535" />
    <rect x="0" y="10" width="32" height="2" fill="#c44545" />
    <rect x="22" y="2" width="3" height="6" fill="#5a3a1a" />
    <rect x="2" y="12" width="28" height="14" fill="#e8c468" />
    <rect x="2" y="12" width="28" height="1" fill="#f5dc8a" />
    <rect x="14" y="18" width="5" height="8" fill="#5a3a1a" />
    <rect x="17" y="22" width="1" height="1" fill="#e8c468" />
    <rect x="5" y="15" width="5" height="5" fill="#7ab8d5" />
    <rect x="22" y="15" width="5" height="5" fill="#7ab8d5" />
    <rect x="7" y="15" width="1" height="5" fill="#5a3a1a" />
    <rect x="5" y="17" width="5" height="1" fill="#5a3a1a" />
    <rect x="24" y="15" width="1" height="5" fill="#5a3a1a" />
    <rect x="22" y="17" width="5" height="1" fill="#5a3a1a" />
  </svg>
);

const Cloud = ({ style }: { style?: React.CSSProperties }) => (
  <svg viewBox="0 0 24 12" width="80" height="40" style={{ imageRendering: 'pixelated', ...style }} shapeRendering="crispEdges">
    <rect x="4" y="4" width="16" height="6" fill="#fff" opacity="0.9" />
    <rect x="2" y="6" width="20" height="4" fill="#fff" opacity="0.9" />
    <rect x="6" y="2" width="10" height="4" fill="#fff" opacity="0.9" />
    <rect x="10" y="0" width="6" height="4" fill="#fff" opacity="0.9" />
  </svg>
);

const Mailbox = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 16 24" width="72" height="108" style={{ imageRendering: 'pixelated' }} shapeRendering="crispEdges">
    <rect x="7" y="14" width="2" height="10" fill="#5a3a1a" />
    <rect x="2" y="6" width="12" height="8" fill="#c44545" />
    <rect x="2" y="6" width="12" height="1" fill="#e85a5a" />
    <rect x="2" y="13" width="12" height="1" fill="#8a2525" />
    {open ? (<><rect x="3" y="7" width="10" height="6" fill="#1a1a1a" /><rect x="4" y="8" width="8" height="4" fill="#f4e4bc" /></>) : (<><rect x="3" y="7" width="10" height="6" fill="#a83535" /><rect x="11" y="9" width="1" height="2" fill="#e8c468" /></>)}
    <rect x="14" y="7" width="1" height="4" fill={open ? '#5aaa5a' : '#e85a5a'} />
    <rect x="14" y="7" width="2" height="2" fill={open ? '#5aaa5a' : '#e85a5a'} />
  </svg>
);

// ── UI COMPONENTS ─────────────────────────────────────────────────────────────
const DialogueBox = ({ children, title, className = '' }: { children: React.ReactNode; title?: string; className?: string }) => (
  <div className={`relative ${className}`} style={{ background: '#f4e4bc', border: '4px solid #8b5a2b', boxShadow: 'inset 0 0 0 2px #d4b483, 4px 4px 0 #4a2c14', padding: '16px 18px' }}>
    {title && <div className="absolute -top-4 left-3 px-2 py-1 text-white" style={{ background: '#8b5a2b', border: '2px solid #4a2c14', fontSize: '9px', fontFamily: "'Press Start 2P', monospace" }}>{title}</div>}
    {children}
  </div>
);

const PBtn = ({ children, onClick, href, gold }: { children: React.ReactNode; onClick?: () => void; href?: string; gold?: boolean }) => {
  const [p, setP] = useState(false);
  const bg = gold ? '#e8c468' : '#c97a3e';
  const dk = gold ? '#a8853c' : '#8a4a1f';
  const lt = gold ? '#f5dc8a' : '#e29960';
  const handle = () => { S.click(); setP(true); setTimeout(() => setP(false), 100); onClick?.(); };
  const style: React.CSSProperties = {
    background: bg,
    boxShadow: p ? `inset 2px 2px 0 ${dk}, inset -2px -2px 0 ${lt}` : `inset 2px 2px 0 ${lt}, inset -2px -2px 0 ${dk}, 0 4px 0 ${dk}`,
    transform: p ? 'translateY(2px)' : 'none',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '9px',
    color: '#fff',
    padding: '10px 16px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: 'none',
    whiteSpace: 'nowrap',
  };
  const btn = <button onClick={handle} onMouseEnter={() => S.hover()} style={style}>{children}</button>;
  return href ? <a href={href} target="_blank" rel="noopener noreferrer">{btn}</a> : btn;
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const skills = [
  { icon: '🌾', name: 'Python' }, { icon: '🪓', name: 'PyTorch' }, { icon: '⚒️', name: 'LLMs' },
  { icon: '🔧', name: 'Docker' }, { icon: '⚡', name: 'Next.js' }, { icon: '🌱', name: 'NLP' },
  { icon: '🎯', name: 'RL' }, { icon: '🧪', name: 'HuggingFace' },
];

const projects = [
  { title: 'LLM Robot Control', desc: 'Quantized LLM on Jetson Orin controlling a physical robot via image + ultrasonic input. Commands dispatched to Arduino via REST API.', tags: ['Edge AI', 'LLM'], color: '#e85a5a', gh: 'https://github.com/wissam6' },
  { title: 'Multi-Agent LLM Thesis', desc: 'State-based protocols preventing debate loops in multi-agent LLM workflows. Research on convergence efficiency and token cost.', tags: ['Research', 'LLM'], color: '#9b59b6', gh: 'https://github.com/wissam6' },
  { title: 'DQN Lunar Lander', desc: 'Deep Q-Network variants on Gymnasium LunarLander-v3, analysing convergence and stability across hyperparameter settings.', tags: ['RL', 'PyTorch'], color: '#f39c12', gh: 'https://github.com/wissam6/DeepQN_LunarLander' },
  { title: 'Enthymeme Reconstruction', desc: 'Fine-tuned BERT + prompted LLMs with CoT to reconstruct missing premises in argumentative text.', tags: ['NLP', 'LLM'], color: '#3498db', gh: 'https://github.com/wissam6/Enthymemes-RP1' },
  { title: 'COMPAS XAI Audit', desc: 'SHAP/LIME analysis on a recidivism prediction model — surfaced fairness and interpretability concerns.', tags: ['XAI'], color: '#2ecc71', gh: 'https://github.com/wissam6/Crew6' },
  { title: 'Fianco AI', desc: 'NegaMax + alpha-beta pruning + transposition table for the board game Fianco. Built for Intelligent Search & Games course.', tags: ['Search', 'Java'], color: '#e67e22', gh: 'https://github.com/wissam6/fianco-ai-game' },
];

const experience = [
  { role: 'LLM Engineer Intern', company: 'Conclusion Intelligence (Mediaan)', date: 'Sep 2025 – Jan 2026', desc: 'Benchmarked AWQ / GPTQ / GGUF quantization, extended context via KV-cache quant, built runtime Docker deployment pipeline.' },
  { role: 'Developer Support Engineer II', company: 'Progress Software', date: 'Nov 2022 – Jul 2024', desc: 'Resolved 1,600+ enterprise tickets. Led Next.js × KendoReact integration, wrote the public blog post, coached an intern.' },
  { role: 'Teaching Assistant', company: 'Maastricht University', date: 'Sep 2024 – Sep 2025', desc: 'TA for BSc CS labs (OOP, Data Structures, IT Management). Student ambassador for MSc AI program.' },
];

// ── APP ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [mailOpen, setMailOpen] = useState(false);
  const [selProj, setSelProj] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const mutedRef = useRef(muted);

  useEffect(() => { S.setMuted(muted); mutedRef.current = muted; }, [muted]);

  useEffect(() => {
    if (!started) return;
    const initPlayer = () => {
      if (ytPlayerRef.current) return;
      ytPlayerRef.current = new (window as any).YT.Player('yt-bg-player', {
        width: 1, height: 1,
        videoId: 'UKZF5k5cqOs',
        playerVars: { autoplay: 1, loop: 1, playlist: 'UKZF5k5cqOs', controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3 },
        events: {
          onReady: (e: any) => { e.target.setVolume(25); e.target.playVideo(); if (mutedRef.current) e.target.mute(); },
        },
      });
    };
    if (typeof (window as any).YT?.Player === 'function') {
      initPlayer();
    } else {
      const prev = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => { prev?.(); initPlayer(); };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }
    return () => { ytPlayerRef.current?.destroy(); ytPlayerRef.current = null; };
  }, [started]);

  useEffect(() => {
    if (!ytPlayerRef.current) return;
    if (muted) ytPlayerRef.current.mute(); else ytPlayerRef.current.unMute();
  }, [muted]);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
    .fp { font-family: 'Press Start 2P', monospace; }
    .fb { font-family: 'VT323', monospace; font-size: clamp(16px, 2.5vw, 20px); line-height: 1.5; }
    @keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    .bob { animation: bob 1.4s ease-in-out infinite; }
    @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
    .blink { animation: blink 1s steps(2) infinite; }
    @keyframes drift { from{transform:translateX(-120px)} to{transform:translateX(calc(100vw + 120px))} }
    .d1 { animation: drift 40s linear infinite; }
    .d2 { animation: drift 60s linear infinite -25s; }
    @keyframes sway { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
    .sway { animation: sway 3s ease-in-out infinite; transform-origin: bottom center; }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    .fadeUp { animation: fadeUp 0.4s ease-out; }
    @keyframes ff { 0%,100%{opacity:.3;transform:translate(0,0)} 33%{opacity:1;transform:translate(18px,-14px)} 66%{opacity:.6;transform:translate(-10px,-28px)} }
    .ff { animation: ff 6s ease-in-out infinite; }
    ::-webkit-scrollbar{width:10px}
    ::-webkit-scrollbar-track{background:#5a3a1a}
    ::-webkit-scrollbar-thumb{background:#c97a3e;border:2px solid #8a4a1f}
    .crop-card:hover{transform:scale(1.06) translateY(-2px)}
    .crop-card{transition:transform .15s}
  `;

  if (!started) return (
    <div className="fp w-full h-screen flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#87ceeb 0%,#a8d8a8 60%,#5a9a5a 100%)' }}
      onClick={() => { S.init(); S.click(); setStarted(true); }}>
      <style>{CSS}</style>
      <div className="d1 absolute top-8 left-0"><Cloud /></div>
      <div className="d2 absolute top-24 left-0"><Cloud /></div>
      <div className="absolute bottom-10 left-3 sway"><Tree s={2} /></div>
      <div className="absolute bottom-10 right-3 sway" style={{ animationDelay: '.6s' }}><Tree s={2.5} /></div>
      <div className="relative z-10 text-center px-4">
        <div className="bob flex justify-center mb-6"><Character /></div>
        <div style={{ fontSize: 'clamp(18px,5vw,32px)', color: '#fff', textShadow: '3px 3px 0 #3a2818', marginBottom: 8 }}>WISSAM MERHI</div>
        <div style={{ fontSize: 'clamp(8px,2vw,11px)', color: '#ffe', textShadow: '2px 2px 0 #3a2818', marginBottom: 32 }}>~ A Stardew Portfolio ~</div>
        <div className="blink" style={{ fontSize: 'clamp(7px,1.8vw,10px)', color: '#fff', textShadow: '2px 2px 0 #3a2818' }}>▶ Click anywhere to begin ◀</div>
      </div>
    </div>
  );

  return (
    <div ref={scrollRef} className="fp w-full h-screen overflow-y-auto overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
      <style>{CSS}</style>
      <div id="yt-bg-player" style={{ position: 'fixed', bottom: -10, left: -10, width: 1, height: 1, pointerEvents: 'none' }} />

      {/* MUTE */}
      <button onClick={() => { S.click(); setMuted(!muted); }} className="fixed top-3 right-3 z-50 p-2 text-white"
        style={{ background: '#8b5a2b', border: '3px solid #4a2c14', boxShadow: 'inset 2px 2px 0 #c97a3e', lineHeight: 0 }}>
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center px-4 py-16 text-center overflow-hidden"
        style={{ minHeight: '100svh', background: 'linear-gradient(180deg,#87ceeb 0%,#a8d8a8 65%,#5a9a5a 100%)' }}>
        <div className="d1 absolute top-8 left-0"><Cloud /></div>
        <div className="d2 absolute top-24 left-0"><Cloud /></div>
        <div className="absolute bottom-8 left-2 sway"><Tree s={2} /></div>
        <div className="absolute bottom-8 right-2 sway" style={{ animationDelay: '.7s' }}><Tree s={2} /></div>
        <div className="relative z-10 w-full max-w-lg mx-auto">
          <div className="bob flex justify-center mb-5"><Character /></div>
          <div style={{ fontSize: 'clamp(16px,5vw,28px)', color: '#fff', textShadow: '3px 3px 0 #3a2818', marginBottom: 6 }}>WISSAM MERHI</div>
          <div style={{ fontSize: 'clamp(7px,2vw,10px)', color: '#ffe', textShadow: '2px 2px 0 #3a2818', marginBottom: 24 }}>~ Applied AI & LLM Engineer ~</div>
          <DialogueBox title="Wissam">
            <p className="fb text-stone-800">Welcome to my farm! I grow AI projects, harvest insights from large language models, and tend to a field of side experiments. Scroll down to look around. 🌾</p>
          </DialogueBox>
          <div className="blink mt-8" style={{ fontSize: 'clamp(7px,1.8vw,10px)', color: '#fff', textShadow: '2px 2px 0 #3a2818' }}>▼ Scroll ▼</div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="py-16 px-4" style={{ background: '#7aa55a' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10" style={{ fontSize: 'clamp(11px,3vw,18px)', color: '#fff', textShadow: '3px 3px 0 #3a2818' }}>🪓 The Tool Shed 🪓</div>
          <DialogueBox title="Skills">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {skills.map((sk, i) => (
                <div key={i} onMouseEnter={() => S.hover()} className="text-center p-2 cursor-default" style={{ background: '#e8c468', border: '3px solid #8b5a2b', boxShadow: 'inset 2px 2px 0 #f5dc8a,inset -2px -2px 0 #a8853c' }}>
                  <div style={{ fontSize: 'clamp(18px,4vw,28px)' }}>{sk.icon}</div>
                  <div style={{ fontSize: 'clamp(6px,1.5vw,9px)', color: '#4a2c14', marginTop: 4, wordBreak: 'break-word' }}>{sk.name}</div>
                </div>
              ))}
            </div>
          </DialogueBox>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section className="py-16 px-4" style={{ background: '#c4905a' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10" style={{ fontSize: 'clamp(11px,3vw,18px)', color: '#fff', textShadow: '3px 3px 0 #3a2818' }}>📜 The Journal 📜</div>
          <div className="flex flex-col gap-6">
            {experience.map((e, i) => (
              <DialogueBox key={i} title={e.date}>
                <div style={{ fontSize: 'clamp(8px,2vw,11px)', color: '#3a2010', marginBottom: 6 }}>{e.role}</div>
                <div className="fb italic text-stone-600 mb-2">@ {e.company}</div>
                <p className="fb text-stone-800">{e.desc}</p>
              </DialogueBox>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section className="py-16 px-4 relative" style={{ background: '#8b5a2b' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-3" style={{ fontSize: 'clamp(11px,3vw,18px)', color: '#fff', textShadow: '3px 3px 0 #3a2818' }}>🌾 The Crop Field 🌾</div>
          <div className="fb text-center text-yellow-100 mb-8">~ Tap a crop to harvest its details ~</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {projects.map((p, i) => (
              <div key={i} className="crop-card cursor-pointer text-center p-3"
                onClick={() => { S.harvest(); setSelProj(i); }}
                onMouseEnter={() => S.hover()}
                style={{ background: '#5a3a1a', border: '4px solid #3a2410', boxShadow: 'inset 2px 2px 0 #7a4a2a' }}>
                <div className="flex justify-center mb-2"><Crop color={p.color} /></div>
                <div style={{ fontSize: 'clamp(6px,1.5vw,9px)', color: '#f5dc8a', marginBottom: 6, minHeight: 28, wordBreak: 'break-word' }}>{p.title}</div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {p.tags.map((t, j) => <span key={j} className="text-white" style={{ background: p.color, fontSize: '7px', padding: '2px 5px', fontFamily: "'Press Start 2P',monospace" }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selProj !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 fadeUp" style={{ background: 'rgba(0,0,0,.75)' }} onClick={() => setSelProj(null)}>
            <div className="w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <DialogueBox title={projects[selProj].title}>
                <div className="flex justify-center mb-3"><Crop color={projects[selProj].color} /></div>
                <p className="fb text-stone-800 mb-4">{projects[selProj].desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {projects[selProj].tags.map((t, j) => <span key={j} className="text-white" style={{ background: projects[selProj].color, fontSize: '8px', padding: '3px 7px', fontFamily: "'Press Start 2P',monospace" }}>{t}</span>)}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <PBtn href={projects[selProj].gh}>⛏ GitHub</PBtn>
                  <PBtn onClick={() => setSelProj(null)}>Close</PBtn>
                </div>
              </DialogueBox>
            </div>
          </div>
        )}
      </section>

      {/* ── ABOUT ── */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(180deg,#a8d8a8 0%,#7aa55a 100%)' }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10" style={{ fontSize: 'clamp(11px,3vw,18px)', color: '#fff', textShadow: '3px 3px 0 #3a2818' }}>🏡 The Farmhouse 🏡</div>
          <div className="flex justify-center mb-6 sway"><House /></div>
          <DialogueBox title="About Me">
            <p className="fb text-stone-800 mb-3">MSc AI student at Maastricht University, currently doing my thesis on multi-agent LLM coordination protocols — basically making AI agents stop arguing with each other.</p>
            <p className="fb text-stone-800 mb-3">Before this, 2+ years at Progress Software shipping developer tooling — resolved 1,600+ enterprise tickets and led the Next.js × KendoReact integration.</p>
            <p className="fb text-stone-800">Outside work: gym, content creation, and yes, actual Stardew Valley. 🌾</p>
          </DialogueBox>
        </div>
      </section>

      {/* ── SOCIALS ── */}
      <section className="py-16 px-4 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#2a3a6a 0%,#1a2a4a 100%)' }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="ff absolute w-1.5 h-1.5 rounded-full bg-yellow-200"
            style={{ left: `${8 + i * 12}%`, top: `${15 + (i % 4) * 18}%`, animationDelay: `${i * .8}s`, boxShadow: '0 0 6px #fff5a8' }} />
        ))}
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-10" style={{ fontSize: 'clamp(11px,3vw,18px)', color: '#fff', textShadow: '3px 3px 0 #3a2818' }}>✉️ The Mailbox ✉️</div>
          <div className="flex justify-center mb-6">
            <div className="cursor-pointer" style={{ transition: 'transform .15s' }}
              onMouseEnter={e => { S.hover(); (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              onClick={() => { S.mailbox(); setMailOpen(!mailOpen); }}>
              <Mailbox open={mailOpen} />
            </div>
          </div>

          {!mailOpen && (
            <div className="blink text-center" style={{ fontSize: 'clamp(7px,1.8vw,10px)', color: '#ffe', textShadow: '2px 2px 0 #3a2818' }}>▶ Click the mailbox ◀</div>
          )}

          {mailOpen && (
            <div className="fadeUp">
              <DialogueBox title="You've got mail!">
                <p className="fb text-stone-800 text-center mb-5">Let's connect — find me here:</p>
                <div className="grid grid-cols-2 gap-3">
                  <PBtn href="https://github.com/wissam6"><Github size={13} />GitHub</PBtn>
                  <PBtn href="https://www.linkedin.com/in/wissammerhi/"><Linkedin size={13} />LinkedIn</PBtn>
                  <PBtn href="https://www.youtube.com/@mightywissam"><Youtube size={13} />YouTube</PBtn>
                  <PBtn href="https://www.instagram.com/wissam_6/"><Instagram size={13} />Instagram</PBtn>
                  <PBtn href="https://www.tiktok.com/@mightywissam"><span>🎵</span>TikTok</PBtn>
                  <PBtn href="mailto:wissammerhi6@hotmail.com" gold><Mail size={13} />Email</PBtn>
                </div>
              </DialogueBox>
            </div>
          )}
        </div>
        <div className="fb text-center mt-12 text-yellow-200/50">Made with 🌾 by Wissam · {new Date().getFullYear()}</div>
      </section>
    </div>
  );
}