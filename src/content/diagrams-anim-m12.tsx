"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { Tabs, codeBox, pick } from "./diagrams-anim";

/**
 * Module 12's interactive diagrams, told through its workshops: the security
 * audit of the ERP bridge. Sharing, CRUD and FLS, user mode and SOQL injection.
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

function Code({ children }: { children: string }) {
  return (
    <pre className="t-small overflow-x-auto whitespace-pre rounded-[4px] p-3 font-mono" style={codeBox}>
      {children}
    </pre>
  );
}

function Switch({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="t-small flex min-h-[36px] cursor-pointer items-center gap-2 text-ink">
      <input type="checkbox" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

/* ------------------------------------------------ 1. who sees which records --- */

const RENEWALS = [
  { name: "Acme 2026", owner: "Ana" },
  { name: "Globex 2026", owner: "Ana" },
  { name: "Initech 2026", owner: "Luis" },
  { name: "Umbrella 2026", owner: "Luis" },
  { name: "Hooli 2026", owner: "Marta" },
];

export function SharingPlay({ lang }: P) {
  const [boss, setBoss] = useState(false);
  const [decl, setDecl] = useState(0);
  const decls = [
    { label: "with sharing", shared: true, say: pick(lang, "La clase respeta el sharing de quien la ejecuta.", "The class respects the sharing of whoever runs it.") },
    { label: "without sharing", shared: false, say: pick(lang, "La clase ve todos los registros, los pueda ver el usuario o no.", "The class sees every record, whether the user can see them or not.") },
    { label: "inherited sharing", shared: true, say: pick(lang, "Nadie la llama desde otra clase: se comporta como with sharing.", "No other class calls it: it behaves like with sharing.") },
    { label: pick(lang, "Sin declarar · API 66", "Undeclared · API 66"), shared: false, say: pick(lang, "Hasta la versión 66, sin declaración se ejecuta sin sharing.", "Up to version 66, with no declaration it runs without sharing.") },
    { label: pick(lang, "Sin declarar · API 67", "Undeclared · API 67"), shared: true, say: pick(lang, "Desde la versión 67, sin declaración se ejecuta con sharing. El mismo código, otro resultado: por eso se declara siempre.", "From version 67, with no declaration it runs with sharing. Same code, different result: that is why you always declare.") },
  ];
  const d = decls[decl];
  const visible = RENEWALS.filter((r) => !d.shared || boss || r.owner === "Ana");
  const leak = !boss && visible.length > 2;
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-small text-ink">{pick(lang, "Ejecuta:", "Run by:")}</span>
        <button type="button" className="btn btn-ghost" aria-pressed={!boss} onClick={() => setBoss(false)}>
          {pick(lang, "Ana, comercial", "Ana, sales rep")}
        </button>
        <button type="button" className="btn btn-ghost" aria-pressed={boss} onClick={() => setBoss(true)}>
          {pick(lang, "Dirección", "Management")}
        </button>
      </div>
      <Tabs items={decls.map((x) => x.label)} value={decl} onChange={setDecl} />
      <ul className="space-y-1">
        {RENEWALS.map((r) => {
          const seen = visible.includes(r);
          const own = boss || r.owner === "Ana";
          return (
            <li key={r.name} className="t-small flex items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5" style={{ opacity: seen ? 1 : 0.45 }}>
              <span>
                {r.name} <span className="text-muted">· {pick(lang, "de", "owned by")} {r.owner}</span>
              </span>
              <Tag tone={!seen ? "plain" : own ? "ok" : "bad"}>{seen ? pick(lang, "devuelta", "returned") : pick(lang, "no devuelta", "not returned")}</Tag>
            </li>
          );
        })}
      </ul>
      <p className="t-small mt-3 text-ink" aria-live="polite">
        {pick(lang, "La consulta devuelve", "The query returns")} <strong>{visible.length}</strong> {pick(lang, "de 5 renovaciones.", "of 5 renewals.")}{" "}
        {leak && <Tag tone="bad">{pick(lang, "Ana ve lo que no es suyo", "Ana sees what is not hers")}</Tag>}
      </p>
      <p className="t-small mt-2 text-muted">{d.say}</p>
    </div>
  );
}

/* ------------------------------------------------ 2. CRUD and FLS, asked one by one --- */

