"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 3's interactive diagrams.
 *
 * The centrepiece is a live SOQL bench: a small Sales Cloud org held in memory,
 * a query the reader assembles with clause controls, and a result table that
 * recomputes on every change. No parsing — each control maps to one clause, so
 * the query string and the rows always agree.
 */

type P = { lang: Lang };

/* --------------------------------------------------------------- the org --- */

type Opp = { name: string; stage: string; amount: number };
type Acc = {
  name: string;
  industry: string;
  revenue: number;
  contacts: string[];
  opps: Opp[];
};

const ORG: Acc[] = [
  {
    name: "Acme Corp",
    industry: "Technology",
    revenue: 5000000,
    contacts: ["Rivera", "Soto"],
    opps: [
      { name: "Renovación Acme", stage: "Closed Won", amount: 120000 },
      { name: "Ampliación licencias", stage: "Prospecting", amount: 40000 },
    ],
  },
  {
    name: "Northwind Trading",
    industry: "Retail",
    revenue: 2400000,
    contacts: ["Torres"],
    opps: [{ name: "Renovación primavera", stage: "Negotiation", amount: 24500 }],
  },
  {
    name: "Globex",
    industry: "Technology",
    revenue: 900000,
    contacts: ["Méndez", "Ruiz", "Pardo"],
    opps: [],
  },
  {
    name: "Initech",
    industry: "Manufacturing",
    revenue: 12000000,
    contacts: [],
    opps: [{ name: "Planta nueva", stage: "Closed Won", amount: 800000 }],
  },
  {
    name: "Umbrella Foods",
    industry: "Retail",
    revenue: 450000,
    contacts: ["Díaz"],
    opps: [{ name: "Piloto tiendas", stage: "Prospecting", amount: 15000 }],
  },
];

const money = (n: number) => n.toLocaleString("es-ES");

/* --------------------------------------------------------------- controls -- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="t-micro font-semibold tracking-[0.06em] text-faint">{label}</span>
      {children}
    </label>
  );
}

const selectStyle: React.CSSProperties = {
  background: "var(--c-surface)",
  border: "1px solid var(--c-border)",
  color: "var(--c-text)",
  borderRadius: 4,
  padding: "7px 8px",
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  minHeight: 38,
};

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

/* ------------------------------------------------------- 1. live SOQL bench */

type WhereKey = "none" | "tech" | "retail" | "bigRevenue" | "smallRevenue" | "likeA";

