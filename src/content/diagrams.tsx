"use client";

import type { Lang } from "@/lib/types";

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

/* ------------------------------------------------- 1. variable anatomy ----- */

function VariableAnatomy({ lang }: P) {
  const id = "var";
  /* Each token is its own <text>, anchored at its centre, so the arrows land on
     the right token whatever width the monospace font actually renders at. */
  const tok = [
    { t: "Integer", x: 206, fill: "var(--c-code-type)" },
    { t: "maxDiscount", x: 306, fill: "var(--c-code-text)" },
    { t: "=", x: 377, fill: "var(--c-brand)" },
    { t: "20", x: 410, fill: "var(--c-code-num)" },
    { t: ";", x: 425, fill: "var(--c-code-text)" },
  ];
  return (
    <Svg
      id={id}
      viewBox="0 0 600 260"
      title={pick(lang, "Anatomía de una declaración", "Anatomy of a declaration")}
    >
      <rect x="60" y="92" width="480" height="56" rx="10" {...S.box} />
      {tok.map((k) => (
        <text key={k.t} x={k.x} y="128" {...S.mono} fill={k.fill} textAnchor="middle">
          {k.t}
        </text>
      ))}

      {/* tipo */}
      <path d="M206 86 L206 56" stroke="var(--c-brand)" strokeWidth="1.5" markerStart={`url(#ar-${id})`} fill="none" />
      <text x="206" y="42" {...S.label} textAnchor="middle">
        {pick(lang, "Tipo", "Type")}
      </text>
      <text x="206" y="24" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "qué cabe dentro", "what fits inside")}
      </text>

      {/* nombre */}
      <path d="M312 86 L312 56" stroke="var(--c-brand)" strokeWidth="1.5" markerStart={`url(#ar-${id})`} fill="none" />
      <text x="312" y="42" {...S.label} textAnchor="middle">
        {pick(lang, "Nombre", "Name")}
      </text>
      <text x="312" y="24" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "cómo la llamas", "how you call it")}
      </text>

      {/* asignación */}
      <path d="M377 154 L332 188" stroke="var(--c-warn)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="318" y="208" {...S.label} textAnchor="middle">
        {pick(lang, "Asignación", "Assignment")}
      </text>
      <text x="318" y="228" {...S.muted} textAnchor="middle">
        {pick(lang, "«guarda esto ahí»", "“store this there”")}
      </text>

      {/* valor */}
      <path d="M410 154 L462 188" stroke="var(--c-warn)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="482" y="208" {...S.label} textAnchor="middle">
        {pick(lang, "Valor", "Value")}
      </text>
      <text x="482" y="228" {...S.muted} textAnchor="middle">
        {pick(lang, "lo que hay dentro hoy", "what is inside today")}
      </text>

      {/* punto y coma */}
      <path d="M470 76 L425 76 L425 104" stroke="var(--c-text-faint)" strokeWidth="1.3" markerEnd={`url(#am-${id})`} fill="none" />
      <text x="478" y="80" {...S.muted}>
        {pick(lang, "; cierra", "; ends it")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------- 2. numeric type decisions ----- */

function NumberTypes({ lang }: P) {
  const id = "num";
  const rows: Array<[string, string, string, string]> = [
    [
      "Integer",
      pick(lang, "Número entero, sin decimales", "Whole number, no decimals"),
      pick(lang, "Unidades, contadores, días", "Units, counters, days"),
      "42",
    ],
    [
      "Long",
      pick(lang, "Entero muy grande", "Very large whole number"),
      pick(lang, "Milisegundos, ids externos", "Milliseconds, external ids"),
      "9000000000L",
    ],
    [
      "Decimal",
      pick(lang, "Decimal exacto", "Exact decimal"),
      pick(lang, "Dinero. Siempre dinero.", "Money. Always money."),
      "19.99",
    ],
    [
      "Double",
      pick(lang, "Decimal aproximado", "Approximate decimal"),
      pick(lang, "Cálculos científicos", "Scientific maths"),
      "3.14159",
    ],
    [
      "Boolean",
      pick(lang, "true / false / null", "true / false / null"),
      pick(lang, "Checkbox de Salesforce", "A Salesforce checkbox"),
      "true",
    ],
    [
      "Id",
      pick(lang, "Identificador de registro", "Record identifier"),
      pick(lang, "Apunta a un registro real", "Points at a real record"),
      "'0035g...'",
    ],
    [
      "Blob",
      pick(lang, "Datos binarios", "Binary data"),
      pick(lang, "Adjuntos, PDFs, imágenes", "Attachments, PDFs, images"),
      "Blob.valueOf(s)",
    ],
  ];

  return (
    <Svg
      id={id}
      viewBox={`0 0 600 ${58 + rows.length * 46}`}
      title={pick(lang, "Elegir el tipo numérico", "Choosing the numeric type")}
    >
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "SI NECESITAS…", "IF YOU NEED…").toUpperCase()}
      </text>
      <text x="300" y="16" {...S.eyebrow}>
        {pick(lang, "EJEMPLO DE USO", "TYPICAL USE").toUpperCase()}
      </text>

      {rows.map(([type, what, use, sample], i) => {
        const y = 34 + i * 46;
        const brand = type === "Decimal";
        return (
          <g key={type}>
            <rect
              x="0"
              y={y}
              width="600"
              height="38"
              rx="8"
              fill={brand ? "var(--c-brand-soft)" : "var(--c-surface-2)"}
              stroke={brand ? "var(--c-brand)" : "var(--c-border)"}
              strokeWidth={brand ? 1.4 : 1}
            />
            <text x="14" y={y + 24} {...S.mono} fill="var(--c-code-type)">
              {type}
            </text>
            <text x="120" y={y + 17} {...S.label} fontSize={13.5}>
              {what}
            </text>
            <text x="120" y={y + 32} {...S.muted} fontSize={12.5}>
              {use}
            </text>
            <text x="586" y={y + 24} {...S.monoSmall} textAnchor="end" fill="var(--c-text-faint)">
              {sample}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

/* ------------------------------------------------ 3. what is a method ------ */

function MethodAnatomy({ lang }: P) {
  const id = "meth";
  return (
    <Svg
      id={id}
      viewBox="0 0 600 300"
      title={pick(lang, "Qué es un método", "What a method is")}
    >
      {/* the value */}
      <rect x="20" y="70" width="160" height="70" rx="10" {...S.box} />
      <text x="100" y="98" {...S.muted} textAnchor="middle">
        {pick(lang, "El dato", "The value")}
      </text>
      <text x="100" y="122" {...S.mono} textAnchor="middle">
        {"'  acme  '"}
      </text>

      {/* the method */}
      <rect x="230" y="60" width="150" height="90" rx="10" {...S.boxBrand} />
      <text x="305" y="88" {...S.muted} textAnchor="middle">
        {pick(lang, "El método", "The method")}
      </text>
      <text x="305" y="112" {...S.mono} textAnchor="middle" fill="var(--c-brand)">
        .trim()
      </text>
      <text x="305" y="134" {...S.muted} textAnchor="middle" fontSize={12}>
        {pick(lang, "una acción con nombre", "a named action")}
      </text>

      {/* the result */}
      <rect x="430" y="70" width="150" height="70" rx="10" {...S.box} />
      <text x="505" y="98" {...S.muted} textAnchor="middle">
        {pick(lang, "Lo que devuelve", "What it returns")}
      </text>
      <text x="505" y="122" {...S.mono} textAnchor="middle">
        {"'acme'"}
      </text>

      <path d="M182 105 L226 105" stroke="var(--c-brand)" strokeWidth="1.6" markerEnd={`url(#ar-${id})`} fill="none" />
      <path d="M382 105 L426 105" stroke="var(--c-brand)" strokeWidth="1.6" markerEnd={`url(#ar-${id})`} fill="none" />

      <text x="204" y="94" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "entra", "in")}
      </text>
      <text x="404" y="94" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "sale", "out")}
      </text>

      {/* the key idea */}
      <rect x="20" y="186" width="560" height="94" rx="10" {...S.boxAccent} />
      <text x="40" y="212" {...S.label} fontWeight={600}>
        {pick(lang, "El dato original no cambia", "The original value does not change")}
      </text>
      <text x="40" y="236" {...S.monoSmall}>
        String name = {"'  acme  '"};
      </text>
      <text x="40" y="258" {...S.monoSmall}>
        String clean = name.trim(); <tspan fill="var(--c-code-com)">
          {pick(lang, "// name sigue con espacios", "// name still has spaces")}
        </tspan>
      </text>
    </Svg>
  );
}

/* --------------------------------------------- 4. date / time / datetime --- */

function DateTimeMap({ lang }: P) {
  const id = "dt";
  return (
    <Svg
      id={id}
      viewBox="0 0 600 280"
      title={pick(lang, "Date, Time y Datetime", "Date, Time and Datetime")}
    >
      <rect x="0" y="40" width="185" height="96" rx="10" {...S.box} />
      <text x="92" y="66" {...S.title} textAnchor="middle" fontSize={15}>
        Date
      </text>
      <text x="92" y="90" {...S.mono} textAnchor="middle" fontSize={14}>
        2026-03-15
      </text>
      <text x="92" y="114" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "Día. Sin hora.", "A day. No time.")}
      </text>

      <rect x="207" y="40" width="185" height="96" rx="10" {...S.box} />
      <text x="300" y="66" {...S.title} textAnchor="middle" fontSize={15}>
        Time
      </text>
      <text x="300" y="90" {...S.mono} textAnchor="middle" fontSize={14}>
        14:30:00
      </text>
      <text x="300" y="114" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "Hora. Sin día.", "A time. No day.")}
      </text>

      <rect x="415" y="40" width="185" height="96" rx="10" {...S.boxBrand} />
      <text x="507" y="66" {...S.title} textAnchor="middle" fontSize={15}>
        Datetime
      </text>
      <text x="507" y="90" {...S.mono} textAnchor="middle" fontSize={13}>
        2026-03-15 14:30
      </text>
      <text x="507" y="114" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "Instante exacto", "An exact instant")}
      </text>

      <text x="0" y="22" {...S.eyebrow}>
        {pick(lang, "TRES TIPOS, TRES PREGUNTAS", "THREE TYPES, THREE QUESTIONS")}
      </text>

      {/* timezone callout */}
      <path d="M507 140 L507 178" stroke="var(--c-warn)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <rect x="150" y="184" width="450" height="86" rx="10" {...S.boxAccent} />
      <text x="170" y="210" {...S.label} fontWeight={600} fontSize={14}>
        {pick(lang, "Solo Datetime tiene zona horaria", "Only Datetime carries a time zone")}
      </text>
      <text x="170" y="232" {...S.muted} fontSize={13}>
        {pick(
          lang,
          "Se guarda en GMT y se muestra en la zona del usuario.",
          "It is stored in GMT and displayed in the user's zone.",
        )}
      </text>
      <text x="170" y="252" {...S.muted} fontSize={13}>
        {pick(
          lang,
          "Por eso una fecha «se mueve un día» entre usuarios.",
          "That is why a date seems to “shift a day” between users.",
        )}
      </text>

      <text x="0" y="210" {...S.muted} fontSize={13}>
        {pick(lang, "Date y Time", "Date and Time")}
      </text>
      <text x="0" y="230" {...S.muted} fontSize={13}>
        {pick(lang, "no la tienen.", "do not have one.")}
      </text>
    </Svg>
  );
}

