import type { Check, L } from "./types";
import type { CheckResult } from "./validate";
import { stripComments } from "./validate";

/**
 * Qualitative feedback engine.
 *
 * Beyond pass/fail: reads the submitted code for the habits that separate Apex
 * that compiles from Apex that survives production, and phrases them as notes.
 * Used by every exercise and, more heavily, by the two Challenges.
 */

export type Tone = "good" | "warn" | "bad" | "info";

export interface Note {
  tone: Tone;
  title: L;
  text: L;
}

export interface FeedbackReport {
  headline: L;
  notes: Note[];
  /** 0–100, a rough quality read used for the meter */
  quality: number;
}

interface Heuristic {
  id: string;
  tone: Tone;
  /** returns true when the note applies */
  when: (code: string, raw: string) => boolean;
  title: L;
  text: L;
  weight: number;
}

const HEURISTICS: Heuristic[] = [
  {
    id: "soql-in-loop",
    tone: "bad",
    weight: 25,
    when: (c) =>
      /\b(for|while)\s*\([^)]*\)\s*\{[^}]*\[\s*select\b/is.test(c),
    title: {
      es: "SOQL dentro de un loop",
      en: "SOQL inside a loop",
    },
    text: {
      es: "Hay una consulta SOQL dentro de un bucle. Con 200 registros son 200 consultas y el límite son 100 por transacción. Consulta una vez fuera del bucle y guarda el resultado en un Map o una List.",
      en: "There is a SOQL query inside a loop. With 200 records that is 200 queries against a limit of 100 per transaction. Query once outside the loop and hold the result in a Map or a List.",
    },
  },
  {
    id: "dml-in-loop",
    tone: "bad",
    weight: 25,
    when: (c) =>
      /\b(for|while)\s*\([^)]*\)\s*\{[^}]*\b(insert|update|delete|upsert)\s+[A-Za-z_]/is.test(c),
    title: { es: "DML dentro de un loop", en: "DML inside a loop" },
    text: {
      es: "Estás haciendo insert/update dentro de un bucle. Acumula los registros en una List y ejecuta un solo DML después del bucle.",
      en: "You are doing insert/update inside a loop. Collect the records in a List and run a single DML after the loop.",
    },
  },
  {
    id: "hardcoded-id",
    tone: "warn",
    weight: 10,
    when: (_c, raw) => /'(00[1-9A-Za-z]|a0[0-9A-Za-z])[A-Za-z0-9]{12,15}'/.test(raw),
    title: { es: "Id escrito a mano", en: "Hardcoded Id" },
    text: {
      es: "Un Id literal en el código funciona en tu sandbox y falla en producción, porque los Id no se conservan entre orgs. Consúltalo o usa Custom Metadata / Custom Settings.",
      en: "A literal Id works in your sandbox and breaks in production, because Ids do not survive across orgs. Query it, or use Custom Metadata / Custom Settings.",
    },
  },
  {
    id: "no-null-guard",
    tone: "warn",
    weight: 8,
    when: (c) =>
      /\.(get|remove)\s*\(/.test(c) && !/(!=\s*null|==\s*null|containsKey|\?\.)/i.test(c),
    title: { es: "Sin defensa frente a null", en: "No null guard" },
    text: {
      es: "Lees valores de una colección sin comprobar antes si existen. Un Map devuelve null cuando la clave no está y la siguiente línea lanza NullPointerException.",
      en: "You read values from a collection without checking whether they exist. A Map returns null for a missing key and the next line throws a NullPointerException.",
    },
  },
  {
    id: "single-letter-names",
    tone: "info",
    weight: 4,
    when: (c) => {
      const decls = c.match(/\b(String|Integer|Decimal|Boolean|Date|Datetime|Id)\s+([a-z])\s*[=;]/g) ?? [];
      return decls.length >= 2;
    },
    title: { es: "Nombres de una sola letra", en: "Single-letter names" },
    text: {
      es: "Varias variables se llaman con una sola letra. En Apex el nombre es documentación: `discountedAmount` le ahorra a tu yo futuro una lectura completa del método.",
      en: "Several variables are single letters. In Apex the name is the documentation: `discountedAmount` saves your future self from re-reading the whole method.",
    },
  },
  {
    id: "no-comments",
    tone: "info",
    weight: 3,
    when: (_c, raw) => raw.split("\n").length > 14 && !/(\/\/|\/\*)/.test(raw),
    title: { es: "Código sin comentar", en: "No comments" },
    text: {
      es: "El bloque es largo y no tiene un solo comentario. No hace falta narrar cada línea, pero sí explicar el *porqué* de las decisiones no obvias.",
      en: "The block is long and has not a single comment. You do not need to narrate every line, but do explain the *why* behind non-obvious decisions.",
    },
  },
  {
    id: "good-bulk",
    tone: "good",
    weight: 0,
    when: (c) => /\bMap<\s*Id\s*,/i.test(c) && /\bfor\s*\(/i.test(c),
    title: { es: "Patrón bulk reconocible", en: "Recognisable bulk pattern" },
    text: {
      es: "Usas un Map indexado por Id junto con un bucle: es el patrón estándar para resolver relaciones sin consultar dentro del loop.",
      en: "You use a Map keyed by Id together with a loop: that is the standard pattern for resolving relationships without querying inside the loop.",
    },
  },
  {
    id: "good-naming",
    tone: "good",
    weight: 0,
    when: (c) => /\b[a-z][a-zA-Z0-9]{5,}\s*=/.test(c) && !/\b[a-z]\s*=/.test(c),
    title: { es: "Nombres descriptivos", en: "Descriptive names" },
    text: {
      es: "Los nombres de tus variables se leen solos. Es la diferencia entre código que se mantiene y código que se reescribe.",
      en: "Your variable names read on their own. That is the difference between code that gets maintained and code that gets rewritten.",
    },
  },
];

export function buildFeedback(
  code: string,
  checks: Check[],
  results: CheckResult[],
  passed: boolean,
  rubric?: L[],
): FeedbackReport {
  const cleaned = stripComments(code);
  const notes: Note[] = [];
  let penalty = 0;

  // 1) Targeted notes from the failing checks (authored with the content).
  for (const r of results) {
    if (r.passed) continue;
    const check = checks.find((c) => c.id === r.id);
    if (!check?.onFail) continue;
    notes.push({
      tone: r.optional ? "info" : "bad",
      title: check.label,
      text: check.onFail,
    });
  }

  // 2) Praise for the checks that passed and carry a note.
  for (const r of results) {
    if (!r.passed) continue;
    const check = checks.find((c) => c.id === r.id);
    if (!check?.onPass) continue;
    notes.push({ tone: "good", title: check.label, text: check.onPass });
  }

  // 3) Generic Apex habits.
  for (const h of HEURISTICS) {
    if (!h.when(cleaned, code)) continue;
    notes.push({ tone: h.tone, title: h.title, text: h.text });
    penalty += h.weight;
  }

  const requiredFailed = results.filter((r) => !r.optional && !r.passed).length;
  const quality = Math.max(
    0,
    Math.min(100, 100 - penalty - requiredFailed * 12),
  );

  const headline: L = passed
    ? penalty > 12
      ? {
          es: "Funciona, pero no lo pondría en producción todavía.",
          en: "It works, but I would not ship it yet.",
        }
      : {
          es: "Correcto y bien escrito.",
          en: "Correct and cleanly written.",
        }
    : requiredFailed === 1
      ? {
          es: "Casi. Falta una cosa concreta.",
          en: "Close. One specific thing is missing.",
        }
      : {
          es: "Todavía no. Revisa las notas de abajo y vuelve a intentarlo.",
          en: "Not yet. Read the notes below and try again.",
        };

  if (rubric?.length && passed) {
    notes.push({
      tone: "info",
      title: { es: "Para ir más lejos", en: "To go further" },
      text: rubric[code.length % rubric.length],
    });
  }

  return { headline, notes, quality };
}
