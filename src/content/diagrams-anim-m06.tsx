"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { ChooserGame, Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 6's interactive diagrams, told through the same case as its
 * workshops: Northwind migrating its record-triggered flows to Apex.
 * m06-order (the order of execution) lives in diagrams.tsx.
 */

type P = { lang: Lang };

/** A pressed/unpressed chip for multi-select switches. */
function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="t-small min-h-[36px] rounded-full border px-3.5 font-mono transition-colors"
      style={{
        borderColor: on ? "var(--c-brand)" : "var(--c-border)",
        background: on ? "var(--c-brand-soft)" : "transparent",
        color: on ? "var(--c-brand)" : "var(--c-text)",
        fontWeight: on ? 600 : 400,
      }}
    >
      {on ? "✓ " : ""}
      {children}
    </button>
  );
}

const eyebrow = "t-micro mb-2 font-semibold tracking-[0.06em] text-faint";

/* ------------------------------------------ 1. trigger anatomy, live --- */

type Ev = "insert" | "update" | "delete" | "undelete";
const EVENTS: Ev[] = ["insert", "update", "delete", "undelete"];

export function TriggerAnatomyPlay({ lang }: P) {
  const objects = [
    { obj: "Lead", name: "LeadWelcome" },
    { obj: "Opportunity", name: "OpportunityStage" },
    { obj: "Account", name: "AccountOnboarding" },
    { obj: "Case", name: "CaseEscalation" },
  ];
  const [o, setO] = useState(2);
  const [before, setBefore] = useState(true);
  const [after, setAfter] = useState(true);
  const [ev, setEv] = useState<Record<Ev, boolean>>({ insert: true, update: false, delete: false, undelete: false });
  const { obj, name } = objects[o];

  // the event list, in the order Salesforce's own examples use
  const parts: Array<{ t: string; bad?: boolean }> = [];
  for (const [timing, on] of [["before", before], ["after", after]] as const) {
    if (!on) continue;
    for (const e of EVENTS) if (ev[e]) parts.push({ t: `${timing} ${e}`, bad: timing === "before" && e === "undelete" });
  }
  const empty = parts.length === 0;
  const invalid = parts.some((p) => p.bad);

  // the record-triggered flows the same header replaces
  const flows: string[] = [];
  const gaps: string[] = [];
  const cu = ev.insert && ev.update ? "A record is created or updated" : ev.insert ? "A record is created" : ev.update ? "A record is updated" : "";
  if (cu && before) flows.push(`${cu} · Fast Field Updates`);
  if (cu && after) flows.push(`${cu} · Actions and Related Records`);
  if (ev.delete && before) flows.push("A record is deleted");
  if (ev.delete && after) gaps.push(pick(lang, "after delete: ningún flow corre después de borrar", "after delete: no flow runs after the delete"));
  if (ev.undelete && after) gaps.push(pick(lang, "after undelete: Flow no escucha la papelera", "after undelete: Flow does not listen to the recycle bin"));

  const label = (n: number, es: string, en: string) => (
    <span className="t-micro inline-flex items-center gap-1.5 text-muted">
      <span
        aria-hidden
        className="grid h-[18px] w-[18px] place-items-center rounded-full font-semibold"
        style={{ background: "var(--c-brand-soft)", color: "var(--c-brand)" }}
      >
        {n}
      </span>
      {pick(lang, es, en)}
    </span>
  );

  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "1 · EL OBJETO", "1 · THE OBJECT")}</p>
      <Tabs items={objects.map((x) => x.obj)} value={o} onChange={setO} />
      <p className={eyebrow}>{pick(lang, "2 · CUÁNDO", "2 · WHEN")}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        <Chip on={before} onClick={() => setBefore((v) => !v)}>before</Chip>
        <Chip on={after} onClick={() => setAfter((v) => !v)}>after</Chip>
      </div>
      <p className={eyebrow}>{pick(lang, "3 · CON QUÉ EVENTO", "3 · ON WHICH EVENT")}</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {EVENTS.map((e) => (
          <Chip key={e} on={ev[e]} onClick={() => setEv((s) => ({ ...s, [e]: !s[e] }))}>
            {e}
          </Chip>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-[4px] border p-4" style={{ borderColor: "var(--c-border)" }}>
          <p className={eyebrow}>{pick(lang, "EN FLOW · ELEMENTO START", "IN FLOW · START ELEMENT")}</p>
          <p className="t-small text-ink">
            <span className="text-muted">Object: </span>
            <strong>{obj}</strong>
          </p>
          {flows.length === 0 && gaps.length === 0 ? (
            <p className="t-small mt-2 text-faint">{pick(lang, "Sin eventos no hay flow que configurar.", "With no events there is no flow to set up.")}</p>
          ) : (
            <ul className="mt-2 space-y-1.5">
              {flows.map((f) => (
                <li key={f} className="diag-pop t-small rounded-[4px] px-2.5 py-1.5" style={{ background: "var(--c-surface-2)" }}>
                  {f}
                </li>
              ))}
              {gaps.map((g) => (
                <li key={g} className="diag-pop t-small rounded-[4px] border border-dashed px-2.5 py-1.5 text-muted" style={{ borderColor: "var(--c-border-strong)" }}>
                  ✗ {g}
                </li>
              ))}
            </ul>
          )}
          {flows.length > 1 && (
            <p className="t-micro mt-2 text-muted">
              {pick(lang, `${flows.length} flows distintos en Flow…`, `${flows.length} separate flows in Flow…`)}
            </p>
          )}
        </div>

        <div>
          <p className={eyebrow}>{pick(lang, "EN APEX · LA CABECERA", "IN APEX · THE HEADER")}</p>
          <pre className="t-small overflow-x-auto whitespace-pre-wrap rounded-[4px] p-4 font-mono" style={codeBox}>
            <span style={{ color: "var(--c-code-key)" }}>trigger</span> {name} <span style={{ color: "var(--c-code-key)" }}>on</span>{" "}
            <strong>{obj}</strong> (
            {empty ? (
              <span style={{ color: "var(--c-danger)" }}>???</span>
            ) : (
              parts.map((p, n) => (
                <span key={p.t}>
                  {n > 0 && ", "}
                  <span
                    className="diag-pop"
                    style={{
                      color: p.bad ? "var(--c-danger)" : "var(--c-brand)",
                      textDecoration: p.bad ? "line-through" : "none",
                    }}
                  >
                    {p.t}
                  </span>
                </span>
              ))
            )}
            ) {"{"}
            {"\n    "}
            <span style={{ color: "var(--c-code-com)" }}>{pick(lang, "// tu lógica", "// your logic")}</span>
            {"\n}"}
          </pre>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {label(1, "palabra clave", "keyword")}
            {label(2, "nombre libre", "any name")}
            {label(3, "un solo objeto", "one object")}
            {label(4, "eventos", "events")}
          </div>
        </div>
      </div>

      <p className="t-small mt-4 text-muted" aria-live="polite">
        {empty
          ? pick(lang, "No compila: un trigger necesita al menos un momento (before o after) y un evento.", "It does not compile: a trigger needs at least one timing (before or after) and one event.")
          : invalid
            ? pick(
                lang,
                "No compila: before undelete no existe. Un registro que sale de la papelera ya está guardado, así que solo hay after undelete.",
                "It does not compile: before undelete does not exist. A record coming out of the recycle bin is already saved, so there is only after undelete.",
              )
            : flows.length > 1
              ? pick(
                  lang,
                  `Un solo trigger cubre lo que en Flow son ${flows.length} flows. Por eso, al migrar, el trigger mira qué evento está corriendo (lección 2).`,
                  `A single trigger covers what takes ${flows.length} flows in Flow. That is why, when migrating, the trigger checks which event is running (lesson 2).`,
                )
              : pick(lang, "Una cabecera válida. Prueba a marcar before y after a la vez.", "A valid header. Try ticking both before and after.")}
      </p>
    </div>
  );
}

/* ----------------------------------- 2. context variables per event --- */

type Avail = "edit" | "read" | "null";

export function ContextPlay({ lang }: P) {
  const events: Array<{ e: string; nw: Avail; nm: Avail; old: Avail; om: Avail; id: boolean }> = [
    { e: "before insert", nw: "edit", nm: "null", old: "null", om: "null", id: false },
    { e: "after insert", nw: "read", nm: "read", old: "null", om: "null", id: true },
    { e: "before update", nw: "edit", nm: "read", old: "read", om: "read", id: true },
    { e: "after update", nw: "read", nm: "read", old: "read", om: "read", id: true },
    { e: "before delete", nw: "null", nm: "null", old: "read", om: "read", id: true },
    { e: "after delete", nw: "null", nm: "null", old: "read", om: "read", id: true },
    { e: "after undelete", nw: "read", nm: "read", old: "null", om: "null", id: true },
  ];
  const [k, setK] = useState(3);
  const [tried, setTried] = useState<number | null>(null);
  const cur = events[k];
  const isUpdate = cur.e.endsWith("update");
  const newStage = isUpdate ? "'Negotiation'" : "'Prospecting'";

  const cards: Array<[string, Avail, string]> = [
    ["Trigger.new", cur.nw, `[ Acme · StageName ${newStage} ]`],
    ["Trigger.newMap", cur.nm, `{ 006…Acme → StageName ${newStage} }`],
    ["Trigger.old", cur.old, "[ Acme · StageName 'Prospecting' ]"],
    ["Trigger.oldMap", cur.om, "{ 006…Acme → StageName 'Prospecting' }"],
  ];
  const chip = (a: Avail) =>
    a === "edit"
      ? { t: pick(lang, "✓ editable", "✓ editable"), c: "var(--c-brand)", b: "var(--c-brand-soft)" }
      : a === "read"
        ? { t: pick(lang, "✓ solo lectura", "✓ read-only"), c: "var(--c-text)", b: "var(--c-surface-2)" }
        : { t: "null", c: "var(--c-text-faint)", b: "transparent" };

  const npe = "System.NullPointerException: Attempt to de-reference a null object";
  const actions = [
    { code: "Trigger.oldMap.get(o.Id).StageName", label: pick(lang, "Leer el valor anterior", "Read the previous value") },
    { code: "o.StageName = 'Closed Won';", label: pick(lang, "Cambiar un campo", "Change a field") },
    { code: "o.StageName != Trigger.oldMap.get(o.Id).StageName", label: pick(lang, "¿Cambió la etapa?", "Did the stage change?") },
  ];
  const result = (n: number): { ok: boolean; t: string } => {
    if (n === 0) {
      if (cur.om === "null") return { ok: false, t: `${npe} — ${pick(lang, "en este evento no hay versión anterior.", "this event has no previous version.")}` };
      return { ok: true, t: `'Prospecting' — ${pick(lang, "lo que en Flow era $Record__Prior.", "what $Record__Prior was in Flow.")}` };
    }
    if (n === 1) {
      if (cur.nw === "null") return { ok: false, t: `${npe} — ${pick(lang, "en delete Trigger.new es null: no hay versión nueva que cambiar.", "in delete Trigger.new is null: there is no new version to change.")}` };
      if (cur.nw === "read") return { ok: false, t: `System.FinalException: Record is read-only — ${pick(lang, "en after el registro ya está guardado.", "in after the record is already saved.")}` };
      return { ok: true, t: pick(lang, "Se guarda solo, sin DML: es tu «Fast Field Updates».", "It saves by itself, no DML: it is your “Fast Field Updates”.") };
    }
    if (cur.nw === "null" || cur.om === "null") return { ok: false, t: `${npe} — ${pick(lang, "comparar necesita las dos versiones, y solo update las tiene.", "comparing needs both versions, and only update has them.")}` };
    return { ok: true, t: `true — ${pick(lang, "'Prospecting' → 'Negotiation': lo que en Flow era ISCHANGED().", "'Prospecting' → 'Negotiation': what ISCHANGED() was in Flow.")}` };
  };

  return (
    <div className="w-full">
      <p className="t-small mb-3 text-muted">
        {pick(
          lang,
          "La oportunidad de Acme pasa de 'Prospecting' a 'Negotiation'. Elige el evento que está corriendo y mira qué variables existen.",
          "Acme's opportunity moves from 'Prospecting' to 'Negotiation'. Pick the running event and see which variables exist.",
        )}
      </p>
      <Tabs items={events.map((x) => x.e)} value={k} onChange={(n) => { setK(n); setTried(null); }} />
      <div className="grid gap-2 sm:grid-cols-2">
        {cards.map(([name, a, sample]) => {
          const c = chip(a);
          return (
            <div
              key={name}
              className="rounded-[4px] border p-3 transition-opacity"
              style={{ borderColor: a === "null" ? "var(--c-border)" : "var(--c-border-strong)", borderStyle: a === "null" ? "dashed" : "solid" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="t-small font-mono font-semibold text-ink">{name}</span>
                <span key={`${k}-${name}`} className="diag-pop t-micro rounded-full px-2 py-0.5 font-semibold" style={{ color: c.c, background: c.b }}>
                  {c.t}
                </span>
              </div>
              <p className="t-micro mt-1.5 break-words font-mono" style={{ color: a === "null" ? "var(--c-text-faint)" : "var(--c-text-muted)" }}>
                {a === "null" ? pick(lang, "no existe en este evento", "does not exist in this event") : sample}
              </p>
            </div>
          );
        })}
      </div>
      {!cur.id && (
        <p className="t-micro mt-2 text-muted">
          {pick(lang, "before insert: el registro aún no tiene Id, así que no puede haber mapa por Id.", "before insert: the record has no Id yet, so there can be no map by Id.")}
        </p>
      )}

      <p className={`${eyebrow} mt-4`}>{pick(lang, "PRUÉBALO DENTRO DE for (Opportunity o : Trigger.new)", "TRY IT INSIDE for (Opportunity o : Trigger.new)")}</p>
      <div className="flex flex-wrap gap-2">
        {actions.map((a, n) => (
          <button key={n} type="button" className="btn btn-ghost" aria-pressed={tried === n} onClick={() => setTried(n)}>
            {a.label}
          </button>
        ))}
      </div>
      {tried !== null && (
        <div key={`${k}-${tried}`} className="diag-pop mt-3 rounded-[4px] p-3" style={codeBox} aria-live="polite">
          <p className="t-small break-words font-mono">{actions[tried].code}</p>
          <p className="t-small mt-1.5 break-words font-mono" style={{ color: result(tried).ok ? "var(--c-brand)" : "var(--c-danger)" }}>
            → {result(tried).t}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- 3. before or after? place the need --- */

export function BeforeAfterPlay({ lang }: P) {
  type Need = { need: string; answer: "before" | "after"; right: string; wrong: string };
  const needs: Need[] = [
    {
      need: pick(lang, "Si la cuenta nueva llega sin Rating, ponerle 'Warm'.", "If the new account arrives with no Rating, set it to 'Warm'."),
      answer: "before",
      right: pick(lang, "Es el propio registro: lo asignas en Trigger.new y se guarda solo, sin DML.", "It is the record itself: you set it on Trigger.new and it saves by itself, no DML."),
      wrong: pick(
        lang,
        "En after, Trigger.new es de solo lectura (FinalException). Tendrías que hacer update de la propia cuenta: un DML más y la puerta a la recursión de la lección 5.",
        "In after, Trigger.new is read-only (FinalException). You would have to update the account itself: one more DML and the door to lesson 5's recursion.",
      ),
    },
    {
      need: pick(lang, "Crear una tarea de bienvenida, enlazada a la cuenta nueva.", "Create a welcome task linked to the new account."),
      answer: "after",
      right: pick(lang, "Es OTRO registro, y necesita el Id de la cuenta en WhatId. En after insert el Id ya existe.", "It is ANOTHER record, and it needs the account's Id in WhatId. In after insert the Id exists."),
      wrong: pick(lang, "En before insert la cuenta aún no tiene Id: la tarea quedaría con WhatId vacío, sin enlazar a nada.", "In before insert the account has no Id yet: the task would have an empty WhatId, linked to nothing."),
    },
    {
      need: pick(lang, "Si el contacto no trae MailingCountry, poner 'Spain' antes de que la regla de validación lo rechace.", "If the contact has no MailingCountry, set 'Spain' before the validation rule rejects it."),
      answer: "before",
      right: pick(lang, "Los triggers before corren ANTES de las reglas de validación (lección 4): la regla ya ve el país.", "Before triggers run BEFORE validation rules (lesson 4): the rule already sees the country."),
      wrong: pick(lang, "En after llegas tarde: la regla de validación ya rechazó el guardado y after ni se ejecuta.", "In after you are too late: the validation rule already rejected the save and after never runs."),
    },
    {
      need: pick(lang, "Escribir en el log el Id de cada lead que entra por el formulario web.", "Write the Id of every lead coming in through the web form to the log."),
      answer: "after",
      right: pick(lang, "Solo leer, pero el Id nace al guardar: en after insert ya lo tienes.", "Only reading, but the Id is born on save: in after insert you have it."),
      wrong: pick(lang, "En before insert el log diría null en cada línea: el Id aún no existe.", "In before insert the log would say null on every line: the Id does not exist yet."),
    },
    {
      need: pick(lang, "Cuando una oportunidad se gana, marcar su cuenta como cliente.", "When an opportunity is won, mark its account as a customer."),
      answer: "after",
      right: pick(
        lang,
        "La cuenta es otro registro: DML, y en after, cuando la oportunidad ya pasó sus validaciones y sus valores son los definitivos.",
        "The account is another record: DML, and in after, when the opportunity has passed its validations and its values are final.",
      ),
      wrong: pick(
        lang,
        "En before la oportunidad aún puede cambiar o ser rechazada por una regla de validación. before es para tocar el propio registro; lo demás, en after.",
        "In before the opportunity can still change or be rejected by a validation rule. before is for touching the record itself; the rest, in after.",
      ),
    },
    {
      need: pick(lang, "Si la oportunidad llega sin CloseDate, ponerle hoy + 30 días.", "If the opportunity arrives with no CloseDate, set it to today + 30 days."),
      answer: "before",
      right: pick(lang, "Otra vez el propio registro: Date.today().addDays(30) en Trigger.new y listo.", "The record itself again: Date.today().addDays(30) on Trigger.new and done."),
      wrong: pick(lang, "En after no puedes tocar Trigger.new, y el update del propio registro gasta un DML que no necesitas.", "In after you cannot touch Trigger.new, and updating the record itself spends a DML you do not need."),
    },
  ];
  const s = useStepper(needs.length, 99999);
  const [chosen, setChosen] = useState<Record<number, "before" | "after">>({});
  const cur = needs[s.i];
  const picked = chosen[s.i];
  const score = Object.entries(chosen).filter(([n, v]) => needs[Number(n)].answer === v).length;

  const station = (slot: "before" | "after" | "save", title: string, sub: string) => {
    const here = picked === slot;
    const ok = here && picked === cur.answer;
    return (
      <div
        className="flex min-h-[112px] flex-col rounded-[4px] border p-2.5"
        style={{
          borderColor: here ? (ok ? "var(--c-brand)" : "var(--c-danger)") : "var(--c-border)",
          background: slot === "save" ? "var(--c-surface-2)" : "transparent",
        }}
      >
        <p className="t-small font-mono font-semibold text-ink">{title}</p>
        <p className="t-micro text-muted">{sub}</p>
        {here && (
          <span
            className="diag-pop t-micro mt-auto rounded-[4px] px-2 py-1 font-semibold"
            style={{ background: ok ? "var(--c-brand-soft)" : "var(--c-danger-soft)", color: ok ? "var(--c-brand)" : "var(--c-danger)" }}
          >
            {ok ? "✓ " : "✗ "}
            {pick(lang, "aquí", "here")}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <p className={eyebrow}>
        {pick(lang, "EL FLOW QUE MIGRAS HACÍA…", "THE FLOW YOU ARE MIGRATING DID…")} · {pick(lang, "aciertos", "correct")} {score}/{Object.keys(chosen).length}
      </p>
      <p key={s.i} className="diag-pop t-body font-semibold text-ink">
        {cur.need}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {station("before", "before", pick(lang, "sin Id en insert · cambias el propio registro", "no Id on insert · change the record itself"))}
        {station("save", "💾", pick(lang, "se guarda · nace el Id", "saved · the Id is born"))}
        {station("after", "after", pick(lang, "Id listo · Trigger.new de solo lectura", "Id ready · Trigger.new read-only"))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {(["before", "after"] as const).map((slot) => (
          <button
            key={slot}
            type="button"
            className="btn btn-ghost font-mono"
            disabled={Boolean(picked)}
            onClick={() => setChosen((c) => ({ ...c, [s.i]: slot }))}
          >
            {slot === "before" ? pick(lang, "← en before", "← in before") : pick(lang, "en after →", "in after →")}
          </button>
        ))}
      </div>
      <Note lang={lang} s={s}>
        {picked ? (picked === cur.answer ? `✓ ${cur.right}` : `✗ ${cur.wrong}`) : pick(lang, "¿Dónde lo pondrías?", "Where would you put it?")}
      </Note>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-ghost" disabled={s.i === 0} onClick={() => s.go(s.i - 1)}>
          {pick(lang, "← Anterior", "← Back")}
        </button>
        <button type="button" className="btn btn-primary" disabled={s.i === s.last} onClick={() => s.go(s.i + 1)}>
          {pick(lang, "Siguiente →", "Next →")}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------ 4. recursion, level by level --- */

export function RecursionPlay({ lang }: P) {
  type Step = { depth: number; t: string; tone?: "warn" | "brand" | "faint" };
  const MAX = 16;
  const modes = [
    pick(lang, "Sin defensa", "No defence"),
    pick(lang, "Defensa 1 · before", "Defence 1 · before"),
    pick(lang, "Defensa 2 · ¿cambió?", "Defence 2 · changed?"),
    pick(lang, "Defensa 3 · Set<Id>", "Defence 3 · Set<Id>"),
    pick(lang, "Trampa · Boolean", "Trap · Boolean"),
  ];
  const [m, setM] = useState(0);

  const scripts: Step[][] = [
    [
      { depth: 1, t: pick(lang, "Nivel 1 · Ventas pasa Acme a 'Negotiation' → after update → update toUpdate", "Level 1 · Sales moves Acme to 'Negotiation' → after update → update toUpdate") },
      ...Array.from({ length: MAX - 1 }, (_, n) => ({
        depth: n + 2,
        t: pick(lang, `Nivel ${n + 2} · ese update vuelve a disparar el trigger → otro update`, `Level ${n + 2} · that update fires the trigger again → another update`),
        tone: "faint" as const,
      })),
      {
        depth: MAX + 1,
        t: pick(lang, "Maximum trigger depth exceeded → se deshace TODA la transacción, también el cambio de Ventas", "Maximum trigger depth exceeded → the WHOLE transaction is rolled back, Sales' change too"),
        tone: "warn",
      },
    ],
    [
      { depth: 1, t: pick(lang, "Nivel 1 · before update: o.Description = 'Revisada' en Trigger.new", "Level 1 · before update: o.Description = 'Reviewed' on Trigger.new") },
      { depth: 1, t: pick(lang, "Se guarda una vez, con la descripción incluida. 0 DML, 1 nivel: no hay bucle que cortar.", "Saved once, description included. 0 DML, 1 level: there is no loop to cut."), tone: "brand" },
    ],
    [
      { depth: 1, t: pick(lang, "Nivel 1 · StageName 'Prospecting' → 'Negotiation': cambió → update", "Level 1 · StageName 'Prospecting' → 'Negotiation': changed → update") },
      { depth: 2, t: pick(lang, "Nivel 2 · old 'Negotiation' = new 'Negotiation': no cambió → lista vacía, sin update", "Level 2 · old 'Negotiation' = new 'Negotiation': no change → empty list, no update") },
      { depth: 2, t: pick(lang, "Fin en el nivel 2. Es tu «Only when a record is updated to meet the condition requirements».", "Done at level 2. It is your “Only when a record is updated to meet the condition requirements”."), tone: "brand" },
    ],
    [
      { depth: 1, t: pick(lang, "Nivel 1 · el Id de Acme no está en processed → lo apunta y hace update", "Level 1 · Acme's Id is not in processed → note it and update") },
      { depth: 2, t: pick(lang, "Nivel 2 · processed ya contiene el Id → continue; lista vacía, sin update", "Level 2 · processed already holds the Id → continue; empty list, no update") },
      { depth: 2, t: pick(lang, "Fin en el nivel 2. El Set vive lo que dura la transacción (Módulo 5).", "Done at level 2. The Set lives as long as the transaction (Module 5)."), tone: "brand" },
    ],
    [
      { depth: 1, t: pick(lang, "Carga de 400 oportunidades: el trigger corre en dos bloques de 200", "A load of 400 opportunities: the trigger runs in two chunks of 200") },
      { depth: 1, t: pick(lang, "Bloque 1 · alreadyRan = false → lo pone a true, revisa 200 y hace update", "Chunk 1 · alreadyRan = false → set it to true, review 200 and update") },
      { depth: 2, t: pick(lang, "Nivel 2 · alreadyRan = true → sale. Hasta aquí, bien.", "Level 2 · alreadyRan = true → exit. So far, so good."), tone: "faint" },
      { depth: 1, t: pick(lang, "Bloque 2 (registros 201–400) · alreadyRan SIGUE en true → sale sin revisar", "Chunk 2 (records 201–400) · alreadyRan is STILL true → exits without reviewing"), tone: "warn" },
      { depth: 1, t: pick(lang, "200 de 400 sin revisar, y ningún error que lo avise. Por eso se guarda un Set<Id>, no un Boolean.", "200 of 400 not reviewed, and no error to warn you. That is why you keep a Set<Id>, not a Boolean."), tone: "warn" },
    ],
  ];
  const steps = scripts[m];
  const s = useStepper(steps.length, m === 0 ? 450 : 1500);
  const cur = steps[s.i];
  const blown = cur.depth > MAX;
  const shown = steps.slice(Math.max(0, s.i - 3), s.i + 1);

  return (
    <div className="w-full">
      <Tabs items={modes} value={m} onChange={(n) => { setM(n); s.go(0); }} />
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={eyebrow}>{pick(lang, "TRIGGERS ANIDADOS", "NESTED TRIGGERS")}</p>
        <p className="t-small font-mono tabular-nums" style={{ color: blown ? "var(--c-danger)" : "var(--c-text)" }}>
          {pick(lang, "nivel", "level")} {Math.min(cur.depth, MAX)} / {MAX}
        </p>
      </div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${MAX}, minmax(0, 1fr))` }} aria-hidden>
        {Array.from({ length: MAX }, (_, n) => (
          <span
            key={n}
            className="block h-[18px] rounded-[2px] transition-colors"
            style={{
              background: blown ? "var(--c-danger)" : n < cur.depth ? "var(--c-brand)" : "var(--c-surface-2)",
              border: "1px solid var(--c-border)",
            }}
          />
        ))}
      </div>
      <ol className="mt-3 min-h-[140px] space-y-1.5">
        {shown.map((l) => (
          <li
            key={`${m}-${l.t}`}
            className="diag-pop t-small rounded-[4px] border px-3 py-1.5 font-mono"
            style={{
              borderColor: "var(--c-border)",
              color: l.tone === "warn" ? "var(--c-danger)" : l.tone === "brand" ? "var(--c-brand)" : l.tone === "faint" ? "var(--c-text-faint)" : "var(--c-text)",
            }}
          >
            {l.t}
          </li>
        ))}
      </ol>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------ 5. from Flow to trigger (game) --- */

export function FlowToTriggerPlay({ lang }: P) {
  const all = [
    "trigger … on Account",
    "before",
    "after",
    "Trigger.new",
    "Trigger.oldMap.get(r.Id)",
    pick(lang, "comparar old y new", "compare old and new"),
    pick(lang, "un trigger por objeto (M7)", "one trigger per object (M7)"),
    pick(lang, "consulta en bucle ✗ (M4)", "query in a loop ✗ (M4)"),
  ];
  const needs = [
    { need: pick(lang, "En el elemento Start eliges el objeto Account.", "In the Start element you pick the Account object."), answer: all[0] },
    { need: pick(lang, "Optimizas el flow para «Fast Field Updates».", "You optimise the flow for “Fast Field Updates”."), answer: all[1] },
    { need: pick(lang, "Optimizas el flow para «Actions and Related Records».", "You optimise the flow for “Actions and Related Records”."), answer: all[2] },
    { need: pick(lang, "Lees un campo con {!$Record.StageName}.", "You read a field with {!$Record.StageName}."), answer: all[3] },
    { need: pick(lang, "Lees el valor anterior con {!$Record__Prior.StageName}.", "You read the previous value with {!$Record__Prior.StageName}."), answer: all[4] },
    {
      need: pick(lang, "Marcas «Only when a record is updated to meet the condition requirements».", "You tick “Only when a record is updated to meet the condition requirements”."),
      answer: all[5],
    },
    { need: pick(lang, "Ordenas los flows del objeto en Flow Trigger Explorer.", "You order the object's flows in Flow Trigger Explorer."), answer: all[6] },
    { need: pick(lang, "Pones un Get Records dentro de un Loop.", "You put a Get Records inside a Loop."), answer: all[7] },
  ];
  return (
    <ChooserGame
      lang={lang}
      all={all}
      needs={needs}
      eyebrow={pick(lang, "EN FLOW HACÍAS…", "IN FLOW YOU DID…")}
      hint={pick(lang, "¿Qué es eso en un trigger?", "What is that in a trigger?")}
    />
  );
}
