"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import {
  Github, ExternalLink, ChevronDown, X,
  Play, Pause, Volume2, VolumeX, RotateCcw, Maximize,
} from "lucide-react";
import { useSectionAnimKey } from "@/hooks/useSectionAnimKey";
import { useZScrollContext } from "@/components/ZAxisScroll/ZScrollContext";

type BentoSize = "hero" | "wide" | "tall" | "normal";

interface Project {
  id: number;
  title: string;
  description: string;
  longDesc: string;
  tags: string[];
  github: string;
  demo: string;
  emoji: string;
  color: string;
  featured?: boolean;
  videoUrl?: string;
  stats?: { label: string; value: string }[];
  bento: BentoSize;
}

// sm = 2-col grid, lg = 4-col grid
const BENTO_CLS: Record<BentoSize, string> = {
  hero:   "sm:col-span-2 sm:row-span-2",
  wide:   "sm:col-span-2",
  tall:   "sm:row-span-2",
  normal: "",
};

const V1  = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
const V2  = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
const V5  = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4";
const V10 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const PROJECTS: Project[] = [
  {
    id: 1, bento: "hero",
    title: "AI SaaS Platform",
    description: "Multi-tenant LLM platform with RAG, vector search, and custom agent workflows.",
    longDesc: "Built with Next.js 15, LangChain, Pinecone, PostgreSQL, and Redis. Handles 100k+ monthly requests with sub-200ms RAG retrieval. Features multi-tenant auth, billing via Stripe, and a full prompt-management dashboard.",
    tags: ["Next.js", "LangChain", "Pinecone", "PostgreSQL", "OpenAI", "Redis", "Stripe"],
    github: "https://github.com", demo: "#", emoji: "🤖",
    color: "var(--neon-purple)", featured: true, videoUrl: V1,
    stats: [{ label: "Monthly Requests", value: "100k+" }, { label: "RAG Latency", value: "<200ms" }, { label: "Uptime", value: "99.9%" }],
  },
  {
    id: 2, bento: "tall",
    title: "Android AI Finance",
    description: "Jetpack Compose app with on-device AI for expense tracking and smart budgeting.",
    longDesc: "Built with Kotlin, Jetpack Compose, Room DB, and ML Kit. Fine-tuned on-device model for receipt scanning and spending predictions. MVVM + Hilt DI.",
    tags: ["Kotlin", "Jetpack Compose", "Room DB", "ML Kit", "MVVM"],
    github: "https://github.com", demo: "#", emoji: "📱",
    color: "#00e5c3", featured: true, videoUrl: V2,
    stats: [{ label: "Play Rating", value: "4.8★" }, { label: "Downloads", value: "5k+" }, { label: "Accuracy", value: "94%" }],
  },
  {
    id: 3, bento: "normal",
    title: "AI Chrome Extension",
    description: "Summarise, translate, and rewrite any text using GPT-4 directly in-page.",
    longDesc: "Manifest V3 Chrome Extension with Content Scripts + Service Worker. React popover injected into page. Multi-provider (GPT-4, Claude, Gemini) support.",
    tags: ["Manifest V3", "React", "GPT-4", "Node.js"],
    github: "https://github.com", demo: "#", emoji: "🧩",
    color: "var(--neon-cyan)", featured: true,
    stats: [{ label: "Users", value: "2k+" }, { label: "Rating", value: "4.9★" }, { label: "Models", value: "3" }],
  },
  {
    id: 4, bento: "normal",
    title: "N8N Agentic Workflows",
    description: "Custom N8N node library with AI agent orchestrator for CRM & reporting pipelines.",
    longDesc: "Extends N8N with 20+ custom nodes for CRM APIs, AI chains, and data transformations. LLM-driven decision node routes flows dynamically. Saved 200+ hours/month.",
    tags: ["N8N", "AI Agents", "Node.js", "REST APIs"],
    github: "https://github.com", demo: "#", emoji: "🔄",
    color: "#ff9500",
    stats: [{ label: "Hours Saved", value: "200+" }, { label: "Nodes", value: "20+" }, { label: "Pipelines", value: "15+" }],
  },
  {
    id: 5, bento: "wide",
    title: "Web Scraping Intelligence",
    description: "Distributed scraping with AI extraction, anti-bot bypass, and structured output pipelines.",
    longDesc: "Multi-threaded Playwright + Cheerio engine with rotating proxies, CAPTCHA solving, and LLM post-processing. Outputs to MySQL, MongoDB, or Google Sheets.",
    tags: ["Playwright", "Puppeteer", "Python", "MySQL", "MongoDB", "OpenAI"],
    github: "https://github.com", demo: "#", emoji: "🕷️",
    color: "var(--neon-pink)", videoUrl: V5,
    stats: [{ label: "Pages/Day", value: "500k+" }, { label: "Accuracy", value: "97%" }, { label: "Bypass Rate", value: "99%" }],
  },
  {
    id: 6, bento: "normal",
    title: "Angular Enterprise App",
    description: "Full-stack dashboard — Angular 16, NestJS, MySQL, real-time analytics and RBAC.",
    longDesc: "Angular 16 standalone + NgRx, NestJS backend, MySQL with Sequelize ORM. WebSocket feeds, role-based access, exportable reports.",
    tags: ["Angular 16", "NestJS", "MySQL", "NgRx"],
    github: "https://github.com", demo: "#", emoji: "📊",
    color: "var(--neon-green)",
    stats: [{ label: "Users", value: "500+" }, { label: "Reports", value: "50+" }, { label: "Tables", value: "80+" }],
  },
  {
    id: 7, bento: "normal",
    title: "Real-time Collab Editor",
    description: "Google Docs–style editor with live cursors, CRDTs, and conflict resolution.",
    longDesc: "CRDTs via Yjs, Socket.io for presence, React + Tiptap editor, Redis pub/sub for horizontal scaling.",
    tags: ["React", "Yjs", "Socket.io", "Redis"],
    github: "https://github.com", demo: "#", emoji: "✍️",
    color: "var(--neon-cyan)",
    stats: [{ label: "Concurrent", value: "200+" }, { label: "Latency", value: "<50ms" }, { label: "Uptime", value: "99.8%" }],
  },
  {
    id: 8, bento: "normal",
    title: "AI Chat App",
    description: "Real-time chat with AI smart replies, sentiment analysis, and E2E encryption.",
    longDesc: "React + WebSocket, Express + MongoDB, GPT-4 smart replies, Signal-protocol E2E encryption, group rooms and media.",
    tags: ["React", "MongoDB", "WebSocket", "GPT-4"],
    github: "https://github.com", demo: "#", emoji: "💬",
    color: "var(--neon-purple)",
    stats: [{ label: "Msgs/Day", value: "50k+" }, { label: "Rooms", value: "10k+" }, { label: "Delivery", value: "99.99%" }],
  },
  {
    id: 9, bento: "normal",
    title: "E-Commerce PWA",
    description: "Next.js App Router PWA with AR product preview and AI recommendations.",
    longDesc: "Stripe, Prisma, PostgreSQL, custom recommendation engine, Three.js WebXR AR product preview.",
    tags: ["Next.js", "Stripe", "Prisma", "Three.js"],
    github: "https://github.com", demo: "#", emoji: "🛍️",
    color: "var(--neon-green)",
    stats: [{ label: "GMV/Month", value: "$20k+" }, { label: "Conversion", value: "+23%" }, { label: "Lighthouse", value: "98" }],
  },
  {
    id: 10, bento: "wide",
    title: "DevOps Monitoring Dashboard",
    description: "Infrastructure monitoring with LLM anomaly explanations and auto-healing CI scripts.",
    longDesc: "Node.js + Docker + Prometheus metrics. Recharts dashboards. LLM explains anomalies in plain English and triggers GitHub Actions healing workflows.",
    tags: ["Node.js", "Docker", "Prometheus", "React", "OpenAI"],
    github: "https://github.com", demo: "#", emoji: "⚡",
    color: "var(--neon-pink)", videoUrl: V10,
    stats: [{ label: "Auto-Fixed", value: "80%" }, { label: "MTTR", value: "-60%" }, { label: "Services", value: "30+" }],
  },
];

