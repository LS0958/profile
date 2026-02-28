"use client";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { FloatingCard } from "@/components/ui/FloatingCard";
import { useSound } from "@/hooks/useSound";
import { useSectionAnimKey } from "@/hooks/useSectionAnimKey";
import { Send, Github, Linkedin, Twitter, Mail, MessageSquare, User, AtSign, FileText, CheckCircle } from "lucide-react";

const SOCIALS = [
  { icon: Github, label: "GitHub", href: "https://github.com", color: "#fff" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com", color: "#0a66c2" },
  { icon: Twitter, label: "Twitter/X", href: "https://x.com", color: "#1da1f2" },
  { icon: Mail, label: "Email", href: "mailto:lalchandra485@gmail.com", color: "var(--neon-cyan)" },
  { icon: MessageSquare, label: "Discord", href: "#", color: "#5865f2" },
];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function ContactSection() {
  const animKey = useSectionAnimKey(4);
  const { playClick, playHover, playKeyPress, playSuccess } = useSound();

  // Throttle keypress sound to max once every 80 ms — sounds natural at any typing speed.
  const lastKeyRef = useRef(0);
  const onKey = useCallback(() => {
    const now = Date.now();
    if (now - lastKeyRef.current < 80) return;
    lastKeyRef.current = now;
    playKeyPress();
  }, [playKeyPress]);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  /**
   * Google Sheets integration via Google Apps Script web app.
   *
   * ── PASTE THIS FULL SCRIPT in your Apps Script editor ──
   *
   *  function doPost(e) {
   *    const sheet  = SpreadsheetApp.openById("1dHzX2ERxP_ZfF2h24CEKpB-2zbEe2WjSIiPXiaLyoOk")
   *                     .getActiveSheet();
   *    const data   = JSON.parse(e.postData.contents);
   *    const serial = sheet.getLastRow();   // Row 1 = header → first entry gets serial 1
   *    const now    = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
   *    sheet.appendRow([serial, data.name, data.email, data.subject, data.message, now]);
   *    return ContentService.createTextOutput("ok");
   *  }
   *
   * ── SHEET HEADER ROW (Row 1) — add manually once in your Google Sheet ──
   *  S.No | Name | Email | Subject | Message | Received At
   *
   * After pasting the script:
   *  1. Click "Deploy" → "New deployment" → Type: Web App
   *  2. Execute as: Me  |  Who has access: Anyone
   *  3. Click Deploy → copy the web app URL → paste in .env.local as NEXT_PUBLIC_GOOGLE_SHEET_URL
   */
  const SHEET_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL ?? "";

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setSending(true);
    setError(null);

    try {
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          mode: "no-cors", // Apps Script requires no-cors; response is opaque but submission works
        });
      }
      setSubmitted(true);
      playSuccess();
    } catch {
      setError("Failed to send. Please try emailing directly.");
    } finally {
      setSending(false);
    }
  };

  const inputBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "rgba(226,232,240,0.9)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "14px",
    width: "100%",
    padding: "12px 16px",
    outline: "none",
    transition: "all 0.25s ease",
  };

  const focusedStyle = (field: string): React.CSSProperties =>
    focused === field
      ? { borderColor: "var(--neon-cyan)", boxShadow: "0 0 0 2px rgba(0,245,255,0.12)" }
      : {};

  return (
    <section className="relative w-full h-full flex flex-col overflow-hidden bg-black pt-16">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,245,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div key={animKey} className="relative z-10 flex-1 overflow-y-auto px-6 md:px-10 py-8 max-w-5xl mx-auto w-full"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,245,255,0.2) transparent" }}>
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          variants={fadeInUp}
          initial="hidden"
          animate="show"
        >
          <div
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--neon-cyan)", fontFamily: "var(--font-geist-mono)" }}
          >
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-black gradient-text-cyan">
            Let&apos;s Build Together
          </h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(148,163,184,0.6)" }}>
            Open to full-time roles, freelance projects, and AI collaborations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Socials + info */}
          <motion.div
            className="flex flex-col gap-6"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeInUp}>
              <p className="text-base leading-relaxed" style={{ color: "rgba(148,163,184,0.8)" }}>
                Whether you have a product idea, need a technical co-founder, want to integrate AI into
                your existing stack, or just want to chat tech — my inbox is always open.
              </p>
            </motion.div>

            {/* Social orbs */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              {SOCIALS.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2"
                  style={{ textDecoration: "none" }}
                  onHoverStart={playHover}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ scale: 1.12, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={playClick}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center glass"
                    style={{
                      border: `1px solid ${s.color}30`,
                      color: s.color,
                      boxShadow: `0 0 0 0 ${s.color}`,
                      transition: "box-shadow 0.3s ease",
                    }}
                  >
                    <s.icon size={22} />
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: "rgba(148,163,184,0.5)", fontFamily: "var(--font-geist-mono)" }}
                  >
                    {s.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>

            {/* Quick info */}
            <motion.div variants={fadeInUp}>
              <FloatingCard glowColor="cyan" className="p-5" delay={0.4}>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Email", val: "lalchandra485@gmail.com", icon: Mail },
                    { label: "Location", val: "Chandigarh, India", icon: "📍" },
                    { label: "Response time", val: "Within 24 hours", icon: "⚡" },
                  ].map((info) => (
                    <div key={info.label} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)" }}
                      >
                        {typeof info.icon === "string" ? (
                          info.icon
                        ) : (
                          <info.icon size={14} style={{ color: "var(--neon-cyan)" }} />
                        )}
                      </div>
                      <div>
                        <div className="text-xs" style={{ color: "rgba(148,163,184,0.5)", fontFamily: "var(--font-geist-mono)" }}>
                          {info.label}
                        </div>
                        <div className="text-sm" style={{ color: "rgba(226,232,240,0.85)" }}>
                          {info.val}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </FloatingCard>
            </motion.div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="glass rounded-2xl p-6 flex flex-col gap-4"
                  style={{ border: "1px solid rgba(0,245,255,0.12)" }}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="grid grid-cols-2 gap-4 contact-grid-2">
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: "rgba(148,163,184,0.6)", fontFamily: "var(--font-geist-mono)" }}>
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        style={{ ...inputBase, ...focusedStyle("name") }}
                        onFocus={() => { setFocused("name"); playClick(); }}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); onKey(); }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1.5" style={{ color: "rgba(148,163,184,0.6)", fontFamily: "var(--font-geist-mono)" }}>
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={form.email}
                        style={{ ...inputBase, ...focusedStyle("email") }}
                        onFocus={() => { setFocused("email"); playClick(); }}
                        onBlur={() => setFocused(null)}
                        onChange={(e) => { setForm({ ...form, email: e.target.value }); onKey(); }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: "rgba(148,163,184,0.6)", fontFamily: "var(--font-geist-mono)" }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Project Inquiry / Collaboration"
                      value={form.subject}
                      style={{ ...inputBase, ...focusedStyle("subject") }}
                      onFocus={() => { setFocused("subject"); playClick(); }}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => { setForm({ ...form, subject: e.target.value }); onKey(); }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs mb-1.5" style={{ color: "rgba(148,163,184,0.6)", fontFamily: "var(--font-geist-mono)" }}>
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell me about your project..."
                      value={form.message}
                      style={{
                        ...inputBase,
                        resize: "none",
                        ...focusedStyle("message"),
                      }}
                      onFocus={() => { setFocused("message"); playClick(); }}
                      onBlur={() => setFocused(null)}
                      onChange={(e) => { setForm({ ...form, message: e.target.value }); onKey(); }}
                    />
                  </div>

                  {error && (
                    <p className="text-xs text-center" style={{ color: "#ff6b6b", fontFamily: "var(--font-geist-mono)" }}>
                      {error}
                    </p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={sending}
                    className="btn-neon py-3 rounded-xl text-sm font-semibold tracking-widest flex items-center justify-center gap-2"
                    style={{ fontFamily: "var(--font-geist-mono)", opacity: sending ? 0.7 : 1 }}
                    whileHover={sending ? {} : { scale: 1.02 }}
                    whileTap={sending ? {} : { scale: 0.97 }}
                  >
                    <Send size={15} />
                    {sending ? "SENDING..." : "SEND MESSAGE"}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  className="relative glass rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-6 text-center"
                  style={{ border: "1px solid rgba(0,255,136,0.3)", minHeight: "340px", padding: "3rem 2rem" }}
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Particle burst */}
                  {[...Array(12)].map((_, i) => {
                    const angle = (i / 12) * 360;
                    const dist = 70 + Math.random() * 40;
                    const colors = ["var(--neon-green)", "var(--neon-cyan)", "var(--neon-purple)", "#ff6b00", "var(--neon-pink)"];
                    return (
                      <motion.div key={i}
                        className="absolute w-2 h-2 rounded-full pointer-events-none"
                        style={{ background: colors[i % colors.length], left: "50%", top: "50%" }}
                        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                        animate={{
                          x: Math.cos((angle * Math.PI) / 180) * dist,
                          y: Math.sin((angle * Math.PI) / 180) * dist,
                          opacity: 0, scale: 0,
                        }}
                        transition={{ duration: 0.9, delay: i * 0.04, ease: "easeOut" }}
                      />
                    );
                  })}

                  {/* Glowing backdrop circle */}
                  <motion.div className="absolute w-40 h-40 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, rgba(0,255,136,0.12) 0%, transparent 70%)", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}
                    animate={{ scale: [0.5, 1.4, 1] }} transition={{ duration: 0.8, ease: "easeOut" }}
                  />

                  {/* Check icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 20 }}
                  >
                    <CheckCircle size={64} strokeWidth={1.5} color="var(--neon-green)"
                      style={{ filter: "drop-shadow(0 0 18px rgba(0,255,136,0.7))" }} />
                  </motion.div>

                  {/* Text */}
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-black mb-1"
                      style={{ color: "var(--neon-green)", textShadow: "0 0 20px rgba(0,255,136,0.5)" }}
                    >Thank You!</h3>
                    <p className="text-sm" style={{ color: "rgba(148,163,184,0.75)" }}>
                      Message received — I&apos;ll reply within 24&nbsp;hours.
                    </p>
                  </motion.div>

                  {/* Animated dots row */}
                  <motion.div className="flex gap-2" initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  >
                    {["var(--neon-green)", "var(--neon-cyan)", "var(--neon-purple)"].map((c, i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: c }}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ delay: i * 0.15, duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </motion.div>

                  {/* Reset */}
                  <motion.button
                    className="text-xs px-5 py-2 rounded-xl"
                    style={{ border: "1px solid rgba(0,255,136,0.3)", color: "var(--neon-green)",
                      fontFamily: "var(--font-geist-mono)", background: "transparent" }}
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); setError(null); setSending(false); playClick(); }}
                    whileHover={{ scale: 1.05, background: "rgba(0,255,136,0.08)" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    ↩ Send Another Message
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          className="mt-12 pt-8 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div
            className="text-sm mb-2 gradient-text-cyan font-bold"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            &lt;Lal Chand /&gt;
          </div>
          <p className="text-xs" style={{ color: "rgba(148,163,184,0.4)" }}>
            Built with Next.js 16 · Tailwind v4 · Framer Motion · deployed on Vercel
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(148,163,184,0.25)", fontFamily: "var(--font-geist-mono)" }}>
            © {new Date().getFullYear()} · All rights reserved
          </p>
        </motion.footer>
      </div>
    </section>
  );
}
