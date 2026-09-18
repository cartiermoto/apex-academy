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
        <path d="M0 0 L10 5 L0 10 z" fill="var(--c-accent)" />
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
    fill: "var(--c-accent-soft)",
    stroke: "var(--c-accent)",
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
  return (
    <Svg
      id={id}
      viewBox="0 0 600 260"
      title={pick(lang, "Anatomía de una declaración", "Anatomy of a declaration")}
    >
      <rect x="60" y="92" width="480" height="56" rx="10" {...S.box} />
      <text x="84" y="128" {...S.mono}>
        <tspan fill="var(--c-code-type)">Integer</tspan>
        <tspan fill="var(--c-code-text)"> maxDiscount </tspan>
        <tspan fill="var(--c-brand)">=</tspan>
        <tspan fill="var(--c-code-num)"> 20</tspan>
        <tspan fill="var(--c-code-text)">;</tspan>
      </text>

      {/* tipo */}
      <path d="M110 86 L110 56" stroke="var(--c-brand)" strokeWidth="1.5" markerStart={`url(#ar-${id})`} fill="none" />
      <text x="110" y="42" {...S.label} textAnchor="middle">
        {pick(lang, "Tipo", "Type")}
      </text>
      <text x="104" y="24" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "qué cabe dentro", "what fits inside")}
      </text>

      {/* nombre */}
      <path d="M232 86 L232 56" stroke="var(--c-brand)" strokeWidth="1.5" markerStart={`url(#ar-${id})`} fill="none" />
      <text x="232" y="42" {...S.label} textAnchor="middle">
        {pick(lang, "Nombre", "Name")}
      </text>
      <text x="244" y="24" {...S.muted} fontSize={12} textAnchor="middle">
        {pick(lang, "cómo la llamas", "how you call it")}
      </text>

      {/* asignación */}
      <path d="M330 154 L330 186" stroke="var(--c-accent)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="330" y="206" {...S.label} textAnchor="middle">
        {pick(lang, "Asignación", "Assignment")}
      </text>
      <text x="330" y="226" {...S.muted} textAnchor="middle">
        {pick(lang, "«guarda esto ahí»", "“store this there”")}
      </text>

      {/* valor */}
      <path d="M392 154 L440 196" stroke="var(--c-accent)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
      <text x="470" y="206" {...S.label} textAnchor="middle">
        {pick(lang, "Valor", "Value")}
      </text>
      <text x="470" y="226" {...S.muted} textAnchor="middle">
        {pick(lang, "lo que hay dentro hoy", "what is inside today")}
      </text>

      {/* punto y coma */}
      <path d="M470 86 L446 86 L446 104" stroke="var(--c-text-faint)" strokeWidth="1.3" markerEnd={`url(#am-${id})`} fill="none" />
      <text x="540" y="80" {...S.muted} textAnchor="end">
        {pick(lang, "; cierra la sentencia", "; ends the statement")}
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
      <path d="M507 140 L507 178" stroke="var(--c-accent)" strokeWidth="1.5" markerEnd={`url(#ac-${id})`} fill="none" />
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

      <rect x="0" y="30" width="185" height="110" rx="10" stroke="var(--c-accent)" strokeWidth="1.5" fill="var(--c-accent-soft)" strokeDasharray="5 4" />
      <text x="92" y="58" {...S.mono} textAnchor="middle" fill="var(--c-accent)">
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
      <path d="M92 146 L92 186" stroke="var(--c-accent)" strokeWidth="1.6" markerEnd={`url(#ac-${id})`} fill="none" />
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
        region.toUpperCase(); <tspan fill="var(--c-accent)">→ NullPointerException</tspan>
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
        <rect x="360" y="122" width="108" height="42" rx="21" fill="none" stroke="var(--c-accent)" strokeWidth="1.4" strokeDasharray="4 4" />
        <text x="414" y="149" {...S.monoSmall} textAnchor="middle" fill="var(--c-accent)">
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
      <path d="M156 153 L232 153" stroke="var(--c-accent)" strokeWidth="1.6" markerEnd={`url(#ac-${id})`} fill="none" />
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
      pick(lang, "En una clase, un trigger, cualquier sitio", "In a class, a trigger, anywhere"),
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
      viewBox="0 0 600 330"
      title={pick(lang, "Dependencias entre sub-lecciones", "Dependencies between sub-lessons")}
    >
      {node(200, 0, 200, pick(lang, "1 · Variables", "1 · Variables"), true)}

      <path d="M300 40 L300 62" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />

      {node(0, 68, 190, pick(lang, "2 · Números y Boolean", "2 · Numbers & Boolean"))}
      {node(205, 68, 190, pick(lang, "3 · String y métodos", "3 · String & methods"))}
      {node(410, 68, 190, pick(lang, "4 · Fechas", "4 · Dates"))}

      <path d="M95 108 L95 130" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />
      <path d="M300 108 L300 130" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />
      <path d="M505 108 L505 130" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />

      {node(200, 136, 200, pick(lang, "5 · sObjects", "5 · sObjects"), true)}

      <path d="M300 176 L300 198" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />
      {node(200, 204, 200, pick(lang, "6 · Null", "6 · Null"), true)}

      <path d="M300 244 L300 262" stroke="var(--c-brand)" strokeWidth="1.4" markerEnd={`url(#ar-${id})`} fill="none" />
      {node(0, 268, 190, pick(lang, "7 · Operadores", "7 · Operators"))}
      {node(205, 268, 190, pick(lang, "8 · Colecciones", "8 · Collections"))}
      {node(410, 268, 190, pick(lang, "9 · Casting", "9 · Casting"))}

      <path d="M240 258 L110 264" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />
      <path d="M360 258 L490 264" stroke="var(--c-text-faint)" strokeWidth="1.2" markerEnd={`url(#am-${id})`} fill="none" />

      <text x="0" y="322" {...S.muted} fontSize={12}>
        {pick(
          lang,
          "Nada de la fila de abajo se entiende sin null: por eso va antes.",
          "Nothing in the bottom row makes sense without null: that is why it comes first.",
        )}
      </text>
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
