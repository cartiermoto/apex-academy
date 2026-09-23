"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/types";
import { CollectionsPlay, MethodFlow, ShortCircuit } from "./diagrams-anim";
import { QueryAnatomyPlay, SoqlLive, SubqueryCost, SubqueryPlay } from "./diagrams-anim-m03";
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

/* ------------------------------------------------ m05 · class vs object --- */

function ClassVsObject({ lang }: P) {
  const id = "cvo";
  const recs = [
    { s: pick(lang, "Migración de datos", "Data migration"), h: "6", b: "true" },
    { s: pick(lang, "Formación interna", "Internal training"), h: "3", b: "false" },
    { s: pick(lang, "Configurar CPQ", "CPQ setup"), h: "8", b: "true" },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 290" title={pick(lang, "Clase e instancias", "Class and instances")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "LA CLASE · EL MOLDE", "THE CLASS · THE MOULD")}
      </text>
      <rect x="0" y="26" width="220" height="164" rx="10" {...S.boxBrand} />
      <text x="14" y="52" {...S.monoSmall} fontWeight={600}>
        ServiceTicket
      </text>
      <line x1="0" y1="62" x2="220" y2="62" stroke="var(--c-brand)" strokeWidth="1" />
      <text x="14" y="86" {...S.monoSmall} fontSize={13}>String subject</text>
      <text x="14" y="108" {...S.monoSmall} fontSize={13}>Decimal hoursSpent</text>
      <text x="14" y="130" {...S.monoSmall} fontSize={13}>Boolean isBillable</text>
      <line x1="0" y1="142" x2="220" y2="142" stroke="var(--c-brand)" strokeWidth="1" />
      <text x="14" y="170" {...S.monoSmall} fontSize={13}>cost(rate)</text>
      <text x="0" y="214" {...S.muted} fontSize={12}>
        {pick(lang, "= la definición en Object Manager", "= the definition in Object Manager")}
      </text>

      <text x="300" y="16" {...S.eyebrow}>
        {pick(lang, "INSTANCIAS · LOS REGISTROS", "INSTANCES · THE RECORDS")}
      </text>
      {recs.map((r, i) => {
        const y = 26 + i * 60;
        return (
          <g key={i}>
            <Arrow d={`M226 ${100} C 262 100, 262 ${y + 24}, 294 ${y + 24}`} id={id} tone="muted" />
            <rect x="300" y={y} width="300" height="50" rx="8" {...S.box} />
            <text x="314" y={y + 21} {...S.label} fontSize={13}>
              {r.s}
            </text>
            <text x="314" y={y + 40} {...S.muted} fontSize={11.5}>
              hoursSpent = {r.h} · isBillable = {r.b}
            </text>
          </g>
        );
      })}
      <text x="300" y="214" {...S.muted} fontSize={12}>
        {pick(lang, "cada new fabrica uno, con sus propios valores", "each new makes one, with its own values")}
      </text>
      <text x="0" y="262" {...S.label} fontSize={13}>
        {pick(
          lang,
          "Mismos campos y acciones para todos · valores distintos en cada uno",
          "Same fields and actions for all · different values in each",
        )}
      </text>
    </Svg>
  );
}

/* ---------------------------------------------------- m05 · references ---- */

function ReferencesMap({ lang }: P) {
  const id = "refs";
  return (
    <Svg id={id} viewBox="0 0 600 270" title={pick(lang, "Referencias", "References")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "VARIABLES", "VARIABLES")}
      </text>
      <text x="360" y="16" {...S.eyebrow}>
        {pick(lang, "OBJETOS (UNO POR CADA new)", "OBJECTS (ONE PER new)")}
      </text>
      <Tag x={0} y={30} w={220} text="opp1" mono />
      <Tag x={0} y={82} w={220} text="opp2 = opp1" mono />
      <Tag x={0} y={170} w={220} text="renewal = opp1.clone()" mono />
      <Arrow d="M224 50 L352 72" id={id} />
      <Arrow d="M224 102 L352 84" id={id} />
      <Arrow d="M224 190 L352 190" id={id} tone="accent" />
      <Tag
        x={358}
        y={50}
        w={242}
        h={56}
        kind="brand"
        text="Opportunity · Acme"
        sub={pick(lang, "StageName = 'Closed Won'", "StageName = 'Closed Won'")}
      />
      <Tag
        x={358}
        y={162}
        w={242}
        h={56}
        kind="accent"
        text={pick(lang, "Opportunity · copia", "Opportunity · copy")}
        sub={pick(lang, "independiente del original", "independent of the original")}
      />
      <text x="0" y="252" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "opp1 y opp2 son dos pestañas del mismo registro. clone() fabrica un segundo registro.",
          "opp1 and opp2 are two tabs of the same record. clone() makes a second record.",
        )}
      </text>
    </Svg>
  );
}

/* --------------------------------------------------- m05 · constructor ---- */

function ConstructorFlow({ lang }: P) {
  const id = "ctor";
  const steps = [
    { t: "new SupportPlan('Gold')", s: pick(lang, "1 · se reserva un objeto vacío", "1 · an empty object is reserved"), k: "box" as const },
    { t: "SupportPlan(String planLevel) { … }", s: pick(lang, "2 · el constructor lo rellena", "2 · the constructor fills it in"), k: "brand" as const },
    { t: "SupportPlan plan = …", s: pick(lang, "3 · la variable recibe el enlace", "3 · the variable gets the link"), k: "box" as const },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 260" title={pick(lang, "Qué pasa al hacer new", "What happens on new")}>
      {steps.map((st, i) => {
        const y = 6 + i * 84;
        return (
          <g key={i}>
            <Tag x={0} y={y} w={340} h={56} kind={st.k} text={st.t} sub={st.s} mono />
            {i < 2 && <Arrow d={`M170 ${y + 60} L170 ${y + 80}`} id={id} tone="muted" />}
          </g>
        );
      })}
      <rect x="370" y="90" width="230" height="112" rx="10" {...S.box} />
      <text x="384" y="114" {...S.eyebrow}>
        {pick(lang, "EL OBJETO, YA LISTO", "THE OBJECT, READY")}
      </text>
      <text x="384" y="138" {...S.monoSmall} fontSize={12.5}>level = 'Gold'</text>
      <text x="384" y="158" {...S.monoSmall} fontSize={12.5}>startDate = today</text>
      <text x="384" y="178" {...S.monoSmall} fontSize={12.5}>contacts = ( )</text>
      <text x="384" y="196" {...S.muted} fontSize={11}>
        {pick(lang, "ningún campo en null", "no field left null")}
      </text>
      <Arrow d="M344 118 L366 130" id={id} />
    </Svg>
  );
}

