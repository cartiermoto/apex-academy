"use client";

import { useEffect, useMemo, useState } from "react";
import { Edges, RoundedBox } from "@react-three/drei";
import { Choices, Mat, Mover, Panel, Readout, Stage, Tag, pick, useTokens, type SceneProps } from "./scenes-kit";

/**
 * Module 1's 3D scenes, one per sub-lesson. Each one shows the idea of its
 * lesson as objects you can act on, using only what that lesson has taught.
 */

type V3 = [number, number, number];

/* ------------------------------------------------- 1. a variable is a box --- */

function VariableScene({ lang }: SceneProps) {
  const tk = useTokens();
  const values = [
    { id: 0, text: "20", type: "Integer", ok: true },
    { id: 1, text: "'veinte'", type: "String", ok: false },
    { id: 2, text: "15.5", type: "Decimal", ok: false },
  ];
  const [chosen, setChosen] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [bounced, setBounced] = useState(false);
  const [shake, setShake] = useState(0);
  const wrong = chosen !== null && !values[chosen].ok;

  // a value of the wrong type flies at the box, is refused and goes back
  useEffect(() => {
    setBounced(false);
    if (!wrong) return;
    const id = setTimeout(() => {
      setBounced(true);
      setShake((s) => s + 1);
    }, 380);
    return () => clearTimeout(id);
  }, [wrong, attempt]);

  const v = chosen === null ? null : values[chosen];
  const slot = (i: number): V3 => [-2.3, 1 - i, 0];
  const where = (i: number): V3 => {
    if (chosen !== i) return slot(i);
    if (values[i].ok) return [1, -0.15, 0];
    return bounced ? slot(i) : [0.2, 1.2, 0];
  };

  return (
    <>
      <Stage label={pick(lang, "Una caja con la etiqueta Integer y el nombre maxDiscount, y tres valores que se pueden meter en ella.", "A box labelled Integer named maxDiscount, and three values that can be put in it.")}>
        <Mover to={[1, 0, 0]} shake={wrong ? shake : 0}>
          <RoundedBox args={[1.7, 1.5, 1.5]} radius={0.08}>
            <Mat color={wrong && bounced ? tk.danger : tk.brand} opacity={0.28} />
            <Edges color={tk.brand} />
          </RoundedBox>
          <Tag at={[0, 1.15, 0]} tone="brand">
            Integer
          </Tag>
          <Tag at={[0, -1.1, 0.8]}>maxDiscount</Tag>
        </Mover>
        {values.map((x, i) => (
          <Mover key={x.id} to={where(i)} scale={chosen === i && x.ok ? 0.8 : 1}>
            <mesh>
              <boxGeometry args={[0.55, 0.55, 0.55]} />
              <Mat color={x.type === "Integer" ? tk.fill : x.type === "String" ? tk.warn : tk.blue} />
            </mesh>
            <Tag at={[0, 0.55, 0]} tone="quiet">
              {x.text}
            </Tag>
          </Mover>
        ))}
      </Stage>
      <Panel>
        <Choices
          label={pick(lang, "Valor que meter en la caja", "Value to put in the box")}
          items={values.map((x) => ({ id: x.id, label: `= ${x.text}` }))}
          value={chosen}
          onPick={(id) => {
            setChosen(id);
            setAttempt((n) => n + 1);
          }}
        />
        {v === null ? (
          <Readout>{pick(lang, "Elige qué valor guardar en la variable.", "Pick the value to store in the variable.")}</Readout>
        ) : v.ok ? (
          <Readout code={`Integer maxDiscount = ${v.text};`} tone="ok">
            {pick(lang, "Cabe: el valor es un Integer, igual que el tipo de la caja. Ya tienes una variable.", "It fits: the value is an Integer, like the box's type. You have a variable.")}
          </Readout>
        ) : (
          <Readout code={`Illegal assignment from ${v.type} to Integer`} tone="bad">
            {v.type === "String"
              ? pick(lang, "No compila. Es lo mismo que un campo Número que no acepta texto.", "It does not compile. Same as a Number field refusing text.")
              : pick(lang, "No compila. Un Integer solo guarda números enteros.", "It does not compile. An Integer only holds whole numbers.")}
          </Readout>
        )}
      </Panel>
    </>
  );
}

/* --------------------------------------- 2. numbers and a three-way switch --- */

