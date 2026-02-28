"use client";
import { useState, useCallback } from "react";
import { SoundProvider } from "@/components/sound/SoundManager";
import { ZScrollContainer } from "@/components/ZAxisScroll/ZScrollContainer";
import { ZScrollSection } from "@/components/ZAxisScroll/ZScrollSection";
import { Header } from "@/components/Header/Header";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";

const SECTION_COUNT = 5;

function Portfolio() {
  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* 3D Z-axis scroll container with all sections */}
      <ZScrollContainer
        sectionCount={SECTION_COUNT}
        overlay={
          <>
            <Header />
            <CursorGlow />
          </>
        }
      >
        <ZScrollSection index={0} id="home">
          <HeroSection />
        </ZScrollSection>

        <ZScrollSection index={1} id="about">
          <AboutSection />
        </ZScrollSection>

        <ZScrollSection index={2} id="skills">
          <SkillsSection />
        </ZScrollSection>

        <ZScrollSection index={3} id="projects">
          <ProjectsSection />
        </ZScrollSection>

        <ZScrollSection index={4} id="contact">
          <ContactSection />
        </ZScrollSection>
      </ZScrollContainer>
    </div>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);

  return (
    <SoundProvider>
      <IntroLoader onDone={handleDone} />
      {loaded && <Portfolio />}
    </SoundProvider>
  );
}