/* --------------------------------------------------------- 5. sObject ----- */

function SObjectShape({ lang }: P) {
  const id = "sobj";
  return (
    <Svg
      id={id}
      viewBox="0 0 600 320"
      title={pick(lang, "Un sObject en memoria", "An sObject in memory")}
    >
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "EN LA BASE DE DATOS", "IN THE DATABASE")}
      </text>
      <rect x="0" y="28" width="250" height="110" rx="10" {...S.box} />
      <line x1="0" y1="58" x2="250" y2="58" stroke="var(--c-border-strong)" strokeWidth="1" />
      <text x="14" y="49" {...S.muted} fontSize={12.5}>
        Account
      </text>
      <text x="14" y="80" {...S.monoSmall}>
        Name · Acme Corp
      </text>
      <text x="14" y="102" {...S.monoSmall}>
        Industry · Technology
      </text>
      <text x="14" y="124" {...S.monoSmall}>
        AnnualRevenue · 500000
      </text>

      <text x="350" y="16" {...S.eyebrow}>
        {pick(lang, "EN TU CÓDIGO", "IN YOUR CODE")}
      </text>
      <rect x="350" y="28" width="250" height="110" rx="10" {...S.boxBrand} />
      <text x="364" y="52" {...S.monoSmall}>
        Account a = new Account();
      </text>
      <text x="364" y="76" {...S.monoSmall}>
        a.Name = {"'Acme Corp'"};
      </text>
      <text x="364" y="100" {...S.monoSmall}>
        a.Industry = {"'Technology'"};
      </text>
      <text x="364" y="124" {...S.muted} fontSize={12}>
        {pick(lang, "todavía no está guardado", "not saved yet")}
      </text>

      <path d="M256 84 L344 84" stroke="var(--c-brand)" strokeWidth="1.6" markerEnd={`url(#ar-${id})`} markerStart={`url(#ar-${id})`} fill="none" />
      <text x="300" y="74" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "mismo molde", "same mould")}
      </text>

      {/* dot access */}
      <rect x="0" y="176" width="600" height="60" rx="10" {...S.box} />
      <text x="20" y="200" {...S.muted} fontSize={12.5}>
        {pick(lang, "El punto es «el campo de»", "The dot means “the field of”")}
      </text>
      <text x="20" y="224" {...S.mono}>
        <tspan fill="var(--c-code-text)">a</tspan>
        <tspan fill="var(--c-brand)">.</tspan>
        <tspan fill="var(--c-code-text)">Industry</tspan>
        <tspan fill="var(--c-code-com)">
          {"   "}
          {pick(lang, "// el campo Industry de la cuenta a", "// the Industry field of account a")}
        </tspan>
      </text>

      <rect x="0" y="252" width="600" height="60" rx="10" {...S.boxAccent} />
      <text x="20" y="276" {...S.label} fontSize={13.5} fontWeight={600}>
        {pick(lang, "El nombre de API, no la etiqueta", "The API name, not the label")}
      </text>
      <text x="20" y="298" {...S.muted} fontSize={13}>
        {pick(
          lang,
          "En el layout ves «Ingresos anuales»; en Apex escribes AnnualRevenue.",
          "The layout shows “Annual Revenue”; in Apex you write AnnualRevenue.",
        )}
      </text>
    </Svg>
  );
}

