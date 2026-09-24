"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { ChooserGame, Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 5's interactive diagrams: object-oriented ideas you can poke at.
 * Every one reuses the lesson's own example, so what moves on screen is the
 * code the reader has just read.
 */

type P = { lang: Lang };

function Btn({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button type="button" className="btn btn-ghost font-mono text-[12.5px]" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

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

function Box({
  title,
  rows,
  tone = "plain",
  pop,
}: {
  title: string;
  rows: Array<[string, string]>;
  tone?: "plain" | "brand" | "warn";
  pop?: string;
}) {
  return (
    <div
      key={pop}
      className={`${pop ? "diag-pop " : ""}min-w-0 rounded-[4px] border px-3 py-2.5`}
      style={{
        borderColor: tone === "brand" ? "var(--c-brand)" : tone === "warn" ? "var(--c-warn)" : "var(--c-border)",
        background: tone === "brand" ? "var(--c-brand-soft)" : "transparent",
      }}
    >
      <p className="t-micro mb-1.5 font-mono font-semibold" style={{ color: tone === "brand" ? "var(--c-brand)" : "var(--c-text-faint)" }}>
        {title}
      </p>
      <ul className="space-y-0.5">
        {rows.map(([k, v], i) => (
          <li key={`${i}-${k}`} className="flex items-baseline gap-2 font-mono text-[12.5px]">
            <span className="shrink-0 text-faint">{k}</span>
            <span className="min-w-0 text-ink [overflow-wrap:anywhere]">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------- 1. one class, many objects --- */

export function ClassVsObjectPlay({ lang }: P) {
  const presets = [
    { name: "migration", subject: "'Migración de datos'", hours: 6, billable: true },
    { name: "training", subject: "'Formación interna'", hours: 3, billable: false },
    { name: "report", subject: "'Informe a medida'", hours: 2, billable: true },
  ];
  const [made, setMade] = useState(1);
  const [called, setCalled] = useState(false);
  const cost = (p: (typeof presets)[number]) => (p.billable ? p.hours * 50 : 0);

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Box
          title={pick(lang, "LA CLASE · el molde, una vez", "THE CLASS · the mould, once")}
          tone="brand"
          rows={[
            ["String", "subject"],
            ["Decimal", "hoursSpent"],
            ["Boolean", "isBillable"],
            ["Decimal", "cost(rate)"],
          ]}
        />
        <div className="grid min-w-0 gap-2 sm:grid-cols-3">
          {presets.slice(0, made).map((p) => (
            <Box
              key={p.name}
              pop={p.name}
              title={`${p.name} · ${pick(lang, "objeto", "object")}`}
              rows={[
                ["subject", p.subject],
                ["hoursSpent", String(p.hours)],
                ["isBillable", String(p.billable)],
                ...(called ? ([["cost(50)", `→ ${cost(p)}`]] as Array<[string, string]>) : []),
              ]}
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setMade((m) => Math.min(3, m + 1))} disabled={made >= 3}>
          + new ServiceTicket()
        </Btn>
        <Btn onClick={() => setCalled(true)}>{pick(lang, "llamar a cost(50) en todos", "call cost(50) on all")}</Btn>
        <Btn
          onClick={() => {
            setMade(1);
            setCalled(false);
          }}
        >
          ↻
        </Btn>
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {called
          ? pick(
              lang,
              "El mismo método, resultados distintos: cost() lee las horas de la instancia sobre la que lo llamas. Como un campo fórmula: una sola definición, un resultado por registro.",
              "The same method, different results: cost() reads the hours of the instance you call it on. Like a formula field: one definition, one result per record.",
            )
          : pick(
              lang,
              "Cada new fabrica un objeto nuevo con los mismos campos y sus propios valores, como cada registro de un objeto de Object Manager. Fabrica dos o tres y luego llama al método.",
              "Each new builds a new object with the same fields and its own values, like each record of an Object Manager object. Build two or three and then call the method.",
            )}
      </p>
    </div>
  );
}

/* ------------------------------------------------------- 2. references --- */

export function ReferencesPlay({ lang }: P) {
  const [mode, setMode] = useState(0);
  const [changed, setChanged] = useState(false);
  const cloneMode = mode === 1;
  const stageA = changed && !cloneMode ? "'Closed Won'" : "'Prospecting'";
  const stageB = changed ? "'Closed Won'" : "'Prospecting'";

  return (
    <div className="w-full">
      <Tabs
        items={["opp2 = opp1;", "opp2 = opp1.clone();"]}
        value={mode}
        onChange={(n) => {
          setMode(n);
          setChanged(false);
        }}
      />
      <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="flex gap-2 sm:flex-col">
          {["opp1", "opp2"].map((v) => (
            <span key={v} className="rounded-full border px-3 py-1 font-mono text-[12.5px] text-ink" style={{ borderColor: "var(--c-border-strong)" }}>
              {v} →
            </span>
          ))}
        </div>
        <div className={`grid min-w-0 gap-2 ${cloneMode ? "sm:grid-cols-2" : ""}`}>
          <Box
            pop={`a-${mode}-${changed}`}
            title={cloneMode ? pick(lang, "objeto 1 · lo mira opp1", "object 1 · opp1 points here") : pick(lang, "UN solo objeto · lo miran opp1 y opp2", "ONE object · opp1 and opp2 point here")}
            tone={changed && !cloneMode ? "brand" : "plain"}
            rows={[
              ["Name", "'Acme'"],
              ["StageName", stageA],
            ]}
          />
          {cloneMode && (
            <Box
              pop={`b-${changed}`}
              title={pick(lang, "objeto 2 · lo mira opp2", "object 2 · opp2 points here")}
              tone={changed ? "brand" : "plain"}
              rows={[
                ["Name", "'Acme'"],
                ["StageName", stageB],
              ]}
            />
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setChanged(true)} disabled={changed}>
          opp2.StageName = &apos;Closed Won&apos;;
        </Btn>
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {!changed
          ? pick(lang, "Cuenta los new: ese es el número de objetos. Ahora cambia la etapa a través de opp2.", "Count the news: that is the number of objects. Now change the stage through opp2.")
          : cloneMode
            ? pick(
                lang,
                "clone() hizo un segundo objeto: cambiar opp2 no toca opp1. Es el botón «Clonar» de la interfaz: un registro nuevo que va por su cuenta.",
                "clone() made a second object: changing opp2 does not touch opp1. It is the UI's “Clone” button: a new record going its own way.",
              )
            : pick(
                lang,
                "Solo había un objeto con dos flechas, así que opp1.StageName también vale 'Closed Won'. Es el mismo contacto visto desde dos related lists: lo cambias en un sitio y cambia en los dos.",
                "There was only one object with two arrows, so opp1.StageName is also 'Closed Won'. It is the same contact seen from two related lists: change it in one place and it changes in both.",
              )}
      </p>
    </div>
  );
}

/* ---------------------------------------------------- 3. the constructor -- */

export function ConstructorPlay({ lang }: P) {
  const steps: Array<{ line: string; note: string; f: Record<string, string>; ref: boolean }> = [
    {
      line: "new SupportPlan('Gold')",
      note: pick(lang, "new reserva un objeto vacío: todos sus atributos empiezan en null.", "new reserves an empty object: all its attributes start as null."),
      f: { level: "null", startDate: "null", contacts: "null", hoursIncluded: "null" },
      ref: false,
    },
    {
      line: "level = planLevel;",
      note: pick(lang, "Se ejecuta el constructor, automáticamente. Primero guarda el nivel que le pasaste.", "The constructor runs, automatically. First it stores the level you passed."),
      f: { level: "'Gold'", startDate: "null", contacts: "null", hoursIncluded: "null" },
      ref: false,
    },
    {
      line: "startDate = Date.today();",
      note: pick(lang, "La fecha de inicio: nadie tiene que acordarse de rellenarla.", "The start date: nobody has to remember to fill it in."),
      f: { level: "'Gold'", startDate: "today", contacts: "null", hoursIncluded: "null" },
      ref: false,
    },
    {
      line: "contacts = new List<String>();",
      note: pick(
        lang,
        "La lista vacía, creada aquí. Sin esta línea, el primer contacts.add(…) lanzaría una excepción, porque la lista sería null.",
        "The empty list, created here. Without this line, the first contacts.add(…) would throw, because the list would be null.",
      ),
      f: { level: "'Gold'", startDate: "today", contacts: "[ ]", hoursIncluded: "null" },
      ref: false,
    },
    {
      line: "switch on planLevel { when 'Gold' { hoursIncluded = 40; } … }",
      note: pick(lang, "Las horas se deducen del nivel. El objeto ya está completo.", "Hours are worked out from the level. The object is complete now."),
      f: { level: "'Gold'", startDate: "today", contacts: "[ ]", hoursIncluded: "40" },
      ref: false,
    },
    {
      line: "SupportPlan goldPlan = …",
      note: pick(
        lang,
        "Y solo ahora la variable recibe la referencia. Nadie puede ver nunca un SupportPlan a medias: nace válido, como un registro creado con una acción rápida de valores predefinidos.",
        "Only now does the variable receive the reference. Nobody can ever see a half-built SupportPlan: it is born valid, like a record created with a predefined-values quick action.",
      ),
      f: { level: "'Gold'", startDate: "today", contacts: "[ ]", hoursIncluded: "40" },
      ref: true,
    },
  ];
  const s = useStepper(steps.length, 1800);
  const cur = steps[s.i];

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code key={s.i} className="diag-pop block whitespace-pre font-mono text-[12.5px] text-ink">
          {cur.line}
        </code>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <span
          className="rounded-full border px-3 py-1 font-mono text-[12.5px] transition-colors"
          style={{ borderColor: cur.ref ? "var(--c-brand)" : "var(--c-border)", color: cur.ref ? "var(--c-brand)" : "var(--c-text-faint)" }}
        >
          goldPlan {cur.ref ? "→" : "= ?"}
        </span>
        <Box
          title={pick(lang, "EL OBJETO EN MEMORIA", "THE OBJECT IN MEMORY")}
          tone={cur.ref ? "brand" : "plain"}
          rows={Object.entries(cur.f)}
        />
      </div>
      <Note lang={lang} s={s}>
        {cur.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------------------ 4. this ---- */

export function ThisPlay({ lang }: P) {
  const [mode, setMode] = useState(0);
  const ok = mode === 1;
  return (
    <div className="w-full">
      <Tabs items={["level = level;", "this.level = level;"]} value={mode} onChange={setMode} />
      <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code className="block whitespace-pre font-mono text-[12.5px] leading-[1.7] text-ink">
          {`public SupportPlan(String level) {\n    ${ok ? "this.level = level;" : "level = level;"}\n}`}
        </code>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Box
          pop={`p-${mode}`}
          title={pick(lang, "EL PARÁMETRO level", "THE PARAMETER level")}
          tone={ok ? "plain" : "warn"}
          rows={[["valor", "'Gold'"], [pick(lang, "vive", "lives"), pick(lang, "solo dentro del constructor", "only inside the constructor")]]}
        />
        <Box
          pop={`a-${mode}`}
          title={pick(lang, "EL ATRIBUTO this.level", "THE ATTRIBUTE this.level")}
          tone={ok ? "brand" : "plain"}
          rows={[["valor", ok ? "'Gold'" : "null"], [pick(lang, "vive", "lives"), pick(lang, "lo que viva el objeto", "as long as the object")]]}
        />
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {ok
          ? pick(
              lang,
              "this.level es «mi level, el del objeto»; level a secas es el parámetro. Ahora el valor pasa del parámetro al atributo y sobrevive al constructor. this es el $Record de un flow: «el registro que se está procesando».",
              "this.level is “my level, the object's”; plain level is the parameter. Now the value moves from the parameter to the attribute and outlives the constructor. this is a flow's $Record: “the record being processed”.",
            )
          : pick(
              lang,
              "Dentro del constructor, level a secas es el parámetro, que tapa al atributo. level = level; copia el parámetro en sí mismo, compila sin avisar… y el atributo sigue en null.",
              "Inside the constructor, plain level is the parameter, which hides the attribute. level = level; copies the parameter onto itself, compiles without warning… and the attribute stays null.",
            )}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------- 5. static ---- */

export function StaticPlay({ lang }: P) {
  const [tickets, setTickets] = useState<number[]>([6]);
  const [tx, setTx] = useState(1);
  const hours = [6, 3, 2];

  return (
    <div className="w-full">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <Box
          title={pick(lang, "LA CLASE · una sola vez", "THE CLASS · once only")}
          tone="brand"
          rows={[
            ["static final", "VAT_RATE = 0.21"],
            ["static", `created = ${tickets.length}`],
            [pick(lang, "transacción", "transaction"), `#${tx}`],
          ]}
        />
        <div className="grid min-w-0 gap-2 sm:grid-cols-3">
          {tickets.map((h, n) => (
            <Box key={`${tx}-${n}`} pop={`${tx}-${n}`} title={`${pick(lang, "instancia", "instance")} ${n + 1}`} rows={[["hoursSpent", String(h)]]} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setTickets((t) => [...t, hours[t.length % hours.length]])} disabled={tickets.length >= 3}>
          + new WorkTicket()
        </Btn>
        <Btn
          onClick={() => {
            setTickets([]);
            setTx((t) => t + 1);
          }}
        >
          {pick(lang, "⟲ acaba la transacción", "⟲ transaction ends")}
        </Btn>
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {tickets.length === 0
          ? pick(
              lang,
              "Transacción nueva: los objetos anteriores desaparecieron y el static created vuelve a empezar. Un static no es una variable de la org: vive lo que dura la transacción, como la guardia de triggers del Módulo 7.",
              "New transaction: the previous objects are gone and the static created starts over. A static is not an org variable: it lives as long as the transaction, like Module 7's trigger guard.",
            )
          : pick(
              lang,
              "Cada instancia tiene SUS horas; created y VAT_RATE existen una sola vez, en la clase, y los comparten todas. Como un campo de cada registro frente a un Custom Setting de toda la org.",
              "Each instance has ITS hours; created and VAT_RATE exist once, in the class, shared by all. Like a per-record field versus an org-wide Custom Setting.",
            )}
      </p>
    </div>
  );
}

/* ---------------------------------------------------- 6. access rings ---- */

export function AccessPlay({ lang }: P) {
  const callers = [
    pick(lang, "La propia clase", "The class itself"),
    pick(lang, "Una clase hija", "A child class"),
    pick(lang, "Otra clase de tu org", "Another class in your org"),
    pick(lang, "Código fuera del paquete", "Code outside the package"),
  ];
  const members: Array<{ code: string; level: number; note: string }> = [
    { code: "private Boolean canAfford(…)", level: 0, note: "private" },
    { code: "protected Decimal reserve", level: 1, note: "protected" },
    { code: "public Decimal spent { get; }", level: 2, note: pick(lang, "leer: public", "read: public") },
    { code: "spent { private set; }", level: 0, note: pick(lang, "escribir: private", "write: private") },
    { code: "public Boolean spend(…)", level: 2, note: "public" },
    { code: "global Decimal remaining()", level: 3, note: "global" },
  ];
  const [c, setC] = useState(2);

  return (
    <div className="w-full">
      <p className="t-micro mb-2 font-semibold tracking-[0.06em] text-faint">{pick(lang, "¿QUIÉN PREGUNTA?", "WHO IS ASKING?")}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {callers.map((x, n) => (
          <Chip key={x} on={c === n} onClick={() => setC(n)}>
            {x}
          </Chip>
        ))}
      </div>
      <ul className="space-y-1.5">
        {members.map((m) => {
          const ok = m.level >= c;
          return (
            <li
              key={m.code}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[4px] border px-3 py-1.5 transition-colors"
              style={{ borderColor: ok ? "var(--c-brand)" : "var(--c-border)", borderStyle: ok ? "solid" : "dashed" }}
            >
              <code className="min-w-0 flex-1 font-mono text-[12.5px]" style={{ color: ok ? "var(--c-text)" : "var(--c-text-faint)" }}>
                {m.code}
              </code>
              <span className="t-micro font-mono text-faint">{m.note}</span>
              <span
                key={`${m.code}-${c}`}
                className="diag-pop t-micro rounded-full px-2 py-0.5 font-mono font-semibold"
                style={ok ? { color: "var(--c-brand)", background: "var(--c-brand-soft)" } : { color: "var(--c-text-faint)" }}
              >
                {ok ? pick(lang, "✓ lo ve", "✓ sees it") : pick(lang, "✗ invisible", "✗ invisible")}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {[
          pick(lang, "Desde dentro se ve todo, incluido lo private: es la propia clase la que hace cumplir sus reglas.", "From inside everything is visible, private included: the class itself enforces its rules."),
          pick(lang, "Una hija ve lo protected además de lo público, pero no lo private del padre.", "A child sees protected as well as public, but not the parent's private members."),
          pick(
            lang,
            "Cualquier otra clase solo ve lo public: puede LEER spent, pero para cambiarlo tiene que pasar por spend(), que comprueba el presupuesto. Es el Field-Level Security de «solo lectura».",
            "Any other class sees only public: it can READ spent, but to change it has to go through spend(), which checks the budget. It is read-only field-level security.",
          ),
          pick(lang, "Desde fuera de un paquete gestionado solo se ve lo global: por eso casi nunca lo escribirás en tu propio código.", "From outside a managed package only global is visible: which is why you will almost never write it in your own code."),
        ][c]}
      </p>
    </div>
  );
}

/* ------------------------------------------------------ 7. inheritance --- */

export function InheritancePlay({ lang }: P) {
  const [child, setChild] = useState(true);
  const [fixed, setFixed] = useState(false);
  const preview = fixed ? "'[Aviso] Llamar a Acme → ana@acme.com'" : "'Llamar a Acme → ana@acme.com'";
  const members: Array<{ m: string; from: "parent" | "child" }> = [
    { m: "recipient (protected)", from: "parent" },
    { m: "subject", from: "parent" },
    { m: "preview()", from: "parent" },
    ...(child ? ([{ m: "dueDate", from: "child" }, { m: "isOverdue()", from: "child" }] as Array<{ m: string; from: "parent" | "child" }>) : []),
  ];

  return (
    <div className="w-full">
      <Tabs items={["new Notification(…)", "new TaskReminder(…)"]} value={child ? 1 : 0} onChange={(n) => setChild(n === 1)} />
      <ul className="space-y-1.5">
        {members.map((x) => (
          <li
            key={x.m}
            className="diag-pop flex flex-wrap items-center justify-between gap-2 rounded-[4px] border px-3 py-1.5"
            style={{ borderColor: x.from === "child" ? "var(--c-brand)" : "var(--c-border)" }}
          >
            <code className="font-mono text-[12.5px] text-ink">{x.m}</code>
            <span className="t-micro font-mono" style={{ color: x.from === "child" ? "var(--c-brand)" : "var(--c-text-faint)" }}>
              {x.from === "child"
                ? pick(lang, "propio de TaskReminder", "TaskReminder's own")
                : child
                  ? pick(lang, "heredado de Notification", "inherited from Notification")
                  : pick(lang, "de Notification", "Notification's")}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 rounded-[4px] px-3 py-2" style={codeBox}>
        <code key={preview} className="diag-pop block font-mono text-[12.5px] text-ink [overflow-wrap:anywhere]">
          {child ? "reminder" : "notice"}.preview() → {preview}
        </code>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setFixed((f) => !f)}>
          {fixed ? pick(lang, "deshacer el cambio en el padre", "undo the parent change") : pick(lang, "cambiar preview() en Notification", "change preview() in Notification")}
        </Btn>
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {fixed
          ? pick(
              lang,
              "Cambiaste preview() una sola vez, en el padre, y el recordatorio también lo muestra: la hija no copió el método, lo hereda. Un arreglo en el padre llega a todas las hijas a la vez.",
              "You changed preview() once, in the parent, and the reminder shows it too: the child did not copy the method, it inherits it. A fix in the parent reaches every child at once.",
            )
          : child
            ? pick(
                lang,
                "TaskReminder tiene todo lo de Notification —sin volver a escribirlo— y además lo suyo. Como un perfil base con un permission set encima (simplificación: en Apex solo se hereda de una clase).",
                "TaskReminder has everything Notification has — without rewriting it — plus its own. Like a base profile with a permission set on top (simplification: in Apex you inherit from just one class).",
              )
            : pick(lang, "Una notificación normal: destinatario, asunto y previsualización. Cambia a TaskReminder.", "A plain notification: recipient, subject and preview. Switch to TaskReminder.")}
      </p>
    </div>
  );
}

/* --------------------------------------------------------- 8. abstract --- */

export function AbstractPlay({ lang }: P) {
  const [amount, setAmount] = useState(200);
  const [made, setMade] = useState<"none" | "abstract" | "percent" | "fixed">("none");
  const result = made === "percent" ? amount * 0.9 : made === "fixed" ? amount - 50 : null;

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-micro font-semibold tracking-[0.06em] text-faint">{pick(lang, "IMPORTE", "AMOUNT")}</span>
        {[200, 1000].map((a) => (
          <Chip key={a} on={amount === a} onClick={() => setAmount(a)}>
            {a}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Btn onClick={() => setMade("abstract")}>new Discount(&apos;?&apos;)</Btn>
        <Btn onClick={() => setMade("percent")}>new PercentDiscount(&apos;10 %&apos;, 10)</Btn>
        <Btn onClick={() => setMade("fixed")}>new FixedDiscount(&apos;-50&apos;, 50)</Btn>
      </div>
      <div className="mt-3 rounded-[4px] px-3 py-2.5" style={codeBox} aria-live="polite">
        {made === "none" ? (
          <p className="t-small text-faint">{pick(lang, "Elige qué descuento fabricar.", "Pick which discount to build.")}</p>
        ) : made === "abstract" ? (
          <p key="abs" className="diag-pop font-mono text-[12.5px]" style={{ color: "var(--c-danger)" }}>
            ✗ {pick(lang, "No compila: Discount es abstract y no se puede instanciar.", "Does not compile: Discount is abstract and cannot be instantiated.")}
          </p>
        ) : (
          <p key={`${made}-${amount}`} className="diag-pop font-mono text-[12.5px] text-ink">
            Discount d = new {made === "percent" ? "PercentDiscount" : "FixedDiscount"}(…);
            <br />
            d.apply({amount}) → <strong style={{ color: "var(--c-brand)" }}>{result}</strong>
          </p>
        )}
      </div>
      <p className="t-small mt-3 text-muted">
        {made === "abstract"
          ? pick(
              lang,
              "Como Activity: nadie crea «una actividad», se crean Tasks o Events. La clase abstract define lo común —la etiqueta, describe()— y deja apply() sin cuerpo para que cada hija lo resuelva.",
              "Like Activity: nobody creates “an activity”, you create Tasks or Events. The abstract class defines what is common — the label, describe() — and leaves apply() bodiless for each child to solve.",
            )
          : made === "none"
            ? ""
            : pick(
                lang,
                "La variable es de tipo Discount, pero el objeto es de una hija concreta, y apply() ejecuta la versión de esa hija. Cambia el importe y prueba las dos: misma llamada, dos cálculos.",
                "The variable is of type Discount, but the object belongs to a concrete child, and apply() runs that child's version. Change the amount and try both: same call, two calculations.",
              )}
      </p>
    </div>
  );
}

/* ---------------------------------------------- 9. overload vs override --- */

export function OverloadOverridePlay({ lang }: P) {
  const [tab, setTab] = useState(0);
  const [call, setCall] = useState(0);
  const [obj, setObj] = useState(0);

  return (
    <div className="w-full">
      <Tabs items={[pick(lang, "Sobrecarga", "Overloading"), pick(lang, "Sobrescritura", "Overriding")]} value={tab} onChange={setTab} />
      {tab === 0 ? (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip on={call === 0} onClick={() => setCall(0)}>
              MoneyFormatter.format(1500)
            </Chip>
            <Chip on={call === 1} onClick={() => setCall(1)}>
              MoneyFormatter.format(1500, &apos;USD&apos;)
            </Chip>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { sig: "format(Decimal amount)", body: "return format(amount, 'EUR');" },
              { sig: "format(Decimal amount, String currencyCode)", body: "return currencyCode + ' ' + amount;" },
            ].map((v, n) => {
              const on = call === n || (call === 0 && n === 1);
              return (
                <div
                  key={v.sig}
                  className="min-w-0 rounded-[4px] border px-3 py-2 transition-colors"
                  style={{ borderColor: on ? "var(--c-brand)" : "var(--c-border)", background: call === n ? "var(--c-brand-soft)" : "transparent" }}
                >
                  <code className="block font-mono text-[12px] text-ink [overflow-wrap:anywhere]">{v.sig}</code>
                  <code className="t-micro block font-mono text-faint">{v.body}</code>
                </div>
              );
            })}
          </div>
          <p className="t-small mt-3 text-muted" aria-live="polite">
            {call === 0
              ? pick(
                  lang,
                  "Con un solo argumento, Apex elige la versión de un parámetro, que a su vez llama a la de dos con 'EUR'. Resultado: 'EUR 1500'. Versiones una AL LADO de otra, en la misma clase.",
                  "With one argument, Apex picks the one-parameter version, which in turn calls the two-parameter one with 'EUR'. Result: 'EUR 1500'. Versions SIDE BY SIDE, in the same class.",
                )
              : pick(lang, "Con dos argumentos va directa a la versión de dos parámetros: 'USD 1500'. Como TEXT() en una fórmula, que acepta un número, una fecha o un picklist.", "With two arguments it goes straight to the two-parameter version: 'USD 1500'. Like TEXT() in a formula, which takes a number, a date or a picklist.")}
          </p>
        </>
      ) : (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            <Chip on={obj === 0} onClick={() => setObj(0)}>
              Report r = new Report();
            </Chip>
            <Chip on={obj === 1} onClick={() => setObj(1)}>
              Report r = new SalesReport();
            </Chip>
          </div>
          <div className="space-y-2">
            {[
              { cls: "Report", sig: "public virtual String title()", ret: "'Informe'" },
              { cls: "SalesReport extends Report", sig: "public override String title()", ret: "'Informe de ventas'" },
            ].map((v, n) => (
              <div
                key={v.cls}
                className="rounded-[4px] border px-3 py-2 transition-colors"
                style={{
                  marginLeft: n * 18,
                  borderColor: obj === n ? "var(--c-brand)" : "var(--c-border)",
                  background: obj === n ? "var(--c-brand-soft)" : "transparent",
                }}
              >
                <p className="t-micro font-mono text-faint">{v.cls}</p>
                <code className="block font-mono text-[12px] text-ink">
                  {v.sig} → {v.ret}
                </code>
              </div>
            ))}
          </div>
          <p className="t-small mt-3 text-muted" aria-live="polite">
            {obj === 0
              ? pick(lang, "El objeto es un Report: se ejecuta la versión del padre, 'Informe'.", "The object is a Report: the parent's version runs, 'Informe'.")
              : pick(
                  lang,
                  "La variable dice Report, pero el objeto es un SalesReport: gana la versión de la hija, 'Informe de ventas'. Versiones una ENCIMA de otra, en la jerarquía. Lo que decide es el objeto, no la variable.",
                  "The variable says Report, but the object is a SalesReport: the child's version wins, 'Informe de ventas'. Versions ONE ON TOP of another, in the hierarchy. The object decides, not the variable.",
                )}
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------- 10. interfaces --- */

export function InterfacePlay({ lang }: P) {
  const leads = [
    { label: "Globex · Technology · 800", industry: "Technology", employees: 800, country: "Spain" },
    { label: "Umbrella · Retail · 120", industry: "Retail", employees: 120, country: "Mexico" },
  ];
  const rules = [
    { name: "IndustryRule", test: (l: (typeof leads)[number]) => (l.industry === "Technology" ? 20 : 0), what: "Technology → 20" },
    { name: "SizeRule", test: (l: (typeof leads)[number]) => (l.employees >= 500 ? 30 : 0), what: "≥ 500 → 30" },
    { name: "CountryRule", test: (l: (typeof leads)[number]) => (l.country === "Spain" ? 10 : 0), what: "Spain → 10" },
  ];
  const [li, setLi] = useState(0);
  const [on, setOn] = useState<boolean[]>([true, true, false]);
  const lead = leads[li];
  const active = rules.filter((_, n) => on[n]);
  const total = active.reduce((sum, r) => sum + r.test(lead), 0);

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap gap-2">
        {leads.map((l, n) => (
          <Chip key={l.label} on={li === n} onClick={() => setLi(n)}>
            {l.label}
          </Chip>
        ))}
      </div>
      <p className="t-micro mb-2 font-semibold tracking-[0.06em] text-faint">List&lt;LeadScoringRule&gt; rules</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {rules.map((r, n) => (
          <Chip key={r.name} on={on[n]} onClick={() => setOn((o) => o.map((v, k) => (k === n ? !v : v)))}>
            {on[n] ? "✓ " : "+ "}
            {r.name}
          </Chip>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[4px] px-3 py-2.5" style={codeBox}>
          <p className="t-micro mb-1 font-semibold text-faint">{pick(lang, "EL BUCLE · no cambia nunca", "THE LOOP · never changes")}</p>
          <code className="block whitespace-pre font-mono text-[12px] leading-[1.6] text-ink">
            {"Integer total = 0;\nfor (LeadScoringRule r : rules) {\n    total += r.score(candidate);\n}"}
          </code>
        </div>
        <ul className="space-y-1">
          {rules.map((r, n) => (
            <li
              key={r.name}
              className="flex items-baseline justify-between gap-2 rounded-[4px] border px-3 py-1 font-mono text-[12.5px]"
              style={{ borderColor: on[n] ? "var(--c-brand)" : "var(--c-border)", borderStyle: on[n] ? "solid" : "dashed" }}
            >
              <span className="text-ink">{r.name}</span>
              <span className="text-faint">{r.what}</span>
              <span key={`${li}-${on[n]}`} className="diag-pop font-semibold" style={{ color: on[n] ? "var(--c-brand)" : "var(--c-text-faint)" }}>
                {on[n] ? `+${r.test(lead)}` : "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        <strong className="text-ink">total = {total}.</strong>{" "}
        {pick(
          lang,
          "Activa o quita reglas: el total cambia y el bucle sigue siendo el mismo, porque solo conoce el contrato —score()— y no qué clase hay detrás. Añadir la regla del trimestre que viene es escribir una clase nueva, sin tocar nada más.",
          "Switch rules on or off: the total changes and the loop stays the same, because it only knows the contract — score() — and not which class is behind it. Adding next quarter's rule means writing a new class, touching nothing else.",
        )}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 11. enums and wrappers -- */

export function InnerEnumPlay({ lang }: P) {
  const [tab, setTab] = useState(0);
  const [typed, setTyped] = useState(0);
  const accounts = ["Acme Corp", "Northwind Trading", "Globex", "Initech"];
  const [sel, setSel] = useState<boolean[]>([false, true, false, false]);
  const [applied, setApplied] = useState(false);

  return (
    <div className="w-full">
      <Tabs items={["Enum", "Wrapper"]} value={tab} onChange={setTab} />
      {tab === 0 ? (
        <>
          <div className="mb-3 flex flex-wrap gap-2">
            {["Tier.CRITICAL", "Tier.CRITCAL", "'CRITCAL' (String)"].map((x, n) => (
              <Chip key={x} on={typed === n} onClick={() => setTyped(n)}>
                {x}
              </Chip>
            ))}
          </div>
          <div className="rounded-[4px] px-3 py-2.5" style={codeBox} aria-live="polite">
            <p key={typed} className="diag-pop font-mono text-[12.5px]" style={{ color: typed === 1 ? "var(--c-danger)" : typed === 2 ? "var(--c-warn)" : "var(--c-text)" }}>
              {[
                pick(lang, "✓ Compila. slaHours = 4.", "✓ Compiles. slaHours = 4."),
                pick(lang, "✗ No compila: «Variable does not exist: CRITCAL». Te avisa el editor, hoy.", "✗ Does not compile: “Variable does not exist: CRITCAL”. The editor tells you, today."),
                pick(lang, "⚠ Compila… pero 'CRITCAL' == 'CRITICAL' es false: el caso crítico cae en el else y nadie se entera hasta producción.", "⚠ Compiles… but 'CRITCAL' == 'CRITICAL' is false: the critical case falls into the else and nobody notices until production."),
              ][typed]}
            </p>
          </div>
          <p className="t-small mt-3 text-muted">
            {pick(
              lang,
              "Un enum es una lista cerrada que vigila el compilador: una errata no llega nunca a ejecutarse. Un picklist restringido hace lo mismo con los datos; el enum, con el código.",
              "An enum is a closed list the compiler guards: a typo never gets to run. A restricted picklist does the same for data; the enum, for code.",
            )}
          </p>
        </>
      ) : (
        <>
          <p className="t-micro mb-2 font-semibold tracking-[0.06em] text-faint">List&lt;AccountPicker.Row&gt;</p>
          <ul className="space-y-1.5">
            {accounts.map((a, n) => (
              <li key={a}>
                <label className="flex min-h-[38px] cursor-pointer items-center gap-3 rounded-[4px] border px-3 py-1.5" style={{ borderColor: sel[n] ? "var(--c-brand)" : "var(--c-border)" }}>
                  <input
                    type="checkbox"
                    checked={sel[n]}
                    onChange={() => {
                      setSel((s) => s.map((v, k) => (k === n ? !v : v)));
                      setApplied(false);
                    }}
                  />
                  <code className="min-w-0 flex-1 font-mono text-[12.5px] text-ink">
                    row.record.Name = &apos;{a}&apos;
                  </code>
                  <span className="t-micro font-mono text-faint">row.selected = {String(sel[n])}</span>
                </label>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={() => setApplied(true)}>{pick(lang, "procesar las seleccionadas", "process the selected ones")}</Btn>
          </div>
          <p className="t-small mt-3 text-muted" aria-live="polite">
            {applied
              ? pick(lang, `Se procesan: ${accounts.filter((_, n) => sel[n]).join(", ") || "ninguna"}. `, `Processing: ${accounts.filter((_, n) => sel[n]).join(", ") || "none"}. `)
              : ""}
            {pick(
              lang,
              "Account no tiene un campo «seleccionado», y crearlo solo para una pantalla ensuciaría el modelo de datos. El wrapper junta el registro y la casilla en un objeto pequeño que solo vive en el código.",
              "Account has no “selected” field, and creating one just for a screen would clutter the data model. The wrapper bundles the record and the checkbox into a small object living only in code.",
            )}
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------ 12. which OOP tool? ----- */

export function OopChooserPlay({ lang }: P) {
  const all = [
    pick(lang, "Constructor", "Constructor"),
    "static",
    pick(lang, "private + un método", "private + a method"),
    pick(lang, "Herencia (extends)", "Inheritance (extends)"),
    "abstract",
    pick(lang, "Interfaz", "Interface"),
    "enum",
    pick(lang, "Wrapper (clase interna)", "Wrapper (inner class)"),
  ];
  const needs = [
    { need: pick(lang, "Que ningún plan de soporte pueda existir sin su fecha de inicio.", "No support plan may exist without its start date."), answer: all[0] },
    { need: pick(lang, "Un IVA que todo el motor calcule igual, sin crear objetos.", "A VAT the whole engine computes the same way, with no objects."), answer: all[1] },
    { need: pick(lang, "Que nadie pueda gastar más del presupuesto de la campaña.", "Nobody may spend beyond the campaign budget."), answer: all[2] },
    { need: pick(lang, "Un recordatorio que es un aviso más, con fecha de vencimiento.", "A reminder that is a notice plus a due date."), answer: all[3] },
    { need: pick(lang, "Descuentos que comparten etiqueta pero se aplican cada uno a su manera.", "Discounts sharing a label but each applying its own way."), answer: all[4] },
    { need: pick(lang, "Reglas de puntuación de clases distintas en una sola lista.", "Scoring rules from different classes in a single list."), answer: all[5] },
    { need: pick(lang, "Niveles de servicio que una errata no pueda romper.", "Service tiers a typo cannot break."), answer: all[6] },
    { need: pick(lang, "Una fila de pantalla con la cuenta y una casilla de selección.", "A screen row with the account and a selection checkbox."), answer: all[7] },
  ];
  return <ChooserGame lang={lang} all={all} needs={needs} />;
}