/* ─── VideoPlayer ─────────────────────────────────────────── */
function VideoPlayer({ src, color }: { src: string; color: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    ref.current.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const restart = () => {
    if (!ref.current) return;
    ref.current.currentTime = 0;
    ref.current.play().then(() => setPlaying(true)).catch(() => {});
  };

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#000" }}>
      <video
        ref={ref}
        src={src}
        className="w-full block"
        style={{ maxHeight: 260 }}
        onTimeUpdate={() => ref.current && setCurrent(ref.current.currentTime)}
        onLoadedMetadata={() => ref.current && setDuration(ref.current.duration)}
        onEnded={() => setPlaying(false)}
        muted={muted}
        playsInline
      />
      <div
        className="flex items-center gap-2.5 px-3 py-2"
        style={{ background: "rgba(0,0,0,0.85)", borderTop: `1px solid ${color}25` }}
      >
        <button
          onClick={toggle}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}35` }}
        >
          {playing ? <Pause size={12} color={color} /> : <Play size={12} color={color} fill={color} />}
        </button>
        <div
          className="flex-1 h-1.5 rounded-full cursor-pointer relative"
          style={{ background: "rgba(255,255,255,0.1)" }}
          onClick={seek}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${duration ? (current / duration) * 100 : 0}%`, background: color }}
          />
        </div>
        <span
          className="text-[10px] shrink-0 tabular-nums"
          style={{ color: "rgba(148,163,184,0.55)", fontFamily: "var(--font-geist-mono)" }}
        >
          {fmt(current)} / {fmt(duration)}
        </span>
        <button onClick={restart} title="Restart">
          <RotateCcw size={11} color="rgba(148,163,184,0.4)" />
        </button>
        <button
          onClick={() => { if (!ref.current) return; ref.current.muted = !muted; setMuted((m) => !m); }}
        >
          {muted
            ? <VolumeX size={12} color="rgba(148,163,184,0.4)" />
            : <Volume2 size={12} color={color} />}
        </button>
      </div>
    </div>
  );
}