/* ------------------------------------------------------------- 6. null ----- */

function NullStates({ lang }: P) {
  const id = "null";
  return (
    <Svg
      id={id}
      viewBox="0 0 600 300"
      title={pick(lang, "null, vacío y cero", "null, empty and zero")}
    >
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "TRES CAJAS DISTINTAS", "THREE DIFFERENT BOXES")}
      </text>

      <rect x="0" y="30" width="185" height="110" rx="10" stroke="var(--c-warn)" strokeWidth="1.5" fill="var(--c-warn-soft)" strokeDasharray="5 4" />
      <text x="92" y="58" {...S.mono} textAnchor="middle" fill="var(--c-warn)">
        null
      </text>
      <text x="92" y="86" {...S.muted} textAnchor="middle" fontSize={13}>
        {pick(lang, "No hay caja.", "There is no box.")}
      </text>
      <text x="92" y="108" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "Nunca se ha respondido", "Never answered")}
      </text>
      <text x="92" y="128" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "a esa pregunta.", "that question.")}
      </text>

      <rect x="207" y="30" width="185" height="110" rx="10" {...S.box} />
      <text x="300" y="58" {...S.mono} textAnchor="middle">
        {"''"}
      </text>
      <text x="300" y="86" {...S.muted} textAnchor="middle" fontSize={13}>
        {pick(lang, "Caja vacía.", "Empty box.")}
      </text>
      <text x="300" y="108" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "Alguien respondió", "Someone answered")}
      </text>
      <text x="300" y="128" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "«nada».", "“nothing”.")}
      </text>

      <rect x="415" y="30" width="185" height="110" rx="10" {...S.box} />
      <text x="507" y="58" {...S.mono} textAnchor="middle">
        0
      </text>
      <text x="507" y="86" {...S.muted} textAnchor="middle" fontSize={13}>
        {pick(lang, "Caja con un cero.", "Box holding a zero.")}
      </text>
      <text x="507" y="108" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "Se midió y dio", "Measured, and it")}
      </text>
      <text x="507" y="128" {...S.muted} textAnchor="middle" fontSize={12.5}>
        {pick(lang, "cero.", "came out zero.")}
      </text>

      {/* the explosion path */}
      <path d="M92 146 L92 186" stroke="var(--c-warn)" strokeWidth="1.6" markerEnd={`url(#ac-${id})`} fill="none" />
      <rect x="0" y="192" width="600" height="104" rx="10" {...S.boxAccent} />
      <text x="20" y="218" {...S.label} fontWeight={600} fontSize={14}>
        {pick(
          lang,
          "Pedirle algo a null revienta la transacción",
          "Asking null for anything blows up the transaction",
        )}
      </text>
      <text x="20" y="244" {...S.monoSmall}>
        String region = null;
      </text>
      <text x="20" y="266" {...S.monoSmall}>
        region.toUpperCase(); <tspan fill="var(--c-warn)">→ NullPointerException</tspan>
      </text>
      <text x="20" y="288" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "No hay objeto al que pedirle nada: por eso se comprueba antes.",
          "There is no object to ask: which is why you check first.",
        )}
      </text>
    </Svg>
  );
}

/* -------------------------------------------------------- 7. operators ----- */

function OperatorsMap({ lang }: P) {
  const id = "ops";
  return (
    <Svg
      id={id}
      viewBox="0 0 600 330"
      title={pick(lang, "Operadores en Apex", "Operators in Apex")}
    >
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "EL ERROR DE UN SOLO CARÁCTER", "THE ONE-CHARACTER MISTAKE")}
      </text>

      <rect x="0" y="28" width="290" height="92" rx="10" {...S.box} />
      <text x="20" y="56" {...S.mono} fill="var(--c-brand)">
        =
      </text>
      <text x="48" y="56" {...S.label} fontSize={14} fontWeight={600}>
        {pick(lang, "Asignación", "Assignment")}
      </text>
      <text x="20" y="82" {...S.monoSmall}>
        stage = {"'Closed Won'"};
      </text>
      <text x="20" y="104" {...S.muted} fontSize={12.5}>
        {pick(lang, "«pon esto ahí»", "“put this there”")}
      </text>

      <rect x="310" y="28" width="290" height="92" rx="10" {...S.boxBrand} />
      <text x="330" y="56" {...S.mono} fill="var(--c-brand)">
        ==
      </text>
      <text x="366" y="56" {...S.label} fontSize={14} fontWeight={600}>
        {pick(lang, "Comparación", "Comparison")}
      </text>
      <text x="330" y="82" {...S.monoSmall}>
        stage == {"'Closed Won'"}
      </text>
      <text x="330" y="104" {...S.muted} fontSize={12.5}>
        {pick(lang, "«¿es esto igual a aquello?»", "“is this equal to that?”")}
      </text>

      <text x="0" y="156" {...S.eyebrow}>
        {pick(lang, "ORDEN DE EVALUACIÓN", "ORDER OF EVALUATION")}
      </text>
      <rect x="0" y="168" width="600" height="68" rx="10" {...S.box} />
      <text x="20" y="196" {...S.mono} fontSize={15}>
        Decimal total = base + base * taxRate;
      </text>
      <path d="M196 204 L196 222" stroke="var(--c-brand)" strokeWidth="1.4" fill="none" />
      <path d="M196 222 L268 222" stroke="var(--c-brand)" strokeWidth="1.4" fill="none" />
      <path d="M268 222 L268 206" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />
      <text x="290" y="226" {...S.muted} fontSize={12.5}>
        {pick(lang, "el * va primero, como en matemáticas", "* goes first, as in maths")}
      </text>

      <text x="0" y="266" {...S.eyebrow}>
        {pick(lang, "LÓGICOS", "LOGICAL")}
      </text>
      <rect x="0" y="278" width="190" height="48" rx="8" {...S.box} />
      <text x="16" y="308" {...S.monoSmall}>
        &amp;&amp; <tspan {...S.muted}>{pick(lang, "  las dos", "  both")}</tspan>
      </text>
      <rect x="205" y="278" width="190" height="48" rx="8" {...S.box} />
      <text x="221" y="308" {...S.monoSmall}>
        || <tspan {...S.muted}>{pick(lang, "  al menos una", "  at least one")}</tspan>
      </text>
      <rect x="410" y="278" width="190" height="48" rx="8" {...S.box} />
      <text x="426" y="308" {...S.monoSmall}>
        ! <tspan {...S.muted}>{pick(lang, "  lo contrario", "  the opposite")}</tspan>
      </text>
    </Svg>
  );
}

