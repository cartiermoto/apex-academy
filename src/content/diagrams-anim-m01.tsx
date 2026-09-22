"use client";

import { Fragment, useState } from "react";
import type { Lang } from "@/lib/types";
import { Controls, Note, Tabs, codeBox, pick, useStepper } from "./diagrams-anim";

/**
 * Module 1's step-by-step diagrams.
 *
 * Same contract as diagrams-anim.tsx: plain HTML, Play / Back / Next, one live
 * note per step, movement done in CSS so reduced-motion turns it into jumps.
 */

type P = { lang: Lang };

/* ---------------------------------------------------------------- shared --- */

type Seg = { code: string; step: number };

/** A line of code whose pieces light up as the walkthrough advances. */
function CodeSegs({ assign, segs, i }: { assign?: string; segs: Seg[]; i: number }) {
  return (
    <div className="rounded-[4px] px-3 py-3 font-mono text-[13px] leading-[1.9]" style={codeBox}>
      {assign && <span className="text-faint">{assign}</span>}
      {segs.map((g, n) => {
        const state = g.step === i ? "cur" : g.step < i ? "done" : "next";
        return (
          <Fragment key={n}>
            {n > 0 && <wbr />}
            <span
              className="whitespace-nowrap rounded-[3px] transition-colors duration-300"
              style={{
                padding: "2px 1px",
                background: state === "cur" ? "var(--c-brand-soft)" : "transparent",
                boxShadow: state === "cur" ? "inset 0 -2px 0 var(--c-brand)" : "none",
                color: state === "cur" ? "var(--c-brand)" : state === "done" ? "var(--c-heading)" : "var(--c-text-faint)",
                fontWeight: state === "cur" ? 600 : 400,
              }}
            >
              {g.code}
            </span>
          </Fragment>
        );
      })}
    </div>
  );
}

