"use client";

import { Fragment, useEffect, useState } from "react";
import type { Lang } from "@/lib/types";

/**
 * Step-by-step animated diagrams.
 *
 * Plain HTML rather than SVG so the text wraps on a phone. Every one follows
 * the pattern of m06-order: Play / Back / Next buttons, a live note that
 * explains the current step, and movement done with CSS only, so the global
 * prefers-reduced-motion rule turns it into instant jumps.
 */

type P = { lang: Lang };
export const pick = (lang: Lang, es: string, en: string) => (lang === "es" ? es : en);

/* ---------------------------------------------------------------- shared --- */

export function useStepper(count: number, ms = 1700) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = count - 1;

  useEffect(() => {
    if (!playing) return;
    if (i >= last) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setI((n) => Math.min(n + 1, last)), ms);
    return () => clearTimeout(timer);
  }, [playing, i, last, ms]);

  return {
    i: Math.min(i, last),
    last,
    playing,
    go: (n: number) => {
      setPlaying(false);
      setI(Math.max(0, Math.min(last, n)));
    },
    play: () => {
      if (i >= last) setI(0);
      setPlaying(true);
    },
    pause: () => setPlaying(false),
  };
}
export type Stepper = ReturnType<typeof useStepper>;

export function Controls({ lang, s }: { lang: Lang; s: Stepper }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {s.playing ? (
        <button type="button" className="btn btn-primary" onClick={s.pause}>
          {pick(lang, "❚❚ Pausa", "❚❚ Pause")}
        </button>
      ) : (
        <button type="button" className="btn btn-primary" onClick={s.play}>
          {s.i >= s.last ? pick(lang, "↻ Repetir", "↻ Replay") : pick(lang, "▶ Reproducir", "▶ Play")}
        </button>
      )}
      <button type="button" className="btn btn-ghost" disabled={s.i === 0} onClick={() => s.go(s.i - 1)}>
        {pick(lang, "← Anterior", "← Back")}
      </button>
      <button type="button" className="btn btn-ghost" disabled={s.i === s.last} onClick={() => s.go(s.i + 1)}>
        {pick(lang, "Siguiente →", "Next →")}
      </button>
    </div>
  );
}

export function Note({ lang, s, children }: { lang: Lang; s: Stepper; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-[4px] p-4" style={{ background: "var(--c-surface-2)" }} aria-live="polite">
      <p className="t-micro text-faint tabular-nums">
        {pick(lang, "Paso", "Step")} {s.i + 1} {pick(lang, "de", "of")} {s.last + 1}
      </p>
      <p className="t-small mt-1 text-ink">{children}</p>
    </div>
  );
}

