"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { ChooserGame, Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 2's step-by-step diagrams: control flow, run one line or one pass at
 * a time. Each one uses its own small scenario so it teaches the structure
 * without handing over the workshop's solution.
 */

type P = { lang: Lang };

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="t-small min-h-[36px] rounded-full border px-3 font-mono transition-colors"
      style={{
        borderColor: on ? "var(--c-brand)" : "var(--c-border)",
        background: on ? "var(--c-brand-soft)" : "transparent",
        color: on ? "var(--c-brand)" : "var(--c-text)",
        fontWeight: on ? 600 : 400,
      }}
    >
      {children}
    </button>
  );
}

type RowState = "wait" | "false" | "win" | "skip";

function rowStyle(state: RowState): React.CSSProperties {
  return {
    borderColor: state === "win" ? "var(--c-brand)" : "var(--c-border)",
    background: state === "win" ? "var(--c-brand-soft)" : "transparent",
    borderStyle: state === "skip" ? "dashed" : "solid",
  };
}

function Badge({ state, lang }: { state: RowState; lang: Lang }) {
  const map: Record<RowState, { t: string; fg: string; bg: string }> = {
    wait: { t: "…", fg: "var(--c-text-faint)", bg: "transparent" },
    false: { t: "false", fg: "var(--c-warn)", bg: "var(--c-warn-soft)" },
    win: { t: pick(lang, "true · entra", "true · runs"), fg: "var(--c-brand)", bg: "var(--c-brand-soft)" },
    skip: { t: pick(lang, "no se mira", "not checked"), fg: "var(--c-text-faint)", bg: "transparent" },
  };
  const b = map[state];
  return (
    <span key={state} className="diag-pop t-micro shrink-0 rounded-full px-2 py-0.5 font-mono font-semibold" style={{ color: b.fg, background: b.bg }}>
      {b.t}
    </span>
  );
}

/* ------------------------------------------------------ 1. else-if chain --- */

