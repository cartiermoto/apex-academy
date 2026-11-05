"use client";

import { Children, createContext, useContext, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { Lang } from "@/lib/types";

/**
 * Shared pieces for the 3D scenes (three.js through React Three Fiber).
 *
 * Every colour comes from the course tokens and follows the theme. The scene
 * is drawn only while it is on screen. Labels are HTML, so they stay crisp and
 * translatable. The buttons that drive a scene live outside the canvas, so it
 * works by keyboard and is announced; dragging only turns the view, and only
 * with a mouse (on touch, dragging must keep scrolling the page). With reduced
 * motion, things jump to where they go instead of travelling.
 */

export type SceneProps = { lang: Lang };
type V3 = [number, number, number];
export const pick = (lang: Lang, es: string, en: string) => (lang === "es" ? es : en);

/* --------------------------------------------------------------- tokens --- */

const VARS = {
  brand: "--c-brand",
  fill: "--c-fill",
  warn: "--c-warn",
  danger: "--c-danger",
  blue: "--c-code-type",
  violet: "--c-code-num",
  text: "--c-text",
  muted: "--c-text-muted",
  faint: "--c-text-faint",
  surface: "--c-surface",
  surface2: "--c-surface-2",
  codeBg: "--c-code-bg",
} as const;
export type Tokens = Record<keyof typeof VARS, string>;

let cache: Tokens | null = null;
const FALLBACK = Object.fromEntries(Object.keys(VARS).map((k) => [k, "#888888"])) as Tokens;
function readTokens(): Tokens {
  const s = getComputedStyle(document.documentElement);
  const out = {} as Tokens;
  for (const [k, v] of Object.entries(VARS)) out[k as keyof Tokens] = s.getPropertyValue(v).trim() || "#888888";
  return out;
}
function subscribe(cb: () => void) {
  const mo = new MutationObserver(() => {
    cache = readTokens();
    cb();
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });
  return () => mo.disconnect();
}
/** The course colours, re-read when the theme changes. */
export function useTokens(): Tokens {
  return useSyncExternalStore(
    subscribe,
    () => (cache ??= readTokens()),
    () => cache ?? FALLBACK,
  );
}

function useMedia(query: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    setOn(m.matches);
    const f = () => setOn(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, [query]);
  return on;
}
export const useReduced = () => useMedia("(prefers-reduced-motion: reduce)");

/* --------------------------------------------------------------- labels --- */

/**
 * Labels are plain HTML laid over the canvas. A <Tag> inside the scene only
 * marks a point; the overlay draws the text and, every frame, moves it to
 * where that point lands on screen. A label whose object has shrunk away
 * (removed, failed) is hidden with it.
 */
export type Tone = "plain" | "ok" | "bad" | "quiet" | "brand";
type LabelEntry = { text: string; tone: Tone; obj: THREE.Object3D };

class LabelStore {
  entries = new Map<string, LabelEntry>();
  els = new Map<string, HTMLSpanElement>();
  private version = 0;
  private listeners = new Set<() => void>();
  set(id: string, e: LabelEntry) {
    this.entries.set(id, e);
    this.emit();
  }
  delete(id: string) {
    this.entries.delete(id);
    this.emit();
  }
  private emit() {
    this.version++;
    this.listeners.forEach((l) => l());
  }
  subscribe = (l: () => void) => {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  };
  snapshot = () => this.version;
}

const LabelCtx = createContext<LabelStore | null>(null);

function LabelLayer({ store }: { store: LabelStore }) {
  useSyncExternalStore(store.subscribe, store.snapshot, store.snapshot);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...store.entries].map(([id, e]) => (
        <span
          key={id}
          ref={(el) => {
            if (el) store.els.set(id, el);
            else store.els.delete(id);
          }}
          className="scene-tag absolute left-0 top-0"
          data-tone={e.tone}
          style={{ visibility: "hidden" }}
        >
          {e.text}
        </span>
      ))}
    </div>
  );
}

const tmp = new THREE.Vector3();
const tmpScale = new THREE.Vector3();
function Projector({ store }: { store: LabelStore }) {
  useFrame(({ camera, size }) => {
    for (const [id, e] of store.entries) {
      const el = store.els.get(id);
      if (!el) continue;
      e.obj.getWorldPosition(tmp);
      e.obj.getWorldScale(tmpScale);
      tmp.project(camera);
      const shown = tmp.z < 1 && tmpScale.x > 0.2;
      el.style.visibility = shown ? "visible" : "hidden";
      if (shown) {
        const x = ((tmp.x + 1) / 2) * size.width;
        const y = ((1 - tmp.y) / 2) * size.height;
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      }
    }
  });
  return null;
}

/** Marks a point of the scene that carries a label. */
export function Tag({ at, tone = "plain", children }: { at: V3; tone?: Tone; children: React.ReactNode }) {
  const store = useContext(LabelCtx);
  const g = useRef<THREE.Group>(null);
  const id = useId();
  const text = Children.toArray(children).join("");
  useEffect(() => {
    if (store && g.current) store.set(id, { text, tone, obj: g.current });
  }, [store, id, text, tone]);
  useEffect(() => () => store?.delete(id), [store, id]);
  return <group ref={g} position={at} />;
}

/* ---------------------------------------------------------------- stage --- */

