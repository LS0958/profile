"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Menu, X, ChevronDown, Download, ExternalLink } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useZScrollContext } from "@/components/ZAxisScroll/ZScrollContext";

const NAV_ITEMS = [
  { label: "Home", idx: 0 },
  { label: "About", idx: 1 },
  { label: "Skills", idx: 2 },
  { label: "Projects", idx: 3 },
  { label: "Contact", idx: 4 },
];

const DROPDOWN_ITEMS = [
  { label: "Resume", icon: Download, href: "#" },
  { label: "GitHub", icon: ExternalLink, href: "https://github.com" },
  { label: "LinkedIn", icon: ExternalLink, href: "https://linkedin.com" },
];

export function Header() {
  const { playClick, playHover, playTransition, playMenuSlide, muted, toggleMute } = useSound();
  const { currentIndex, scrollToSection } = useZScrollContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  // Fire staggered deploy sounds matching each item's animation delay
  useEffect(() => {
    if (!menuOpen) return;
    NAV_ITEMS.forEach((_, i) => {
      const t = setTimeout(() => playMenuSlide(i), i * 80);
      return () => clearTimeout(t);
    });
  }, [menuOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!dropOpen) return;
    DROPDOWN_ITEMS.forEach((_, i) => {
      const t = setTimeout(() => playMenuSlide(i), i * 70);
      return () => clearTimeout(t);
    });
  }, [dropOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNav = (idx: number) => {
    playTransition();
    scrollToSection(idx);
    setMenuOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-9999 glass border-b"
      style={{ borderColor: "rgba(0,245,255,0.12)" }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between px-6 md:px-10 h-16">
        {/* Logo */}
        <motion.button
          className="flex items-center gap-2 group"
          onClick={() => { playClick(); handleNav(0); }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, #00f5ff, #bf00ff)",
              color: "#000",
              fontFamily: "var(--font-geist-mono)",
            }}
          >
            DEV
          </div>
          <span
            className="hidden sm:block font-bold text-sm gradient-text-cyan"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            &lt;Portfolio /&gt;
          </span>
        </motion.button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item.label}
              onClick={() => handleNav(item.idx)}
              onHoverStart={playHover}
              className="relative px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: currentIndex === item.idx ? "var(--neon-cyan)" : "rgba(226,232,240,0.7)",
                fontFamily: "var(--font-geist-mono)",
              }}
              whileHover={{ color: "var(--neon-cyan)" }}
              whileTap={{ scale: 0.95 }}
            >
              {currentIndex === item.idx && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 pl-3">{item.label}</span>
            </motion.button>
          ))}

          {/* More dropdown */}
          <div className="relative">
            <motion.button
              onHoverStart={() => { playHover(); setDropOpen(true); }}
              onHoverEnd={() => setDropOpen(false)}
              onClick={() => setDropOpen((v) => !v)}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg"
              style={{ color: "rgba(226,232,240,0.7)", fontFamily: "var(--font-geist-mono)" }}
              whileHover={{ color: "var(--neon-cyan)" }}
            >
              More
              <motion.span animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} />
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl glass overflow-hidden"
                  style={{ border: "1px solid rgba(0,245,255,0.18)" }}
                  initial={{ opacity: 0, y: -10, scaleY: 0.88, transformOrigin: "top" }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  {/* Horizontal scan line sweeps top→bottom on open */}
                  <motion.div
                    className="absolute left-0 right-0 h-px pointer-events-none z-10"
                    style={{ background: "linear-gradient(90deg, transparent, var(--neon-cyan), transparent)" }}
                    initial={{ top: 0, opacity: 1 }}
                    animate={{ top: "100%", opacity: 0 }}
                    transition={{ duration: 0.35, ease: "linear" }}
                  />
                  {DROPDOWN_ITEMS.map((d, i) => (
                    <motion.a
                      key={d.label}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors overflow-hidden"
                      style={{ color: "rgba(226,232,240,0.8)", fontFamily: "var(--font-geist-mono)" }}
                      onHoverStart={playHover}
                      initial={{ opacity: 0, x: -28, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.07, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ color: "var(--neon-cyan)", x: 5 }}
                      onClick={playClick}
                    >
                      {/* Left accent bar draws in */}
                      <motion.div
                        className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full"
                        style={{ background: "var(--neon-cyan)", transformOrigin: "top" }}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: i * 0.07 + 0.12, duration: 0.2, ease: "linear" }}
                      />
                      <motion.span
                        initial={{ rotate: -15, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: i * 0.07 + 0.05, duration: 0.25 }}
                      >
                        <d.icon size={13} />
                      </motion.span>
                      <span className="relative z-10">{d.label}</span>
                      {/* Shimmer sweep on enter */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.07) 50%, transparent 100%)" }}
                        initial={{ x: "-100%" }}
                        animate={{ x: "120%" }}
                        transition={{ delay: i * 0.07 + 0.08, duration: 0.35, ease: "linear" }}
                      />
                    </motion.a>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Hire Me */}
          <motion.button
            className="hidden sm:flex btn-neon px-4 py-1.5 text-xs rounded-lg font-semibold tracking-wider"
            style={{ fontFamily: "var(--font-geist-mono)" }}
            onClick={() => { playClick(); handleNav(4); }}
            onHoverStart={playHover}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            HIRE ME
          </motion.button>

          {/* Sound toggle */}
          <motion.button
            onClick={() => { playClick(); toggleMute(); }}
            onHoverStart={playHover}
            className="w-9 h-9 rounded-lg flex items-center justify-center glass"
            style={{ border: "1px solid rgba(0,245,255,0.2)", color: muted ? "rgba(226,232,240,0.3)" : "var(--neon-cyan)" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </motion.button>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center glass"
            style={{ border: "1px solid rgba(0,245,255,0.2)", color: "var(--neon-cyan)" }}
            onClick={() => { playClick(); setMenuOpen((v) => !v); }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden glass border-t py-4 px-6 relative overflow-hidden backdrop-blur-md"
            style={{ borderColor: "rgba(0,245,255,0.14)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Horizontal scan line sweeps top→bottom on menu open */}
            <motion.div
              className="absolute left-0 right-0 h-px pointer-events-none z-20"
              style={{ background: "linear-gradient(90deg, transparent, var(--neon-cyan) 40%, var(--neon-purple) 60%, transparent)", top: 0 }}
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 200, opacity: 0 }}
              transition={{ duration: 0.55, ease: "linear" }}
            />
            {/* Vertical left rail that draws down */}
            <motion.div
              className="absolute left-5 top-3 bottom-3 w-px pointer-events-none"
              style={{ background: "linear-gradient(180deg, var(--neon-cyan), transparent)", transformOrigin: "top" }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, ease: "linear" }}
            />
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => handleNav(item.idx)}
                  className="relative text-left pl-8 pr-4 py-3 rounded-lg text-sm font-medium overflow-hidden"
                  style={{
                    color: currentIndex === item.idx ? "var(--neon-cyan)" : "rgba(226,232,240,0.75)",
                    fontFamily: "var(--font-geist-mono)",
                    background: currentIndex === item.idx ? "rgba(0,245,255,0.07)" : "transparent",
                  }}
                  initial={{ opacity: 0, x: -72, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ delay: i * 0.08, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ x: 8, color: "var(--neon-cyan)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Left accent dot / connector */}
                  <motion.span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{ background: currentIndex === item.idx ? "var(--neon-cyan)" : "rgba(0,245,255,0.4)" }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.08 + 0.18, duration: 0.2, type: "spring", stiffness: 400 }}
                  />
                  {/* Line index number */}
                  <motion.span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-25 tabular-nums"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    transition={{ delay: i * 0.08 + 0.22 }}
                  >
                    {String(i).padStart(2, "0")}
                  </motion.span>
                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.06) 50%, transparent 100%)" }}
                    initial={{ x: "-100%" }}
                    animate={{ x: "140%" }}
                    transition={{ delay: i * 0.08 + 0.05, duration: 0.45, ease: "linear" }}
                  />
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
