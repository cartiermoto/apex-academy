"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { ChooserGame, Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 8's interactive diagrams, told through its workshops: Northwind's
 * nightly bridge with the ERP, from a single try/catch to the full importer.
 */

type P = { lang: Lang };
const eyebrow = "t-micro mb-2 font-semibold tracking-[0.06em] text-faint";

type Tone = "ok" | "bad" | "gone" | "plain";
function Tag({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const c =
    tone === "ok"
      ? { color: "var(--c-brand)", background: "var(--c-brand-soft)" }
      : tone === "bad"
        ? { color: "var(--c-danger)", background: "var(--c-danger-soft)" }
        : { color: "var(--c-text-muted)", background: "var(--c-surface-2)" };
  return (
    <span className="diag-pop t-micro inline-block rounded-full px-2 py-0.5 font-semibold" style={{ ...c, textDecoration: tone === "gone" ? "line-through" : "none" }}>
      {children}
    </span>
  );
}

function Counter({ label, value, danger }: { label: string; value: number | string; danger?: boolean }) {
  return (
    <div className="rounded-[4px] px-3 py-2" style={{ background: "var(--c-surface-2)" }}>
      <p className="t-micro text-faint">{label}</p>
      <p className="t-body font-mono font-semibold tabular-nums" style={{ color: danger ? "var(--c-danger)" : "var(--c-text)" }}>
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------- 1. the rows, with and without try --- */

export function TryFlowPlay({ lang }: P) {
  const rows = ["'12500.00'", "'8300.50'", "'12.500,00'", "''", "'4100'"];
  const bad = [false, false, true, true, false];
  const [mode, setMode] = useState(0); // 0 no try · 1 try around the loop · 2 try per row
  const s = useStepper(rows.length + 1, 1200);
  const done = s.i; // rows the loop has reached

  // where each mode stops: no try → dies at the first bad row; try outside → the catch ends the loop there
  const firstBad = bad.indexOf(true);
  const stopAt = mode === 2 ? rows.length : firstBad + 1;
  const reached = Math.min(done, stopAt);
  const crashed = mode === 0 && done > firstBad;

  const state = (n: number): { tone: Tone; label: string } | null => {
    if (crashed) {
      if (n < firstBad) return { tone: "gone", label: pick(lang, "deshecha", "rolled back") };
      if (n === firstBad) return { tone: "bad", label: "TypeException" };
      return { tone: "plain", label: pick(lang, "nunca llega", "never reached") };
    }
    if (n >= reached) {
      if (mode === 1 && done > firstBad && n > firstBad) return { tone: "plain", label: pick(lang, "el bucle ya salió", "the loop already left") };
      return null;
    }
    if (bad[n]) return { tone: "bad", label: pick(lang, "catch · fallida", "catch · failed") };
    return { tone: "ok", label: pick(lang, "importada", "imported") };
  };

  const imported = crashed ? 0 : bad.slice(0, reached).filter((b) => !b).length;
  const failed = crashed ? 0 : bad.slice(0, reached).filter(Boolean).length;
  const processed = mode === 2 ? reached : 0;
  const finished = done === rows.length;

  const code = [
    "for (String raw : rawAmounts) {\n    total += Decimal.valueOf(raw);\n}",
    "try {\n    for (String raw : rawAmounts) {\n        total += Decimal.valueOf(raw);\n    }\n} catch (TypeException e) {\n    failed++;\n}",
    "for (String raw : rawAmounts) {\n    try {\n        total += Decimal.valueOf(raw);\n    } catch (TypeException e) {\n        failed++;\n    } finally {\n        processed++;\n    }\n}",
  ][mode];

  const say =
    done === 0
      ? pick(lang, "Cinco importes del ERP; dos vienen mal escritos. Pulsa Reproducir.", "Five amounts from the ERP; two are badly written. Press Play.")
      : crashed
        ? pick(
            lang,
            "System.TypeException en la fila 3, sin nadie que la capture: la transacción se para y se deshace. Ni las dos filas buenas de antes se salvan.",
            "System.TypeException on row 3, with nobody to catch it: the transaction stops and is rolled back. Not even the two good rows before it survive.",
          )
        : mode === 1 && done > firstBad
          ? pick(
              lang,
              "El catch atrapa el fallo… pero está fuera del bucle, así que el bucle ya terminó. La fila '4100', que estaba bien, no se importa nunca.",
              "The catch traps the failure… but it sits outside the loop, so the loop is already over. The '4100' row, which was fine, is never imported.",
            )
          : finished && mode === 2
            ? pick(
                lang,
                "Cada fila tiene su fault path: las dos malas se cuentan, las tres buenas entran, y el finally sumó las cinco. Esto es la tarea 1.",
                "Each row has its own fault path: the two bad ones are counted, the three good ones get in, and the finally added all five. This is task 1.",
              )
            : pick(lang, `Fila ${done}: ${rows[done - 1]}`, `Row ${done}: ${rows[done - 1]}`);

  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "Sin try", "No try"), pick(lang, "try fuera del bucle", "try around the loop"), pick(lang, "try en cada fila", "try on each row")]}
        value={mode}
        onChange={(n) => { setMode(n); s.go(0); }}
      />
      <div className="grid gap-3 md:grid-cols-2">
        <pre className="t-small overflow-x-auto whitespace-pre rounded-[4px] p-3 font-mono" style={codeBox}>
          {code}
        </pre>
        <ul className="space-y-1.5">
          {rows.map((r, n) => {
            const st = state(n);
            return (
              <li key={r} className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5">
                <span className="font-mono">{r}</span>
                {st && (
                  <span key={`${mode}-${done}`}>
                    <Tag tone={st.tone}>{st.label}</Tag>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Counter label={pick(lang, "importadas", "imported")} value={imported} />
        <Counter label="failed" value={failed} danger={failed > 0} />
        <Counter label="processed" value={mode === 2 ? processed : "—"} />
      </div>
      <Note lang={lang} s={s}>
        {say}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ---------------------------------------------- 2. which exception? (game) --- */

export function ExceptionTypesPlay({ lang }: P) {
  const all = ["QueryException", "DmlException", "NullPointerException", "TypeException", "ListException", "SObjectException", "LimitException"];
  const needs = [
    { need: "Account a = [SELECT Id FROM Account WHERE ERP_Code__c = 'ERP-404'];", answer: "QueryException" },
    { need: pick(lang, "insert renewal; // su OwnerId es un usuario inactivo", "insert renewal; // its OwnerId is an inactive user"), answer: "DmlException" },
    { need: "Decimal d = Decimal.valueOf('12.500,00');", answer: "TypeException" },
    { need: pick(lang, "String n = acc.Name; // acc es null", "String n = acc.Name; // acc is null"), answer: "NullPointerException" },
    { need: pick(lang, "String third = rows[2]; // rows tiene 2 elementos", "String third = rows[2]; // rows has 2 elements"), answer: "ListException" },
    { need: pick(lang, "String ind = a.Industry; // el SELECT solo traía Id", "String ind = a.Industry; // the SELECT only brought Id"), answer: "SObjectException" },
    { need: pick(lang, "// la consulta número 101 de la transacción", "// the transaction's query number 101"), answer: "LimitException" },
  ];
  return (
    <ChooserGame
      lang={lang}
      all={all}
      needs={needs}
      eyebrow={pick(lang, "¿QUÉ EXCEPCIÓN SALTA?", "WHICH EXCEPTION IS THROWN?")}
      hint={pick(lang, "Elige la excepción que lanza esta línea.", "Pick the exception this line throws.")}
    />
  );
}

/* ------------------------------------------------ 3. how far it climbs --- */

export function PropagationPlay({ lang }: P) {
  // the call stack, top to bottom: where the exception is born and where it can land
  const frames = [
    { id: "platform", label: pick(lang, "Plataforma (la transacción)", "Platform (the transaction)") },
    { id: "loop", label: "for (String raw : rawAmounts) { … }" },
    { id: "parse", label: "RenewalRow.parseAmount(raw)" },
  ];
  const [catchAt, setCatchAt] = useState(0); // 0 nowhere · 1 in the loop · 2 inside parseAmount
  const s = useStepper(4, 1300);
  const landed = catchAt; // frame index of the catch (0 = nobody: the platform)
  // born in parseAmount (frame 2) on step 1, one frame up per step, until it lands
  const cur = s.i === 0 ? -1 : Math.max(3 - s.i, landed);
  const stopped = cur === landed;

  const verdict = [
    pick(
      lang,
      "Nadie la captura: llega a la plataforma, que para la transacción y deshace todo. Las filas importadas antes también se pierden.",
      "Nobody catches it: it reaches the platform, which stops the transaction and rolls everything back. The rows imported earlier are lost too.",
    ),
    pick(
      lang,
      "La atrapa el bucle, que es quien sabe qué hacer: apunta la fila como rechazada y sigue con la siguiente. parseAmount se queda pequeño y honesto.",
      "The loop catches it, and it is the one that knows what to do: it notes the row as rejected and moves on. parseAmount stays small and honest.",
    ),
    pick(
      lang,
      "parseAmount se la traga a sí mismo… y ¿qué devuelve? ¿null? ¿0? El bucle no se entera de que la fila era mala e importa un importe inventado.",
      "parseAmount swallows it itself… and returns what? null? 0? The loop never learns the row was bad and imports a made-up amount.",
    ),
  ][catchAt];

  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "Sin catch", "No catch"), pick(lang, "catch en el bucle", "catch in the loop"), pick(lang, "catch dentro del método", "catch inside the method")]}
        value={catchAt}
        onChange={(n) => { setCatchAt(n); s.go(0); }}
      />
      <p className={eyebrow}>{pick(lang, "LA PILA DE LLAMADAS · ARRIBA, QUIEN LLAMA", "THE CALL STACK · CALLERS ON TOP")}</p>
      <ol className="space-y-1.5">
        {frames.map((f, n) => {
          const here = cur === n;
          const catches = n === landed && n !== 0;
          const died = here && n === 0;
          const arrived = here && stopped;
          return (
            <li
              key={f.id}
              className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border px-3 py-2 font-mono transition-colors"
              style={{
                borderColor: here ? (died ? "var(--c-danger)" : catches && arrived ? "var(--c-brand)" : "var(--c-border-strong)") : "var(--c-border)",
                background: here ? (died ? "var(--c-danger-soft)" : catches && arrived ? "var(--c-brand-soft)" : "var(--c-surface-2)") : "transparent",
              }}
            >
              <span>{f.label}</span>
              <span className="flex flex-wrap gap-1">
                {n === 2 && <Tag tone="plain">throw new IllegalArgumentException(…)</Tag>}
                {catches && <Tag tone="ok">catch</Tag>}
                {here && (
                  <span key={`${catchAt}-${s.i}`}>
                    <Tag tone={died ? "bad" : catches ? "ok" : "bad"}>{died ? pick(lang, "✗ se deshace todo", "✗ all rolled back") : catches ? pick(lang, "✓ atrapada aquí", "✓ caught here") : pick(lang, "⚡ excepción", "⚡ exception")}</Tag>
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <Note lang={lang} s={s}>
        {s.i === 0
          ? pick(lang, "parseAmount recibe '' y lanza. Elige dónde está el catch y pulsa Reproducir.", "parseAmount receives '' and throws. Choose where the catch is and press Play.")
          : stopped
            ? verdict
            : pick(lang, "Nadie la captura aquí: sube un nivel, a quien llamó.", "Nobody catches it here: it climbs one level, to the caller.")}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ---------------------------------------- 4. whose catch picks it up? --- */

export function CustomExceptionPlay({ lang }: P) {
  const failures = [
    { key: "unknown", what: pick(lang, "Código 'ERP-999' que no existe", "Code 'ERP-999' that does not exist"), thrown: "RenewalImportException", cause: null, business: true },
    { key: "text", what: pick(lang, "Importe 'doce mil'", "Amount 'twelve thousand'"), thrown: "RenewalImportException", cause: "System.TypeException", business: true },
    { key: "neg", what: pick(lang, "Importe '-300'", "Amount '-300'"), thrown: "RenewalImportException", cause: null, business: true },
    { key: "bug", what: pick(lang, "Un bug: acc.Name con acc null", "A bug: acc.Name with acc null"), thrown: "NullPointerException", cause: null, business: false },
  ];
  const [broad, setBroad] = useState(false); // false: catch (RenewalImportException e) · true: catch (Exception e)
  const [k, setK] = useState<number | null>(null);
  const f = k === null ? null : failures[k];
  const caught = f ? broad || f.business : false;

  const say = !f
    ? pick(lang, "Elige un fallo y mira qué catch lo recoge.", "Pick a failure and see which catch picks it up.")
    : caught && f.business
      ? pick(
          lang,
          `Fila rechazada y el bucle sigue.${f.cause ? ` Y con e.getCause().getTypeName() recuperas la original: ${f.cause}.` : ""}`,
          `Row rejected and the loop carries on.${f.cause ? ` And with e.getCause().getTypeName() you recover the original: ${f.cause}.` : ""}`,
        )
      : caught
        ? pick(
            lang,
            "catch (Exception e) la ha tratado como «fila rechazada». El bug queda escondido en el informe, entre los importes malos, y nadie lo arreglará.",
            "catch (Exception e) treated it as a «rejected row». The bug stays hidden in the report, among the bad amounts, and nobody will fix it.",
          )
        : pick(
            lang,
            "Tu catch no la reconoce: no es un error del negocio. La importación se para y el bug queda a la vista. Eso es bueno: se arregla hoy, no dentro de tres meses.",
            "Your catch does not recognise it: it is not a business error. The import stops and the bug is in plain sight. That is good: it gets fixed today, not in three months.",
          );

  return (
    <div className="w-full">
      <Tabs
        items={["catch (RenewalImportException e)", "catch (Exception e)"]}
        value={broad ? 1 : 0}
        onChange={(n) => setBroad(n === 1)}
      />
      <p className={eyebrow}>{pick(lang, "LANZA UN FALLO", "THROW A FAILURE")}</p>
      <div className="flex flex-wrap gap-2">
        {failures.map((x, n) => (
          <button key={x.key} type="button" className="btn btn-ghost" aria-pressed={k === n} onClick={() => setK(n)}>
            {x.what}
          </button>
        ))}
      </div>
      {f && (
        <div key={`${k}-${broad}`} className="diag-pop mt-3 grid gap-2 sm:grid-cols-2">
          <div className="t-small rounded-[4px] p-3" style={{ background: "var(--c-surface-2)" }}>
            <p className="t-micro text-faint">{pick(lang, "LLEGA AL BUCLE", "REACHES THE LOOP")}</p>
            <p className="font-mono [overflow-wrap:anywhere]">{f.thrown}</p>
            {f.cause && (
              <p className="t-micro mt-1 font-mono text-muted [overflow-wrap:anywhere]">
                getCause() → {f.cause}
              </p>
            )}
          </div>
          <div
            className="t-small rounded-[4px] border p-3"
            style={{
              borderColor: caught && f.business ? "var(--c-brand)" : "var(--c-danger)",
              background: caught && f.business ? "var(--c-brand-soft)" : "var(--c-danger-soft)",
            }}
          >
            <p className="t-micro text-faint">{pick(lang, "RESULTADO", "OUTCOME")}</p>
            <p className="font-semibold" style={{ color: caught && f.business ? "var(--c-brand)" : "var(--c-danger)" }}>
              {caught ? pick(lang, "capturada · fila rechazada", "caught · row rejected") : pick(lang, "no capturada · se para", "not caught · it stops")}
            </p>
          </div>
        </div>
      )}
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {say}
      </p>
    </div>
  );
}

/* ----------------------------- 5. throw or addError × insert or partial --- */

export function AddErrorPlay({ lang }: P) {
  const [how, setHow] = useState(1); // 0 throw · 1 addError
  const [partial, setPartial] = useState(true);
  const [ran, setRan] = useState(false);
  const opps = ["Acme · Renovación", "Globex · Renovación", "Acme · Renovación (2ª)", "Initech · Renovación"];
  const oppsEn = ["Acme · Renewal", "Globex · Renewal", "Acme · Renewal (2nd)", "Initech · Renewal"];
  const dup = 2;
  const outcome = (n: number): { tone: Tone; label: string } => {
    if (how === 0) return { tone: n === dup ? "bad" : "gone", label: n === dup ? pick(lang, "✗ excepción", "✗ exception") : pick(lang, "no guardada", "not saved") };
    if (n === dup) return { tone: "bad", label: pick(lang, "✗ addError", "✗ addError") };
    return partial ? { tone: "ok", label: pick(lang, "guardada", "saved") } : { tone: "gone", label: pick(lang, "no guardada", "not saved") };
  };
  const saved = how === 1 && partial ? 3 : 0;
  const say =
    how === 0
      ? pick(
          lang,
          "Una excepción sin capturar en el trigger hace fallar el guardado entero, se pida como se pida: 0 de 4. La noche del ERP, perdida por una fila.",
          "An uncaught exception in the trigger fails the entire save, however it was requested: 0 of 4. The ERP's night, lost to one row.",
        )
      : partial
        ? pick(
            lang,
            "addError marca solo la duplicada, y Database.insert(list, false) guarda el resto: 3 de 4. La duplicada llega a su SaveResult con tu mensaje, como una fila del error.csv.",
            "addError marks only the duplicate, and Database.insert(list, false) saves the rest: 3 of 4. The duplicate reaches its SaveResult with your message, like an error.csv row.",
          )
        : pick(
            lang,
            "addError marca solo la duplicada… pero insert es todo o nada: lanza una DmlException con tu mensaje y no se guarda ninguna. El trigger hizo bien su parte; el guardado decidió.",
            "addError marks only the duplicate… but insert is all or nothing: it throws a DmlException carrying your message and none is saved. The trigger did its part right; the save decided.",
          );

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className={eyebrow}>{pick(lang, "EL TRIGGER RECHAZA CON…", "THE TRIGGER REJECTS WITH…")}</p>
          <Tabs items={["throw", "addError"]} value={how} onChange={(n) => { setHow(n); setRan(false); }} />
        </div>
        <div>
          <p className={eyebrow}>{pick(lang, "EL ERP GUARDA CON…", "THE ERP SAVES WITH…")}</p>
          <Tabs items={["insert", "Database.insert(…, false)"]} value={partial ? 1 : 0} onChange={(n) => { setPartial(n === 1); setRan(false); }} />
        </div>
      </div>
      <ul className="space-y-1.5">
        {opps.map((o, n) => {
          const st = outcome(n);
          return (
            <li key={o} className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5">
              <span className="font-mono">{lang === "es" ? o : oppsEn[n]}</span>
              {ran && (
                <span key={`${how}-${partial}`}>
                  <Tag tone={st.tone}>{st.label}</Tag>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" onClick={() => setRan(true)}>
          {pick(lang, "💾 Guardar el lote", "💾 Save the batch")}
        </button>
        {ran && (
          <strong className="t-small" style={{ color: saved === 0 ? "var(--c-danger)" : "var(--c-brand)" }}>
            {pick(lang, `${saved} de 4 guardadas`, `${saved} of 4 saved`)}
          </strong>
        )}
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {ran ? say : pick(lang, "La tercera es una segunda renovación abierta de Acme. Elige las dos cosas y guarda.", "The third is a second open Acme renewal. Choose both things and save.")}
      </p>
    </div>
  );
}

/* ------------------------------------ 6. the Flow → Apex error dictionary --- */

export function ErrorDictionaryPlay({ lang }: P) {
  const all = [
    "try / catch",
    "Database.rollback(sp)",
    "addError",
    pick(lang, "excepción sin capturar", "uncaught exception"),
    "Database.insert(list, false) + SaveResult",
    "finally",
    "throw",
  ];
  const needs = [
    { need: pick(lang, "El fault path de un elemento", "An element's fault path"), answer: "try / catch" },
    { need: pick(lang, "El elemento Roll Back Records", "The Roll Back Records element"), answer: "Database.rollback(sp)" },
    { need: pick(lang, "El elemento Custom Error de un flow desencadenado por registro", "A record-triggered flow's Custom Error element"), answer: "addError" },
    { need: pick(lang, "El correo «An unhandled fault has occurred in this flow»", "The «An unhandled fault has occurred in this flow» email"), answer: pick(lang, "excepción sin capturar", "uncaught exception") },
    { need: pick(lang, "Create Records con guardado parcial… sabiendo cuál falló y por qué", "Create Records with partial save… knowing which failed and why"), answer: "Database.insert(list, false) + SaveResult" },
    { need: pick(lang, "Un paso que se ejecuta tanto por el camino normal como por el de fallo", "A step that runs on both the normal and the fault path"), answer: "finally" },
    { need: pick(lang, "Un subflow que avisa a quien lo llama de que el dato no vale", "A subflow warning its caller that the data is no good"), answer: "throw" },
  ];
  return (
    <ChooserGame
      lang={lang}
      all={all}
      needs={needs}
      eyebrow={pick(lang, "EN FLOW USABAS…", "IN FLOW YOU USED…")}
      hint={pick(lang, "Elige su pieza en Apex.", "Pick its Apex piece.")}
    />
  );
}