/* ---------------------------------------------------------- m05 · this ---- */

function ThisShadow({ lang }: P) {
  const id = "this";
  return (
    <Svg id={id} viewBox="0 0 600 250" title={pick(lang, "this frente al parámetro", "this versus the parameter")}>
      <rect x="0" y="0" width="600" height="200" rx="12" {...S.box} />
      <text x="16" y="26" {...S.monoSmall}>
        public class SupportPlan {"{"}
      </text>
      <text x="40" y="52" {...S.monoSmall}>
        public String <tspan fill="var(--c-brand)" fontWeight={700}>level</tspan>;
      </text>
      <text x="300" y="52" {...S.muted} fontSize={12}>
        {pick(lang, "← el atributo (this.level)", "← the attribute (this.level)")}
      </text>
      <rect x="28" y="66" width="548" height="112" rx="10" {...S.boxBrand} />
      <text x="44" y="92" {...S.monoSmall}>
        public SupportPlan(String <tspan fill="var(--c-warn)" fontWeight={700}>level</tspan>) {"{"}
      </text>
      <text x="400" y="92" {...S.muted} fontSize={12}>
        {pick(lang, "← el parámetro", "← the parameter")}
      </text>
      <text x="68" y="120" {...S.monoSmall}>
        level = level;
      </text>
      <text x="260" y="120" {...S.muted} fontSize={12} fill="var(--c-warn)">
        ✗ {pick(lang, "parámetro = parámetro", "parameter = parameter")}
      </text>
      <text x="68" y="146" {...S.monoSmall}>
        this.level = level;
      </text>
      <text x="260" y="146" {...S.muted} fontSize={12} fill="var(--c-brand)">
        ✓ {pick(lang, "atributo = parámetro", "attribute = parameter")}
      </text>
      <text x="44" y="170" {...S.monoSmall}>
        {"}"}
      </text>
      <text x="0" y="234" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "Dentro del constructor, el nombre más cercano gana. this llega al de fuera.",
          "Inside the constructor, the nearest name wins. this reaches the outer one.",
        )}
      </text>
    </Svg>
  );
}

/* -------------------------------------------------------- m05 · static ---- */

function StaticShared({ lang }: P) {
  const id = "stat";
  return (
    <Svg id={id} viewBox="0 0 600 260" title={pick(lang, "Estático frente a instancia", "Static versus instance")}>
      <rect x="150" y="0" width="300" height="74" rx="10" {...S.boxAccent} />
      <text x="166" y="24" {...S.eyebrow}>
        {pick(lang, "LA CLASE · UNA SOLA VEZ", "THE CLASS · ONCE ONLY")}
      </text>
      <text x="166" y="46" {...S.monoSmall} fontSize={12.5}>static final Decimal VAT_RATE = 0.21</text>
      <text x="166" y="64" {...S.monoSmall} fontSize={12.5}>static Decimal withVat(amount)</text>
      {[0, 1, 2].map((i) => {
        const x = i * 205;
        return (
          <g key={i}>
            <Arrow d={`M${300} 78 L${x + 95} 128`} id={id} tone="accent" />
            <rect x={x} y="132" width="190" height="72" rx="8" {...S.box} />
            <text x={x + 12} y="154" {...S.eyebrow}>
              {pick(lang, "INSTANCIA", "INSTANCE")} {i + 1}
            </text>
            <text x={x + 12} y="178" {...S.monoSmall} fontSize={12.5}>
              amount = {["100", "250", "900"][i]}
            </text>
            <text x={x + 12} y="196" {...S.muted} fontSize={11}>
              {pick(lang, "solo suyo", "its own")}
            </text>
          </g>
        );
      })}
      <text x="0" y="232" {...S.muted} fontSize={12.5}>
        {pick(lang, "Lo estático es como un Custom Setting: un valor para todos.", "Static is like a Custom Setting: one value for all.")}
      </text>
      <text x="0" y="252" {...S.muted} fontSize={12.5}>
        {pick(lang, "Lo de instancia, un campo en cada registro.", "Instance data is a field on each record.")}
      </text>
    </Svg>
  );
}

/* -------------------------------------------------------- m05 · access ---- */

function AccessRings({ lang }: P) {
  const id = "acc";
  const rings = [
    { r: 120, label: "global", sub: pick(lang, "también fuera de la org", "outside the org too") },
    { r: 92, label: "public", sub: pick(lang, "todo el código de la org", "all code in the org") },
    { r: 64, label: "protected", sub: pick(lang, "la clase y sus hijas", "the class and its children") },
    { r: 36, label: "private", sub: pick(lang, "solo la clase", "only the class") },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 260" title={pick(lang, "Niveles de acceso", "Access levels")}>
      {rings.map((g, i) => (
        <circle
          key={g.label}
          cx="130"
          cy="128"
          r={g.r}
          fill={i === 3 ? "var(--c-brand-soft)" : "none"}
          stroke={i === 3 ? "var(--c-brand)" : "var(--c-border-strong)"}
          strokeWidth="1.4"
        />
      ))}
      {rings.map((g, i) => (
        <g key={`t-${g.label}`}>
          <line
            x1={130 + g.r * 0.72}
            y1={128 - g.r * 0.69}
            x2="290"
            y2={30 + i * 56}
            stroke="var(--c-text-faint)"
            strokeWidth="1"
          />
          <text x="300" y={34 + i * 56} {...S.monoSmall} fontSize={14} fontWeight={600}>
            {g.label}
          </text>
          <text x="300" y={52 + i * 56} {...S.muted} fontSize={12}>
            {g.sub}
          </text>
        </g>
      ))}
      <text x="300" y="250" {...S.muted} fontSize={12}>
        {pick(lang, "Sin modificador = private", "No modifier = private")}
      </text>
    </Svg>
  );
}

/* --------------------------------------------------- m05 · inheritance ---- */

