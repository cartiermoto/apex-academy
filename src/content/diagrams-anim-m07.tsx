"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { ChooserGame, Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 7's interactive diagrams: the same Case automation from Module 6,
 * moved step by step into one trigger, a handler, a service, a guard and a
 * bypass switch.
 */

type P = { lang: Lang };

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className="t-small flex min-h-[38px] items-center gap-2 rounded-full border px-3 transition-colors"
      style={{
        borderColor: on ? "var(--c-brand)" : "var(--c-border)",
        background: on ? "var(--c-brand-soft)" : "transparent",
        color: on ? "var(--c-brand)" : "var(--c-text)",
      }}
    >
      <span
        aria-hidden
        className="relative inline-block h-[16px] w-[28px] rounded-full transition-colors"
        style={{ background: on ? "var(--c-brand)" : "var(--c-border-strong)" }}
      >
        <span
          className="absolute top-[2px] h-[12px] w-[12px] rounded-full transition-[left]"
          style={{ left: on ? 14 : 2, background: "var(--c-bg)" }}
        />
      </span>
      {label}
    </button>
  );
}

/* ------------------------------------------ 1. two triggers, no order ---- */

export function TwoTriggersPlay({ lang }: P) {
  const [single, setSingle] = useState(false);
  // deterministic "random" order sequence, so the page renders the same on server and client
  const orders = [true, false, false, true, true, false];
  const [runs, setRuns] = useState<boolean[]>([]);

  const save = () => setRuns((r) => [...r, single ? true : orders[r.length % orders.length]].slice(-6));
  const outcome = (escalationLast: boolean) => (escalationLast ? "'High'" : "'Low'");

  return (
    <div className="w-full">
      <p className="t-small mb-3 text-muted">
        {pick(
          lang,
          "Llega un caso por la web de una cuenta Hot. Un trigger lo pone en 'Low' porque viene de la web; el otro en 'High' porque la cuenta es Hot. Gana el que se ejecute el último.",
          "A case arrives through the web from a Hot account. One trigger sets it to 'Low' because it came from the web; the other to 'High' because the account is Hot. Whichever runs last wins.",
        )}
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={save}>
          {pick(lang, "💾 Guardar el caso", "💾 Save the case")}
        </button>
        <Toggle
          on={single}
          onClick={() => {
            setSingle((v) => !v);
            setRuns([]);
          }}
          label={pick(lang, "Un solo trigger, orden escrito", "One trigger, written order")}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {single ? (
          <div className="rounded-[4px] px-3 py-2.5 sm:col-span-2" style={codeBox}>
            <code className="block whitespace-pre font-mono text-[12px] leading-[1.6] text-ink">
              {`trigger CaseTrigger on Case (before insert) {\n    // 1 · ${pick(lang, "por defecto de la web", "web default")}\n    // 2 · ${pick(lang, "escalado: va el último, así que gana", "escalation: runs last, so it wins")}\n}`}
            </code>
          </div>
        ) : (
          <>
            <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
              <code className="block whitespace-pre font-mono text-[12px] leading-[1.6] text-ink">
                {"trigger CaseWebDefaults on Case\n  (before insert) {\n  … c.Priority = 'Low';\n}"}
              </code>
            </div>
            <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
              <code className="block whitespace-pre font-mono text-[12px] leading-[1.6] text-ink">
                {"trigger CaseEscalation on Case\n  (before insert) {\n  … c.Priority = 'High';\n}"}
              </code>
            </div>
          </>
        )}
      </div>

      <ol className="mt-4 space-y-1.5" aria-live="polite">
        {runs.length === 0 && (
          <li className="t-small text-faint">{pick(lang, "Pulsa «Guardar el caso» varias veces.", "Press “Save the case” several times.")}</li>
        )}
        {runs.map((escalationLast, n) => (
          <li
            key={`${single}-${n}`}
            className="diag-pop flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[4px] border px-3 py-1.5"
            style={{ borderColor: "var(--c-border)" }}
          >
            <span className="t-micro font-mono text-faint">#{n + 1}</span>
            <span className="t-small font-mono text-muted">
              {single
                ? pick(lang, "web → escalado", "web → escalation")
                : escalationLast
                  ? "CaseWebDefaults → CaseEscalation"
                  : "CaseEscalation → CaseWebDefaults"}
            </span>
            <span
              className="t-micro rounded-full px-2 py-0.5 font-mono font-semibold"
              style={
                escalationLast
                  ? { color: "var(--c-brand)", background: "var(--c-brand-soft)" }
                  : { color: "var(--c-danger)", background: "var(--c-danger-soft)" }
              }
            >
              Priority = {outcome(escalationLast)}
            </span>
          </li>
        ))}
      </ol>

      {runs.length >= 3 && (
        <p className="t-small mt-3 text-muted">
          {single
            ? pick(
                lang,
                "Siempre el mismo resultado: el orden ya no lo decide la plataforma, está escrito en tu código, línea a línea.",
                "Always the same result: the order is no longer the platform's call, it is written in your code, line by line.",
              )
            : pick(
                lang,
                "El mismo caso, guardado igual, da resultados distintos. Salesforce no garantiza el orden entre dos triggers del mismo objeto y evento: hoy funciona en la sandbox y mañana falla en producción, sin que nadie haya tocado nada.",
                "The same case, saved the same way, gives different results. Salesforce guarantees no order between two triggers on the same object and event: today it works in the sandbox and tomorrow it fails in production, without anyone touching anything.",
              )}
        </p>
      )}
    </div>
  );
}

