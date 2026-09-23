import type { Lesson } from "@/lib/types";

export const l01IfElse: Lesson = {
  id: "m02-l01",
  slug: "if-else",
  n: 1,
  kind: "lesson",
  minutes: 20,
  title: { es: "If / Else / Else If", en: "If / Else / Else If" },
  summary: {
    es: "El nodo Decision de Flow, escrito en código: una pregunta de sí o no, y qué hacer en cada caso.",
    en: "Flow's Decision element, written as code: a yes-or-no question, and what to do in each case.",
  },
  analogy: {
    es: "Un nodo Decision de Flow con sus salidas y la salida por defecto",
    en: "A Flow Decision element with its outcomes and the default outcome",
  },
  objectives: [
    {
      es: "Escribir un if con su condición y su bloque, y añadirle else y else if.",
      en: "Write an if with its condition and block, and add else and else if to it.",
    },
    {
      es: "Ordenar las ramas de un else if sabiendo que gana la primera que se cumple.",
      en: "Order the branches of an else if knowing that the first true one wins.",
    },
    {
      es: "Escribir condiciones que no revienten cuando un valor viene vacío.",
      en: "Write conditions that do not blow up when a value arrives empty.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Hasta ahora tu código hacía siempre lo mismo, de arriba abajo. Con if aprende a elegir: «si la oportunidad supera 100.000, avisa a dirección; si no, sigue». Es la primera vez que el código decide, y lo hace exactamente como un nodo Decision.",
        en: "Until now your code always did the same thing, top to bottom. With if it learns to choose: “if the opportunity is over 100,000, alert management; otherwise, carry on.” It is the first time the code decides, and it does so exactly like a Decision element.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En Flow arrastras un Decision, creas una salida «Gran cuenta» con la condición Amount ≥ 100000 y dejas la salida por defecto para todo lo demás. En Apex, la salida es if, la condición va entre paréntesis y lo que cuelga de la salida va entre llaves. La salida por defecto se llama else.",
        en: "In Flow you drag in a Decision, create a “Big account” outcome with the condition Amount ≥ 100000, and leave the default outcome for everything else. In Apex the outcome is if, the condition goes in brackets, and what hangs off the outcome goes in braces. The default outcome is called else.",
      },
    },
    {
      type: "h",
      text: { es: "Anatomía de un if", en: "Anatomy of an if" },
    },
    {
      type: "p",
      text: {
        es: "Un if tiene tres piezas: la palabra if, una condición entre paréntesis que vale true o false, y un [[bloque]] entre llaves con lo que se hace cuando es true. Si la condición es false, el bloque entero se salta y el código sigue debajo.",
        en: "An if has three pieces: the word if, a condition in brackets that evaluates to true or false, and a [[bloque|block]] in braces with what to do when it is true. If the condition is false, the whole block is skipped and the code carries on below.",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal amount = 150000;

if (amount >= 100000) {
    System.debug('Avisar a dirección');
}
System.debug('Esta línea se ejecuta siempre');`,
        en: `Decimal amount = 150000;

if (amount >= 100000) {
    System.debug('Alert management');
}
System.debug('This line always runs');`,
      },
      caption: {
        es: "Las líneas dentro de las llaves van sangradas cuatro espacios: no cambia nada para Apex, pero hace visible qué depende de la condición.",
        en: "Lines inside the braces are indented four spaces: it changes nothing for Apex, but it makes visible what depends on the condition.",
      },
    },
    {
      type: "h",
      text: { es: "else: la salida por defecto", en: "else: the default outcome" },
    },
    {
      type: "p",
      text: {
        es: "else no lleva condición: recoge todo lo que no entró en el if. De las dos ramas se ejecuta siempre exactamente una, nunca las dos y nunca ninguna.",
        en: "else takes no condition: it catches everything that did not get into the if. Of the two branches exactly one always runs, never both and never neither.",
      },
    },
    {
      type: "code",
      code: {
        es: `String approver;

if (amount >= 100000) {
    approver = 'Director comercial';
} else {
    approver = 'Jefe de equipo';
}`,
        en: `String approver;

if (amount >= 100000) {
    approver = 'Sales director';
} else {
    approver = 'Team lead';
}`,
      },
    },
    {
      type: "h",
      text: { es: "else if: varias salidas, en orden", en: "else if: several outcomes, in order" },
    },
    {
      type: "p",
      text: {
        es: "Cuando hay más de dos casos encadenas else if. Apex evalúa las condiciones de arriba abajo y entra en la primera que se cumple; las demás ni se miran. Es la misma regla que el orden de las salidas en un Decision de Flow, y es la fuente del error más común con else if.",
        en: "When there are more than two cases you chain else if. Apex evaluates the conditions top to bottom and enters the first one that holds; the rest are not even looked at. It is the same rule as the order of outcomes in a Flow Decision, and it is the source of the most common else if mistake.",
      },
    },
    {
      type: "diagram",
      id: "m02-if-chain",
      caption: {
        es: "Una cadena de else if es un Decision con salidas ordenadas: la primera condición verdadera gana y el resto se salta. Elige una facturación y reprodúcelo paso a paso.",
        en: "An else if chain is a Decision with ordered outcomes: the first true condition wins and the rest are skipped. Pick a revenue and play it step by step.",
      },
    },
    {
      type: "code",
      code: {
        es: `// ❌ Mal ordenado: 250.000 cumple la primera condición
if (amount >= 10000) {
    tier = 'Bronce';
} else if (amount >= 100000) {
    tier = 'Oro';          // nunca se alcanza
}

// ✅ De la condición más exigente a la menos exigente
if (amount >= 100000) {
    tier = 'Oro';
} else if (amount >= 10000) {
    tier = 'Bronce';
} else {
    tier = 'Estándar';
}`,
        en: `// ❌ Wrong order: 250,000 meets the first condition
if (amount >= 10000) {
    tier = 'Bronze';
} else if (amount >= 100000) {
    tier = 'Gold';         // never reached
}

// ✅ From the strictest condition to the loosest
if (amount >= 100000) {
    tier = 'Gold';
} else if (amount >= 10000) {
    tier = 'Bronze';
} else {
    tier = 'Standard';
}`,
      },
      caption: {
        es: "Con rangos numéricos, empieza siempre por el más alto.",
        en: "With numeric ranges, always start with the highest one.",
      },
    },
    {
      type: "h",
      text: { es: "Condiciones que no revientan", en: "Conditions that do not blow up" },
    },
    {
      type: "p",
      text: {
        es: "La condición tiene que ser un Boolean. Y aquí vuelve el [[null]] del Módulo 1: un Boolean declarado sin valor no es false, es null, y un if sobre null lanza una [[excepcion|excepción]]. Lo mismo pasa si comparas un campo vacío con un número. La defensa es la de siempre: comprobar null primero y apoyarte en la evaluación en corto de &&.",
        en: "The condition has to be a Boolean. And here the [[null]] from Module 1 returns: a Boolean declared without a value is not false, it is null, and an if on null throws an [[excepcion|exception]]. The same happens if you compare an empty field with a number. The defence is the usual one: check for null first and lean on the short-circuit evaluation of &&.",
      },
    },
    {
      type: "code",
      code: {
        es: `Boolean hasOptedOut;               // null, no false
if (hasOptedOut) { }                // ❌ NullPointerException

Opportunity opp = new Opportunity(Name = 'Renovación');
// Amount está vacío: comprueba antes de comparar
if (opp.Amount != null && opp.Amount > 50000) {
    System.debug('Oportunidad grande');
}`,
        en: `Boolean hasOptedOut;               // null, not false
if (hasOptedOut) { }                // ❌ NullPointerException

Opportunity opp = new Opportunity(Name = 'Renewal');
// Amount is empty: check before comparing
if (opp.Amount != null && opp.Amount > 50000) {
    System.debug('Big opportunity');
}`,
      },
      caption: {
        es: "Si opp.Amount es null, && ni siquiera evalúa la segunda parte.",
        en: "If opp.Amount is null, && does not even evaluate the second part.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "= no es ==", en: "= is not ==" },
      text: {
        es: "if (stage = 'Closed Won') no pregunta nada: intenta asignar. Apex no lo deja compilar porque el resultado no es un Boolean. Dentro de una condición siempre va ==.",
        en: "if (stage = 'Closed Won') asks nothing: it tries to assign. Apex will not compile it because the result is not a Boolean. Inside a condition it is always ==.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Pon siempre las llaves", en: "Always use braces" },
      text: {
        es: "Apex acepta un if sin llaves cuando solo hay una línea, pero en cuanto alguien añade una segunda línea, esa ya no depende de la condición aunque esté sangrada. Con llaves, ese error no puede ocurrir.",
        en: "Apex accepts an if without braces when there is only one line, but as soon as someone adds a second line, that one no longer depends on the condition even though it is indented. With braces, that mistake cannot happen.",
      },
    },
    {
      type: "table",
      head: [
        { es: "En Flow", en: "In Flow" },
        { es: "En Apex", en: "In Apex" },
      ],
      rows: [
        [
          { es: "Elemento Decision", en: "Decision element" },
          { es: "if / else if / else", en: "if / else if / else" },
        ],
        [
          { es: "Condición de una salida", en: "An outcome's condition" },
          { es: "(amount >= 100000)", en: "(amount >= 100000)" },
        ],
        [
          { es: "«All conditions are met»", en: "“All conditions are met”" },
          { es: "&&", en: "&&" },
        ],
        [
          { es: "«Any condition is met»", en: "“Any condition is met”" },
          { es: "||", en: "||" },
        ],
        [
          { es: "Salida por defecto", en: "Default outcome" },
          { es: "else", en: "else" },
        ],
      ],
    },
    {
      type: "h",
      text: { es: "El encargo de este módulo", en: "This module's assignment" },
    },
    {
      type: "p",
      text: {
        es: "En el Módulo 1 preparaste los datos de la renovación de Northwind Trading. Ahora que los datos están, la reunión con Ventas cambia de tono: ya no piden «guárdame esto», piden «que Salesforce DECIDA solo». Y decidir es exactamente de lo que va este módulo. Como en el anterior, los ocho talleres son un mismo encargo troceado: cada uno resuelve una regla, y la última tarea las junta todas.",
        en: "In Module 1 you prepared the data for Northwind Trading's renewal. Now the data is there, the meeting with Sales changes tone: they no longer ask “store this for me”, they ask “let Salesforce DECIDE on its own”. And deciding is exactly what this module is about. As in the previous one, the eight workshops are one assignment cut into pieces: each solves one rule, and the last task puts them all together.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Lo que pidieron, regla por regla", en: "What they asked for, rule by rule" },
      text: {
        es: "«Queremos que el sistema decida solo: el nivel de servicio de cada cuenta según lo que factura; en cuántas horas se responde cada caso según su prioridad; quién aprueba cada renovación y si pasa por Legal; cuántos meses faltan para el objetivo; el resumen del pipeline del lunes; cuál es el primer caso urgente de la cola; qué leads de la feria son de clientes que ya tenemos; y la revisión trimestral con todo eso junto». Como Admin lo habrías intentado con reglas de validación, fórmulas y Flows repartidos por la org. Aquí va todo en código, y la primera regla es la de hoy.",
        en: "“We want the system to decide on its own: each account's service tier from what it bills; how many hours each case gets for a response from its priority; who approves each renewal and whether it goes through Legal; how many months until the target; Monday's pipeline summary; which is the first urgent case in the queue; which trade-show leads come from customers we already have; and the quarterly review with all of that together.” As an Admin you would have tried it with validation rules, formulas and Flows scattered across the org. Here it all goes in code, and the first rule is today's.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: en una cadena de else if, ¿qué rama se ejecuta si se cumplen dos condiciones a la vez? ¿Y por qué eso te obliga a pensar el orden?",
        en: "Without looking up: in an else if chain, which branch runs if two conditions hold at once? And why does that force you to think about the order?",
      },
    },
  ],

  quiz: [
    {
      id: "m02-l01-q1",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `Integer score = 85;
String grade;
if (score >= 50) {
    grade = 'C';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'D';
}
System.debug(grade);`,
        en: `Integer score = 85;
String grade;
if (score >= 50) {
    grade = 'C';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'D';
}
System.debug(grade);`,
      },
      options: [
        { es: "C", en: "C" },
        { es: "B", en: "B" },
        { es: "D", en: "D" },
        { es: "C y después B", en: "C and then B" },
      ],
      answer: 0,
      explain: {
        es: "85 cumple la primera condición (≥ 50), así que entra ahí y el resto de la cadena ni se evalúa. Para que salga B, la condición ≥ 80 tendría que ir antes.",
        en: "85 meets the first condition (≥ 50), so it goes in there and the rest of the chain is not even evaluated. For B to come out, the ≥ 80 condition would have to come first.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m02-l01-q2",
      kind: "single",
      prompt: { es: "¿Qué le pasa a este código?", en: "What is wrong with this code?" },
      code: {
        es: `String stage = 'Prospecting';
if (stage = 'Closed Won') {
    System.debug('¡Ganada!');
}`,
        en: `String stage = 'Prospecting';
if (stage = 'Closed Won') {
    System.debug('Won!');
}`,
      },
      options: [
        {
          es: "No compila: usa = (asignar) en lugar de == (comparar).",
          en: "It does not compile: it uses = (assign) instead of == (compare).",
        },
        {
          es: "Compila y muestra «¡Ganada!».",
          en: "It compiles and prints “Won!”.",
        },
        {
          es: "Compila y no muestra nada.",
          en: "It compiles and prints nothing.",
        },
        {
          es: "Compila, pero cambia la etapa a Closed Won.",
          en: "It compiles, but changes the stage to Closed Won.",
        },
      ],
      answer: 0,
      explain: {
        es: "Una condición tiene que ser un Boolean. stage = 'Closed Won' es una asignación, no una pregunta, y Apex la rechaza al compilar.",
        en: "A condition has to be a Boolean. stage = 'Closed Won' is an assignment, not a question, and Apex rejects it at compile time.",
      },
      tags: ["find-error"],
    },
    {
      id: "m02-l01-q3",
      kind: "single",
      prompt: {
        es: "¿Entra el código en el bloque del if?",
        en: "Does the code enter the if block?",
      },
      code: {
        es: `String region = 'emea';
if (region == 'EMEA') {
    System.debug('Equipo europeo');
}`,
        en: `String region = 'emea';
if (region == 'EMEA') {
    System.debug('European team');
}`,
      },
      options: [
        {
          es: "Sí: == entre Strings ignora mayúsculas y minúsculas.",
          en: "Yes: == between Strings ignores upper and lower case.",
        },
        {
          es: "No: 'emea' y 'EMEA' son textos distintos.",
          en: "No: 'emea' and 'EMEA' are different texts.",
        },
        {
          es: "No compila: los Strings se comparan con equals().",
          en: "It does not compile: Strings are compared with equals().",
        },
      ],
      answer: 0,
      explain: {
        es: "Lo viste en String: == compara textos sin distinguir mayúsculas. Si necesitas una comparación estricta, usa equals().",
        en: "You saw it in String: == compares text without telling case apart. If you need a strict comparison, use equals().",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M1 L3", en: "Review · M1 L3" },
    },
    {
      id: "m02-l01-q4",
      kind: "text",
      prompt: {
        es: "¿Qué palabra clave abre la rama que se ejecuta cuando ninguna condición anterior se ha cumplido?",
        en: "Which keyword opens the branch that runs when no previous condition was met?",
      },
      accept: ["else"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "else. Es la salida por defecto del Decision: no lleva condición y recoge todo lo demás.",
        en: "else. It is the Decision's default outcome: it takes no condition and catches everything else.",
      },
      tags: ["recall"],
    },
    {
      id: "m02-l01-q5",
      kind: "multi",
      prompt: {
        es: "Con Decimal amount, Boolean isActive e Integer count ya declarados y con valor, ¿cuáles son condiciones válidas para un if?",
        en: "With Decimal amount, Boolean isActive and Integer count already declared and holding values, which are valid conditions for an if?",
      },
      options: [
        { es: "amount > 1000 && isActive", en: "amount > 1000 && isActive" },
        { es: "!isActive", en: "!isActive" },
        { es: "count", en: "count" },
        { es: "count == 0 || amount == null", en: "count == 0 || amount == null" },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Una condición tiene que dar true o false. count es un Integer, no una pregunta: Apex no traduce 0 a false como otros lenguajes.",
        en: "A condition has to produce true or false. count is an Integer, not a question: Apex does not translate 0 into false the way other languages do.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m02-l01-q6",
      kind: "single",
      prompt: { es: "¿Qué ocurre al ejecutar esto?", en: "What happens when this runs?" },
      code: {
        es: `Boolean hasOptedOut;
if (hasOptedOut) {
    System.debug('No enviar correo');
}`,
        en: `Boolean hasOptedOut;
if (hasOptedOut) {
    System.debug('Do not send email');
}`,
      },
      options: [
        {
          es: "Lanza una excepción: hasOptedOut es null, no false.",
          en: "It throws an exception: hasOptedOut is null, not false.",
        },
        {
          es: "No muestra nada, porque un Boolean vacío vale false.",
          en: "It prints nothing, because an empty Boolean is false.",
        },
        {
          es: "Muestra «No enviar correo».",
          en: "It prints “Do not send email”.",
        },
      ],
      answer: 0,
      explain: {
        es: "Todo empieza en null, también los Boolean. Un if necesita true o false; con null lanza NullPointerException. Declara Boolean hasOptedOut = false; si ese es el valor que quieres.",
        en: "Everything starts as null, Booleans included. An if needs true or false; with null it throws a NullPointerException. Declare Boolean hasOptedOut = false; if that is the value you want.",
      },
      tags: ["spaced", "predict-output"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 1 DE 8 · Primera regla del encargo: el nivel de servicio de cada cuenta. Customer Success quiere clasificar a cada cuenta en un nivel de servicio según su facturación anual: 1.000.000 o más es 'Platinum', 100.000 o más es 'Gold' y el resto 'Standard'. Hay cuentas sin facturación registrada: esas también son 'Standard', y el código no puede fallar con ellas.",
      en: "TASK 1 OF 8 · The first rule in the request: each account's service tier. Customer Success wants to place every account in a service tier by its annual revenue: 1,000,000 or more is 'Platinum', 100,000 or more is 'Gold' and the rest are 'Standard'. Some accounts have no revenue on record: those are 'Standard' too, and the code must not fail on them.",
    },
    brief: [
      {
        es: "Parte de la variable annualRevenue del código de partida. Prueba el código cambiando su valor, incluido null.",
        en: "Start from the annualRevenue variable in the starter code. Test the code by changing its value, null included.",
      },
      {
        es: "Declara una variable de texto llamada tier para guardar el nivel.",
        en: "Declare a text variable named tier to hold the level.",
      },
      {
        es: "Usa if, else if y else. Piensa en qué orden deben ir las condiciones.",
        en: "Use if, else if and else. Think about which order the conditions must go in.",
      },
      {
        es: "Si annualRevenue es null, tier debe ser 'Standard' sin que el código lance una excepción.",
        en: "If annualRevenue is null, tier must be 'Standard' without the code throwing an exception.",
      },
    ],
    starter: {
      es: `// CASO: las reglas de negocio de la cuenta clave · Northwind Trading
// Tarea 1 de 8: el nivel de servicio según lo que factura la cuenta.

Decimal annualRevenue = 250000;

// Declara tier y asígnale 'Platinum', 'Gold' o 'Standard'.
`,
      en: `// CASE: the key account's business rules · Northwind Trading
// Task 1 of 8: the service tier from what the account bills.

Decimal annualRevenue = 250000;

// Declare tier and assign it 'Platinum', 'Gold' or 'Standard'.
`,
    },
    hints: [
      {
        es: "Hay tres resultados posibles y un caso especial (el vacío). Revisa que cada resultado tenga su rama y que el caso vacío no llegue nunca a una comparación con >=.",
        en: "There are three possible results and a special case (the empty one). Check that each result has its branch and that the empty case never reaches a >= comparison.",
      },
      {
        es: "En una cadena de else if gana la primera condición verdadera: 1.000.000 también es ≥ 100.000, así que el umbral alto tiene que ir antes. Para el null, compruébalo en la primera condición o conviértelo en 0 con ?? antes de comparar.",
        en: "In an else if chain the first true condition wins: 1,000,000 is also ≥ 100,000, so the high threshold must come first. For null, check it in the first condition or turn it into 0 with ?? before comparing.",
      },
      {
        es: "Pseudocódigo: String tier; si revenue es null → 'Standard'; si no, si revenue ≥ 1000000 → 'Platinum'; si no, si revenue ≥ 100000 → 'Gold'; si no → 'Standard'.",
        en: "Pseudocode: String tier; if revenue is null → 'Standard'; else if revenue ≥ 1000000 → 'Platinum'; else if revenue ≥ 100000 → 'Gold'; else → 'Standard'.",
      },
    ],
    solution: {
      es: `Decimal annualRevenue = 250000;

String tier;
if (annualRevenue == null) {
    tier = 'Standard';
} else if (annualRevenue >= 1000000) {
    tier = 'Platinum';
} else if (annualRevenue >= 100000) {
    tier = 'Gold';
} else {
    tier = 'Standard';
}
System.debug(tier);`,
      en: `Decimal annualRevenue = 250000;

String tier;
if (annualRevenue == null) {
    tier = 'Standard';
} else if (annualRevenue >= 1000000) {
    tier = 'Platinum';
} else if (annualRevenue >= 100000) {
    tier = 'Gold';
} else {
    tier = 'Standard';
}
System.debug(tier);`,
    },
    checks: [
      {
        id: "m02-l01-c1",
        label: { es: "tier se declara como String", en: "tier is declared as a String" },
        rule: { op: "match", pattern: "String\\s+tier\\s*[;=]" },
        onFail: {
          es: "El nivel es un texto: declara String tier; antes de la cadena de if.",
          en: "The tier is text: declare String tier; before the if chain.",
        },
      },
      {
        id: "m02-l01-c2",
        label: {
          es: "Usa if, else if y else",
          en: "Uses if, else if and else",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\bif\\s*\\(" },
            { op: "match", pattern: "else\\s+if\\s*\\(" },
            { op: "match", pattern: "else\\s*\\{" },
          ],
        },
        onFail: {
          es: "Tres niveles piden al menos un if, un else if y un else final para lo que no encaje en nada.",
          en: "Three tiers call for at least an if, an else if and a final else for whatever fits nowhere.",
        },
      },
      {
        id: "m02-l01-c3",
        label: {
          es: "Asigna los tres niveles: 'Platinum', 'Gold' y 'Standard'",
          en: "Assigns all three tiers: 'Platinum', 'Gold' and 'Standard'",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "tier\\s*=\\s*'Platinum'" },
            { op: "match", pattern: "tier\\s*=\\s*'Gold'" },
            { op: "match", pattern: "tier\\s*=\\s*'Standard'" },
          ],
        },
        onFail: {
          es: "Cada rama debe asignar su nivel a tier, con el texto exacto entre comillas simples.",
          en: "Each branch must assign its tier to tier, with the exact text in single quotes.",
        },
      },
      {
        id: "m02-l01-c4",
        label: {
          es: "El umbral de 1.000.000 se comprueba antes que el de 100.000",
          en: "The 1,000,000 threshold is checked before the 100,000 one",
        },
        rule: {
          op: "match",
          pattern: ">=\\s*1000000\\b[\\s\\S]*>=\\s*100000\\b",
        },
        onFail: {
          es: "Gana la primera condición verdadera: una cuenta de 2.000.000 también es ≥ 100.000, así que si esa comprobación va primero, nunca llegará a 'Platinum'.",
          en: "The first true condition wins: a 2,000,000 account is also ≥ 100,000, so if that check comes first it will never reach 'Platinum'.",
        },
        onPass: {
          es: "De lo más exigente a lo menos exigente: así se ordena cualquier cadena de rangos.",
          en: "From strictest to loosest: that is how any chain of ranges is ordered.",
        },
      },
      {
        id: "m02-l01-c5",
        label: {
          es: "Un annualRevenue vacío no provoca una excepción",
          en: "An empty annualRevenue does not cause an exception",
        },
        rule: {
          op: "any",
          of: [
            { op: "match", pattern: "annualRevenue\\s*==\\s*null" },
            { op: "match", pattern: "annualRevenue\\s*!=\\s*null" },
            { op: "match", pattern: "annualRevenue\\s*\\?\\?" },
          ],
        },
        onFail: {
          es: "Compara null con >= y la transacción se cae. Comprueba annualRevenue == null en la primera rama, o conviértelo con annualRevenue ?? 0 antes de comparar.",
          en: "Compare null with >= and the transaction falls over. Check annualRevenue == null in the first branch, or convert it with annualRevenue ?? 0 before comparing.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Podría otra persona añadir un nivel 'Silver' sin tener que reordenar nada más que una línea?",
        en: "Could someone else add a 'Silver' tier without reordering more than one line?",
      },
      {
        es: "Tarea 2: ya sabes qué nivel tiene cada cuenta; Soporte necesita ahora en cuántas horas responder a sus casos, y ahí un if tras otro empieza a hacerse largo.",
        en: "Task 2: you now know each account's tier; Support now needs how many hours to answer its cases in, and there one if after another starts getting long.",
      },
    ],
  },
};