function InheritanceTree({ lang }: P) {
  const id = "inh";
  return (
    <Svg id={id} viewBox="0 0 600 270" title={pick(lang, "Herencia", "Inheritance")}>
      <rect x="150" y="0" width="300" height="96" rx="10" {...S.boxBrand} />
      <text x="166" y="24" {...S.monoSmall} fontWeight={600}>
        virtual class Notification
      </text>
      <text x="166" y="48" {...S.monoSmall} fontSize={12.5}>protected String recipient</text>
      <text x="166" y="68" {...S.monoSmall} fontSize={12.5}>public String subject</text>
      <text x="166" y="88" {...S.monoSmall} fontSize={12.5}>preview()</text>
      <Arrow d="M220 100 L130 150" id={id} />
      <Arrow d="M380 100 L470 150" id={id} />
      <text x="300" y="130" {...S.muted} fontSize={12} textAnchor="middle">
        extends
      </text>
      <rect x="0" y="156" width="260" height="76" rx="10" {...S.box} />
      <text x="14" y="180" {...S.monoSmall} fontWeight={600}>TaskReminder</text>
      <text x="14" y="202" {...S.monoSmall} fontSize={12.5}>+ Date dueDate</text>
      <text x="14" y="222" {...S.monoSmall} fontSize={12.5}>+ isOverdue()</text>
      <rect x="340" y="156" width="260" height="76" rx="10" {...S.box} />
      <text x="354" y="180" {...S.monoSmall} fontWeight={600}>SmsNotification</text>
      <text x="354" y="202" {...S.monoSmall} fontSize={12.5}>+ String phone</text>
      <text x="354" y="222" {...S.muted} fontSize={11.5}>
        {pick(lang, "hereda recipient, subject, preview()", "inherits recipient, subject, preview()")}
      </text>
      <text x="0" y="260" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "Como los campos estándar: todo objeto los trae, tú solo añades lo que lo hace distinto.",
          "Like standard fields: every object has them, you only add what makes it different.",
        )}
      </text>
    </Svg>
  );
}

/* ------------------------------------------------------ m05 · abstract ---- */

function AbstractActivity({ lang }: P) {
  const id = "abs";
  return (
    <Svg id={id} viewBox="0 0 600 280" title={pick(lang, "Clase abstracta", "Abstract class")}>
      <text x="0" y="14" {...S.eyebrow}>
        {pick(lang, "EN SALESFORCE", "IN SALESFORCE")}
      </text>
      <rect x="0" y="24" width="250" height="44" rx="8" fill="none" stroke="var(--c-border-strong)" strokeWidth="1.4" strokeDasharray="5 4" />
      <text x="14" y="51" {...S.label} fontSize={13.5}>
        Activity <tspan {...S.muted} fontSize={11.5}>{pick(lang, "(nunca se crea sola)", "(never created alone)")}</tspan>
      </text>
      <Arrow d="M70 72 L50 102" id={id} tone="muted" />
      <Arrow d="M180 72 L200 102" id={id} tone="muted" />
      <Tag x={0} y={106} w={110} text="Task" />
      <Tag x={140} y={106} w={110} text="Event" />

      <text x="300" y="14" {...S.eyebrow}>
        {pick(lang, "EN APEX", "IN APEX")}
      </text>
      <rect x="300" y="24" width="300" height="70" rx="8" fill="var(--c-surface-2)" stroke="var(--c-brand)" strokeWidth="1.4" strokeDasharray="5 4" />
      <text x="314" y="46" {...S.monoSmall} fontSize={13}>abstract class Discount</text>
      <text x="314" y="66" {...S.monoSmall} fontSize={12}>abstract apply(amount);</text>
      <text x="314" y="84" {...S.monoSmall} fontSize={12}>virtual describe() {"{ … }"}</text>
      <Arrow d="M370 98 L350 128" id={id} />
      <Arrow d="M530 98 L550 128" id={id} />
      <Tag x={300} y={132} w={140} h={52} kind="brand" text="PercentDiscount" sub="override apply" mono />
      <Tag x={460} y={132} w={140} h={52} kind="brand" text="FixedDiscount" sub="override apply" mono />
      <text x="300" y="214" {...S.muted} fontSize={12.5}>
        {pick(lang, "new Discount() no compila;", "new Discount() does not compile;")}
      </text>
      <text x="300" y="232" {...S.muted} fontSize={12.5}>
        {pick(lang, "new PercentDiscount(…) sí.", "new PercentDiscount(…) does.")}
      </text>
      <text x="0" y="214" {...S.muted} fontSize={12.5}>
        {pick(lang, "Lo común vive arriba;", "What is shared lives above;")}
      </text>
      <text x="0" y="232" {...S.muted} fontSize={12.5}>
        {pick(lang, "cada hija concreta el resto.", "each child makes the rest concrete.")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------ m05 · overload vs override ---- */

function OverloadOverride({ lang }: P) {
  const id = "ovl";
  return (
    <Svg id={id} viewBox="0 0 600 260" title={pick(lang, "Sobrecarga y sobrescritura", "Overloading and overriding")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "SOBRECARGA · UNA AL LADO DE OTRA", "OVERLOADING · SIDE BY SIDE")}
      </text>
      <rect x="0" y="26" width="270" height="150" rx="10" {...S.box} />
      <text x="14" y="50" {...S.monoSmall} fontWeight={600}>MoneyFormatter</text>
      <Tag x={14} y={62} w={242} h={46} kind="brand" text="format(amount)" mono />
      <Tag x={14} y={116} w={242} h={46} kind="brand" text="format(amount, code)" mono />
      <text x="0" y="200" {...S.muted} fontSize={12}>
        {pick(lang, "misma clase · distintos parámetros", "same class · different parameters")}
      </text>
      <text x="0" y="218" {...S.muted} fontSize={12}>
        {pick(lang, "se elige al compilar", "chosen at compile time")}
      </text>

      <text x="320" y="16" {...S.eyebrow}>
        {pick(lang, "SOBRESCRITURA · UNA ENCIMA DE OTRA", "OVERRIDING · ONE OVER ANOTHER")}
      </text>
      <Tag x={320} y={26} w={280} h={52} text="Report" sub="virtual title()" mono />
      <Arrow d="M460 82 L460 110" id={id} />
      <Tag x={320} y={114} w={280} h={52} kind="brand" text="SalesReport" sub="override title()" mono />
      <text x="320" y="200" {...S.muted} fontSize={12}>
        {pick(lang, "padre e hija · mismos parámetros", "parent and child · same parameters")}
      </text>
      <text x="320" y="218" {...S.muted} fontSize={12}>
        {pick(lang, "se elige al ejecutar, por el objeto real", "chosen at runtime, by the real object")}
      </text>
    </Svg>
  );
}

/* ----------------------------------------------------- m05 · interface ---- */

function InterfaceContract({ lang }: P) {
  const id = "intf";
  return (
    <Svg id={id} viewBox="0 0 600 270" title={pick(lang, "Interfaz y polimorfismo", "Interface and polymorphism")}>
      <rect x="0" y="0" width="230" height="110" rx="10" {...S.box} />
      <text x="14" y="26" {...S.eyebrow}>
        {pick(lang, "EL BUCLE", "THE LOOP")}
      </text>
      <text x="14" y="52" {...S.monoSmall} fontSize={12.5}>for (LeadScoringRule r</text>
      <text x="44" y="72" {...S.monoSmall} fontSize={12.5}>: rules) {"{"}</text>
      <text x="28" y="92" {...S.monoSmall} fontSize={12.5}>total += r.score(l);</text>
      <Arrow d="M234 55 L286 55" id={id} />
      <rect x="290" y="20" width="310" height="70" rx="10" fill="var(--c-surface-2)" stroke="var(--c-brand)" strokeWidth="1.5" strokeDasharray="6 4" />
      <text x="306" y="44" {...S.eyebrow}>
        {pick(lang, "EL CONTRATO", "THE CONTRACT")}
      </text>
      <text x="306" y="70" {...S.monoSmall} fontSize={13}>interface LeadScoringRule</text>
      {[
        ["IndustryRule", "→ 20 pts"],
        ["SizeRule", "→ 30 pts"],
        ["SourceRule", "→ 25 pts"],
      ].map(([n, r], i) => {
        const x = 290 + i * 106;
        return (
          <g key={n}>
            <Arrow d={`M${x + 50} 94 L${x + 50} 136`} id={id} tone="muted" />
            <Tag x={x} y={140} w={100} h={56} kind="brand" text={n} sub={r} />
          </g>
        );
      })}
      <text x="290" y="222" {...S.muted} fontSize={12}>implements</text>
      <text x="0" y="252" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "Una regla nueva es una clase más en la lista: el bucle no cambia.",
          "A new rule is one more class in the list: the loop does not change.",
        )}
      </text>
    </Svg>
  );
}

