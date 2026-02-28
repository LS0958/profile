"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "pink" | "green";
  delay?: number;
  style?: React.CSSProperties;
}

const glowMap = {
  cyan: "rgba(0,245,255,0.35)",
  purple: "rgba(191,0,255,0.35)",
  pink: "rgba(255,0,128,0.35)",
  green: "rgba(0,255,136,0.35)",
};

const borderMap = {
  cyan: "rgba(0,245,255,0.25)",
  purple: "rgba(191,0,255,0.25)",
  pink: "rgba(255,0,128,0.25)",
  green: "rgba(0,255,136,0.25)",
};

export function FloatingCard({
  children,
  className = "",
  glowColor = "cyan",
  delay = 0,
  style,
}: FloatingCardProps) {
  const { playHover } = useSound();
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`glass rounded-2xl relative overflow-hidden ${className}`}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        border: `1px solid ${borderMap[glowColor]}`,
        ...style,
      }}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -8,
        boxShadow: `0 20px 60px ${glowMap[glowColor]}, 0 0 30px ${glowMap[glowColor]}`,
        transition: { duration: 0.25 },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={playHover}
    >
      {/* Inner glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glowMap[glowColor].replace("0.35", "0.08")} 0%, transparent 70%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