function TypesScene({ lang }: SceneProps) {
  const tk = useTokens();
  const [b, setB] = useState<"true" | "false" | "null">("null");
  const angle = b === "true" ? 0.75 : b === "false" ? -0.75 : 0;
  return (
    <>
      <Stage label={pick(lang, "Tres tipos: Integer como cubos enteros, Decimal como monedas apiladas y Boolean como un interruptor.", "Three types: Integer as whole cubes, Decimal as stacked coins and Boolean as a switch.")}>
        <Mover to={[-2.2, -0.4, 0]} spin={0.3}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, i * 0.52, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <Mat color={tk.fill} />
            </mesh>
          ))}
          <Tag at={[0, 1.75, 0]}>Integer · 42</Tag>
        </Mover>
        <Mover to={[0, -0.4, 0]} spin={0.3}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[0, i * 0.17, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.14, 40]} />
              <Mat color={tk.blue} />
            </mesh>
          ))}
          <Tag at={[0, 1.45, 0]}>Decimal · 1249.99</Tag>
        </Mover>
        <group position={[2.2, -0.6, 0]}>
          <mesh>
            <boxGeometry args={[1.1, 0.3, 0.7]} />
            <Mat color={tk.muted} />
          </mesh>
          <Mover rot={[0, 0, -angle]}>
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 1.1, 16]} />
              <Mat color={tk.text} />
            </mesh>
            <mesh position={[0, 1.18, 0]}>
              <sphereGeometry args={[0.2, 24, 24]} />
              <Mat color={b === "true" ? tk.fill : b === "false" ? tk.danger : tk.faint} />
            </mesh>
          </Mover>
          <Tag at={[0, 1.95, 0]} tone={b === "null" ? "quiet" : "plain"}>
            Boolean · {b}
          </Tag>
        </group>
      </Stage>
      <Panel>
        <Choices
          label={pick(lang, "Valor del Boolean", "Boolean value")}
          items={[
            { id: "true" as const, label: "= true" },
            { id: "false" as const, label: "= false" },
            { id: "null" as const, label: pick(lang, "sin asignar", "not assigned") },
          ]}
          value={b}
          onPick={setB}
        />
        <Readout code={b === "null" ? "Boolean hasDiscount;" : `Boolean hasDiscount = ${b};`} tone={b === "null" ? "quiet" : "plain"}>
          {b === "null"
            ? pick(lang, "Declarado y sin asignar, un Boolean vale null, no false. Un checkbox nunca está vacío; esta variable sí.", "Declared and never assigned, a Boolean is null, not false. A checkbox is never empty; this variable can be.")
            : pick(lang, "Como un checkbox: true o false. El tercer estado, null, aparece si nunca le das valor.", "Like a checkbox: true or false. The third state, null, shows up if you never give it a value.")}
        </Readout>
      </Panel>
    </>
  );
}

/* ----------------------------------------- 3. a String is a row of beads --- */

const RAW = "  acme corp ";
type Bead = { id: number; ch: string };

function StringScene({ lang }: SceneProps) {
  const tk = useTokens();
  const start = useMemo<Bead[]>(() => RAW.split("").map((ch, id) => ({ id, ch })), []);
  const [beads, setBeads] = useState<Bead[]>(start);
  const [chain, setChain] = useState<string[]>([]);
  const [len, setLen] = useState<number | null>(null);
  const [flip, setFlip] = useState(0);

  const text = beads.map((b) => b.ch).join("");
  const apply = (op: string) => {
    setLen(null);
    if (op === "trim") {
      let a = 0;
      let z = beads.length;
      while (a < z && beads[a].ch === " ") a++;
      while (z > a && beads[z - 1].ch === " ") z--;
      setBeads(beads.slice(a, z));
      setChain((c) => [...c, "trim()"]);
    } else if (op === "upper") {
      setBeads(beads.map((b) => ({ ...b, ch: b.ch.toUpperCase() })));
      setFlip((f) => f + 1);
      setChain((c) => [...c, "toUpperCase()"]);
    } else if (op === "sub") {
      setBeads(beads.slice(0, 4));
      setChain((c) => [...c, "substring(0, 4)"]);
    } else if (op === "len") {
      setLen(beads.length);
    } else {
      setBeads(start);
      setChain([]);
      setFlip(0);
    }
  };

  const step = 0.5;
  const x0 = -((beads.length - 1) * step) / 2;
  const expr = ["rawName", ...chain].join(".");

  return (
    <>
      <Stage label={pick(lang, "Un texto como una fila de cuentas, cada letra con su posición debajo, empezando en 0.", "A piece of text as a row of beads, each letter with its position below, starting at 0.")}>
        {start.map((b) => {
          const i = beads.findIndex((x) => x.id === b.id);
          const kept = i >= 0;
          const ch = kept ? beads[i].ch : b.ch;
          return (
            <Mover key={b.id} to={kept ? [x0 + i * step, len !== null ? 0.25 : 0, 0] : [x0 + b.id * step, -1.6, 0]} scale={kept ? 1 : 0.001} rot={[flip * Math.PI * 2, 0, 0]} speed={6}>
              <RoundedBox args={[0.42, 0.42, 0.42]} radius={0.06}>
                <Mat color={ch === " " ? tk.faint : tk.warn} opacity={ch === " " ? 0.35 : 1} />
              </RoundedBox>
              {kept && (
                <>
                  <Tag at={[0, 0, 0.3]}>{ch === " " ? "␣" : ch}</Tag>
                  <Tag at={[0, -0.5, 0]} tone="quiet">
                    {i}
                  </Tag>
                </>
              )}
            </Mover>
          );
        })}
        {len !== null && (
          <Tag at={[0, 1.2, 0]} tone="ok">
            length() = {len}
          </Tag>
        )}
      </Stage>
      <Panel>
        <Choices
          label={pick(lang, "Método que aplicar", "Method to apply")}
          items={[
            { id: "trim", label: ".trim()" },
            { id: "upper", label: ".toUpperCase()" },
            { id: "sub", label: ".substring(0, 4)" },
            { id: "len", label: ".length()" },
            { id: "reset", label: pick(lang, "Empezar de nuevo", "Start over") },
          ]}
          onPick={apply}
        />
        <Readout code={len !== null ? `${expr}.length()  →  ${len}` : `${expr}  →  '${text}'`}>
          {pick(lang, "Cada método devuelve un String nuevo: rawName sigue siendo '  acme corp '. Las posiciones empiezan en 0.", "Each method returns a new String: rawName is still '  acme corp '. Positions start at 0.")}
        </Readout>
      </Panel>
    </>
  );
}