/** Scenario switch: a row of pressed/unpressed buttons. */
export function Tabs({ items, value, onChange }: { items: string[]; value: number; onChange: (n: number) => void }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map((label, n) => (
        <button
          key={n}
          type="button"
          aria-pressed={n === value}
          onClick={() => onChange(n)}
          className="t-small min-h-[36px] rounded-full border px-3.5 transition-colors"
          style={{
            borderColor: n === value ? "var(--c-brand)" : "var(--c-border)",
            background: n === value ? "var(--c-brand-soft)" : "transparent",
            color: n === value ? "var(--c-brand)" : "var(--c-text)",
            fontWeight: n === value ? 600 : 400,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export const codeBox: React.CSSProperties = {
  background: "var(--c-code-bg)",
  border: "1px solid var(--c-code-border)",
  color: "var(--c-code-text)",
};

/* ------------------------------------------- m01 · chaining and nesting --- */

type Seg = { code: string; step: number };
type FlowStep = { value: string; type: string; note: string };

export function MethodFlow({ lang }: P) {
  const flows: Array<{ label: string; assign: string; segs: Seg[]; steps: FlowStep[]; formula: string }> = [
    {
      label: pick(lang, "Encadenar", "Chain"),
      assign: "String companyCode = ",
      segs: [
        { code: "rawCompany", step: 0 },
        { code: ".trim()", step: 1 },
        { code: ".substring(0, 4)", step: 2 },
        { code: ".toUpperCase()", step: 3 },
        { code: ";", step: 3 },
      ],
      steps: [
        {
          value: "'  northwind trading  '",
          type: "String",
          note: pick(
            lang,
            "Punto de partida: el dato tal cual llega del formulario web, con espacios y en minúsculas. Una cadena se lee de izquierda a derecha.",
            "Starting point: the value exactly as the web form sends it, with spaces and in lower case. A chain reads left to right.",
          ),
        },
        {
          value: "'northwind trading'",
          type: "String",
          note: pick(
            lang,
            "trim() actúa sobre rawCompany y devuelve un texto NUEVO, sin los espacios de los extremos. rawCompany sigue igual.",
            "trim() acts on rawCompany and returns a NEW text without the outer spaces. rawCompany stays as it was.",
          ),
        },
        {
          value: "'nort'",
          type: "String",
          note: pick(
            lang,
            "substring(0, 4) actúa sobre 'northwind trading' —lo que devolvió el paso anterior—, no sobre rawCompany. Toma las posiciones 0, 1, 2 y 3.",
            "substring(0, 4) acts on 'northwind trading' — what the previous step returned — not on rawCompany. It takes positions 0, 1, 2 and 3.",
          ),
        },
        {
          value: "'NORT'",
          type: "String",
          note: pick(
            lang,
            "toUpperCase() actúa sobre 'nort'. Es el último eslabón, así que este es el valor que se guarda en companyCode.",
            "toUpperCase() acts on 'nort'. It is the last link, so this is the value stored in companyCode.",
          ),
        },
      ],
      formula: "UPPER(LEFT(TRIM(rawCompany), 4))",
    },
    {
      label: pick(lang, "Anidar", "Nest"),
      assign: "String lengthText = ",
      segs: [
        { code: "String.valueOf(", step: 3 },
        { code: "rawName", step: 0 },
        { code: ".trim()", step: 1 },
        { code: ".length()", step: 2 },
        { code: ")", step: 3 },
        { code: ";", step: 3 },
      ],
      steps: [
        {
          value: "'  ana torres  '",
          type: "String",
          note: pick(
            lang,
            "Apex empieza por lo que hay DENTRO de los paréntesis. String.valueOf( espera en gris: todavía no tiene nada que convertir.",
            "Apex starts with what is INSIDE the brackets. String.valueOf( waits in grey: it has nothing to convert yet.",
          ),
        },
        {
          value: "'ana torres'",
          type: "String",
          note: pick(lang, "trim() quita los espacios de los extremos.", "trim() strips the outer spaces."),
        },
        {
          value: "10",
          type: "Integer",
          note: pick(
            lang,
            "length() cuenta los caracteres y devuelve un Integer. Fíjate en el tipo: a un número ya no le podrías pedir trim().",
            "length() counts the characters and returns an Integer. Mind the type: you could no longer ask a number for trim().",
          ),
        },
        {
          value: "'10'",
          type: "String",
          note: pick(
            lang,
            "Solo ahora, con el 10 ya calculado, se ejecuta el método de FUERA: String.valueOf(10) lo convierte en el texto '10'.",
            "Only now, with 10 already worked out, does the OUTER method run: String.valueOf(10) turns it into the text '10'.",
          ),
        },
      ],
      formula: "TEXT(LEN(TRIM(rawName)))",
    },
  ];

  const [mode, setMode] = useState(0);
  const s = useStepper(4);
  const f = flows[mode];
  const cur = f.steps[s.i];

  return (
    <div className="w-full">
      <Tabs
        items={flows.map((x) => x.label)}
        value={mode}
        onChange={(n) => {
          setMode(n);
          s.go(0);
        }}
      />

      <div className="rounded-[4px] px-3 py-3 font-mono text-[13px] leading-[1.9]" style={codeBox}>
        <span className="text-faint">{f.assign}</span>
        {f.segs.map((g, n) => {
          const state = g.step === s.i ? "cur" : g.step < s.i ? "done" : "next";
          return (
            <Fragment key={n}>
              {n > 0 && <wbr />}
              <span
                className="whitespace-nowrap rounded-[3px] transition-colors duration-300"
                style={{
                  padding: "2px 1px",
                  background: state === "cur" ? "var(--c-brand-soft)" : "transparent",
                  boxShadow: state === "cur" ? "inset 0 -2px 0 var(--c-brand)" : "none",
                  color: state === "cur" ? "var(--c-brand)" : state === "done" ? "var(--c-heading)" : "var(--c-text-faint)",
                  fontWeight: state === "cur" ? 600 : 400,
                }}
              >
                {g.code}
              </span>
            </Fragment>
          );
        })}
      </div>

      {/* the value as it travels: one card per step reached */}
      <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label={pick(lang, "Valores intermedios", "Intermediate values")}>
        {f.steps.slice(0, s.i + 1).map((st, n) => (
          <li key={`${mode}-${n}`} className="diag-pop flex items-center gap-1.5">
            {n > 0 && (
              <span aria-hidden className="text-faint">
                →
              </span>
            )}
            <span
              className="inline-flex flex-col rounded-[4px] border px-2.5 py-1.5"
              style={{
                borderColor: n === s.i ? "var(--c-brand)" : "var(--c-border)",
                background: n === s.i ? "var(--c-brand-soft)" : "transparent",
              }}
            >
              <span className="font-mono text-[13px] whitespace-pre text-ink">{st.value}</span>
              <span className="t-micro text-faint">{st.type}</span>
            </span>
          </li>
        ))}
      </ol>

      <Note lang={lang} s={s}>
        {cur.note}
      </Note>

      <p className="t-small mt-3 text-muted">
        {pick(lang, "En un campo fórmula: ", "In a formula field: ")}
        <code className="font-mono text-[13px] text-ink">{f.formula}</code>
        {mode === 0
          ? pick(lang, " — se escribe de fuera hacia dentro, pero ocurre en el mismo orden.", " — written outside in, but it happens in the same order.")
          : pick(lang, " — el mismo «de dentro hacia fuera».", " — the same “inside out”.")}
      </p>

      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ---------------------------------------------- m01 · short-circuit && --- */

type Side = "wait" | "true" | "false" | "skip" | "boom";

export function ShortCircuit({ lang }: P) {
  const safeL = "region != null";
  const safeR = "region.toUpperCase() == 'EMEA'";
  const scenarios: Array<{
    label: string;
    value: string;
    left: string;
    right: string;
    steps: Array<{ l: Side; r: Side; result?: string; note: string }>;
  }> = [
    {
      label: pick(lang, "region = null", "region = null"),
      value: "null",
      left: safeL,
      right: safeR,
      steps: [
        {
          l: "wait",
          r: "wait",
          note: pick(lang, "region vale null. Apex lee la condición de izquierda a derecha.", "region is null. Apex reads the condition left to right."),
        },
        {
          l: "false",
          r: "wait",
          note: pick(lang, "La izquierda es false: region sí es null.", "The left side is false: region is null."),
        },
        {
          l: "false",
          r: "skip",
          note: pick(
            lang,
            "false && lo-que-sea siempre es false, así que Apex ni mira la derecha. Nadie le pide toUpperCase() a null: no hay error.",
            "false && anything is always false, so Apex never looks at the right side. Nobody asks null for toUpperCase(): no error.",
          ),
        },
        {
          l: "false",
          r: "skip",
          result: "false",
          note: pick(lang, "isEmea = false, y la transacción sigue viva.", "isEmea = false, and the transaction lives on."),
        },
      ],
    },
    {
      label: pick(lang, "region = 'emea'", "region = 'emea'"),
      value: "'emea'",
      left: safeL,
      right: safeR,
      steps: [
        {
          l: "wait",
          r: "wait",
          note: pick(lang, "Ahora region tiene valor: 'emea', en minúsculas.", "Now region has a value: 'emea', in lower case."),
        },
        {
          l: "true",
          r: "wait",
          note: pick(lang, "La izquierda es true, así que la respuesta depende de la derecha: hay que evaluarla.", "The left side is true, so the answer depends on the right: it has to be evaluated."),
        },
        {
          l: "true",
          r: "true",
          note: pick(
            lang,
            "'emea'.toUpperCase() da 'EMEA', y 'EMEA' == 'EMEA' es true. Ya es seguro llamar al método: la izquierda garantizó que no es null.",
            "'emea'.toUpperCase() gives 'EMEA', and 'EMEA' == 'EMEA' is true. Calling the method is safe now: the left side guaranteed it is not null.",
          ),
        },
        {
          l: "true",
          r: "true",
          result: "true",
          note: pick(lang, "true && true: isEmea = true.", "true && true: isEmea = true."),
        },
      ],
    },
    {
      label: pick(lang, "null · orden invertido", "null · reversed order"),
      value: "null",
      left: safeR,
      right: safeL,
      steps: [
        {
          l: "wait",
          r: "wait",
          note: pick(
            lang,
            "Las mismas dos condiciones, pero al revés. region vuelve a ser null.",
            "The same two conditions, the other way round. region is null again.",
          ),
        },
        {
          l: "boom",
          r: "wait",
          note: pick(
            lang,
            "Lo primero que se evalúa es region.toUpperCase(): pedirle un método a null lanza NullPointerException.",
            "The first thing evaluated is region.toUpperCase(): asking null for a method throws NullPointerException.",
          ),
        },
        {
          l: "boom",
          r: "wait",
          result: "💥",
          note: pick(
            lang,
            "La transacción se detiene aquí. La comprobación de null estaba en la línea… pero llegó tarde. El orden no es estética: es estabilidad.",
            "The transaction stops right here. The null check was on the line… but it came too late. Order is not cosmetic: it is stability.",
          ),
        },
      ],
    },
  ];

  const [sc, setSc] = useState(0);
  const cfg = scenarios[sc];
  const s = useStepper(cfg.steps.length, 1900);
  const st = cfg.steps[s.i];

  const badge = (side: Side) => {
    const map: Record<Side, { t: string; fg: string; bg: string }> = {
      wait: { t: "…", fg: "var(--c-text-faint)", bg: "transparent" },
      true: { t: "true", fg: "var(--c-brand)", bg: "var(--c-brand-soft)" },
      false: { t: "false", fg: "var(--c-warn)", bg: "var(--c-warn-soft)" },
      skip: { t: pick(lang, "no se evalúa", "not evaluated"), fg: "var(--c-text-faint)", bg: "transparent" },
      boom: { t: "NullPointerException", fg: "var(--c-danger)", bg: "var(--c-danger-soft)" },
    };
    const b = map[side];
    return (
      <span
        key={side}
        className="diag-pop t-micro mt-1.5 inline-block rounded-full px-2 py-0.5 font-mono font-semibold"
        style={{ color: b.fg, background: b.bg }}
      >
        {b.t}
      </span>
    );
  };

  const box = (code: string, side: Side) => (
    <div
      className="min-w-0 flex-1 rounded-[4px] border px-3 py-2 transition-all duration-300"
      style={{
        borderColor: side === "boom" ? "var(--c-danger)" : side === "wait" || side === "skip" ? "var(--c-border)" : "var(--c-brand)",
        borderStyle: side === "skip" ? "dashed" : "solid",

      }}
    >
      <code
        className="block font-mono text-[13px] [overflow-wrap:anywhere]"
        style={{ textDecoration: side === "skip" ? "line-through" : "none", color: side === "skip" ? "var(--c-text-faint)" : "var(--c-text)" }}
      >
        {code}
      </code>
      {badge(side)}
    </div>
  );

  return (
    <div className="w-full">
      <Tabs
        items={scenarios.map((x) => x.label)}
        value={sc}
        onChange={(n) => {
          setSc(n);
          s.go(0);
        }}
      />

      <p className="t-small mb-2 text-muted">
        <code className="font-mono text-[13px] text-ink">String region = {cfg.value};</code>
      </p>

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {box(cfg.left, st.l)}
        <span className="shrink-0 self-center font-mono text-[15px] font-semibold text-ink">&amp;&amp;</span>
        {box(cfg.right, st.r)}
      </div>

      <p className="mt-3 flex min-h-[32px] flex-wrap items-center gap-2 font-mono text-[13px] text-ink">
        <span className="whitespace-nowrap">Boolean isEmea =</span>
        {st.result ? (
          <span
            key={`${sc}-${st.result}`}
            className="diag-pop rounded-full px-2.5 py-0.5 font-semibold"
            style={
              st.result === "💥"
                ? { color: "var(--c-danger)", background: "var(--c-danger-soft)" }
                : { color: "var(--c-brand)", background: "var(--c-brand-soft)" }
            }
          >
            {st.result === "💥" ? pick(lang, "💥 nunca llega a asignarse", "💥 never assigned") : st.result}
          </span>
        ) : (
          <span className="text-faint">?</span>
        )}
      </p>

      <Note lang={lang} s={s}>
        {st.note}
      </Note>

      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ----------------------------------------------- m01 · List, Set and Map --- */

type CollStep = {
  code: string;
  note: string;
  list: string[];
  set: string[];
  rejected?: string;
  map: Array<[string, string]>;
  hi?: string;
  result?: string;
};

export function CollectionsPlay({ lang }: P) {
  const E = "'EMEA'";
  const A = "'AMER'";
  const steps: CollStep[] = [
    {
      code: "List<String> regionList = new List<String>();\nSet<String> regionSet = new Set<String>();\nMap<String, Decimal> quotaByRegion = new Map<String, Decimal>();",
      note: pick(
        lang,
        "Tres colecciones vacías. List es una lista relacionada: orden y repetidos. Set es la columna de agrupación de un informe: valores únicos. Map es un BUSCARV: das la clave y te devuelve el valor.",
        "Three empty collections. A List is a related list: order and duplicates. A Set is a report's grouping column: unique values. A Map is a VLOOKUP: give it the key and it hands back the value.",
      ),
      list: [],
      set: [],
      map: [],
    },
    {
      code: `regionList.add(${E});\nregionSet.add(${E});`,
      note: pick(lang, "Las dos reciben 'EMEA'. La List lo coloca en la posición 0.", "Both receive 'EMEA'. The List places it at position 0."),
      list: [E],
      set: [E],
      map: [],
    },
    {
      code: `regionList.add(${A});\nregionSet.add(${A});`,
      note: pick(
        lang,
        "'AMER' entra en las dos. La List lo pone detrás, en la posición 1: respeta el orden de llegada.",
        "'AMER' goes into both. The List puts it after, at position 1: it keeps arrival order.",
      ),
      list: [E, A],
      set: [E, A],
      map: [],
    },
    {
      code: `regionList.add(${E});\nregionSet.add(${E});`,
      note: pick(
        lang,
        "Otra vez 'EMEA'. La List lo acepta en la posición 2, como una lista relacionada con dos tareas iguales. El Set lo descarta sin dar error, porque ya lo tenía. Ahora regionList.size() es 3 y regionSet.size() es 2.",
        "'EMEA' again. The List accepts it at position 2, like a related list with two identical tasks. The Set drops it without any error, because it already had it. Now regionList.size() is 3 and regionSet.size() is 2.",
      ),
      list: [E, A, E],
      set: [E, A],
      rejected: E,
      map: [],
    },
    {
      code: `quotaByRegion.put(${E}, 150000);`,
      note: pick(lang, "put() guarda una pareja: la clave 'EMEA' apunta al valor 150000.", "put() stores a pair: the key 'EMEA' points to the value 150000."),
      list: [E, A, E],
      set: [E, A],
      map: [[E, "150000"]],
      hi: E,
    },
    {
      code: `quotaByRegion.put(${A}, 220000);`,
      note: pick(lang, "Segunda pareja: 'AMER' → 220000.", "Second pair: 'AMER' → 220000."),
      list: [E, A, E],
      set: [E, A],
      map: [
        [E, "150000"],
        [A, "220000"],
      ],
      hi: A,
    },
    {
      code: `quotaByRegion.put(${E}, 175000);`,
      note: pick(
        lang,
        "put() con una clave que ya existe NO crea otra fila: sustituye el valor. Es como editar un registro en vez de crear un duplicado: la clave es única, igual que un Id.",
        "put() with a key that already exists does NOT add a row: it replaces the value. Like editing a record instead of creating a duplicate: the key is unique, just like an Id.",
      ),
      list: [E, A, E],
      set: [E, A],
      map: [
        [E, "175000"],
        [A, "220000"],
      ],
      hi: E,
    },
    {
      code: `Decimal amer = quotaByRegion.get(${A});`,
      note: pick(
        lang,
        "get('AMER') va directo a la fila de esa clave, sin recorrer las demás, como BUSCARV en una hoja de cálculo. Devuelve 220000.",
        "get('AMER') goes straight to that key's row without scanning the others, like VLOOKUP in a spreadsheet. It returns 220000.",
      ),
      list: [E, A, E],
      set: [E, A],
      map: [
        [E, "175000"],
        [A, "220000"],
      ],
      hi: A,
      result: "220000",
    },
    {
      code: `Decimal apac = quotaByRegion.get('APAC');`,
      note: pick(
        lang,
        "get() con una clave que no existe no falla: devuelve null. Por eso en el ejercicio se pregunta antes con containsKey().",
        "get() with a key that does not exist does not fail: it returns null. That is why the exercise asks containsKey() first.",
      ),
      list: [E, A, E],
      set: [E, A],
      map: [
        [E, "175000"],
        [A, "220000"],
      ],
      result: "null",
    },
  ];

  const s = useStepper(steps.length, 1900);
  const st = steps[s.i];

  const label = (text: string, size?: number) => (
    <p className="t-micro mb-1.5 flex items-center justify-between gap-2 text-faint">
      <span className="font-semibold tracking-[0.06em]">{text}</span>
      {size !== undefined && <span className="font-mono">size() = {size}</span>}
    </p>
  );

  return (
    <div className="w-full">
      <pre className="overflow-x-auto rounded-[4px] px-3 py-2.5 font-mono text-[12.5px] leading-[1.7]" style={codeBox}>
        <code key={s.i} className="diag-pop block">
          {st.code}
        </code>
      </pre>

      <div className="mt-4 space-y-4">
        <div>
          {label(pick(lang, "LIST · ORDEN Y REPETIDOS", "LIST · ORDER AND DUPLICATES"), st.list.length)}
          <ol className="flex min-h-[52px] flex-wrap gap-2">
            {st.list.map((v, n) => (
              <li
                key={n}
                className="diag-pop flex flex-col items-center rounded-[4px] border px-2.5 py-1"
                style={{ borderColor: "var(--c-border)" }}
              >
                <span className="font-mono text-[13px] text-ink">{v}</span>
                <span className="t-micro text-faint">[{n}]</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          {label(pick(lang, "SET · SIN REPETIDOS", "SET · NO DUPLICATES"), st.set.length)}
          <ul className="flex min-h-[36px] flex-wrap items-center gap-2">
            {st.set.map((v) => (
              <li
                key={v}
                className="diag-pop rounded-full border px-3 py-1 font-mono text-[13px] text-ink"
                style={{ borderColor: "var(--c-brand)", background: "var(--c-brand-soft)" }}
              >
                {v}
              </li>
            ))}
            {st.rejected && (
              <li
                key={`rej-${s.i}`}
                className="diag-reject flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[13px]"
                style={{ borderColor: "var(--c-warn)", borderStyle: "dashed", color: "var(--c-warn)" }}
              >
                <span style={{ textDecoration: "line-through" }}>{st.rejected}</span>
                <span className="t-micro" style={{ fontFamily: "inherit" }}>
                  {pick(lang, "ya estaba", "already there")}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div>
          {label(pick(lang, "MAP · CLAVE → VALOR", "MAP · KEY → VALUE"), st.map.length)}
          <ul className="min-h-[40px] space-y-1.5">
            {st.map.map(([k, v]) => (
              <li
                key={k}
                className="diag-pop flex items-center gap-2 rounded-[4px] border px-3 py-1.5 font-mono text-[13px] transition-colors duration-300"
                style={{
                  borderColor: st.hi === k ? "var(--c-brand)" : "var(--c-border)",
                  background: st.hi === k ? "var(--c-brand-soft)" : "transparent",
                }}
              >
                <span className="text-ink">{k}</span>
                <span aria-hidden className="text-faint">
                  →
                </span>
                <span key={v} className="diag-pop font-semibold text-ink">
                  {v}
                </span>
              </li>
            ))}
          </ul>
          {st.result && (
            <p key={`res-${s.i}`} className="diag-pop mt-2 font-mono text-[13px] text-ink">
              {pick(lang, "get() devuelve ", "get() returns ")}
              <span
                className="rounded-full px-2 py-0.5 font-semibold"
                style={
                  st.result === "null"
                    ? { color: "var(--c-warn)", background: "var(--c-warn-soft)" }
                    : { color: "var(--c-brand)", background: "var(--c-brand-soft)" }
                }
              >
                {st.result}
              </span>
            </p>
          )}
        </div>
      </div>

      <Note lang={lang} s={s}>
        {st.note}
      </Note>

      <Controls lang={lang} s={s} />
    </div>
  );
}
