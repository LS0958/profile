"use client";
import { motion } from "framer-motion";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { GlitchText } from "@/components/ui/GlitchText";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { useSound } from "@/hooks/useSound";
import { ArrowDown, Code2, Brain, Zap } from "lucide-react";
import { useZScrollContext } from "@/components/ZAxisScroll/ZScrollContext";
import { useSectionAnimKey } from "@/hooks/useSectionAnimKey";

const STATS = [
  { label: "Projects", value: "40+", icon: Code2, color: "cyan" as const },
  { label: "Experience", value: "3+ yrs", icon: Zap, color: "purple" as const },
  { label: "AI Models", value: "12+", icon: Brain, color: "pink" as const },
];

const TYPEWRITER_TEXTS = [
  "Full Stack Developer",
  "AI/ML Engineer",
  "Next.js Specialist",
  "Cloud Architect",
  "Open Source Contributor",
];

export function HeroSection() {
  const { playClick } = useSound();
  const { scrollToSection } = useZScrollContext();
  const animKey = useSectionAnimKey(0);

  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden scanlines noise bg-black pt-16">
      {/* Canvas particle background */}
      <ParticleBackground count={80} />

      {/* Radial gradient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,245,255,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Scanline sweep */}
      <div
        className="absolute w-full h-1 animate-scanline pointer-events-none"
        style={{
          background: "linear-gradient(transparent, rgba(0,245,255,0.15), transparent)",
          zIndex: 2,
        }}
      />

      {/* Content layer — key={animKey} forces re-mount (and thus re-animation) on every visit */}
      <div key={animKey} className="relative z-10 flex flex-col items-center gap-8 px-4 text-center max-w-4xl w-full">
        {/* Profile photo with rings */}
        <motion.div
          className="relative"
          initial={{ scale: 0.3, opacity: 0, rotate: -200 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full profile-ring-outer"
            style={{
              padding: 3,
              background: "conic-gradient(from 0deg, #00f5ff, #bf00ff, #ff0080, #00f5ff)",
              borderRadius: "50%",
              transform: "scale(1.08)",
            }}
          >
            <div className="w-full h-full rounded-full bg-black" />
          </div>

          {/* Inner ring */}
          <div
            className="absolute inset-0 rounded-full profile-ring-inner"
            style={{
              padding: 2,
              background: "conic-gradient(from 180deg, #00ff88, #00f5ff, #bf00ff, #00ff88)",
              borderRadius: "50%",
              transform: "scale(1.16)",
            }}
          >
            <div className="w-full h-full rounded-full bg-black/50" />
          </div>

          {/* Outer glow ring */}
          <div
            className="absolute rounded-full animate-pulse-glow pointer-events-none"
            style={{
              inset: -10,
              borderRadius: "50%",
              boxShadow: "0 0 30px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)",
            }}
          />

          {/* Photo */}
          <div
            className="relative w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden"
            style={{ border: "3px solid rgba(0,245,255,0.5)" }}
          >
            <div
              className="w-full h-full flex items-center justify-center text-5xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,245,255,0.15), rgba(191,0,255,0.15))",
              }}
            >
              👨‍💻
            </div>
          </div>
        </motion.div>

        {/* Status badge */}
        <motion.div
          className="flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs"
          style={{ border: "1px solid rgba(0,255,136,0.3)", color: "#00ff88", fontFamily: "var(--font-geist-mono)" }}
          initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.55 }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 relative">
            <span
              className="absolute inset-0 rounded-full bg-green-400 animate-ping"
              style={{ opacity: 0.6 }}
            />
          </span>
          Available for exciting projects
        </motion.div>

        {/* Name with glitch */}
        <motion.div
          initial={{ opacity: 0, x: -80, skewX: -15 }}
          animate={{ opacity: 1, x: 0, skewX: 0 }}
          transition={{ delay: 0.4, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlitchText
            text="Lal Chand"
            as="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text-cyan"
          />
        </motion.div>

        {/* Typewriter subtitle */}
        <motion.div
          className="text-xl md:text-2xl font-medium"
          style={{ color: "rgba(226,232,240,0.7)", fontFamily: "var(--font-geist-mono)", minHeight: "1.8rem" }}
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          <TypewriterText texts={TYPEWRITER_TEXTS} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="max-w-xl text-sm md:text-base leading-relaxed"
          style={{ color: "rgba(148,163,184,0.8)" }}
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          Building next-generation web experiences with AI-powered backends, real-time systems,
          and interfaces that feel like the future.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 30, scale: 0.82 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1, duration: 0.6, type: "spring", bounce: 0.35 }}
        >
          <motion.button
            className="btn-neon px-8 py-3 rounded-xl text-sm font-semibold tracking-widest"
            style={{ fontFamily: "var(--font-geist-mono)" }}
            onClick={() => { playClick(); scrollToSection(3); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            VIEW PROJECTS
          </motion.button>
          <motion.button
            className="px-8 py-3 rounded-xl text-sm font-semibold tracking-widest transition-all"
            style={{
              border: "1px solid rgba(191,0,255,0.4)",
              color: "var(--neon-purple)",
              fontFamily: "var(--font-geist-mono)",
              background: "rgba(191,0,255,0.05)",
            }}
            onClick={() => { playClick(); scrollToSection(4); }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(191,0,255,0.4)",
              borderColor: "rgba(191,0,255,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            CONTACT ME
          </motion.button>
        </motion.div>

        {/* Scroll hint */}
      <motion.div
        className="bottom-8 flex flex-col items-center justify-center gap-2"
        style={{ zIndex: 10 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <span
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: "rgba(0,245,255,0.5)", fontFamily: "var(--font-geist-mono)" }}
        >
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          style={{ color: "var(--neon-cyan)" }}
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>

        {/* Floating stat cards */}
        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 30, scale: 0.78 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.65, type: "spring", bounce: 0.4 }}
        >
          {STATS.map((stat, i) => (
            <FloatingCard
              key={stat.label}
              glowColor={stat.color}
              delay={1.2 + i * 0.15}
              className="px-5 py-3 flex items-center gap-3 min-w-32.5"
            >
              <stat.icon
                size={20}
                style={{ color: `var(--neon-${stat.color === "cyan" ? "cyan" : stat.color === "purple" ? "purple" : "pink"})` }}
              />
              <div>
                <div
                  className="text-xl font-black leading-none"
                  style={{ color: `var(--neon-${stat.color === "cyan" ? "cyan" : stat.color === "purple" ? "purple" : "pink"})` }}
                >
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(148,163,184,0.7)", fontFamily: "var(--font-geist-mono)" }}>
                  {stat.label}
                </div>
              </div>
            </FloatingCard>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