export function CrudFlsPlay({ lang }: P) {
  const [crud, setCrud] = useState(false);
  const [fls, setFls] = useState(false);
  const [checks, setChecks] = useState(true);
  const allowed = crud && fls;
  const result = !checks
    ? { tone: (allowed ? "ok" : "bad") as Tone, tag: pick(lang, "Descuento guardado", "Discount saved"), say: allowed ? pick(lang, "Se guarda, y este usuario podía hacerlo.", "It is saved, and this user was allowed to.") : pick(lang, "Se guarda igualmente: en modo sistema nadie pregunta. Es el hallazgo del auditor.", "It is saved anyway: in system mode nobody asks. This is the auditor's finding.") }
    : !crud
      ? { tone: "plain" as Tone, tag: pick(lang, "Rechazado", "Rejected"), say: pick(lang, "RenewalSecurityException: No tienes permiso para editar oportunidades", "RenewalSecurityException: You do not have permission to edit opportunities") }
      : !fls
        ? { tone: "plain" as Tone, tag: pick(lang, "Rechazado", "Rejected"), say: pick(lang, "RenewalSecurityException: No tienes permiso para cambiar el descuento", "RenewalSecurityException: You do not have permission to change the discount") }
        : { tone: "ok" as Tone, tag: pick(lang, "Descuento guardado", "Discount saved"), say: pick(lang, "Las dos preguntas responden true: se guarda.", "Both questions answer true: it is saved.") };
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "PERMISOS DEL USUARIO", "THE USER'S PERMISSIONS")}</p>
      <Switch on={crud} onChange={setCrud}>
        {pick(lang, "Puede editar Opportunity (objeto)", "May edit Opportunity (object)")}
      </Switch>
      <Switch on={fls} onChange={setFls}>
        {pick(lang, "Puede editar Discount__c (campo)", "May edit Discount__c (field)")}
      </Switch>
      <p className={`${eyebrow} mt-3`}>{pick(lang, "EL CÓDIGO", "THE CODE")}</p>
      <Tabs items={[pick(lang, "Con comprobaciones", "With checks"), pick(lang, "Sin comprobaciones", "Without checks")]} value={checks ? 0 : 1} onChange={(n) => setChecks(n === 0)} />
      <ul className="space-y-1">
        <li className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
          <span className="[overflow-wrap:anywhere]">Opportunity.isUpdateable()</span>
          <Tag tone={crud ? "ok" : "bad"}>{String(crud)}</Tag>
        </li>
        <li className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
          <span className="[overflow-wrap:anywhere]">fields.Discount__c.isUpdateable()</span>
          <Tag tone={fls ? "ok" : "bad"}>{String(fls)}</Tag>
        </li>
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2" aria-live="polite">
        <span className="t-small text-ink">applyDiscount():</span>
        <Tag tone={result.tone}>{result.tag}</Tag>
      </div>
      <p className="t-small mt-2 text-muted [overflow-wrap:anywhere]">{result.say}</p>
    </div>
  );
}

/* ------------------------------------------------ 3. system mode, user mode, strip --- */

export function UserModePlay({ lang }: P) {
  const [k, setK] = useState(0);
  const modes = [
    { label: "WITH SYSTEM_MODE", code: "[SELECT Name, Amount, Margin__c\n FROM Opportunity WITH SYSTEM_MODE]", margin: true, fail: false, say: pick(lang, "Vuelve todo, margen incluido: el comercial ve un campo que tiene oculto.", "Everything comes back, margin included: the rep sees a field hidden from them.") },
    { label: "WITH USER_MODE", code: "[SELECT Name, Amount, Margin__c\n FROM Opportunity WITH USER_MODE]", margin: false, fail: true, say: pick(lang, "La consulta falla: pide un campo que este usuario no puede leer. Seguro, pero el panel se queda en blanco.", "The query fails: it asks for a field this user cannot read. Safe, but the panel is left blank.") },
    { label: "stripInaccessible", code: "Security.stripInaccessible(\n    AccessType.READABLE, rows).getRecords()", margin: false, fail: false, say: pick(lang, "Vuelven las renovaciones sin el campo que no puede ver. El panel funciona para todos.", "The renewals come back without the field they cannot see. The panel works for everyone.") },
  ];
  const m = modes[k];
  const rows = [
    { name: "Acme 2026", amount: "12.500", margin: "38 %" },
    { name: "Globex 2026", amount: "8.200", margin: "41 %" },
  ];
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "EJECUTA: UN COMERCIAL SIN ACCESO A MARGIN__C", "RUN BY: A REP WITH NO ACCESS TO MARGIN__C")}</p>
      <Tabs items={modes.map((x) => x.label)} value={k} onChange={setK} />
      <Code>{m.code}</Code>
      <p className={`${eyebrow} mt-3`}>{pick(lang, "LO QUE VUELVE", "WHAT COMES BACK")}</p>
      {m.fail ? (
        <p key={k} className="diag-pop t-small rounded-[4px] p-3 font-mono [overflow-wrap:anywhere]" style={{ background: "var(--c-danger-soft)", color: "var(--c-danger)" }}>
          {pick(lang, "System.QueryException: sin acceso al campo Margin__c", "System.QueryException: no access to the Margin__c field")}
        </p>
      ) : (
        <ul key={k} className="diag-pop space-y-1">
          {rows.map((r) => (
            <li key={r.name} className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5">
              <span>
                {r.name} · {r.amount} €
              </span>
              {m.margin ? <Tag tone="bad">Margin__c: {r.margin}</Tag> : <Tag tone="ok">{pick(lang, "sin Margin__c", "no Margin__c")}</Tag>}
            </li>
          ))}
        </ul>
      )}
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {m.say}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 4. SOQL injection --- */