/* ---------------------------------------------- 4. Date, Time, Datetime --- */

function DatesScene({ lang }: SceneProps) {
  const tk = useTokens();
  const [k, setK] = useState<"date" | "time" | "dt">("date");
  const now = useMemo(() => new Date(), []);
  const pad = (n: number) => String(n).padStart(2, "0");
  const ymd = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const hm = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const gmt = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`;
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const pos = (id: typeof k, x: number): V3 => [x, id === k ? 0.1 : -0.2, id === k ? 1 : -0.6];
  const minuteAngle = -(now.getMinutes() / 60) * Math.PI * 2;
  const hourAngle = -((now.getHours() % 12) / 12) * Math.PI * 2 + minuteAngle / 12;

  const calendar = (
    <>
      <RoundedBox args={[1.2, 1.2, 0.3]} radius={0.06}>
        <Mat color={tk.surface} />
      </RoundedBox>
      <mesh position={[0, 0.48, 0.02]}>
        <boxGeometry args={[1.2, 0.26, 0.32]} />
        <Mat color={tk.danger} />
      </mesh>
    </>
  );
  const clock = (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.18, 48]} />
        <Mat color={tk.surface} />
      </mesh>
      <mesh position={[0, 0, 0.1]} rotation={[0, 0, hourAngle]}>
        <boxGeometry args={[0.06, 0.34, 0.02]} />
        <meshStandardMaterial color={tk.text} />
      </mesh>
      <mesh position={[0, 0, 0.11]} rotation={[0, 0, minuteAngle]}>
        <boxGeometry args={[0.04, 0.5, 0.02]} />
        <meshStandardMaterial color={tk.text} />
      </mesh>
    </>
  );

  return (
    <>
      <Stage label={pick(lang, "Un calendario para Date, un reloj para Time y los dos juntos para Datetime.", "A calendar for Date, a clock for Time and both together for Datetime.")}>
        <Mover to={pos("date", -2.2)} scale={k === "date" ? 1.15 : 0.85}>
          {calendar}
          <Tag at={[0, -0.95, 0]} tone={k === "date" ? "brand" : "quiet"}>
            Date
          </Tag>
        </Mover>
        <Mover to={pos("time", 0)} scale={k === "time" ? 1.15 : 0.85}>
          {clock}
          <Tag at={[0, -0.95, 0]} tone={k === "time" ? "brand" : "quiet"}>
            Time
          </Tag>
        </Mover>
        <Mover to={pos("dt", 2.2)} scale={k === "dt" ? 1.15 : 0.85}>
          <group position={[-0.35, 0.15, 0]} scale={0.7}>
            {calendar}
          </group>
          <group position={[0.4, -0.2, 0.25]} scale={0.6}>
            {clock}
          </group>
          <Mover rot={[Math.PI / 2, 0, 0]} spin={k === "dt" ? 0.6 : 0}>
            <mesh>
              <torusGeometry args={[1, 0.025, 8, 64]} />
              <Mat color={tk.blue} />
            </mesh>
          </Mover>
          <Tag at={[0, -0.95, 0]} tone={k === "dt" ? "brand" : "quiet"}>
            Datetime
          </Tag>
          {k === "dt" && <Tag at={[0, 1.1, 0]}>GMT {gmt}</Tag>}
        </Mover>
      </Stage>
      <Panel>
        <Choices
          label={pick(lang, "Tipo", "Type")}
          items={[
            { id: "date" as const, label: "Date" },
            { id: "time" as const, label: "Time" },
            { id: "dt" as const, label: "Datetime" },
          ]}
          value={k}
          onPick={setK}
        />
        {k === "date" && (
          <Readout code={`Date today = Date.today();   // ${ymd}`}>
            {pick(lang, "Solo día, mes y año. Un Date no tiene zona horaria.", "Only day, month and year. A Date has no time zone.")}
          </Readout>
        )}
        {k === "time" && (
          <Readout code={`Time opens = Time.newInstance(${now.getHours()}, ${now.getMinutes()}, 0, 0);   // ${hm}`}>
            {pick(lang, "Solo la hora del día, sin fecha.", "Only the time of day, no date.")}
          </Readout>
        )}
        {k === "dt" && (
          <Readout code={`Datetime now = Datetime.now();   // GMT ${gmt} · ${zone} ${hm}`}>
            {pick(lang, "Fecha y hora juntas. Se guarda en GMT y cada persona lo ve en su zona horaria: el mismo instante, dos horas en pantalla.", "Date and time together. Stored in GMT, and each person sees it in their own time zone: one instant, two times on screen.")}
          </Readout>
        )}
      </Panel>
    </>
  );
}

/* ------------------------------------- 5. one definition, many rows --- */

type Rec = { name: string; industry: string | null };

