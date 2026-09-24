"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { CollectionsPlay, MethodFlow, ShortCircuit } from "./diagrams-anim";
import {
  AggregatePlay,
  BindPlay,
  FilterFunnelPlay,
  QueryAnatomyPlay,
  QueryChooserPlay,
  RelationshipsPlay,
  SoqlLive,
  SoslPlay,
  SubqueryCost,
  SubqueryPlay,
} from "./diagrams-anim-m03";
import {
  BreakContinuePlay,
  ControlChooserPlay,
  ForEachPlay,
  IfChainPlay,
  NestedVsSetPlay,
  ScopePlay,
  SwitchPlay,
  WhilePlay,
} from "./diagrams-anim-m02";
import { GuardBypassPlay, LayerChooserPlay, ServiceDoorsPlay, ThinTriggerPlay, TwoTriggersPlay } from "./diagrams-anim-m07";
import { BeforeAfterPlay, ContextPlay, FlowToTriggerPlay, RecursionPlay, TriggerAnatomyPlay } from "./diagrams-anim-m06";
import {
  AbstractPlay,
  AccessPlay,
  ClassVsObjectPlay,
  ConstructorPlay,
  InheritancePlay,
  InnerEnumPlay,
  InterfacePlay,
  OopChooserPlay,
  OverloadOverridePlay,
  ReferencesPlay,
  StaticPlay,
  ThisPlay,
} from "./diagrams-anim-m05";
import {
  CastingPlay,
  CheckpointFlowPlay,
  DateTimePlay,
  FormulaVsApexPlay,
  MethodAnatomyPlay,
  ModuleOneDepsPlay,
  NullPlay,
  NumberTypesPlay,
  OperatorsPlay,
  SObjectPlay,
  VariableAnatomyPlay,
} from "./diagrams-anim-m01";

/**
 * Course diagrams.
 *
 * Every diagram is authored as inline SVG with a relative viewBox, so it scales
 * to the content column on desktop and to the phone width without cropping.
 * Colours come from the theme tokens, so each one is readable in light and dark
 * mode without a second drawing. Labels are bilingual: the component takes the
 * active language and picks the string.
 */

type P = { lang: Lang };
const pick = (lang: Lang, es: string, en: string) => (lang === "es" ? es : en);

/* ---------------------------------------------------------------- shared --- */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={`ar-${id}`}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill="var(--c-brand)" />
      </marker>
      <marker
        id={`ac-${id}`}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill="var(--c-warn)" />
      </marker>
      <marker
        id={`am-${id}`}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0 0 L10 5 L0 10 z" fill="var(--c-text-faint)" />
      </marker>
    </defs>
  );
}

const S = {
  box: {
    fill: "var(--c-surface-2)",
    stroke: "var(--c-border-strong)",
    strokeWidth: 1.5,
  },
  boxBrand: {
    fill: "var(--c-brand-soft)",
    stroke: "var(--c-brand)",
    strokeWidth: 1.5,
  },
  boxAccent: {
    fill: "var(--c-warn-soft)",
    stroke: "var(--c-warn)",
    strokeWidth: 1.5,
  },
  title: {
    fill: "var(--c-text)",
    fontSize: 17,
    fontWeight: 600,
    fontFamily: "var(--font-sans)",
  },
  label: {
    fill: "var(--c-text)",
    fontSize: 15,
    fontFamily: "var(--font-sans)",
  },
  muted: {
    fill: "var(--c-text-muted)",
    fontSize: 13.5,
    fontFamily: "var(--font-sans)",
  },
  mono: {
    fill: "var(--c-code-text)",
    fontSize: 16,
    fontFamily: "var(--font-mono)",
  },
  monoSmall: {
    fill: "var(--c-code-text)",
    fontSize: 14,
    fontFamily: "var(--font-mono)",
  },
  eyebrow: {
    fill: "var(--c-text-faint)",
    fontSize: 12,
    letterSpacing: 1.2,
    fontFamily: "var(--font-sans)",
  },
} as const;