/* ------------------------------------------------------ 8. collections ----- */

function CollectionsMap({ lang }: P) {
  const id = "coll";
  return (
    <Svg
      id={id}
      viewBox="0 0 600 330"
      title={pick(lang, "List, Set y Map", "List, Set and Map")}
    >
      {/* List */}
      <text x="0" y="16" {...S.eyebrow}>
        LIST — {pick(lang, "ORDEN, CON REPETIDOS", "ORDERED, DUPLICATES OK")}
      </text>
      <g>
        {["Acme", "Globex", "Acme", "Initech"].map((v, i) => (
          <g key={i}>
            <rect x={i * 120} y="28" width="108" height="46" rx="8" {...S.box} />
            <text x={i * 120 + 54} y="50" {...S.monoSmall} textAnchor="middle">
              {v}
            </text>
            <text x={i * 120 + 54} y="67" {...S.muted} fontSize={11} textAnchor="middle">
              {pick(lang, "índice", "index")} {i}
            </text>
          </g>
        ))}
      </g>

      {/* Set */}
      <text x="0" y="110" {...S.eyebrow}>
        SET — {pick(lang, "SIN REPETIDOS, SIN ORDEN GARANTIZADO", "NO DUPLICATES, NO GUARANTEED ORDER")}
      </text>
      <g>
        {["Acme", "Globex", "Initech"].map((v, i) => (
          <g key={i}>
            <rect x={i * 120} y="122" width="108" height="42" rx="21" {...S.boxBrand} />
            <text x={i * 120 + 54} y="149" {...S.monoSmall} textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        <rect x="360" y="122" width="108" height="42" rx="21" fill="none" stroke="var(--c-warn)" strokeWidth="1.4" strokeDasharray="4 4" />
        <text x="414" y="149" {...S.monoSmall} textAnchor="middle" fill="var(--c-warn)">
          Acme
        </text>
        <text x="482" y="143" {...S.muted} fontSize={12}>
          {pick(lang, "se descarta", "dropped")}
        </text>
        <text x="482" y="159" {...S.muted} fontSize={12}>
          {pick(lang, "por repetido", "as duplicate")}
        </text>
      </g>

      {/* Map */}
      <text x="0" y="200" {...S.eyebrow}>
        MAP — {pick(lang, "BUSCAR POR CLAVE", "LOOK UP BY KEY")}
      </text>
      {[
        ["0015g00...", "Acme Corp"],
        ["0015g01...", "Globex SA"],
      ].map(([k, v], i) => (
        <g key={i}>
          <rect x="0" y={212 + i * 52} width="220" height="42" rx="8" {...S.box} />
          <text x="16" y={239 + i * 52} {...S.monoSmall}>
            {k}
          </text>
          <path
            d={`M226 ${233 + i * 52} L286 ${233 + i * 52}`}
            stroke="var(--c-brand)"
            strokeWidth="1.5"
            markerEnd={`url(#ar-${id})`}
            fill="none"
          />
          <rect x="292" y={212 + i * 52} width="220" height="42" rx="8" {...S.boxBrand} />
          <text x="308" y={239 + i * 52} {...S.monoSmall}>
            {v}
          </text>
        </g>
      ))}
      <text x="524" y="245" {...S.muted} fontSize={12}>
        {pick(lang, "clave", "key")}
      </text>
      <text x="524" y="262" {...S.muted} fontSize={12}>
        →
      </text>
      <text x="524" y="280" {...S.muted} fontSize={12}>
        {pick(lang, "valor", "value")}
      </text>
      <text x="0" y="322" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "Un Map contesta «¿qué cuenta es este Id?» sin recorrer la lista entera.",
          "A Map answers “which account is this Id?” without scanning the whole list.",
        )}
      </text>
    </Svg>
  );
}

/* --------------------------------------------------------- 9. casting ----- */

function CastingMap({ lang }: P) {
  const id = "cast";
  return (
    <Svg
      id={id}
      viewBox="0 0 600 300"
      title={pick(lang, "Conversión de tipos", "Type conversion")}
    >
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "HACIA ARRIBA: AUTOMÁTICO", "WIDENING: AUTOMATIC")}
      </text>
      <rect x="0" y="28" width="150" height="50" rx="8" {...S.box} />
      <text x="75" y="58" {...S.monoSmall} textAnchor="middle">
        Integer 5
      </text>
      <path d="M156 53 L232 53" stroke="var(--c-brand)" strokeWidth="1.6" markerEnd={`url(#ar-${id})`} fill="none" />
      <text x="194" y="44" {...S.muted} fontSize={11.5} textAnchor="middle">
        {pick(lang, "cabe entero", "fits whole")}
      </text>
      <rect x="238" y="28" width="150" height="50" rx="8" {...S.boxBrand} />
      <text x="313" y="58" {...S.monoSmall} textAnchor="middle">
        Decimal 5.0
      </text>
      <text x="410" y="50" {...S.muted} fontSize={12.5}>
        {pick(lang, "Apex lo hace solo:", "Apex does it for you:")}
      </text>
      <text x="410" y="68" {...S.monoSmall} fontSize={12.5}>
        Decimal d = 5;
      </text>

      <text x="0" y="116" {...S.eyebrow}>
        {pick(lang, "HACIA ABAJO: EXPLÍCITO Y CON PÉRDIDA", "NARROWING: EXPLICIT AND LOSSY")}
      </text>
      <rect x="0" y="128" width="150" height="50" rx="8" {...S.box} />
      <text x="75" y="158" {...S.monoSmall} textAnchor="middle">
        Decimal 19.99
      </text>
      <path d="M156 153 L232 153" stroke="var(--c-warn)" strokeWidth="1.6" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="194" y="144" {...S.muted} fontSize={11.5} textAnchor="middle">
        {pick(lang, "algo se pierde", "something is lost")}
      </text>
      <rect x="238" y="128" width="150" height="50" rx="8" {...S.boxAccent} />
      <text x="313" y="158" {...S.monoSmall} textAnchor="middle">
        Integer 19
      </text>
      <text x="410" y="150" {...S.muted} fontSize={12.5}>
        {pick(lang, "Tú lo pides:", "You ask for it:")}
      </text>
      <text x="410" y="168" {...S.monoSmall} fontSize={12.5}>
        {"d.intValue()"}
      </text>

      <text x="0" y="216" {...S.eyebrow}>
        {pick(lang, "TEXTO ↔ NÚMERO: NUNCA ES AUTOMÁTICO", "TEXT ↔ NUMBER: NEVER AUTOMATIC")}
      </text>
      <rect x="0" y="228" width="600" height="66" rx="10" {...S.box} />
      <text x="20" y="254" {...S.monoSmall}>
        Integer n = Integer.valueOf({"'42'"});{" "}
        <tspan fill="var(--c-code-com)">{pick(lang, "// texto → número", "// text → number")}</tspan>
      </text>
      <text x="20" y="278" {...S.monoSmall}>
        String s = String.valueOf(42);{" "}
        <tspan fill="var(--c-code-com)">{pick(lang, "// número → texto", "// number → text")}</tspan>
      </text>
    </Svg>
  );
}

