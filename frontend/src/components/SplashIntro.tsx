"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function SplashIntro({ children }: Props) {
  const [phase, setPhase] = useState<"intro" | "exit" | "done">("intro");

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase("exit"), 2200);
    const doneTimer = window.setTimeout(() => setPhase("done"), 2800);
    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === "done") {
    return <>{children}</>;
  }

  return (
    <div
      className={`splash-root ${phase === "exit" ? "splash-exit" : ""}`}
      aria-hidden
    >
      <div className="splash-grid" />

      <div className="splash-hand splash-hand-robot">
        <Image
          src="/splash/robot-hand.png"
          alt=""
          width={720}
          height={720}
          priority
          className="splash-hand-img"
        />
      </div>

      <div className="splash-hand splash-hand-human">
        <Image
          src="/splash/human-hand.png"
          alt=""
          width={720}
          height={720}
          priority
          className="splash-hand-img"
        />
      </div>

      <div className="splash-center">
        <p className="splash-brand">Helix</p>
        <p className="splash-line">Intelligent triage.</p>
      </div>
    </div>
  );
}
