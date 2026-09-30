"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { ChooserGame, Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 9's interactive diagrams, told through its workshops: the ERP bridge
 * grows from 300 rows to 300,000 with @future, Queueable, Batch and Scheduled.
 */

type P = { lang: Lang };
const eyebrow = "t-micro mb-2 font-semibold tracking-[0.06em] text-faint";

type Tone = "ok" | "bad" | "wait" | "plain";
function Tag({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const c =
    tone === "ok"
      ? { color: "var(--c-brand)", background: "var(--c-brand-soft)" }
      : tone === "bad"
        ? { color: "var(--c-danger)", background: "var(--c-danger-soft)" }
        : { color: "var(--c-text-muted)", background: "var(--c-surface-2)" };
  return (
    <span className="diag-pop t-micro inline-block rounded-full px-2 py-0.5 font-semibold" style={c}>
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

function Lane({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[4px] border border-line p-3">
      <p className={eyebrow}>{title}</p>
      <div className="flex min-h-[32px] flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

/* ------------------------------------------------ 1. sync vs async --- */

export function SyncAsyncPlay({ lang }: P) {
  const [isAsync, setAsync] = useState(false);
  const s = useStepper(4, 1300);
  const user = isAsync
    ? [
        pick(lang, "pulsa Guardar", "clicks Save"),
        pick(lang, "✓ guardado al instante", "✓ saved instantly"),
        pick(lang, "sigue trabajando", "keeps working"),
        pick(lang, "sigue trabajando", "keeps working"),
      ]
    : [
        pick(lang, "pulsa Guardar", "clicks Save"),
        pick(lang, "⏳ esperando…", "⏳ waiting…"),
        pick(lang, "⏳ esperando…", "⏳ waiting…"),
        pick(lang, "✓ por fin guardado", "✓ finally saved"),
      ];
  const queue = isAsync
    ? ["—", pick(lang, "trabajo encolado", "job enqueued"), pick(lang, "en ejecución", "running"), pick(lang, "✓ terminado", "✓ finished")]
    : ["—", "—", "—", "—"];
  const say = isAsync
    ? [
        pick(lang, "La renovación se guarda y el aviso al ERP se deja en la cola. Pulsa Reproducir.", "The renewal is saved and the ERP notice is left in the queue. Press Play."),
        pick(lang, "El guardado termina enseguida: el usuario no espera por el ERP.", "The save ends right away: the user does not wait for the ERP."),
        pick(lang, "Segundos después, Salesforce ejecuta el trabajo en otra transacción: 200 consultas y 60 s de CPU.", "Seconds later, Salesforce runs the job in another transaction: 200 queries and 60 s of CPU."),
        pick(lang, "Dos transacciones, cada una con su presupuesto. Nadie ha esperado.", "Two transactions, each with its own budget. Nobody waited."),
      ]
    : [
        pick(lang, "Todo va dentro del guardado. Pulsa Reproducir.", "Everything goes inside the save. Press Play."),
        pick(lang, "El trabajo pesado corre en el mismo guardado, con 100 consultas y 10 s de CPU.", "The heavy work runs in the same save, with 100 queries and 10 s of CPU."),
        pick(lang, "El usuario mira la rueda girando. Y si hubiera un callout, Salesforce ni lo permitiría.", "The user watches the spinner. And if there were a callout, Salesforce would not even allow it."),
        pick(lang, "Una sola transacción, un solo presupuesto, y alguien esperando todo el rato.", "One transaction, one budget, and someone waiting the whole time."),
      ];
  return (
    <div className="w-full">
      <Tabs items={[pick(lang, "Síncrono", "Synchronous"), pick(lang, "Asíncrono", "Asynchronous")]} value={isAsync ? 1 : 0} onChange={(n) => { setAsync(n === 1); s.go(0); }} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Lane title={pick(lang, "EL USUARIO", "THE USER")}>
          <span key={`${isAsync}-${s.i}`}>
            <Tag tone={user[s.i].startsWith("✓") ? "ok" : user[s.i].startsWith("⏳") ? "bad" : "plain"}>{user[s.i]}</Tag>
          </span>
        </Lane>
        <Lane title={pick(lang, "LA COLA DE APEX", "THE APEX QUEUE")}>
          <span key={`q-${isAsync}-${s.i}`}>
            <Tag tone={queue[s.i].startsWith("✓") ? "ok" : "plain"}>{queue[s.i]}</Tag>
          </span>
        </Lane>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Counter label={pick(lang, "consultas por transacción", "queries per transaction")} value={isAsync && s.i >= 2 ? 200 : 100} />
        <Counter label={pick(lang, "CPU por transacción", "CPU per transaction")} value={isAsync && s.i >= 2 ? "60 s" : "10 s"} />
      </div>
      <Note lang={lang} s={s}>
        {say[s.i]}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------ 2. @future per batch --- */

export function FuturePlay({ lang }: P) {
  const [perRecord, setPerRecord] = useState(true);
  const [n, setN] = useState(3);
  const calls = perRecord ? n : 1;
  const dead = calls > 50;
  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "Llamada dentro del for", "Call inside the for"), pick(lang, "Una llamada por lote", "One call per batch")]}
        value={perRecord ? 0 : 1}
        onChange={(v) => setPerRecord(v === 0)}
      />
      <pre className="t-small overflow-x-auto whitespace-pre rounded-[4px] p-3 font-mono" style={codeBox}>
        {perRecord
          ? "for (Opportunity o : Trigger.new) {\n    ErpNotifier.notifyRenewals(new Set<Id>{ o.Id });\n}"
          : "ErpNotifier.notifyRenewals(\n    new Map<Id, Opportunity>(Trigger.new).keySet()\n);"}
      </pre>
      <p className="t-small mt-3 text-ink">
        {pick(lang, "Renovaciones en la carga:", "Renewals in the load:")} <strong className="font-mono">{n}</strong>
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {[1, 3, 50, 51, 200].map((v) => (
          <button key={v} type="button" className="btn btn-ghost" aria-pressed={n === v} onClick={() => setN(v)}>
            {v}
          </button>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Counter label={pick(lang, "llamadas @future (máx. 50)", "@future calls (max 50)")} value={Math.min(calls, 51)} danger={dead} />
        <Counter label={pick(lang, "peticiones al ERP", "requests to the ERP")} value={dead ? 0 : calls} />
      </div>
      <p className="t-small mt-3" aria-live="polite" style={{ color: dead ? "var(--c-danger)" : "var(--c-text-muted)" }}>
        {dead
          ? pick(lang, "System.LimitException: Too many future calls: 51. La carga entera se deshace y el ERP no recibe nada.", "System.LimitException: Too many future calls: 51. The whole load is rolled back and the ERP receives nothing.")
          : perRecord
            ? pick(lang, `${n} llamadas y ${n} peticiones. Funciona… hasta la renovación 51.`, `${n} calls and ${n} requests. It works… until renewal 51.`)
            : pick(lang, `Una llamada y una petición con las ${n} renovaciones, sea cual sea el tamaño del lote.`, `One call and one request with the ${n} renewals, whatever the batch size.`)}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 3. Queueable chain --- */

export function QueueableChainPlay({ lang }: P) {
  const [rows, setRows] = useState(900);
  const [devOrg, setDevOrg] = useState(false);
  const links = Math.max(1, Math.ceil(rows / 200));
  const s = useStepper(links + 1, 900);
  const done = Math.min(s.i, devOrg ? Math.min(links, 5) : links);
  const cut = devOrg && links > 5 && s.i > 5;
  const processed = Math.min(done * 200, rows);
  const fmt = (v: number) => v.toLocaleString(lang === "es" ? "es-ES" : "en-US");
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {[150, 900, 1600].map((v) => (
          <button key={v} type="button" className="btn btn-ghost" aria-pressed={rows === v} onClick={() => { setRows(v); s.go(0); }}>
            {fmt(v)} {pick(lang, "filas", "rows")}
          </button>
        ))}
        <button type="button" className="btn btn-ghost" aria-pressed={devOrg} onClick={() => { setDevOrg((d) => !d); s.go(0); }}>
          {pick(lang, "Developer Org (tope de 5)", "Developer Org (cap of 5)")}
        </button>
      </div>
      <p className={eyebrow}>{pick(lang, "LA CADENA · CADA ESLABÓN, UNA TRANSACCIÓN", "THE CHAIN · EACH LINK, ONE TRANSACTION")}</p>
      <ol className="flex flex-wrap gap-1.5">
        {Array.from({ length: links }, (_, k) => {
          const ran = k < done;
          const blocked = devOrg && k >= 5;
          const size = Math.min(200, rows - k * 200);
          return (
            <li
              key={`${rows}-${devOrg}-${k}`}
              className="t-micro rounded-[4px] border px-2 py-1 font-mono"
              style={{
                borderColor: ran ? "var(--c-brand)" : blocked && cut ? "var(--c-danger)" : "var(--c-border)",
                background: ran ? "var(--c-brand-soft)" : "transparent",
                color: ran ? "var(--c-brand)" : blocked && cut ? "var(--c-danger)" : "var(--c-text-faint)",
              }}
            >
              #{k + 1} · {size}
            </li>
          );
        })}
      </ol>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Counter label={pick(lang, "filas procesadas", "rows processed")} value={fmt(processed)} />
        <Counter label={pick(lang, "pendientes", "pending")} value={fmt(rows - processed)} danger={cut} />
      </div>
      <Note lang={lang} s={s}>
        {s.i === 0
          ? pick(lang, "Cada trabajo toma 200 filas y, si ha llenado la tanda, se encola otra vez. Pulsa Reproducir.", "Each job takes 200 rows and, if it filled the chunk, enqueues itself again. Press Play.")
          : cut
            ? pick(lang, "En una Developer Org la cadena se corta en el eslabón 5: quedan filas sin procesar. En producción no hay tope de profundidad.", "In a Developer Org the chain is cut at link 5: rows are left unprocessed. In production there is no depth cap.")
            : done >= links
              ? pick(lang, `El último eslabón sacó ${rows - (links - 1) * 200} filas, menos de 200: no se encola otro y la cadena se detiene sola.`, `The last link got ${rows - (links - 1) * 200} rows, fewer than 200: it does not enqueue another and the chain stops on its own.`)
              : pick(lang, `Eslabón ${done}: tanda llena de 200, así que encola el siguiente.`, `Link ${done}: a full chunk of 200, so it enqueues the next.`)}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------ 4. Batch lifecycle --- */

export function BatchPlay({ lang }: P) {
  const [fail, setFail] = useState(false);
  const [stateful, setStateful] = useState(true);
  const chunks = 5;
  const s = useStepper(chunks + 3, 1000);
  // steps: 0 idle · 1 start · 2..6 execute chunks · 7 finish
  const ran = Math.max(0, Math.min(s.i - 1, chunks));
  const failed = fail && ran >= 3 ? 1 : 0;
  const okChunks = ran - failed;
  const finishSeen = stateful ? okChunks * 200 : 0;
  const atFinish = s.i >= chunks + 2;
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-ghost" aria-pressed={fail} onClick={() => { setFail((v) => !v); s.go(0); }}>
          {pick(lang, "Hacer fallar la tanda 3", "Make chunk 3 fail")}
        </button>
        <button type="button" className="btn btn-ghost" aria-pressed={stateful} onClick={() => { setStateful((v) => !v); s.go(0); }}>
          Database.Stateful
        </button>
      </div>
      <ol className="space-y-1.5">
        <li className="t-small flex items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
          start · getQueryLocator → 1.000 {pick(lang, "filas", "rows")}
          {s.i >= 1 && <Tag tone="ok">{pick(lang, "1 vez", "once")}</Tag>}
        </li>
        {Array.from({ length: chunks }, (_, k) => {
          const done = k < ran;
          const bad = fail && k === 2 && done;
          return (
            <li key={`${fail}-${k}`} className="t-small flex items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
              execute · {pick(lang, "tanda", "chunk")} {k + 1} (200)
              {done && <Tag tone={bad ? "bad" : "ok"}>{bad ? pick(lang, "✗ se deshace solo esta", "✗ only this one rolls back") : pick(lang, "✓ transacción propia", "✓ own transaction")}</Tag>}
            </li>
          );
        })}
        <li className="t-small flex items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
          finish · System.debug(processed)
          {atFinish && <Tag tone={stateful ? "ok" : "bad"}>processed = {finishSeen}</Tag>}
        </li>
      </ol>
      <Note lang={lang} s={s}>
        {s.i === 0
          ? pick(lang, "1.000 filas, tandas de 200. Pulsa Reproducir.", "1,000 rows, chunks of 200. Press Play.")
          : s.i === 1
            ? pick(lang, "start se ejecuta una vez y entrega la consulta completa.", "start runs once and hands over the full query.")
            : !atFinish
              ? pick(lang, `execute, tanda ${ran}: una transacción nueva, con su presupuesto a cero.`, `execute, chunk ${ran}: a new transaction, with its budget back at zero.`)
              : stateful
                ? pick(lang, `finish ve ${finishSeen} filas procesadas${fail ? ": la tanda 3 falló, pero las otras cuatro siguieron" : ""}. Stateful ha guardado el contador entre tandas.`, `finish sees ${finishSeen} rows processed${fail ? ": chunk 3 failed, but the other four carried on" : ""}. Stateful kept the counter between chunks.`)
                : pick(lang, "finish ve processed = 0: sin Stateful, cada transacción empezó con el objeto tal como estaba al lanzar el Batch.", "finish sees processed = 0: without Stateful, each transaction started with the object as it was when the Batch was launched.")}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------ 5. cron builder --- */

export function CronPlay({ lang }: P) {
  const [hour, setHour] = useState(2);
  const [days, setDays] = useState(1);
  const dayOptions = [
    { label: pick(lang, "Todos los días", "Every day"), dom: "*", dow: "?", say: pick(lang, "todos los días", "every day") },
    { label: pick(lang, "De lunes a viernes", "Monday to Friday"), dom: "?", dow: "MON-FRI", say: pick(lang, "de lunes a viernes", "Monday to Friday") },
    { label: pick(lang, "Solo sábados", "Saturdays only"), dom: "?", dow: "SAT", say: pick(lang, "los sábados", "on Saturdays") },
    { label: pick(lang, "Último día del mes", "Last day of the month"), dom: "L", dow: "?", say: pick(lang, "el último día de cada mes", "on the last day of every month") },
  ];
  const d = dayOptions[days];
  const parts = [
    { v: "0", l: pick(lang, "segundos", "seconds") },
    { v: "0", l: pick(lang, "minutos", "minutes") },
    { v: String(hour), l: pick(lang, "horas", "hours") },
    { v: d.dom, l: pick(lang, "día del mes", "day of month") },
    { v: "*", l: pick(lang, "mes", "month") },
    { v: d.dow, l: pick(lang, "día de la semana", "day of week") },
  ];
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "¿A QUÉ HORA?", "AT WHAT TIME?")}</p>
      <div className="flex flex-wrap gap-2">
        {[2, 6, 23].map((h) => (
          <button key={h} type="button" className="btn btn-ghost" aria-pressed={hour === h} onClick={() => setHour(h)}>
            {h}:00
          </button>
        ))}
      </div>
      <p className={`${eyebrow} mt-3`}>{pick(lang, "¿QUÉ DÍAS?", "WHICH DAYS?")}</p>
      <div className="flex flex-wrap gap-2">
        {dayOptions.map((o, k) => (
          <button key={o.label} type="button" className="btn btn-ghost" aria-pressed={days === k} onClick={() => setDays(k)}>
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {parts.map((p, k) => (
          <div key={`${k}-${p.v}`} className="diag-pop rounded-[4px] px-2.5 py-1.5 text-center" style={{ background: p.v === "?" ? "var(--c-surface-2)" : "var(--c-brand-soft)" }}>
            <p className="t-body font-mono font-semibold" style={{ color: p.v === "?" ? "var(--c-text-muted)" : "var(--c-brand)" }}>
              {p.v}
            </p>
            <p className="t-micro text-faint">{p.l}</p>
          </div>
        ))}
      </div>
      <pre className="t-small mt-3 overflow-x-auto whitespace-pre rounded-[4px] p-3 font-mono" style={codeBox}>
        {`System.schedule('…', '${parts.map((p) => p.v).join(" ")}', new RenewalMigrationScheduler());`}
      </pre>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {pick(lang, `A las ${hour}:00, ${d.say}.`, `At ${hour}:00, ${d.say}.`)}{" "}
        {d.dom === "?"
          ? pick(lang, "Fijas el día de la semana, así que el día del mes lleva ?.", "You set the day of week, so the day of month takes ?.")
          : pick(lang, "Fijas el día del mes, así que el día de la semana lleva ?.", "You set the day of month, so the day of week takes ?.")}
        {days === 3 ? pick(lang, " Esto un flow programado no lo puede expresar.", " A scheduled flow cannot express this.") : ""}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 6. which tool? (game) --- */

export function AsyncChooserPlay({ lang }: P) {
  const all = ["@future", "Queueable", "Batch", "Scheduled"];
  const needs = [
    { need: pick(lang, "Avisar al ERP de cada renovación nueva, sin más.", "Notify the ERP of each new renewal, nothing more."), answer: "@future" },
    { need: pick(lang, "Avisar al ERP y, con su respuesta, lanzar un segundo paso.", "Notify the ERP and, with its answer, launch a second step."), answer: "Queueable" },
    { need: pick(lang, "Recalcular el Rating de 2 millones de cuentas.", "Recalculate the Rating of 2 million accounts."), answer: "Batch" },
    { need: pick(lang, "Arrancar la limpieza cada domingo a las 3:00.", "Start the clean-up every Sunday at 3:00."), answer: "Scheduled" },
    { need: pick(lang, "Pasarle al trabajo una lista de oportunidades y seguir su estado por Id.", "Pass the job a list of opportunities and track its status by Id."), answer: "Queueable" },
    { need: pick(lang, "Recorrer todas las renovaciones pendientes, 100 por tanda, contando fallos.", "Walk all pending renewals, 100 per chunk, counting failures."), answer: "Batch" },
  ];
  return (
    <ChooserGame
      lang={lang}
      all={all}
      needs={needs}
      eyebrow={pick(lang, "NORTHWIND PIDE…", "NORTHWIND ASKS…")}
      hint={pick(lang, "Elige la herramienta asíncrona.", "Pick the async tool.")}
    />
  );
}

/* ------------------------------------------------ 7. the whole night --- */

export function NightlyPipelinePlay({ lang }: P) {
  const [erpDown, setErpDown] = useState(false);
  const chunks = 5;
  const s = useStepper(chunks + 4, 1100);
  // 0 idle · 1 scheduler · 2 start · 3..7 chunks · 8 finish
  const ran = Math.max(0, Math.min(s.i - 2, chunks));
  const perChunk = [100, 100, 100, 100, 100];
  const saveFails = [0, 2, 0, 0, 1];
  let synced = 0;
  let failed = 0;
  for (let k = 0; k < ran; k++) {
    if (erpDown && k === 3) continue;
    synced += perChunk[k] - saveFails[k];
    failed += saveFails[k];
  }
  const pending = erpDown && ran >= 4 ? 100 : 0;
  const steps = [
    pick(lang, "Una noche laborable cualquiera: 500 renovaciones que el ERP aún no tiene. Pulsa Reproducir.", "Any weeknight: 500 renewals the ERP does not have yet. Press Play."),
    pick(lang, "2:00 · el Schedulable despierta y lanza Database.executeBatch(…, 100). Termina al instante.", "2:00 · the Schedulable wakes and launches Database.executeBatch(…, 100). It ends instantly."),
    pick(lang, "start · la consulta de las pendientes: ERP_Synced__c = false.", "start · the query for the pending ones: ERP_Synced__c = false."),
  ];
  const chunkSay = (k: number) =>
    erpDown && k === 3
      ? pick(lang, "Tanda 4 · el ERP no responde: la excepción deshace solo esta tanda, que sigue pendiente para mañana.", "Chunk 4 · the ERP does not respond: the exception rolls back only this chunk, which stays pending for tomorrow.")
      : pick(
          lang,
          `Tanda ${k + 1} · primero la llamada con 100 renovaciones, después Database.update(scope, false)${saveFails[k] ? `: ${saveFails[k]} no se pueden guardar y suman a failed` : ""}.`,
          `Chunk ${k + 1} · first the call with 100 renewals, then Database.update(scope, false)${saveFails[k] ? `: ${saveFails[k]} cannot be saved and add to failed` : ""}.`,
        );
  const say =
    s.i < 3
      ? steps[s.i]
      : s.i < chunks + 3
        ? chunkSay(s.i - 3)
        : pick(lang, `finish · System.enqueueJob(new ErpNightlyReport(${synced}, ${failed})). El ERP recibe el resumen de la noche.`, `finish · System.enqueueJob(new ErpNightlyReport(${synced}, ${failed})). The ERP gets the night's summary.`);
  return (
    <div className="w-full">
      <button type="button" className="btn btn-ghost mb-3" aria-pressed={erpDown} onClick={() => { setErpDown((v) => !v); s.go(0); }}>
        {pick(lang, "El ERP se cae en la tanda 4", "The ERP goes down on chunk 4")}
      </button>
      <div className="flex flex-wrap gap-1.5">
        {["Scheduled", "start", ...Array.from({ length: chunks }, (_, k) => `${pick(lang, "tanda", "chunk")} ${k + 1}`), "finish → Queueable"].map((label, k) => {
          const reached = s.i > k;
          const bad = erpDown && k === 5 && reached;
          return (
            <span
              key={`${erpDown}-${label}`}
              className="t-micro rounded-[4px] border px-2 py-1 font-mono"
              style={{
                borderColor: bad ? "var(--c-danger)" : reached ? "var(--c-brand)" : "var(--c-border)",
                background: bad ? "var(--c-danger-soft)" : reached ? "var(--c-brand-soft)" : "transparent",
                color: bad ? "var(--c-danger)" : reached ? "var(--c-brand)" : "var(--c-text-faint)",
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Counter label="synced" value={synced} />
        <Counter label="failed" value={failed} danger={failed > 0} />
        <Counter label={pick(lang, "para mañana", "for tomorrow")} value={pending} danger={pending > 0} />
      </div>
      <Note lang={lang} s={s}>
        {say}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}
