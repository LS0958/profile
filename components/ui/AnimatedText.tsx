"use client";
import { motion, type Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  mode?: "words" | "chars";
}

export function AnimatedText({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
  mode = "words",
}: AnimatedTextProps) {
  const items = mode === "chars" ? text.split("") : text.split(" ");

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {items.map((w, i) => (
        <motion.span key={i} variants={item} className="inline-block">
          {w === " " ? "\u00A0" : w}
        </motion.span>
      ))}
    </motion.span>
  );
}
