"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 10's interactive diagrams, told through its workshops: the ERP bridge
 * from Modules 8 and 9, put to the test before it can be deployed.
 */

type P = { lang: Lang };
const eyebrow = "t-micro mb-2 font-semibold tracking-[0.06em] text-faint";

type Tone = "ok" | "bad" | "plain";
function Tag({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const c =
    tone === "ok"
      ? { color: "var(--c-brand)", background: "var(--c-brand-soft)" }
      : tone === "bad"
        ? { color: "var(--c-danger)", background: "var(--c-danger-soft)" }
        : { color: "var(--c-text-muted)", background: "var(--c-surface-2)" };
  return (
    <span className="diag-pop t-micro inline-block rounded-full px-2 py-0.5 font-semibold" style={c}>
      {children}
    </span>
  );
}

function Toggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" className="btn btn-ghost" aria-pressed={on} onClick={onClick}>
      {on ? "✓ " : ""}
      {label}
    </button>
  );
}

/* ------------------------------------------------ 1. coverage --- */

export function CoveragePlay({ lang }: P) {
  const lines = [
    "if (String.isBlank(raw)) {",
    pick(lang, "    throw new RenewalImportException('Importe vacío');", "    throw new RenewalImportException('Empty amount');"),
    "Decimal amount;",
    "try { amount = Decimal.valueOf(raw); }",
    pick(lang, "catch (TypeException e) { throw new RenewalImportException('…', e); }", "catch (TypeException e) { throw new RenewalImportException('…', e); }"),
    "if (amount <= 0) {",
    pick(lang, "    throw new RenewalImportException('Importe no positivo: ' + raw);", "    throw new RenewalImportException('Non-positive amount: ' + raw);"),
    "return amount;",
  ];
  const tests = [
    { key: "valid", label: pick(lang, "importe válido", "valid amount"), covers: [0, 2, 3, 5, 7] },
    { key: "blank", label: pick(lang, "importe vacío", "empty amount"), covers: [0, 1] },
    { key: "text", label: pick(lang, "texto", "text"), covers: [0, 2, 3, 4] },
    { key: "neg", label: pick(lang, "negativo", "negative"), covers: [0, 2, 3, 5, 6] },
  ];
  const [on, setOn] = useState<string[]>(["valid"]);
  const covered = new Set(tests.filter((t) => on.includes(t.key)).flatMap((t) => t.covers));
  const pct = Math.round((covered.size / lines.length) * 100);
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "TESTS QUE EJECUTAS", "TESTS YOU RUN")}</p>
      <div className="flex flex-wrap gap-2">
        {tests.map((t) => (
          <Toggle key={t.key} on={on.includes(t.key)} label={t.label} onClick={() => setOn((o) => (o.includes(t.key) ? o.filter((k) => k !== t.key) : [...o, t.key]))} />
        ))}
      </div>
      <ol className="mt-3 space-y-0.5 rounded-[4px] p-2" style={codeBox}>
        {lines.map((l, k) => (
          <li
            key={k}
            className="t-small overflow-x-auto whitespace-pre rounded-[3px] px-2 font-mono"
            style={{ background: covered.has(k) ? "color-mix(in srgb, var(--c-brand) 28%, transparent)" : "color-mix(in srgb, var(--c-danger) 22%, transparent)" }}
          >
            {l}
          </li>
        ))}
      </ol>
      <p className="t-small mt-3" aria-live="polite" style={{ color: pct >= 75 ? "var(--c-brand)" : "var(--c-danger)" }}>
        <strong>{pct} %</strong>{" "}
        {pct >= 75
          ? pick(lang, "de cobertura: por encima del 75 % que pide el despliegue.", "coverage: above the 75% deployment asks for.")
          : pick(lang, "de cobertura: por debajo del 75 %. Las líneas en rojo nunca se han ejecutado en un test.", "coverage: below 75%. The red lines have never run in a test.")}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 2. test data --- */