export function SoqlLive({ lang }: P) {
  const [showIndustry, setShowIndustry] = useState(true);
  const [showRevenue, setShowRevenue] = useState(false);
  const [sub, setSub] = useState(false);
  const [where, setWhere] = useState<WhereKey>("none");
  const [order, setOrder] = useState<"none" | "nameAsc" | "revDesc">("none");
  const [limit, setLimit] = useState<"none" | "1" | "2" | "3">("none");

  const wheres: Record<WhereKey, { soql: string; test: (a: Acc) => boolean; note: string }> = {
    none: {
      soql: "",
      test: () => true,
      note: pick(
        lang,
        "Sin WHERE, la consulta trae las cinco cuentas de la org. En una org de verdad eso son todas: por eso el filtro no es un adorno.",
        "With no WHERE, the query brings all five accounts in the org. In a real org that means every one of them: which is why the filter is not decoration.",
      ),
    },
    tech: {
      soql: "WHERE Industry = 'Technology'",
      test: (a) => a.industry === "Technology",
      note: pick(
        lang,
        "El filtro de un informe, escrito en texto. Fíjate en que el valor va entre comillas simples y distingue mayúsculas: 'technology' no devolvería nada.",
        "A report filter, written as text. Note the value goes in single quotes and is case-sensitive: 'technology' would return nothing.",
      ),
    },
    retail: {
      soql: "WHERE Industry = 'Retail'",
      test: (a) => a.industry === "Retail",
      note: pick(lang, "Mismo filtro, otro valor: dos cuentas.", "Same filter, different value: two accounts."),
    },
    bigRevenue: {
      soql: "WHERE AnnualRevenue > 1000000",
      test: (a) => a.revenue > 1000000,
      note: pick(
        lang,
        "Un número NO lleva comillas. Si se las pones, Apex intenta comparar texto con número y la consulta falla.",
        "A number does NOT take quotes. Put them in and Apex tries to compare text with a number, and the query fails.",
      ),
    },
    smallRevenue: {
      soql: "WHERE AnnualRevenue < 1000000",
      test: (a) => a.revenue < 1000000,
      note: pick(lang, "Lo contrario: las cuentas pequeñas.", "The opposite: the small accounts."),
    },
    likeA: {
      soql: "WHERE Name LIKE 'A%'",
      test: (a) => a.name.startsWith("A"),
      note: pick(
        lang,
        "LIKE con % es el «empieza por» de los filtros de informe. El % al final busca lo que empieza así; al principio y al final, lo que lo contiene.",
        "LIKE with % is the report filter's “starts with”. A trailing % matches what starts that way; one at each end matches what contains it.",
      ),
    },
  };

  let rows = ORG.filter(wheres[where].test);
  if (order === "nameAsc") rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  if (order === "revDesc") rows = [...rows].sort((a, b) => b.revenue - a.revenue);
  const filtered = rows.length;
  if (limit !== "none") rows = rows.slice(0, Number(limit));

  const fields = ["Id", "Name"];
  if (showIndustry) fields.push("Industry");
  if (showRevenue) fields.push("AnnualRevenue");
  const subPart = sub ? ", (SELECT LastName FROM Contacts)" : "";
  const orderPart = order === "nameAsc" ? " ORDER BY Name ASC" : order === "revDesc" ? " ORDER BY AnnualRevenue DESC" : "";
  const limitPart = limit === "none" ? "" : ` LIMIT ${limit}`;
  const wherePart = wheres[where].soql ? ` ${wheres[where].soql}` : "";
  const soql = `[SELECT ${fields.join(", ")}${subPart} FROM Account${wherePart}${orderPart}${limitPart}]`;

  return (
    <div className="w-full">
      <p className="t-small mb-3 text-muted">
        {pick(
          lang,
          "Cambia las piezas de la consulta y mira cómo cambian las filas. Los datos son una org pequeña de Sales Cloud: cinco cuentas con sus contactos.",
          "Change the pieces of the query and watch the rows change. The data is a small Sales Cloud org: five accounts with their contacts.",
        )}
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label={pick(lang, "WHERE · FILTRO", "WHERE · FILTER")}>
          <select style={selectStyle} value={where} onChange={(e) => setWhere(e.target.value as WhereKey)}>
            <option value="none">{pick(lang, "(sin filtro)", "(no filter)")}</option>
            <option value="tech">Industry = &apos;Technology&apos;</option>
            <option value="retail">Industry = &apos;Retail&apos;</option>
            <option value="bigRevenue">AnnualRevenue &gt; 1000000</option>
            <option value="smallRevenue">AnnualRevenue &lt; 1000000</option>
            <option value="likeA">Name LIKE &apos;A%&apos;</option>
          </select>
        </Field>
        <Field label="ORDER BY">
          <select style={selectStyle} value={order} onChange={(e) => setOrder(e.target.value as typeof order)}>
            <option value="none">{pick(lang, "(sin ordenar)", "(unordered)")}</option>
            <option value="nameAsc">Name ASC</option>
            <option value="revDesc">AnnualRevenue DESC</option>
          </select>
        </Field>
        <Field label="LIMIT">
          <select style={selectStyle} value={limit} onChange={(e) => setLimit(e.target.value as typeof limit)}>
            <option value="none">{pick(lang, "(sin límite)", "(no limit)")}</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </Field>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="t-micro font-semibold tracking-[0.06em] text-faint">{pick(lang, "CAMPOS", "FIELDS")}</span>
        <span
          className="t-small inline-flex min-h-[36px] items-center rounded-full border px-3 font-mono"
          style={{ borderColor: "var(--c-border)", color: "var(--c-text-faint)" }}
          title={pick(lang, "Siempre presente", "Always present")}
        >
          Name
        </span>
        <Chip on={showIndustry} onClick={() => setShowIndustry((v) => !v)}>
          Industry
        </Chip>
        <Chip on={showRevenue} onClick={() => setShowRevenue((v) => !v)}>
          AnnualRevenue
        </Chip>
        <Chip on={sub} onClick={() => setSub((v) => !v)}>
          (SELECT … FROM Contacts)
        </Chip>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code className="block whitespace-pre-wrap font-mono text-[12.5px] leading-[1.7] text-ink">{soql}</code>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr>
              {fields
                .filter((f) => f !== "Id")
                .map((f) => (
                  <th key={f} className="t-micro border-b py-2 pr-3 font-mono font-semibold text-faint" style={{ borderColor: "var(--c-border)" }}>
                    {f}
                  </th>
                ))}
              {sub && (
                <th className="t-micro border-b py-2 font-mono font-semibold text-faint" style={{ borderColor: "var(--c-border)" }}>
                  Contacts
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.name} className="diag-pop border-b" style={{ borderColor: "var(--c-border)" }}>
                <td className="py-2 pr-3 font-mono text-[13px] text-ink">{a.name}</td>
                {showIndustry && <td className="py-2 pr-3 font-mono text-[13px] text-muted">{a.industry}</td>}
                {showRevenue && <td className="py-2 pr-3 font-mono text-[13px] tabular-nums text-muted">{money(a.revenue)}</td>}
                {sub && (
                  <td className="py-2 font-mono text-[12.5px] text-muted">
                    {a.contacts.length ? (
                      a.contacts.join(", ")
                    ) : (
                      <span style={{ color: "var(--c-warn)" }}>{pick(lang, "(lista vacía)", "(empty list)")}</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="t-small py-3 text-muted">
                  {pick(lang, "0 filas. La consulta no falla: devuelve una lista vacía.", "0 rows. The query does not fail: it returns an empty list.")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="t-small mt-3 text-muted" aria-live="polite">
        <strong className="text-ink">
          {rows.length} {pick(lang, rows.length === 1 ? "fila devuelta" : "filas devueltas", rows.length === 1 ? "row returned" : "rows returned")}
        </strong>
        {limit !== "none" && filtered > rows.length && (
          <>
            {" · "}
            {pick(
              lang,
              `el filtro encontró ${filtered}, pero LIMIT solo deja pasar ${rows.length}`,
              `the filter found ${filtered}, but LIMIT lets only ${rows.length} through`,
            )}
          </>
        )}
        {" — "}
        {wheres[where].note}
      </p>
    </div>
  );
}

/* --------------------------------------------- 2. the three ways to relate - */

export function SubqueryPlay({ lang }: P) {
  const modes = [
    {
      label: pick(lang, "Bajar a los hijos", "Down to the children"),
      soql: "[SELECT Name, (SELECT LastName FROM Contacts) FROM Account]",
      note: pick(
        lang,
        "Subconsulta en el SELECT: cada cuenta llega con SU lista de contactos colgando, como la related list de la página del registro. Devuelve las 5 cuentas, tengan contactos o no — Initech viene con la lista vacía, que no es null.",
        "A subquery in the SELECT: every account arrives with ITS own list of contacts hanging off it, like the related list on the record page. It returns all 5 accounts, with or without contacts — Initech comes with an empty list, which is not null.",
      ),
      rows: ORG.map((a) => ({
        main: a.name,
        extra: a.contacts.length ? a.contacts.join(", ") : pick(lang, "(lista vacía)", "(empty list)"),
        warn: a.contacts.length === 0,
      })),
      head: ["Account.Name", "Contacts"],
    },
    {
      label: pick(lang, "Subir al padre", "Up to the parent"),
      soql: "[SELECT LastName, Account.Industry FROM Contact]",
      note: pick(
        lang,
        "Aquí no hay subconsulta: se sube al padre con un punto, como un campo de combinación. Cambia la unidad de la respuesta — ya no son cuentas, son los 7 contactos — y cada uno trae el sector de su cuenta repetido.",
        "No subquery here: you go up to the parent with a dot, like a merge field. It changes the unit of the answer — these are no longer accounts but the 7 contacts — and each one carries its account's industry, repeated.",
      ),
      rows: ORG.flatMap((a) => a.contacts.map((c) => ({ main: c, extra: a.industry, warn: false }))),
      head: ["Contact.LastName", "Account.Industry"],
    },
    {
      label: pick(lang, "Filtrar por los hijos", "Filter by the children"),
      soql: "[SELECT Name FROM Account\n WHERE Id IN (SELECT AccountId FROM Opportunity\n              WHERE StageName = 'Closed Won')]",
      note: pick(
        lang,
        "Es el filtro cruzado del informe: «Cuentas CON oportunidades ganadas». La subconsulta va en el WHERE y solo sirve para decidir qué padres entran: no trae ni un solo dato de la oportunidad. Cambia NOT IN y tendrás «Cuentas SIN…».",
        "It is the report's cross filter: “Accounts WITH won opportunities”. The subquery sits in the WHERE and only decides which parents get in: it brings back not one field of the opportunity. Switch to NOT IN and you get “Accounts WITHOUT…”.",
      ),
      rows: ORG.filter((a) => a.opps.some((o) => o.stage === "Closed Won")).map((a) => ({
        main: a.name,
        extra: "—",
        warn: false,
      })),
      head: ["Account.Name", pick(lang, "(nada más)", "(nothing else)")],
    },
  ];

  const [m, setM] = useState(0);
  const cfg = modes[m];

  return (
    <div className="w-full">
      <Tabs items={modes.map((x) => x.label)} value={m} onChange={setM} />

      <div className="overflow-x-auto rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code className="block whitespace-pre font-mono text-[12.5px] leading-[1.7] text-ink">{cfg.soql}</code>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[380px] border-collapse text-left">
          <thead>
            <tr>
              {cfg.head.map((h) => (
                <th key={h} className="t-micro border-b py-2 pr-3 font-mono font-semibold text-faint" style={{ borderColor: "var(--c-border)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cfg.rows.map((r, i) => (
              <tr key={`${m}-${i}`} className="diag-pop border-b" style={{ borderColor: "var(--c-border)" }}>
                <td className="py-2 pr-3 font-mono text-[13px] text-ink">{r.main}</td>
                <td className="py-2 font-mono text-[12.5px]" style={{ color: r.warn ? "var(--c-warn)" : "var(--c-text-muted)" }}>
                  {r.extra}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="t-small mt-3 text-muted" aria-live="polite">
        <strong className="text-ink">
          {cfg.rows.length} {pick(lang, cfg.rows.length === 1 ? "fila" : "filas", cfg.rows.length === 1 ? "row" : "rows")}
        </strong>
        {" — "}
        {cfg.note}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 3. how a query is read --- */

export function QueryAnatomyPlay({ lang }: P) {
  const steps = [
    {
      part: "FROM Account",
      note: pick(
        lang,
        "Aunque se escriba en segundo lugar, la base de datos empieza por aquí: de qué objeto hablamos. Es elegir el objeto principal de un informe.",
        "Even though it is written second, the database starts here: which object we are talking about. It is choosing a report's primary object.",
      ),
      rows: ORG.length,
    },
    {
      part: "WHERE Industry = 'Technology'",
      note: pick(
        lang,
        "El filtro recorta las filas ANTES de nada más. De cinco cuentas quedan dos. Sin índice detrás, este es el paso que decide si la consulta aguanta en una org con millones de filas.",
        "The filter cuts the rows BEFORE anything else. Five accounts become two. With no index behind it, this is the step that decides whether the query survives in an org with millions of rows.",
      ),
      rows: ORG.filter((a) => a.industry === "Technology").length,
    },
    {
      part: "ORDER BY AnnualRevenue DESC",
      note: pick(
        lang,
        "Ordenar ocurre sobre lo que ya pasó el filtro, no sobre toda la tabla. Acme (5.000.000) se pone delante de Globex (900.000).",
        "Ordering happens over what already passed the filter, not over the whole table. Acme (5,000,000) goes ahead of Globex (900,000).",
      ),
      rows: 2,
    },
    {
      part: "LIMIT 1",
      note: pick(
        lang,
        "LIMIT corta al final, cuando ya está filtrado y ordenado. Por eso «la cuenta más grande de Technology» es ORDER BY … DESC LIMIT 1, y por eso LIMIT sin ORDER BY devuelve una fila cualquiera.",
        "LIMIT cuts at the end, once things are filtered and ordered. That is why “the largest Technology account” is ORDER BY … DESC LIMIT 1, and why LIMIT without ORDER BY returns an arbitrary row.",
      ),
      rows: 1,
    },
    {
      part: "SELECT Id, Name, AnnualRevenue",
      note: pick(
        lang,
        "Y lo primero que se escribe es lo último que se decide: qué columnas vuelven. Pedir campos que no vas a usar no cambia el número de filas, pero sí la memoria que gasta la transacción.",
        "And the first thing you write is the last thing decided: which columns come back. Asking for fields you will not use does not change the row count, but it does change the memory the transaction burns.",
      ),
      rows: 1,
    },
  ];

  const s = useStepper(steps.length, 2200);

  return (
    <div className="w-full">
      <ol className="space-y-2">
        {steps.map((x, n) => {
          const state = n === s.i ? "cur" : n < s.i ? "done" : "next";
          return (
            <li key={n}>
              <button
                type="button"
                onClick={() => s.go(n)}
                className="flex w-full items-center gap-3 rounded-[4px] border px-3 py-2 text-left transition-colors"
                style={{
                  borderColor: state === "cur" ? "var(--c-brand)" : "var(--c-border)",
                  background: state === "cur" ? "var(--c-brand-soft)" : "transparent",
                  opacity: state === "next" ? 0.55 : 1,
                }}
              >
                <code className="min-w-0 flex-1 font-mono text-[12.5px] text-ink">{x.part}</code>
                <span
                  className="t-micro shrink-0 rounded-full px-2 py-0.5 font-mono font-semibold"
                  style={{
                    color: state === "next" ? "var(--c-text-faint)" : "var(--c-brand)",
                    background: state === "next" ? "transparent" : "var(--c-brand-soft)",
                  }}
                >
                  {state === "next"
                    ? "—"
                    : `${x.rows} ${pick(lang, x.rows === 1 ? "fila" : "filas", x.rows === 1 ? "row" : "rows")}`}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <Note lang={lang} s={s}>
        {steps[s.i].note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------ 4. what a subquery saves you (M4) --- */

function LimitMeter({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const over = value > max;
  const pct = Math.min(value / max, 1) * 100;
  const shown = `${value.toLocaleString("es-ES")} / ${max.toLocaleString("es-ES")} ${unit}`;
  return (
    <div>
      <p className="t-micro mb-1 flex items-baseline justify-between gap-2">
        <span className="font-semibold tracking-[0.06em] text-faint">{label}</span>
        <span className="font-mono tabular-nums" style={{ color: over ? "var(--c-danger)" : "var(--c-text)" }}>
          {over ? "💥 " : ""}
          {shown}
        </span>
      </p>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={Math.min(value, max)}
        aria-valuetext={shown}
        title={shown}
        className="h-[10px] w-full overflow-hidden rounded-[4px]"
        style={{ background: "var(--c-surface-2)" }}
      >
        <div
          className="h-full rounded-[4px] transition-[width] duration-500"
          style={{
            width: value > 0 ? `max(4px, ${pct}%)` : 0,
            background: over ? "var(--c-danger)" : "var(--c-brand)",
          }}
        />
      </div>
    </div>
  );
}

export function SubqueryCost({ lang }: P) {
  const [mode, setMode] = useState(0);
  const [size, setSize] = useState(50);
  const PER_ACCOUNT = 4; // contacts per account, on average
  const QUERY_LIMIT = 100;
  const ROW_LIMIT = 50000;

  const queries = mode === 0 ? 1 : 1 + size;
  const rows = size + size * PER_ACCOUNT;
  const blows = queries > QUERY_LIMIT;

  const code =
    mode === 0
      ? "List<Account> accs = [SELECT Name,\n    (SELECT LastName FROM Contacts)\n    FROM Account];\n\nfor (Account a : accs) {\n    for (Contact c : a.Contacts) { … }\n}"
      : `List<Account> accs = [SELECT Id, Name FROM Account];\n\nfor (Account a : accs) {\n    ${pick(lang, "// una consulta NUEVA en cada vuelta", "// a NEW query on every pass")}\n    List<Contact> cs = [SELECT LastName FROM Contact\n                        WHERE AccountId = :a.Id];\n}`;

  const note =
    mode === 0
      ? pick(
          lang,
          `Una sola sentencia SOQL trae las ${size} cuentas con sus contactos colgando. Da igual que sean 5 o 200: sigue siendo 1 de 100. (Letra pequeña: la relación hija se apunta en un cupo aparte, tres veces mayor, así que en la práctica no es lo que te para). Las filas sí cuentan todas —cuentas y contactos— para el tope de 50.000.`,
          `A single SOQL statement brings all ${size} accounts with their contacts hanging off them. Whether it is 5 or 200, it is still 1 of 100. (Small print: the child relationship is logged against a separate allowance, three times larger, so in practice it is not what stops you.) The rows do all count — accounts and contacts — towards the 50,000 cap.`,
        )
      : blows
        ? pick(
            lang,
            `Con ${size} cuentas harían falta ${queries} consultas, y el límite es 100. La transacción revienta en la vuelta 100 con System.LimitException: Too many SOQL queries: 101 y no se guarda nada. Fíjate en que las FILAS son exactamente las mismas que con la subconsulta: el problema no son los datos, es cuántas veces preguntas.`,
            `With ${size} accounts you would need ${queries} queries, and the limit is 100. The transaction blows up on loop 100 with System.LimitException: Too many SOQL queries: 101 and nothing is saved. Note the ROWS are exactly the same as with the subquery: the problem is not the data, it is how many times you ask.`,
          )
        : pick(
            lang,
            `Con ${size} cuentas funciona: ${queries} consultas de 100. Por eso este error pasa las pruebas con datos de ejemplo y revienta en producción el día que alguien importa 200 cuentas de golpe. Sube a 200 y míralo.`,
            `With ${size} accounts it works: ${queries} queries out of 100. That is why this bug passes testing with sample data and blows up in production the day someone imports 200 accounts at once. Move up to 200 and watch.`,
          );

  return (
    <div className="w-full">
      <Tabs
        items={[pick(lang, "Con subconsulta", "With a subquery"), pick(lang, "Consulta dentro del bucle", "Query inside the loop")]}
        value={mode}
        onChange={setMode}
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-micro font-semibold tracking-[0.06em] text-faint">{pick(lang, "CUENTAS EN LA ORG", "ACCOUNTS IN THE ORG")}</span>
        {[5, 50, 200].map((n) => (
          <Chip key={n} on={size === n} onClick={() => setSize(n)}>
            {n}
          </Chip>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code className="block whitespace-pre font-mono text-[12.5px] leading-[1.7] text-ink">{code}</code>
      </div>

      <div className="mt-4 space-y-3">
        <LimitMeter label={pick(lang, "CONSULTAS SOQL", "SOQL QUERIES")} value={queries} max={QUERY_LIMIT} unit="" />
        <LimitMeter label={pick(lang, "FILAS RECUPERADAS", "ROWS RETRIEVED")} value={rows} max={ROW_LIMIT} unit="" />
      </div>

      <p className="t-small mt-3 text-muted" aria-live="polite">
        <strong style={{ color: blows ? "var(--c-danger)" : "var(--c-text)" }}>
          {blows
            ? pick(lang, "💥 LimitException: la transacción entera se deshace.", "💥 LimitException: the whole transaction rolls back.")
            : pick(lang, "✓ Dentro de los límites.", "✓ Within the limits.")}
        </strong>{" "}
        {note}
      </p>
    </div>
  );
}