/* ─── FrontVideo — inline thumbnail player, blocks flip propagation ─── */
function FrontVideo({ src, color }: { src: string; color: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hovering, setHovering] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ref.current) return;
    if (playing) { ref.current.pause(); setPlaying(false); }
    else { ref.current.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const enterFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ref.current) return;
    if (ref.current.requestFullscreen) ref.current.requestFullscreen();
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        ref={ref}
        src={src}
        className="absolute inset-0 w-full h-full object-cover"
        muted playsInline preload="metadata"
        onEnded={() => setPlaying(false)}
        onClick={toggle}
      />

      {/* Centre play overlay — visible when paused */}
      <motion.div
        className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer pointer-events-none"
        style={{ border: `1px solid ${color}70`, background: "rgba(0,0,0,0.6)" }}
        animate={{ opacity: playing ? 0 : 1, scale: playing ? 0.8 : 1 }}
        transition={{ duration: 0.25 }}
      >
        <Play size={15} color={color} fill={color} />
      </motion.div>

      {/* Hover controls bar — visible while playing + hovering */}
      <motion.div
        className="absolute inset-0 z-10 flex items-end justify-between px-2.5 pb-2.5 cursor-pointer"
        animate={{ opacity: playing && hovering ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: playing && hovering ? "auto" : "none" }}
      >
        {/* Pause */}
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ border: `1px solid ${color}60`, background: "rgba(0,0,0,0.7)" }}
          whileHover={{ scale: 1.12, borderColor: `${color}cc` }}
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
        >
          <Pause size={12} color={color} />
        </motion.div>

        {/* Fullscreen */}
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ border: `1px solid ${color}60`, background: "rgba(0,0,0,0.7)" }}
          whileHover={{ scale: 1.12, borderColor: `${color}cc` }}
          whileTap={{ scale: 0.9 }}
          onClick={enterFullscreen}
          title="Full screen"
        >
          <Maximize size={12} color={color} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ─── BentoCard ─────────────────────────────────────────── */
