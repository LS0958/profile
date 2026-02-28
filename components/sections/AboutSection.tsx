"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { AnimatedText } from "@/components/ui/AnimatedText";
import { useSound } from "@/hooks/useSound";
import { MapPin, Briefcase, GraduationCap, Download, Calendar, CheckCircle } from "lucide-react";
import { useSectionAnimKey } from "@/hooks/useSectionAnimKey";

/* ─── Download Overlay ─────────────────────────────────────── */
function DownloadOverlay({ show, onDone }: { show: boolean; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const circumference = 2 * Math.PI * 44;

  useEffect(() => {
    if (!show) { setProgress(0); setDone(false); return; }
    const start = Date.now();
    const duration = 2200;
    let raf: number;
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      // Ease-out curve so it feels like a real download
      const eased = 1 - Math.pow(1 - t, 2);
      setProgress(Math.round(eased * 100));
      if (t < 1) { raf = requestAnimationFrame(tick); }
      else { setDone(true); setTimeout(onDone, 600); }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-99999 flex items-center justify-center pointer-events-none"
          style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(10px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Subtle scan-line grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, var(--neon-cyan) 0px, var(--neon-cyan) 1px, transparent 1px, transparent 36px),repeating-linear-gradient(90deg, var(--neon-cyan) 0px, var(--neon-cyan) 1px, transparent 1px, transparent 36px)",
            }}
          />
          {/* Corner brackets */}
          {( [["top","left"],["top","right"],["bottom","left"],["bottom","right"]] as const).map(([v,h], ci) => (
            <motion.div key={ci} className="absolute w-10 h-10"
              style={{
                [v]: 32, [h]: 32,
                borderTop:    v === "top"    ? "1px solid var(--neon-cyan)" : undefined,
                borderBottom: v === "bottom" ? "1px solid var(--neon-cyan)" : undefined,
                borderLeft:   h === "left"   ? "1px solid var(--neon-cyan)" : undefined,
                borderRight:  h === "right"  ? "1px solid var(--neon-cyan)" : undefined,
                opacity: 0.35,
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.35 }}
              transition={{ delay: ci * 0.06, duration: 0.3 }}
            />
          ))}

          {/* Central card */}
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ scale: 0.75, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            {/* Circular progress ring + icon */}
            <div className="relative">
              <svg width="128" height="128" viewBox="0 0 128 128">
                {/* Track */}
                <circle cx="64" cy="64" r="44" fill="none" stroke="rgba(0,245,255,0.08)" strokeWidth="3" />
                {/* Progress */}
                <motion.circle
                  cx="64" cy="64" r="44" fill="none"
                  stroke="var(--neon-cyan)" strokeWidth="3.5" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "64px 64px",
                    filter: "drop-shadow(0 0 8px var(--neon-cyan))",
                    transition: "stroke-dashoffset 0.05s linear",
                  }}
                />
              </svg>
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                {done ? (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle size={34} color="var(--neon-cyan)" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.75, ease: "easeInOut" }}
                  >
                    <Download size={34} color="var(--neon-cyan)" />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Percentage */}
            <motion.div
              className="tabular-nums font-black"
              style={{
                fontSize: 42, lineHeight: 1, color: "var(--neon-cyan)",
                fontFamily: "var(--font-geist-mono)",
                textShadow: "0 0 24px var(--neon-cyan)",
              }}
            >
              {progress}%
            </motion.div>

            {/* Progress bar */}
            <div className="w-56 h-1 rounded-full overflow-hidden" style={{ background: "rgba(0,245,255,0.1)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))",
                  boxShadow: "0 0 10px var(--neon-cyan)",
                  transition: "width 0.05s linear",
                }}
              />
            </div>

            {/* Label */}
            <div style={{ color: "rgba(148,163,184,0.55)", fontFamily: "var(--font-geist-mono)", fontSize: 11, letterSpacing: "0.2em" }}>
              {done ? "COMPLETE — OPENING FILE" : "DOWNLOADING RESUME.PDF"}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const TIMELINE = [
  {
    year: "2024",
    title: "Senior Full Stack Developer",
    org: "Tech Company",
    desc: "Led development of AI-powered SaaS platform serving 100k+ users.",
    type: "work",
  },
  {
    year: "2023",
    title: "Full Stack Developer",
    org: "Digital Agency",
    desc: "Built 15+ client projects with React, Next.js, and Node.js.",
    type: "work",
  },
  {
    year: "2022",
    title: "AI/ML Engineer",
    org: "Startup",
    desc: "Integrated LangChain + OpenAI APIs into production systems.",
    type: "work",
  },
  {
    year: "2021",
    title: "B.Tech Computer Science",
    org: "University",
    desc: "Graduated with distinction. Specialized in AI and distributed systems.",
    type: "edu",
  },
];

const INFO_CHIPS = [
  { icon: MapPin, label: "Chandigarh, India", color: "#00f5ff" },
  { icon: Briefcase, label: "Available for Work", color: "#00ff88" },
  { icon: GraduationCap, label: "B.Tech CS — 2021", color: "#bf00ff" },
];

/** Left panel items slide in from bottom-left */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40, x: -30 },
  show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

