"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lang, Lesson } from "@/lib/types";
import { t } from "@/lib/i18n";
import { plainText } from "./term";

/**
 * «Escuchar»: reads the lesson aloud with the browser's own voices (Web Speech
 * API: free, no keys, nothing leaves the device). Which voices exist depends
 * on the device and browser, so the player offers up to three of the best
 * ones it finds for the lesson's language.
 *
 * The lesson is cut into sentences: long utterances stall in some browsers,
 * and sentences let the bar seek, skip and highlight what is being read.
 */

type Sentence = { text: string; block: number | null; start: number };

const RATES = [0.8, 1, 1.25, 1.5];
const CHARS_PER_SECOND = 14; // a rough reading pace, only for the time shown
const LS_VOICE = "apex.audio.voice";
const LS_RATE = "apex.audio.rate";

const REGION: Record<string, { es: string; en: string }> = {
  ES: { es: "España", en: "Spain" },
  MX: { es: "México", en: "Mexico" },
  US: { es: "Estados Unidos", en: "United States" },
  CO: { es: "Colombia", en: "Colombia" },
  AR: { es: "Argentina", en: "Argentina" },
  CL: { es: "Chile", en: "Chile" },
  PE: { es: "Perú", en: "Peru" },
  GB: { es: "Reino Unido", en: "United Kingdom" },
  AU: { es: "Australia", en: "Australia" },
  IN: { es: "India", en: "India" },
  CA: { es: "Canadá", en: "Canada" },
};

/* --------------------------------------------------------- lesson → text --- */

function lessonParts(lesson: Lesson, lang: Lang): Array<{ text: string; block: number | null }> {
  const say = (s: string) => plainText(s, lang).replace(/\s+/g, " ").trim();
  const es = lang === "es";
  const parts: Array<{ text: string; block: number | null }> = [];
  const add = (text: string, block: number | null) => {
    const clean = say(text);
    if (clean) parts.push({ text: clean, block });
  };

  add(t(lesson.title, lang) + ".", null);
  add(t(lesson.summary, lang), null);
  if (lesson.analogy) add(`${es ? "En Admin es" : "In Admin it is"}: ${t(lesson.analogy, lang)}.`, null);
  if (lesson.objectives.length) {
    add(es ? "Vas a poder:" : "You will be able to:", null);
    lesson.objectives.forEach((o) => add(t(o, lang), null));
  }

  lesson.theory.forEach((b, i) => {
    switch (b.type) {
      case "lead":
      case "p":
      case "h":
        add(t(b.text, lang), i);
        break;
      case "list":
        b.items.forEach((it) => add(t(it, lang), i));
        break;
      case "callout":
        add(`${t(b.title, lang)}.`, i);
        add(t(b.text, lang), i);
        break;
      case "table":
        // read row by row, each cell with its column name
        b.rows.forEach((row) =>
          add(row.map((cell, k) => `${t(b.head[k] ?? { es: "", en: "" }, lang)}: ${t(cell, lang)}`).join(". ") + ".", i),
        );
        break;
      case "code":
        // code is read on screen, not aloud; its caption carries the idea
        add(es ? "Ejemplo de código en pantalla." : "Code example on screen.", i);
        if (b.caption) add(t(b.caption, lang), i);
        break;
      case "diagram":
        add(es ? "Diagrama interactivo." : "Interactive diagram.", i);
        if (b.caption) add(t(b.caption, lang), i);
        break;
      case "scene3d":
        add(es ? "Escena 3D interactiva." : "Interactive 3D scene.", i);
        if (b.caption) add(t(b.caption, lang), i);
        break;
      case "divider":
        break;
    }
  });
  return parts;
}