export function InjectionPlay({ lang }: P) {
  const [auditor, setAuditor] = useState(false);
  const [bound, setBound] = useState(false);
  const term = auditor ? "%' OR Name LIKE '" : "acme";
  const head = "SELECT Id, Name FROM Opportunity\nWHERE Type = 'Renewal'\n  AND Account.Name LIKE ";
  const query = bound ? `${head}:pattern` : `${head}'%${term}%'`;
  const outcome = !auditor
    ? { tone: "ok" as Tone, tag: pick(lang, "1 renovación de Acme", "1 Acme renewal"), say: pick(lang, "Con un nombre normal, las dos formas devuelven lo mismo. Por eso el fallo no se nota hasta que alguien lo busca.", "With a normal name, both ways return the same. That is why the fault goes unnoticed until someone looks for it.") }
    : bound
      ? { tone: "ok" as Tone, tag: pick(lang, "0 registros", "0 records"), say: pick(lang, "El texto del auditor viaja como valor: se busca una cuenta que se llame así, con comillas y todo. No hay ninguna.", "The auditor's text travels as a value: an account with that name is searched for, quotes and all. There is none.") }
      : { tone: "bad" as Tone, tag: pick(lang, "Todas las oportunidades", "Every opportunity"), say: pick(lang, "La comilla cerró el texto y el OR pasó a ser parte de la consulta: ya no filtra renovaciones.", "The quote closed the text and the OR became part of the query: it no longer filters renewals.") };
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-small text-ink">{pick(lang, "Escribe:", "Typed by:")}</span>
        <button type="button" className="btn btn-ghost" aria-pressed={!auditor} onClick={() => setAuditor(false)}>
          {pick(lang, "Un comercial", "A sales rep")}
        </button>
        <button type="button" className="btn btn-ghost" aria-pressed={auditor} onClick={() => setAuditor(true)}>
          {pick(lang, "El auditor", "The auditor")}
        </button>
      </div>
      <p className={eyebrow}>{pick(lang, "EN LA CAJA DE BÚSQUEDA", "IN THE SEARCH BOX")}</p>
      <p className="t-small rounded-[4px] border border-line px-3 py-2 font-mono [overflow-wrap:anywhere]">{term}</p>
      <div className="mt-3">
        <Tabs items={[pick(lang, "Pegando el texto", "Gluing the text"), pick(lang, "Enlazando el valor", "Binding the value")]} value={bound ? 1 : 0} onChange={(n) => setBound(n === 1)} />
      </div>
      <p className={eyebrow}>{pick(lang, "LA CONSULTA QUE SE EJECUTA", "THE QUERY THAT RUNS")}</p>
      <Code>{query}</Code>
      {bound && (
        <p className="t-small mt-2 font-mono text-muted [overflow-wrap:anywhere]">
          pattern = &quot;%{term}%&quot;
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2" aria-live="polite">
        <span className="t-small text-ink">{pick(lang, "Devuelve:", "Returns:")}</span>
        <Tag tone={outcome.tone}>{outcome.tag}</Tag>
      </div>
      <p className="t-small mt-2 text-muted">{outcome.say}</p>
    </div>
  );
}

/* ------------------------------------------------ 5. runAs: who runs vs how the code saves --- */

export function RunAsPlay({ lang }: P) {
  const [intern, setIntern] = useState(false);
  const [userMode, setUserMode] = useState(true);
  const saved = !intern || !userMode;
  const green = !saved;
  const say = !intern
    ? pick(lang, "El usuario del test puede con todo: el descuento se guarda escriba lo que escriba el código. Este test no demuestra nada sobre el becario.", "The test's user can do everything: the discount is saved whatever the code says. This test proves nothing about the intern.")
    : userMode
      ? pick(lang, "El código pregunta por los permisos y quien contesta es el becario: rechazado. El test demuestra que el permiso se respeta.", "The code asks about permissions and the intern is the one answering: rejected. The test proves the permission is respected.")
      : pick(lang, "runAs cambia el usuario, pero el modo sistema no pregunta: el descuento se guarda. El test en rojo avisa de que alguien abrió el agujero.", "runAs changes the user, but system mode does not ask: the discount is saved. The red test warns that someone opened the hole.");
  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-small text-ink">{pick(lang, "Ejecuta la llamada:", "The call is run by:")}</span>
        <button type="button" className="btn btn-ghost" aria-pressed={!intern} onClick={() => setIntern(false)}>
          {pick(lang, "El usuario del test", "The test's user")}
        </button>
        <button type="button" className="btn btn-ghost" aria-pressed={intern} onClick={() => setIntern(true)}>
          System.runAs(intern)
        </button>
      </div>
      <p className={eyebrow}>{pick(lang, "EL CÓDIGO GUARDA CON…", "THE CODE SAVES WITH…")}</p>
      <Tabs items={["update as user o;", pick(lang, "update o;  (modo sistema)", "update o;  (system mode)")]} value={userMode ? 0 : 1} onChange={(n) => setUserMode(n === 0)} />
      <ul className="space-y-1" aria-live="polite">
        <li className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5">
          <span>Discount__c</span>
          <Tag tone={saved ? "plain" : "ok"}>{saved ? pick(lang, "guardado: 10", "saved: 10") : pick(lang, "sigue vacío", "still empty")}</Tag>
        </li>
        <li className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5">
          <span>{pick(lang, "El test «el becario no puede»", "The «intern cannot» test")}</span>
          <Tag tone={green ? "ok" : "bad"}>{green ? pick(lang, "en verde", "green") : pick(lang, "en rojo", "red")}</Tag>
        </li>
      </ul>
      <p className="t-small mt-3 text-muted">{say}</p>
    </div>
  );
}

