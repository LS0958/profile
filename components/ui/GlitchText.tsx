"use client";
import React from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export function GlitchText({ text, className = "", as = "span" }: GlitchTextProps) {
  return React.createElement(
    as,
    {
      className: `relative inline-block animate-glitch ${className}`,
      "data-text": text,
      style: { position: "relative" },
    },
    text,
    React.createElement(
      "style",
      null,
      `
        [data-text="${text}"]::before,
        [data-text="${text}"]::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
        }
        [data-text="${text}"]::before {
          color: #00f5ff;
          animation: glitch 8s ease-in-out 0.1s infinite;
          clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
          mix-blend-mode: screen;
        }
        [data-text="${text}"]::after {
          color: #bf00ff;
          animation: glitch 8s ease-in-out 0.2s infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          mix-blend-mode: screen;
        }
      `
    )
  );
}
