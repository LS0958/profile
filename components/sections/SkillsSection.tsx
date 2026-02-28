"use client";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { useSectionAnimKey } from "@/hooks/useSectionAnimKey";

/* ─── types ──────────────────────────────────────────────── */
interface Skill { name: string; level: number; icon: string; hot?: boolean }
interface BentoTile {
  id: string; title: string; color: string; span: 1 | 2;
  skills: Skill[]; tags: string[];
}

/* ─── palette ────────────────────────────────────────────── */
const CV = {
  cyan:   "var(--neon-cyan)",
  purple: "var(--neon-purple)",
  pink:   "var(--neon-pink)",
  green:  "var(--neon-green)",
  orange: "#ff9500",
  teal:   "#00e5c3",
};

/* ─── bento tile data ────────────────────────────────────── */
const TILES: BentoTile[] = [
  {
    id: "frontend", title: "Frontend", color: CV.cyan, span: 2,
    skills: [
      { name: "React 19",      level: 95, icon: "⚛️" },
      { name: "Next.js 15",    level: 93, icon: "▲" },
      { name: "TypeScript",    level: 90, icon: "𝐓𝐒" },
      { name: "Angular 8–19",  level: 82, icon: "🔺" },
      { name: "Tailwind CSS",  level: 92, icon: "🎨" },
      { name: "Framer Motion", level: 85, icon: "✦" },
    ],
    tags: ["HTML5", "CSS3 / SCSS", "Redux", "Zustand", "Vite", "Webpack", "ShadcnUI"],
  },
  {
    id: "ai", title: "AI & LLMs", color: CV.purple, span: 1,
    skills: [
      { name: "OpenAI API",  level: 92, icon: "🤖", hot: true },
      { name: "LangChain",   level: 85, icon: "🔗", hot: true },
      { name: "RAG Systems", level: 80, icon: "📚", hot: true },
      { name: "Python",      level: 88, icon: "🐍" },
    ],
    tags: ["Embeddings", "Prompt Eng.", "Fine-tuning", "Claude", "Gemini"],
  },
  {
    id: "mobile", title: "Mobile (Android + Jetpack AI)", color: CV.teal, span: 1,
    skills: [
      { name: "Android Jetpack", level: 82, icon: "🤖", hot: true },
      { name: "Kotlin",          level: 80, icon: "🎯" },
      { name: "Jetpack Compose", level: 78, icon: "🎨" },
      { name: "React Native",    level: 70, icon: "⚛️" },
    ],
    tags: ["Room DB", "Retrofit", "MVVM", "Hilt", "Navigation", "ML Kit"],
  },
  {
    id: "backend", title: "Backend & APIs", color: CV.green, span: 1,
    skills: [
      { name: "Node.js",   level: 90, icon: "⬡" },
      { name: "Express",   level: 88, icon: "⚡" },
      { name: "GraphQL",   level: 75, icon: "◈" },
      { name: "REST APIs", level: 93, icon: "🔌" },
    ],
    tags: ["NestJS", "Fastify", "JWT", "OAuth2", "Microservices"],
  },
  {
    id: "databases", title: "Databases", color: CV.pink, span: 1,
    skills: [
      { name: "MySQL",      level: 87, icon: "🐬" },
      { name: "MongoDB",    level: 84, icon: "🍃" },
      { name: "PostgreSQL", level: 80, icon: "🐘" },
      { name: "Redis",      level: 78, icon: "💎" },
    ],
    tags: ["Prisma", "Mongoose", "Sequelize", "Vector DB", "ORM"],
  },
  {
    id: "automation", title: "Automation, Agents & Scraping", color: CV.orange, span: 2,
    skills: [
      { name: "N8N / Agentic Workflows", level: 85, icon: "🔄", hot: true },
      { name: "Web Scraping",            level: 91, icon: "🕷️", hot: true },
      { name: "Puppeteer / Playwright",  level: 87, icon: "🎭" },
      { name: "Data Pipelines",          level: 83, icon: "⚙️" },
      { name: "Selenium",                level: 78, icon: "🤖" },
      { name: "CRON / Schedulers",       level: 85, icon: "⏱️" },
    ],
    tags: ["Cheerio", "Axios", "Zapier", "Make.com", "AI Agents", "Workflow Automation", "Webhooks"],
  },
  {
    id: "extensions", title: "Browser & Chrome Extensions", color: CV.cyan, span: 1,
    skills: [
      { name: "Chrome Extensions", level: 82, icon: "🧩", hot: true },
      { name: "PWA",               level: 80, icon: "📱" },
      { name: "WebSocket",         level: 85, icon: "🔌" },
      { name: "Web APIs",          level: 88, icon: "🌐" },
    ],
    tags: ["Manifest V3", "Content Scripts", "Service Workers", "IndexedDB"],
  },
  {
    id: "devops", title: "DevOps & Cloud", color: CV.green, span: 1,
    skills: [
      { name: "Docker",         level: 80, icon: "🐳" },
      { name: "AWS EC2/S3",     level: 74, icon: "☁️" },
      { name: "Vercel/Netlify", level: 95, icon: "▲" },
      { name: "CI/CD",          level: 78, icon: "⚙️" },
    ],
    tags: ["GitHub Actions", "Linux", "Nginx", "PM2", "SSH"],
  },
];