function SObjectScene({ lang }: SceneProps) {
  const tk = useTokens();
  const [recs, setRecs] = useState<Rec[]>([]);
  const [last, setLast] = useState<string | null>(null);
  const act = (id: string) => {
    if (id === "acme" && !recs.some((r) => r.name === "Acme")) {
      setRecs([...recs, { name: "Acme", industry: null }]);
      setLast("Account acme = new Account(Name = 'Acme');");
    } else if (id === "globex" && !recs.some((r) => r.name === "Globex")) {
      setRecs([...recs, { name: "Globex", industry: null }]);
      setLast("Account globex = new Account(Name = 'Globex');");
    } else if (id === "industry" && recs.some((r) => r.name === "Acme")) {
      setRecs(recs.map((r) => (r.name === "Acme" ? { ...r, industry: "Retail" } : r)));
      setLast("acme.Industry = 'Retail';");
    } else if (id === "reset") {
      setRecs([]);
      setLast(null);
    }
  };
  const fields = ["Name", "Industry", "AnnualRevenue"];
  return (
    <>
      <Stage label={pick(lang, "A la izquierda, la definición de Account como un plano; a la derecha, cada registro creado como una ficha.", "On the left, the Account definition as a blueprint; on the right, each record created as a card.")}>
        <group position={[-1.7, 0, 0]}>
          <mesh>
            <boxGeometry args={[2, 2.4, 0.08]} />
            <Mat color={tk.blue} opacity={0.12} />
            <Edges color={tk.blue} />
          </mesh>
          <Tag at={[0, 0.85, 0.1]} tone="brand">
            Account
          </Tag>
          {fields.map((f, i) => (
            <Tag key={f} at={[0, 0.25 - i * 0.45, 0.1]} tone="quiet">
              {f}
            </Tag>
          ))}
          <Tag at={[0, -1.5, 0]} tone="quiet">
            Object Manager
          </Tag>
        </group>
        {recs.map((r, i) => (
          <Mover key={r.name} from={[-1.7, 0, 0]} to={[1.4 + i * 0.35, 0.2 - i * 0.3, 0.3 + i * 0.4]}>
            <RoundedBox args={[1.9, 1.6, 0.08]} radius={0.05}>
              <Mat color={tk.surface} />
            </RoundedBox>
            <Tag at={[0, 0.5, 0.1]}>Name: {r.name}</Tag>
            <Tag at={[0, 0.05, 0.1]} tone={r.industry ? "plain" : "quiet"}>
              Industry: {r.industry ?? "null"}
            </Tag>
            <Tag at={[0, -0.4, 0.1]} tone="quiet">
              AnnualRevenue: null
            </Tag>
          </Mover>
        ))}
      </Stage>
      <Panel>
        <Choices
          label={pick(lang, "Qué hacer", "What to do")}
          items={[
            { id: "acme", label: "new Account(Name = 'Acme')" },
            { id: "globex", label: "new Account(Name = 'Globex')" },
            { id: "industry", label: "acme.Industry = 'Retail'" },
            { id: "reset", label: pick(lang, "Empezar de nuevo", "Start over") },
          ]}
          onPick={act}
        />
        <Readout code={last ?? undefined}>
          {recs.length === 0
            ? pick(lang, "Object Manager define la forma una vez. Crea un registro.", "Object Manager defines the shape once. Create a record.")
            : pick(lang, `Una definición, ${recs.length} ${recs.length === 1 ? "fila" : "filas"} en memoria. Los campos que no asignas valen null. Todavía no hay nada guardado en la base de datos.`, `One definition, ${recs.length} ${recs.length === 1 ? "row" : "rows"} in memory. Fields you do not set are null. Nothing is saved in the database yet.`)}
        </Readout>
      </Panel>
    </>
  );
}

/* ---------------------------------------------- 6. null: an empty box --- */

function NullScene({ lang }: SceneProps) {
  const tk = useTokens();
  const [target, setTarget] = useState<"name" | "missing">("missing");
  const [call, setCall] = useState<"plain" | "safe" | null>(null);
  const [shake, setShake] = useState(0);
  const isNull = target === "missing";
  const crash = isNull && call === "plain";
  const result = call === null ? null : isNull ? (call === "plain" ? "NPE" : "null") : "4";

  return (
    <>
      <Stage label={pick(lang, "Dos cajas: name contiene 'Acme'; missing está vacía porque vale null.", "Two boxes: name holds 'Acme'; missing is empty because it is null.")}>
        <Mover to={[-1.6, 0, target === "name" ? 0.6 : -0.3]}>
          <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.08}>
            <Mat color={tk.brand} opacity={0.22} />
            <Edges color={tk.brand} />
          </RoundedBox>
          <mesh>
            <sphereGeometry args={[0.38, 32, 32]} />
            <Mat color={tk.warn} />
          </mesh>
          <Tag at={[0, -0.6, 0.8]}>&apos;Acme&apos;</Tag>
          <Tag at={[0, 1.15, 0]} tone={target === "name" ? "brand" : "quiet"}>
            name
          </Tag>
        </Mover>
        <Mover to={[1.6, 0, target === "missing" ? 0.6 : -0.3]} shake={crash ? shake : 0}>
          <RoundedBox args={[1.5, 1.5, 1.5]} radius={0.08}>
            <Mat color={crash ? tk.danger : tk.faint} opacity={crash ? 0.35 : 0.12} />
            <Edges color={crash ? tk.danger : tk.faint} />
          </RoundedBox>
          <Tag at={[0, 0, 0]} tone="quiet">
            null
          </Tag>
          <Tag at={[0, 1.15, 0]} tone={target === "missing" ? "brand" : "quiet"}>
            missing
          </Tag>
        </Mover>
        {result && (
          <Tag at={[0, -1.4, 0]} tone={result === "NPE" ? "bad" : "ok"}>
            {result === "NPE" ? "System.NullPointerException" : `= ${result}`}
          </Tag>
        )}
      </Stage>
      <Panel>
        <Choices
          label={pick(lang, "Variable", "Variable")}
          items={[
            { id: "name" as const, label: "name" },
            { id: "missing" as const, label: "missing" },
          ]}
          value={target}
          onPick={(id) => {
            setTarget(id);
            setCall(null);
          }}
        />
        <Choices
          label={pick(lang, "Llamada", "Call")}
          items={[
            { id: "plain" as const, label: `${target}.length()` },
            { id: "safe" as const, label: `${target}?.length()` },
          ]}
          value={call}
          onPick={(id) => {
            setCall(id);
            setShake((s) => s + 1);
          }}
        />
        {call === null ? (
          <Readout>{pick(lang, "Pide la longitud de una de las dos variables.", "Ask one of the two variables for its length.")}</Readout>
        ) : crash ? (
          <Readout code="System.NullPointerException: Attempt to de-reference a null object" tone="bad">
            {pick(lang, "Le pides algo a una caja vacía: no hay texto al que medir la longitud, y el código se detiene.", "You ask an empty box for something: there is no text to measure, and the code stops.")}
          </Readout>
        ) : isNull ? (
          <Readout code={`${target}?.length()  →  null`} tone="ok">
            {pick(lang, "?. mira antes de llamar: si no hay nada, devuelve null en lugar de fallar.", "?. looks before calling: if there is nothing, it returns null instead of failing.")}
          </Readout>
        ) : (
          <Readout code={`${target}${call === "safe" ? "?." : "."}length()  →  4`} tone="ok">
            {pick(lang, "Hay un texto dentro, así que la llamada funciona con punto o con ?.", "There is text inside, so the call works with a dot or with ?.")}
          </Readout>
        )}
      </Panel>
    </>
  );
}