/* ------------------------------------------- checkpoint: code walkthrough -- */

function CheckpointFlow({ lang }: P) {
  const id = "cpflow";
  const steps: Array<[string, string, string]> = [
    [
      "1",
      pick(lang, "Declarar las variables del caso", "Declare the case variables"),
      pick(lang, "L1 Variables · L2 Números", "L1 Variables · L2 Numbers"),
    ],
    [
      "2",
      pick(lang, "Limpiar y normalizar el texto", "Clean and normalise the text"),
      pick(lang, "L3 String", "L3 String"),
    ],
    [
      "3",
      pick(lang, "Comprobar si falta el dato", "Check whether the value is missing"),
      pick(lang, "L6 Null · L7 Operadores", "L6 Null · L7 Operators"),
    ],
    [
      "4",
      pick(lang, "Leer campos del registro", "Read fields from the record"),
      pick(lang, "L5 sObjects", "L5 sObjects"),
    ],
    [
      "5",
      pick(lang, "Acumular en colecciones", "Accumulate into collections"),
      pick(lang, "L8 Colecciones", "L8 Collections"),
    ],
    [
      "6",
      pick(lang, "Convertir para mostrar y fechar", "Convert to display and date it"),
      pick(lang, "L9 Casting · L4 Fechas", "L9 Casting · L4 Dates"),
    ],
  ];

  return (
    <Svg
      id={id}
      viewBox={`0 0 600 ${24 + steps.length * 62}`}
      title={pick(lang, "Flujo del ejemplo, paso a paso", "The example, step by step")}
    >
      {steps.map(([n, what, from], i) => {
        const y = 8 + i * 62;
        return (
          <g key={n}>
            <rect x="0" y={y} width="600" height="50" rx="10" {...S.box} />
            <circle cx="28" cy={y + 25} r="14" fill="var(--c-brand)" />
            <text
              x="28"
              y={y + 30}
              textAnchor="middle"
              fill="var(--c-on-brand)"
              fontSize={13}
              fontWeight={600}
              fontFamily="var(--font-sans)"
            >
              {n}
            </text>
            <text x="56" y={y + 22} {...S.label} fontSize={14}>
              {what}
            </text>
            <text x="56" y={y + 40} {...S.muted} fontSize={12}>
              {from}
            </text>
            {i < steps.length - 1 && (
              <path
                d={`M28 ${y + 50} L28 ${y + 62}`}
                stroke="var(--c-brand)"
                strokeWidth="1.5"
                markerEnd={`url(#ar-${id})`}
                fill="none"
              />
            )}
          </g>
        );
      })}
    </Svg>
  );
}

/* ------------------------------------- checkpoint: formulas vs Apex -------- */