/* ─── SkillRow (compact horizontal bar row) ─────────────── */
function SkillRow({ skill, color, delay }: { skill: Skill; color: string; delay: number }) {
  const { playHover } = useSound();
  return (
    <motion.div
      className="flex items-center gap-2 py-1.5 px-1 rounded-md"
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={playHover}
      whileHover={{ x: 3, transition: { duration: 0.15 } }}
    >
      <span className="text-sm shrink-0 leading-none">{skill.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-xs font-medium truncate" style={{ color: "rgba(226,232,240,0.85)", fontFamily: "var(--font-geist-mono)" }}>
            {skill.name}
            {skill.hot && (
              <span className="ml-1.5 text-[8px] font-bold" style={{ color: "#ff6b00" }}>●HOT</span>
            )}
          </span>
          <span className="text-[10px] shrink-0 ml-2 tabular-nums" style={{ color, fontFamily: "var(--font-geist-mono)" }}>{skill.level}%</span>
        </div>
        <div className="h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ delay: delay + 0.25, duration: 0.85, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── BentoCard ──────────────────────────────────────────── */
const DIRS = [
  { x: -55, y: 0 }, { x: 0, y: 45 }, { x: 55, y: 0 }, { x: 0, y: -45 },
  { x: -55, y: 0 }, { x: 0, y: 45 }, { x: 55, y: 0 }, { x: 0, y: -45 },
];

function BentoCard({ tile, idx }: { tile: BentoTile; idx: number }) {
  const c = tile.color;
  const dir = DIRS[idx] ?? { x: 0, y: 40 };
  const delay = idx * 0.09;
  const half = Math.ceil(tile.skills.length / 2);

  return (
    <motion.div
      className={`relative glass rounded-2xl p-5 flex flex-col gap-3 overflow-hidden${tile.span === 2 ? " sm:col-span-2" : ""}`}
      style={{ border: `1px solid ${c}1a` }}
      initial={{ opacity: 0, x: dir.x, y: dir.y, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ borderColor: `${c}38`, transition: { duration: 0.2 } }}
    >
      {/* Corner glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: `${c}09`, filter: "blur(16px)" }} />

      {/* Header */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: c, boxShadow: `0 0 6px ${c}` }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.3 }}
        />
        <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: c, fontFamily: "var(--font-geist-mono)" }}>
          {tile.title}
        </span>
      </div>

      {/* Skills */}
      {tile.span === 2 ? (
        <div className="grid sm:grid-cols-2 gap-x-4">
          <div>{tile.skills.slice(0, half).map((sk, i) => (
            <SkillRow key={sk.name} skill={sk} color={c} delay={delay + i * 0.06} />
          ))}</div>
          <div>{tile.skills.slice(half).map((sk, i) => (
            <SkillRow key={sk.name} skill={sk} color={c} delay={delay + (i + half) * 0.06} />
          ))}</div>
        </div>
      ) : (
        <div>{tile.skills.map((sk, i) => (
          <SkillRow key={sk.name} skill={sk} color={c} delay={delay + i * 0.07} />
        ))}</div>
      )}

      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5 pt-2" style={{ borderTop: `1px solid ${c}12` }}>
        {tile.tags.map((tag, ti) => (
          <motion.span
            key={tag}
            className="text-[9px] px-2 py-0.5 rounded-full"
            style={{ background: `${c}0d`, border: `1px solid ${c}1e`, color: "rgba(148,163,184,0.65)", fontFamily: "var(--font-geist-mono)" }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.45 + ti * 0.04, type: "spring", bounce: 0.4 }}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Section ────────────────────────────────────────────── */
export function SkillsSection() {
  const animKey = useSectionAnimKey(2);
  return (
    <section className="relative w-full h-full flex flex-col overflow-hidden bg-black pt-16">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,245,255,0.03) 0%, transparent 70%)" }}
      />
      <div
        key={animKey}
        className="relative z-10 flex-1 px-6 md:px-10 py-8 overflow-y-auto max-w-6xl mx-auto w-full"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,245,255,0.2) transparent" }}
      >
        {/* Header */}
        <motion.div className="text-center mb-8"
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--neon-purple)", fontFamily: "var(--font-geist-mono)" }}>
            Technical Arsenal
          </div>
          <h2 className="text-4xl md:text-5xl font-black gradient-text-cyan">Skills & Expertise</h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
            Full-stack · Mobile · AI · Automation · DevOps &mdash; always shipping.
          </p>
        </motion.div>

        {/* Bento Grid — 4 cols on xl, 2 on sm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {TILES.map((tile, i) => <BentoCard key={tile.id} tile={tile} idx={i} />)}
        </div>

        {/* Trending strip */}
        <motion.div className="mt-8 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {["LangChain","RAG","N8N Agents","Jetpack AI","Chrome Ext",
            "Web Scraping","Angular 19","MySQL Full Stack","Vector Search","Prompt Engineering",
          ].map((tag, ti) => (
            <motion.span key={tag}
              className="px-3 py-1 text-[10px] rounded-full font-semibold"
              style={{ background: "rgba(191,0,255,0.1)", border: "1px solid rgba(191,0,255,0.28)",
                color: "var(--neon-purple)", fontFamily: "var(--font-geist-mono)" }}
              initial={{ opacity: 0, scale: 0.5, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.6 + ti * 0.05 }}
            >
              🔮 {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