function Svg({
  id,
  viewBox,
  children,
  title,
}: {
  id: string;
  viewBox: string;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={title}
      /* Sizing lives in CSS, not in the width/height attributes: the attribute
         form only accepts lengths, and "auto" there is an invalid value. */
      style={{ display: "block", width: "100%", height: "auto", maxWidth: "100%" }}
    >
      <title>{title}</title>
      <Defs id={id} />
      {children}
    </svg>
  );
}

/* ============================================================ MODULE 2 ==== */

/* The Module 2 diagrams are step-by-step now: see diagrams-anim-m02.tsx. */

/* ============================================================ MODULE 5 ==== */

/* shared: a small labelled box */
function Tag({
  x,
  y,
  w,
  h = 40,
  text,
  sub,
  kind = "box",
  mono = false,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  text: string;
  sub?: string;
  kind?: "box" | "brand" | "accent";
  mono?: boolean;
}) {
  const style = kind === "brand" ? S.boxBrand : kind === "accent" ? S.boxAccent : S.box;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" {...style} />
      <text
        x={x + 12}
        y={y + (sub ? h / 2 - 2 : h / 2 + 5)}
        {...(mono ? S.monoSmall : S.label)}
        fontSize={mono ? 13 : 13.5}
      >
        {text}
      </text>
      {sub && (
        <text x={x + 12} y={y + h / 2 + 15} {...S.muted} fontSize={11.5}>
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ d, id, tone = "brand" }: { d: string; id: string; tone?: "brand" | "muted" | "accent" }) {
  const stroke = tone === "brand" ? "var(--c-brand)" : tone === "accent" ? "var(--c-warn)" : "var(--c-text-faint)";
  const m = tone === "brand" ? "ar" : tone === "accent" ? "ac" : "am";
  return <path d={d} stroke={stroke} strokeWidth="1.5" markerEnd={`url(#${m}-${id})`} fill="none" />;
}

/* The Module 5 diagrams are interactive now: see diagrams-anim-m05.tsx. */

/* ============================================================ MODULE 3 ==== */

/* The Module 3 diagrams are interactive now: see diagrams-anim-m03.tsx. */

/* ============================================================ MODULE 4 ==== */

/* ---------------------------------------------------- m04 · dml ops ------ */

function DmlOps({ lang }: P) {
  const id = "dmlops";
  const rows: Array<[string, string, string]> = [
    ["Insert", "insert records;", pick(lang, "sin Id: te lo da", "no Id: it gives you one")],
    ["Update", "update records;", pick(lang, "el Id, obligatorio", "the Id, mandatory")],
    ["Upsert", "upsert records ExtId__c;", pick(lang, "un campo External ID", "an External ID field")],
    ["Delete", "delete records;", pick(lang, "el Id · a la Papelera", "the Id · to the Bin")],
  ];
  return (
    <Svg id={id} viewBox="0 0 600 250" title={pick(lang, "Operaciones DML", "DML operations")}>
      <text x="0" y="16" {...S.eyebrow}>DATA LOADER</text>
      <text x="162" y="16" {...S.eyebrow}>APEX</text>
      <text x="424" y="16" {...S.eyebrow}>{pick(lang, "NECESITA", "NEEDS")}</text>
      {rows.map(([op, code, need], i) => {
        const y = 28 + i * 54;
        return (
          <g key={op}>
            <Tag x={0} y={y} w={130} text={op} />
            <Arrow d={`M134 ${y + 20} L156 ${y + 20}`} id={id} tone="muted" />
            <Tag x={162} y={y} w={230} text={code} kind="brand" mono />
            <Arrow d={`M396 ${y + 20} L418 ${y + 20}`} id={id} tone="muted" />
            <Tag x={424} y={y} w={176} text={need} />
          </g>
        );
      })}
    </Svg>
  );
}

/* ------------------------------------------------- m04 · all or none ----- */

function AllOrNone({ lang }: P) {
  const id = "aon";
  const cells = (y: number, keepBad: boolean) =>
    [0, 1, 2, 3, 4].map((i) => {
      const bad = i === 2;
      const style = bad ? S.boxAccent : keepBad ? S.boxBrand : S.box;
      return (
        <g key={`${y}-${i}`}>
          <rect x={i * 50} y={y} width="42" height="42" rx="6" {...style} />
          <text x={i * 50 + 21} y={y + 26} {...S.label} fontSize={12.5} textAnchor="middle">
            {bad ? "✗" : `R${i + 1}`}
          </text>
        </g>
      );
    });
  return (
    <Svg id={id} viewBox="0 0 600 236" title={pick(lang, "Todo o nada frente a parcial", "All or nothing versus partial")}>
      <text x="0" y="16" {...S.eyebrow}>insert records;</text>
      {cells(26, false)}
      <Arrow d="M252 47 L298 47" id={id} tone="accent" />
      <Tag
        x={304}
        y={24}
        w={296}
        h={48}
        kind="accent"
        text={pick(lang, "0 guardados", "0 saved")}
        sub={pick(lang, "DmlException: se deshace todo", "DmlException: everything undone")}
      />

      <text x="0" y="124" {...S.eyebrow}>Database.insert(records, false)</text>
      {cells(134, true)}
      <Arrow d="M252 155 L298 155" id={id} />
      <Tag
        x={304}
        y={132}
        w={296}
        h={48}
        kind="brand"
        text={pick(lang, "4 guardados · 1 error", "4 saved · 1 error")}
        sub={pick(lang, "el motivo, en su SaveResult", "the reason, in its SaveResult")}
      />
      <text x="0" y="226" {...S.muted} fontSize={12.5}>
        {pick(lang, "Como Data Loader: success.csv y error.csv.", "Like Data Loader: success.csv and error.csv.")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------------------ m04 · bulk ------- */

function BulkCompare({ lang }: P) {
  const id = "bulk";
  const left = [
    pick(lang, "registro 1 → SELECT + update", "record 1 → SELECT + update"),
    pick(lang, "registro 2 → SELECT + update", "record 2 → SELECT + update"),
    "…",
    pick(lang, "registro 200 → SELECT + update", "record 200 → SELECT + update"),
  ];
  const right = [
    pick(lang, "1 · Juntar Ids en un Set", "1 · Gather Ids in a Set"),
    pick(lang, "2 · Una consulta con IN", "2 · One query with IN"),
    pick(lang, "3 · Trabajar en memoria", "3 · Work in memory"),
    pick(lang, "4 · Un solo update", "4 · A single update"),
  ];
  return (
    <Svg id={id} viewBox="0 0 600 300" title={pick(lang, "Sin bulkificar y bulkificado", "Unbulkified and bulkified")}>
      <text x="0" y="16" {...S.eyebrow}>{pick(lang, "DENTRO DEL BUCLE", "INSIDE THE LOOP")}</text>
      <text x="320" y="16" {...S.eyebrow}>{pick(lang, "LA RECETA", "THE RECIPE")}</text>
      {left.map((t, i) => (
        <Tag key={i} x={0} y={28 + i * 52} w={280} text={t} kind={i === 3 ? "accent" : "box"} />
      ))}
      {right.map((t, i) => (
        <g key={t}>
          <Tag x={320} y={28 + i * 52} w={280} text={t} kind="brand" />
          {i < 3 && <Arrow d={`M460 ${70 + i * 52} L460 ${78 + i * 52}`} id={id} />}
        </g>
      ))}
      <text x="0" y="262" {...S.label} fontSize={13}>
        {pick(lang, "200 consultas + 200 DML", "200 queries + 200 DML")}
      </text>
      <text x="0" y="282" {...S.muted} fontSize={12}>
        {pick(lang, "muere en la consulta 101", "dies on query 101")}
      </text>
      <text x="320" y="262" {...S.label} fontSize={13}>
        {pick(lang, "1 consulta + 1 DML", "1 query + 1 DML")}
      </text>
      <text x="320" y="282" {...S.muted} fontSize={12}>
        {pick(lang, "igual con 1 registro que con 200", "the same with 1 record or 200")}
      </text>
    </Svg>
  );
}

/* ---------------------------------------------------- m04 · limits ------- */

function LimitsGauges({ lang }: P) {
  const id = "lims";
  const rows: Array<[string, number, string]> = [
    [pick(lang, "Consultas SOQL", "SOQL queries"), 3 / 100, "3 / 100"],
    [pick(lang, "Filas leídas", "Rows read"), 1250 / 50000, pick(lang, "1.250 / 50.000", "1,250 / 50,000")],
    [pick(lang, "Instrucciones DML", "DML statements"), 2 / 150, "2 / 150"],
    [pick(lang, "Filas escritas", "Rows written"), 400 / 10000, pick(lang, "400 / 10.000", "400 / 10,000")],
    [pick(lang, "CPU (ms)", "CPU (ms)"), 8600 / 10000, pick(lang, "8.600 / 10.000", "8,600 / 10,000")],
    [pick(lang, "Memoria (heap)", "Memory (heap)"), 0.9 / 6, "0,9 / 6 MB"],
  ];
  const x0 = 160;
  const w = 318;
  return (
    <Svg id={id} viewBox="0 0 600 262" title={pick(lang, "Consumo de límites", "Limit usage")}>
      <text x="0" y="14" {...S.eyebrow}>LIMIT_USAGE_FOR_NS</text>
      {rows.map(([label, ratio, value], i) => {
        const y = 30 + i * 38;
        const hot = ratio >= 0.8;
        return (
          <g key={label}>
            <text x="0" y={y + 17} {...S.label} fontSize={13}>
              {label}
            </text>
            <rect x={x0} y={y} width={w} height="24" rx="6" fill="var(--c-surface-2)" stroke="var(--c-border-strong)" />
            <rect
              x={x0}
              y={y}
              width={Math.max(8, w * ratio)}
              height="24"
              rx="6"
              fill={hot ? "var(--c-warn-soft)" : "var(--c-brand-soft)"}
              stroke={hot ? "var(--c-warn)" : "var(--c-brand)"}
            />
            <text x="600" y={y + 17} {...S.muted} fontSize={11.5} textAnchor="end">
              {value}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

/* -------------------------------------------------- m04 · savepoint ------ */

function SavepointTimeline({ lang }: P) {
  const id = "spt";
  const items = [
    { t: pick(lang, "insert Uno", "insert One"), s: pick(lang, "se queda", "stays"), kind: "box" as const, mono: true },
    { t: pick(lang, "marca", "mark"), s: "setSavepoint()", kind: "brand" as const, mono: false },
    { t: pick(lang, "insert Dos", "insert Two"), s: pick(lang, "se deshace", "is undone"), kind: "accent" as const, mono: true },
    { t: "rollback(sp)", s: pick(lang, "vuelve a la marca", "back to the mark"), kind: "brand" as const, mono: true },
    { t: pick(lang, "insert Tres", "insert Three"), s: pick(lang, "se guarda", "is saved"), kind: "box" as const, mono: true },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 180" title={pick(lang, "Savepoint y rollback", "Savepoint and rollback")}>
      <line x1="0" y1="112" x2="600" y2="112" stroke="var(--c-border-strong)" strokeWidth="1.5" />
      {items.map((it, i) => (
        <Tag key={i} x={i * 122} y={88} w={112} h={48} text={it.t} sub={it.s} kind={it.kind} mono={it.mono} />
      ))}
      <Arrow d="M422 84 C 422 30, 178 30, 178 82" id={id} tone="accent" />
      <text x="300" y="14" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "Database.rollback(sp) vuelve aquí", "Database.rollback(sp) comes back here")}
      </text>
      <text x="0" y="170" {...S.muted} fontSize={12.5}>
        {pick(lang, "Resultado final en la base de datos: Uno y Tres.", "Final result in the database: One and Three.")}
      </text>
    </Svg>
  );
}

/* --------------------------------------------- m04 · checkpoint recipe --- */

function SafeDmlRecipe({ lang }: P) {
  const id = "recipe";
  const rows: Array<[string, string]> = [
    [pick(lang, "Juntar los Ids", "Gather the Ids"), "Set<Id> ids"],
    [pick(lang, "Consultar una vez", "Query once"), "WHERE Id IN :ids"],
    [pick(lang, "Decidir en memoria", "Decide in memory"), "Map · if · add()"],
    [pick(lang, "Guardar una vez", "Save once"), "update records;"],
    [pick(lang, "Revisar resultados", "Check results"), "SaveResult · rollback"],
  ];
  return (
    <Svg id={id} viewBox="0 0 600 272" title={pick(lang, "Receta de DML seguro", "Safe DML recipe")}>
      {rows.map(([t, c], i) => {
        const y = i * 54;
        return (
          <g key={t}>
            <circle cx="18" cy={y + 20} r="16" fill="var(--c-brand)" />
            <text x="18" y={y + 25} fill="var(--c-surface)" fontSize={13} fontWeight={700} textAnchor="middle" fontFamily="var(--font-sans)">
              {i + 1}
            </text>
            <Tag x={44} y={y} w={300} text={t} />
            <Arrow d={`M348 ${y + 20} L374 ${y + 20}`} id={id} />
            <Tag x={380} y={y} w={220} text={c} kind="brand" mono />
          </g>
        );
      })}
    </Svg>
  );
}

/* ============================================================ MODULE 6 ==== */

/* The other Module 6 diagrams are interactive now: see diagrams-anim-m06.tsx. */

/* ------------------------------------ m06 · order of execution (animated) - */

/**
 * The one interactive diagram so far: a record travels through the save, one
 * step at a time. Plain HTML instead of SVG because it has real controls and
 * a live explanation. Motion is a CSS transition, so the global
 * prefers-reduced-motion rule turns it into an instant step change.
 */
function OrderOfExecution({ lang }: P) {
  const steps: Array<{ t: string; d: string; mine?: boolean }> = [
    {
      t: pick(lang, "Validación del sistema", "System validation"),
      d: pick(
        lang,
        "Campos obligatorios del formato de página, tipos, longitudes, listas de selección restringidas. Es el error rojo que sale antes que nada.",
        "Page-layout required fields, types, lengths, restricted picklists. It is the red error that shows up before anything else.",
      ),
    },
    {
      t: pick(lang, "Flows before-save", "Before-save flows"),
      d: pick(
        lang,
        "Los flows desencadenados por registro optimizados para «Fast Field Updates». Corren antes que tus triggers before.",
        "Record-triggered flows optimised for “Fast Field Updates”. They run before your before triggers.",
      ),
    },
    {
      t: pick(lang, "Triggers before", "Before triggers"),
      d: pick(
        lang,
        "Tu código. El registro todavía no está guardado: cambias campos de Trigger.new directamente y se guardan solos, sin DML.",
        "Your code. The record is not saved yet: you change fields on Trigger.new directly and they save by themselves, no DML.",
      ),
      mine: true,
    },
    {
      t: pick(lang, "Reglas de validación", "Validation rules"),
      d: pick(
        lang,
        "Tus validation rules. Ven los valores que acaba de poner el trigger before: por eso un trigger before puede rellenar un campo que una regla exige.",
        "Your validation rules. They see the values the before trigger just set: that is why a before trigger can fill in a field a rule requires.",
      ),
    },
    {
      t: pick(lang, "Reglas de duplicados", "Duplicate rules"),
      d: pick(lang, "Las duplicate rules de la org, con sus alertas o bloqueos.", "The org's duplicate rules, with their alerts or blocks."),
    },
    {
      t: pick(lang, "Se guarda (sin confirmar)", "Saved (not committed)"),
      d: pick(
        lang,
        "El registro ya tiene Id, pero nada es definitivo todavía: si algo falla más adelante, esto también se deshace.",
        "The record has an Id now, but nothing is final yet: if something fails later on, this is undone too.",
      ),
    },
    {
      t: pick(lang, "Triggers after", "After triggers"),
      d: pick(
        lang,
        "Tu código otra vez. Trigger.new ya es de solo lectura; aquí se crean o cambian OTROS registros, con DML.",
        "Your code again. Trigger.new is read-only now; this is where you create or change OTHER records, with DML.",
      ),
      mine: true,
    },
    {
      t: pick(lang, "Asignación y workflow", "Assignment and workflow"),
      d: pick(
        lang,
        "Reglas de asignación, de respuesta automática, de workflow y de escalado. Si una actualización de campo de workflow cambia algo, los triggers before y after de update vuelven a ejecutarse una vez más.",
        "Assignment, auto-response, workflow and escalation rules. If a workflow field update changes something, the before and after update triggers run one more time.",
      ),
    },
    {
      t: pick(lang, "Flows after-save", "After-save flows"),
      d: pick(
        lang,
        "Los flows desencadenados por registro optimizados para «Actions and Related Records».",
        "Record-triggered flows optimised for “Actions and Related Records”.",
      ),
    },
    {
      t: pick(lang, "Roll-ups en el padre", "Roll-ups on the parent"),
      d: pick(
        lang,
        "Se recalculan los campos de resumen acumulado. El padre pasa por su propio guardado, con su propio orden de ejecución.",
        "Roll-up summary fields are recalculated. The parent goes through its own save, with its own order of execution.",
      ),
    },
    {
      t: pick(lang, "Commit", "Commit"),
      d: pick(
        lang,
        "Todo se confirma a la vez. Si cualquier paso anterior lanzó un error sin tratar, no se guarda nada de esta transacción.",
        "Everything is committed at once. If any earlier step threw an unhandled error, nothing from this transaction is saved.",
      ),
    },
    {
      t: pick(lang, "Después del commit", "After commit"),
      d: pick(
        lang,
        "Envío de correos, Apex asíncrono (Módulo 9) y las rutas asíncronas de los flows.",
        "Email sends, asynchronous Apex (Module 9) and the flows' asynchronous paths.",
      ),
    },
  ];

  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    if (i >= last) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setI((n) => Math.min(n + 1, last)), 1500);
    return () => clearTimeout(timer);
  }, [playing, i, last]);

  const ROW = 44; // row height + gap, in px; the record marker moves by this
  const cur = steps[i];

  const play = () => {
    if (i >= last) setI(0);
    setPlaying(true);
  };

  return (
    <div className="w-full">
      <div className="relative pl-9">
        {/* the track and the travelling record */}
        <div
          aria-hidden
          className="absolute left-[13px] top-[10px] w-[2px] rounded-full"
          style={{ height: last * ROW + 18, background: "var(--c-border)" }}
        />
        <div
          aria-hidden
          className="absolute left-0 top-0 grid h-[38px] w-[28px] place-items-center"
          style={{
            transform: `translateY(${i * ROW}px)`,
            transition: "transform 0.45s cubic-bezier(.3,.7,.3,1)",
          }}
        >
          <span
            className="block h-[14px] w-[14px] rounded-full"
            style={{
              background: "var(--c-brand)",
              boxShadow: "0 0 0 5px var(--c-brand-soft)",
            }}
          />
        </div>

        <ol className="space-y-[6px]">
          {steps.map((s, n) => {
            const state = n === i ? "cur" : n < i ? "done" : "next";
            return (
              <li key={n} aria-current={state === "cur" ? "step" : undefined}>
                <button
                  type="button"
                  onClick={() => {
                    setPlaying(false);
                    setI(n);
                  }}
                  className="flex h-[38px] w-full items-center gap-2.5 rounded-[4px] border px-3 text-left transition-colors"
                  style={{
                    borderColor: state === "cur" ? "var(--c-brand)" : "var(--c-border)",
                    background: state === "cur" ? "var(--c-brand-soft)" : "transparent",
                    color: state === "next" ? "var(--c-text)" : state === "done" ? "var(--c-text-muted)" : "var(--c-heading)",
                  }}
                >
                  <span className="t-micro w-5 shrink-0 tabular-nums" style={{ color: "var(--c-text-faint)" }}>
                    {state === "done" ? "✓" : n + 1}
                  </span>
                  <span className="t-small min-w-0 flex-1 truncate" style={{ fontWeight: state === "cur" ? 600 : 400 }}>
                    {s.t}
                  </span>
                  {s.mine && (
                    <span
                      className="t-micro shrink-0 rounded-full px-2 py-0.5 font-semibold"
                      style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}
                    >
                      {pick(lang, "tu código", "your code")}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div
        className="mt-5 rounded-[4px] p-4"
        style={{ background: "var(--c-surface-2)" }}
        aria-live="polite"
      >
        <p className="t-micro text-faint tabular-nums">
          {pick(lang, "Paso", "Step")} {i + 1} {pick(lang, "de", "of")} {steps.length}
        </p>
        <p className="t-small mt-1 font-semibold text-ink">{cur.t}</p>
        <p className="t-small mt-1 text-muted">{cur.d}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {playing ? (
          <button type="button" className="btn btn-primary" onClick={() => setPlaying(false)}>
            {pick(lang, "❚❚ Pausa", "❚❚ Pause")}
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={play}>
            {i >= last ? pick(lang, "↻ Repetir", "↻ Replay") : pick(lang, "▶ Reproducir", "▶ Play")}
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          disabled={i === 0}
          onClick={() => {
            setPlaying(false);
            setI((n) => Math.max(0, n - 1));
          }}
        >
          {pick(lang, "← Anterior", "← Back")}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={i === last}
          onClick={() => {
            setPlaying(false);
            setI((n) => Math.min(last, n + 1));
          }}
        >
          {pick(lang, "Siguiente →", "Next →")}
        </button>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- registry -- */

const REGISTRY: Record<string, (p: P) => React.ReactElement> = {
  "m01-variable-anatomy": VariableAnatomyPlay,
  "m01-number-types": NumberTypesPlay,
  "m01-method-anatomy": MethodAnatomyPlay,
  "m01-method-chain": MethodFlow,
  "m01-datetime": DateTimePlay,
  "m01-sobject": SObjectPlay,
  "m01-null": NullPlay,
  "m01-operators": OperatorsPlay,
  "m01-short-circuit": ShortCircuit,
  "m01-collections": CollectionsPlay,
  "m01-casting": CastingPlay,
  "m01-cp-flow": CheckpointFlowPlay,
  "m01-cp-formula-vs-apex": FormulaVsApexPlay,
  "m01-cp-deps": ModuleOneDepsPlay,
  "m02-if-chain": IfChainPlay,
  "m02-switch": SwitchPlay,
  "m02-scope": ScopePlay,
  "m02-while": WhilePlay,
  "m02-for-each": ForEachPlay,
  "m02-break-continue": BreakContinuePlay,
  "m02-nested-vs-lookup": NestedVsSetPlay,
  "m02-cp-choose": ControlChooserPlay,
  "m03-anatomy": QueryAnatomyPlay,
  "m03-soql-live": SoqlLive,
  "m03-subquery": SubqueryPlay,
  "m03-subquery-cost": SubqueryCost,
  "m03-filter-funnel": FilterFunnelPlay,
  "m03-relationships": RelationshipsPlay,
  "m03-bind": BindPlay,
  "m03-aggregate": AggregatePlay,
  "m03-sosl": SoslPlay,
  "m03-cp-choose": QueryChooserPlay,
  "m07-two-triggers": TwoTriggersPlay,
  "m07-thin-trigger": ThinTriggerPlay,
  "m07-service-doors": ServiceDoorsPlay,
  "m07-guard-bypass": GuardBypassPlay,
  "m07-architecture": LayerChooserPlay,
  "m04-dml-ops": DmlOps,
  "m04-all-or-none": AllOrNone,
  "m04-bulk": BulkCompare,
  "m04-limits": LimitsGauges,
  "m04-savepoint": SavepointTimeline,
  "m04-cp-recipe": SafeDmlRecipe,
  "m06-anatomy": TriggerAnatomyPlay,
  "m06-before-after": BeforeAfterPlay,
  "m06-order": OrderOfExecution,
  "m06-recursion": RecursionPlay,
  "m06-cp-map": FlowToTriggerPlay,
  "m06-old-new": ContextPlay,
  "m05-class-vs-object": ClassVsObjectPlay,
  "m05-references": ReferencesPlay,
  "m05-constructor": ConstructorPlay,
  "m05-this": ThisPlay,
  "m05-static": StaticPlay,
  "m05-access": AccessPlay,
  "m05-inheritance": InheritancePlay,
  "m05-abstract": AbstractPlay,
  "m05-overload-override": OverloadOverridePlay,
  "m05-interface": InterfacePlay,
  "m05-inner-enum": InnerEnumPlay,
  "m05-cp-map": OopChooserPlay,
};

export function Diagram({ id, lang }: { id: string; lang: Lang }) {
  const Component = REGISTRY[id];
  if (!Component) {
    return (
      <div className="card t-micro my-6 p-4 text-faint">Diagram “{id}” not found.</div>
    );
  }
  return <Component lang={lang} />;
}