/** Sentences short enough for every browser, with their offset in the text. */
function toSentences(parts: Array<{ text: string; block: number | null }>): Sentence[] {
  const out: Sentence[] = [];
  let start = 0;
  for (const p of parts) {
    const pieces = p.text.match(/[^.!?¡¿]*(?:[¡¿][^.!?]*)?[.!?]+["»”)]*|[^.!?]+$/g) ?? [p.text];
    for (const raw of pieces) {
      let s = raw.trim();
      // a very long sentence is cut at its commas, still under ~220 characters
      while (s.length > 220) {
        const cut = s.lastIndexOf(", ", 220);
        const at = cut > 60 ? cut + 1 : 220;
        out.push({ text: s.slice(0, at).trim(), block: p.block, start });
        start += at;
        s = s.slice(at).trim();
      }
      if (s) {
        out.push({ text: s, block: p.block, start });
        start += s.length + 1;
      }
    }
  }
  return out;
}

/* ---------------------------------------------------------------- voices --- */

function rank(v: SpeechSynthesisVoice) {
  const n = v.name.toLowerCase();
  if (n.includes("natural") || n.includes("neural")) return 0;
  if (n.includes("google")) return 1;
  if (n.includes("online")) return 2;
  return 3;
}

/** Up to three voices for the language: the best ones, from different regions first. */
function pickVoices(all: SpeechSynthesisVoice[], lang: Lang): SpeechSynthesisVoice[] {
  const mine = all.filter((v) => v.lang.toLowerCase().startsWith(lang));
  const sorted = [...mine].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
  const chosen: SpeechSynthesisVoice[] = [];
  const regions = new Set<string>();
  for (const v of sorted) {
    if (chosen.length === 3) break;
    const region = v.lang.split(/[-_]/)[1] ?? "";
    if (!regions.has(region)) {
      chosen.push(v);
      regions.add(region);
    }
  }
  for (const v of sorted) {
    if (chosen.length === 3) break;
    if (!chosen.includes(v)) chosen.push(v);
  }
  return chosen;
}

function voiceLabel(v: SpeechSynthesisVoice, lang: Lang) {
  // Google's voices carry no person's name, only the language
  const name = /^google/i.test(v.name)
    ? "Google"
    :
    v.name
      .replace(/^(Microsoft|Google|Apple)\s+/i, "")
      .replace(/\s+Online.*$/i, "")
      .replace(/\s*\(.*\)\s*$/, "")
      .replace(/\s+-\s+.*$/, "")
      .trim() || v.name;
  const region = REGION[(v.lang.split(/[-_]/)[1] ?? "").toUpperCase()];
  return region ? `${name} · ${t(region, lang)}` : name;
}

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;

/* ---------------------------------------------------------------- player --- */

export function LessonAudio({ lesson, lang }: { lesson: Lesson; lang: Lang }) {
  const es = lang === "es";
  const [supported, setSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [rate, setRate] = useState(1);
  // every start bumps the run; a stale «end» from a cancelled sentence is ignored
  const run = useRef(0);
  const indexRef = useRef(0);

  const sentences = useMemo(() => toSentences(lessonParts(lesson, lang)), [lesson, lang]);
  const total = sentences.length ? sentences[sentences.length - 1].start + sentences[sentences.length - 1].text.length : 0;

  // voices arrive asynchronously in most browsers
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    setSupported(true);
    const load = () => setVoices(pickVoices(window.speechSynthesis.getVoices(), lang));
    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    try {
      const saved = Number(localStorage.getItem(LS_RATE));
      if (RATES.includes(saved)) setRate(saved);
    } catch {
      /* private mode: defaults */
    }
    return () => window.speechSynthesis.removeEventListener("voiceschanged", load);
  }, [lang]);

  // the remembered voice if it is offered here, else the first one
  useEffect(() => {
    if (!voices.length) return;
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LS_VOICE);
    } catch {
      /* ignore */
    }
    setVoiceName((cur) => {
      if (cur && voices.some((v) => v.name === cur)) return cur;
      return voices.some((v) => v.name === saved) ? saved : voices[0].name;
    });
  }, [voices]);

  const stopSpeech = useCallback(() => {
    run.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const speakFrom = useCallback(
    (from: number) => {
      if (!("speechSynthesis" in window)) return;
      stopSpeech();
      const myRun = run.current;
      const voice = window.speechSynthesis.getVoices().find((v) => v.name === voiceName);
      const say = (i: number) => {
        if (myRun !== run.current) return;
        if (i >= sentences.length) {
          setPlaying(false);
          setIndex(0);
          indexRef.current = 0;
          return;
        }
        setIndex(i);
        indexRef.current = i;
        const u = new SpeechSynthesisUtterance(sentences[i].text);
        u.lang = voice?.lang ?? (es ? "es-ES" : "en-US");
        if (voice) u.voice = voice;
        u.rate = rate;
        u.onend = () => say(i + 1);
        u.onerror = (e) => {
          // «interrupted» / «canceled» come from our own stop; anything else ends the run
          if (e.error !== "interrupted" && e.error !== "canceled") setPlaying(false);
        };
        window.speechSynthesis.speak(u);
      };
      setPlaying(true);
      say(from);
    },
    [sentences, voiceName, rate, es, stopSpeech],
  );

  const pause = useCallback(() => {
    stopSpeech();
    setPlaying(false);
  }, [stopSpeech]);

  // a new voice or speed applies from the sentence being read
  const restartIfPlaying = useRef(false);
  useEffect(() => {
    if (restartIfPlaying.current) {
      restartIfPlaying.current = false;
      speakFrom(indexRef.current);
    }
  }, [voiceName, rate, speakFrom]);

  // while the bar is open the page gets room at the bottom, so it never covers
  // the end of the lesson
  useEffect(() => {
    document.body.classList.toggle("audio-open", open);
    return () => document.body.classList.remove("audio-open");
  }, [open]);

  // leaving the lesson (or the page) stops the voice
  useEffect(() => {
    setIndex(0);
    indexRef.current = 0;
    setPlaying(false);
    stopSpeech();
    return stopSpeech;
  }, [lesson.id, lang, stopSpeech]);

  // highlight the block being read, and keep it in view
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-theory]");
    root?.querySelectorAll(".is-reading").forEach((el) => el.classList.remove("is-reading"));
    if (!open || !root) return;
    const block = sentences[index]?.block;
    if (block == null || root.children.length !== lesson.theory.length) return;
    const el = root.children[block] as HTMLElement | undefined;
    if (!el) return;
    el.classList.add("is-reading");
    if (playing) {
      const r = el.getBoundingClientRect();
      if (r.top < 120 || r.top > window.innerHeight - 160) {
        const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
      }
    }
  }, [index, open, playing, sentences, lesson.theory.length]);

  if (!supported) return null;

  const at = sentences[index]?.start ?? 0;
  const pct = total ? (at / total) * 100 : 0;
  const secTotal = total / CHARS_PER_SECOND / rate;
  const secAt = at / CHARS_PER_SECOND / rate;

  const seekTo = (i: number) => {
    const j = Math.max(0, Math.min(sentences.length - 1, i));
    setIndex(j);
    indexRef.current = j;
    if (playing) speakFrom(j);
  };
  const seekPct = (p: number) => {
    const target = p * total;
    let j = 0;
    while (j + 1 < sentences.length && sentences[j + 1].start <= target) j++;
    seekTo(j);
  };

  const iconBtn =
    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:bg-surface-2";

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost mt-5"
        aria-expanded={open}
        onClick={() => {
          if (open && playing) pause();
          else {
            setOpen(true);
            speakFrom(indexRef.current);
          }
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
          <rect x="3" y="14" width="4" height="6" rx="1.5" />
          <rect x="17" y="14" width="4" height="6" rx="1.5" />
        </svg>
        {open && playing ? (es ? "Pausar" : "Pause") : es ? "Escuchar" : "Listen"}
      </button>

      {open && (
        <>
          <div
            role="region"
            aria-label={es ? "Reproductor de la lección" : "Lesson player"}
            className="audio-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md lg:left-[264px]"
          >
            <div className="mx-auto flex w-full max-w-[880px] flex-col gap-2 px-4 py-2.5 sm:gap-2.5 sm:px-8 sm:py-3">
              {/* phone: buttons on one row, the bar under them; wider: all in one row */}
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
                <button type="button" className={iconBtn} onClick={() => seekTo(index - 1)} aria-label={es ? "Frase anterior" : "Previous sentence"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6 5h2v14H6zM20 5v14L9 12z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fill text-on-fill transition hover:opacity-90"
                  onClick={() => (playing ? pause() : speakFrom(index))}
                  aria-label={playing ? (es ? "Pausar" : "Pause") : es ? "Reproducir" : "Play"}
                >
                  {playing ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M7 4v16l13-8z" />
                    </svg>
                  )}
                </button>
                <button type="button" className={iconBtn} onClick={() => seekTo(index + 1)} aria-label={es ? "Frase siguiente" : "Next sentence"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M16 5h2v14h-2zM4 5v14l11-7z" />
                  </svg>
                </button>

                <div className="order-last flex min-w-0 basis-full flex-col gap-0.5 sm:order-none sm:basis-auto sm:flex-1 sm:gap-1">
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    value={Math.round(pct * 10)}
                    onChange={(e) => seekPct(Number(e.target.value) / 1000)}
                    aria-label={es ? "Posición en la lección" : "Position in the lesson"}
                    aria-valuetext={`${es ? "Frase" : "Sentence"} ${index + 1} ${es ? "de" : "of"} ${sentences.length}`}
                    className="audio-range w-full"
                    style={{ "--pct": `${pct}%` } as React.CSSProperties}
                  />
                  <div className="t-micro flex justify-between font-mono tabular-nums text-faint">
                    <span>{fmt(secAt)}</span>
                    <span>~{fmt(secTotal)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="ml-auto inline-flex h-11 min-w-[52px] shrink-0 items-center justify-center rounded-full border border-line px-2 sm:ml-0 font-mono text-[0.8rem] font-semibold text-ink transition hover:bg-surface-2"
                  onClick={() => {
                    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
                    restartIfPlaying.current = playing;
                    setRate(next);
                    try {
                      localStorage.setItem(LS_RATE, String(next));
                    } catch {
                      /* ignore */
                    }
                  }}
                  aria-label={`${es ? "Velocidad" : "Speed"} ${rate}x`}
                >
                  {rate}x
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  onClick={() => {
                    pause();
                    setOpen(false);
                  }}
                  aria-label={es ? "Cerrar el reproductor" : "Close the player"}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              {/* phone: the voices scroll sideways instead of stacking */}
              <div className="thin-scroll -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                <span className="t-micro shrink-0 font-semibold uppercase tracking-[0.06em] text-faint">{es ? "Voz" : "Voice"}</span>
                {voices.length === 0 ? (
                  <span className="t-micro text-muted">
                    {es
                      ? "Este navegador no tiene voces en español: se usa la voz por defecto."
                      : "This browser has no English voices: the default voice is used."}
                  </span>
                ) : (
                  voices.map((v) => {
                    const on = v.name === voiceName;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          restartIfPlaying.current = playing;
                          setVoiceName(v.name);
                          try {
                            localStorage.setItem(LS_VOICE, v.name);
                          } catch {
                            /* ignore */
                          }
                        }}
                        className="t-micro min-h-[36px] shrink-0 whitespace-nowrap rounded-full border px-3 transition"
                        style={{
                          borderColor: on ? "var(--c-brand)" : "var(--c-border)",
                          background: on ? "var(--c-brand-soft)" : "transparent",
                          color: on ? "var(--c-brand)" : "var(--c-text)",
                          fontWeight: on ? 600 : 400,
                        }}
                      >
                        {voiceLabel(v, lang)}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
