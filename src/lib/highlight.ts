/**
 * A small Apex tokenizer.
 *
 * Deliberately not a full parser and deliberately not a 300 kB editor library:
 * it produces the four token classes the design uses (keyword, type, string,
 * number, comment) and nothing else, which keeps the code panes fast and the
 * mobile editor light.
 */

const KEYWORDS = new Set(
  `abstract and break catch class continue delete do else enum extends final finally for from get global
   if implements insert instanceof interface merge new not null on or override private protected public
   return rollback select set static super switch on system testmethod then this throw transient trigger
   try undelete update upsert virtual void when while with without sharing webservice case default break
   as like in`
    .split(/\s+/)
    .filter(Boolean),
);

const TYPES = new Set(
  `Blob Boolean Date Datetime Decimal Double Id Integer Long Object String Time List Set Map SObject
   Account Contact Lead Opportunity Case User Task Event Database Schema System Test Exception
   DmlException NullPointerException QueryException Queueable Batchable Schedulable Http HttpRequest
   HttpResponse JSON Limits UserInfo Trigger Savepoint StringException MathException ListException`
    .split(/\s+/)
    .filter(Boolean),
);

export type Token = { text: string; cls: "" | "key" | "type" | "str" | "num" | "com" };

export function tokenizeApex(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  let buf = "";

  const flush = () => {
    if (buf) {
      out.push({ text: buf, cls: "" });
      buf = "";
    }
  };

  while (i < src.length) {
    const two = src.slice(i, i + 2);

    if (two === "//") {
      flush();
      const end = src.indexOf("\n", i);
      const stop = end === -1 ? src.length : end;
      out.push({ text: src.slice(i, stop), cls: "com" });
      i = stop;
      continue;
    }

    if (two === "/*") {
      flush();
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      out.push({ text: src.slice(i, stop), cls: "com" });
      i = stop;
      continue;
    }

    if (src[i] === "'") {
      flush();
      let j = i + 1;
      while (j < src.length && src[j] !== "'") {
        if (src[j] === "\\") j++;
        j++;
      }
      out.push({ text: src.slice(i, Math.min(j + 1, src.length)), cls: "str" });
      i = j + 1;
      continue;
    }

    if (/[0-9]/.test(src[i]) && !/[A-Za-z0-9_]/.test(src[i - 1] ?? " ")) {
      flush();
      let j = i;
      while (j < src.length && /[0-9._]/.test(src[j])) j++;
      out.push({ text: src.slice(i, j), cls: "num" });
      i = j;
      continue;
    }

    if (/[A-Za-z_]/.test(src[i])) {
      flush();
      let j = i;
      while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j++;
      const word = src.slice(i, j);
      const cls = KEYWORDS.has(word.toLowerCase())
        ? "key"
        : TYPES.has(word)
          ? "type"
          : "";
      out.push({ text: word, cls });
      i = j;
      continue;
    }

    buf += src[i];
    i++;
  }

  flush();
  return out;
}
