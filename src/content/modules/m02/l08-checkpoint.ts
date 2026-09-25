import type { Lesson } from "@/lib/types";

export const l08Checkpoint: Lesson = {
  id: "m02-l08",
  slug: "checkpoint",
  n: 8,
  kind: "checkpoint",
  minutes: 45,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 7", en: "Remember? · Review of lesson 7" },
    prompt: { es: "Quieres saber si la empresa de un lead está en la lista de clientes, sin recorrer la lista entera. ¿Qué usas?", en: "You want to know whether a lead's company is in the customer list, without walking the whole list. What do you use?" },
    options: [
      { es: "Un Set y contains()", en: "A Set and contains()" },
      { es: "Un bucle dentro de otro", en: "A loop inside another" },
      { es: "Un while", en: "A while" },
    ],
    answer: 0,
    explain: { es: "El Set es tu BUSCARV: contains() va directo a la respuesta, sin bajar con el dedo por la lista.", en: "The Set is your VLOOKUP: contains() goes straight to the answer, without running your finger down the list." },
  },
  title: { es: "Checkpoint del Módulo 2", en: "Module 2 Checkpoint" },
  summary: {
    es: "Las siete sub-lecciones juntas en una revisión de pipeline real: decidir, repartir, recorrer, saltar y parar.",
    en: "All seven sub-lessons together in a real pipeline review: deciding, routing, walking, skipping and stopping.",
  },
  analogy: {
    es: "Un Flow completo con Decision, Loop y salidas, escrito en código",
    en: "A complete Flow with Decision, Loop and outcomes, written as code",
  },
  objectives: [
    {
      es: "Elegir la estructura de control adecuada para cada pregunta de negocio.",
      en: "Choose the right control structure for each business question.",
    },
    {
      es: "Combinar en un mismo bucle guardas, clasificación por rangos y reparto por valores.",
      en: "Combine guards, range classification and value routing inside a single loop.",
    },
    {
      es: "Escribir un recorrido que aguante datos vacíos y registros que no aplican.",
      en: "Write a walk-through that survives empty data and records that do not apply.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "El Módulo 1 te dio los datos; el Módulo 2 te ha dado el control sobre ellos. Con estas siete piezas ya puedes escribir la lógica de casi cualquier Flow que hayas construido, y hacerlo de forma que aguante 200 registros a la vez.",
        en: "Module 1 gave you the data; Module 2 has given you control over it. With these seven pieces you can already write the logic of almost any Flow you have built, and do it in a way that holds up with 200 records at once.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has aprendido, sub-lección a sub-lección", en: "What you learned, sub-lesson by sub-lesson" },
    },
    {
      type: "p",
      text: {
        es: "1 · If / else / else if. El nodo Decision en código: una condición Boolean entre paréntesis y un bloque entre llaves. En una cadena gana la primera condición verdadera, así que los rangos se ordenan del más exigente al menos exigente. Y como todo empieza en null, un Boolean sin valor o un campo vacío comparado con >= revientan: se comprueba null primero.",
        en: "1 · If / else / else if. The Decision element in code: a Boolean condition in brackets and a block in braces. In a chain the first true condition wins, so ranges are ordered from strictest to loosest. And since everything starts as null, a Boolean without a value or an empty field compared with >= blows up: check for null first.",
      },
    },
    {
      type: "p",
      text: {
        es: "2 · Switch. Un Decision con una salida por valor de picklist. Los when llevan valores fijos —nunca rangos—, se agrupan con comas, when null recoge el vacío y when else va el último. Distingue mayúsculas, al contrario que ==.",
        en: "2 · Switch. A Decision with one outcome per picklist value. whens take fixed values — never ranges —, they are grouped with commas, when null catches the empty value and when else goes last. It is case-sensitive, unlike ==.",
      },
    },
    {
      type: "p",
      text: {
        es: "3 · Expresiones y sentencias. Una expresión vale algo, como un campo fórmula; una sentencia hace algo, como un elemento de Flow. Si solo cambia el valor, basta el operador condicional o la propia comparación Boolean. Y cada variable vive dentro de sus llaves: lo que necesitas después de un bloque se declara antes de él.",
        en: "3 · Expressions and statements. An expression has a value, like a formula field; a statement does something, like a Flow element. If only the value changes, the conditional operator or the Boolean comparison itself is enough. And every variable lives inside its braces: whatever you need after a block is declared before it.",
      },
    },
    {
      type: "p",
      text: {
        es: "4 · While. Repetir mientras algo siga siendo cierto, cuando no sabes cuántas vueltas harán falta. El cuerpo tiene que acercar la condición a false, o la transacción muere por CPU. Un tope en la condición es un seguro barato. do-while ejecuta al menos una vez.",
        en: "4 · While. Repeating while something is still true, when you do not know how many passes are needed. The body must move the condition towards false, or the transaction dies from CPU. A cap in the condition is cheap insurance. do-while runs at least once.",
      },
    },
    {
      type: "p",
      text: {
        es: "5 · For. El elemento Loop de Flow: for (Opportunity opp : opps) recorre cada registro sin que lleves la cuenta. Acumular y filtrar son los dos patrones clave, y su variable se declara fuera. keySet() y values() abren un Map. El for clásico, con sus tres partes, es para cuando lo que cuentas son vueltas.",
        en: "5 · For. Flow's Loop element: for (Opportunity opp : opps) walks every record without you keeping count. Accumulating and filtering are the two key patterns, and their variable is declared outside. keySet() and values() open up a Map. The classic for, with its three parts, is for when what you count is passes.",
      },
    },
    {
      type: "p",
      text: {
        es: "6 · Break y continue. continue salta al siguiente registro y deja el cuerpo plano con una guarda arriba; break deja de recorrer en cuanto encuentras lo que buscabas. La variable del hallazgo empieza en null fuera del bucle, y null al final significa «no había ninguno».",
        en: "6 · Break and continue. continue skips to the next record and keeps the body flat with a guard at the top; break stops walking as soon as you find what you were looking for. The finding's variable starts as null outside the loop, and null at the end means “there was none”.",
      },
    },
    {
      type: "p",
      text: {
        es: "7 · Loops anidados. Las vueltas se multiplican: 200 × 200 son 40.000. Cuando el anidado solo busca coincidencias, se sustituye por dos bucles seguidos y un Set o Map: preparar antes, consultar dentro. Es la regla que te acompañará todo el curso.",
        en: "7 · Nested loops. Passes multiply: 200 × 200 is 40,000. When the nesting only looks for matches, it is replaced by two loops in a row and a Set or Map: prepare before, look up inside. It is the rule that will follow you all course.",
      },
    },
    {
      type: "diagram",
      id: "m02-cp-choose",
      caption: {
        es: "Qué estructura elegir según la pregunta que te hace el negocio. Pruébate: elige la estructura para cada necesidad.",
        en: "Which structure to pick depending on the question the business is asking. Test yourself: pick the structure for each need.",
      },
    },
    {
      type: "h",
      text: { es: "Cómo se apoya el Módulo 2 en el Módulo 1", en: "How Module 2 builds on Module 1" },
    },
    {
      type: "table",
      head: [
        { es: "Del Módulo 1…", en: "From Module 1…" },
        { es: "…en el Módulo 2", en: "…in Module 2" },
      ],
      rows: [
        [
          { es: "Boolean y operadores &&, ||, !", en: "Boolean and the &&, ||, ! operators" },
          { es: "Son las condiciones de if y while", en: "They are the conditions of if and while" },
        ],
        [
          { es: "null, ?. y ??", en: "null, ?. and ??" },
          { es: "Condiciones y sumas que no revientan con campos vacíos", en: "Conditions and sums that do not blow up on empty fields" },
        ],
        [
          { es: "== ignora mayúsculas", en: "== ignores case" },
          { es: "switch, contains() y get() no", en: "switch, contains() and get() do not" },
        ],
        [
          { es: "List, Set y Map", en: "List, Set and Map" },
          { es: "Lo que recorre un for, y el BUSCARV que evita anidar", en: "What a for walks, and the VLOOKUP that avoids nesting" },
        ],
        [
          { es: "División entre Integers", en: "Integer division" },
          { es: "Contadores y condiciones de parada que se comportan distinto de lo esperado", en: "Counters and stop conditions that behave differently than expected" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes del quiz", en: "Before the quiz" },
      text: {
        es: "Explica en voz alta, sin mirar, qué estructura usarías para: asignar una cola según Case.Origin; contar las oportunidades de más de 10.000; encontrar el primer contacto sin correo; y marcar los leads cuya empresa ya es cliente.",
        en: "Explain aloud, without looking, which structure you would use to: assign a queue by Case.Origin; count opportunities over 10,000; find the first contact without an email; and flag leads whose company is already a customer.",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l08-q1",
      kind: "single",
      prompt: {
        es: "Hay que asignar una cola según Lead.LeadSource ('Web', 'Phone Inquiry', 'Partner Referral'…). ¿Qué estructura es la más clara?",
        en: "You need to assign a queue by Lead.LeadSource ('Web', 'Phone Inquiry', 'Partner Referral'…). Which structure is clearest?",
      },
      options: [
        { es: "switch on lead.LeadSource", en: "switch on lead.LeadSource" },
        { es: "Un while", en: "A while" },
        { es: "Dos bucles anidados", en: "Two nested loops" },
        { es: "El operador condicional", en: "The conditional operator" },
      ],
      answer: 0,
      explain: {
        es: "Valores exactos de un mismo campo: es el caso de libro de switch. El operador condicional solo elige entre dos valores.",
        en: "Exact values of a single field: the textbook case for switch. The conditional operator only picks between two values.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m02-l08-q2",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `List<Integer> scores = new List<Integer>{ 40, 90, 75, 20 };
Integer passed = 0;
for (Integer s : scores) {
    if (s < 50) {
        continue;
    }
    passed++;
}
System.debug(passed);`,
        en: `List<Integer> scores = new List<Integer>{ 40, 90, 75, 20 };
Integer passed = 0;
for (Integer s : scores) {
    if (s < 50) {
        continue;
    }
    passed++;
}
System.debug(passed);`,
      },
      options: [
        { es: "2", en: "2" },
        { es: "4", en: "4" },
        { es: "1", en: "1" },
        { es: "0", en: "0" },
      ],
      answer: 0,
      explain: {
        es: "40 y 20 se saltan con continue; 90 y 75 llegan al contador.",
        en: "40 and 20 are skipped with continue; 90 and 75 reach the counter.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M2 L6", en: "Review · M2 L6" },
    },
    {
      id: "m02-l08-q3",
      kind: "single",
      prompt: {
        es: "¿Qué valor tiene discount con amount = 60000?",
        en: "What value does discount hold with amount = 60000?",
      },
      code: {
        es: `Decimal discount;
if (amount >= 10000) {
    discount = 5;
} else if (amount >= 50000) {
    discount = 10;
} else {
    discount = 0;
}`,
        en: `Decimal discount;
if (amount >= 10000) {
    discount = 5;
} else if (amount >= 50000) {
    discount = 10;
} else {
    discount = 0;
}`,
      },
      options: [
        { es: "5", en: "5" },
        { es: "10", en: "10" },
        { es: "0", en: "0" },
        { es: "15", en: "15" },
      ],
      answer: 0,
      explain: {
        es: "60000 cumple ya la primera condición. El umbral de 50.000 nunca se alcanza: la cadena está mal ordenada.",
        en: "60000 already meets the first condition. The 50,000 threshold is never reached: the chain is in the wrong order.",
      },
      tags: ["predict-output", "find-error", "spaced"],
      from: { es: "Repaso · M2 L1", en: "Review · M2 L1" },
    },
    {
      id: "m02-l08-q4",
      kind: "single",
      prompt: {
        es: "¿Qué le pasa a este código?",
        en: "What is wrong with this code?",
      },
      code: {
        es: `for (Opportunity opp : opps) {
    Decimal pipeline = 0;
    pipeline += opp.Amount ?? 0;
}
System.debug(pipeline);`,
        en: `for (Opportunity opp : opps) {
    Decimal pipeline = 0;
    pipeline += opp.Amount ?? 0;
}
System.debug(pipeline);`,
      },
      options: [
        {
          es: "No compila: pipeline no existe fuera del bucle (y además se reiniciaría en cada vuelta).",
          en: "It does not compile: pipeline does not exist outside the loop (and it would also reset on every pass).",
        },
        {
          es: "Muestra la suma de todos los importes.",
          en: "It prints the sum of all amounts.",
        },
        {
          es: "Lanza una excepción por el ??.",
          en: "It throws an exception because of the ??.",
        },
      ],
      answer: 0,
      explain: {
        es: "Dos errores de ámbito en uno. El acumulador va antes del bucle.",
        en: "Two scope errors in one. The accumulator goes before the loop.",
      },
      tags: ["find-error", "interleaving"],
    },
    {
      id: "m02-l08-q5",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave sale de un bucle por completo en cuanto se ejecuta?",
        en: "Which keyword leaves a loop entirely as soon as it runs?",
      },
      accept: ["break"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "break. Recuerda que solo sale del bucle que lo contiene directamente.",
        en: "break. Remember it only leaves the loop that directly contains it.",
      },
      tags: ["recall"],
    },
    {
      id: "m02-l08-q6",
      kind: "single",
      prompt: {
        es: "¿Cuántas veces se ejecuta este cuerpo?",
        en: "How many times does this body run?",
      },
      code: {
        es: `Integer stock = 0;
while (stock > 0) {
    stock--;
}`,
        en: `Integer stock = 0;
while (stock > 0) {
    stock--;
}`,
      },
      options: [
        { es: "0", en: "0" },
        { es: "1", en: "1" },
        { es: "Infinitas", en: "Infinitely" },
      ],
      answer: 0,
      explain: {
        es: "while comprueba antes de la primera vuelta: 0 > 0 es false y no entra. Con do-while habría entrado una vez.",
        en: "while checks before the first pass: 0 > 0 is false and it does not go in. With do-while it would have gone in once.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M2 L4", en: "Review · M2 L4" },
    },
    {
      id: "m02-l08-q7",
      kind: "multi",
      prompt: {
        es: "Tienes 200 contactos y 200 cuentas y necesitas el nombre de la cuenta de cada contacto. ¿Qué afirmaciones son ciertas?",
        en: "You have 200 contacts and 200 accounts and need each contact's account name. Which statements are true?",
      },
      options: [
        {
          es: "Un Map<Id, Account> construido en un bucle previo permite resolverlo con get().",
          en: "A Map<Id, Account> built in an earlier loop lets you solve it with get().",
        },
        {
          es: "Dos bucles anidados harían 40.000 comparaciones.",
          en: "Two nested loops would make 40,000 comparisons.",
        },
        {
          es: "Con el Map, la solución hace unas 400 vueltas.",
          en: "With the Map, the solution makes about 400 passes.",
        },
        {
          es: "El anidado es igual de rápido porque son pocos registros.",
          en: "The nesting is just as fast because there are few records.",
        },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Preparar antes, consultar dentro. 200 registros no son pocos cuando se multiplican entre sí.",
        en: "Prepare before, look up inside. 200 records are not few once they multiply each other.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M2 L7", en: "Review · M2 L7" },
    },
    {
      id: "m02-l08-q8",
      kind: "single",
      prompt: {
        es: "¿Cuál es la forma más clara de guardar si una cuenta es grande (más de 500 empleados)?",
        en: "What is the clearest way to store whether an account is large (more than 500 employees)?",
      },
      options: [
        {
          es: "Boolean isLarge = acc.NumberOfEmployees > 500;",
          en: "Boolean isLarge = acc.NumberOfEmployees > 500;",
        },
        {
          es: "Boolean isLarge; if (acc.NumberOfEmployees > 500) { isLarge = true; } else { isLarge = false; }",
          en: "Boolean isLarge; if (acc.NumberOfEmployees > 500) { isLarge = true; } else { isLarge = false; }",
        },
        {
          es: "Un switch sobre NumberOfEmployees.",
          en: "A switch on NumberOfEmployees.",
        },
      ],
      answer: 0,
      explain: {
        es: "La comparación ya es la respuesta Boolean. (Si NumberOfEmployees pudiera venir vacío, harías acc.NumberOfEmployees != null && … en la misma línea.)",
        en: "The comparison already is the Boolean answer. (If NumberOfEmployees could be empty, you would write acc.NumberOfEmployees != null && … on the same line.)",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M2 L3", en: "Review · M2 L3" },
    },
    {
      id: "m02-l08-q9",
      kind: "single",
      prompt: {
        es: "Case.Priority vale 'high' (en minúsculas). ¿A qué rama va?",
        en: "Case.Priority is 'high' (lower case). Which branch does it go to?",
      },
      code: {
        es: `switch on c.Priority {
    when 'High' { hours = 4; }
    when null   { hours = 72; }
    when else   { hours = 48; }
}`,
        en: `switch on c.Priority {
    when 'High' { hours = 4; }
    when null   { hours = 72; }
    when else   { hours = 48; }
}`,
      },
      options: [
        { es: "when else (48)", en: "when else (48)" },
        { es: "when 'High' (4)", en: "when 'High' (4)" },
        { es: "when null (72)", en: "when null (72)" },
      ],
      answer: 0,
      explain: {
        es: "switch compara textos distinguiendo mayúsculas. Si los datos no son fiables, switch on c.Priority?.toUpperCase() con whens en mayúsculas lo resuelve.",
        en: "switch compares text case-sensitively. If the data is unreliable, switch on c.Priority?.toUpperCase() with upper-case whens solves it.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M2 L2", en: "Review · M2 L2" },
    },
    {
      id: "m02-l08-q10",
      kind: "single",
      prompt: {
        es: "Un bucle de búsqueda con break termina y found vale null. ¿Qué significa?",
        en: "A search loop with break ends and found is null. What does it mean?",
      },
      options: [
        {
          es: "Que se recorrió la lista entera sin encontrar ningún registro que cumpliera.",
          en: "That the whole list was walked without finding any matching record.",
        },
        {
          es: "Que el bucle no llegó a ejecutarse por un error.",
          en: "That the loop never ran because of an error.",
        },
        {
          es: "Que el registro encontrado tenía todos los campos vacíos.",
          en: "That the record found had every field empty.",
        },
      ],
      answer: 0,
      explain: {
        es: "found empezó en null y nadie le asignó nada. Esa es precisamente la señal de «no encontrado».",
        en: "found started as null and nobody assigned it anything. That is precisely the “not found” signal.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 8 DE 8 · La entrega. La revisión trimestral junta las reglas de las siete tareas anteriores sobre el pipeline real: no hay nada nuevo que aprender aquí, solo decidir qué herramienta va en cada parte. Ejercicio integrador. Dirección prepara la revisión trimestral y te pide, sobre las oportunidades abiertas: cuántas son grandes, medianas y pequeñas; el pipeline ponderado por probabilidad de etapa; y la primera oportunidad abierta que necesita revisión legal. Las cerradas no cuentan para nada, y hay una sin importe.",
      en: "TASK 8 OF 8 · Delivery. The quarterly review brings the rules of the previous seven tasks together on the real pipeline: nothing new to learn here, just deciding which tool goes in each part. Integrative exercise. Management is preparing the quarterly review and asks, about the open opportunities: how many are large, medium and small; the pipeline weighted by stage probability; and the first open opportunity that needs a legal review. Closed ones count for nothing, and one has no amount.",
    },
    brief: [
      {
        es: "Parte de la lista opps del código de partida. No cambies sus valores.",
        en: "Start from the opps list in the starter code. Do not change its values.",
      },
      {
        es: "Recorre opps con un for-each. Sáltate con continue las que estén en 'Closed Won' o 'Closed Lost'.",
        en: "Walk opps with a for-each. Skip with continue the ones in 'Closed Won' or 'Closed Lost'.",
      },
      {
        es: "Un importe vacío cuenta como 0.",
        en: "An empty amount counts as 0.",
      },
      {
        es: "largeCount, mediumCount y smallCount (Integer): 100.000 o más es grande; 20.000 o más, mediana; el resto, pequeña.",
        en: "largeCount, mediumCount and smallCount (Integer): 100,000 or more is large; 20,000 or more, medium; the rest, small.",
      },
      {
        es: "weightedPipeline (Decimal): suma de importe × probabilidad. La probabilidad sale de un switch sobre StageName: 'Prospecting' es 0.1, 'Negotiation' es 0.7 y cualquier otra etapa, 0.3.",
        en: "weightedPipeline (Decimal): the sum of amount × probability. The probability comes from a switch on StageName: 'Prospecting' is 0.1, 'Negotiation' is 0.7 and any other stage, 0.3.",
      },
      {
        es: "legalReview (Opportunity): en un segundo bucle, la primera oportunidad abierta de 250.000 o más. Para en cuanto la encuentres.",
        en: "legalReview (Opportunity): in a second loop, the first open opportunity worth 250,000 or more. Stop as soon as you find it.",
      },
      {
        es: "Al final muestra los resultados, y el nombre de legalReview solo si existe.",
        en: "At the end print the results, and legalReview's name only if it exists.",
      },
    ],
    starter: {
      es: `// CASO: las reglas de negocio de la cuenta clave · Northwind Trading
// Tarea 8 de 8: la revisión trimestral, con todo lo anterior.

List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Stark · Licencias', StageName = 'Closed Lost', Amount = 500000),
    new Opportunity(Name = 'Acme · Plataforma', StageName = 'Negotiation', Amount = 320000),
    new Opportunity(Name = 'Globex · Piloto', StageName = 'Prospecting', Amount = 15000),
    new Opportunity(Name = 'Initech · Renovación', StageName = 'Closed Won', Amount = 90000),
    new Opportunity(Name = 'Umbrella · Expansión', StageName = 'Negotiation'),
    new Opportunity(Name = 'Hooli · Servicios', StageName = 'Qualification', Amount = 45000),
    new Opportunity(Name = 'Wayne · Soporte', StageName = 'Prospecting', Amount = 120000)
};

// 1. Contadores y pipeline ponderado (un bucle).
// 2. Primera oportunidad abierta para revisión legal (otro bucle).
// 3. Resultados.
`,
      en: `// CASE: the key account's business rules · Northwind Trading
// Task 8 of 8: the quarterly review, with everything before.

List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Stark · Licences', StageName = 'Closed Lost', Amount = 500000),
    new Opportunity(Name = 'Acme · Platform', StageName = 'Negotiation', Amount = 320000),
    new Opportunity(Name = 'Globex · Pilot', StageName = 'Prospecting', Amount = 15000),
    new Opportunity(Name = 'Initech · Renewal', StageName = 'Closed Won', Amount = 90000),
    new Opportunity(Name = 'Umbrella · Expansion', StageName = 'Negotiation'),
    new Opportunity(Name = 'Hooli · Services', StageName = 'Qualification', Amount = 45000),
    new Opportunity(Name = 'Wayne · Support', StageName = 'Prospecting', Amount = 120000)
};

// 1. Counters and weighted pipeline (one loop).
// 2. First open opportunity for legal review (another loop).
// 3. Results.
`,
    },
    hints: [
      {
        es: "Yo lo organizaría por piezas, como un Flow grande que diseñas por tramos: variables antes de los bucles; en el primer bucle, guarda → importe seguro → if por tamaño → switch por etapa → acumular; en el segundo, guarda → condición → guardar y break. Fíjate en que la oportunidad más grande de la lista está cerrada.",
        en: "I would organise it in pieces, like a big Flow you design section by section: variables before the loops; in the first loop, guard → safe amount → if by size → switch by stage → accumulate; in the second, guard → condition → store and break. Notice that the biggest opportunity in the list is closed.",
      },
      {
        es: "Lo que me ayudó: la guarda es if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') { continue; }. El tamaño es una cadena if / else if / else de mayor a menor, como las salidas ordenadas de un Decision. La probabilidad es un Decimal declarado dentro del primer bucle y asignado en cada when.",
        en: "What helped me: the guard is if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') { continue; }. The size is an if / else if / else chain from highest to lowest, like the ordered outcomes of a Decision. The probability is a Decimal declared inside the first loop and assigned in each when.",
      },
      {
        es: "Te dejo el esquema: para cada opp { si cerrada → continue; amount = opp.Amount ?? 0; si ≥100000 large++ / si no si ≥20000 medium++ / si no small++; switch etapa → probability; weightedPipeline += amount * probability; } — Opportunity legalReview; para cada opp { si cerrada → continue; si amount ≥ 250000 { legalReview = opp; break; } }",
        en: "Here is the outline: for each opp { if closed → continue; amount = opp.Amount ?? 0; if ≥100000 large++ / else if ≥20000 medium++ / else small++; switch stage → probability; weightedPipeline += amount * probability; } — Opportunity legalReview; for each opp { if closed → continue; if amount ≥ 250000 { legalReview = opp; break; } }",
      },
    ],
    solution: {
      es: `List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Stark · Licencias', StageName = 'Closed Lost', Amount = 500000),
    new Opportunity(Name = 'Acme · Plataforma', StageName = 'Negotiation', Amount = 320000),
    new Opportunity(Name = 'Globex · Piloto', StageName = 'Prospecting', Amount = 15000),
    new Opportunity(Name = 'Initech · Renovación', StageName = 'Closed Won', Amount = 90000),
    new Opportunity(Name = 'Umbrella · Expansión', StageName = 'Negotiation'),
    new Opportunity(Name = 'Hooli · Servicios', StageName = 'Qualification', Amount = 45000),
    new Opportunity(Name = 'Wayne · Soporte', StageName = 'Prospecting', Amount = 120000)
};

Integer largeCount = 0;
Integer mediumCount = 0;
Integer smallCount = 0;
Decimal weightedPipeline = 0;

for (Opportunity opp : opps) {
    if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') {
        continue;
    }
    Decimal amount = opp.Amount ?? 0;

    if (amount >= 100000) {
        largeCount++;
    } else if (amount >= 20000) {
        mediumCount++;
    } else {
        smallCount++;
    }

    Decimal probability;
    switch on opp.StageName {
        when 'Prospecting' {
            probability = 0.1;
        }
        when 'Negotiation' {
            probability = 0.7;
        }
        when else {
            probability = 0.3;
        }
    }
    weightedPipeline += amount * probability;
}

Opportunity legalReview;
for (Opportunity opp : opps) {
    if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') {
        continue;
    }
    if ((opp.Amount ?? 0) >= 250000) {
        legalReview = opp;
        break;
    }
}

System.debug('Grandes ' + largeCount + ' · medianas ' + mediumCount + ' · pequeñas ' + smallCount);
System.debug('Pipeline ponderado: ' + weightedPipeline);   // 251000
if (legalReview != null) {
    System.debug('Revisión legal: ' + legalReview.Name);    // Acme · Plataforma
}`,
      en: `List<Opportunity> opps = new List<Opportunity>{
    new Opportunity(Name = 'Stark · Licences', StageName = 'Closed Lost', Amount = 500000),
    new Opportunity(Name = 'Acme · Platform', StageName = 'Negotiation', Amount = 320000),
    new Opportunity(Name = 'Globex · Pilot', StageName = 'Prospecting', Amount = 15000),
    new Opportunity(Name = 'Initech · Renewal', StageName = 'Closed Won', Amount = 90000),
    new Opportunity(Name = 'Umbrella · Expansion', StageName = 'Negotiation'),
    new Opportunity(Name = 'Hooli · Services', StageName = 'Qualification', Amount = 45000),
    new Opportunity(Name = 'Wayne · Support', StageName = 'Prospecting', Amount = 120000)
};

Integer largeCount = 0;
Integer mediumCount = 0;
Integer smallCount = 0;
Decimal weightedPipeline = 0;

for (Opportunity opp : opps) {
    if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') {
        continue;
    }
    Decimal amount = opp.Amount ?? 0;

    if (amount >= 100000) {
        largeCount++;
    } else if (amount >= 20000) {
        mediumCount++;
    } else {
        smallCount++;
    }

    Decimal probability;
    switch on opp.StageName {
        when 'Prospecting' {
            probability = 0.1;
        }
        when 'Negotiation' {
            probability = 0.7;
        }
        when else {
            probability = 0.3;
        }
    }
    weightedPipeline += amount * probability;
}

Opportunity legalReview;
for (Opportunity opp : opps) {
    if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') {
        continue;
    }
    if ((opp.Amount ?? 0) >= 250000) {
        legalReview = opp;
        break;
    }
}

System.debug('Large ' + largeCount + ' · medium ' + mediumCount + ' · small ' + smallCount);
System.debug('Weighted pipeline: ' + weightedPipeline);   // 251000
if (legalReview != null) {
    System.debug('Legal review: ' + legalReview.Name);     // Acme · Platform
}`,
    },
    checks: [
      {
        id: "m02-l08-c1",
        label: {
          es: "Los tres contadores y weightedPipeline se declaran a 0 antes del primer bucle",
          en: "The three counters and weightedPipeline are declared at 0 before the first loop",
        },
        rule: {
          op: "match",
          pattern:
            "(?=[\\s\\S]*Integer\\s+largeCount\\s*=\\s*0[\\s\\S]*\\bfor\\s*\\()(?=[\\s\\S]*Integer\\s+mediumCount\\s*=\\s*0[\\s\\S]*\\bfor\\s*\\()(?=[\\s\\S]*Integer\\s+smallCount\\s*=\\s*0[\\s\\S]*\\bfor\\s*\\()(?=[\\s\\S]*Decimal\\s+weightedPipeline\\s*=\\s*0[\\s\\S]*\\bfor\\s*\\()",
        },
        onFail: {
          es: "Contadores y acumuladores van antes del bucle y empiezan en 0. Dentro se reiniciarían en cada vuelta y morirían al terminar.",
          en: "Counters and accumulators go before the loop and start at 0. Inside, they would reset on every pass and die at the end.",
        },
        otter: {
          es: "Contadores y acumuladores son como las variables que creas en Flow antes del Loop: van antes del bucle y empiezan en 0. Dentro se reiniciarían en cada vuelta.",
          en: "Counters and accumulators are like the variables you create in Flow before the Loop: they go before the loop and start at 0. Inside it they would reset on every pass.",
        },
      },
      {
        id: "m02-l08-c2",
        label: {
          es: "Las oportunidades cerradas se saltan con continue",
          en: "Closed opportunities are skipped with continue",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "'Closed Won'" },
            { op: "match", pattern: "'Closed Lost'" },
            { op: "match", pattern: "continue\\s*;" },
          ],
        },
        onFail: {
          es: "La guarda arriba del cuerpo: if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') { continue; }",
          en: "The guard at the top of the body: if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') { continue; }",
        },
        otter: {
          es: "Las cerradas no aplican: la guarda arriba del cuerpo, como el Decision de «no aplica» que vuelve al Loop. if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') { continue; }",
          en: "Closed ones do not apply: the guard at the top of the body, like the «does not apply» Decision going back to the Loop. if (opp.StageName == 'Closed Won' || opp.StageName == 'Closed Lost') { continue; }",
        },
      },
      {
        id: "m02-l08-c3",
        label: {
          es: "El importe vacío no rompe nada",
          en: "The empty amount breaks nothing",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "\\.Amount\\s*\\?\\?\\s*0" },
            { op: "match", pattern: "\\.Amount\\s*!=\\s*null" },
            { op: "match", pattern: "\\.Amount\\s*==\\s*null" },
          ],
        },
        onFail: {
          es: "Umbrella no tiene importe: compararla con >= o multiplicarla lanza una excepción. Decimal amount = opp.Amount ?? 0;",
          en: "Umbrella has no amount: comparing it with >= or multiplying it throws an exception. Decimal amount = opp.Amount ?? 0;",
        },
        otter: {
          es: "Umbrella no tiene importe: compararla o multiplicarla lanza una excepción. Tu BLANKVALUE(Amount, 0): Decimal amount = opp.Amount ?? 0;",
          en: "Umbrella has no amount: comparing or multiplying it throws an exception. Your BLANKVALUE(Amount, 0): Decimal amount = opp.Amount ?? 0;",
        },
      },
      {
        id: "m02-l08-c4",
        label: {
          es: "El tamaño se clasifica con if / else if / else, de mayor a menor",
          en: "Size is classified with if / else if / else, from highest to lowest",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: ">=\\s*100000\\b[\\s\\S]*?else\\s+if\\s*\\([^)]*>=\\s*20000\\b" },
            {
              op: "any",
              of: [
                { op: "match", pattern: "largeCount\\s*(\\+\\+|\\+=\\s*1)" },
                { op: "match", pattern: "\\+\\+\\s*largeCount" },
              ],
            },
            {
              op: "any",
              of: [
                { op: "match", pattern: "mediumCount\\s*(\\+\\+|\\+=\\s*1)" },
                { op: "match", pattern: "\\+\\+\\s*mediumCount" },
              ],
            },
            {
              op: "any",
              of: [
                { op: "match", pattern: "smallCount\\s*(\\+\\+|\\+=\\s*1)" },
                { op: "match", pattern: "\\+\\+\\s*smallCount" },
              ],
            },
          ],
        },
        onFail: {
          es: "Primero ≥ 100000 (largeCount++), después else if ≥ 20000 (mediumCount++) y un else final (smallCount++). Gana la primera condición verdadera.",
          en: "First ≥ 100000 (largeCount++), then else if ≥ 20000 (mediumCount++) and a final else (smallCount++). The first true condition wins.",
        },
        otter: {
          es: "El tamaño son tres salidas de un Decision, ordenadas de mayor a menor porque gana la primera que se cumple: ≥ 100000 (largeCount++), else if ≥ 20000 (mediumCount++) y un else final (smallCount++).",
          en: "The size is three outcomes of a Decision, ordered from highest to lowest because the first one met wins: ≥ 100000 (largeCount++), else if ≥ 20000 (mediumCount++) and a final else (smallCount++).",
        },
      },
      {
        id: "m02-l08-c5",
        label: {
          es: "La probabilidad sale de un switch sobre StageName",
          en: "The probability comes from a switch on StageName",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "switch\\s+on\\s+\\(?\\s*\\w+\\.StageName" },
            { op: "match", pattern: "when\\s+'Prospecting'\\s*\\{\\s*\\w+\\s*=\\s*0?\\.10?\\s*;" },
            { op: "match", pattern: "when\\s+'Negotiation'\\s*\\{\\s*\\w+\\s*=\\s*0?\\.70?\\s*;" },
            { op: "match", pattern: "when\\s+else\\s*\\{\\s*\\w+\\s*=\\s*0?\\.30?\\s*;" },
          ],
        },
        onFail: {
          es: "Valores exactos de un picklist: switch on opp.StageName con when 'Prospecting' → 0.1, when 'Negotiation' → 0.7 y when else → 0.3.",
          en: "Exact picklist values: switch on opp.StageName with when 'Prospecting' → 0.1, when 'Negotiation' → 0.7 and when else → 0.3.",
        },
        otter: {
          es: "La probabilidad depende de valores exactos de un picklist, así que es un switch, tu Decision sobre StageName: when 'Prospecting' → 0.1, when 'Negotiation' → 0.7 y when else → 0.3.",
          en: "The probability depends on exact picklist values, so it is a switch, your Decision on StageName: when 'Prospecting' → 0.1, when 'Negotiation' → 0.7 and when else → 0.3.",
        },
      },
      {
        id: "m02-l08-c6",
        label: {
          es: "weightedPipeline acumula importe × probabilidad",
          en: "weightedPipeline accumulates amount × probability",
        },
        rule: {
          op: "match",
          pattern: "weightedPipeline\\s*(\\+=|=\\s*weightedPipeline\\s*\\+)[^;]*\\*[^;]*;",
        },
        onFail: {
          es: "En cada vuelta abierta: weightedPipeline += amount * probability;",
          en: "On every open pass: weightedPipeline += amount * probability;",
        },
        otter: {
          es: "weightedPipeline es como el campo Expected Revenue de la oportunidad: importe × probabilidad, acumulado en cada vuelta abierta. weightedPipeline += amount * probability;",
          en: "weightedPipeline is like the opportunity's Expected Revenue field: amount × probability, accumulated on every open pass. weightedPipeline += amount * probability;",
        },
        onPass: {
          es: "Con los datos del ejercicio, el pipeline ponderado sale 251.000.",
          en: "With the exercise's data, the weighted pipeline comes out at 251,000.",
        },
      },
      {
        id: "m02-l08-c7",
        label: {
          es: "legalReview se declara como Opportunity fuera de su bucle",
          en: "legalReview is declared as an Opportunity outside its loop",
        },
        rule: {
          op: "match",
          pattern: "Opportunity\\s+legalReview\\s*(=\\s*null\\s*)?;[\\s\\S]*\\bfor\\s*\\(",
        },
        onFail: {
          es: "La variable del hallazgo va antes del bucle de búsqueda: Opportunity legalReview;",
          en: "The finding's variable goes before the search loop: Opportunity legalReview;",
        },
        otter: {
          es: "legalReview es donde guardas el hallazgo, como una variable de registro en Flow: se declara antes del bucle de búsqueda. Opportunity legalReview;",
          en: "legalReview is where you keep the find, like a Flow record variable: declared before the search loop. Opportunity legalReview;",
        },
      },
      {
        id: "m02-l08-c8",
        label: {
          es: "La búsqueda se detiene con break al encontrar 250.000 o más",
          en: "The search stops with break on finding 250,000 or more",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: ">=\\s*250000\\b" },
            { op: "match", pattern: "legalReview\\s*=\\s*\\w+\\s*;\\s*break\\s*;" },
          ],
        },
        onFail: {
          es: "Dentro del if con ≥ 250000: legalReview = opp; y justo después break;",
          en: "Inside the if with ≥ 250000: legalReview = opp; and right after, break;",
        },
        otter: {
          es: "Es tu búsqueda en la vista de lista: en cuanto aparece una de 250.000 o más, dejas de leer. Dentro del if: legalReview = opp; y justo después break;",
          en: "It is your list-view search: as soon as one of 250,000 or more shows up, you stop reading. Inside the if: legalReview = opp; and right after that, break;",
        },
      },
      {
        id: "m02-l08-c9",
        label: {
          es: "La búsqueda también ignora las cerradas",
          en: "The search also ignores closed ones",
        },
        rule: { op: "count", pattern: "'Closed Lost'", min: 2 },
        onFail: {
          es: "Stark está cerrada y es la primera de 250.000 o más. Si el segundo bucle no la salta, legalReview acaba en una oportunidad perdida.",
          en: "Stark is closed and is the first one worth 250,000 or more. If the second loop does not skip it, legalReview ends up on a lost opportunity.",
        },
        otter: {
          es: "Stark está cerrada y es la primera de 250.000 o más. Si el segundo bucle no la salta, legalReview acaba en una oportunidad perdida: la guarda de las cerradas también va aquí.",
          en: "Stark is closed and is the first one of 250,000 or more. If the second loop does not skip it, legalReview ends up on a lost opportunity: the closed-ones guard goes here too.",
        },
        onPass: {
          es: "Bien visto: la condición de negocio era «abierta y ≥ 250.000», no solo «≥ 250.000».",
          en: "Well spotted: the business condition was “open and ≥ 250,000”, not just “≥ 250,000”.",
        },
      },
      {
        id: "m02-l08-c10",
        label: {
          es: "Comprueba que legalReview existe antes de leer su nombre",
          en: "Checks that legalReview exists before reading its name",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "legalReview\\s*!=\\s*null" },
            { op: "match", pattern: "legalReview\\s*==\\s*null" },
            { op: "match", pattern: "legalReview\\?\\.Name" },
          ],
        },
        onFail: {
          es: "Si ninguna cumpliera, legalReview.Name lanzaría una excepción. Pregunta antes if (legalReview != null).",
          en: "If none matched, legalReview.Name would throw an exception. Ask first: if (legalReview != null).",
        },
        otter: {
          es: "Si ninguna cumpliera, legalReview.Name lanzaría una excepción. Es el Decision «¿se encontró?» que ponías después de un Get Records en Flow: if (legalReview != null).",
          en: "If none matched, legalReview.Name would throw an exception. It is the «was it found?» Decision you put after a Get Records in Flow: if (legalReview != null).",
        },
      },
    ],
    rubric: [
      {
        es: "¿Se lee cada bloque como una frase del encargo de Dirección? Si alguien te pide mañana añadir la etapa 'Proposal' con 0.5, ¿cuántas líneas tocas?",
        en: "Does each block read like a sentence from management's request? If someone asks tomorrow to add the 'Proposal' stage at 0.5, how many lines do you touch?",
      },
      {
        es: "Cambia el Amount de Acme a 200000. ¿Tu código muestra el resultado sin fallar cuando no hay revisión legal?",
        en: "Change Acme's Amount to 200000. Does your code print the result without failing when there is no legal review?",
      },
    ],
    outro: {
      es: "¡Entregaste la revisión trimestral con todas las reglas que pidió Northwind! Ya decides y repites como en un Flow, pero en código. Hasta ahora los datos venían escritos en el propio código; en el Módulo 3 se los pides a la org con SOQL, empezando por ver qué cuentas hay en la cartera.",
      en: "You delivered the quarterly review with every rule Northwind asked for! You now decide and repeat as in a Flow, but in code. Until now the data was written into the code itself; in Module 3 you ask the org for it with SOQL, starting with which accounts are in the portfolio.",
    },
    voice: "otter",
  },
};
