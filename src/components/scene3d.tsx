"use client";

import { Component, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { Lang } from "@/lib/types";

/**
 * A 3D scene inside a lesson. three.js is heavy, so it is fetched only when
 * the scene comes near the screen, and only on the pages that have one. The
 * box keeps its height while it loads, so nothing jumps. Without WebGL the
 * caption alone stays.
 */

const SceneM01 = dynamic(() => import("@/content/scenes-m01").then((m) => m.SceneM01), {
  ssr: false,
  loading: () => <Placeholder />,
});

function Placeholder() {
  return <div aria-hidden className="h-[280px] animate-pulse rounded-[4px] bg-surface-2 sm:h-[340px]" />;
}

class Guard extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Scene3D({ id, caption, lang }: { id: string; caption?: string; lang: Lang }) {
  const box = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    setWebgl(hasWebGL());
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const unavailable = (
    <p className="t-small rounded-[4px] border border-dashed border-line px-4 py-3 text-muted">
      {lang === "es" ? "Este navegador no puede mostrar la escena 3D." : "This browser cannot show the 3D scene."}
    </p>
  );

  return (
    <figure ref={box} className="my-8">
      <p className="t-eyebrow mb-2 text-accent">{lang === "es" ? "Escena 3D · arrastra para girarla" : "3D scene · drag to turn it"}</p>
      {!webgl ? unavailable : near ? <Guard fallback={unavailable}><SceneM01 id={id} lang={lang} /></Guard> : <Placeholder />}
      {caption && <figcaption className="t-small mt-2.5 text-muted">{caption}</figcaption>}
    </figure>
  );
}