export function IfChainPlay({ lang }: P) {
  const inputs: Array<{ label: string; value: number | null }> = [
    { label: "null", value: null },
    { label: "50.000", value: 50000 },
    { label: "250.000", value: 250000 },
    { label: "1.500.000", value: 1500000 },
  ];
  const branches = [
    { cond: "revenue == null", result: "'Standard'", test: (v: number | null) => v === null },
    { cond: "revenue >= 1000000", result: "'Platinum'", test: (v: number | null) => v !== null && v >= 1000000 },
    { cond: "revenue >= 100000", result: "'Gold'", test: (v: number | null) => v !== null && v >= 100000 },
    { cond: "else", result: "'Standard'", test: () => true },
  ];

  const [pick_, setPick] = useState(2);
  const value = inputs[pick_].value;
  const winner = branches.findIndex((b) => b.test(value));
  const s = useStepper(winner + 2, 1600);

  const stateOf = (n: number): RowState => {
    if (n > winner) return s.i > winner ? "skip" : "wait";
    if (n < s.i) return n === winner ? "win" : "false";
    if (n === s.i) return n === winner ? "win" : "false";
    return "wait";
  };

  const done = s.i > winner;
  const note = done
    ? pick(
        lang,
        winner === branches.length - 1
          ? "Ninguna condición fue verdadera, así que entra el else. Las condiciones de debajo del ganador nunca llegan a mirarse."
          : "La primera condición verdadera gana y el resto ni se evalúa, aunque también fuera verdadera. Por eso el orden va de la más exigente a la menos.",
        winner === branches.length - 1
          ? "No condition was true, so the else runs. The conditions below the winner are never even looked at."
          : "The first true condition wins and the rest are not even evaluated, even if they were true too. That is why the order goes from strictest to loosest.",
      )
    : s.i === winner
      ? pick(lang, `Verdadera: tier = ${branches[winner].result}.`, `True: tier = ${branches[winner].result}.`)
      : pick(
          lang,
          `${branches[s.i].cond} es false con revenue = ${inputs[pick_].label}: se baja a la siguiente.`,
          `${branches[s.i].cond} is false with revenue = ${inputs[pick_].label}: move down to the next one.`,
        );

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-micro font-semibold tracking-[0.06em] text-faint">{pick(lang, "FACTURACIÓN", "REVENUE")}</span>
        {inputs.map((x, n) => (
          <Chip
            key={x.label}
            on={pick_ === n}
            onClick={() => {
              setPick(n);
              s.go(0);
            }}
          >
            {x.label}
          </Chip>
        ))}
      </div>
      <ol className="space-y-2">
        {branches.map((b, n) => {
          const st = stateOf(n);
          return (
            <li key={n} className="flex items-center gap-3 rounded-[4px] border px-3 py-2 transition-colors" style={rowStyle(st)}>
              <code className="min-w-0 flex-1 font-mono text-[12.5px] text-ink">
                {n === 0 ? "if" : b.cond === "else" ? "} else" : "} else if"}
                {b.cond === "else" ? " {" : ` (${b.cond}) {`}{" "}
                <span className="text-faint">tier = {b.result};</span>
              </code>
              <Badge state={st} lang={lang} />
            </li>
          );
        })}
      </ol>
      <Note lang={lang} s={s}>
        {note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------------------ 2. switch --- */

export function SwitchPlay({ lang }: P) {
  const values = ["'Phone'", "'Email'", "'Web'", "null", "'Chat'"];
  const arms = [
    { when: "when 'Phone'", queue: pick(lang, "Soporte telefónico", "Phone support"), matches: ["'Phone'"] },
    { when: "when 'Email', 'Web'", queue: pick(lang, "Soporte digital", "Digital support"), matches: ["'Email'", "'Web'"] },
    { when: "when null", queue: pick(lang, "Revisión manual", "Manual review"), matches: ["null"] },
    { when: "when else", queue: pick(lang, "Soporte general", "General support"), matches: [] as string[] },
  ];
  const [v, setV] = useState(1);
  const value = values[v];
  const hit = arms.findIndex((a) => a.matches.includes(value));
  const winner = hit === -1 ? arms.length - 1 : hit;

  const notes: Record<string, string> = {
    "'Phone'": pick(lang, "Coincidencia exacta con el primer when.", "An exact match with the first when."),
    "'Email'": pick(
      lang,
      "Un when admite varios valores separados por comas: 'Email' y 'Web' van a la misma cola sin repetir código.",
      "One when accepts several comma-separated values: 'Email' and 'Web' go to the same queue without repeating code.",
    ),
    "'Web'": pick(lang, "El mismo when que 'Email': la coma es un «o».", "The same when as 'Email': the comma is an “or”."),
    null: pick(
      lang,
      "switch sabe manejar el campo vacío con when null. Sin esa rama, un caso sin canal caería en el else.",
      "switch can handle the empty field with when null. Without that arm, a case with no origin would fall into the else.",
    ),
    "'Chat'": pick(
      lang,
      "Alguien añadió 'Chat' al picklist y nadie avisó. Ningún when lo nombra, así que cae en when else: el código no se rompe. Es la red de seguridad para los valores que aún no existen.",
      "Someone added 'Chat' to the picklist and nobody said. No when names it, so it falls into when else: the code does not break. It is the safety net for values that do not exist yet.",
    ),
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-micro font-semibold tracking-[0.06em] text-faint">c.Origin =</span>
        {values.map((x, n) => (
          <Chip key={x} on={v === n} onClick={() => setV(n)}>
            {x}
          </Chip>
        ))}
      </div>
      <div className="rounded-[4px] px-3 py-2 font-mono text-[12.5px] text-ink" style={codeBox}>
        switch on c.Origin {"{"}
      </div>
      <ol className="mt-2 space-y-2 pl-4">
        {arms.map((a, n) => (
          <li
            key={a.when}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[4px] border px-3 py-2 transition-colors"
            style={rowStyle(n === winner ? "win" : "wait")}
          >
            <code className="font-mono text-[12.5px] text-ink">{a.when}</code>
            <span className="t-small text-muted">→ {a.queue}</span>
          </li>
        ))}
      </ol>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        <strong className="text-ink">
          {pick(lang, "Cola:", "Queue:")} {arms[winner].queue}.
        </strong>{" "}
        {notes[value]}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- 3. scope --- */

export function ScopePlay({ lang }: P) {
  const lines: Array<{ code: string; depth: number; alive: string[]; note: string; error?: boolean }> = [
    {
      code: "Decimal amount = 80000;",
      depth: 0,
      alive: ["amount"],
      note: pick(lang, "amount nace en el bloque de fuera: vivirá hasta el final.", "amount is born in the outer block: it will live until the end."),
    },
    {
      code: "String approver;",
      depth: 0,
      alive: ["amount", "approver"],
      note: pick(
        lang,
        "approver se declara FUERA del if, aunque todavía no tenga valor. Esa es la decisión que hace que luego se pueda usar abajo.",
        "approver is declared OUTSIDE the if, even though it has no value yet. That decision is what lets you use it further down.",
      ),
    },
    {
      code: "if (amount >= 50000) {",
      depth: 0,
      alive: ["amount", "approver"],
      note: pick(lang, "Se abre una llave: empieza un bloque nuevo, dentro del anterior.", "A brace opens: a new block starts, inside the previous one."),
    },
    {
      code: "String note = 'Revisión legal';",
      depth: 1,
      alive: ["amount", "approver", "note"],
      note: pick(
        lang,
        "note nace DENTRO del bloque del if. Desde aquí dentro se ven las tres variables: las de fuera y la suya.",
        "note is born INSIDE the if's block. From in here all three variables are visible: the outer ones and its own.",
      ),
    },
    {
      code: "approver = 'Director';",
      depth: 1,
      alive: ["amount", "approver", "note"],
      note: pick(
        lang,
        "Desde dentro se puede cambiar una variable de fuera: approver no es de este bloque, pero se ve.",
        "From inside you can change an outer variable: approver does not belong to this block, but it is visible.",
      ),
    },
    {
      code: "}",
      depth: 0,
      alive: ["amount", "approver"],
      note: pick(
        lang,
        "Se cierra la llave y note desaparece con ella. Es como una variable de un Flow que solo existe dentro de un elemento de bucle.",
        "The brace closes and note disappears with it. It is like a Flow variable that only exists inside a loop element.",
      ),
    },
    {
      code: "System.debug(approver);",
      depth: 0,
      alive: ["amount", "approver"],
      note: pick(lang, "✓ Compila: approver sigue viva, porque nació fuera.", "✓ Compiles: approver is still alive, because it was born outside."),
    },
    {
      code: "System.debug(note);",
      depth: 0,
      alive: ["amount", "approver"],
      note: pick(
        lang,
        "✗ No compila: «Variable does not exist: note». Declarar dentro del if lo que necesitas después es el error de la tarea 3.",
        "✗ Does not compile: “Variable does not exist: note”. Declaring inside the if what you need afterwards is task 3's bug.",
      ),
      error: true,
    },
  ];
  const s = useStepper(lines.length, 1900);
  const cur = lines[s.i];
  const all = ["amount", "approver", "note"];

  return (
    <div className="w-full">
      <ol className="rounded-[4px] px-3 py-2.5 font-mono text-[12.5px] leading-[1.9]" style={codeBox}>
        {lines.map((l, n) => (
          <li
            key={n}
            className="rounded-[3px] px-1 transition-colors"
            style={{
              paddingLeft: 4 + l.depth * 20,
              background: n === s.i ? (l.error ? "var(--c-danger-soft)" : "var(--c-brand-soft)") : "transparent",
              color: n === s.i ? (l.error ? "var(--c-danger)" : "var(--c-brand)") : n < s.i ? "var(--c-heading)" : "var(--c-text-faint)",
              fontWeight: n === s.i ? 600 : 400,
            }}
          >
            {l.code}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="t-micro font-semibold tracking-[0.06em] text-faint">{pick(lang, "VARIABLES VIVAS", "LIVE VARIABLES")}</span>
        {all.map((v) => {
          const alive = cur.alive.includes(v);
          return (
            <span
              key={`${v}-${alive}`}
              className={`rounded-full border px-3 py-1 font-mono text-[12.5px] ${alive ? "diag-pop" : ""}`}
              style={{
                borderColor: alive ? "var(--c-brand)" : "var(--c-border)",
                borderStyle: alive ? "solid" : "dashed",
                color: alive ? "var(--c-brand)" : "var(--c-text-faint)",
                textDecoration: alive ? "none" : "line-through",
              }}
            >
              {v}
            </span>
          );
        })}
      </div>
      <Note lang={lang} s={s}>
        {cur.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------------------- 4. while --- */

export function WhilePlay({ lang }: P) {
  const [tab, setTab] = useState(0);
  // Tab 0: a payment plan that shrinks. Tab 1: the body forgets to change it.
  const passes =
    tab === 0
      ? [1000, 700, 400, 100, -200].map((b, n) => ({ balance: b, months: n }))
      : [1000, 1000, 1000, 1000, 1000].map((b, n) => ({ balance: b, months: n === 4 ? 120 : n }));
  const s = useStepper(passes.length, 1600);
  const cur = passes[s.i];
  const guard = tab === 1;
  const stops = guard ? s.i === passes.length - 1 : cur.balance <= 0;

  const code =
    tab === 0
      ? "while (balance > 0) {\n    balance -= 300;\n    months++;\n}"
      : `while (balance > 0 && months < 120) {\n    ${pick(lang, "// se olvidó de restar", "// forgot to subtract")}\n    months++;\n}`;

  const note = (() => {
    if (tab === 0) {
      if (s.i === 0) return pick(lang, "Antes de la primera vuelta se COMPRUEBA: 1000 > 0 es true, así que entra.", "Before the first pass it CHECKS: 1000 > 0 is true, so it goes in.");
      if (!stops) return pick(lang, `Vuelta ${cur.months}: el cuerpo resta 300. Vuelve arriba y comprueba otra vez: ${cur.balance} > 0 sigue siendo true.`, `Pass ${cur.months}: the body subtracts 300. Back to the top to check again: ${cur.balance} > 0 is still true.`);
      return pick(lang, `Vuelta ${cur.months}: balance vale ${cur.balance}. Al comprobar, ${cur.balance} > 0 es false y el bucle termina. months = ${cur.months}.`, `Pass ${cur.months}: balance is ${cur.balance}. On the check, ${cur.balance} > 0 is false and the loop ends. months = ${cur.months}.`);
    }
    if (!stops)
      return pick(lang, `Vuelta ${cur.months}: el cuerpo no toca balance, así que balance > 0 será true siempre. Solo avanza months.`, `Pass ${cur.months}: the body never touches balance, so balance > 0 will always be true. Only months moves.`);
    return pick(
      lang,
      "…y así hasta la vuelta 120, donde el tope corta. Sin «months < 120», esto no pararía nunca y la transacción moriría por el límite de CPU. Un while siempre necesita que algo cambie la condición, o un tope que lo frene.",
      "…and so on until pass 120, where the cap cuts it off. Without “months < 120” this would never stop and the transaction would die on the CPU limit. A while always needs something that changes the condition, or a cap to brake it.",
    );
  })();

  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "Plan de pagos", "Payment plan"), pick(lang, "Cuerpo que no cambia nada", "A body that changes nothing")]}
        value={tab}
        onChange={(n) => {
          setTab(n);
          s.go(0);
        }}
      />
      <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code className="block whitespace-pre font-mono text-[12.5px] leading-[1.7] text-ink">{code}</code>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-[360px]">
        {[
          ["balance", String(cur.balance)],
          ["months", String(cur.months)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[4px] border px-3 py-2" style={{ borderColor: "var(--c-border)" }}>
            <p className="t-micro font-mono text-faint">{k}</p>
            <p key={`${k}-${v}`} className="diag-pop font-mono text-[15px] font-semibold tabular-nums text-ink">
              {v}
            </p>
          </div>
        ))}
      </div>
      <p className="t-small mt-2 font-mono" style={{ color: stops ? (guard ? "var(--c-warn)" : "var(--c-brand)") : "var(--c-text-muted)" }}>
        {stops ? (guard ? pick(lang, "⏹ Frenado por el tope", "⏹ Stopped by the cap") : pick(lang, "⏹ Condición false: sale del bucle", "⏹ Condition false: leaves the loop")) : pick(lang, "↻ Condición true: otra vuelta", "↻ Condition true: another pass")}
      </p>
      <Note lang={lang} s={s}>
        {note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ---------------------------------------------------------- 5. for-each --- */

export function ForEachPlay({ lang }: P) {
  const opps = [
    { name: "Northwind · Renovación", stage: "Negotiation", amount: 24500 },
    { name: "Acme · Licencias", stage: "Prospecting", amount: 40000 },
    { name: "Initech · Planta", stage: "Negotiation", amount: 120000 },
    { name: "Globex · Piloto", stage: "Qualification", amount: 15000 },
  ];
  const s = useStepper(opps.length + 1, 1700);
  const passes = Math.min(s.i, opps.length);
  const seen = opps.slice(0, passes);
  const total = seen.reduce((n, o) => n + o.amount, 0);
  const inNegotiation = seen.filter((o) => o.stage === "Negotiation").length;
  const cur = s.i < opps.length ? opps[s.i] : null;

  const note =
    cur === null
      ? pick(
          lang,
          `No quedan elementos: el bucle termina solo, sin contador ni condición que escribir. total = ${total.toLocaleString("es-ES")}, y ${inNegotiation} en negociación. Es el elemento Bucle de Flow, pero sin arrastrar la variable de colección a mano.`,
          `No elements left: the loop ends on its own, with no counter or condition to write. total = ${total.toLocaleString("en-GB")}, and ${inNegotiation} in negotiation. It is Flow's Loop element, without wiring the collection variable by hand.`,
        )
      : pick(
          lang,
          `Vuelta ${s.i + 1} de ${opps.length}: opp es «${cur.name}». Se suma su importe${cur.stage === "Negotiation" ? " y, como está en Negotiation, cuenta también" : ""}.`,
          `Pass ${s.i + 1} of ${opps.length}: opp is “${cur.name}”. Its amount is added${cur.stage === "Negotiation" ? " and, being in Negotiation, it is counted too" : ""}.`,
        );

  return (
    <div className="w-full">
      <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code className="block whitespace-pre font-mono text-[12.5px] leading-[1.7] text-ink">
          {`for (Opportunity opp : opps) {\n    total += opp.Amount;\n    if (opp.StageName == 'Negotiation') inNegotiation++;\n}`}
        </code>
      </div>
      <ol className="mt-4 space-y-1.5">
        {opps.map((o, n) => {
          const state = n === s.i ? "cur" : n < s.i ? "done" : "next";
          return (
            <li
              key={o.name}
              className="flex items-center gap-3 rounded-[4px] border px-3 py-1.5 transition-colors"
              style={{
                borderColor: state === "cur" ? "var(--c-brand)" : "var(--c-border)",
                background: state === "cur" ? "var(--c-brand-soft)" : "transparent",
                opacity: state === "next" ? 0.6 : 1,
              }}
            >
              <span className="t-micro w-12 shrink-0 font-mono text-faint">{state === "cur" ? "opp →" : state === "done" ? "✓" : ""}</span>
              <span className="t-small min-w-0 flex-1 text-ink">{o.name}</span>
              <span className="t-micro shrink-0 font-mono text-faint">{o.stage}</span>
              <span className="t-small shrink-0 font-mono tabular-nums text-ink">{o.amount.toLocaleString("es-ES")}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex flex-wrap gap-3">
        {[
          ["total", total.toLocaleString("es-ES")],
          ["inNegotiation", String(inNegotiation)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[4px] border px-3 py-2" style={{ borderColor: "var(--c-border)" }}>
            <p className="t-micro font-mono text-faint">{k}</p>
            <p key={`${k}-${v}`} className="diag-pop font-mono text-[15px] font-semibold tabular-nums text-ink">
              {v}
            </p>
          </div>
        ))}
      </div>
      <Note lang={lang} s={s}>
        {note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ---------------------------------------------------- 6. break / continue -- */

export function BreakContinuePlay({ lang }: P) {
  const leads = [
    { name: "Díaz", email: "", rating: "Warm" },
    { name: "Méndez", email: "m@globex.com", rating: "Cold" },
    { name: "Ruiz", email: "", rating: "Hot" },
    { name: "Torres", email: "ana@northwind.com", rating: "Hot" },
    { name: "Soto", email: "soto@acme.com", rating: "Hot" },
  ];
  type Act = "continue" | "check" | "break";
  const actOf = (n: number): Act => (!leads[n].email ? "continue" : leads[n].rating === "Hot" ? "break" : "check");
  const stopAt = leads.findIndex((_, n) => actOf(n) === "break");
  const s = useStepper(stopAt + 2, 1700);

  const stateOf = (n: number) => {
    if (n > stopAt) return s.i > stopAt ? "never" : "next";
    if (n > s.i) return "next";
    return actOf(n);
  };

  const note = (() => {
    if (s.i > stopAt)
      return pick(
        lang,
        `break sale del bucle en el acto: Soto también es Hot y tiene email, pero nadie llega a mirarlo. Resultado: ${leads[stopAt].name}.`,
        `break leaves the loop on the spot: Soto is also Hot with an email, but nobody ever looks at it. Result: ${leads[stopAt].name}.`,
      );
    const l = leads[s.i];
    if (actOf(s.i) === "continue")
      return pick(lang, `${l.name} no tiene email: continue salta al siguiente sin ejecutar el resto del cuerpo. No se le puede llamar, así que ni se mira si es Hot.`, `${l.name} has no email: continue jumps to the next one without running the rest of the body. It cannot be contacted, so whether it is Hot is not even checked.`);
    if (actOf(s.i) === "check") return pick(lang, `${l.name} tiene email pero es ${l.rating}: se revisa y el bucle sigue.`, `${l.name} has an email but is ${l.rating}: it is checked and the loop carries on.`);
    return pick(lang, `${l.name} tiene email y es Hot: es el primero que buscábamos. break.`, `${l.name} has an email and is Hot: the first one we wanted. break.`);
  })();

  const pillFor = (st: string) => {
    const map: Record<string, { t: string; fg: string; bg: string }> = {
      continue: { t: "continue", fg: "var(--c-warn)", bg: "var(--c-warn-soft)" },
      check: { t: pick(lang, "revisado", "checked"), fg: "var(--c-text-muted)", bg: "transparent" },
      break: { t: "break", fg: "var(--c-brand)", bg: "var(--c-brand-soft)" },
      never: { t: pick(lang, "nunca se mira", "never looked at"), fg: "var(--c-text-faint)", bg: "transparent" },
      next: { t: "", fg: "var(--c-text-faint)", bg: "transparent" },
    };
    return map[st];
  };

  return (
    <div className="w-full">
      <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code className="block whitespace-pre font-mono text-[12.5px] leading-[1.7] text-ink">
          {`for (Lead l : leads) {\n    if (String.isBlank(l.Email)) continue;\n    if (l.Rating == 'Hot') { first = l; break; }\n}`}
        </code>
      </div>
      <ol className="mt-4 space-y-1.5">
        {leads.map((l, n) => {
          const st = stateOf(n);
          const pill = pillFor(st);
          return (
            <li
              key={l.name}
              className="flex items-center gap-3 rounded-[4px] border px-3 py-1.5 transition-colors"
              style={{
                borderColor: n === s.i && s.i <= stopAt ? "var(--c-brand)" : "var(--c-border)",
                borderStyle: st === "never" ? "dashed" : "solid",
              }}
            >
              <span className="t-small min-w-0 flex-1 text-ink">{l.name}</span>
              <span className="t-micro hidden shrink-0 font-mono text-faint sm:inline">{l.email || pick(lang, "(sin email)", "(no email)")}</span>
              <span className="t-micro shrink-0 font-mono text-faint">{l.rating}</span>
              {pill.t && (
                <span key={st} className="diag-pop t-micro shrink-0 rounded-full px-2 py-0.5 font-mono font-semibold" style={{ color: pill.fg, background: pill.bg }}>
                  {pill.t}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <Note lang={lang} s={s}>
        {note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* --------------------------------------------- 7. nested loop vs a Set ---- */

export function NestedVsSetPlay({ lang }: P) {
  const [n, setN] = useState(200);
  const nested = n * n;
  const withSet = n + n;
  const max = nested;

  const Bar = ({ label, value, tone }: { label: string; value: number; tone: "warn" | "brand" }) => (
    <div>
      <p className="t-micro mb-1 flex items-baseline justify-between gap-2">
        <span className="font-semibold tracking-[0.06em] text-faint">{label}</span>
        <span className="font-mono tabular-nums text-ink">
          {value.toLocaleString("es-ES")} {pick(lang, "vueltas", "passes")}
        </span>
      </p>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        title={value.toLocaleString("es-ES")}
        className="h-[10px] w-full overflow-hidden rounded-[4px]"
        style={{ background: "var(--c-surface-2)" }}
      >
        <div
          className="h-full rounded-[4px] transition-[width] duration-500"
          style={{ width: `max(4px, ${(value / max) * 100}%)`, background: tone === "warn" ? "var(--c-warn)" : "var(--c-brand)" }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-micro font-semibold tracking-[0.06em] text-faint">{pick(lang, "CUENTAS Y LEADS", "ACCOUNTS AND LEADS")}</span>
        {[10, 200, 1000].map((x) => (
          <Chip key={x} on={n === x} onClick={() => setN(x)}>
            {x.toLocaleString("es-ES")}
          </Chip>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
          <p className="t-micro mb-1 font-semibold text-faint">{pick(lang, "ANIDADO", "NESTED")}</p>
          <code className="block whitespace-pre font-mono text-[12px] leading-[1.6] text-ink">
            {"for (Lead l : leads)\n  for (Account a : accounts)\n    if (l.Company == a.Name) …"}
          </code>
        </div>
        <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
          <p className="t-micro mb-1 font-semibold text-faint">{pick(lang, "CON UN SET", "WITH A SET")}</p>
          <code className="block whitespace-pre font-mono text-[12px] leading-[1.6] text-ink">
            {"for (Account a : accounts)\n  names.add(a.Name);\nfor (Lead l : leads)\n  if (names.contains(l.Company)) …"}
          </code>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        <Bar label={pick(lang, "ANIDADO", "NESTED")} value={nested} tone="warn" />
        <Bar label={pick(lang, "CON UN SET", "WITH A SET")} value={withSet} tone="brand" />
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        <strong className="text-ink">
          {pick(lang, `${Math.round(nested / withSet).toLocaleString("es-ES")} veces más trabajo anidado.`, `${Math.round(nested / withSet).toLocaleString("en-GB")} times more work nested.`)}
        </strong>{" "}
        {n === 10
          ? pick(lang, "Con 10 no se nota: por eso el anidado pasa las pruebas con datos de ejemplo.", "With 10 you cannot tell: which is why nesting passes testing with sample data.")
          : pick(
              lang,
              "El anidado crece con el cuadrado: si duplicas los registros, cuadruplicas las vueltas. El Set crece en línea recta, porque contains() responde sin recorrer nada. Y el tiempo de CPU de una transacción tiene límite.",
              "Nesting grows with the square: double the records and you quadruple the passes. The Set grows in a straight line, because contains() answers without walking anything. And a transaction's CPU time is capped.",
            )}
      </p>
    </div>
  );
}

/* ------------------------------------------- 8. which structure? (game) --- */

export function ControlChooserPlay({ lang }: P) {
  const all = ["switch on", "if / else if", "cond ? a : b", "for (T x : list)", "while", "continue", "break", "Set / Map"];
  const needs = [
    { need: pick(lang, "Asignar una cola según el valor exacto de un picklist.", "Route to a queue by a picklist's exact value."), answer: "switch on" },
    { need: pick(lang, "Poner un nivel según tramos de facturación.", "Set a tier by revenue bands."), answer: "if / else if" },
    { need: pick(lang, "Guardar 'Director' o 'Jefe de equipo' según el importe.", "Store 'Director' or 'Team lead' depending on the amount."), answer: "cond ? a : b" },
    { need: pick(lang, "Sumar el importe de cada oportunidad de una lista.", "Add up every opportunity's amount in a list."), answer: "for (T x : list)" },
    { need: pick(lang, "Repetir hasta que el pipeline alcance el objetivo.", "Repeat until the pipeline reaches the target."), answer: "while" },
    { need: pick(lang, "Saltarse los casos cerrados dentro de un recorrido.", "Skip closed cases inside a walk."), answer: "continue" },
    { need: pick(lang, "Parar en cuanto aparece el primer caso urgente.", "Stop as soon as the first urgent case appears."), answer: "break" },
    { need: pick(lang, "Saber qué leads son de empresas que ya son clientes.", "Know which leads come from existing customers."), answer: "Set / Map" },
  ];
  return <ChooserGame lang={lang} all={all} needs={needs} />;
}
