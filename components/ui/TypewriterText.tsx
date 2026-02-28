"use client";
import { useState, useEffect } from "react";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
}

export function TypewriterText({
  texts,
  className = "",
  speed = 80,
  deleteSpeed = 40,
  pauseMs = 1800,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const [textIdx, setTextIdx] = useState(0);

  useEffect(() => {
    const target = texts[textIdx];

    if (phase === "typing") {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("pausing"), pauseMs);
        return () => clearTimeout(t);
      }
    }

    if (phase === "pausing") {
      setPhase("deleting");
    }

    if (phase === "deleting") {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed);
        return () => clearTimeout(t);
      } else {
        setTextIdx((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
  }, [displayed, phase, textIdx, texts, speed, deleteSpeed, pauseMs]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-blink" style={{ color: "var(--neon-cyan)" }}>
        |
      </span>
    </span>
  );
}