/* --------------------------------------------- 7. a comparison is a scale --- */

const OPS = ["==", "!=", ">", "<", ">=", "<="] as const;
type Op = (typeof OPS)[number];

function OperatorsScene({ lang }: SceneProps) {
  const tk = useTokens();
  const [a, setA] = useState(15000);
  const b = 10000;
  const [op, setOp] = useState<Op>(">");
  const res = op === "==" ? a === b : op === "!=" ? a !== b : op === ">" ? a > b : op === "<" ? a < b : op === ">=" ? a >= b : a <= b;
  const tilt = Math.max(-0.22, Math.min(0.22, ((a - b) / 10000) * 0.22));
  const fmt = (n: number) => String(n);
  const stack = (n: number) => Math.max(1, Math.round(n / 5000));

  return (
    <>
      <Stage label={pick(lang, "Una balanza compara amount con 10000; debajo, el resultado true o false.", "A scale compares amount with 10000; below, the result true or false.")}>
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.5, 0.7, 0.3, 32]} />
          <Mat color={tk.muted} />
        </mesh>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.7, 16]} />
          <Mat color={tk.muted} />
        </mesh>
        <Mover to={[0, 0.3, 0]} rot={[0, 0, tilt]}>
          <mesh>
            <boxGeometry args={[4.6, 0.1, 0.2]} />
            <Mat color={tk.text} />
          </mesh>
          {[
            { x: -2, n: a, label: `amount = ${fmt(a)}`, c: tk.fill },
            { x: 2, n: b, label: fmt(b), c: tk.blue },
          ].map((p) => (
            // each pan hangs level while the beam tilts
            <Mover key={p.x} to={[p.x, -0.15, 0]} rot={[0, 0, -tilt]}>
              <mesh>
                <cylinderGeometry args={[0.55, 0.55, 0.06, 32]} />
                <Mat color={tk.faint} />
              </mesh>
              {Array.from({ length: stack(p.n) }, (_, i) => (
                <mesh key={i} position={[0, 0.17 + i * 0.26, 0]}>
                  <boxGeometry args={[0.5, 0.24, 0.5]} />
                  <Mat color={p.c} />
                </mesh>
              ))}
              <Tag at={[0, 0.5 + stack(p.n) * 0.26, 0]}>{p.label}</Tag>
            </Mover>
          ))}
        </Mover>
        <Tag at={[0, -1.85, 0]} tone={res ? "ok" : "bad"}>
          {`amount ${op} ${b}  →  ${res}`}
        </Tag>
      </Stage>
      <Panel>
        <Choices label={pick(lang, "Operador", "Operator")} items={OPS.map((o) => ({ id: o, label: o }))} value={op} onPick={setOp} />
        <Choices
          label={pick(lang, "Valor de amount", "Value of amount")}
          items={[5000, 10000, 15000, 20000].map((n) => ({ id: n, label: `amount = ${n}` }))}
          value={a}
          onPick={setA}
        />
        <Readout code={`Boolean result = amount ${op} ${b};   // ${res}`} tone={res ? "ok" : "bad"}>
          {pick(lang, "Una comparación siempre da un Boolean, como la condición de entrada de un Flow. Ojo: == compara, = asigna.", "A comparison always yields a Boolean, like a Flow's entry condition. Mind it: == compares, = assigns.")}
        </Readout>
      </Panel>
    </>
  );
}

/* ----------------------------------------------- 8. List, Set and Map --- */

