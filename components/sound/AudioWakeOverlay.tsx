"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface Props { onEnter: () => void; }

/* ── Orbiting syntax tokens ── */
const TOKENS = [
  { sym: "</>",  r: 54, angle:  10, cw: true,  dur: 13, color: "#00f5ff" },
  { sym: "{}",   r: 41, angle: 130, cw: false, dur:  9, color: "#ff0080" },
  { sym: "fn()", r: 58, angle: 220, cw: true,  dur: 17, color: "#00ff88" },
  { sym: "=>",   r: 40, angle: 315, cw: false, dur: 11, color: "#bf00ff" },
  { sym: "[ ]",  r: 53, angle:  75, cw: true,  dur: 15, color: "#ff6b00" },
  { sym: "::",   r: 45, angle: 185, cw: false, dur: 12, color: "#3178c6" },
];
const CX = 65, CY = 65;

function OrbitWidget() {
  return (
    <div className="relative shrink-0 mx-auto" style={{ width: 130, height: 130 }}>
      {/* Ghost orbit rings */}
      {[58, 44].map((r) => (
        <div key={r} className="absolute rounded-full pointer-events-none"
          style={{ left: CX - r, top: CY - r, width: r * 2, height: r * 2,
            border: "1px dashed rgba(255,255,255,0.06)" }} />
      ))}

      {/* Rotating outer ring with gap */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ left: CX - 62, top: CY - 62, width: 124, height: 124,
          border: "1px solid rgba(0,245,255,0.09)",
          borderTopColor: "rgba(0,245,255,0.35)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />

      {/* Counter-rotating inner ring */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ left: CX - 36, top: CY - 36, width: 72, height: 72,
          border: "1px solid rgba(191,0,255,0.08)",
          borderBottomColor: "rgba(191,0,255,0.3)" }}
        animate={{ rotate: [0, -360] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }} />

      {/* Center icon */}
      <div className="absolute flex items-center justify-center"
        style={{ left: CX - 18, top: CY - 18, width: 36, height: 36 }}>
        <motion.div className="absolute rounded-full"
          style={{ width: 36, height: 36, background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.22)" }}
          animate={{ boxShadow: ["0 0 6px rgba(0,245,255,0.15)", "0 0 22px rgba(0,245,255,0.4)", "0 0 6px rgba(0,245,255,0.15)"] }}
          transition={{ duration: 2.2, repeat: Infinity }} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "relative", zIndex: 1 }}>
          <path d="M8 2L13 8L8 14L3 8Z" stroke="#00f5ff" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(0,245,255,0.12)" />
          <circle cx="8" cy="8" r="1.5" fill="#00f5ff" fillOpacity="0.9" />
        </svg>
      </div>

      {/* Orbiting tokens */}
      {TOKENS.map((t, i) => (
        <motion.div key={i} className="absolute"
          style={{ left: CX, top: CY, width: 0, height: 0 }}
          animate={{ rotate: [t.angle, t.angle + (t.cw ? 360 : -360)] }}
          transition={{ duration: t.dur, repeat: Infinity, ease: "linear" }}
        >
          <motion.span className="absolute select-none"
            style={{
              left: t.r - 12, top: -7,
              color: t.color,
              fontFamily: "var(--font-geist-mono)",
              fontSize: 9, fontWeight: 700,
              textShadow: `0 0 8px ${t.color}99`,
              whiteSpace: "nowrap",
            }}
            animate={{
              rotate: [-(t.angle), -(t.angle) + (t.cw ? -360 : 360)],
              opacity: [0.55, 1, 0.55],
            }}
            transition={{ duration: t.dur, repeat: Infinity, ease: "linear",
              opacity: { duration: 1.6 + i * 0.2, repeat: Infinity, ease: "easeInOut" } }}
          >
            {t.sym}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
}

const TECH_TAGS = [
  { label: "React 19",      color: "#61dafb" },
  { label: "TypeScript",    color: "#3178c6" },
  { label: "Next.js",       color: "#e2e8f0" },
  { label: "Angular",       color: "#dd0031" },
  { label: "Framer Motion", color: "#bf00ff" },
  { label: "Web Audio API", color: "#00f5ff" },
  { label: "UX / UI",       color: "#ff0080" },
];

export default function AudioWakeOverlay({ onEnter }: Props) {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(() => { setVisible(false); onEnter(); }, 380);
  };

  useEffect(() => {
    const cb = () => { if (!leaving) handleEnter(); };
    window.addEventListener("keydown", cb, { once: true });
    return () => window.removeEventListener("keydown", cb);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(12px) saturate(120%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          onClick={handleEnter}
        >
          <motion.div
            ref={cardRef}
            className="relative flex flex-col overflow-hidden mx-4"
            style={{
              width: 340,
              background: "rgba(7,9,16,0.97)",
              border: "1px solid rgba(0,245,255,0.16)",
              borderRadius: 16,
              boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 28px 72px rgba(0,0,0,0.75), 0 0 48px rgba(0,245,255,0.06)",
            }}
            initial={{ y: 24, opacity: 0, scale: 0.93 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -14, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── Windows-style title bar ── */}
            <div className="flex items-center shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)" }}>
              {/* Left: small app icon + title */}
              <div className="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-0">
                {/* App icon — diamond */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M6 1L11 6L6 11L1 6Z" stroke="rgba(0,245,255,0.7)" strokeWidth="1" fill="rgba(0,245,255,0.1)" />
                  <circle cx="6" cy="6" r="1.2" fill="rgba(0,245,255,0.8)" />
                </svg>
                <span className="text-[11px] tracking-wide truncate"
                  style={{ color: "rgba(148,163,184,0.45)", fontFamily: "var(--font-geist-mono)" }}>
                  portfolio.tsx
                </span>
              </div>
              {/* Right: Windows-style square control buttons */}
              <div className="flex items-stretch h-full self-stretch">
                {/* Minimize — disabled/cosmetic */}
                <div className="flex items-center justify-center px-4 py-2.5 cursor-default select-none"
                  style={{ color: "rgba(148,163,184,0.28)" }}>
                  <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
                    <line x1="0" y1="1" x2="10" y2="1" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                {/* Maximize — disabled/cosmetic */}
                <div className="flex items-center justify-center px-4 py-2.5 cursor-default select-none"
                  style={{ color: "rgba(148,163,184,0.28)" }}>
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <rect x="0.6" y="0.6" width="7.8" height="7.8" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </div>
                {/* Close — functional */}
                <motion.button
                  className="flex items-center justify-center px-4 py-2.5 cursor-pointer border-none bg-transparent select-none"
                  style={{ color: "rgba(148,163,184,0.4)" }}
                  whileHover={{ background: "rgba(232,17,35,0.85)", color: "#ffffff" }}
                  whileTap={{ background: "rgba(232,17,35,0.6)" }}
                  onClick={handleEnter}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex flex-col items-center gap-5 px-5 pt-6 pb-5">

              {/* Creative orbit visual */}
              <OrbitWidget />

              {/* Simple message */}
              <div className="flex flex-col items-center gap-1.5 text-center">
                <motion.h2 className="text-sm font-semibold tracking-wide"
                  style={{ color: "rgba(226,232,240,0.9)" }}
                  animate={{ opacity: [0.75, 1, 0.75] }}
                  transition={{ duration: 3, repeat: Infinity }}>
                  welcome to my portfolio
                </motion.h2>
                <p className="text-[11px]"
                  style={{ color: "rgba(100,116,139,0.65)", fontFamily: "var(--font-geist-mono)" }}>
                  tap to unlock the full experience
                </p>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap justify-center gap-1.5">
                {TECH_TAGS.map(({ label, color }) => (
                  <span key={label} className="text-[10px] px-2 py-0.5 rounded-full tracking-wide"
                    style={{
                      background: `${color}0d`, border: `1px solid ${color}22`,
                      color, fontFamily: "var(--font-geist-mono)",
                    }}>
                    {label}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                className="relative flex items-center justify-center gap-2.5 w-full py-3 rounded-xl font-bold text-sm tracking-[0.18em] overflow-hidden cursor-pointer select-none border-none"
                style={{
                  background: "linear-gradient(135deg, rgba(0,245,255,0.09) 0%, rgba(191,0,255,0.09) 100%)",
                  border: "1px solid rgba(0,245,255,0.28)",
                  color: "#00f5ff",
                  fontFamily: "var(--font-geist-mono)",
                }}
                whileHover={{ borderColor: "rgba(0,245,255,0.6)", scale: 1.02,
                  boxShadow: "0 0 30px rgba(0,245,255,0.22)" }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEnter}
              >
                {/* Shimmer sweep */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 25%, rgba(0,245,255,0.08) 50%, transparent 75%)" }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} />
                {/* Pulse dot */}
                <span className="relative flex w-2 h-2 shrink-0">
                  <motion.span className="absolute inline-flex w-full h-full rounded-full"
                    style={{ background: "#00f5ff" }}
                    animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }} />
                  <span className="relative w-2 h-2 rounded-full" style={{ background: "#00f5ff" }} />
                </span>
                <span className="relative">BEGIN EXPERIENCE</span>
              </motion.button>

              {/* Hint */}
              <motion.p className="text-center text-[10px] tracking-[0.18em] -mt-1"
                style={{ color: "rgba(100,116,139,0.5)", fontFamily: "var(--font-geist-mono)" }}
                animate={{ opacity: [0.4, 0.85, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity }}>
                tap anywhere · press any key
              </motion.p>
            </div>

            {/* Bottom glow line */}
            <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.22), rgba(191,0,255,0.18), transparent)" }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