/* --------------------------------------------- m05 · inner class + enum --- */

function InnerAndEnum({ lang }: P) {
  const id = "inner";
  return (
    <Svg id={id} viewBox="0 0 600 250" title={pick(lang, "Clase interna y enum", "Inner class and enum")}>
      <rect x="0" y="0" width="600" height="200" rx="12" {...S.box} />
      <text x="16" y="26" {...S.monoSmall} fontWeight={600}>
        public class CaseRouter
      </text>
      <rect x="16" y="40" width="270" height="140" rx="10" {...S.boxAccent} />
      <text x="30" y="62" {...S.eyebrow}>
        {pick(lang, "ENUM · PICKLIST RESTRINGIDO", "ENUM · RESTRICTED PICKLIST")}
      </text>
      <text x="30" y="88" {...S.monoSmall} fontSize={13}>enum Tier</text>
      {["STANDARD", "PRIORITY", "CRITICAL"].map((v, i) => (
        <text key={v} x="44" y={112 + i * 20} {...S.monoSmall} fontSize={12.5}>
          {i}· {v}
        </text>
      ))}
      <rect x="306" y="40" width="278" height="140" rx="10" {...S.boxBrand} />
      <text x="320" y="62" {...S.eyebrow}>
        {pick(lang, "CLASE INTERNA · WRAPPER", "INNER CLASS · WRAPPER")}
      </text>
      <text x="320" y="88" {...S.monoSmall} fontSize={13}>class Assignment</text>
      <text x="334" y="112" {...S.monoSmall} fontSize={12.5}>String caseSubject</text>
      <text x="334" y="132" {...S.monoSmall} fontSize={12.5}>Tier tier</text>
      <text x="334" y="152" {...S.monoSmall} fontSize={12.5}>Integer slaHours</text>
      <text x="0" y="226" {...S.muted} fontSize={12.5}>
        {pick(lang, "Desde fuera: CaseRouter.Tier.CRITICAL · CaseRouter.Assignment", "From outside: CaseRouter.Tier.CRITICAL · CaseRouter.Assignment")}
      </text>
      <text x="0" y="244" {...S.muted} fontSize={12.5}>
        {pick(lang, "En un switch sobre el enum: when CRITICAL (sin prefijo)", "In a switch on the enum: when CRITICAL (no prefix)")}
      </text>
    </Svg>
  );
}

/* --------------------------------------------- m05 · checkpoint map ------- */