function FormulaVsApex({ lang }: P) {
  const id = "fvsa";
  const rows: Array<[string, string, string]> = [
    [
      pick(lang, "Dónde vive", "Where it lives"),
      pick(lang, "En un campo del objeto", "In a field on the object"),
      pick(lang, "En clases y triggers", "In classes and triggers"),
    ],
    [
      pick(lang, "Cuándo corre", "When it runs"),
      pick(lang, "Al leer el registro", "When the record is read"),
      pick(lang, "Cuando tú decides", "When you decide"),
    ],
    [
      pick(lang, "Qué guarda", "What it stores"),
      pick(lang, "Nada: se recalcula siempre", "Nothing: always recalculated"),
      pick(lang, "Variables, colecciones, estado", "Variables, collections, state"),
    ],
    [
      pick(lang, "Cuántos registros", "How many records"),
      pick(lang, "Uno, el suyo", "One, its own"),
      pick(lang, "200 de golpe si hace falta", "200 at once if needed"),
    ],
    [
      pick(lang, "Puede escribir", "Can it write"),
      pick(lang, "No", "No"),
      pick(lang, "Sí, con DML", "Yes, with DML"),
    ],
  ];

  return (
    <Svg
      id={id}
      viewBox={`0 0 600 ${58 + rows.length * 50}`}
      title={pick(lang, "Campo fórmula frente a Apex", "Formula field vs Apex")}
    >
      <rect x="180" y="0" width="200" height="34" rx="8" {...S.box} />
      <text x="280" y="23" {...S.label} fontSize={14} textAnchor="middle" fontWeight={600}>
        {pick(lang, "Campo fórmula", "Formula field")}
      </text>
      <rect x="392" y="0" width="208" height="34" rx="8" {...S.boxBrand} />
      <text x="496" y="23" {...S.label} fontSize={14} textAnchor="middle" fontWeight={600}>
        Apex
      </text>

      {rows.map(([label, formula, apex], i) => {
        const y = 44 + i * 50;
        return (
          <g key={label}>
            <text x="0" y={y + 26} {...S.muted} fontSize={13}>
              {label}
            </text>
            <rect x="180" y={y} width="200" height="40" rx="8" fill="var(--c-surface-2)" stroke="var(--c-border)" strokeWidth="1" />
            <text x="192" y={y + 25} {...S.label} fontSize={12.5}>
              {formula}
            </text>
            <rect x="392" y={y} width="208" height="40" rx="8" fill="var(--c-brand-soft)" stroke="var(--c-brand)" strokeWidth="1" />
            <text x="404" y={y + 25} {...S.label} fontSize={12.5}>
              {apex}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

/* --------------------------------- checkpoint: lesson dependency graph ----- */

function ModuleOneDeps({ lang }: P) {
  const id = "deps";
  const node = (
    x: number,
    y: number,
    w: number,
    label: string,
    brand = false,
  ) => (
    <g key={`${x}-${y}-${label}`}>
      <rect
        x={x}
        y={y}
        width={w}
        height="40"
        rx="8"
        fill={brand ? "var(--c-brand-soft)" : "var(--c-surface-2)"}
        stroke={brand ? "var(--c-brand)" : "var(--c-border-strong)"}
        strokeWidth="1.3"
      />
      <text x={x + w / 2} y={y + 25} {...S.label} fontSize={13} textAnchor="middle">
        {label}
      </text>
    </g>
  );

  return (
    <Svg
      id={id}
      viewBox="0 0 600 344"
      title={pick(lang, "Dependencias entre sub-lecciones", "Dependencies between sub-lessons")}
    >
      {node(200, 0, 200, pick(lang, "1 · Variables", "1 · Variables"), true)}

      <path d="M300 40 L300 62" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />

      {node(0, 68, 190, pick(lang, "2 · Números y Boolean", "2 · Numbers & Boolean"))}
      {node(205, 68, 190, pick(lang, "3 · String y métodos", "3 · String & methods"))}
      {node(410, 68, 190, pick(lang, "4 · Fechas", "4 · Dates"))}

      <path d="M95 108 L95 156 L194 156" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />
      <path d="M300 108 L300 130" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />
      <path d="M505 108 L505 156 L406 156" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />

      {node(200, 136, 200, pick(lang, "5 · sObjects", "5 · sObjects"), true)}

      <path d="M300 176 L300 198" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />
      {node(200, 204, 200, pick(lang, "6 · Null", "6 · Null"), true)}

      <path d="M300 244 L300 262" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />
      {node(0, 268, 190, pick(lang, "7 · Operadores", "7 · Operators"))}
      {node(205, 268, 190, pick(lang, "8 · Colecciones", "8 · Collections"))}
      {node(410, 268, 190, pick(lang, "9 · Casting", "9 · Casting"))}

      <path d="M300 254 L95 254 L95 262" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />
      <path d="M300 254 L505 254 L505 262" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />

      <text x="0" y="336" {...S.muted} fontSize={12}>
        {pick(
          lang,
          "Nada de la fila de abajo se entiende sin null: por eso va antes.",
          "Nothing in the bottom row makes sense without null: that is why it comes first.",
        )}
      </text>
    </Svg>
  );
}

/* ============================================================ MODULE 2 ==== */

/* ------------------------------------------------ m02 · else-if chain ----- */

function IfChain({ lang }: P) {
  const id = "ifc";
  const rows: Array<{ cond: string; result: string; state: "false" | "win" | "skip" }> = [
    { cond: "amount >= 1000000", result: "'Platinum'", state: "false" },
    { cond: "amount >= 100000", result: "'Gold'", state: "win" },
    { cond: "amount >= 10000", result: "'Bronze'", state: "skip" },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 350" title={pick(lang, "Cadena de else if", "else if chain")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "ENTRA: amount = 250000", "INPUT: amount = 250000")}
      </text>
      {rows.map((r, i) => {
        const y = 32 + i * 80;
        const win = r.state === "win";
        const skip = r.state === "skip";
        return (
          <g key={r.cond} opacity={skip ? 0.55 : 1}>
            <rect
              x="0"
              y={y}
              width="270"
              height="48"
              rx="10"
              {...(win ? S.boxBrand : S.box)}
              strokeDasharray={skip ? "5 4" : undefined}
            />
            <text x="16" y={y + 30} {...S.monoSmall}>
              {i === 0 ? "if" : "else if"} ({r.cond})
            </text>
            <path
              d={`M276 ${y + 24} L360 ${y + 24}`}
              stroke={win ? "var(--c-brand)" : "var(--c-text-faint)"}
              strokeWidth={win ? 2 : 1.2}
              markerEnd={`url(#${win ? "ar" : "am"}-${id})`}
              fill="none"
            />
            <text x="318" y={y + 16} {...S.muted} fontSize={11.5} textAnchor="middle">
              true
            </text>
            <rect x="366" y={y} width="234" height="48" rx="10" {...(win ? S.boxBrand : S.box)} />
            <text x="382" y={y + 30} {...S.monoSmall}>
              tier = {r.result}
            </text>
            {i < rows.length - 1 && (
              <>
                <path
                  d={`M60 ${y + 52} L60 ${y + 76}`}
                  stroke="var(--c-text-faint)"
                  strokeWidth="1.2"
                  markerEnd={`url(#am-${id})`}
                  fill="none"
                />
                <text x="70" y={y + 68} {...S.muted} fontSize={11.5}>
                  false
                </text>
              </>
            )}
          </g>
        );
      })}
      <text x="382" y="258" {...S.muted} fontSize={12} fill="var(--c-warn)">
        {pick(lang, "también es true, pero ya no se mira", "also true, but never looked at")}
      </text>
      <rect x="0" y="272" width="270" height="48" rx="10" {...S.box} opacity={0.55} />
      <text x="16" y="302" {...S.monoSmall} opacity={0.55}>
        else
      </text>
      <rect x="366" y="272" width="234" height="48" rx="10" {...S.box} opacity={0.55} />
      <text x="382" y="302" {...S.monoSmall} opacity={0.55}>
        tier = 'Standard'
      </text>
      <text x="0" y="344" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "La primera condición verdadera gana. Por eso se ordena de más a menos exigente.",
          "The first true condition wins. That is why you order from strictest to loosest.",
        )}
      </text>
    </Svg>
  );
}

/* ------------------------------------------------------ m02 · switch ------ */

function SwitchRouting({ lang }: P) {
  const id = "sw";
  const whens = [
    { label: "when 'Phone'", out: pick(lang, "Soporte telefónico", "Phone support"), hit: false },
    { label: "when 'Email', 'Web'", out: pick(lang, "Soporte digital", "Digital support"), hit: true },
    { label: "when null", out: pick(lang, "Revisión manual", "Manual review"), hit: false },
    { label: "when else", out: pick(lang, "Soporte general", "General support"), hit: false },
  ];
  return (
    <Svg id={id} viewBox="0 0 600 300" title={pick(lang, "Reparto con switch", "Routing with switch")}>
      <rect x="0" y="112" width="190" height="72" rx="10" {...S.boxBrand} />
      <text x="16" y="142" {...S.monoSmall}>
        switch on
      </text>
      <text x="16" y="164" {...S.monoSmall}>
        c.Origin
      </text>
      <text x="0" y="206" {...S.muted} fontSize={12}>
        {pick(lang, "valor: 'Email'", "value: 'Email'")}
      </text>
      {whens.map((w, i) => {
        const y = 10 + i * 72;
        return (
          <g key={w.label}>
            <path
              d={`M194 148 C 230 148, 230 ${y + 24}, 262 ${y + 24}`}
              stroke={w.hit ? "var(--c-brand)" : "var(--c-text-faint)"}
              strokeWidth={w.hit ? 2 : 1.1}
              markerEnd={`url(#${w.hit ? "ar" : "am"}-${id})`}
              fill="none"
            />
            <rect x="268" y={y} width="332" height="48" rx="10" {...(w.hit ? S.boxBrand : S.box)} />
            <text x="284" y={y + 22} {...S.monoSmall} fontSize={13.5}>
              {w.label}
            </text>
            <text x="284" y={y + 40} {...S.muted} fontSize={12}>
              → {w.out}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

/* ------------------------------------------------------- m02 · scope ------ */

function ScopeBoxes({ lang }: P) {
  const id = "scope";
  return (
    <Svg id={id} viewBox="0 0 600 290" title={pick(lang, "Ámbito de las variables", "Variable scope")}>
      <rect x="0" y="0" width="600" height="250" rx="12" {...S.box} />
      <text x="18" y="28" {...S.eyebrow}>
        {pick(lang, "BLOQUE EXTERIOR", "OUTER BLOCK")}
      </text>
      <text x="18" y="58" {...S.monoSmall}>
        String approver;
      </text>
      <text x="300" y="58" {...S.muted} fontSize={12.5}>
        {pick(lang, "existe desde aquí hasta el final", "exists from here to the end")}
      </text>

      <rect x="36" y="80" width="528" height="104" rx="10" {...S.boxBrand} />
      <text x="54" y="106" {...S.monoSmall}>
        {"if (amount >= 50000) {"}
      </text>
      <text x="78" y="132" {...S.monoSmall}>
        String note = 'VIP';
      </text>
      <text x="78" y="156" {...S.monoSmall}>
        approver = 'Director';
      </text>
      <text x="54" y="176" {...S.monoSmall}>
        {"}"}
      </text>
      <text x="360" y="132" {...S.muted} fontSize={12}>
        {pick(lang, "note: solo aquí dentro", "note: only in here")}
      </text>
      <text x="360" y="156" {...S.muted} fontSize={12}>
        {pick(lang, "approver: se ve desde dentro", "approver: visible from inside")}
      </text>

      <text x="18" y="214" {...S.monoSmall}>
        System.debug(approver);
      </text>
      <text x="300" y="214" {...S.muted} fontSize={12} fill="var(--c-brand)">
        ✓ {pick(lang, "compila", "compiles")}
      </text>
      <text x="18" y="238" {...S.monoSmall}>
        System.debug(note);
      </text>
      <text x="300" y="238" {...S.muted} fontSize={12} fill="var(--c-warn)">
        ✗ {pick(lang, "note ya no existe", "note no longer exists")}
      </text>
      <text x="0" y="280" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "Lo que necesites después de un bloque, declarado antes de él.",
          "Whatever you need after a block, declared before it.",
        )}
      </text>
    </Svg>
  );
}

/* ------------------------------------------------------- m02 · while ------ */

function WhileCycle({ lang }: P) {
  const id = "wh";
  return (
    <Svg id={id} viewBox="0 0 600 260" title={pick(lang, "Ciclo de un while", "The while cycle")}>
      <rect x="0" y="40" width="220" height="64" rx="10" {...S.boxBrand} />
      <text x="16" y="66" {...S.eyebrow}>
        {pick(lang, "1 · COMPROBAR", "1 · CHECK")}
      </text>
      <text x="16" y="90" {...S.monoSmall}>
        {"while (debt > 0)"}
      </text>

      <path d="M224 72 L316 72" stroke="var(--c-brand)" strokeWidth="1.8" markerEnd={`url(#ar-${id})`} fill="none" />
      <text x="270" y="62" {...S.muted} fontSize={12} textAnchor="middle">
        true
      </text>

      <rect x="322" y="28" width="278" height="88" rx="10" {...S.box} />
      <text x="338" y="54" {...S.eyebrow}>
        {pick(lang, "2 · EJECUTAR EL CUERPO", "2 · RUN THE BODY")}
      </text>
      <text x="338" y="78" {...S.monoSmall}>
        debt = debt - installment;
      </text>
      <text x="338" y="102" {...S.monoSmall}>
        payments++;
      </text>

      <path
        d="M460 120 C 460 170, 110 170, 110 110"
        stroke="var(--c-brand)"
        strokeWidth="1.6"
        markerEnd={`url(#ar-${id})`}
        fill="none"
      />
      <text x="285" y="176" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "3 · volver a comprobar", "3 · check again")}
      </text>

      <path d="M40 104 L40 206" stroke="var(--c-warn)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="50" y="160" {...S.muted} fontSize={12}>
        false
      </text>
      <rect x="0" y="212" width="300" height="42" rx="10" {...S.boxAccent} />
      <text x="16" y="238" {...S.label} fontSize={13.5}>
        {pick(lang, "sigue con el código de debajo", "carry on with the code below")}
      </text>
      <text x="330" y="232" {...S.muted} fontSize={12}>
        {pick(lang, "Si el cuerpo no cambia debt,", "If the body never changes debt,")}
      </text>
      <text x="330" y="250" {...S.muted} fontSize={12}>
        {pick(lang, "nunca se llega aquí.", "you never get here.")}
      </text>
    </Svg>
  );
}

/* ---------------------------------------------------- m02 · for-each ------ */

function ForEachLoop({ lang }: P) {
  const id = "fe";
  const recs = ["Acme", "Globex", "Initech", "Hooli"];
  return (
    <Svg id={id} viewBox="0 0 600 280" title={pick(lang, "Bucle for-each", "for-each loop")}>
      <rect x="0" y="0" width="600" height="46" rx="10" {...S.box} />
      <text x="16" y="29" {...S.mono} fontSize={15}>
        <tspan fill="var(--c-code-key)">for</tspan> (<tspan fill="var(--c-code-type)">Opportunity</tspan>{" "}
        <tspan fill="var(--c-brand)">opp</tspan> : <tspan fill="var(--c-warn)">opps</tspan>) {"{ … }"}
      </text>

      <text x="0" y="82" {...S.eyebrow}>
        {pick(lang, "LA COLECCIÓN · opps", "THE COLLECTION · opps")}
      </text>
      {recs.map((r, i) => (
        <g key={r}>
          <rect x={i * 150} y="92" width="136" height="44" rx="8" {...(i === 1 ? S.boxBrand : S.box)} />
          <text x={i * 150 + 68} y="119" {...S.monoSmall} textAnchor="middle">
            {r}
          </text>
        </g>
      ))}
      <path d="M218 166 L218 142" stroke="var(--c-brand)" strokeWidth="1.8" markerEnd={`url(#ar-${id})`} fill="none" />
      <text x="218" y="186" {...S.label} fontSize={13.5} textAnchor="middle" fill="var(--c-brand)">
        opp
      </text>
      <text x="218" y="204" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "vuelta 2 de 4", "pass 2 of 4")}
      </text>

      <text x="0" y="238" {...S.eyebrow}>
        {pick(lang, "EN FLOW", "IN FLOW")}
      </text>
      <text x="0" y="262" {...S.muted} fontSize={12.5}>
        {pick(
          lang,
          "opps = Collection Variable · opp = Current Item · } = After Last Item",
          "opps = Collection Variable · opp = Current Item · } = After Last Item",
        )}
      </text>
    </Svg>
  );
}

/* ---------------------------------------------- m02 · break & continue ---- */

function BreakContinueMap({ lang }: P) {
  const id = "bc";
  return (
    <Svg id={id} viewBox="0 0 600 270" title={pick(lang, "break y continue", "break and continue")}>
      <rect x="120" y="0" width="360" height="44" rx="10" {...S.boxBrand} />
      <text x="300" y="28" {...S.monoSmall} textAnchor="middle">
        {"for (Case c : cases) {"}
      </text>

      <rect x="120" y="70" width="360" height="44" rx="10" {...S.box} />
      <text x="300" y="98" {...S.monoSmall} textAnchor="middle">
        {pick(lang, "if (cerrado) continue;", "if (closed) continue;")}
      </text>
      <rect x="120" y="130" width="360" height="44" rx="10" {...S.box} />
      <text x="300" y="158" {...S.monoSmall} textAnchor="middle">
        {pick(lang, "if (encontrado) break;", "if (found) break;")}
      </text>
      <rect x="120" y="190" width="360" height="30" rx="8" {...S.box} opacity={0.6} />
      <text x="300" y="210" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "resto del cuerpo", "rest of the body")}
      </text>

      <path d="M116 92 C 60 92, 60 22, 114 22" stroke="var(--c-brand)" strokeWidth="1.8" markerEnd={`url(#ar-${id})`} fill="none" />
      <text x="0" y="132" {...S.label} fontSize={13} fill="var(--c-brand)">
        continue
      </text>
      <text x="0" y="150" {...S.muted} fontSize={11.5}>
        {pick(lang, "siguiente vuelta", "next pass")}
      </text>

      <path d="M484 152 C 560 152, 560 250, 500 250" stroke="var(--c-warn)" strokeWidth="1.8" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="508" y="138" {...S.label} fontSize={13} fill="var(--c-warn)">
        break
      </text>
      <rect x="220" y="232" width="276" height="34" rx="8" {...S.boxAccent} />
      <text x="358" y="254" {...S.label} fontSize={12.5} textAnchor="middle">
        {pick(lang, "después del bucle", "after the loop")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------ m02 · nested vs lookup -------- */

function NestedVsLookup({ lang }: P) {
  const id = "nvl";
  const n = 5;
  return (
    <Svg id={id} viewBox="0 0 600 300" title={pick(lang, "Anidado frente a búsqueda en un Set", "Nesting versus a Set lookup")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "ANIDADO", "NESTED")}
      </text>
      {Array.from({ length: n }).map((_, r) =>
        Array.from({ length: n }).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={20 + c * 40}
            cy={46 + r * 40}
            r="11"
            fill="var(--c-warn-soft)"
            stroke="var(--c-warn)"
            strokeWidth="1.2"
          />
        )),
      )}
      <text x="0" y="256" {...S.label} fontSize={14}>
        5 × 5 = 25
      </text>
      <text x="0" y="276" {...S.muted} fontSize={12}>
        {pick(lang, "200 × 200 = 40.000 comparaciones", "200 × 200 = 40,000 comparisons")}
      </text>

      <line x1="250" y1="10" x2="250" y2="290" stroke="var(--c-border-strong)" strokeWidth="1" />

      <text x="280" y="16" {...S.eyebrow}>
        {pick(lang, "CON UN SET", "WITH A SET")}
      </text>
      <text x="280" y="44" {...S.muted} fontSize={12}>
        {pick(lang, "1 · recorrer las cuentas una vez", "1 · walk the accounts once")}
      </text>
      {Array.from({ length: n }).map((_, i) => (
        <circle key={`a${i}`} cx={300 + i * 40} cy="68" r="11" {...S.boxBrand} />
      ))}
      <path d="M430 88 L430 108" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />
      <rect x="300" y="112" width="260" height="36" rx="18" {...S.boxBrand} />
      <text x="430" y="135" {...S.monoSmall} textAnchor="middle">
        Set&lt;String&gt; customerNames
      </text>
      <text x="280" y="240" {...S.muted} fontSize={12}>
        {pick(lang, "2 · cada lead hace una sola pregunta", "2 · each lead asks a single question")}
      </text>
      {Array.from({ length: n }).map((_, i) => (
        <g key={`l${i}`}>
          <circle cx={300 + i * 40} cy="206" r="11" {...S.box} />
          <path
            d={`M${300 + i * 40} 192 L${300 + i * 40} 152`}
            stroke="var(--c-text-faint)"
            strokeWidth="1"
            strokeDasharray="3 3"
            fill="none"
          />
        </g>
      ))}
      <text x="280" y="266" {...S.label} fontSize={14}>
        5 + 5 = 10
      </text>
      <text x="280" y="286" {...S.muted} fontSize={12}>
        {pick(lang, "200 + 200 = 400 vueltas", "200 + 200 = 400 passes")}
      </text>
    </Svg>
  );
}

/* ------------------------------------------ m02 · checkpoint chooser ------ */

function ControlChooser({ lang }: P) {
  const id = "choose";
  const rows: Array<[string, string]> = [
    [pick(lang, "Decidir por un valor exacto (picklist)", "Decide by an exact value (picklist)"), "switch on"],
    [pick(lang, "Decidir por rangos o varias condiciones", "Decide by ranges or several conditions"), "if / else if"],
    [pick(lang, "Elegir entre dos valores", "Pick between two values"), "cond ? a : b"],
    [pick(lang, "Hacer algo con cada registro", "Do something with every record"), "for (T x : list)"],
    [pick(lang, "Repetir hasta que un valor cambie", "Repeat until a value changes"), "while"],
    [pick(lang, "Saltar los que no aplican", "Skip the ones that do not apply"), "continue"],
    [pick(lang, "Parar al encontrar el primero", "Stop at the first match"), "break"],
    [pick(lang, "Cruzar dos listas", "Cross two lists"), "Set / Map"],
  ];
  return (
    <Svg id={id} viewBox={`0 0 600 ${30 + rows.length * 42}`} title={pick(lang, "Qué estructura elegir", "Which structure to choose")}>
      <text x="0" y="16" {...S.eyebrow}>
        {pick(lang, "SI NECESITAS…", "IF YOU NEED TO…")}
      </text>
      <text x="400" y="16" {...S.eyebrow}>
        {pick(lang, "USA", "USE")}
      </text>
      {rows.map(([q, a], i) => {
        const y = 28 + i * 42;
        return (
          <g key={a}>
            <rect x="0" y={y} width="380" height="34" rx="8" {...S.box} />
            <text x="14" y={y + 22} {...S.label} fontSize={13.5}>
              {q}
            </text>
            <path
              d={`M384 ${y + 17} L396 ${y + 17}`}
              stroke="var(--c-brand)"
              strokeWidth="1.4"
              markerEnd={`url(#ar-${id})`}
              fill="none"
            />
            <rect x="400" y={y} width="200" height="34" rx="8" {...S.boxBrand} />
            <text x="414" y={y + 22} {...S.monoSmall} fontSize={13.5}>
              {a}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

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

/* --------------------------------------------------------------- registry -- */

const REGISTRY: Record<string, (p: P) => React.ReactElement> = {
  "m01-variable-anatomy": VariableAnatomy,
  "m01-number-types": NumberTypes,
  "m01-method-anatomy": MethodAnatomy,
  "m01-datetime": DateTimeMap,
  "m01-sobject": SObjectShape,
  "m01-null": NullStates,
  "m01-operators": OperatorsMap,
  "m01-collections": CollectionsMap,
  "m01-casting": CastingMap,
  "m01-cp-flow": CheckpointFlow,
  "m01-cp-formula-vs-apex": FormulaVsApex,
  "m01-cp-deps": ModuleOneDeps,
  "m02-if-chain": IfChain,
  "m02-switch": SwitchRouting,
  "m02-scope": ScopeBoxes,
  "m02-while": WhileCycle,
  "m02-for-each": ForEachLoop,
  "m02-break-continue": BreakContinueMap,
  "m02-nested-vs-lookup": NestedVsLookup,
  "m02-cp-choose": ControlChooser,
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
