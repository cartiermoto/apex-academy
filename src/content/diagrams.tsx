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
import { AllOrNonePlay, BulkPlay, DmlOpsPlay, LimitsPlay, RecipeOrderPlay, SavepointPlay } from "./diagrams-anim-m04";
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

/* The Module 4 diagrams are interactive now: see diagrams-anim-m04.tsx. */

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
  "m04-dml-ops": DmlOpsPlay,
  "m04-all-or-none": AllOrNonePlay,
  "m04-bulk": BulkPlay,
  "m04-limits": LimitsPlay,
  "m04-savepoint": SavepointPlay,
  "m04-cp-recipe": RecipeOrderPlay,
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
