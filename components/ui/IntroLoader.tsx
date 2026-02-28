"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroLoaderProps {
  onDone: () => void;
}

export function IntroLoader({ onDone }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 18 + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("done"), 200);
          setTimeout(() => onDone(), 800);
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase === "loading" && (
        <motion.div
          className="fixed inset-0 z-99999 flex flex-col items-center justify-center bg-black"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <motion.div
            className="mb-10"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black animate-pulse-glow"
              style={{
                background: "linear-gradient(135deg, #00f5ff22, #bf00ff22)",
                border: "1px solid rgba(0,245,255,0.4)",
                color: "var(--neon-cyan)",
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              &lt;/&gt;
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-56 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))",
                width: `${progress}%`,
                boxShadow: "0 0 12px rgba(0,245,255,0.5)",
              }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          <motion.div
            className="mt-4 text-xs tracking-[0.4em] uppercase"
            style={{ color: "rgba(0,245,255,0.5)", fontFamily: "var(--font-geist-mono)" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {progress < 100 ? "Initializing..." : "Launching..."}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