export function TestDataPlay({ lang }: P) {
  const [seeAll, setSeeAll] = useState(false);
  const s = useStepper(5, 1300);
  const org = pick(lang, "5.000 cuentas de la org", "the org's 5,000 accounts");
  const acmeName = s.i === 2 ? "Acme Corp" : "Acme";
  const sees = (step: number) => {
    const base = step >= 1 ? ["Acme", "Globex"] : [];
    const view = base.map((n) => (n === "Acme" ? (step === 2 ? "Acme Corp" : "Acme") : n));
    return seeAll ? [org, ...view] : view;
  };
  const say = [
    pick(lang, "Una clase de test con un @testSetup y dos tests. Pulsa Reproducir.", "A test class with an @testSetup and two tests. Press Play."),
    pick(lang, "El setup crea Acme y Globex. Es lo único que existe para los tests.", "The setup creates Acme and Globex. It is all that exists for the tests."),
    pick(lang, "El test A cambia Acme a «Acme Corp». Solo lo ve él.", "Test A renames Acme to «Acme Corp». Only it sees that."),
    pick(lang, "El test A termina: Salesforce deshace sus cambios.", "Test A ends: Salesforce rolls back its changes."),
    seeAll
      ? pick(lang, "El test B ve los datos del setup intactos… y además las 5.000 cuentas reales, que pueden cambiar mañana.", "Test B sees the setup data intact… plus the 5,000 real accounts, which may change tomorrow.")
      : pick(lang, "El test B ve Acme otra vez, como lo dejó el setup. Ninguno ha visto nunca los datos de la org.", "Test B sees Acme again, as the setup left it. Neither ever saw the org's data."),
  ][s.i];
  const current = s.i >= 4 ? sees(4) : s.i >= 1 ? sees(s.i) : sees(0);
  return (
    <div className="w-full">
      <Toggle on={seeAll} onClick={() => { setSeeAll((v) => !v); s.go(0); }} label="@isTest(SeeAllData=true)" />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-[4px] border border-line p-3">
          <p className={eyebrow}>{pick(lang, "LA ORG DE VERDAD", "THE REAL ORG")}</p>
          <Tag tone="plain">{org}</Tag>
        </div>
        <div className="rounded-[4px] border border-line p-3">
          <p className={eyebrow}>{s.i >= 4 ? pick(lang, "LO QUE VE EL TEST B", "WHAT TEST B SEES") : pick(lang, "LO QUE VE EL TEST", "WHAT THE TEST SEES")}</p>
          <div className="flex min-h-[28px] flex-wrap gap-1.5">
            {current.length === 0 && <span className="t-small text-faint">{pick(lang, "nada: base de datos vacía", "nothing: empty database")}</span>}
            {current.map((n) => (
              <span key={`${s.i}-${n}`}>
                <Tag tone={n === org ? "bad" : n === acmeName && s.i === 2 ? "bad" : "ok"}>{n}</Tag>
              </span>
            ))}
          </div>
        </div>
      </div>
      <Note lang={lang} s={s}>
        {say}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------ 3. assert --- */

export function AssertPlay({ lang }: P) {
  const [broken, setBroken] = useState(false);
  const tests = [
    { name: "describesTheContext()", code: "Assert.isTrue(true);", pass: true },
    { name: "isSynchronousOutsideAJob()", code: "Assert.isFalse(AsyncContext.isAsync(), '…');", pass: !broken },
  ];
  return (
    <div className="w-full">
      <Toggle on={broken} onClick={() => setBroken((v) => !v)} label={pick(lang, "Romper isAsync(): que devuelva siempre true", "Break isAsync(): make it always return true")} />
      <ul className="mt-3 space-y-1.5">
        {tests.map((t) => (
          <li key={t.name} className="rounded-[4px] border border-line px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="t-small font-mono">{t.name}</span>
              <span key={`${broken}-${t.name}`}>
                <Tag tone={t.pass ? "ok" : "bad"}>{t.pass ? pick(lang, "✓ pasa · 100 % cobertura", "✓ passes · 100% coverage") : pick(lang, "✗ falla · 100 % cobertura", "✗ fails · 100% coverage")}</Tag>
              </span>
            </div>
            <p className="t-micro mt-1 font-mono text-muted">{t.code}</p>
          </li>
        ))}
      </ul>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {broken
          ? pick(lang, "Los dos cubren el 100 % de las líneas, pero solo el que comprueba se entera de que el código está roto.", "Both cover 100% of the lines, but only the one that checks notices the code is broken.")
          : pick(lang, "Con el código bien, los dos pasan. Rompe isAsync() y mira cuál se da cuenta.", "With correct code, both pass. Break isAsync() and see which one notices.")}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 4. startTest / stopTest --- */

export function StopTestPlay({ lang }: P) {
  const [wrapped, setWrapped] = useState(true);
  const s = useStepper(4, 1300);
  const ran = wrapped ? s.i >= 2 : false;
  const pending = ran ? 0 : 150;
  const code = wrapped
    ? ["Test.startTest();", "Database.executeBatch(new RenewalMigrationBatch(), 200);", "Test.stopTest();", "Assert.areEqual(0, pending, '…');"]
    : ["", "Database.executeBatch(new RenewalMigrationBatch(), 200);", "", "Assert.areEqual(0, pending, '…');"];
  const say = [
    pick(lang, "150 filas pendientes preparadas en el setup. Pulsa Reproducir.", "150 pending rows prepared in the setup. Press Play."),
    pick(lang, "executeBatch deja el Batch en la cola y la línea termina al instante.", "executeBatch leaves the Batch in the queue and the line ends instantly."),
    wrapped
      ? pick(lang, "stopTest: el Batch se ejecuta entero aquí, antes de la línea siguiente.", "stopTest: the Batch runs in full here, before the next line.")
      : pick(lang, "No hay stopTest: el Batch sigue esperando en la cola.", "There is no stopTest: the Batch is still waiting in the queue."),
    wrapped
      ? pick(lang, "El Assert ve 0 pendientes: el test pasa.", "The Assert sees 0 pending: the test passes.")
      : pick(lang, "El Assert ve las 150 pendientes: el test falla, aunque el Batch esté bien.", "The Assert sees the 150 pending: the test fails, even though the Batch is fine."),
  ][s.i];
  return (
    <div className="w-full">
      <Tabs items={[pick(lang, "Sin startTest/stopTest", "No startTest/stopTest"), pick(lang, "Con startTest/stopTest", "With startTest/stopTest")]} value={wrapped ? 1 : 0} onChange={(n) => { setWrapped(n === 1); s.go(0); }} />
      <ol className="space-y-1 rounded-[4px] p-2" style={codeBox}>
        {code.map((c, k) =>
          c ? (
            <li key={`${wrapped}-${k}`} className="t-small overflow-x-auto whitespace-pre rounded-[3px] px-2 font-mono" style={{ background: s.i > 0 && s.i === k ? "var(--c-surface-2)" : "transparent" }}>
              {c}
            </li>
          ) : null,
        )}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="t-small text-ink">{pick(lang, "Filas pendientes:", "Pending rows:")}</span>
        <span key={`${wrapped}-${s.i}`}>
          <Tag tone={pending === 0 ? "ok" : "bad"}>{pending}</Tag>
        </span>
        {s.i === 3 && (
          <Tag tone={wrapped ? "ok" : "bad"}>{wrapped ? pick(lang, "✓ test en verde", "✓ test green") : pick(lang, "✗ test en rojo", "✗ test red")}</Tag>
        )}
      </div>
      <Note lang={lang} s={s}>
        {say}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------ 5. edge cases --- */

export function EdgeCasesPlay({ lang }: P) {
  const inputs = [
    { v: "'12500.00'", out: "12500.00", ok: true, test: "parsesAValidAmount()" },
    { v: "null", out: pick(lang, "RenewalImportException: Importe vacío", "RenewalImportException: Empty amount"), ok: false, test: "rejectsAMissingAmount()" },
    { v: "''", out: pick(lang, "RenewalImportException: Importe vacío", "RenewalImportException: Empty amount"), ok: false, test: null },
    { v: pick(lang, "'doce mil'", "'twelve thousand'"), out: pick(lang, "RenewalImportException, con la TypeException como causa", "RenewalImportException, with the TypeException as cause"), ok: false, test: "keepsTheOriginalErrorForText()" },
    { v: "'-300'", out: pick(lang, "RenewalImportException: Importe no positivo", "RenewalImportException: Non-positive amount"), ok: false, test: null },
    { v: "'0'", out: pick(lang, "RenewalImportException: Importe no positivo", "RenewalImportException: Non-positive amount"), ok: false, test: null },
  ];
  const [k, setK] = useState(0);
  const cur = inputs[k];
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "RenewalRow.parseAmount( … )", "RenewalRow.parseAmount( … )")}</p>
      <div className="flex flex-wrap gap-2">
        {inputs.map((x, n) => (
          <button key={x.v} type="button" className="btn btn-ghost font-mono" aria-pressed={k === n} onClick={() => setK(n)}>
            {x.v}
          </button>
        ))}
      </div>
      <div key={k} className="diag-pop mt-3 grid gap-2 sm:grid-cols-2">
        <div className="t-small rounded-[4px] p-3" style={{ background: "var(--c-surface-2)" }}>
          <p className="t-micro text-faint">{pick(lang, "RESULTADO", "RESULT")}</p>
          <p className="font-mono [overflow-wrap:anywhere]" style={{ color: cur.ok ? "var(--c-brand)" : "var(--c-danger)" }}>
            {cur.out}
          </p>
        </div>
        <div className="t-small rounded-[4px] border p-3" style={{ borderColor: cur.test ? "var(--c-brand)" : "var(--c-danger)" }}>
          <p className="t-micro text-faint">{pick(lang, "LO PROTEGE", "PROTECTED BY")}</p>
          <p className="font-mono [overflow-wrap:anywhere]" style={{ color: cur.test ? "var(--c-brand)" : "var(--c-danger)" }}>
            {cur.test ?? pick(lang, "ningún test todavía: si alguien quita el throw, nadie se entera", "no test yet: if someone removes the throw, nobody notices")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------ 6. mocks --- */

export function MockPlay({ lang }: P) {
  const [mode, setMode] = useState(1); // 0 no mock · 1 200 · 2 500
  const [ran, setRan] = useState(false);
  const result = [
    { tone: "bad" as Tone, head: pick(lang, "✗ el test falla", "✗ the test fails"), text: "System.CalloutException: Methods defined as TestMethod do not support Web service callouts" },
    { tone: "ok" as Tone, head: pick(lang, "✓ ERP_Synced__c = true", "✓ ERP_Synced__c = true"), text: pick(lang, "El mock contesta 200 y ErpSyncJob marca la renovación como enviada. Nada ha salido de Salesforce.", "The mock answers 200 and ErpSyncJob marks the renewal as sent. Nothing left Salesforce.") },
    { tone: "bad" as Tone, head: pick(lang, "⚠ ERP_Synced__c = true", "⚠ ERP_Synced__c = true"), text: pick(lang, "El ERP ha dicho que no, y aun así la renovación queda marcada como enviada: ErpSyncJob no mira la respuesta. Un test que esperara false lo destaparía. Es la tarea 7.", "The ERP said no, and still the renewal is marked as sent: ErpSyncJob does not check the response. A test expecting false would expose it. That is task 7.") },
  ][mode];
  return (
    <div className="w-full">
      <Tabs items={[pick(lang, "Sin mock", "No mock"), pick(lang, "Mock 200", "Mock 200"), pick(lang, "Mock 500", "Mock 500")]} value={mode} onChange={(n) => { setMode(n); setRan(false); }} />
      <div className="grid gap-2 sm:grid-cols-3">
        {[pick(lang, "ErpSyncJob", "ErpSyncJob"), "http.send(req)", mode === 0 ? pick(lang, "ERP real", "real ERP") : pick(lang, "ERP de mentira", "fake ERP")].map((label, n) => (
          <div key={label} className="t-small rounded-[4px] border px-3 py-2 text-center font-mono" style={{ borderColor: ran && n === 2 ? (mode === 0 ? "var(--c-danger)" : "var(--c-brand)") : "var(--c-border)" }}>
            {label}
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-primary mt-3" onClick={() => setRan(true)}>
        {pick(lang, "▶ Ejecutar el test", "▶ Run the test")}
      </button>
      {ran && (
        <div key={mode} className="diag-pop mt-3">
          <Tag tone={result.tone}>{result.head}</Tag>
          <p className="t-small mt-2 text-muted [overflow-wrap:anywhere]" aria-live="polite">
            {result.text}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------ 7. the whole suite --- */

export function SuitePlay({ lang }: P) {
  const [fixed, setFixed] = useState(false);
  const [ran, setRan] = useState(false);
  const suite = [
    { cls: "RenewalRowTest", tests: ["parsesAValidAmount", "rejectsAMissingAmount", "keepsTheOriginalErrorForText"] },
    { cls: "RenewalGuardTest", tests: ["allowsTheFirstRenewal", "rejectsASecondOpenRenewal"] },
    { cls: "AsyncContextTest", tests: ["isSynchronousOutsideAJob", "describesTheSynchronousBudget"] },
    { cls: "RenewalMigrationBatchTest", tests: ["processesEveryPendingRow"] },
    { cls: "ErpSyncJobTest", tests: ["marksTheRenewalsAsSynced"] },
    { cls: "ErpNightlySyncBatchTest", tests: ["syncsEveryPendingRenewal", "keepsThemPendingWhenTheErpFails"] },
  ];
  const failing = !fixed ? "keepsThemPendingWhenTheErpFails" : null;
  return (
    <div className="w-full">
      <Tabs items={[pick(lang, "Batch original", "Original Batch"), pick(lang, "Batch corregido", "Fixed Batch")]} value={fixed ? 1 : 0} onChange={(n) => { setFixed(n === 1); setRan(false); }} />
      <button type="button" className="btn btn-primary" onClick={() => setRan(true)}>
        {pick(lang, "▶ Run All Tests", "▶ Run All Tests")}
      </button>
      <ul className="mt-3 space-y-1.5">
        {suite.map((c) => (
          <li key={c.cls} className="rounded-[4px] border border-line px-3 py-2">
            <p className="t-small font-mono font-semibold">{c.cls}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {c.tests.map((t) => (
                <span key={`${fixed}-${ran}-${t}`}>
                  <Tag tone={!ran ? "plain" : t === failing ? "bad" : "ok"}>
                    {ran ? (t === failing ? "✗ " : "✓ ") : ""}
                    {t}
                  </Tag>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      {ran && (
        <p className="t-small mt-3" aria-live="polite" style={{ color: failing ? "var(--c-danger)" : "var(--c-brand)" }}>
          {failing
            ? pick(
                lang,
                "Assertion Failed: Si el ERP falla, las renovaciones tienen que seguir pendientes. Expected: 100, Actual: 0. El despliegue se para: el test ha encontrado el fallo antes que un cliente.",
                "Assertion Failed: If the ERP fails, the renewals must stay pending. Expected: 100, Actual: 0. The deployment stops: the test found the bug before a customer did.",
              )
            : pick(lang, "11 de 11 en verde. Con los tests pasando y la cobertura por encima del 75 %, el despliegue sigue adelante.", "11 of 11 green. With the tests passing and coverage above 75%, the deployment goes ahead.")}
        </p>
      )}
    </div>
  );
}
