"use client";
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import * as S from "@/lib/syntheticSounds";
import AudioWakeOverlay from "./AudioWakeOverlay";

interface SoundContextValue {
  playClick: () => void;
  playHover: () => void;
  playWhoosh: () => void;
  playTransition: () => void;
  playKeyPress: () => void;
  playMenuSlide: (index: number) => void;
  playSuccess: () => void;
  muted: boolean;
  toggleMute: () => void;
  unlocked: boolean;
}

const SoundContext = createContext<SoundContextValue>({
  playClick: () => {},
  playHover: () => {},
  playWhoosh: () => {},
  playTransition: () => {},
  playKeyPress: () => {},
  playMenuSlide: () => {},
  playSuccess: () => {},
  muted: false,
  toggleMute: () => {},
  unlocked: false,
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const stopAmbient = useRef<(() => void) | null>(null);

  const unlock = useCallback(() => {
    if (unlocked) return;
    // resumeCtx must be called synchronously inside the gesture handler.
    // After resolving, verify the ctx is actually running — wheel events are
    // NOT a "trusted activation" in Chrome so resume() may be silently ignored.
    S.resumeCtx().then(() => {
      if (!S.isCtxRunning()) return; // not a trusted gesture — keep listeners alive
      setUnlocked(true);
      if (!muted) {
        S.playUnlock();
        setTimeout(() => {
          stopAmbient.current = S.startAmbient();
        }, 600);
      }
    });
  }, [unlocked, muted]);

  useEffect(() => {
    // Trusted activation events (browser allows AudioContext.resume from these):
    //   pointerdown — fires on ANY press (mouse, touch, stylus) before click; also
    //                 fires on the very first touch that begins a scroll gesture.
    //   click / keydown / touchstart — belt-and-suspenders for edge cases.
    //
    // wheel / scroll — NOT trusted in Chrome for AudioContext, but we still
    //   register them (without once:true) so they keep retrying; on browsers that
    //   DO allow resume from scroll they will succeed, and on others pointerdown
    //   will catch the next real press.
    const trusted   = { once: true  } as const;
    const untrusted = { passive: true } as const;          // no once — keep retrying

    window.addEventListener("pointerdown", unlock, trusted);
    window.addEventListener("click",       unlock, trusted);
    window.addEventListener("keydown",     unlock, trusted);
    window.addEventListener("touchstart",  unlock, trusted);
    window.addEventListener("wheel",       unlock, untrusted);
    window.addEventListener("scroll",      unlock, untrusted);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("click",       unlock);
      window.removeEventListener("keydown",     unlock);
      window.removeEventListener("touchstart",  unlock);
      window.removeEventListener("wheel",       unlock);
      window.removeEventListener("scroll",      unlock);
    };
  }, [unlock]);

  useEffect(() => {
    return () => {
      stopAmbient.current?.();
    };
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (!m) {
        stopAmbient.current?.();
        stopAmbient.current = null;
      } else if (unlocked) {
        stopAmbient.current = S.startAmbient();
      }
      return !m;
    });
  }, [unlocked]);

  const safe = useCallback(
    (fn: () => void) => () => {
      if (!muted && unlocked) fn();
    },
    [muted, unlocked]
  );

  const safeIdx = useCallback(
    (fn: (i: number) => void) => (i: number) => {
      if (!muted && unlocked) fn(i);
    },
    [muted, unlocked]
  );

  const value: SoundContextValue = {
    playClick: safe(S.playClick),
    playHover: safe(S.playHover),
    playWhoosh: safe(S.playWhoosh),
    playTransition: safe(S.playTransition),
    playKeyPress: safe(S.playKeyPress),
    playMenuSlide: safeIdx(S.playMenuSlide),
    playSuccess: safe(S.playSuccess),
    muted,
    toggleMute,
    unlocked,
  };

  return (
    <SoundContext.Provider value={value}>
      {!unlocked && <AudioWakeOverlay onEnter={unlock} />}
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