function CollectionsScene({ lang }: SceneProps) {
  const tk = useTokens();
  const [kind, setKind] = useState<"list" | "set" | "map">("list");
  const [items, setItems] = useState<string[]>([]);
  const [map, setMap] = useState<Array<[string, number]>>([]);
  const [note, setNote] = useState<{ code: string; text: string; tone?: "ok" | "bad" | "quiet" } | null>(null);
  const [bounce, setBounce] = useState<{ v: string; n: number } | null>(null);

  const reset = (k: typeof kind) => {
    setKind(k);
    setItems([]);
    setMap([]);
    setNote(null);
    setBounce(null);
  };

  const add = (v: string) => {
    const name = kind === "list" ? "regions" : "activeRegions";
    if (kind === "set" && items.includes(v)) {
      setBounce({ v, n: Date.now() });
      setNote({ code: `${name}.add('${v}');   // size() = ${items.length}`, text: pick(lang, "Ya estaba: el Set ignora el duplicado y sigue igual.", "It was already there: the Set ignores the duplicate and stays the same."), tone: "quiet" });
      return;
    }
    if (items.length >= 6) return;
    const next = [...items, v];
    setItems(next);
    setNote({
      code: `${name}.add('${v}');   // size() = ${next.length}`,
      text:
        kind === "list"
          ? pick(lang, "La List guarda en orden, con posición, y admite repetidos.", "The List keeps order, with positions, and allows repeats.")
          : pick(lang, "Entra: en un Set cada valor aparece una sola vez, sin posiciones.", "In it goes: in a Set each value appears once, with no positions."),
    });
  };
  const put = (k: string, v: number) => {
    const had = map.some(([key]) => key === k);
    setMap(had ? map.map(([key, val]) => (key === k ? [key, v] : [key, val])) : [...map, [k, v]]);
    setNote({
      code: `quotaByRegion.put('${k}', ${v});`,
      text: had
        ? pick(lang, "La clave ya existía: put reemplaza el valor. Cada clave, una sola vez.", "The key already existed: put replaces the value. Each key, once.")
        : pick(lang, "Una clave nueva con su valor.", "A new key with its value."),
    });
  };
  const get = (k: string) => {
    const hit = map.find(([key]) => key === k);
    setNote({
      code: `quotaByRegion.get('${k}')  →  ${hit ? hit[1] : "null"}`,
      text: hit ? pick(lang, "La clave existe: devuelve su valor.", "The key exists: it returns its value.") : pick(lang, "get() con una clave que no existe devuelve null, sin error.", "get() with a missing key returns null, with no error."),
      tone: hit ? "ok" : "quiet",
    });
  };

  const step = 0.85;
  const row = (n: number, i: number): [number, number, number] => [-((n - 1) * step) / 2 + i * step, 0, 0];
  const ring = (n: number, i: number): [number, number, number] => {
    const a = (i / Math.max(n, 1)) * Math.PI * 2;
    return n === 1 ? [0, 0, 0] : [Math.sin(a) * 1.5, Math.cos(a) * 0.9, Math.cos(a) * 0.4];
  };

  return (
    <>
      <Stage label={pick(lang, "Una colección que se llena: List en fila con posiciones, Set como un grupo sin repetidos, Map como claves con su valor.", "A collection filling up: List as a row with positions, Set as a group without repeats, Map as keys with their value.")}>
        {kind === "list" &&
          items.map((v, i) => (
            <Mover key={i} from={[0, 2, 0]} to={row(items.length, i)}>
              <RoundedBox args={[0.7, 0.7, 0.7]} radius={0.06}>
                <Mat color={v === "Norte" ? tk.fill : tk.blue} />
              </RoundedBox>
              <Tag at={[0, 0.65, 0]} tone="quiet">
                {v}
              </Tag>
              <Tag at={[0, -0.65, 0]} tone="quiet">
                {i}
              </Tag>
            </Mover>
          ))}
        {kind === "set" && (
          <>
            {items.map((v, i) => (
              <Mover key={v} from={[0, 2, 0]} to={ring(items.length, i)}>
                <mesh>
                  <sphereGeometry args={[0.42, 32, 32]} />
                  <Mat color={v === "Norte" ? tk.fill : tk.blue} />
                </mesh>
                <Tag at={[0, 0.65, 0]} tone="quiet">
                  {v}
                </Tag>
              </Mover>
            ))}
            {bounce && (
              <Mover key={bounce.n} from={[0, 2.2, 0]} to={[2.6, 1.6, 0]} scale={0.6} speed={4}>
                <mesh>
                  <sphereGeometry args={[0.42, 32, 32]} />
                  <Mat color={tk.faint} opacity={0.5} />
                </mesh>
              </Mover>
            )}
          </>
        )}
        {kind === "map" &&
          map.map(([k, v], i) => (
            <Mover key={k} from={[0, 2, 0]} to={row(map.length, i).map((n, j) => (j === 0 ? n * 1.4 : n)) as [number, number, number]}>
              <RoundedBox args={[0.8, 0.5, 0.5]} radius={0.05} position={[0, -0.4, 0]}>
                <Mat color={tk.violet} />
              </RoundedBox>
              <Tag at={[0, -0.4, 0.35]} tone="quiet">
                {k}
              </Tag>
              <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
                <Mat color={tk.faint} />
              </mesh>
              <Mover key={v} from={[0, 0.9, 0]} to={[0, 0.7, 0]}>
                <RoundedBox args={[1, 0.4, 0.15]} radius={0.04}>
                  <Mat color={tk.surface} />
                </RoundedBox>
                <Tag at={[0, 0, 0.12]}>{v}</Tag>
              </Mover>
            </Mover>
          ))}
        {(kind === "map" ? map.length : items.length) === 0 && (
          <Tag at={[0, 0, 0]} tone="quiet">
            {pick(lang, "vacía, no null", "empty, not null")}
          </Tag>
        )}
      </Stage>
      <Panel>
        <Choices
          label={pick(lang, "Tipo de colección", "Collection type")}
          items={[
            { id: "list" as const, label: "List<String>" },
            { id: "set" as const, label: "Set<String>" },
            { id: "map" as const, label: "Map<String, Decimal>" },
          ]}
          value={kind}
          onPick={reset}
        />
        {kind === "map" ? (
          <Choices
            label={pick(lang, "Operación", "Operation")}
            items={[
              { id: "a", label: "put('Norte', 5000)" },
              { id: "b", label: "put('Sur', 3000)" },
              { id: "c", label: "put('Norte', 8000)" },
              { id: "d", label: "get('Este')" },
            ]}
            onPick={(id) => (id === "a" ? put("Norte", 5000) : id === "b" ? put("Sur", 3000) : id === "c" ? put("Norte", 8000) : get("Este"))}
          />
        ) : (
          <Choices
            label={pick(lang, "Operación", "Operation")}
            items={[
              { id: "Norte", label: "add('Norte')" },
              { id: "Sur", label: "add('Sur')" },
            ]}
            onPick={add}
          />
        )}
        <Readout code={note?.code} tone={note?.tone}>
          {note?.text ?? pick(lang, "Recién creada, la colección está vacía, que no es lo mismo que null. Añade algo.", "Freshly created, the collection is empty, which is not the same as null. Add something.")}
        </Readout>
      </Panel>
    </>
  );
}

