import type { Check, Rule } from "./types";

/**
 * Exercise validation.
 *
 * There is no Apex runtime in the browser, so an exercise is validated by the
 * declarative rules that live with the content (see Check/Rule in types.ts).
 * Rules run against a copy of the student's code with the comments blanked out,
 * so a requirement can never be "satisfied" from inside a comment. String
 * literals are kept intact, because plenty of checks legitimately look for a
 * specific value ('EMEA', 'APAC'…).
 */

/**
 * Blank out comments, preserving offsets, line breaks and string literals.
 * A quote inside a comment never opens a literal, and a "//" inside a literal
 * never opens a comment — which is why this is a scanner and not a regex.
 */
export function stripComments(code: string): string {
  let out = "";
  let i = 0;

  while (i < code.length) {
    const two = code.slice(i, i + 2);

    if (two === "//") {
      while (i < code.length && code[i] !== "\n") {
        out += " ";
        i++;
      }
      continue;
    }

    if (two === "/*") {
      while (i < code.length && code.slice(i, i + 2) !== "*/") {
        out += code[i] === "\n" ? "\n" : " ";
        i++;
      }
      if (i < code.length) {
        out += "  ";
        i += 2;
      }
      continue;
    }

    if (code[i] === "'") {
      out += code[i];
      i++;
      while (i < code.length && code[i] !== "'") {
        if (code[i] === "\\" && i + 1 < code.length) {
          out += code[i] + code[i + 1];
          i += 2;
          continue;
        }
        out += code[i];
        i++;
      }
      if (i < code.length) {
        out += code[i];
        i++;
      }
      continue;
    }

    out += code[i];
    i++;
  }

  return out;
}

/** stripComments() plus the contents of string literals blanked out. */
export function stripLiterals(code: string): string {
  return stripComments(code).replace(/'(?:\\.|[^'\\])*'/g, (m) =>
    m.length <= 2 ? m : "'" + "x".repeat(m.length - 2) + "'",
  );
}

/**
 * Flags are the usual RegExp ones plus a custom "R": run against the raw code
 * instead of the comment-stripped copy (used by checks that inspect comments).
 */
function re(pattern: string, flags?: string): RegExp {
  const set = new Set((flags ?? "i").replace(/R/g, "").split("").filter(Boolean));
  return new RegExp(pattern, [...set].join(""));
}

function countMatches(haystack: string, pattern: string, flags?: string): number {
  const set = new Set((flags ?? "i").replace(/R/g, "").split("").filter(Boolean));
  set.add("g");
  return (haystack.match(new RegExp(pattern, [...set].join(""))) ?? []).length;
}

export function runRule(rule: Rule, code: string, raw: string): boolean {
  switch (rule.op) {
    case "match":
      return re(rule.pattern, rule.flags).test(rule.flags?.includes("R") ? raw : code);
    case "absent":
      return !re(rule.pattern, rule.flags).test(
        rule.flags?.includes("R") ? raw : code,
      );
    case "count": {
      const n = countMatches(
        rule.flags?.includes("R") ? raw : code,
        rule.pattern,
        rule.flags,
      );
      if (rule.min !== undefined && n < rule.min) return false;
      if (rule.max !== undefined && n > rule.max) return false;
      return true;
    }
    case "all":
      return rule.of.every((r) => runRule(r, code, raw));
    case "any":
      return rule.of.some((r) => runRule(r, code, raw));
  }
}

export interface CheckResult {
  id: string;
  passed: boolean;
  optional: boolean;
}

export interface ValidationResult {
  passed: boolean;
  results: CheckResult[];
  required: number;
  requiredPassed: number;
  /** true when the editor is still essentially the starter code */
  untouched: boolean;
}

export function validate(
  code: string,
  checks: Check[],
  starter?: string,
): ValidationResult {
  const cleaned = stripComments(code);
  const results = checks.map((c) => ({
    id: c.id,
    passed: runRule(c.rule, cleaned, code),
    optional: Boolean(c.optional),
  }));

  const required = results.filter((r) => !r.optional);
  const requiredPassed = required.filter((r) => r.passed).length;
  const untouched = starter !== undefined && normalize(code) === normalize(starter);

  return {
    passed: required.length > 0 && requiredPassed === required.length && !untouched,
    results,
    required: required.length,
    requiredPassed,
    untouched,
  };
}

function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}