/** Places the camera so a `width` × `height` area always fits, phone or desktop. */
function FitCamera({ width, height }: { width: number; height: number }) {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / size.height;
    const half = Math.tan(((cam.fov * Math.PI) / 180) / 2);
    const d = Math.max(width / 2 / (half * aspect), height / 2 / half);
    cam.position.set(0, d * 0.22, d);
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  }, [camera, size, width, height]);
  return null;
}

export function Stage({
  label,
  width = 7,
  height = 4.4,
  children,
}: {
  /** what the scene shows, for screen readers */
  label: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const mouse = useMedia("(hover: hover) and (pointer: fine)");
  const tk = useTokens();
  const [labels] = useState(() => new LabelStore());

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={box}
      role="img"
      aria-label={label}
      className="scene-stage relative h-[280px] overflow-hidden rounded-t-[4px] sm:h-[340px]"
      style={{ background: tk.surface2, cursor: mouse ? "grab" : undefined }}
    >
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 2]} camera={{ fov: 38, position: [0, 2, 9] }} gl={{ antialias: true }}>
        <FitCamera width={width} height={height} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[4, 7, 6]} intensity={1.4} />
        <directionalLight position={[-5, 2, -3]} intensity={0.35} />
        <LabelCtx.Provider value={labels}>{children}</LabelCtx.Provider>
        <Projector store={labels} />
        {mouse && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={1.05}
            maxPolarAngle={1.7}
            minAzimuthAngle={-0.6}
            maxAzimuthAngle={0.6}
            rotateSpeed={0.5}
          />
        )}
      </Canvas>
      <LabelLayer store={labels} />
    </div>
  );
}

/* --------------------------------------------------------------- motion --- */

/**
 * A group that glides to wherever it is told to be. Change `to`, `scale` or
 * `rot` and it travels there; bump `shake` and it shakes once (an error).
 */
export function Mover({
  to = [0, 0, 0],
  from,
  scale = 1,
  rot = [0, 0, 0],
  shake = 0,
  speed = 7,
  spin = 0,
  children,
}: {
  to?: V3;
  from?: V3;
  scale?: number;
  rot?: V3;
  shake?: number;
  speed?: number;
  /** slow idle turn around y, radians per second */
  spin?: number;
  children: React.ReactNode;
}) {
  const g = useRef<THREE.Group>(null);
  const reduced = useReduced();
  const shakeUntil = useRef(0);
  const spun = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    if (shake > 0) shakeUntil.current = performance.now() + 450;
  }, [shake]);

  useFrame((_, dt) => {
    const o = g.current;
    if (!o) return;
    if (!started.current) {
      started.current = true;
      o.position.set(...(from ?? to));
      o.scale.setScalar(from ? 0.001 : scale);
      o.rotation.set(...rot);
    }
    const k = reduced ? 1 : 1 - Math.exp(-speed * Math.min(dt, 0.1));
    o.position.x += (to[0] - o.position.x) * k;
    o.position.y += (to[1] - o.position.y) * k;
    o.position.z += (to[2] - o.position.z) * k;
    const s = o.scale.x + (scale - o.scale.x) * k;
    o.scale.setScalar(Math.max(s, 0.0001));
    if (spin && !reduced) spun.current += spin * dt;
    // when the idle turn stops, settle on the nearest whole turn so `rot` is exact
    else if (spun.current) spun.current = Math.round(spun.current / (Math.PI * 2)) * Math.PI * 2;
    o.rotation.x += (rot[0] - o.rotation.x) * k;
    o.rotation.y += (rot[1] + spun.current - o.rotation.y) * k;
    o.rotation.z += (rot[2] - o.rotation.z) * k;
    const left = shakeUntil.current - performance.now();
    if (left > 0 && !reduced) o.position.x += Math.sin(left / 18) * 0.06 * (left / 450);
  });

  return <group ref={g}>{children}</group>;
}

export function Mat({ color, opacity = 1 }: { color: string; opacity?: number }) {
  return <meshStandardMaterial color={color} roughness={0.55} metalness={0.05} transparent={opacity < 1} opacity={opacity} />;
}

/* ---------------------------------------------------------------- panel --- */

/** The controls and the reading of a scene, under the canvas. */
export function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="scene-panel flex flex-col gap-3 rounded-b-[4px] border border-t-0 border-line px-4 py-3.5 sm:px-5">
      {children}
    </div>
  );
}

export function Choices<T extends string | number>({
  items,
  value,
  onPick,
  label,
}: {
  items: Array<{ id: T; label: string }>;
  value?: T | null;
  onPick: (id: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={String(it.id)}
            type="button"
            aria-pressed={value === undefined ? undefined : on}
            onClick={() => onPick(it.id)}
            className="scene-btn"
            data-on={on || undefined}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

/** What just happened: the line of code and what it means. Read out by screen readers. */
export function Readout({ code, tone = "plain", children }: { code?: string; tone?: Tone; children?: React.ReactNode }) {
  return (
    <div aria-live="polite" className="flex flex-col gap-1.5">
      {code && (
        <code className="scene-code" data-tone={tone}>
          {code}
        </code>
      )}
      {children && <p className="t-small m-0 text-muted">{children}</p>}
    </div>
  );
}