/** Timeline items burst in from bottom-right */
const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60, y: 20, scale: 0.92 },
  show: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export function AboutSection() {
  const { playClick, playHover } = useSound();
  const animKey = useSectionAnimKey(1);
  const [showDownload, setShowDownload] = useState(false);
  const handleDone = useCallback(() => setShowDownload(false), []);

  return (
    <section className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black pt-16 px-6">
      {/* Background geometry */}
      <div
        className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-10 pointer-events-none animate-cube"
        style={{ transformStyle: "preserve-3d" }}
      >
        {[0, 1, 2, 3, 4, 5].map((face) => (
          <div
            key={face}
            className="absolute w-full h-full"
            style={{
              border: "1px solid rgba(0,245,255,0.6)",
              background: "rgba(0,245,255,0.02)",
              transform: [
                "translateZ(128px)",
                "translateZ(-128px)",
                "rotateY(90deg) translateZ(128px)",
                "rotateY(-90deg) translateZ(128px)",
                "rotateX(90deg) translateZ(128px)",
                "rotateX(-90deg) translateZ(128px)",
              ][face],
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 30% 50%, rgba(191,0,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div key={animKey} className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Bio */}
        <motion.div
          className="flex flex-col gap-6"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeInUp}>
            <div
              className="text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color: "var(--neon-purple)", fontFamily: "var(--font-geist-mono)" }}
            >
              About Me
            </div>
            <h2 className="text-4xl md:text-5xl font-black gradient-text-cyan">
              Crafting Digital
              <br />
              Experiences
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <p className="text-base leading-relaxed" style={{ color: "rgba(148,163,184,0.85)" }}>
              I&apos;m a passionate Full Stack Developer and AI Engineer with a deep love for building
              products that sit at the intersection of beautiful design and powerful technology.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <p className="text-base leading-relaxed" style={{ color: "rgba(148,163,184,0.85)" }}>
              My journey spans from pixel-perfect React UIs to LLM-powered backends, microservices,
              and real-time data pipelines. I believe in{" "}
              <span style={{ color: "var(--neon-cyan)" }}>shipping fast, iterating smart</span>, and
              always keeping the end user at the center of every decision.
            </p>
          </motion.div>

          {/* Info chips */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
            {INFO_CHIPS.map((chip) => (
              <motion.div
                key={chip.label}
                className="flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-medium"
                style={{ border: `1px solid ${chip.color}30`, color: chip.color, fontFamily: "var(--font-geist-mono)" }}
                onHoverStart={playHover}
                whileHover={{ scale: 1.05, borderColor: `${chip.color}70` }}
              >
                <chip.icon size={13} />
                {chip.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Download Resume */}
          <motion.div variants={fadeInUp}>
            <motion.a
              href="/LalChand_Resume.pdf"
              download="LalChand_Resume.pdf"
              className="inline-flex items-center gap-2 btn-neon px-6 py-3 rounded-xl text-sm font-semibold tracking-wider"
              style={{ fontFamily: "var(--font-geist-mono)", textDecoration: "none" }}
              onClick={(e) => { playClick(); setShowDownload(true); }}
              onHoverStart={playHover}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Download size={15} />
              DOWNLOAD RESUME
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Right: Timeline */}
        <motion.div
          className="flex flex-col gap-4"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } }}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={slideFromRight}>
            <div
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-geist-mono)" }}
            >
              Experience & Education
            </div>
          </motion.div>

          <div className="relative flex flex-col gap-4">
            {/* Timeline line */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(to bottom, var(--neon-cyan), var(--neon-purple), transparent)" }}
            />

            {TIMELINE.map((item, i) => (
              <motion.div
                key={i}
                variants={slideFromRight}
                className="flex gap-4 pl-2"
              >
                {/* Dot */}
                <div className="flex flex-col items-center relative z-10 mt-1">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: item.type === "work" ? "var(--neon-cyan)" : "var(--neon-purple)",
                      boxShadow: `0 0 12px ${item.type === "work" ? "var(--neon-cyan)" : "var(--neon-purple)"}`,
                    }}
                  >
                    {item.type === "work" ? (
                      <Briefcase size={10} color="#000" />
                    ) : (
                      <GraduationCap size={10} color="#000" />
                    )}
                  </div>
                </div>

                <FloatingCard
                  glowColor={item.type === "work" ? "cyan" : "purple"}
                  delay={0.3 + i * 0.1}
                  className="flex-1 p-4"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-bold text-sm" style={{ color: item.type === "work" ? "var(--neon-cyan)" : "var(--neon-purple)" }}>
                      {item.title}
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs shrink-0"
                      style={{ color: "rgba(148,163,184,0.5)", fontFamily: "var(--font-geist-mono)" }}
                    >
                      <Calendar size={10} />
                      {item.year}
                    </div>
                  </div>
                  <div className="text-xs mb-2" style={{ color: "rgba(148,163,184,0.6)", fontFamily: "var(--font-geist-mono)" }}>
                    {item.org}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(148,163,184,0.7)" }}>
                    {item.desc}
                  </p>
                </FloatingCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Download animation overlay */}
      <DownloadOverlay show={showDownload} onDone={handleDone} />
    </section>
  );
}