/** A labelled card whose rows fill in as the walkthrough advances. */
function FieldCard({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ k: string; v: string; filled: boolean; tone?: "brand" | "warn" }>;
}) {
  return (
    <div className="rounded-[4px] border px-3 py-2.5" style={{ borderColor: "var(--c-border)" }}>
      <p className="t-micro mb-2 font-semibold tracking-[0.06em] text-faint">{title}</p>
      <ul className="space-y-1.5">
        {rows.map((r) => (
          <li key={r.k} className="flex items-baseline gap-2 font-mono text-[13px]">
            <span className="w-[92px] shrink-0 text-faint">{r.k}</span>
            <span
              key={`${r.k}-${r.v}`}
              className={r.filled ? "diag-pop font-semibold" : ""}
              style={{
                color: !r.filled
                  ? "var(--c-text-faint)"
                  : r.tone === "warn"
                    ? "var(--c-warn)"
                    : r.tone === "brand"
                      ? "var(--c-brand)"
                      : "var(--c-text)",
              }}
            >
              {r.v}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Value + type pill, used where a value travels through steps. */
function ValuePill({ value, type, current }: { value: string; type: string; current: boolean }) {
  return (
    <span
      className="inline-flex flex-col rounded-[4px] border px-2.5 py-1.5"
      style={{
        borderColor: current ? "var(--c-brand)" : "var(--c-border)",
        background: current ? "var(--c-brand-soft)" : "transparent",
      }}
    >
      <span className="font-mono text-[13px] whitespace-pre text-ink">{value}</span>
      <span className="t-micro text-faint">{type}</span>
    </span>
  );
}

/* ------------------------------------------------ 1. variable anatomy ----- */

export function VariableAnatomyPlay({ lang }: P) {
  const segs: Seg[] = [
    { code: "Integer", step: 0 },
    { code: " maxDiscount", step: 1 },
    { code: " =", step: 2 },
    { code: " 20", step: 3 },
    { code: ";", step: 4 },
  ];
  const notes = [
    pick(
      lang,
      "El tipo: qué cabe dentro. Es exactamente el primer paso del asistente de campo personalizado, cuando eliges entre Text, Number o Checkbox. Y es una promesa: si luego intentas meter un texto, no compila.",
      "The type: what fits inside. It is exactly the first step of the custom-field wizard, where you choose between Text, Number or Checkbox. And it is a promise: try to put text in later and it will not compile.",
    ),
    pick(
      lang,
      "El nombre: cómo la llamas tú. Por convención empieza en minúscula y cada palabra siguiente va en mayúscula (maxDiscount), igual que los nombres de API a los que ya estás acostumbrado.",
      "The name: what you call it. By convention it starts lower case and each following word is capitalised (maxDiscount), much like the API names you are used to.",
    ),
    pick(
      lang,
      "La asignación: «guarda esto ahí». Un solo igual guarda; dos iguales comparan. Ese carácter de diferencia es el error más repetido de la sub-lección 7.",
      "The assignment: “store this there”. One equals stores; two equals compare. That one-character difference is the most repeated mistake in sub-lesson 7.",
    ),
    pick(
      lang,
      "El valor: lo que hay dentro hoy. Tiene que encajar con el tipo prometido arriba, y puede cambiar más adelante… salvo que declares la variable como final.",
      "The value: what is inside today. It has to match the type promised above, and it can change later… unless you declare the variable final.",
    ),
    pick(
      lang,
      "El punto y coma cierra la instrucción. No es decorativo: sin él, el compilador sigue leyendo la línea siguiente como si fuera parte de esta y el error que ves señala a otro sitio.",
      "The semicolon ends the statement. It is not decoration: without it the compiler reads the next line as part of this one, and the error it shows points somewhere else.",
    ),
  ];
  const s = useStepper(5);

  const rows = [
    { k: pick(lang, "Tipo", "Type"), v: s.i >= 0 ? "Integer" : "—", filled: true, tone: "brand" as const },
    { k: pick(lang, "Nombre", "Name"), v: s.i >= 1 ? "maxDiscount" : "—", filled: s.i >= 1 },
    { k: pick(lang, "Valor", "Value"), v: s.i >= 3 ? "20" : pick(lang, "(vacío)", "(empty)"), filled: s.i >= 3 },
  ];

  return (
    <div className="w-full">
      <CodeSegs segs={segs} i={s.i} />
      <div className="mt-4">
        <FieldCard title={pick(lang, "LA VARIABLE, POR DENTRO", "THE VARIABLE, INSIDE")} rows={rows} />
      </div>
      <Note lang={lang} s={s}>
        {notes[s.i]}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------- 2. choosing a type ----- */

const NUM_TYPES = ["Integer", "Long", "Decimal", "Double", "Boolean", "Id", "Blob"];

export function NumberTypesPlay({ lang }: P) {
  const cases: Array<{
    label: string;
    value: string;
    steps: Array<{ out: string[]; note: string }>;
  }> = [
    {
      label: pick(lang, "Importe del contrato", "Contract amount"),
      value: "24500.75",
      steps: [
        {
          out: [],
          note: pick(
            lang,
            "El dato es 24500.75: el importe firmado de un contrato. Siete tipos posibles sobre la mesa; vamos descartando con preguntas, igual que eliges el tipo de un campo en Setup.",
            "The value is 24500.75: a signed contract amount. Seven possible types on the table; we rule them out with questions, just as you pick a field type in Setup.",
          ),
        },
        {
          out: ["Integer", "Long", "Boolean", "Id", "Blob"],
          note: pick(
            lang,
            "¿Tiene decimales? Sí. Fuera todo lo que no los admite: Integer y Long cortan la parte decimal, y Boolean, Id y Blob ni siquiera son números.",
            "Does it have decimals? Yes. Out go the ones that do not take them: Integer and Long chop the decimals off, and Boolean, Id and Blob are not numbers at all.",
          ),
        },
        {
          out: ["Integer", "Long", "Boolean", "Id", "Blob", "Double"],
          note: pick(
            lang,
            "¿Hace falta exactitud? Es dinero, así que sí. Double aproxima —0.1 + 0.2 no da exactamente 0.3— y en una factura eso se acaba viendo. Fuera Double.",
            "Does it need to be exact? It is money, so yes. Double approximates — 0.1 + 0.2 is not exactly 0.3 — and on an invoice that eventually shows. Out goes Double.",
          ),
        },
        {
          out: ["Integer", "Long", "Boolean", "Id", "Blob", "Double"],
          note: pick(
            lang,
            "Queda Decimal, y es la respuesta: Decimal contractAmount = 24500.75; La regla corta es «dinero siempre Decimal», la misma que ya aplicas cuando eliges Currency en vez de Number.",
            "Decimal is left, and it is the answer: Decimal contractAmount = 24500.75; The short rule is “money is always Decimal”, the same one you apply when you choose Currency over Number.",
          ),
        },
      ],
    },
    {
      label: pick(lang, "Número de empleados", "Employee count"),
      value: "340",
      steps: [
        {
          out: [],
          note: pick(lang, "El dato es 340: cuántos empleados tiene la cuenta.", "The value is 340: how many employees the account has."),
        },
        {
          out: ["Decimal", "Double", "Boolean", "Id", "Blob"],
          note: pick(
            lang,
            "¿Tiene decimales? No: medio empleado no existe. Fuera Decimal y Double, y fuera lo que no es número.",
            "Does it have decimals? No: half an employee does not exist. Out go Decimal and Double, and out goes anything that is not a number.",
          ),
        },
        {
          out: ["Decimal", "Double", "Boolean", "Id", "Blob", "Long"],
          note: pick(
            lang,
            "¿Se pasa de unos 2.100 millones? Ni de lejos. Long existe para milisegundos o identificadores externos enormes; aquí sobra.",
            "Does it go past about 2.1 billion? Not remotely. Long exists for milliseconds or huge external identifiers; here it is overkill.",
          ),
        },
        {
          out: ["Decimal", "Double", "Boolean", "Id", "Blob", "Long"],
          note: pick(
            lang,
            "Integer: Integer employeeCount = 340; Ojo con una trampa que verás en el quiz: entre Integers, 9 / 4 da 2, no 2.25.",
            "Integer: Integer employeeCount = 340; Mind one trap you will meet in the quiz: between Integers, 9 / 4 gives 2, not 2.25.",
          ),
        },
      ],
    },
    {
      label: pick(lang, "¿Cuenta estratégica?", "Key account?"),
      value: "true",
      steps: [
        {
          out: [],
          note: pick(lang, "El dato responde a una pregunta de sí o no: ¿es una cuenta estratégica?", "The value answers a yes/no question: is this a key account?"),
        },
        {
          out: ["Integer", "Long", "Decimal", "Double", "Id", "Blob"],
          note: pick(
            lang,
            "Solo hay dos respuestas posibles, así que ningún tipo numérico encaja. Es el checkbox de Salesforce: Boolean isKeyAccount = true;",
            "There are only two possible answers, so no numeric type fits. It is the Salesforce checkbox: Boolean isKeyAccount = true;",
          ),
        },
        {
          out: ["Integer", "Long", "Decimal", "Double", "Id", "Blob"],
          note: pick(
            lang,
            "Con un matiz que no tiene el checkbox del formato de página: un Boolean de Apex puede valer true, false… o null, si nadie lo ha rellenado todavía. Eso es la sub-lección 6.",
            "With one wrinkle the page-layout checkbox does not have: an Apex Boolean can be true, false… or null, if nobody has filled it in yet. That is sub-lesson 6.",
          ),
        },
      ],
    },
  ];

  const [c, setC] = useState(0);
  const cfg = cases[c];
  const s = useStepper(cfg.steps.length, 2000);
  const st = cfg.steps[s.i];

  return (
    <div className="w-full">
      <Tabs
        items={cases.map((x) => x.label)}
        value={c}
        onChange={(n) => {
          setC(n);
          s.go(0);
        }}
      />
      <p className="t-small mb-3 text-muted">
        {pick(lang, "El dato: ", "The value: ")}
        <code className="font-mono text-[13px] font-semibold text-ink">{cfg.value}</code>
      </p>

      <ul className="flex flex-wrap gap-2">
        {NUM_TYPES.map((t) => {
          const out = st.out.includes(t);
          const winner = s.i === cfg.steps.length - 1 && !out;
          return (
            <li
              key={t}
              className="rounded-full border px-3 py-1 font-mono text-[13px] transition-all duration-300"
              style={{
                borderColor: out ? "var(--c-border)" : winner ? "var(--c-brand)" : "var(--c-border-strong)",
                background: winner ? "var(--c-brand-soft)" : "transparent",
                color: out ? "var(--c-text-faint)" : winner ? "var(--c-brand)" : "var(--c-text)",
                textDecoration: out ? "line-through" : "none",
                fontWeight: winner ? 600 : 400,
              }}
            >
              {t}
            </li>
          );
        })}
      </ul>

      <Note lang={lang} s={s}>
        {st.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* --------------------------------------------- 3. anatomy of a method ----- */

export function MethodAnatomyPlay({ lang }: P) {
  const segs: Seg[] = [
    { code: "rawName", step: 0 },
    { code: ".", step: 1 },
    { code: "toUpperCase", step: 2 },
    { code: "()", step: 3 },
    { code: ";", step: 4 },
  ];
  const notes = [
    pick(
      lang,
      "El dato. Aquí es una variable de texto, pero podría ser un campo de un registro o el resultado de otro método. Lo importante es su tipo: un String solo sabe hacer cosas de String.",
      "The value. Here it is a text variable, but it could be a record's field or another method's result. What matters is its type: a String only knows how to do String things.",
    ),
    pick(
      lang,
      "El punto significa «oye, tú, hazme algo». Es el mismo punto que ya usas en fórmulas para cruzar objetos (Account.Name), solo que aquí lo que pides es una acción, no un campo.",
      "The dot means “hey, you, do something for me”. It is the same dot you already use in formulas to cross objects (Account.Name), except here you are asking for an action, not a field.",
    ),
    pick(
      lang,
      "El nombre de la acción. En fórmulas la escribías delante —UPPER(Name)— y aquí va detrás del dato. Es la misma idea con otra puntuación.",
      "The name of the action. In formulas you wrote it in front — UPPER(Name) — and here it goes after the value. Same idea, different punctuation.",
    ),
    pick(
      lang,
      "Los paréntesis son los que ejecutan. Sin ellos escribirías solo el nombre de la acción, que no vale de nada. Dentro van los argumentos: trim() no necesita ninguno, replace('a', 'b') necesita dos.",
      "The brackets are what actually run it. Without them you would just be writing the name of the action, which is useless. Inside go the arguments: trim() needs none, replace('a', 'b') needs two.",
    ),
    pick(
      lang,
      "Y aquí está la trampa: el método devuelve un texto NUEVO y el original no se toca. Esta línea calcula '  ACME CORP  ' y lo tira a la basura, porque nadie lo guardó en ninguna variable.",
      "And here is the trap: the method returns a NEW text and the original is untouched. This line computes '  ACME CORP  ' and throws it away, because nobody stored it in any variable.",
    ),
  ];
  const s = useStepper(5);

  return (
    <div className="w-full">
      <CodeSegs segs={segs} i={s.i} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <FieldCard
          title={pick(lang, "EL ORIGINAL (rawName)", "THE ORIGINAL (rawName)")}
          rows={[{ k: pick(lang, "vale", "holds"), v: "'  acme corp  '", filled: true }]}
        />
        <FieldCard
          title={pick(lang, "LO QUE DEVUELVE", "WHAT IT RETURNS")}
          rows={[
            {
              k: pick(lang, "valor", "value"),
              v: s.i >= 4 ? "'  ACME CORP  '" : pick(lang, "(aún nada)", "(nothing yet)"),
              filled: s.i >= 4,
              tone: "brand",
            },
            { k: pick(lang, "guardado", "stored"), v: s.i >= 4 ? pick(lang, "en ningún sitio", "nowhere") : "—", filled: s.i >= 4, tone: "warn" },
          ]}
        />
      </div>

      <Note lang={lang} s={s}>
        {notes[s.i]}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* --------------------------------------------------- 4. date vs datetime -- */

export function DateTimePlay({ lang }: P) {
  const tabs: Array<{
    label: string;
    code: string;
    steps: Array<{ note: string; stored?: string; madrid?: string; london?: string }>;
  }> = [
    {
      label: "Datetime",
      code: "Datetime createdAt = Datetime.now();",
      steps: [
        {
          note: pick(
            lang,
            "Un pedido se crea a las 00:30 del 16 de marzo, hora de Madrid. Datetime guarda un instante exacto: día y hora.",
            "An order is created at 00:30 on 16 March, Madrid time. A Datetime stores an exact instant: day and time.",
          ),
          madrid: "16/03 00:30",
        },
        {
          note: pick(
            lang,
            "Salesforce no guarda «las 00:30 de Madrid»: guarda el instante en GMT, que en marzo son 23:30 del día anterior. El dato es uno solo.",
            "Salesforce does not store “00:30 Madrid”: it stores the instant in GMT, which in March is 23:30 the previous day. There is only one value.",
          ),
          stored: "15/03 23:30 GMT",
          madrid: "16/03 00:30",
        },
        {
          note: pick(
            lang,
            "Tu compañero de Londres abre el mismo registro y ve 15/03 23:30. Nadie se ha equivocado: es el mismo instante con otra etiqueta, la de su zona horaria.",
            "Your colleague in London opens the same record and sees 15/03 23:30. Nobody made a mistake: it is the same instant with a different label, the one for their zone.",
          ),
          stored: "15/03 23:30 GMT",
          madrid: "16/03 00:30",
          london: "15/03 23:30",
        },
        {
          note: pick(
            lang,
            "Y aquí aparece el informe que «estaba mal»: agrupado por día, ese pedido cae en el 15 o en el 16 según quién mire. En Apex lo decides tú: createdAt.date() da el día del usuario y createdAt.dateGMT() el de GMT.",
            "And here is the report that was “wrong”: grouped by day, that order lands on the 15th or the 16th depending on who is looking. In Apex you decide: createdAt.date() gives the user's day and createdAt.dateGMT() the GMT one.",
          ),
          stored: "15/03 23:30 GMT",
          madrid: "16/03 00:30",
          london: "15/03 23:30",
        },
      ],
    },
    {
      label: "Date",
      code: "Date closeDate = Date.newInstance(2026, 3, 15);",
      steps: [
        {
          note: pick(
            lang,
            "Una fecha de cierre no es un instante: es un día. Date no guarda hora, y eso es una ventaja, no una carencia.",
            "A close date is not an instant: it is a day. Date stores no time, and that is a feature, not a gap.",
          ),
          stored: "2026-03-15",
        },
        {
          note: pick(
            lang,
            "Sin hora no hay zona horaria que aplicar, así que el 15 de marzo es el 15 de marzo en Madrid, en Londres y en Sídney. Nadie ve un día distinto.",
            "With no time there is no zone to apply, so 15 March is 15 March in Madrid, in London and in Sydney. Nobody sees a different day.",
          ),
          stored: "2026-03-15",
          madrid: "15/03",
          london: "15/03",
        },
        {
          note: pick(
            lang,
            "Regla práctica: fecha de cierre, cumpleaños o vencimiento → Date. Creación de un registro, marca de tiempo o SLA → Datetime. Usar Datetime donde bastaba Date es importar un problema que no tenías.",
            "Rule of thumb: close date, birthday or due date → Date. Record creation, timestamp or SLA → Datetime. Using Datetime where Date was enough imports a problem you did not have.",
          ),
          stored: "2026-03-15",
          madrid: "15/03",
          london: "15/03",
        },
      ],
    },
  ];

  const [t, setT] = useState(0);
  const cfg = tabs[t];
  const s = useStepper(cfg.steps.length, 2100);
  const st = cfg.steps[s.i];

  return (
    <div className="w-full">
      <Tabs
        items={tabs.map((x) => x.label)}
        value={t}
        onChange={(n) => {
          setT(n);
          s.go(0);
        }}
      />
      <div className="rounded-[4px] px-3 py-2.5 font-mono text-[12.5px]" style={codeBox}>
        {cfg.code}
      </div>

      <div className="mt-4">
        <FieldCard
          title={pick(lang, "EL MISMO DATO, TRES LECTURAS", "ONE VALUE, THREE READINGS")}
          rows={[
            { k: pick(lang, "guardado", "stored"), v: st.stored ?? "—", filled: Boolean(st.stored), tone: "brand" },
            { k: pick(lang, "en Madrid", "in Madrid"), v: st.madrid ?? "—", filled: Boolean(st.madrid) },
            { k: pick(lang, "en Londres", "in London"), v: st.london ?? "—", filled: Boolean(st.london), tone: t === 0 ? "warn" : undefined },
          ]}
        />
      </div>

      <Note lang={lang} s={s}>
        {st.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ----------------------------------------------- 5. an sObject in memory -- */

export function SObjectPlay({ lang }: P) {
  const steps: Array<{ code: string; note: string; name?: string; industry?: string; id: string; idTone?: "warn" | "brand" }> = [
    {
      code: "Account a = new Account();",
      note: pick(
        lang,
        "new Account() fabrica una fila con el molde que define Object Manager. Existe solo en la memoria de esta transacción: en la base de datos todavía no hay nada.",
        "new Account() casts a row from the mould Object Manager defines. It exists only in this transaction's memory: there is still nothing in the database.",
      ),
      id: "null",
      idTone: "warn",
    },
    {
      code: "a.Name = 'Acme Corp';",
      note: pick(
        lang,
        "El punto significa «el campo de». Esto es lo mismo que teclear el nombre en la pantalla de edición, pero sin haber pulsado Guardar todavía.",
        "The dot means “the field of”. This is the same as typing the name on the edit screen, but without having pressed Save yet.",
      ),
      name: "'Acme Corp'",
      id: "null",
      idTone: "warn",
    },
    {
      code: "a.Industry = 'Technology';",
      note: pick(
        lang,
        "Se escribe el nombre de API, no la etiqueta: en el formato de página pone «Sector», y en Apex se escribe Industry. Un campo personalizado llevaría __c al final.",
        "You write the API name, not the label: the page layout says “Industry Sector”, and in Apex you write Industry. A custom field would end in __c.",
      ),
      name: "'Acme Corp'",
      industry: "'Technology'",
      id: "null",
      idTone: "warn",
    },
    {
      code: "System.debug(a.Id);   // null",
      note: pick(
        lang,
        "El Id sigue vacío, y esa es la pista de que el registro no está guardado: el Id lo pone la plataforma en el momento de guardar, nunca tú. Si necesitas el Id, necesitas un insert primero.",
        "The Id is still empty, and that is the tell that the record is not saved: the platform assigns the Id at save time, never you. If you need the Id, you need an insert first.",
      ),
      name: "'Acme Corp'",
      industry: "'Technology'",
      id: "null",
      idTone: "warn",
    },
    {
      code: "insert a;   // Módulo 4",
      note: pick(
        lang,
        "Con insert (Módulo 4) la fila viaja a la base de datos y vuelve con Id. Hasta entonces, todo lo que has escrito desaparece en cuanto acaba la transacción: es una hoja de papel, no un registro.",
        "With insert (Module 4) the row travels to the database and comes back with an Id. Until then, everything you wrote vanishes as soon as the transaction ends: it is a sheet of paper, not a record.",
      ),
      name: "'Acme Corp'",
      industry: "'Technology'",
      id: "001xx0000000001AAA",
      idTone: "brand",
    },
  ];

  const s = useStepper(steps.length, 2000);
  const st = steps[s.i];

  return (
    <div className="w-full">
      <div className="rounded-[4px] px-3 py-2.5 font-mono text-[12.5px]" style={codeBox}>
        <code key={s.i} className="diag-pop block">
          {st.code}
        </code>
      </div>

      <div className="mt-4">
        <FieldCard
          title={pick(lang, "EL REGISTRO, EN MEMORIA", "THE RECORD, IN MEMORY")}
          rows={[
            { k: "Name", v: st.name ?? "—", filled: Boolean(st.name) },
            { k: "Industry", v: st.industry ?? "—", filled: Boolean(st.industry) },
            { k: "Id", v: st.id, filled: true, tone: st.idTone },
          ]}
        />
      </div>

      <Note lang={lang} s={s}>
        {st.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------------------------------- 6. null ---- */

export function NullPlay({ lang }: P) {
  const values = ["null", "''", "'   '"];
  const checks: Array<{ code: string; res: boolean[]; note: string }> = [
    {
      code: "region == null",
      res: [true, false, false],
      note: pick(
        lang,
        "«No hay caja»: nunca se respondió a esa pregunta. Solo el primer caso es null; la cadena vacía y la de espacios SÍ son textos, aunque no se vea nada en la pantalla.",
        "“There is no box”: that question was never answered. Only the first case is null; the empty string and the spaces string ARE texts, even though the screen shows nothing.",
      ),
    },
    {
      code: "String.isEmpty(region)",
      res: [true, true, false],
      note: pick(
        lang,
        "isEmpty() cubre el null y la cadena vacía. Pero '   ' tiene tres caracteres, así que para Apex no está vacía: es exactamente el caso que manda un formulario web cuando alguien pulsa la barra espaciadora.",
        "isEmpty() covers null and the empty string. But '   ' has three characters, so to Apex it is not empty: exactly what a web form sends when somebody hits the space bar.",
      ),
    },
    {
      code: "String.isBlank(region)",
      res: [true, true, true],
      note: pick(
        lang,
        "isBlank() es el único que dice «no hay nada útil aquí» en los tres casos. Por eso es el método más usado de todo el módulo, y el que salva de la mayoría de los errores en producción.",
        "isBlank() is the only one that says “there is nothing useful here” in all three cases. That is why it is the most used method in the whole module, and the one that prevents most production errors.",
      ),
    },
  ];
  const steps = checks.length + 2;
  const s = useStepper(steps, 2100);

  const intro = pick(
    lang,
    "Tres cosas que parecen lo mismo en la pantalla y no lo son: un campo que nunca se rellenó (null), uno que se rellenó con nada ('') y uno con espacios ('   '). Vamos a preguntarle a cada uno lo mismo.",
    "Three things that look identical on screen and are not: a field never filled in (null), one filled with nothing ('') and one with spaces ('   '). We are going to ask each of them the same questions.",
  );
  const outro = pick(
    lang,
    "Y una cuarta cosa distinta: el 0. Un importe de 0 € sí se midió y dio cero, así que no es «vacío». Ojo también con lo que NO se puede hacer: region.toUpperCase() sobre null lanza NullPointerException y detiene la transacción entera.",
    "And a fourth, different thing: 0. An amount of €0 was measured and came out zero, so it is not “empty”. Mind also what you cannot do: region.toUpperCase() on null throws NullPointerException and stops the whole transaction.",
  );

  const shown = Math.max(0, Math.min(checks.length, s.i));

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr>
              <th className="t-micro pb-2 font-semibold tracking-[0.06em] text-faint">
                {pick(lang, "LA PREGUNTA", "THE QUESTION")}
              </th>
              {values.map((v) => (
                <th key={v} className="pb-2 text-center font-mono text-[13px] text-ink">
                  {v}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checks.slice(0, shown).map((c, n) => (
              <tr key={c.code} className="diag-pop border-t" style={{ borderColor: "var(--c-border)" }}>
                <td className="py-2 pr-3 font-mono text-[12.5px] text-ink">{c.code}</td>
                {c.res.map((r, k) => (
                  <td key={k} className="py-2 text-center">
                    <span
                      className="t-micro rounded-full px-2 py-0.5 font-mono font-semibold"
                      style={{
                        color: r ? "var(--c-brand)" : "var(--c-text-faint)",
                        background: r ? "var(--c-brand-soft)" : "transparent",
                        outline: n === s.i - 1 && r ? "1px solid var(--c-brand)" : "none",
                      }}
                    >
                      {r ? "true" : "false"}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Note lang={lang} s={s}>
        {s.i === 0 ? intro : s.i <= checks.length ? checks[s.i - 1].note : outro}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* -------------------------------------------------------- 7. operators ---- */

export function OperatorsPlay({ lang }: P) {
  const tabs: Array<{
    label: string;
    steps: Array<{ segs: Seg[]; assign?: string; note: string; value?: string; type?: string }>;
  }> = [
    {
      label: pick(lang, "= o ==", "= or =="),
      steps: [
        {
          segs: [
            { code: "String stage = 'Prospecting';", step: 0 },
          ],
          note: pick(
            lang,
            "Partimos de una oportunidad en fase Prospecting. Un solo igual GUARDA un valor en la variable.",
            "We start from an opportunity in the Prospecting stage. One equals STORES a value in the variable.",
          ),
          value: "'Prospecting'",
          type: pick(lang, "stage vale", "stage holds"),
        },
        {
          segs: [{ code: "stage = 'Closed Won';", step: 1 }],
          note: pick(
            lang,
            "Otro igual solo, y la fase cambia. No hay pregunta ninguna: esta línea no devuelve true ni false, simplemente machaca lo que había.",
            "Another single equals, and the stage changes. There is no question here: this line returns neither true nor false, it just overwrites what was there.",
          ),
          value: "'Closed Won'",
          type: pick(lang, "stage vale", "stage holds"),
        },
        {
          segs: [{ code: "Boolean isWon = stage == 'Closed Won';", step: 2 }],
          note: pick(
            lang,
            "Dos iguales PREGUNTAN, y la respuesta es un Boolean. La variable no se toca: stage sigue valiendo lo mismo después de comparar.",
            "Two equals ASK, and the answer is a Boolean. The variable is untouched: stage holds the same value after comparing.",
          ),
          value: "true",
          type: "isWon",
        },
        {
          segs: [{ code: "if (stage = 'Closed Won') { … }", step: 3 }],
          note: pick(
            lang,
            "Y este es el error clásico: dentro de un if, un solo igual no compara, asigna. En Apex ni siquiera compila —el if espera un Boolean y recibe un String—, y ese regalo te lo hace el compilador. En una regla de validación no tendrías esa red.",
            "And here is the classic mistake: inside an if, one equals does not compare, it assigns. In Apex it does not even compile — the if expects a Boolean and gets a String — and that gift comes from the compiler. A validation rule would give you no such net.",
          ),
          value: pick(lang, "no compila", "does not compile"),
          type: pick(lang, "resultado", "result"),
        },
      ],
    },
    {
      label: pick(lang, "Precedencia", "Precedence"),
      steps: [
        {
          assign: "Decimal total = ",
          segs: [
            { code: "base", step: 9 },
            { code: " + ", step: 9 },
            { code: "base * taxRate", step: 9 },
            { code: ";", step: 9 },
          ],
          note: pick(
            lang,
            "base vale 1000 y taxRate vale 0.21. La línea tiene dos operaciones, y el orden en que se resuelven no lo eliges tú: lo manda la precedencia, la misma de las matemáticas del colegio.",
            "base is 1000 and taxRate is 0.21. The line has two operations, and the order they resolve in is not yours to choose: precedence decides, the same rules as school maths.",
          ),
        },
        {
          assign: "Decimal total = ",
          segs: [
            { code: "base", step: 9 },
            { code: " + ", step: 9 },
            { code: "base * taxRate", step: 1 },
            { code: ";", step: 9 },
          ],
          note: pick(
            lang,
            "Primero la multiplicación: 1000 * 0.21 = 210. Apex resuelve esta parte aunque esté escrita a la derecha.",
            "The multiplication first: 1000 * 0.21 = 210. Apex resolves this part even though it is written on the right.",
          ),
          value: "210",
          type: pick(lang, "resultado parcial", "partial result"),
        },
        {
          assign: "Decimal total = ",
          segs: [
            { code: "base", step: 2 },
            { code: " + ", step: 2 },
            { code: "210", step: 2 },
            { code: ";", step: 9 },
          ],
          note: pick(
            lang,
            "Y ahora sí, la suma: 1000 + 210 = 1210. Es el importe con el 21 % de impuestos, que era lo que queríamos.",
            "And now the addition: 1000 + 210 = 1210. That is the amount with 21% tax, which is what we wanted.",
          ),
          value: "1210",
          type: "total",
        },
        {
          assign: "Decimal wrong = ",
          segs: [
            { code: "(base + base)", step: 3 },
            { code: " * taxRate", step: 9 },
            { code: ";", step: 9 },
          ],
          note: pick(
            lang,
            "Si lo que querías era otra cosa, los paréntesis mandan sobre la precedencia: (1000 + 1000) * 0.21 = 420. Mismo símbolos, resultado distinto. En una fórmula de Salesforce pasa exactamente igual.",
            "If you wanted something else, brackets beat precedence: (1000 + 1000) * 0.21 = 420. Same symbols, different result. A Salesforce formula behaves exactly the same.",
          ),
          value: "420",
          type: "wrong",
        },
      ],
    },
  ];

  const [t, setT] = useState(0);
  const cfg = tabs[t];
  const s = useStepper(cfg.steps.length, 2000);
  const st = cfg.steps[s.i];

  return (
    <div className="w-full">
      <Tabs
        items={tabs.map((x) => x.label)}
        value={t}
        onChange={(n) => {
          setT(n);
          s.go(0);
        }}
      />
      <CodeSegs assign={st.assign} segs={st.segs} i={t === 0 ? s.i : s.i} />
      {st.value && (
        <p key={`${t}-${s.i}`} className="diag-pop mt-3 flex flex-wrap items-center gap-2 font-mono text-[13px]">
          <span className="text-faint">{st.type} →</span>
          <span
            className="rounded-full px-2.5 py-0.5 font-semibold"
            style={{ color: "var(--c-brand)", background: "var(--c-brand-soft)" }}
          >
            {st.value}
          </span>
        </p>
      )}
      <Note lang={lang} s={s}>
        {st.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* --------------------------------------------------------- 9. casting ----- */

export function CastingPlay({ lang }: P) {
  const steps: Array<{ code: string; value: string; type: string; note: string; tone?: "warn" }> = [
    {
      code: "String raw = '19.99';",
      value: "'19.99'",
      type: "String",
      note: pick(
        lang,
        "El dato llega de un formulario o de una integración, así que llega como texto. Parece un número, pero entre comillas es un String: no sabe multiplicarse.",
        "The value arrives from a form or an integration, so it arrives as text. It looks like a number, but in quotes it is a String: it cannot multiply itself.",
      ),
    },
    {
      code: "Decimal price = Decimal.valueOf(raw);",
      value: "19.99",
      type: "Decimal",
      note: pick(
        lang,
        "Texto → número nunca es automático: se pide con valueOf() sobre el tipo de destino. Es el VALUE() de las fórmulas. Si el texto fuera 'N/A', esta línea reventaría en ejecución.",
        "Text → number is never automatic: you ask for it with valueOf() on the destination type. It is the formulas' VALUE(). If the text were 'N/A', this line would blow up at runtime.",
      ),
    },
    {
      code: "Decimal total = price * 3;",
      value: "59.97",
      type: "Decimal",
      note: pick(
        lang,
        "Aquí hay una conversión que no se ve: el 3 es un Integer y Apex lo convierte solo a Decimal para poder multiplicar. Hacia arriba —de menos preciso a más preciso— es automático y no se pierde nada.",
        "There is an invisible conversion here: 3 is an Integer and Apex widens it to Decimal by itself so it can multiply. Upwards — from less precise to more precise — it is automatic and nothing is lost.",
      ),
    },
    {
      code: "Integer cut = total.intValue();",
      value: "59",
      type: "Integer",
      note: pick(
        lang,
        "Hacia abajo lo tienes que pedir tú, y siempre se pierde algo. intValue() NO redondea: corta. Se acaban de esfumar 97 céntimos sin un solo error en el log.",
        "Downwards you have to ask, and something is always lost. intValue() does NOT round: it truncates. Ninety-seven cents just vanished without a single error in the log.",
      ),
      tone: "warn",
    },
    {
      code: "Decimal rounded = total.setScale(1);",
      value: "60.0",
      type: "Decimal",
      note: pick(
        lang,
        "setScale() sí redondea, y deja el número de decimales que le pidas. Cuando la cifra es dinero, esta es la línea correcta y no la anterior.",
        "setScale() does round, and leaves the number of decimals you ask for. When the figure is money, this is the right line and the previous one is not.",
      ),
    },
    {
      code: "String label = String.valueOf(rounded);",
      value: "'60.0'",
      type: "String",
      note: pick(
        lang,
        "Y de vuelta a texto para mostrarlo, con el mismo valueOf() pero pedido al tipo String. Es el TEXT() de las fórmulas.",
        "And back to text to display it, with the same valueOf() but asked of the String type. It is the formulas' TEXT().",
      ),
    },
    {
      code: "Account acc = (Account) record;",
      value: "Account",
      type: pick(lang, "cómo lo mira Apex", "how Apex sees it"),
      note: pick(
        lang,
        "Esto es el casting de verdad, y es distinto: no transforma nada. El registro siempre fue una Account; lo único que cambia es que ahora Apex te deja pedirle Name o Industry. Si te equivocas de objeto, el error llega en ejecución con un TypeException.",
        "This is the genuine cast, and it is different: it transforms nothing. The record always was an Account; the only change is that Apex now lets you ask it for Name or Industry. Get the object wrong and the error arrives at runtime as a TypeException.",
      ),
    },
  ];

  const s = useStepper(steps.length, 2100);
  const st = steps[s.i];

  return (
    <div className="w-full">
      <div className="rounded-[4px] px-3 py-2.5 font-mono text-[12.5px]" style={codeBox}>
        <code key={s.i} className="diag-pop block">
          {st.code}
        </code>
      </div>

      <ol className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {steps.slice(0, s.i + 1).map((x, n) => (
          <li key={n} className="diag-pop flex items-center gap-1.5">
            {n > 0 && (
              <span aria-hidden className="text-faint">
                →
              </span>
            )}
            <ValuePill value={x.value} type={x.type} current={n === s.i} />
          </li>
        ))}
      </ol>

      <Note lang={lang} s={s}>
        {st.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* --------------------------------------------- 10. checkpoint: the flow --- */

export function CheckpointFlowPlay({ lang }: P) {
  const steps: Array<{ t: string; from: string; code: string; note: string }> = [
    {
      t: pick(lang, "Declarar las variables del caso", "Declare the case variables"),
      from: pick(lang, "L1 · L2", "L1 · L2"),
      code: "final Decimal TAX_RATE = 0.21;",
      note: pick(
        lang,
        "Se empieza eligiendo tipos: Decimal para el dinero y final para lo que no debe cambiar. Esa decisión de treinta segundos es la que evita que el impuesto se toque por accidente más abajo.",
        "You start by choosing types: Decimal for money and final for what must not change. That thirty-second decision is what stops the tax rate being touched by accident further down.",
      ),
    },
    {
      t: pick(lang, "Limpiar y normalizar el texto", "Clean and normalise the text"),
      from: "L3",
      code: "String cleanName = opp.Name.trim();",
      note: pick(
        lang,
        "El nombre llega con espacios, así que se limpia con un método antes de usarlo. Si el dato viniera de un formulario, aquí es donde se encadenarían también toLowerCase() o capitalize().",
        "The name arrives with spaces, so a method cleans it before use. If the value came from a form, this is where you would also chain toLowerCase() or capitalize().",
      ),
    },
    {
      t: pick(lang, "Comprobar si falta el dato", "Check whether the value is missing"),
      from: pick(lang, "L6 · L7", "L6 · L7"),
      code: "Decimal safeAmount = opp.Amount == null ? 0 : opp.Amount;",
      note: pick(
        lang,
        "El importe está vacío, y esa es la línea que salva la siguiente: sin el operador condicional, multiplicar null por el impuesto lanzaría NullPointerException y la ficha no se generaría para nadie.",
        "The amount is empty, and this is the line that saves the next one: without the conditional operator, multiplying null by the tax would throw NullPointerException and nobody would get a summary.",
      ),
    },
    {
      t: pick(lang, "Leer campos del registro", "Read fields from the record"),
      from: "L5",
      code: "String displayRegion = String.isBlank(customer.Region__c) ? 'Sin región' : customer.Region__c;",
      note: pick(
        lang,
        "Los datos salen de registros en memoria, no de variables sueltas: customer.Region__c es «el campo Region__c del cliente», con __c porque es personalizado. Y se comprueba con isBlank, que cubre null, vacío y espacios.",
        "The data comes from in-memory records, not loose variables: customer.Region__c is “the customer's Region__c field”, with __c because it is custom. And it is checked with isBlank, which covers null, empty and spaces.",
      ),
    },
    {
      t: pick(lang, "Buscar en una colección", "Look it up in a collection"),
      from: "L8",
      code: "Decimal regionQuota = quotaByRegion.containsKey(displayRegion) ? quotaByRegion.get(displayRegion) : 0;",
      note: pick(
        lang,
        "El Map responde «¿cuál es la cuota de esta región?» sin recorrer nada, como un BUSCARV. Y se pregunta antes con containsKey(), porque get() con una clave que no existe devuelve null y ese null acabaría en una cuenta.",
        "The Map answers “what is this region's quota?” without scanning anything, like a VLOOKUP. And containsKey() asks first, because get() with a missing key returns null and that null would end up in a calculation.",
      ),
    },
    {
      t: pick(lang, "Convertir para mostrar y fechar", "Convert to display and date it"),
      from: pick(lang, "L9 · L4", "L9 · L4"),
      code: "summaryLines.add(String.valueOf(amountWithTax.setScale(2)));",
      note: pick(
        lang,
        "Último paso: el número se redondea a dos decimales y se convierte a texto —anidado, de dentro hacia fuera— para poder mostrarlo. Y los días que faltan salen de Date.today().daysBetween(opp.CloseDate).",
        "Last step: the number is rounded to two decimals and converted to text — nested, inside out — so it can be displayed. And the remaining days come from Date.today().daysBetween(opp.CloseDate).",
      ),
    },
  ];

  const s = useStepper(steps.length, 2400);
  const st = steps[s.i];
  const ROW = 44;

  return (
    <div className="w-full">
      <div className="relative pl-9">
        <div
          aria-hidden
          className="absolute left-[13px] top-[10px] w-[2px] rounded-full"
          style={{ height: (steps.length - 1) * ROW + 18, background: "var(--c-border)" }}
        />
        <div
          aria-hidden
          className="absolute left-0 top-0 grid h-[38px] w-[28px] place-items-center"
          style={{ transform: `translateY(${s.i * ROW}px)`, transition: "transform 0.45s cubic-bezier(.3,.7,.3,1)" }}
        >
          <span
            className="block h-[14px] w-[14px] rounded-full"
            style={{ background: "var(--c-brand)", boxShadow: "0 0 0 5px var(--c-brand-soft)" }}
          />
        </div>

        <ol className="space-y-[6px]">
          {steps.map((x, n) => {
            const state = n === s.i ? "cur" : n < s.i ? "done" : "next";
            return (
              <li key={n} aria-current={state === "cur" ? "step" : undefined}>
                <button
                  type="button"
                  onClick={() => s.go(n)}
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
                    {x.t}
                  </span>
                  <span className="t-micro shrink-0 font-mono" style={{ color: "var(--c-text-faint)" }}>
                    {x.from}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[4px] px-3 py-2.5" style={codeBox}>
        <code key={s.i} className="diag-pop block whitespace-pre font-mono text-[12.5px]">
          {st.code}
        </code>
      </div>

      <Note lang={lang} s={s}>
        {st.note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------ 11. checkpoint: formula vs Apex ----- */

export function FormulaVsApexPlay({ lang }: P) {
  const rows: Array<{ k: string; formula: string; apex: string; note: string }> = [
    {
      k: pick(lang, "Dónde vive", "Where it lives"),
      formula: pick(lang, "En un campo del objeto", "In a field on the object"),
      apex: pick(lang, "En clases y triggers", "In classes and triggers"),
      note: pick(
        lang,
        "Una fórmula pertenece a un objeto y solo existe dentro de él. Apex vive aparte, en archivos que pueden tocar cualquier objeto de la org.",
        "A formula belongs to one object and only exists inside it. Apex lives apart, in files that can touch any object in the org.",
      ),
    },
    {
      k: pick(lang, "Cuándo corre", "When it runs"),
      formula: pick(lang, "Al leer el registro", "When the record is read"),
      apex: pick(lang, "Cuando tú decides", "When you decide"),
      note: pick(
        lang,
        "La fórmula se recalcula sola cada vez que alguien mira el registro. Apex corre cuando tú lo enganchas: al guardar, desde un botón, a una hora fijada. Eso es poder y también responsabilidad.",
        "A formula recalculates by itself every time somebody looks at the record. Apex runs where you hook it: on save, from a button, at a scheduled time. That is power and also responsibility.",
      ),
    },
    {
      k: pick(lang, "Qué guarda", "What it stores"),
      formula: pick(lang, "Nada: se recalcula siempre", "Nothing: always recalculated"),
      apex: pick(lang, "Variables, colecciones, estado", "Variables, collections, state"),
      note: pick(
        lang,
        "La fórmula no tiene memoria: cada lectura empieza de cero. Apex sí: puede acumular en una List, contar en un Map y arrastrar resultados de una línea a la siguiente. Todo el Módulo 1 va de eso.",
        "A formula has no memory: every read starts from scratch. Apex does: it can accumulate in a List, count in a Map and carry results from one line to the next. The whole of Module 1 is about that.",
      ),
    },
    {
      k: pick(lang, "Cuántos registros", "How many records"),
      formula: pick(lang, "Uno, el suyo", "One, its own"),
      apex: pick(lang, "200 de golpe si hace falta", "200 at once if needed"),
      note: pick(
        lang,
        "Una fórmula solo se ve a sí misma. Apex recibe lotes: cuando llegas a triggers, el código se ejecuta con 200 registros a la vez y tu forma de escribirlo decide si la org aguanta.",
        "A formula only sees itself. Apex receives batches: by the time you reach triggers, your code runs with 200 records at once and how you write it decides whether the org holds up.",
      ),
    },
    {
      k: pick(lang, "Puede escribir", "Can it write"),
      formula: pick(lang, "No", "No"),
      apex: pick(lang, "Sí, con DML", "Yes, with DML"),
      note: pick(
        lang,
        "Esta es la frontera de verdad. Una fórmula solo muestra; Apex puede crear, modificar y borrar registros. Por eso en el Módulo 1 todavía no has guardado nada: primero hay que saber manejar los datos en la mano.",
        "This is the real border. A formula only displays; Apex can create, change and delete records. That is why you have saved nothing yet in Module 1: first you learn to handle the data in your hand.",
      ),
    },
  ];

  const s = useStepper(rows.length, 2300);

  return (
    <div className="w-full">
      <div className="grid grid-cols-[1fr_1fr] gap-2 sm:grid-cols-[120px_1fr_1fr]">
        <p className="t-micro hidden font-semibold tracking-[0.06em] text-faint sm:block" />
        <p className="t-micro rounded-[4px] px-2 py-1.5 text-center font-semibold" style={{ background: "var(--c-surface-2)", color: "var(--c-text)" }}>
          {pick(lang, "CAMPO FÓRMULA", "FORMULA FIELD")}
        </p>
        <p className="t-micro rounded-[4px] px-2 py-1.5 text-center font-semibold" style={{ background: "var(--c-brand-soft)", color: "var(--c-brand)" }}>
          APEX
        </p>

        {rows.slice(0, s.i + 1).map((r, n) => (
          <Fragment key={r.k}>
            <p className="t-micro col-span-2 pt-2 text-faint sm:col-span-1 sm:pt-3">{r.k}</p>
            <p
              className="t-small diag-pop rounded-[4px] border px-2.5 py-2"
              style={{ borderColor: "var(--c-border)", opacity: n === s.i ? 1 : 0.75 }}
            >
              {r.formula}
            </p>
            <p
              className="t-small diag-pop rounded-[4px] border px-2.5 py-2"
              style={{
                borderColor: n === s.i ? "var(--c-brand)" : "var(--c-border)",
                background: n === s.i ? "var(--c-brand-soft)" : "transparent",
                opacity: n === s.i ? 1 : 0.75,
              }}
            >
              {r.apex}
            </p>
          </Fragment>
        ))}
      </div>

      <Note lang={lang} s={s}>
        {rows[s.i].note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}

/* ------------------------------------- 12. checkpoint: what needs what ---- */

export function ModuleOneDepsPlay({ lang }: P) {
  const layers: Array<{ items: string[]; note: string }> = [
    {
      items: [pick(lang, "1 · Variables", "1 · Variables")],
      note: pick(
        lang,
        "Todo arranca aquí: sin declarar una variable no hay dónde meter nada. Es el «elige el tipo» del asistente de campo, y ninguna de las otras ocho sub-lecciones se sostiene sin esto.",
        "Everything starts here: without declaring a variable there is nowhere to put anything. It is the wizard's “choose the type”, and none of the other eight sub-lessons stands without it.",
      ),
    },
    {
      items: [
        pick(lang, "2 · Números y Boolean", "2 · Numbers & Boolean"),
        pick(lang, "3 · String y métodos", "3 · String & métodos"),
        pick(lang, "4 · Fechas", "4 · Dates"),
      ],
      note: pick(
        lang,
        "Los tipos que vas a usar cada día, con sus métodos. Se pueden estudiar en cualquier orden entre ellos: ninguno depende de los otros dos.",
        "The types you will use daily, with their methods. They can be studied in any order among themselves: none depends on the other two.",
      ),
    },
    {
      items: [pick(lang, "5 · sObjects", "5 · sObjects")],
      note: pick(
        lang,
        "Aquí se juntan: un registro es una caja llena de esos tipos. account.Name es un String, account.AnnualRevenue es un Decimal y account.CloseDate es una Date. Por eso sObjects va después y no antes.",
        "This is where they meet: a record is a box full of those types. account.Name is a String, account.AnnualRevenue is a Decimal and account.CloseDate is a Date. That is why sObjects comes after, not before.",
      ),
    },
    {
      items: [pick(lang, "6 · Null", "6 · Null")],
      note: pick(
        lang,
        "Y en cuanto lees campos de un registro aparece el campo vacío. Null tiene que ir justo aquí: antes no tendría sentido y después llegaría tarde, porque todo lo que viene a continuación necesita protegerse de él.",
        "And as soon as you read a record's fields, the empty field turns up. Null has to sit exactly here: earlier it would make no sense and later it would arrive too late, because everything that follows needs protection from it.",
      ),
    },
    {
      items: [
        pick(lang, "7 · Operadores", "7 · Operators"),
        pick(lang, "8 · Colecciones", "8 · Collections"),
        pick(lang, "9 · Casting", "9 · Casting"),
      ],
      note: pick(
        lang,
        "Las tres últimas usan null constantemente: el && que evalúa en corto, el get() de un Map que devuelve null, y la conversión de un texto que podría no existir. Por eso están al final, y por eso el checkpoint las mezcla todas.",
        "The last three use null constantly: the short-circuiting &&, a Map's get() returning null, and converting text that might not be there. That is why they come last, and why the checkpoint mixes all of them.",
      ),
    },
  ];

  const s = useStepper(layers.length, 2300);

  return (
    <div className="w-full">
      <ol className="space-y-2">
        {layers.slice(0, s.i + 1).map((l, n) => (
          <li key={n}>
            {n > 0 && (
              <p aria-hidden className="mb-1 text-center text-faint">
                ↓
              </p>
            )}
            <ul className="flex flex-wrap justify-center gap-2">
              {l.items.map((it) => (
                <li
                  key={it}
                  className="t-small diag-pop rounded-[4px] border px-3 py-2"
                  style={{
                    borderColor: n === s.i ? "var(--c-brand)" : "var(--c-border)",
                    background: n === s.i ? "var(--c-brand-soft)" : "transparent",
                    color: n === s.i ? "var(--c-brand)" : "var(--c-text)",
                    fontWeight: n === s.i ? 600 : 400,
                  }}
                >
                  {it}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <Note lang={lang} s={s}>
        {layers[s.i].note}
      </Note>
      <Controls lang={lang} s={s} />
    </div>
  );
}