/* ------------------------------------------------ 6. checkpoint: the audit --- */

export function AuditPlay({ lang }: P) {
  const [fixed, setFixed] = useState([false, false, false, false]);
  const items = [
    {
      fix: "with sharing",
      open: pick(lang, "El comercial ve renovaciones de cuentas que no son suyas.", "The rep sees renewals of accounts that are not theirs."),
      closed: pick(lang, "El comercial solo ve las renovaciones que el sharing le permite.", "The rep only sees the renewals sharing allows."),
    },
    {
      fix: "LIKE :likeTerm",
      open: pick(lang, "Una comilla en la búsqueda cambia la consulta.", "A quote in the search changes the query."),
      closed: pick(lang, "Lo que se escribe en la búsqueda es solo un valor.", "What is typed in the search is only a value."),
    },
    {
      fix: "stripInaccessible",
      open: pick(lang, "El margen llega a quien lo tiene oculto.", "The margin reaches those who have it hidden."),
      closed: pick(lang, "El margen solo llega a quien puede verlo.", "The margin only reaches those who may see it."),
    },
    {
      fix: "WITH USER_MODE + as user",
      open: pick(lang, "Un usuario de solo lectura puede cerrar una oportunidad.", "A read-only user can close an opportunity."),
      closed: pick(lang, "Cerrar una oportunidad exige permiso para editarla.", "Closing an opportunity requires permission to edit it."),
    },
  ];
  const left = fixed.filter((f) => !f).length;
  return (
    <div className="w-full">
      <p className={eyebrow}>RenewalDeskController</p>
      <ul className="space-y-2">
        {items.map((it, n) => (
          <li key={it.fix} className="rounded-[4px] border border-line px-3 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Switch on={fixed[n]} onChange={(v) => setFixed(fixed.map((f, m) => (m === n ? v : f)))}>
                <span className="font-mono">{it.fix}</span>
              </Switch>
              <Tag tone={fixed[n] ? "ok" : "bad"}>{fixed[n] ? pick(lang, "cerrado", "closed") : pick(lang, "abierto", "open")}</Tag>
            </div>
            <p className="t-small mt-1 text-muted">{fixed[n] ? it.closed : it.open}</p>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2" aria-live="polite">
        <span className="t-small text-ink">{pick(lang, "Informe del auditor:", "Auditor's report:")}</span>
        <Tag tone={left === 0 ? "ok" : "bad"}>
          {left === 0 ? pick(lang, "Aprobada: 0 hallazgos", "Approved: 0 findings") : pick(lang, `Hallazgos abiertos: ${left}`, `Open findings: ${left}`)}
        </Tag>
      </div>
      <p className="t-small mt-2 text-muted">
        {left === 0
          ? pick(lang, "Cuatro arreglos independientes. Ninguno tapa a otro.", "Four independent fixes. None covers for another.")
          : pick(lang, "Activa cada arreglo. Fíjate en que cerrar uno no cierra los demás.", "Switch each fix on. Notice that closing one does not close the others.")}
      </p>
    </div>
  );
}