/* --------------------------------------------- 2. the thin trigger path --- */

export function ThinTriggerPlay({ lang }: P) {
  const layers = [
    { key: "db", label: pick(lang, "Salesforce guarda", "Salesforce saves") },
    { key: "trigger", label: "CaseTrigger" },
    { key: "handler", label: "CaseTriggerHandler" },
  ];
  const steps: Array<{ at: string; code: string; note: string }> = [
    {
      at: "db",
      code: pick(lang, "// Data Loader inserta 200 casos", "// Data Loader inserts 200 cases"),
      note: pick(
        lang,
        "Una carga de 200 casos llega a la base de datos. Antes de guardarlos, Salesforce dispara los triggers before insert del objeto Case.",
        "A load of 200 cases reaches the database. Before saving them, Salesforce fires Case's before insert triggers.",
      ),
    },
    {
      at: "trigger",
      code: "switch on Trigger.operationType {\n    when BEFORE_INSERT {",
      note: pick(
        lang,
        "El trigger solo hace una cosa: mirar QUÉ evento es. Trigger.operationType vale BEFORE_INSERT, así que entra en esa rama.",
        "The trigger does just one thing: look at WHICH event this is. Trigger.operationType is BEFORE_INSERT, so it takes that branch.",
      ),
    },
    {
      at: "trigger",
      code: "        handler.beforeInsert(Trigger.new);",
      note: pick(
        lang,
        "Y delega: le pasa los 200 casos al handler. Dentro del trigger, Trigger.new ya es una List<Case>, así que viaja con su tipo y la clase no necesita saber nada de triggers.",
        "And it delegates: it hands the 200 cases to the handler. Inside the trigger, Trigger.new is already a List<Case>, so it travels typed and the class needs to know nothing about triggers.",
      ),
    },
    {
      at: "handler",
      code: "public void beforeInsert(List<Case> newCases) {\n    // 1 consulta, un bucle, sin DML\n}",
      note: pick(
        lang,
        "Aquí vive la lógica del before: una consulta para las cuentas Hot, un bucle que ajusta Priority en memoria. Sin DML, porque en before el registro se guarda solo.",
        "The before logic lives here: one query for the Hot accounts, one loop that sets Priority in memory. No DML, because in before the record saves itself.",
      ),
    },
    {
      at: "db",
      code: pick(lang, "// se guardan los 200 casos, ya con su prioridad", "// the 200 cases are saved, priority set"),
      note: pick(
        lang,
        "La ejecución vuelve al trigger, el trigger termina y Salesforce sigue con su orden de ejecución: guarda los casos y ahora les da Id.",
        "Execution returns to the trigger, the trigger ends and Salesforce carries on with its order of execution: it saves the cases and now gives them Ids.",
      ),
    },
    {
      at: "trigger",
      code: "    when AFTER_INSERT {\n        handler.afterInsert(Trigger.new);",
      note: pick(
        lang,
        "Mismo trigger, segunda pasada: ahora es AFTER_INSERT. Misma forma: mirar el evento y delegar.",
        "Same trigger, second pass: now it is AFTER_INSERT. Same shape: look at the event and delegate.",
      ),
    },
    {
      at: "handler",
      code: "public void afterInsert(List<Case> newCases) {\n    // las tareas: necesitan el Id → after\n}",
      note: pick(
        lang,
        "El handler crea las tareas de revisión, que necesitan el Id del caso (Módulo 6). Todo el trigger ocupa una pantalla; cada regla vive en un método con nombre.",
        "The handler creates the review tasks, which need the case Id (Module 6). The whole trigger fits on one screen; each rule lives in a named method.",
      ),
    },
  ];
  const s = useStepper(steps.length, 2100);
  const cur = steps[s.i];

  return (
    <div className="w-full">
      <ol className="grid grid-cols-3 gap-2">
        {layers.map((l) => {
          const on = l.key === cur.at;
          return (
            <li
              key={l.key}
              className="rounded-[4px] border px-2 py-2 text-center transition-colors"
              style={{
                borderColor: on ? "var(--c-brand)" : "var(--c-border)",
                background: on ? "var(--c-brand-soft)" : "transparent",
              }}
            >
              <span className="t-micro block font-mono font-semibold break-words" style={{ color: on ? "var(--c-brand)" : "var(--c-text-faint)" }}>
                {l.label}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 overflow-x-auto rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code key={s.i} className="diag-pop block whitespace-pre font-mono text-[12.5px] leading-[1.7] text-ink">
          {cur.code}
        </code>
      </div>
      <Note lang={lang} s={s}>
        {cur.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------ 3. one service, three doors --- */

export function ServiceDoorsPlay({ lang }: P) {
  const doors = [
    {
      label: pick(lang, "Al crear casos (trigger)", "On case creation (trigger)"),
      caller: "CaseTriggerHandler.beforeInsert(newCases)",
      save: pick(lang, "No hace falta update: en before, Salesforce guarda solo.", "No update needed: in before, Salesforce saves by itself."),
      note: pick(
        lang,
        "El handler recibe los casos del trigger y le pide al servicio que aplique la regla. El servicio no sabe que viene de un trigger: solo recibe una lista.",
        "The handler gets the cases from the trigger and asks the service to apply the rule. The service does not know it came from a trigger: it only receives a list.",
      ),
    },
    {
      label: pick(lang, "Botón en la consola", "Button in the console"),
      caller: "CaseActions.recalculatePriority(caseIds)",
      save: pick(lang, "Aquí sí: quien llama hace update cases; al terminar.", "Here yes: the caller does update cases; at the end."),
      note: pick(
        lang,
        "Soporte quiere un botón «Recalcular prioridad» para casos antiguos, creados antes de que existiera la regla. La misma línea de servicio, llamada desde otra puerta. Si la regla viviera dentro del trigger, el botón tendría que duplicarla.",
        "Support wants a “Recalculate priority” button for old cases, created before the rule existed. The same service line, called from another door. If the rule lived inside the trigger, the button would have to duplicate it.",
      ),
    },
    {
      label: pick(lang, "Proceso nocturno", "Nightly job"),
      caller: "NightlyCaseReview.execute(scope)",
      save: pick(lang, "El proceso guarda al final de cada lote.", "The job saves at the end of each batch."),
      note: pick(
        lang,
        "Y un proceso programado cada noche (Módulo 9) revisa los casos del día. Tercera puerta, misma regla. Cuando Soporte cambie el criterio, se cambia en UN sitio y las tres puertas lo heredan.",
        "And a job scheduled every night (Module 9) reviews the day's cases. Third door, same rule. When Support changes the criterion, it changes in ONE place and all three doors inherit it.",
      ),
    },
  ];
  const [d, setD] = useState(0);
  const cur = doors[d];

  return (
    <div className="w-full">
      <Tabs items={doors.map((x) => x.label)} value={d} onChange={setD} />
      <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <div key={`caller-${d}`} className="diag-pop min-w-0 rounded-[4px] border px-3 py-2.5" style={{ borderColor: "var(--c-border)" }}>
          <p className="t-micro font-semibold tracking-[0.06em] text-faint">{pick(lang, "QUIEN LLAMA", "CALLER")}</p>
          <code className="block font-mono text-[12.5px] text-ink [overflow-wrap:anywhere]">{cur.caller}</code>
        </div>
        <span aria-hidden className="text-center font-mono text-faint">
          →
        </span>
        <div className="min-w-0 rounded-[4px] border px-3 py-2.5" style={{ borderColor: "var(--c-brand)", background: "var(--c-brand-soft)" }}>
          <p className="t-micro font-semibold tracking-[0.06em]" style={{ color: "var(--c-brand)" }}>
            {pick(lang, "SIEMPRE EL MISMO SERVICIO", "ALWAYS THE SAME SERVICE")}
          </p>
          <code className="block font-mono text-[12.5px] text-ink [overflow-wrap:anywhere]">CaseEscalationService.applyPriorityRules(cases)</code>
        </div>
      </div>
      <p className="t-small mt-3 font-mono text-muted">↳ {cur.save}</p>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {cur.note}
      </p>
    </div>
  );
}

/* ------------------------------------------------- 4. guard and bypass ---- */

export function GuardBypassPlay({ lang }: P) {
  const [guard, setGuard] = useState(false);
  const [bypass, setBypass] = useState(false);
  const [ran, setRan] = useState(false);

  type Line = { t: string; tone?: "warn" | "brand" | "faint" };
  const trace: Line[] = [];
  let tasks = 0;
  const firstPass = pick(lang, "1ª pasada · after update", "1st pass · after update");
  const secondPass = pick(lang, "2ª pasada · el workflow vuelve a disparar el trigger", "2nd pass · the workflow fires the trigger again");
  if (bypass) {
    trace.push({ t: firstPass, tone: "faint" });
    trace.push({ t: pick(lang, "checkPermission('Bypass_Case_Triggers') = true → return", "checkPermission('Bypass_Case_Triggers') = true → return"), tone: "brand" });
    trace.push({ t: secondPass, tone: "faint" });
    trace.push({ t: pick(lang, "otra vez true → return", "true again → return"), tone: "brand" });
  } else {
    trace.push({ t: firstPass, tone: "faint" });
    trace.push({ t: pick(lang, "old.Priority 'Medium' → new 'High': cambió → tarea creada", "old.Priority 'Medium' → new 'High': changed → task created") });
    tasks++;
    trace.push({ t: secondPass, tone: "faint" });
    if (guard) {
      trace.push({ t: pick(lang, "processedIds ya contiene el Id → se salta", "processedIds already holds the Id → skipped"), tone: "brand" });
    } else {
      trace.push({
        t: pick(
          lang,
          "Trigger.old sigue trayendo 'Medium' (la versión de ANTES del primer guardado) → «cambió» otra vez → segunda tarea",
          "Trigger.old still holds 'Medium' (the version from BEFORE the first save) → “changed” again → second task",
        ),
        tone: "warn",
      });
      tasks++;
    }
  }

  const verdict = bypass
    ? pick(
        lang,
        "0 tareas. Es lo que quieres cuando el usuario de integración carga 50.000 casos históricos: ni prioridades ni tareas, solo datos. El permiso se asigna a ese usuario con un permission set, nunca a todos.",
        "0 tasks. It is what you want when the integration user loads 50,000 historical cases: no priorities, no tasks, just data. The permission is assigned to that user through a permission set, never to everyone.",
      )
    : guard
      ? pick(lang, "1 tarea, como debe ser. La guardia recuerda qué casos ya procesó en esta transacción.", "1 task, as it should be. The guard remembers which cases it already processed in this transaction.")
      : pick(
          lang,
          "2 tareas para el mismo caso. La defensa 2 del Módulo 6 —comparar old y new— no basta aquí: tras una actualización de campo de workflow, Trigger.old no se actualiza, así que el cambio parece nuevo en cada pasada.",
          "2 tasks for the same case. Module 6's defence 2 — comparing old and new — is not enough here: after a workflow field update, Trigger.old is not refreshed, so the change looks new on every pass.",
        );

  return (
    <div className="w-full">
      <p className="t-small mb-3 text-muted">
        {pick(
          lang,
          "Un agente sube la prioridad de un caso de 'Medium' a 'High'. Nuestra regla crea una tarea de revisión. Pero la org heredada tiene una regla de workflow que, al guardar, rellena un campo del caso… y eso vuelve a disparar los triggers de update una vez más.",
          "An agent raises a case's priority from 'Medium' to 'High'. Our rule creates a review task. But the inherited org has a workflow rule that, on save, fills in a case field… and that fires the update triggers one more time.",
        )}
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Toggle on={guard} onClick={() => { setGuard((v) => !v); setRan(false); }} label={pick(lang, "Guardia static Set<Id>", "static Set<Id> guard")} />
        <Toggle on={bypass} onClick={() => { setBypass((v) => !v); setRan(false); }} label={pick(lang, "Usuario con permiso Bypass", "User with the Bypass permission")} />
        <button type="button" className="btn btn-primary" onClick={() => setRan(true)}>
          {pick(lang, "💾 Guardar", "💾 Save")}
        </button>
      </div>
      {ran ? (
        <>
          <ol className="space-y-1.5">
            {trace.map((l, n) => (
              <li
                key={`${guard}-${bypass}-${n}`}
                className="diag-pop t-small rounded-[4px] border px-3 py-1.5 font-mono"
                style={{
                  borderColor: "var(--c-border)",
                  color: l.tone === "warn" ? "var(--c-danger)" : l.tone === "brand" ? "var(--c-brand)" : l.tone === "faint" ? "var(--c-text-faint)" : "var(--c-text)",
                  animationDelay: `${n * 120}ms`,
                }}
              >
                {l.t}
              </li>
            ))}
          </ol>
          <p className="t-small mt-3 text-muted" aria-live="polite">
            <strong style={{ color: tasks > 1 ? "var(--c-danger)" : "var(--c-text)" }}>
              {tasks} {pick(lang, tasks === 1 ? "tarea" : "tareas", tasks === 1 ? "task" : "tasks")}.
            </strong>{" "}
            {verdict}
          </p>
        </>
      ) : (
        <p className="t-small text-faint">{pick(lang, "Elige los interruptores y pulsa «Guardar».", "Set the switches and press “Save”.")}</p>
      )}
    </div>
  );
}

/* ---------------------------------------------- 5. which layer? (game) --- */

export function LayerChooserPlay({ lang }: P) {
  const trig = "CaseTrigger";
  const hand = "CaseTriggerHandler";
  const serv = "CaseEscalationService";
  const guard = pick(lang, "La guardia (static Set<Id>)", "The guard (static Set<Id>)");
  const byp = pick(lang, "El bypass (permiso)", "The bypass (permission)");
  const all = [trig, hand, serv, guard, byp];
  const needs = [
    { need: pick(lang, "Saber si esto es un BEFORE_INSERT o un AFTER_UPDATE.", "Know whether this is a BEFORE_INSERT or an AFTER_UPDATE."), answer: trig },
    { need: pick(lang, "Recibir Trigger.new y Trigger.oldMap y decidir qué reglas aplicar.", "Receive Trigger.new and Trigger.oldMap and decide which rules to apply."), answer: hand },
    { need: pick(lang, "Consultar qué cuentas son Hot y subir la prioridad de sus casos.", "Query which accounts are Hot and raise their cases' priority."), answer: serv },
    { need: pick(lang, "Que un botón de la consola aplique la misma regla que el trigger.", "Let a console button apply the same rule as the trigger."), answer: serv },
    { need: pick(lang, "No crear dos veces la tarea del mismo caso en la misma transacción.", "Not create the same case's task twice in one transaction."), answer: guard },
    { need: pick(lang, "Que la migración de datos históricos no dispare ninguna regla.", "Keep the historical data migration from firing any rule."), answer: byp },
    { need: pick(lang, "Una sola línea por evento: llamar al método que toca.", "One line per event: call the right method."), answer: trig },
  ];
  return <ChooserGame lang={lang} all={all} needs={needs} />;
}