function OopAdminMap({ lang }: P) {
  const id = "oopmap";
  const rows: Array<[string, string]> = [
    [pick(lang, "Objeto en Object Manager", "Object in Object Manager"), pick(lang, "clase", "class")],
    [pick(lang, "Un registro", "A record"), pick(lang, "instancia (new)", "instance (new)")],
    [pick(lang, "Campos · acciones", "Fields · actions"), pick(lang, "atributos · métodos", "attributes · methods")],
    [pick(lang, "Dos pestañas del mismo registro", "Two tabs of the same record"), pick(lang, "referencias", "references")],
    [pick(lang, "Valores por defecto al pulsar New", "Defaults when clicking New"), pick(lang, "constructor", "constructor")],
    ["$Record", "this"],
    [pick(lang, "Custom Setting de la org", "Org-wide Custom Setting"), "static"],
    ["Field-Level Security", pick(lang, "modificadores de acceso", "access modifiers")],
    [pick(lang, "Campos estándar que todo objeto trae", "Standard fields every object has"), "extends"],
    [pick(lang, "Activity → Task / Event", "Activity → Task / Event"), "abstract + override"],
    [pick(lang, "Schedulable para Schedule Apex", "Schedulable for Schedule Apex"), "interface"],
    [pick(lang, "Picklist restringido", "Restricted picklist"), "enum"],
    [pick(lang, "Fila de informe con varios objetos", "Report row across objects"), "wrapper"],
  ];
  return (
    <Svg id={id} viewBox={`0 0 600 ${30 + rows.length * 36}`} title={pick(lang, "De Admin a POO", "From Admin to OOP")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "COMO ADMIN YA CONOCÍAS…", "AS AN ADMIN YOU ALREADY KNEW…")}
      </text>
      <text x="380" y="16" {...S.eyebrow}>
        {pick(lang, "EN APEX SE LLAMA", "IN APEX IT IS CALLED")}
      </text>
      {rows.map(([a, b], i) => {
        const y = 26 + i * 36;
        return (
          <g key={i}>
            <rect x="0" y={y} width="360" height="30" rx="7" {...S.box} />
            <text x="12" y={y + 20} {...S.label} fontSize={12.5}>
              {a}
            </text>
            <Arrow d={`M364 ${y + 15} L376 ${y + 15}`} id={id} />
            <rect x="380" y={y} width="220" height="30" rx="7" {...S.boxBrand} />
            <text x="392" y={y + 20} {...S.monoSmall} fontSize={12.5}>
              {b}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

/* ============================================================ MODULE 3 ==== */

/* ------------------------------------------------- m03 · soql anatomy ----- */


/* ------------------------------------------------ m03 · filter funnel ----- */

function FilterFunnel({ lang }: P) {
  const id = "funnel";
  const bars = [
    { w: 600, code: "FROM Opportunity", n: pick(lang, "12.000 registros", "12,000 records"), brand: false },
    { w: 470, code: "WHERE IsClosed = false AND …", n: "800", brand: false },
    { w: 470, code: "ORDER BY Amount DESC", n: pick(lang, "800, ordenados", "800, sorted"), brand: false },
    { w: 250, code: "LIMIT 10", n: pick(lang, "10 filas", "10 rows"), brand: true },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 232" title={pick(lang, "Cada cláusula filtra más", "Each clause filters more")}>
      {bars.map((b, i) => {
        const y = i * 62;
        const x = (600 - b.w) / 2;
        const style = b.brand ? S.boxBrand : S.box;
        return (
          <g key={b.code}>
            <rect x={x} y={y} width={b.w} height="44" rx="8" {...style} />
            <text x={x + 14} y={y + 27} {...S.monoSmall} fontSize={13}>
              {b.code}
            </text>
            <text x={x + b.w - 14} y={y + 27} {...S.muted} fontSize={12.5} textAnchor="end">
              {b.n}
            </text>
            {i < bars.length - 1 && <Arrow d={`M300 ${y + 46} L300 ${y + 60}`} id={id} tone="muted" />}
          </g>
        );
      })}
    </Svg>
  );
}

/* ------------------------------------------------ m03 · relationships ----- */

function RelationshipsMap({ lang }: P) {
  const id = "rels";
  const kids = ["Ruiz", "Kim", "Silva"];
  return (
    <Svg id={id} viewBox="0 0 600 300" title={pick(lang, "Relaciones padre e hijo", "Parent and child relationships")}>
      <Tag x={200} y={0} w={200} h={46} text="User" sub={pick(lang, "el propietario", "the owner")} />
      <Tag x={200} y={110} w={200} h={46} text="Account" sub="Acme Corp" kind="brand" />
      {kids.map((k, i) => (
        <Tag key={k} x={150 + i * 104} y={226} w={96} h={46} text="Contact" sub={k} />
      ))}

      <Arrow d="M223 224 L223 162" id={id} />
      <Arrow d="M300 108 L300 50" id={id} />
      <text x="0" y="112" {...S.label} fontSize={13}>
        {pick(lang, "Hacia arriba: un punto", "Upwards: a dot")}
      </text>
      <text x="0" y="134" {...S.monoSmall} fontSize={12}>
        Account.Name
      </text>
      <text x="0" y="152" {...S.monoSmall} fontSize={12}>
        Account.Owner.Name
      </text>

      <Arrow d="M404 134 L430 134 L430 220" id={id} tone="accent" />
      <text x="476" y="112" {...S.label} fontSize={13}>
        {pick(lang, "Hacia abajo:", "Downwards:")}
      </text>
      <text x="476" y="130" {...S.label} fontSize={13}>
        {pick(lang, "subconsulta", "subquery")}
      </text>
      <text x="476" y="152" {...S.monoSmall} fontSize={12}>
        (SELECT …
      </text>
      <text x="476" y="170" {...S.monoSmall} fontSize={12}>
        FROM Contacts)
      </text>

      <text x="0" y="296" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "Fórmula entre objetos hacia arriba · related list hacia abajo",
          "Cross-object formula upwards · related list downwards",
        )}
      </text>
    </Svg>
  );
}

/* ----------------------------------------------------- m03 · bind -------- */

function BindVsConcat({ lang }: P) {
  const id = "bind";
  return (
    <Svg id={id} viewBox="0 0 600 300" title={pick(lang, "Enlace frente a concatenación", "Bind versus concatenation")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "EL USUARIO ESCRIBE", "THE USER TYPES")}
      </text>
      <Tag x={0} y={26} w={300} text="%' OR Subject LIKE '%" kind="accent" mono />

      <text x="0" y="104" {...S.eyebrow}>
        {pick(lang, "CON :pattern · EL VALOR VA APARTE", "WITH :pattern · THE VALUE TRAVELS APART")}
      </text>
      <Tag x={0} y={114} w={380} text="… AND Subject LIKE :pattern" kind="brand" mono />
      <text x={392} y={130} {...S.muted} fontSize={12}>
        {pick(lang, "se busca ese texto tal cual.", "that text is searched as is.")}
      </text>
      <text x={392} y={147} {...S.muted} fontSize={12}>
        {pick(lang, "El filtro sigue en pie.", "The filter still stands.")}
      </text>

      <text x="0" y="192" {...S.eyebrow}>
        {pick(lang, "CON + · EL VALOR SE MEZCLA CON EL CÓDIGO", "WITH + · THE VALUE MIXES WITH THE CODE")}
      </text>
      <rect x="0" y="202" width="380" height="62" rx="8" {...S.boxAccent} />
      <text x="12" y="227" {...S.monoSmall} fontSize={13}>
        IsClosed = false AND Subject
      </text>
      <text x="12" y="249" {...S.monoSmall} fontSize={13}>
        LIKE '%%' OR Subject LIKE '%%'
      </text>
      <text x={392} y={226} {...S.muted} fontSize={12}>
        {pick(lang, "el OR abre la puerta:", "the OR opens the door:")}
      </text>
      <text x={392} y={243} {...S.muted} fontSize={12}>
        {pick(lang, "salen también los cerrados.", "closed ones come out too.")}
      </text>
      <text x="0" y="292" {...S.muted} fontSize={12.5}>
        {pick(lang, "Mismo texto del usuario, dos resultados muy distintos.", "Same user text, two very different results.")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------------ m03 · aggregate -------- */

function AggregateBuckets({ lang }: P) {
  const id = "agg";
  const rows: Array<[string, string]> = [
    ["Prospecting", "30.000"],
    ["Proposal", "90.000"],
    ["Prospecting", "25.000"],
    ["Negotiation", "180.000"],
    ["Proposal", "70.000"],
    ["Prospecting", "35.000"],
    ["Negotiation", "130.000"],
    ["Proposal", "80.000"],
  ];
  const out: Array<[string, string, string]> = [
    ["Prospecting", "3", "90.000"],
    ["Proposal", "3", "240.000"],
    ["Negotiation", "2", "310.000"],
  ];
  return (
    <Svg id={id} viewBox="0 0 600 284" title={pick(lang, "Agrupar y sumar", "Group and sum")}>
      <text x="0" y="14" {...S.eyebrow}>
        {pick(lang, "8 OPORTUNIDADES", "8 OPPORTUNITIES")}
      </text>
      {rows.map(([s, a], i) => (
        <g key={i}>
          <rect x="0" y={24 + i * 32} width="210" height="26" rx="5" {...S.box} />
          <text x="10" y={41 + i * 32} {...S.monoSmall} fontSize={12}>
            {s}
          </text>
          <text x="200" y={41 + i * 32} {...S.muted} fontSize={12} textAnchor="end">
            {a}
          </text>
        </g>
      ))}
      <Arrow d="M222 150 L300 150" id={id} />
      <text x="226" y="140" {...S.monoSmall} fontSize={11.5}>
        GROUP BY
      </text>
      <text x="310" y="14" {...S.eyebrow}>
        {pick(lang, "3 FILAS · UNA POR ETAPA", "3 ROWS · ONE PER STAGE")}
      </text>
      {out.map(([s, n, t], i) => (
        <g key={s}>
          <rect x="310" y={64 + i * 62} width="290" height="48" rx="8" {...S.boxBrand} />
          <text x="324" y={85 + i * 62} {...S.monoSmall} fontSize={13}>
            {s}
          </text>
          <text x="324" y={103 + i * 62} {...S.muted} fontSize={11.5}>
            COUNT = {n} · SUM = {t}
          </text>
        </g>
      ))}
    </Svg>
  );
}

/* ------------------------------------------------------ m03 · sosl ------- */

function SoslDrawers({ lang }: P) {
  const id = "sosl";
  const d = [
    { t: "Account", s: pick(lang, "results[0] · 2 filas", "results[0] · 2 rows") },
    { t: "Contact", s: pick(lang, "results[1] · 5 filas", "results[1] · 5 rows") },
    { t: "Opportunity", s: pick(lang, "results[2] · 3 filas", "results[2] · 3 rows") },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 206" title={pick(lang, "Resultado de SOSL", "SOSL result")}>
      <Tag x={140} y={0} w={320} h={46} text="FIND 'Acme*' IN ALL FIELDS" kind="brand" mono />
      {d.map((b, i) => {
        const x = i * 204;
        return (
          <g key={b.t}>
            <Arrow d={`M300 50 L${x + 96} 118`} id={id} tone="muted" />
            <Tag x={x} y={124} w={192} h={50} text={b.t} sub={b.s} mono />
          </g>
        );
      })}
      <text x="0" y="200" {...S.muted} fontSize={12.5}>
        {"List<List<SObject>> · "}
        {pick(lang, "el orden es el del RETURNING", "the order is the RETURNING's")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------- m03 · checkpoint chooser ---- */

function QueryChooser({ lang }: P) {
  const id = "qch";
  const rows: Array<[string, string]> = [
    [pick(lang, "¿Buscas un texto sin saber dónde está?", "Text, but you do not know where?"), "SOSL · FIND"],
    [pick(lang, "¿Quieres un total, un recuento, una media?", "Want a total, a count, an average?"), "SUM · GROUP BY"],
    [pick(lang, "¿Necesitas campos del padre?", "Need parent fields?"), "Account.Name"],
    [pick(lang, "¿Necesitas los hijos de cada registro?", "Need each record's children?"), "(SELECT … FROM …)"],
    [pick(lang, "¿Filtras por variables o por muchos Ids?", "Filtering by variables or many Ids?"), ":var · IN :ids"],
    [pick(lang, "¿Nada de lo anterior?", "None of the above?"), "SELECT … WHERE …"],
  ];
  return (
    <Svg id={id} viewBox="0 0 600 316" title={pick(lang, "Qué herramienta usar", "Which tool to use")}>
      {rows.map(([q, a], i) => {
        const y = i * 54;
        return (
          <g key={a}>
            <Tag x={0} y={y} w={352} text={q} />
            <Arrow d={`M356 ${y + 20} L380 ${y + 20}`} id={id} />
            <Tag x={386} y={y} w={214} text={a} kind="brand" mono />
          </g>
        );
      })}
    </Svg>
  );
}

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

/* --------------------------------------------- m06 · trigger anatomy ----- */

function TriggerAnatomy({ lang }: P) {
  const id = "trga";
  const tok = [
    { t: "trigger", x: 70, fill: "var(--c-code-type)" },
    { t: "LeadWelcome", x: 176, fill: "var(--c-code-text)" },
    { t: "on", x: 262, fill: "var(--c-code-type)" },
    { t: "Lead", x: 312, fill: "var(--c-code-text)" },
    { t: "(after insert)", x: 440, fill: "var(--c-brand)" },
    { t: "{", x: 546, fill: "var(--c-code-text)" },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 250" title={pick(lang, "Anatomía de un trigger", "Anatomy of a trigger")}>
      <rect x="20" y="90" width="560" height="56" rx="10" {...S.box} />
      {tok.map((k) => (
        <text key={k.t} x={k.x} y="126" {...S.mono} fill={k.fill} textAnchor="middle">
          {k.t}
        </text>
      ))}

      <path d="M70 84 L70 56" stroke="var(--c-brand)" strokeWidth="1.5" markerStart={`url(#ar-${id})`} fill="none" />
      <text x="70" y="42" {...S.label} fontSize={13} textAnchor="middle">
        {pick(lang, "Palabra clave", "Keyword")}
      </text>

      <path d="M176 84 L176 56" stroke="var(--c-brand)" strokeWidth="1.5" markerStart={`url(#ar-${id})`} fill="none" />
      <text x="176" y="42" {...S.label} fontSize={13} textAnchor="middle">
        {pick(lang, "Su nombre", "Its name")}
      </text>

      <path d="M312 152 L312 184" stroke="var(--c-warn)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="312" y="204" {...S.label} fontSize={13} textAnchor="middle">
        {pick(lang, "El objeto", "The object")}
      </text>
      <text x="312" y="222" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "uno solo", "just one")}
      </text>

      <path d="M440 152 L440 184" stroke="var(--c-warn)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="440" y="204" {...S.label} fontSize={13} textAnchor="middle">
        {pick(lang, "Cuándo se dispara", "When it fires")}
      </text>
      <text x="440" y="222" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "uno o varios eventos", "one or more events")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------------ m06 · before / after --- */

function BeforeAfter({ lang }: P) {
  const id = "ba";
  return (
    <Svg id={id} viewBox="0 0 600 290" title={pick(lang, "before frente a after", "before versus after")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "ANTES DE GUARDAR", "BEFORE SAVING")}
      </text>
      <rect x="0" y="28" width="280" height="180" rx="10" {...S.boxBrand} />
      <text x="16" y="56" {...S.monoSmall} fontWeight={600}>
        before insert / update
      </text>
      <text x="16" y="86" {...S.label} fontSize={13}>
        {pick(lang, "✓ Cambias campos del propio", "✓ Change fields on the record")}
      </text>
      <text x="16" y="104" {...S.label} fontSize={13}>
        {pick(lang, "   registro, sin DML", "   itself, no DML")}
      </text>
      <text x="16" y="132" {...S.label} fontSize={13}>
        {pick(lang, "✓ Rellenar, normalizar", "✓ Default, normalise")}
      </text>
      <text x="16" y="160" {...S.label} fontSize={13}>
        {pick(lang, "✗ Todavía no hay Id (insert)", "✗ No Id yet (insert)")}
      </text>
      <text x="16" y="190" {...S.muted} fontSize={12}>
        {pick(lang, "= Flow «Fast Field Updates»", "= Flow “Fast Field Updates”")}
      </text>

      <text x="320" y="16" {...S.eyebrow}>
        {pick(lang, "DESPUÉS DE GUARDAR", "AFTER SAVING")}
      </text>
      <rect x="320" y="28" width="280" height="180" rx="10" {...S.box} />
      <text x="336" y="56" {...S.monoSmall} fontWeight={600}>
        after insert / update
      </text>
      <text x="336" y="86" {...S.label} fontSize={13}>
        {pick(lang, "✓ El Id ya existe", "✓ The Id exists")}
      </text>
      <text x="336" y="114" {...S.label} fontSize={13}>
        {pick(lang, "✓ Crear o cambiar OTROS", "✓ Create or change OTHER")}
      </text>
      <text x="336" y="132" {...S.label} fontSize={13}>
        {pick(lang, "   registros, con DML", "   records, with DML")}
      </text>
      <text x="336" y="160" {...S.label} fontSize={13}>
        {pick(lang, "✗ Trigger.new es de solo lectura", "✗ Trigger.new is read-only")}
      </text>
      <text x="336" y="190" {...S.muted} fontSize={12}>
        {pick(lang, "= Flow «Actions and Related Records»", "= Flow “Actions and Related Records”")}
      </text>

      <text x="0" y="248" {...S.label} fontSize={13}>
        {pick(
          lang,
          "¿Cambias el mismo registro? before. ¿Tocas otros? after.",
          "Changing the same record? before. Touching others? after.",
        )}
      </text>
      <text x="0" y="272" {...S.muted} fontSize={12}>
        {pick(
          lang,
          "Un update del propio registro desde after es el origen clásico de la recursión.",
          "An update of the record itself from after is the classic source of recursion.",
        )}
      </text>
    </Svg>
  );
}

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

/* ---------------------------------------------------- m06 · recursion ---- */

function RecursionLoop({ lang }: P) {
  const id = "rec";
  return (
    <Svg id={id} viewBox="0 0 600 300" title={pick(lang, "Recursión", "Recursion")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "SIN GUARDA", "NO GUARD")}
      </text>
      <Tag x={0} y={28} w={260} text="after update" sub={pick(lang, "el trigger se ejecuta", "the trigger runs")} kind="accent" mono />
      <Tag x={0} y={118} w={260} text="update opps;" sub={pick(lang, "…sobre las mismas oportunidades", "…on the same opportunities")} kind="accent" mono />
      <Arrow d="M130 78 L130 112" id={id} tone="accent" />
      <Arrow d="M266 144 C 300 144, 300 54, 268 54" id={id} tone="accent" />
      <text x="306" y="96" {...S.muted} fontSize={12}>
        {pick(lang, "vuelve a", "fires it")}
      </text>
      <text x="306" y="112" {...S.muted} fontSize={12}>
        {pick(lang, "disparar", "again")}
      </text>
      <text x="0" y="200" {...S.label} fontSize={13}>
        {pick(lang, "Vuelta 16:", "Round 16:")}
      </text>
      <text x="0" y="220" {...S.monoSmall} fontSize={12.5}>
        Maximum trigger depth exceeded
      </text>

      <text x="380" y="16" {...S.eyebrow}>
        {pick(lang, "CON GUARDA", "WITH A GUARD")}
      </text>
      <rect x="380" y="28" width="220" height="160" rx="10" {...S.boxBrand} />
      <text x="394" y="54" {...S.monoSmall} fontSize={12.5}>
        static Set&lt;Id&gt; processed
      </text>
      <text x="394" y="84" {...S.label} fontSize={13}>
        {pick(lang, "1ª vuelta: procesa y", "Round 1: process and")}
      </text>
      <text x="394" y="102" {...S.label} fontSize={13}>
        {pick(lang, "apunta los Ids", "note the Ids")}
      </text>
      <text x="394" y="132" {...S.label} fontSize={13}>
        {pick(lang, "2ª vuelta: ya están", "Round 2: already there")}
      </text>
      <text x="394" y="150" {...S.label} fontSize={13}>
        {pick(lang, "→ no hace nada", "→ does nothing")}
      </text>
      <text x="394" y="176" {...S.muted} fontSize={12}>
        {pick(lang, "vive una transacción (M5)", "lives one transaction (M5)")}
      </text>

      <text x="0" y="266" {...S.label} fontSize={13}>
        {pick(
          lang,
          "La mejor guarda es no necesitarla: si cambias el mismo registro, hazlo en before.",
          "The best guard is not needing one: if you change the same record, do it in before.",
        )}
      </text>
    </Svg>
  );
}

/* ------------------------------------------- m06 · checkpoint map ------- */

function TriggerAdminMap({ lang }: P) {
  const id = "tmap";
  const rows: Array<[string, string]> = [
    [pick(lang, "Record-Triggered Flow", "Record-Triggered Flow"), "trigger … on Objeto (…)"],
    ["$Record", "Trigger.new"],
    ["$Record__Prior", "Trigger.old / oldMap"],
    [pick(lang, "Fast Field Updates", "Fast Field Updates"), "before insert / update"],
    [pick(lang, "Actions and Related Records", "Actions and Related Records"), "after insert / update"],
    [pick(lang, "Flow Trigger Explorer", "Flow Trigger Explorer"), pick(lang, "orden de ejecución", "order of execution")],
    [pick(lang, "Loop + Update Records dentro", "Loop + Update Records inside"), pick(lang, "DML en bucle ✗", "DML in a loop ✗")],
  ];
  return (
    <Svg id={id} viewBox="0 0 600 400" title={pick(lang, "De Flow a trigger", "From Flow to trigger")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "EN FLOW YA CONOCÍAS…", "IN FLOW YOU KNEW…")}
      </text>
      <text x="330" y="16" {...S.eyebrow}>
        {pick(lang, "EN UN TRIGGER", "IN A TRIGGER")}
      </text>
      {rows.map(([a, b], i) => {
        const y = 28 + i * 52;
        return (
          <g key={i}>
            <Tag x={0} y={y} w={296} text={a} />
            <Arrow d={`M300 ${y + 20} L324 ${y + 20}`} id={id} />
            <Tag x={330} y={y} w={270} text={b} kind="brand" mono />
          </g>
        );
      })}
    </Svg>
  );
}

/* --------------------------------------------- m06 · old vs new --------- */

function OldVsNew({ lang }: P) {
  const id = "oldnew";
  return (
    <Svg id={id} viewBox="0 0 600 250" title={pick(lang, "Antes y después", "Before and after")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "ANTES DEL CAMBIO · $Record__Prior", "BEFORE THE CHANGE · $Record__Prior")}
      </text>
      <rect x="0" y="28" width="260" height="96" rx="10" {...S.box} />
      <text x="14" y="54" {...S.monoSmall} fontSize={12.5}>
        Trigger.oldMap.get(opp.Id)
      </text>
      <text x="14" y="82" {...S.label} fontSize={13}>
        Opportunity · Acme
      </text>
      <text x="14" y="104" {...S.monoSmall} fontSize={12.5}>
        StageName = 'Prospecting'
      </text>

      <text x="340" y="16" {...S.eyebrow}>
        {pick(lang, "DESPUÉS · $Record", "AFTER · $Record")}
      </text>
      <rect x="340" y="28" width="260" height="96" rx="10" {...S.boxBrand} />
      <text x="354" y="54" {...S.monoSmall} fontSize={12.5}>
        Trigger.new · opp
      </text>
      <text x="354" y="82" {...S.label} fontSize={13}>
        Opportunity · Acme
      </text>
      <text x="354" y="104" {...S.monoSmall} fontSize={12.5} fill="var(--c-brand)">
        StageName = 'Negotiation'
      </text>

      <Arrow d="M264 76 L336 76" id={id} tone="muted" />
      <text x="300" y="68" {...S.muted} fontSize={11.5} textAnchor="middle">
        {pick(lang, "mismo Id", "same Id")}
      </text>

      <rect x="0" y="152" width="600" height="80" rx="10" {...S.boxAccent} />
      <text x="16" y="178" {...S.label} fontWeight={600} fontSize={14}>
        {pick(lang, "¿Cambió? Compara los dos por su Id", "Changed? Compare both by their Id")}
      </text>
      <text x="16" y="206" {...S.monoSmall} fontSize={12.5}>
        if (opp.StageName != Trigger.oldMap.get(opp.Id).StageName)
      </text>
    </Svg>
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
  "m03-filter-funnel": FilterFunnel,
  "m03-relationships": RelationshipsMap,
  "m03-bind": BindVsConcat,
  "m03-aggregate": AggregateBuckets,
  "m03-sosl": SoslDrawers,
  "m03-cp-choose": QueryChooser,
  "m04-dml-ops": DmlOps,
  "m04-all-or-none": AllOrNone,
  "m04-bulk": BulkCompare,
  "m04-limits": LimitsGauges,
  "m04-savepoint": SavepointTimeline,
  "m04-cp-recipe": SafeDmlRecipe,
  "m06-anatomy": TriggerAnatomy,
  "m06-before-after": BeforeAfter,
  "m06-order": OrderOfExecution,
  "m06-recursion": RecursionLoop,
  "m06-cp-map": TriggerAdminMap,
  "m06-old-new": OldVsNew,
  "m05-class-vs-object": ClassVsObject,
  "m05-references": ReferencesMap,
  "m05-constructor": ConstructorFlow,
  "m05-this": ThisShadow,
  "m05-static": StaticShared,
  "m05-access": AccessRings,
  "m05-inheritance": InheritanceTree,
  "m05-abstract": AbstractActivity,
  "m05-overload-override": OverloadOverride,
  "m05-interface": InterfaceContract,
  "m05-inner-enum": InnerAndEnum,
  "m05-cp-map": OopAdminMap,
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
