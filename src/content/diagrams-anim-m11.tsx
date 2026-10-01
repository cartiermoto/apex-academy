"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";
import { Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 11's interactive diagrams, told through its workshops: opening the
 * box of the ERP bridge — callouts, JSON, Named Credentials, Apex REST, SOAP
 * and retries.
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

/* ------------------------------------------------ 1. the request and what comes back --- */

export function RequestPlay({ lang }: P) {
  const [answer, setAnswer] = useState(0); // 0 200 · 1 404 · 2 500 · 3 no response
  const [sent, setSent] = useState(false);
  const answers = [
    { label: "200", status: "200", body: '{"erpCode":"ERP-100","amount":12500.00,"status":"PAID"}', tone: "ok" as Tone, say: pick(lang, "Éxito: el cuerpo trae la renovación. Tu código puede usarlo.", "Success: the body carries the renewal. Your code can use it.") },
    { label: "404", status: "404", body: '{"error":"Not found"}', tone: "bad" as Tone, say: pick(lang, "No existe en el ERP. http.send no lanza nada: si no miras getStatusCode(), tratarás este cuerpo como si fuera una renovación.", "It does not exist in the ERP. http.send throws nothing: if you do not check getStatusCode(), you will treat this body as if it were a renewal.") },
    { label: "500", status: "500", body: "Internal Server Error", tone: "bad" as Tone, say: pick(lang, "El ERP se ha roto. Tampoco hay excepción: la respuesta vuelve con su 500 y tu código sigue.", "The ERP broke. No exception either: the response comes back with its 500 and your code goes on.") },
    { label: pick(lang, "No responde", "No response"), status: "—", body: "System.CalloutException: Read timed out", tone: "bad" as Tone, say: pick(lang, "Aquí sí salta una excepción: no ha vuelto ninguna respuesta antes de que se agotara la espera.", "Here an exception is thrown: no response came back before the wait ran out.") },
  ];
  const cur = answers[answer];
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "LA PETICIÓN", "THE REQUEST")}</p>
      <Code>{`GET  callout:ERP/renewals/ERP-100\nreq.setTimeout(20000);`}</Code>
      <p className={`${eyebrow} mt-3`}>{pick(lang, "EL ERP CONTESTA…", "THE ERP ANSWERS…")}</p>
      <div className="flex flex-wrap gap-2">
        {answers.map((a, n) => (
          <button key={a.label} type="button" className="btn btn-ghost" aria-pressed={answer === n} onClick={() => { setAnswer(n); setSent(false); }}>
            {a.label}
          </button>
        ))}
        <button type="button" className="btn btn-primary" onClick={() => setSent(true)}>
          {pick(lang, "▶ http.send(req)", "▶ http.send(req)")}
        </button>
      </div>
      {sent && (
        <div key={answer} className="diag-pop mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="t-small text-ink">getStatusCode():</span>
            <Tag tone={cur.tone}>{cur.status}</Tag>
          </div>
          <p className="t-small mt-2 rounded-[4px] p-2 font-mono [overflow-wrap:anywhere]" style={{ background: "var(--c-surface-2)" }}>
            {cur.body}
          </p>
          <p className="t-small mt-2 text-muted" aria-live="polite">
            {cur.say}
          </p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------ 2. JSON into a mould --- */

export function JsonMouldPlay({ lang }: P) {
  const variants = [
    { label: pick(lang, "Completo", "Complete"), json: '{"erpCode":"ERP-100","amount":12500.00,"status":"PAID"}', obj: { erpCode: "'ERP-100'", amount: "12500.00", status: "'PAID'" }, say: pick(lang, "Cada nombre del JSON cae en el atributo que se llama igual.", "Each JSON name lands in the attribute with the same name.") },
    { label: pick(lang, "Con un campo de más", "With an extra field"), json: '{"erpCode":"ERP-100","amount":12500.00,"status":"PAID","currency":"EUR"}', obj: { erpCode: "'ERP-100'", amount: "12500.00", status: "'PAID'" }, say: pick(lang, "currency no tiene sitio en el molde: se ignora, sin error.", "currency has no place in the mould: it is ignored, with no error.") },
    { label: pick(lang, "Con un campo de menos", "With a field missing"), json: '{"erpCode":"ERP-100","amount":12500.00}', obj: { erpCode: "'ERP-100'", amount: "12500.00", status: "null" }, say: pick(lang, "El JSON no trae status: el atributo se queda en null. Compruébalo antes de usarlo.", "The JSON carries no status: the attribute stays null. Check it before using it.") },
  ];
  const [k, setK] = useState(0);
  const v = variants[k];
  return (
    <div className="w-full">
      <Tabs items={variants.map((x) => x.label)} value={k} onChange={setK} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className={eyebrow}>{pick(lang, "LO QUE MANDA EL ERP", "WHAT THE ERP SENDS")}</p>
          <p className="t-small rounded-[4px] p-3 font-mono [overflow-wrap:anywhere]" style={codeBox}>
            {v.json}
          </p>
        </div>
        <div>
          <p className={eyebrow}>ErpRenewal</p>
          <ul key={k} className="diag-pop space-y-1">
            {Object.entries(v.obj).map(([name, value]) => (
              <li key={name} className="t-small flex items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
                <span>{name}</span>
                <Tag tone={value === "null" ? "bad" : "ok"}>{value}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {v.say}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 3. key in code vs Named Credential --- */

export function NamedCredentialPlay({ lang }: P) {
  const [nc, setNc] = useState(false);
  const [prod, setProd] = useState(false);
  const rows = nc
    ? [
        { q: pick(lang, "¿Qué se ve en el código?", "What shows in the code?"), a: "callout:Tax_API/v2/rates/ES", tone: "ok" as Tone },
        { q: pick(lang, "¿A dónde llama este entorno?", "Where does this environment call?"), a: prod ? pick(lang, "al sistema de producción", "the production system") : pick(lang, "al sistema de pruebas", "the test system"), tone: "ok" as Tone },
        { q: pick(lang, "¿Cambiar la clave?", "Changing the key?"), a: pick(lang, "el Admin, en Setup: sin desplegar", "the Admin, in Setup: no deployment"), tone: "ok" as Tone },
      ]
    : [
        { q: pick(lang, "¿Qué se ve en el código?", "What shows in the code?"), a: pick(lang, "la dirección y la clave, para cualquiera que lo abra", "the address and the key, for anyone who opens it"), tone: "bad" as Tone },
        { q: pick(lang, "¿A dónde llama este entorno?", "Where does this environment call?"), a: pick(lang, "al sistema de producción, siempre", "the production system, always"), tone: prod ? ("plain" as Tone) : ("bad" as Tone) },
        { q: pick(lang, "¿Cambiar la clave?", "Changing the key?"), a: pick(lang, "cambiar el código y desplegar, con tests", "change the code and deploy, with tests"), tone: "bad" as Tone },
      ];
  return (
    <div className="w-full">
      <Tabs items={[pick(lang, "Dirección y clave en el código", "Address and key in the code"), "Named Credential"]} value={nc ? 1 : 0} onChange={(n) => setNc(n === 1)} />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="t-small text-ink">{pick(lang, "Estás en:", "You are in:")}</span>
        <button type="button" className="btn btn-ghost" aria-pressed={!prod} onClick={() => setProd(false)}>
          Sandbox
        </button>
        <button type="button" className="btn btn-ghost" aria-pressed={prod} onClick={() => setProd(true)}>
          {pick(lang, "Producción", "Production")}
        </button>
      </div>
      <ul key={`${nc}-${prod}`} className="diag-pop space-y-1.5">
        {rows.map((r) => (
          <li key={r.q} className="rounded-[4px] border border-line px-3 py-2">
            <p className="t-micro text-faint">{r.q}</p>
            <p className="t-small [overflow-wrap:anywhere]" style={{ color: r.tone === "ok" ? "var(--c-brand)" : r.tone === "bad" ? "var(--c-danger)" : "var(--c-text)" }}>
              {r.a}
            </p>
          </li>
        ))}
      </ul>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {nc
          ? pick(lang, "El mismo código en los dos entornos: lo que cambia es la configuración de cada uno.", "The same code in both environments: what changes is each one's configuration.")
          : prod
            ? pick(lang, "En producción funciona… con la clave a la vista de todo el equipo.", "In production it works… with the key in the whole team's sight.")
            : pick(lang, "En la sandbox, este código llama al sistema de producción con la clave de producción.", "In the sandbox, this code calls the production system with the production key.")}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 4. knocking on your own door --- */

export function RestDoorPlay({ lang }: P) {
  const calls = [
    { label: "GET /renewals/ERP-100", status: "200", body: '{"erpCode":"ERP-100","stage":"Negotiation","amount":12500.00}', ok: true, say: pick(lang, "Existe una renovación para ERP-100: el objeto que devuelve tu método viaja como JSON.", "A renewal exists for ERP-100: the object your method returns travels as JSON.") },
    { label: "GET /renewals/ERP-999", status: "404", body: "", ok: false, say: pick(lang, "No hay renovación: tu código pone statusCode = 404 y devuelve null. El ERP sabe que no existe sin leer nada más.", "There is no renewal: your code sets statusCode = 404 and returns null. The ERP knows it does not exist without reading anything else.") },
    { label: "POST /renewals/ERP-100", status: "405", body: "", ok: false, say: pick(lang, "La clase no tiene ningún método @HttpPost: Salesforce contesta que ese verbo no está permitido, sin llegar a tu código.", "The class has no @HttpPost method: Salesforce answers that the verb is not allowed, without reaching your code.") },
  ];
  const [k, setK] = useState<number | null>(null);
  const cur = k === null ? null : calls[k];
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "EL ERP LLAMA A /services/apexrest…", "THE ERP CALLS /services/apexrest…")}</p>
      <div className="flex flex-wrap gap-2">
        {calls.map((c, n) => (
          <button key={c.label} type="button" className="btn btn-ghost font-mono" aria-pressed={k === n} onClick={() => setK(n)}>
            {c.label}
          </button>
        ))}
      </div>
      {cur ? (
        <div key={k} className="diag-pop mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="t-small text-ink">{pick(lang, "Salesforce responde:", "Salesforce answers:")}</span>
            <Tag tone={cur.ok ? "ok" : "bad"}>{cur.status}</Tag>
          </div>
          {cur.body && (
            <p className="t-small mt-2 rounded-[4px] p-2 font-mono [overflow-wrap:anywhere]" style={{ background: "var(--c-surface-2)" }}>
              {cur.body}
            </p>
          )}
          <p className="t-small mt-2 text-muted" aria-live="polite">
            {cur.say}
          </p>
        </div>
      ) : (
        <p className="t-small mt-3 text-faint">{pick(lang, "Elige una llamada.", "Pick a call.")}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------ 5. REST and SOAP, side by side --- */

export function RestVsSoapPlay({ lang }: P) {
  const [soap, setSoap] = useState(false);
  return (
    <div className="w-full">
      <Tabs items={["REST", "SOAP"]} value={soap ? 1 : 0} onChange={(n) => setSoap(n === 1)} />
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className={eyebrow}>{pick(lang, "LO QUE VIAJA POR EL CABLE", "WHAT TRAVELS OVER THE WIRE")}</p>
          <Code>
            {soap
              ? `<soapenv:Envelope>\n  <soapenv:Body>\n    <inv:createInvoice>\n      <inv:erpCode>ERP-100</inv:erpCode>\n      <inv:amount>12500.00</inv:amount>\n    </inv:createInvoice>\n  </soapenv:Body>\n</soapenv:Envelope>`
              : `POST /invoices\nContent-Type: application/json\n\n{"erpCode":"ERP-100","amount":12500.00}`}
          </Code>
        </div>
        <div>
          <p className={eyebrow}>{pick(lang, "LO QUE ESCRIBES TÚ", "WHAT YOU WRITE")}</p>
          <Code>
            {soap
              ? `InvoiceService.InvoicePort port =\n    new InvoiceService.InvoicePort();\nport.endpoint_x = 'callout:Invoicing/…';\nString id = port.createInvoice('ERP-100', 12500.00);`
              : `HttpRequest req = new HttpRequest();\nreq.setEndpoint('callout:Invoicing/invoices');\nreq.setMethod('POST');\nreq.setBody(JSON.serialize(row));\nHttpResponse res = new Http().send(req);`}
          </Code>
        </div>
      </div>
      <p className="t-small mt-3 text-muted" aria-live="polite">
        {soap
          ? pick(lang, "El sobre XML es largo y estricto, pero no lo escribes tú: lo montan las clases que Salesforce generó a partir del WSDL.", "The XML envelope is long and strict, but you do not write it: the classes Salesforce generated from the WSDL build it.")
          : pick(lang, "En REST montas la petición a mano: verbo, dirección y un cuerpo en JSON.", "In REST you build the request by hand: verb, address and a JSON body.")}
      </p>
    </div>
  );
}

/* ------------------------------------------------ 6. retries with a cap --- */

export function RetryPlay({ lang }: P) {
  const [recoversAt, setRecoversAt] = useState(2); // attempt on which invoicing is back; 9 = never
  const max = 3;
  const s = useStepper(max + 1, 1200);
  const tried = Math.min(s.i, recoversAt <= max ? recoversAt : max);
  const succeeded = recoversAt <= max && s.i >= recoversAt;
  const exhausted = recoversAt > max && s.i >= max;
  return (
    <div className="w-full">
      <p className={eyebrow}>{pick(lang, "EL SISTEMA DE FACTURACIÓN VUELVE…", "THE INVOICING SYSTEM COMES BACK…")}</p>
      <div className="flex flex-wrap gap-2">
        {[
          { v: 1, l: pick(lang, "Funciona a la primera", "Works first time") },
          { v: 2, l: pick(lang, "Al 2.º intento", "On the 2nd attempt") },
          { v: 3, l: pick(lang, "Al 3.º intento", "On the 3rd attempt") },
          { v: 9, l: pick(lang, "No vuelve", "It does not come back") },
        ].map((o) => (
          <button key={o.v} type="button" className="btn btn-ghost" aria-pressed={recoversAt === o.v} onClick={() => { setRecoversAt(o.v); s.go(0); }}>
            {o.l}
          </button>
        ))}
      </div>
      <ol className="mt-3 space-y-1.5">
        {Array.from({ length: max }, (_, k) => {
          const n = k + 1;
          const ran = n <= tried;
          const ok = ran && n === recoversAt;
          return (
            <li key={`${recoversAt}-${n}`} className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
              InvoiceRetryJob(…, {n})
              {ran && <Tag tone={ok ? "ok" : "bad"}>{ok ? pick(lang, "✓ factura creada", "✓ invoice created") : pick(lang, "✗ ErpApiException", "✗ ErpApiException")}</Tag>}
            </li>
          );
        })}
      </ol>
      <Note lang={lang} s={s}>
        {s.i === 0
          ? pick(lang, "La renovación se cierra y el handler encola el intento 1. Pulsa Reproducir.", "The renewal closes and the handler enqueues attempt 1. Press Play.")
          : succeeded
            ? pick(lang, `Factura creada en el intento ${recoversAt}. No se encola nada más.`, `Invoice created on attempt ${recoversAt}. Nothing else is enqueued.`)
            : exhausted
              ? pick(lang, "Tres intentos y sigue caído: attempt ya no es menor que el máximo, así que no se reencola. Queda constancia del fallo para que alguien lo revise.", "Three attempts and still down: attempt is no longer below the maximum, so it is not re-enqueued. The failure is recorded for someone to review.")
              : pick(lang, `El intento ${s.i} falla y attempt (${s.i}) es menor que 3: se encola el intento ${s.i + 1}.`, `Attempt ${s.i} fails and attempt (${s.i}) is below 3: attempt ${s.i + 1} is enqueued.`)}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------ 7. the whole round trip --- */

export function RoundTripPlay({ lang }: P) {
  const [fixed, setFixed] = useState(true);
  const s = useStepper(4, 1400);
  const renewals = [
    { code: "ERP-100", accepted: true },
    { code: "ERP-200", accepted: false },
    { code: "ERP-300", accepted: true },
  ];
  const marked = (r: { accepted: boolean }) => s.i >= 3 && (fixed ? r.accepted : true);
  const say = [
    pick(lang, "Tres renovaciones pendientes de enviar. Pulsa Reproducir.", "Three renewals waiting to be sent. Press Play."),
    pick(lang, "POST a callout:ERP/renewals, con el cuerpo en JSON.", "POST to callout:ERP/renewals, with the body in JSON."),
    fixed
      ? pick(lang, "El ERP responde 200 con accepted y rejected. El código comprueba el 200 y lee la respuesta con sus moldes.", "The ERP answers 200 with accepted and rejected. The code checks the 200 and reads the response with its moulds.")
      : pick(lang, "El ERP responde 200 con accepted y rejected… y la caja vieja tira la respuesta sin leerla.", "The ERP answers 200 with accepted and rejected… and the old box throws the response away unread."),
    fixed
      ? pick(lang, "Solo ERP-100 y ERP-300 quedan como enviadas. ERP-200 sigue pendiente, y su motivo vuelve en el resultado.", "Only ERP-100 and ERP-300 end up as sent. ERP-200 stays pending, and its reason comes back in the result.")
      : pick(lang, "Las tres quedan como enviadas, también ERP-200, que el ERP rechazó. Nadie volverá a intentarla.", "All three end up as sent, including ERP-200, which the ERP rejected. Nobody will try it again."),
  ][s.i];
  return (
    <div className="w-full">
      <Tabs items={[pick(lang, "La caja vieja", "The old box"), pick(lang, "Tu entrega", "Your delivery")]} value={fixed ? 1 : 0} onChange={(n) => { setFixed(n === 1); s.go(0); }} />
      <ul className="space-y-1.5">
        {renewals.map((r) => (
          <li key={r.code} className="t-small flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-line px-3 py-1.5 font-mono">
            {r.code}
            <span key={`${fixed}-${s.i}`} className="flex flex-wrap gap-1">
              {s.i >= 2 && <Tag tone={r.accepted ? "ok" : "bad"}>{r.accepted ? "accepted" : pick(lang, "rejected · cliente bloqueado", "rejected · customer blocked")}</Tag>}
              {s.i >= 3 && <Tag tone={marked(r) === r.accepted ? "ok" : "bad"}>ERP_Synced__c = {String(marked(r))}</Tag>}
            </span>
          </li>
        ))}
      </ul>
      <Note lang={lang} s={s}>
        {say}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}