function BentoCard({
  project, delay, isExpanded, onToggleExpand,
}: {
  project: Project;
  delay: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const { playClick, playHover } = useSound();
  const [flipped, setFlipped] = useState(false);
  const c = project.color;
  const isTall = project.bento === "tall";
  const isWide = project.bento === "wide";
  const isHero = project.bento === "hero";

  return (
    <motion.div
      className={`relative ${BENTO_CLS[project.bento]}`}
      style={{ perspective: "1200px", minHeight: 200 }}
      initial={{ opacity: 0, scale: 0.92, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => { setFlipped((f) => !f); playClick(); }}
        onHoverStart={() => playHover()}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
      >
        {/* ── FRONT ── */}
        <div
          className="absolute inset-0 glass rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            border: isExpanded ? `1px solid ${c}55` : `1px solid ${c}22`,
            boxShadow: isExpanded ? `0 0 0 1px ${c}22, 0 8px 32px ${c}15` : undefined,
          }}
        >
          {/* Media zone */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{
              height: isWide ? "100%" : isHero ? "62%" : isTall ? "60%" : "52%",
              width: isWide ? "42%" : "100%",
              background: `${c}0a`,
              position: isWide ? "absolute" : "relative",
              top: isWide ? 0 : undefined,
              left: isWide ? 0 : undefined,
              bottom: isWide ? 0 : undefined,
            }}
          >
            {project.videoUrl ? (
              <FrontVideo src={project.videoUrl} color={c} />
            ) : (
              <span className={isHero ? "text-6xl" : isTall ? "text-5xl" : "text-4xl"}>
                {project.emoji}
              </span>
            )}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: isWide
                  ? "linear-gradient(to right, transparent 50%, rgba(0,0,0,0.8))"
                  : "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.9))",
              }}
            />
            {project.featured && (
              <div className="absolute top-2.5 left-2.5 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,107,0,0.2)", color: "#ff6b00",
                  border: "1px solid rgba(255,107,0,0.45)", fontFamily: "var(--font-geist-mono)" }}>
                ★ FEATURED
              </div>
            )}
          </div>

          {/* Text zone */}
          <div
            className="absolute flex flex-col justify-between p-3.5"
            style={
              isWide
                ? { left: "42%", top: 0, right: 0, bottom: 0 }
                : { left: 0, right: 0, bottom: 0, height: isHero ? "38%" : isTall ? "40%" : "48%" }
            }
          >
            <div className="overflow-hidden">
              <h3 className="font-black leading-snug mb-1 text-sm" style={{ color: "rgba(226,232,240,0.97)" }}>
                {project.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.65)" }}>
                {project.description.slice(0, isTall || isHero || isWide ? 80 : 60)}
                {project.description.length > (isTall || isHero || isWide ? 80 : 60) ? "…" : ""}
              </p>
            </div>
            <div className="flex items-end justify-between gap-1.5 mt-1.5">
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, isTall || isHero ? 3 : 2).map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: `${c}12`, border: `1px solid ${c}28`, color: c, fontFamily: "var(--font-geist-mono)" }}>
                    {t}
                  </span>
                ))}
              </div>
              {/* Expand arrow — does NOT flip */}
              <motion.button
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  border: `1px solid ${c}45`,
                  background: isExpanded ? `${c}22` : "rgba(255,255,255,0.06)",
                  boxShadow: isExpanded ? `0 0 12px ${c}40` : undefined,
                }}
                onClick={(e) => { e.stopPropagation(); playClick(); onToggleExpand(); }}
                animate={{ rotate: isExpanded ? 180 : 0, y: isExpanded ? 0 : [0, 3, 0] }}
                transition={{ rotate: { duration: 0.3 }, y: { repeat: Infinity, duration: 2 } }}
                whileHover={{ scale: 1.2, backgroundColor: `${c}22` }}
                whileTap={{ scale: 0.85 }}
              >
                <ChevronDown size={13} color={c} />
              </motion.button>
            </div>
          </div>

          {/* Active bottom accent when expanded */}
          {isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5"
              style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} />
          )}

          {/* Flip hint */}
          <div className="absolute top-2.5 right-2.5 text-[9px] tracking-widest pointer-events-none select-none"
            style={{ color: c, opacity: 0.28, fontFamily: "var(--font-geist-mono)" }}>
            TAP ↻
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          className="absolute inset-0 glass rounded-2xl p-4 flex flex-col justify-between overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            border: `1px solid ${c}38`,
            background: `linear-gradient(145deg, ${c}08 0%, rgba(0,0,0,0.93) 100%)`,
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${c}, transparent)` }} />
          <div className="overflow-hidden flex-1">
            <div className="text-[10px] font-bold tracking-widest mb-2" style={{ color: c, fontFamily: "var(--font-geist-mono)" }}>
              {project.featured ? "★ FEATURED — " : ""}OVERVIEW
            </div>
            <h3 className="font-black text-sm mb-2" style={{ color: "rgba(226,232,240,0.97)" }}>{project.title}</h3>
            <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(148,163,184,0.78)" }}>
              {project.longDesc.slice(0, isTall || isHero ? 200 : 145)}
              {project.longDesc.length > (isTall || isHero ? 200 : 145) ? "…" : ""}
            </p>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ background: `${c}12`, border: `1px solid ${c}2a`, color: c, fontFamily: "var(--font-geist-mono)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2" style={{ borderTop: `1px solid ${c}15` }}>
            <motion.a href={project.github} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 rounded-lg font-semibold"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
                color: "rgba(226,232,240,0.8)", fontFamily: "var(--font-geist-mono)", textDecoration: "none" }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Github size={10} /> Code
            </motion.a>
            <motion.a href={project.demo} target="_blank" rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 rounded-lg font-semibold"
              style={{ background: `${c}18`, border: `1px solid ${c}35`, color: c,
                fontFamily: "var(--font-geist-mono)", textDecoration: "none" }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ExternalLink size={10} /> Demo
            </motion.a>
            <motion.button
              onClick={(e) => { e.stopPropagation(); playClick(); onToggleExpand(); }}
              className="flex items-center gap-1.5 text-[9px] px-2.5 py-1.5 rounded-lg font-semibold ml-auto"
              style={{ background: `${c}18`, border: `1px solid ${c}40`, color: c, fontFamily: "var(--font-geist-mono)" }}
              animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ChevronDown size={10} /> {isExpanded ? "Close" : "Details"}
            </motion.button>
          </div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[7px] tracking-widest pointer-events-none select-none"
            style={{ color: c, opacity: 0.2, fontFamily: "var(--font-geist-mono)" }}>
            TAP TO FLIP BACK
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── ExpandPanel — fixed overlay ────────────────────────── */
function ExpandPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  const { playClick } = useSound();
  const c = project.color;

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      key={project.id}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={() => { playClick(); onClose(); }}
      />

      {/* Card — slides up from bottom on mobile, scales in on desktop */}
      <motion.div
        className="relative w-full md:max-w-3xl max-h-[88vh] md:max-h-[82vh] flex flex-col rounded-t-3xl md:rounded-2xl overflow-hidden"
        initial={{ y: 60, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 60, scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Colored top bar */}
        <div className="shrink-0 flex items-center gap-3 px-5 py-3"
          style={{
            background: `linear-gradient(90deg, ${c}20, ${c}08 80%)`,
            borderTop: `2px solid ${c}`,
            borderLeft: `1px solid ${c}35`,
            borderRight: `1px solid ${c}35`,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(8,8,12,0.92)",
          }}>
          {/* drag handle for mobile */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 md:hidden w-10 h-1 rounded-full"
            style={{ background: `${c}50` }} />
          <span className="text-lg mt-1 md:mt-0">{project.emoji}</span>
          <div className="flex flex-col">
            <span className="text-sm font-black" style={{ color: c, fontFamily: "var(--font-geist-mono)" }}>
              {project.title}
            </span>
            <span className="text-[10px]" style={{ color: "rgba(148,163,184,0.45)", fontFamily: "var(--font-geist-mono)" }}>
              project details
            </span>
          </div>
          <motion.button
            className="ml-auto w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(255,255,255,0.12)", border: `1.5px solid rgba(255,255,255,0.28)` }}
            onClick={() => { playClick(); onClose(); }}
            whileHover={{ scale: 1.12, rotate: 90 }}
            whileTap={{ scale: 0.88 }}
          >
            <X size={16} color="rgba(226,232,240,0.95)" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1"
          style={{
            background: "rgba(8,8,12,0.96)",
            border: `1px solid ${c}28`,
            borderTop: "none",
            scrollbarWidth: "thin",
            scrollbarColor: `${c}30 transparent`,
          }}>
          <div className="p-5 md:p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: video/emoji + stats */}
              <div>
                {project.videoUrl ? (
                  <VideoPlayer src={project.videoUrl} color={c} />
                ) : (
                  <div className="rounded-xl flex items-center justify-center"
                    style={{ height: 200, background: `${c}08`, border: `1px solid ${c}18` }}>
                    <span className="text-8xl">{project.emoji}</span>
                  </div>
                )}
                {project.stats && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {project.stats.map((st, si) => (
                      <motion.div key={st.label} className="text-center py-2.5 rounded-xl"
                        style={{ background: `${c}09`, border: `1px solid ${c}18` }}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + si * 0.06 }}>
                        <div className="font-black text-base" style={{ color: c }}>{st.value}</div>
                        <div className="text-[9px] mt-0.5"
                          style={{ color: "rgba(148,163,184,0.5)", fontFamily: "var(--font-geist-mono)" }}>
                          {st.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: desc + tags + links */}
              <div className="flex flex-col gap-4">
                <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.82)" }}>
                  {project.longDesc}
                </p>
                <div>
                  <div className="text-[9px] font-bold tracking-widest mb-2"
                    style={{ color: "rgba(148,163,184,0.35)", fontFamily: "var(--font-geist-mono)" }}>
                    TECH STACK
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag, ti) => (
                      <motion.span key={tag} className="text-xs px-2.5 py-1 rounded-full"
                        style={{ background: `${c}12`, border: `1px solid ${c}28`, color: c, fontFamily: "var(--font-geist-mono)" }}
                        initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 + ti * 0.04, type: "spring", bounce: 0.4 }}>
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-auto">
                  <motion.a href={project.github} target="_blank" rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)",
                      color: "rgba(226,232,240,0.85)", fontFamily: "var(--font-geist-mono)", textDecoration: "none" }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Github size={14} /> GitHub
                  </motion.a>
                  <motion.a href={project.demo} target="_blank" rel="noopener noreferrer"
                    onClick={() => playClick()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                    style={{ background: `${c}18`, border: `1px solid ${c}35`, color: c,
                      fontFamily: "var(--font-geist-mono)", textDecoration: "none" }}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <ExternalLink size={14} /> Live Demo
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── ProjectsSection ─────────────────────────────────────── */
// Projects section is at index 3 in the Z-scroll stack
const PROJECTS_SECTION_INDEX = 3;

export function ProjectsSection() {
  const animKey = useSectionAnimKey(3);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { playClick } = useSound();
  const { currentIndex } = useZScrollContext();
  const expandedProject = PROJECTS.find((p) => p.id === expandedId) ?? null;

  // Auto-close overlay when user navigates away from the Projects section
  useEffect(() => {
    if (currentIndex !== PROJECTS_SECTION_INDEX) {
      setExpandedId(null);
    }
  }, [currentIndex]);

  const toggleExpand = (id: number) => {
    playClick();
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="relative w-full h-full flex flex-col overflow-hidden bg-black pt-16">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(255,0,128,0.04) 0%, transparent 70%)" }}
      />
      <div
        key={animKey}
        className="relative z-10 flex-1 px-6 md:px-10 py-8 overflow-y-auto max-w-6xl mx-auto w-full"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,245,255,0.2) transparent" }}
      >
        <motion.div className="text-center mb-8"
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--neon-pink)", fontFamily: "var(--font-geist-mono)" }}>
            Work Showcase
          </div>
          <h2 className="text-4xl md:text-5xl font-black gradient-text-cyan">Projects</h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(148,163,184,0.55)" }}>
            <span style={{ color: "var(--neon-cyan)" }}>Tap</span> card to flip for overview ·{" "}
            <span style={{ color: "var(--neon-purple)" }}>↓ Arrow</span> to expand details in place
          </p>
        </motion.div>

        {/* Bento grid — 1 col xs, 2 col sm, 4 col lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" style={{ gridAutoRows: "280px" }}>
          {PROJECTS.map((project, i) => (
            <BentoCard
              key={project.id}
              project={project}
              delay={i * 0.06}
              isExpanded={expandedId === project.id}
              onToggleExpand={() => toggleExpand(project.id)}
            />
          ))}
        </div>

        {/* Fixed overlay — rendered into a portal-like fixed position */}
        <AnimatePresence mode="wait">
          {expandedProject && (
            <ExpandPanel
              project={expandedProject}
              onClose={() => setExpandedId(null)}
            />
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.div className="mt-10 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.a
            href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-neon px-6 py-3 rounded-xl text-sm font-semibold tracking-wider"
            style={{ fontFamily: "var(--font-geist-mono)", textDecoration: "none" }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            <Github size={16} />VIEW ALL ON GITHUB
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