/* --------------------------------------------- 9. casting: a shaping gate --- */

const CASTS = [
  { id: 0, input: "19.99", inType: "Decimal", code: "price.intValue()", out: "19", outType: "Integer", ok: true },
  { id: 1, input: "'42'", inType: "String", code: "Integer.valueOf('42')", out: "42", outType: "Integer", ok: true },
  { id: 2, input: "'abc'", inType: "String", code: "Integer.valueOf('abc')", out: "", outType: "Integer", ok: false },
  { id: 3, input: "42", inType: "Integer", code: "String.valueOf(42)", out: "'42'", outType: "String", ok: true },
];

function CastingScene({ lang }: SceneProps) {
  const tk = useTokens();
  const [c, setC] = useState(0);
  const [phase, setPhase] = useState<"in" | "gate" | "out">("in");
  const [shake, setShake] = useState(0);
  const cast = CASTS[c];
  const colour = (type: string) => (type === "Integer" ? tk.fill : type === "Decimal" ? tk.blue : tk.warn);

  useEffect(() => {
    setPhase("in");
    const t1 = setTimeout(() => setPhase("gate"), 250);
    const t2 = setTimeout(() => {
      setPhase("out");
      if (!CASTS[c].ok) setShake((s) => s + 1);
    }, 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [c]);

  const failed = !cast.ok && phase === "out";
  const pos: [number, number, number] = phase === "in" ? [-2.3, 0, 0] : phase === "gate" ? [0, 0, 0] : failed ? [0.3, -0.2, 0] : [2.3, 0, 0];

  return (
    <>
      <Stage label={pick(lang, "Un valor pasa por una puerta de conversión y sale con otro tipo, o falla.", "A value goes through a conversion gate and comes out as another type, or fails.")}>
        <Mover to={[0, 0, 0]} rot={[0, Math.PI / 2, 0]} spin={0.4}>
          <mesh>
            <torusGeometry args={[0.9, 0.08, 16, 64]} />
            <Mat color={failed ? tk.danger : tk.brand} />
          </mesh>
        </Mover>
        <Tag at={[0, 1.3, 0]} tone="quiet">
          {cast.code}
        </Tag>
        <Mover key={c} from={[-2.3, 0, 0]} to={pos} scale={failed ? 0.001 : 1} shake={failed ? shake : 0} speed={6}>
          {phase === "out" && cast.ok ? (
            <RoundedBox args={cast.outType === "String" ? [0.9, 0.5, 0.5] : [0.6, 0.6, 0.6]} radius={0.06}>
              <Mat color={colour(cast.outType)} />
            </RoundedBox>
          ) : (
            <mesh>
              {cast.inType === "Decimal" ? <cylinderGeometry args={[0.35, 0.35, 0.7, 32]} /> : <boxGeometry args={cast.inType === "String" ? [0.9, 0.5, 0.5] : [0.6, 0.6, 0.6]} />}
              <Mat color={colour(cast.inType)} />
            </mesh>
          )}
          {!failed && (
            <Tag at={[0, 0.65, 0]} tone="quiet">
              {phase === "out" && cast.ok ? `${cast.outType} ${cast.out}` : `${cast.inType} ${cast.input}`}
            </Tag>
          )}
        </Mover>
        {failed && (
          <Tag at={[0, -1.2, 0]} tone="bad">
            System.TypeException
          </Tag>
        )}
      </Stage>
      <Panel>
        <Choices label={pick(lang, "Conversión", "Conversion")} items={CASTS.map((x) => ({ id: x.id, label: x.code }))} value={c} onPick={setC} />
        {c === 0 && (
          <Readout code="Decimal price = 19.99;   price.intValue()  →  19" tone="ok">
            {pick(lang, "Corta la parte decimal, no redondea: 19, no 20.", "It chops the decimal part off, it does not round: 19, not 20.")}
          </Readout>
        )}
        {c === 1 && (
          <Readout code="Integer.valueOf('42')  →  42" tone="ok">
            {pick(lang, "El texto tiene forma de número, así que se convierte.", "The text looks like a number, so it converts.")}
          </Readout>
        )}
        {c === 2 && (
          <Readout code="System.TypeException: Invalid integer: abc" tone="bad">
            {pick(lang, "Compila, pero falla al ejecutar: 'abc' no tiene forma de número.", "It compiles, but fails when it runs: 'abc' does not look like a number.")}
          </Readout>
        )}
        {c === 3 && (
          <Readout code="String.valueOf(42)  →  '42'" tone="ok">
            {pick(lang, "Del número al texto: siempre funciona.", "From number to text: it always works.")}
          </Readout>
        )}
      </Panel>
    </>
  );
}

/* --------------------------------------------- 10. checkpoint: the shelf --- */

function ReviewScene({ lang }: SceneProps) {
  const tk = useTokens();
  const items = [
    { name: pick(lang, "Variable", "Variable"), recap: pick(lang, "Tipo, nombre y valor, como al crear un campo.", "Type, name and value, like creating a field.") },
    { name: "Boolean", recap: pick(lang, "true, false o null si nunca se asigna.", "true, false, or null if never assigned.") },
    { name: "String", recap: pick(lang, "Sus métodos devuelven un String nuevo. Posiciones desde 0.", "Its methods return a new String. Positions from 0.") },
    { name: "Date", recap: pick(lang, "Date sin zona horaria; Datetime en GMT.", "Date has no time zone; Datetime is GMT.") },
    { name: "sObject", recap: pick(lang, "Object Manager es la definición; el sObject, la fila.", "Object Manager is the definition; the sObject, the row.") },
    { name: "null", recap: pick(lang, "Llamar a un método sobre null: NullPointerException. ?. lo evita.", "Calling a method on null: NullPointerException. ?. avoids it.") },
    { name: pick(lang, "Operadores", "Operators"), recap: pick(lang, "Una comparación da un Boolean. == compara, = asigna.", "A comparison yields a Boolean. == compares, = assigns.") },
    { name: "List · Set · Map", recap: pick(lang, "Orden y repetidos; sin repetidos; clave y valor.", "Order and repeats; no repeats; key and value.") },
    { name: "Casting", recap: pick(lang, "intValue() corta; Integer.valueOf('abc') falla al ejecutar.", "intValue() chops; Integer.valueOf('abc') fails at runtime.") },
  ];
  const [sel, setSel] = useState<number | null>(null);
  const colours = [tk.brand, tk.fill, tk.warn, tk.danger, tk.blue, tk.faint, tk.muted, tk.violet, tk.brand];
  const n = items.length;
  const turn = sel === null ? 0 : -(sel / n) * Math.PI * 2;

  return (
    <>
      <Stage label={pick(lang, "Una estantería giratoria con los nueve conceptos del módulo.", "A turning shelf with the module's nine concepts.")} width={6.5}>
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[2.6, 2.6, 0.12, 64]} />
          <Mat color={tk.faint} opacity={0.35} />
        </mesh>
        <Mover rot={[0, turn, 0]} spin={sel === null ? 0.25 : 0} speed={4}>
          {items.map((it, i) => {
            const a = (i / n) * Math.PI * 2;
            const on = sel === i;
            return (
              <group key={i} position={[Math.sin(a) * 2.1, -0.25, Math.cos(a) * 2.1]}>
                <Mover to={[0, on ? 0.45 : 0, 0]} scale={on ? 1.35 : 1}>
                  <mesh>
                    {i % 3 === 0 ? <boxGeometry args={[0.55, 0.55, 0.55]} /> : i % 3 === 1 ? <sphereGeometry args={[0.32, 24, 24]} /> : <cylinderGeometry args={[0.3, 0.3, 0.55, 24]} />}
                    <Mat color={colours[i]} />
                  </mesh>
                  {on && (
                    <Tag at={[0, 0.65, 0]} tone="brand">
                      {it.name}
                    </Tag>
                  )}
                </Mover>
              </group>
            );
          })}
        </Mover>
      </Stage>
      <Panel>
        <Choices label={pick(lang, "Concepto", "Concept")} items={items.map((it, i) => ({ id: i, label: it.name }))} value={sel} onPick={setSel} />
        <Readout>
          {sel === null ? pick(lang, "Elige un concepto para traerlo al frente y repasarlo en una línea.", "Pick a concept to bring it to the front and review it in one line.") : items[sel].recap}
        </Readout>
      </Panel>
    </>
  );
}

/* ---------------------------------------------------------------- index --- */

export const SCENES_M01: Record<string, (p: SceneProps) => React.ReactElement> = {
  "m01-3d-variable": VariableScene,
  "m01-3d-types": TypesScene,
  "m01-3d-string": StringScene,
  "m01-3d-dates": DatesScene,
  "m01-3d-sobject": SObjectScene,
  "m01-3d-null": NullScene,
  "m01-3d-operators": OperatorsScene,
  "m01-3d-collections": CollectionsScene,
  "m01-3d-casting": CastingScene,
  "m01-3d-review": ReviewScene,
};

export function SceneM01({ id, lang }: { id: string; lang: SceneProps["lang"] }) {
  const S = SCENES_M01[id];
  return S ? <S lang={lang} /> : null;
}
