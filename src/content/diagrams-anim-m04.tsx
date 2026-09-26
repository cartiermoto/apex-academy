"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 4's interactive diagrams, told through its workshops: Northwind's
 * daily operation (onboarding, the nightly lead load, the quarter close and
 * the case escalation) written with DML.
 */

type P = { lang: Lang };
const eyebrow = "t-micro mb-2 font-semibold tracking-[0.06em] text-faint";

type Tone = "ok" | "bad" | "gone" | "new" | "plain";
function Tag({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const c =
    tone === "ok" || tone === "new"
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

/* ------------------------------------------------ 1. the four DML verbs --- */

type Row = { id: string; name: string; col: string; tag?: string; tone?: Tone };

export function DmlOpsPlay({ lang }: P) {
  const ops = [
    {
      key: "insert",
      code: "insert new Account(Name = 'Nimbus Logistics');",
      loader: pick(lang, "Data Loader → Insert, sin columna Id", "Data Loader → Insert, no Id column"),
      needs: pick(lang, "Ningún Id: te lo da Salesforce", "No Id: Salesforce gives you one"),
      colName: "Rating",
      before: [
        { id: "001…A1", name: "Acme", col: "Hot" },
        { id: "001…B2", name: "Globex", col: "Warm" },
      ],
      after: [
        { id: "001…A1", name: "Acme", col: "Hot" },
        { id: "001…B2", name: "Globex", col: "Warm" },
        { id: "001…C3", name: "Nimbus Logistics", col: "—", tag: pick(lang, "nuevo · Id asignado", "new · Id assigned"), tone: "new" as Tone },
      ],
      note: pick(
        lang,
        "El Id aparece al guardar, como en el success.csv. Por eso en la tarea 1 los contactos se insertan después de la cuenta: necesitan su Id.",
        "The Id appears on save, as in success.csv. That is why in task 1 the contacts are inserted after the account: they need its Id.",
      ),
    },
    {
      key: "update",
      code: "acc.Rating = 'Hot';\nupdate acc;",
      loader: pick(lang, "Data Loader → Update, la columna Id es obligatoria", "Data Loader → Update, the Id column is required"),
      needs: pick(lang, "El Id del registro", "The record's Id"),
      colName: "Rating",
      before: [{ id: "001…C3", name: "Nimbus Logistics", col: "—" }],
      after: [{ id: "001…C3", name: "Nimbus Logistics", col: "Hot", tag: pick(lang, "actualizado", "updated"), tone: "ok" as Tone }],
      note: pick(
        lang,
        "update busca la fila por su Id. Sin Id no sabe qué registro tocar, y falla, igual que un Update de Data Loader sin esa columna.",
        "update finds the row by its Id. Without an Id it does not know which record to touch, and it fails, just like a Data Loader Update without that column.",
      ),
    },
    {
      key: "upsert",
      code: "upsert fromErp Account.Fields.ERP_Code__c;",
      loader: pick(lang, "Data Loader → Upsert, eliges el campo External ID", "Data Loader → Upsert, you pick the External ID field"),
      needs: pick(lang, "Un campo marcado como External ID", "A field marked as External ID"),
      colName: "ERP_Code__c",
      before: [
        { id: "001…A1", name: "Acme", col: "ERP-100" },
        { id: "001…B2", name: "Globex", col: "ERP-200" },
      ],
      after: [
        { id: "001…A1", name: "Acme Corp", col: "ERP-100", tag: pick(lang, "existía → actualizado", "existed → updated"), tone: "ok" as Tone },
        { id: "001…B2", name: "Globex", col: "ERP-200" },
        { id: "001…D4", name: "Umbrella", col: "ERP-300", tag: pick(lang, "no existía → creado", "did not exist → created"), tone: "new" as Tone },
      ],
      note: pick(
        lang,
        "Llegan dos cuentas del ERP. upsert decide fila a fila por el External ID: ERP-100 ya existía y se actualiza; ERP-300 no, y se crea.",
        "Two accounts arrive from the ERP. upsert decides row by row by the External ID: ERP-100 already existed and is updated; ERP-300 did not, and is created.",
      ),
    },
    {
      key: "delete",
      code: "delete acc;",
      loader: pick(lang, "Data Loader → Delete, solo la columna Id", "Data Loader → Delete, just the Id column"),
      needs: pick(lang, "El Id", "The Id"),
      colName: "Rating",
      before: [{ id: "001…C3", name: "Nimbus Logistics", col: "Hot" }],
      after: [{ id: "001…C3", name: "Nimbus Logistics", col: "Hot", tag: pick(lang, "a la Papelera · 15 días", "to the Recycle Bin · 15 days"), tone: "gone" as Tone }],
      note: pick(
        lang,
        "Como al borrar a mano: el registro va a la Papelera y se puede recuperar durante 15 días (desde Apex, con undelete).",
        "As when you delete by hand: the record goes to the Recycle Bin and can be restored for 15 days (from Apex, with undelete).",
      ),
    },
  ];
  const [k, setK] = useState(0);
  const [ran, setRan] = useState(false);
  const op = ops[k];
  const rows: Row[] = ran ? op.after : op.before;

  return (
    <div className="w-full">
      <Tabs items={ops.map((o) => o.key)} value={k} onChange={(n) => { setK(n); setRan(false); }} />
      <div className="grid gap-3 md:grid-cols-2">
        <pre className="t-small whitespace-pre-wrap break-words rounded-[4px] p-3 font-mono" style={codeBox}>
          {op.code}
        </pre>
        <div className="t-small rounded-[4px] p-3" style={{ background: "var(--c-surface-2)" }}>
          <p className="text-ink">{op.loader}</p>
          <p className="mt-1 text-muted">
            {pick(lang, "Necesita: ", "Needs: ")}
            <strong className="text-ink">{op.needs}</strong>
          </p>
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="t-small w-full border-collapse text-left">
          <thead>
            <tr className="t-micro text-faint">
              <th className="py-1.5 pr-3 font-semibold">Id</th>
              <th className="py-1.5 pr-3 font-semibold">Name</th>
              <th className="py-1.5 pr-3 font-semibold">{op.colName}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${k}-${ran}-${r.id}`} className="border-t border-line align-top">
                <td className="py-1.5 pr-3 font-mono text-muted">{r.id}</td>
                <td className="py-1.5 pr-3" style={{ textDecoration: r.tone === "gone" ? "line-through" : "none" }}>
                  {r.name}
                  {r.tag && (
                    <span className="ml-2">
                      {/* the row name is struck through; its explanation tag is not */}
                      <Tag tone={r.tone === "gone" ? "plain" : (r.tone ?? "plain")}>{r.tag}</Tag>
                    </span>
                  )}
                </td>
                <td className="py-1.5 pr-3 font-mono">{r.col}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {ran ? (
          <button type="button" className="btn btn-ghost" onClick={() => setRan(false)}>
            {pick(lang, "↺ Ver el antes", "↺ See the before")}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setRan(true)}>
            {pick(lang, "▶ Ejecutar", "▶ Run")} {op.key}
          </button>
        )}
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {ran ? op.note : pick(lang, "Así está la org antes. Pulsa Ejecutar.", "This is the org before. Press Run.")}
      </p>
    </div>
  );
}

/* ----------------------------------------- 2. all or nothing vs partial --- */

export function AllOrNonePlay({ lang }: P) {
  const [partial, setPartial] = useState(false);
  const s = useStepper(4, 1100);
  const leads = [
    { name: "Ruiz", company: "Acme", good: true },
    { name: "Kim", company: "Globex", good: false },
    { name: "Silva", company: "Initech", good: true },
  ];
  // step 1 processes Ruiz, 2 Kim, 3 is the verdict (Silva included)
  const state = (n: number): { tone: Tone; label: string } | null => {
    const l = leads[n];
    const invalid = { tone: "bad" as Tone, label: pick(lang, "✗ correo inválido", "✗ invalid email") };
    if (!partial && s.i === 3) return l.good ? { tone: "gone", label: pick(lang, "no guardado", "not saved") } : invalid;
    if (n >= s.i) return null;
    if (!l.good) return invalid;
    return { tone: "ok", label: partial ? pick(lang, "guardado", "saved") : pick(lang, "pendiente…", "pending…") };
  };
  const verdict =
    s.i < 3
      ? null
      : partial
        ? pick(
            lang,
            "2 guardados y 1 con error, cada uno en su SaveResult: tu success.csv y tu error.csv. Marketing corrige a Kim por la mañana y nadie ha perdido a Ruiz ni a Silva.",
            "2 saved and 1 with an error, each in its SaveResult: your success.csv and error.csv. Marketing fixes Kim in the morning and nobody lost Ruiz or Silva.",
          )
        : pick(
            lang,
            "System.DmlException: Insert failed. First exception on row 1; first error: INVALID_EMAIL_ADDRESS. Un solo lead malo y no se guarda ninguno: Kim arrastra a Ruiz y a Silva.",
            "System.DmlException: Insert failed. First exception on row 1; first error: INVALID_EMAIL_ADDRESS. One bad lead and none is saved: Kim drags Ruiz and Silva down with it.",
          );

  return (
    <div className="w-full">
      <Tabs
        items={["insert leads;", "Database.insert(leads, false);"]}
        value={partial ? 1 : 0}
        onChange={(n) => { setPartial(n === 1); s.go(0); }}
      />
      <p className={eyebrow}>{pick(lang, "LA CARGA DE ESTA NOCHE", "TONIGHT'S LOAD")}</p>
      <ul className="space-y-1.5">
        {leads.map((l, n) => {
          const st = state(n);
          return (
            <li key={l.name} className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-2">
              <span className="font-mono">
                {l.name} · {l.company}
              </span>
              {st && (
                <span key={`${partial}-${s.i}`}>
                  <Tag tone={st.tone}>{st.label}</Tag>
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <Note lang={lang} s={s}>
        {s.i === 0
          ? pick(lang, "Tres leads del formulario web. Kim trae el correo mal escrito. Pulsa Reproducir.", "Three web-form leads. Kim's email is malformed. Press Play.")
          : s.i < 3
            ? pick(lang, `Se procesa ${leads[s.i - 1].name}…`, `Processing ${leads[s.i - 1].name}…`)
            : verdict}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------ 3. bulkification slider --- */

function Gauge({ label, used, max, lang }: { label: string; used: number; max: number; lang: Lang }) {
  const fmt = (v: number) => v.toLocaleString(lang === "es" ? "es-ES" : "en-US");
  const over = used > max;
  const pct = Math.min(100, (used / max) * 100);
  return (
    <div>
      <div className="t-small flex justify-between gap-2">
        <span className="text-ink">{label}</span>
        <span className="font-mono tabular-nums" style={{ color: over || pct >= 80 ? "var(--c-danger)" : "var(--c-text)" }}>
          {fmt(Math.min(used, max + 1))} / {fmt(max)}
        </span>
      </div>
      <div className="mt-1 h-2.5 rounded-full" style={{ background: "var(--c-surface-2)" }}>
        <div
          className="h-2.5 rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: over || pct >= 80 ? "var(--c-danger)" : "var(--c-brand)" }}
        />
      </div>
    </div>
  );
}

export function BulkPlay({ lang }: P) {
  const [bulk, setBulk] = useState(false);
  const [n, setN] = useState(3);
  const queries = bulk ? 2 : n + 1;
  const dml = bulk ? 1 : n;
  const dead = queries > 100;
  const code = bulk
    ? "Set<Id> accountIds = …;          // 1 · juntar\nList<Account> accs = [… IN :accountIds]; // 2 · una consulta\nfor (Account a : accs) a.Rating = 'Hot'; // 3 · en memoria\nupdate accs;                     // 4 · un update"
    : "for (Opportunity o : wonToday) {\n    Account a = [SELECT … WHERE Id = :o.AccountId];\n    a.Rating = 'Hot';\n    update a;\n}";

  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "Consulta y update dentro del bucle", "Query and update inside the loop"), pick(lang, "Bulkificado", "Bulkified")]}
        value={bulk ? 1 : 0}
        onChange={(v) => setBulk(v === 1)}
      />
      <pre className="t-small overflow-x-auto whitespace-pre rounded-[4px] p-3 font-mono" style={codeBox}>
        {code}
      </pre>
      <label className="mt-4 block">
        <span className="t-small text-ink">
          {pick(lang, "Oportunidades ganadas en la carga:", "Won opportunities in the load:")} <strong className="font-mono">{n}</strong>
        </span>
        <input
          type="range"
          min={1}
          max={200}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--c-fill)]"
          aria-label={pick(lang, "Número de oportunidades", "Number of opportunities")}
        />
      </label>
      <div className="mt-1 flex flex-wrap gap-2">
        {[1, 3, 99, 100, 200].map((v) => (
          <button key={v} type="button" className="btn btn-ghost" aria-pressed={n === v} onClick={() => setN(v)}>
            {v}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Gauge label={pick(lang, "Consultas SOQL", "SOQL queries")} used={queries} max={100} lang={lang} />
        <Gauge label={pick(lang, "Instrucciones DML", "DML statements")} used={dml} max={150} lang={lang} />
      </div>
      <p className="t-small mt-4" aria-live="polite" style={{ color: dead ? "var(--c-danger)" : "var(--c-text-muted)" }}>
        {dead
          ? pick(
              lang,
              "System.LimitException: Too many SOQL queries: 101. La transacción muere en la consulta 101 y se deshace entera: ninguna cuenta queda en Hot.",
              "System.LimitException: Too many SOQL queries: 101. The transaction dies at query 101 and is rolled back entirely: no account ends up Hot.",
            )
          : bulk
            ? pick(lang, `Con ${n}: 2 consultas y 1 DML. Con 200, exactamente igual.`, `With ${n}: 2 queries and 1 DML. With 200, exactly the same.`)
            : pick(lang, `Con ${n}: ${queries} consultas y ${dml} DML. Funciona… hasta el cierre de trimestre.`, `With ${n}: ${queries} queries and ${dml} DML. It works… until the quarter close.`)}
      </p>
    </div>
  );
}

/* ------------------------------------------- 4. limits, line by line --- */

type Budget = { q: number; rowsR: number; dml: number; rowsW: number; cpu: number };

export function LimitsPlay({ lang }: P) {
  const [bad, setBad] = useState(false);
  const good: Array<{ line: string; b: Budget; say: string }> = [
    { line: pick(lang, "// empieza la transacción", "// the transaction starts"), b: { q: 0, rowsR: 0, dml: 0, rowsW: 0, cpu: 0 }, say: pick(lang, "Todos los contadores empiezan en cero en cada transacción.", "Every counter starts at zero in each transaction.") },
    { line: "List<Case> cases = [SELECT … FROM Case WHERE CreatedDate = YESTERDAY];", b: { q: 1, rowsR: 200, dml: 0, rowsW: 0, cpu: 40 }, say: pick(lang, "Una consulta y 200 filas leídas: los casos de ayer.", "One query and 200 rows read: yesterday's cases.") },
    { line: "Map<Id, Account> hot = new Map<Id, Account>([SELECT Id FROM Account WHERE Id IN :accountIds AND Rating = 'Hot']);", b: { q: 2, rowsR: 280, dml: 0, rowsW: 0, cpu: 70 }, say: pick(lang, "Segunda consulta, con IN: las 80 cuentas Hot de golpe.", "Second query, with IN: the 80 Hot accounts in one go.") },
    { line: "for (Case c : cases) { … }", b: { q: 2, rowsR: 280, dml: 0, rowsW: 0, cpu: 260 }, say: pick(lang, "El bucle solo trabaja en memoria: sube la CPU, nada más.", "The loop only works in memory: CPU goes up, nothing else.") },
    { line: "Database.update(escalated, false);", b: { q: 2, rowsR: 280, dml: 1, rowsW: 80, cpu: 330 }, say: pick(lang, "Un DML para los 80 casos escalados.", "One DML for the 80 escalated cases.") },
    { line: "insert tasks;", b: { q: 2, rowsR: 280, dml: 2, rowsW: 160, cpu: 390 }, say: pick(lang, "Otro DML para las 80 tareas. Final: 2 de 100 consultas y 2 de 150 DML, igual con 20 casos que con 200.", "Another DML for the 80 tasks. Final: 2 of 100 queries and 2 of 150 DML, the same with 20 cases or 200.") },
  ];
  const broken = good.slice(0, 3).concat([
    {
      line: pick(lang, "for (Case c : cases) { Account a = [SELECT … WHERE Id = :c.AccountId]; … }", "for (Case c : cases) { Account a = [SELECT … WHERE Id = :c.AccountId]; … }"),
      b: { q: 101, rowsR: 380, dml: 0, rowsW: 0, cpu: 900 },
      say: pick(lang, "Una consulta por caso: a la vuelta 99 ya van 101. System.LimitException: Too many SOQL queries: 101, y se deshace todo.", "One query per case: by pass 99 there are already 101. System.LimitException: Too many SOQL queries: 101, and everything is rolled back."),
    },
  ]);
  const steps = bad ? broken : good;
  const s = useStepper(steps.length, 1500);
  const cur = steps[Math.min(s.i, steps.length - 1)];

  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "El escalado bulkificado", "The bulkified escalation"), pick(lang, "Con una consulta en el bucle", "With a query in the loop")]}
        value={bad ? 1 : 0}
        onChange={(v) => { setBad(v === 1); s.go(0); }}
      />
      <pre key={`${bad}-${s.i}`} className="diag-pop t-small overflow-x-auto whitespace-pre-wrap break-words rounded-[4px] p-3 font-mono" style={codeBox}>
        {cur.line}
      </pre>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Gauge label={pick(lang, "Consultas SOQL", "SOQL queries")} used={cur.b.q} max={100} lang={lang} />
        <Gauge label={pick(lang, "Filas leídas", "Rows read")} used={cur.b.rowsR} max={50000} lang={lang} />
        <Gauge label={pick(lang, "Instrucciones DML", "DML statements")} used={cur.b.dml} max={150} lang={lang} />
        <Gauge label={pick(lang, "Filas escritas", "Rows written")} used={cur.b.rowsW} max={10000} lang={lang} />
        <Gauge label={pick(lang, "CPU en ms (orientativo)", "CPU in ms (indicative)")} used={cur.b.cpu} max={10000} lang={lang} />
      </div>
      <Note lang={lang} s={s}>
        {cur.say}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ----------------------------------------------- 5. where the savepoint goes --- */

export function SavepointPlay({ lang }: P) {
  const [late, setLate] = useState(false);
  const s = useStepper(5, 1400);
  // the four actions, in order, for each placement of the savepoint
  const actions = late
    ? ["insert acc;", "Savepoint sp = Database.setSavepoint();", "Database.insert(contacts, false);", "Database.rollback(sp);"]
    : ["Savepoint sp = Database.setSavepoint();", "insert acc;", "Database.insert(contacts, false);", "Database.rollback(sp);"];
  const done = s.i; // how many actions have run
  const markAt = late ? 2 : 1; // the action number that sets the mark
  const accSaved = done >= (late ? 1 : 2);
  const contactsRun = done >= 3;
  const rolled = done >= 4;
  const accGone = rolled && !late;

  type Item = { key: string; label: string; tone: Tone; flag?: boolean };
  const items: Item[] = [];
  if (!late && done >= markAt) items.push({ key: "mark", label: pick(lang, "🚩 marca", "🚩 mark"), tone: "plain", flag: true });
  if (accSaved) items.push({ key: "acc", label: "Aurora Foods", tone: accGone ? "gone" : "ok" });
  if (late && done >= markAt) items.push({ key: "mark", label: pick(lang, "🚩 marca", "🚩 mark"), tone: "plain", flag: true });
  if (contactsRun) {
    items.push({ key: "nak", label: "Nakamura", tone: rolled ? "gone" : "ok" });
    items.push({ key: "oka", label: pick(lang, "Okafor ✗", "Okafor ✗"), tone: rolled ? "gone" : "bad" });
  }

  const say = [
    pick(lang, "El alta de Aurora Foods: una cuenta y dos contactos. Okafor trae el correo mal escrito. Pulsa Reproducir.", "Onboarding Aurora Foods: one account and two contacts. Okafor's email is malformed. Press Play."),
    late ? pick(lang, "Se inserta la cuenta: ya tiene Id.", "The account is inserted: it has an Id now.") : pick(lang, "Se pone la marca antes de tocar nada.", "The mark is set before touching anything."),
    late ? pick(lang, "La marca llega tarde: la cuenta ya está guardada detrás de ella.", "The mark comes late: the account is already saved behind it.") : pick(lang, "Se inserta la cuenta, después de la marca.", "The account is inserted, after the mark."),
    pick(lang, "Nakamura se guarda; Okafor falla por el correo.", "Nakamura is saved; Okafor fails because of the email."),
    accGone
      ? pick(lang, "Rollback: se deshace todo lo de después de la marca, cuenta incluida. El alta no existe, y no queda nada que borrar a mano.", "Rollback: everything after the mark is undone, account included. The onboarding does not exist, and nothing is left to delete by hand.")
      : pick(lang, "Rollback: solo se deshace lo de después de la marca. Aurora Foods se queda sin contactos: la cuenta huérfana que alguien tendrá que borrar a mano.", "Rollback: only what came after the mark is undone. Aurora Foods is left without contacts: the orphan account someone will have to delete by hand."),
  ][s.i];

  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "Marca antes de la cuenta", "Mark before the account"), pick(lang, "Marca después de la cuenta", "Mark after the account")]}
        value={late ? 1 : 0}
        onChange={(v) => { setLate(v === 1); s.go(0); }}
      />
      <ol className="t-small space-y-1 font-mono">
        {actions.map((a, n) => (
          <li key={a} className="rounded-[4px] px-2 py-1" style={{ background: n === s.i - 1 ? "var(--c-surface-2)" : "transparent", color: n < s.i ? "var(--c-text)" : "var(--c-text-faint)" }}>
            {n + 1}. {a}
          </li>
        ))}
      </ol>
      <p className={`${eyebrow} mt-4`}>{pick(lang, "EN LA BASE DE DATOS", "IN THE DATABASE")}</p>
      <div className="flex min-h-[40px] flex-wrap items-center gap-2">
        {items.length === 0 && <span className="t-small text-faint">{pick(lang, "vacía", "empty")}</span>}
        {items.map((it) => (
          <span key={`${late}-${it.key}-${it.tone}`} style={{ textDecoration: it.tone === "gone" ? "line-through" : "none" }}>
            <Tag tone={it.tone}>{it.label}</Tag>
          </span>
        ))}
      </div>
      <Note lang={lang} s={s}>
        {say}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------- 6. the safe-DML recipe, in order --- */

export function RecipeOrderPlay({ lang }: P) {
  const steps = [
    { t: pick(lang, "Juntar los Ids en un Set", "Collect the Ids in a Set"), why: pick(lang, "Primero reúnes lo que vas a necesitar, sin ir a la base de datos.", "First you gather what you will need, without going to the database.") },
    { t: pick(lang, "Consultar una vez, con IN", "Query once, with IN"), why: pick(lang, "Un solo viaje a la base de datos para todos los registros.", "A single trip to the database for every record.") },
    { t: pick(lang, "Decidir en memoria, en el bucle", "Decide in memory, in the loop"), why: pick(lang, "El bucle solo cambia campos y llena listas: nada de consultas ni DML dentro.", "The loop only changes fields and fills lists: no queries or DML inside.") },
    { t: pick(lang, "Guardar una vez, con resultados parciales", "Save once, with partial results"), why: pick(lang, "Un DML para todos, con Database.update(lista, false) si un fallo no debe frenar al resto.", "One DML for all, with Database.update(list, false) if one failure must not stop the rest.") },
    { t: pick(lang, "Revisar los SaveResult", "Check the SaveResults"), why: pick(lang, "Lo que falló no desaparece en silencio: lo cuentas, lo registras o avisas.", "What failed does not vanish silently: you count it, log it or raise the alarm.") },
  ];
  const shuffled = [3, 0, 4, 1, 2];
  const [placed, setPlaced] = useState<number[]>([]);
  const [miss, setMiss] = useState<number | null>(null);
  const next = placed.length;
  const complete = next === steps.length;

  const choose = (idx: number) => {
    if (idx === next) {
      setPlaced((p) => [...p, idx]);
      setMiss(null);
    } else {
      setMiss(idx);
    }
  };

  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "ORDENA LA RECETA: PULSA EL SIGUIENTE PASO", "ORDER THE RECIPE: PRESS THE NEXT STEP")}</p>
      <ol className="space-y-1.5">
        {placed.map((idx, n) => (
          <li key={idx} className="diag-pop t-small rounded-[4px] border px-3 py-2" style={{ borderColor: "var(--c-brand)", background: "var(--c-brand-soft)" }}>
            <strong style={{ color: "var(--c-brand)" }}>
              {n + 1} · {steps[idx].t}
            </strong>
            <span className="block text-ink">{steps[idx].why}</span>
          </li>
        ))}
      </ol>
      {!complete && (
        <div className="mt-3 flex flex-wrap gap-2">
          {shuffled
            .filter((idx) => !placed.includes(idx))
            .map((idx) => (
              <button
                key={`${idx}-${miss === idx ? placed.length : "x"}`}
                type="button"
                onClick={() => choose(idx)}
                className={`t-small min-h-[38px] rounded-[4px] border px-3 text-left transition-colors ${miss === idx ? "diag-reject" : ""}`}
                style={{
                  borderColor: miss === idx ? "var(--c-danger)" : "var(--c-border-strong)",
                  background: "var(--c-surface)",
                  color: miss === idx ? "var(--c-danger)" : "var(--c-text)",
                }}
              >
                {steps[idx].t}
              </button>
            ))}
        </div>
      )}
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {complete
          ? pick(lang, "Esa es la forma del escalado de la tarea 6… y la que tendrá tu trigger en el Módulo 6.", "That is the shape of task 6's escalation… and the one your trigger will have in Module 6.")
          : miss !== null
            ? pick(lang, `Todavía no: antes necesitas «${steps[next].t}».`, `Not yet: first you need «${steps[next].t}».`)
            : pick(lang, `Paso ${next + 1} de 5: ¿qué va ahora?`, `Step ${next + 1} of 5: what comes now?`)}
      </p>
      {placed.length > 0 && (
        <button type="button" className="btn btn-ghost mt-2" onClick={() => { setPlaced([]); setMiss(null); }}>
          {pick(lang, "↻ Empezar de nuevo", "↻ Start again")}
        </button>
      )}
    </div>
  );
}
