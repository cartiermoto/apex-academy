import type { Lesson } from "@/lib/types";

export const l07Operadores: Lesson = {
  id: "m01-l07",
  slug: "operadores",
  n: 7,
  kind: "lesson",
  minutes: 24,
  warmup: {
    title: { es: "¿Te acuerdas? · Repaso de la lección 6", en: "Remember? · Review of lesson 6" },
    prompt: { es: "Region__c viene vacío. ¿Qué pasa con incompleteLead.Region__c.toUpperCase()?", en: "Region__c is empty. What happens with incompleteLead.Region__c.toUpperCase()?" },
    options: [
      { es: "Lanza NullPointerException", en: "It throws NullPointerException" },
      { es: "Devuelve null", en: "It returns null" },
      { es: "Devuelve un texto vacío", en: "It returns an empty string" },
    ],
    answer: 0,
    explain: { es: "Con el punto normal revienta y para la transacción. Con ?. en lugar del punto, devolvería null y el código seguiría.", en: "With the plain dot it blows up and stops the transaction. With ?. instead of the dot, it would return null and the code would carry on." },
  },
  title: { es: "Operadores", en: "Operators" },
  summary: {
    es: "Los símbolos que hacen cuentas, comparan y deciden. Incluido el que te deja poner un valor por defecto sin escribir un solo if.",
    en: "The symbols that calculate, compare and decide. Including the one that lets you set a default without writing a single if.",
  },
  analogy: {
    es: "Una regla de validación: AND(), OR(), NOT() e IF()",
    en: "A validation rule: AND(), OR(), NOT() and IF()",
  },
  objectives: [
    {
      es: "No volver a confundir = con ==.",
      en: "Never again confuse = with ==.",
    },
    {
      es: "Combinar condiciones con && y || y aprovechar que se evalúan en corto.",
      en: "Combine conditions with && and || and take advantage of short-circuiting.",
    },
    {
      es: "Sustituir un valor ausente por uno por defecto con el operador condicional.",
      en: "Replace a missing value with a default using the conditional operator.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Una regla de validación es una expresión con operadores: AND(ISBLANK(Region__c), NOT(ISPICKVAL(Status, 'Closed'))). Ya sabes razonar así. Apex usa los mismos conceptos con símbolos más cortos, y añade uno que en fórmulas conocías como IF().",
        en: "A validation rule is an expression made of operators: AND(ISBLANK(Region__c), NOT(ISPICKVAL(Status, 'Closed'))). You already reason this way. Apex uses the same concepts with shorter symbols, and adds one you knew in formulas as IF().",
      },
    },
    {
      type: "diagram",
      id: "m01-operators",
      caption: {
        es: "Un carácter de diferencia entre guardar un valor y preguntar por él.",
        en: "One character between storing a value and asking about it.",
      },
    },
    {
      type: "h",
      text: { es: "Aritméticos", en: "Arithmetic" },
    },
    {
      type: "p",
      text: {
        es: "Suma, resta, multiplicación y división. Y una ausencia que sorprende a quien viene de otros lenguajes: Apex no tiene operador de módulo. Para el resto de una división se usa el método Math.mod().",
        en: "Add, subtract, multiply and divide. Plus one absence that surprises anyone arriving from another language: Apex has no modulo operator. For the remainder of a division you use the Math.mod() method.",
      },
    },
    {
      type: "code",
      code: {
        es: `Decimal amount = 1000;
Decimal withTax = amount * 1.21;
Decimal perQuarter = amount / 4;
Integer remainder = Math.mod(17, 5);   // 2 — no existe el operador %`,
        en: `Decimal amount = 1000;
Decimal withTax = amount * 1.21;
Decimal perQuarter = amount / 4;
Integer remainder = Math.mod(17, 5);   // 2 — there is no % operator`,
      },
    },
    {
      type: "p",
      text: {
        es: "También existen las formas abreviadas: amount += 100 significa exactamente amount = amount + 100. Funcionan con +=, -=, *= y /=, y se leen mejor cuando la variable es larga.",
        en: "There are compound forms too: amount += 100 means exactly amount = amount + 100. They work with +=, -=, *= and /=, and they read better when the variable name is long.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El orden es el de matemáticas", en: "The order is the maths one" },
      text: {
        es: "La multiplicación y la división van antes que la suma y la resta. base + base * taxRate no es lo mismo que (base + base) * taxRate. Cuando la expresión tenga más de dos operadores, pon paréntesis aunque no hagan falta: el compilador no los necesita, quien lea el código sí.",
        en: "Multiplication and division come before addition and subtraction. base + base * taxRate is not the same as (base + base) * taxRate. When an expression has more than two operators, add brackets even if they are unnecessary: the compiler does not need them, the next reader does.",
      },
    },
    {
      type: "h",
      text: { es: "Comparación: uno o dos iguales", en: "Comparison: one equals or two" },
    },
    {
      type: "p",
      text: {
        es: "Un solo igual asigna: pone un valor dentro de una variable. Dos iguales comparan: preguntan si dos cosas valen lo mismo y devuelven un Boolean. Es el error de tecleo más caro del lenguaje, porque a veces compila igualmente.",
        en: "A single equals assigns: it puts a value into a variable. Two equals compare: they ask whether two things are the same and return a Boolean. It is the language's most expensive typo, because sometimes it still compiles.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Operador", en: "Operator" },
        { es: "Pregunta", en: "Question" },
        { es: "Devuelve", en: "Returns" },
      ],
      rows: [
        [
          { es: "==   !=", en: "==   !=" },
          { es: "¿Son iguales? ¿Son distintos?", en: "Are they equal? Are they different?" },
          { es: "Boolean", en: "Boolean" },
        ],
        [
          { es: "<   >   <=   >=", en: "<   >   <=   >=" },
          { es: "¿Es menor, mayor…?", en: "Is it smaller, larger…?" },
          { es: "Boolean", en: "Boolean" },
        ],
        [
          { es: "&&", en: "&&" },
          { es: "¿Se cumplen las dos?", en: "Do both hold?" },
          { es: "Boolean", en: "Boolean" },
        ],
        [
          { es: "||", en: "||" },
          { es: "¿Se cumple al menos una?", en: "Does at least one hold?" },
          { es: "Boolean", en: "Boolean" },
        ],
        [
          { es: "!", en: "!" },
          { es: "Lo contrario de…", en: "The opposite of…" },
          { es: "Boolean", en: "Boolean" },
        ],
      ],
    },
    {
      type: "code",
      code: {
        es: `Decimal amount = 25000;
String stage = 'Closed Won';

Boolean isBigDeal = amount >= 20000;
Boolean isWon = stage == 'Closed Won';
Boolean celebrate = isBigDeal && isWon;
Boolean pending = !isWon;`,
        en: `Decimal amount = 25000;
String stage = 'Closed Won';

Boolean isBigDeal = amount >= 20000;
Boolean isWon = stage == 'Closed Won';
Boolean celebrate = isBigDeal && isWon;
Boolean pending = !isWon;`,
      },
      caption: {
        es: "Guardar cada condición en un Boolean con buen nombre convierte una expresión ilegible en una frase.",
        en: "Storing each condition in a well-named Boolean turns an unreadable expression into a sentence.",
      },
    },
    {
      type: "h",
      text: { es: "Evaluación en corto: tu red de seguridad", en: "Short-circuiting: your safety net" },
    },
    {
      type: "p",
      text: {
        es: "Apex evalúa && de izquierda a derecha y para en cuanto sabe la respuesta. Si la primera condición es falsa, la segunda ni se mira. Eso convierte al && en la forma idiomática de protegerse de un null: primero compruebas que existe, después lo usas.",
        en: "Apex evaluates && left to right and stops as soon as it knows the answer. If the first condition is false, the second is never looked at. That makes && the idiomatic way to guard against a null: first check it exists, then use it.",
      },
    },
    {
      type: "code",
      code: {
        es: `String region = null;

// Seguro: si el primero es false, el segundo no llega a ejecutarse
Boolean isEmea = region != null && region.toUpperCase() == 'EMEA';

// Peligroso: el orden invertido explota
Boolean broken = region.toUpperCase() == 'EMEA' && region != null;`,
        en: `String region = null;

// Safe: if the first is false, the second is never reached
Boolean isEmea = region != null && region.toUpperCase() == 'EMEA';

// Dangerous: the reversed order explodes
Boolean broken = region.toUpperCase() == 'EMEA' && region != null;`,
      },
      caption: {
        es: "El orden de las condiciones no es estético: es lo que separa un código que aguanta de uno que cae.",
        en: "The order of the conditions is not cosmetic: it is what separates code that holds from code that falls over.",
      },
    },
    {
      type: "diagram",
      id: "m01-short-circuit",
      caption: {
        es: "Reprodúcelo con los tres escenarios. Fíjate en cuándo la parte derecha ni siquiera llega a ejecutarse.",
        en: "Play it through all three scenarios. Watch when the right side never even runs.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Como las condiciones de entrada de un Flow", en: "Like a Flow's entry conditions" },
      text: {
        es: "Cuando yo hacía Flows desencadenados por registro, las condiciones de entrada decidían si el Flow ni siquiera arrancaba: si el registro no las cumplía, ningún elemento de dentro llegaba a ejecutarse. region != null && … funciona igual: la primera condición es la condición de entrada, y lo que va detrás del && solo corre si la supera. (Simplificación: en un Flow no tienes que preocuparte del orden de las condiciones; en Apex es justo lo que te protege).",
        en: "When I built record-triggered Flows, the entry conditions decided whether the Flow even started: if the record did not meet them, no element inside ever ran. region != null && … works the same way: the first condition is the entry condition, and whatever comes after the && only runs if it passes. (Simplification: in a Flow you do not have to worry about the order of the conditions; in Apex it is exactly what protects you).",
      },
      voice: "otter",
    },
    {
      type: "h",
      text: { es: "El operador condicional: IF() en una línea", en: "The conditional operator: IF() on one line" },
    },
    {
      type: "p",
      text: {
        es: "Se escribe condición ? valorSiVerdadero : valorSiFalso, y es una expresión: produce un valor que puedes guardar directamente en una variable. Es el equivalente exacto de IF() en una fórmula, y resuelve el problema que dejó abierto la sub-lección anterior: qué poner cuando falta el dato.",
        en: "You write condition ? valueIfTrue : valueIfFalse, and it is an expression: it produces a value you can store straight into a variable. It is the exact equivalent of IF() in a formula, and it solves the problem the previous sub-lesson left open: what to put when the value is missing.",
      },
    },
    {
      type: "code",
      code: {
        es: `String region = incompleteLead.Region__c;

// En fórmulas: BLANKVALUE(Region__c, 'Sin región')
String displayRegion = String.isBlank(region) ? 'Sin región' : region;

Decimal amount = opp.Amount;
Decimal safeAmount = amount == null ? 0 : amount;`,
        en: `String region = incompleteLead.Region__c;

// In formulas: BLANKVALUE(Region__c, 'No region')
String displayRegion = String.isBlank(region) ? 'No region' : region;

Decimal amount = opp.Amount;
Decimal safeAmount = amount == null ? 0 : amount;`,
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Lo mismo que hacías en el campo fórmula", en: "The same thing you did in the formula field" },
      text: {
        es: "IF(ISBLANK(Region__c), 'Sin región', Region__c) lo escribí mil veces en campos fórmula, y String.isBlank(region) ? 'Sin región' : region es la misma decisión escrita de otra forma. La diferencia es que en Apex el resultado se guarda en una variable que puedes reutilizar diez líneas más abajo.",
        en: "I wrote IF(ISBLANK(Region__c), 'No region', Region__c) a thousand times in formula fields, and String.isBlank(region) ? 'No region' : region is the same decision written another way. The difference is that in Apex the result is stored in a variable you can reuse ten lines further down.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Uno, y solo uno", en: "One, and only one" },
      text: {
        es: "El operador condicional brilla cuando la decisión es pequeña y cabe en una línea. Encadenar tres o cuatro produce código que nadie quiere mantener; para eso está el if/else, que es el primer tema del Módulo 2.",
        en: "The conditional operator shines when the decision is small and fits on one line. Chaining three or four produces code nobody wants to maintain; that is what if/else is for, and it opens Module 2.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: ¿por qué region != null && region.length() > 2 es seguro y el orden contrario no? ¿Y qué devuelve un operador de comparación?",
        en: "Without looking up: why is region != null && region.length() > 2 safe while the reverse order is not? And what does a comparison operator return?",
      },
    },
  ],

  quiz: [
    {
      id: "m01-l07-q1",
      kind: "single",
      prompt: { es: "¿Qué imprime este código?", en: "What does this code print?" },
      code: {
        es: `Integer base = 100;
Decimal rate = 0.1;
System.debug(base + base * rate);`,
        en: `Integer base = 100;
Decimal rate = 0.1;
System.debug(base + base * rate);`,
      },
      options: [
        { es: "110", en: "110" },
        { es: "20", en: "20" },
        { es: "100.1", en: "100.1" },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "La multiplicación va primero: 100 * 0.1 = 10, y luego 100 + 10 = 110. Si querías (100 + 100) * 0.1, los paréntesis eran obligatorios.",
        en: "Multiplication goes first: 100 * 0.1 = 10, then 100 + 10 = 110. If you wanted (100 + 100) * 0.1, the brackets were mandatory.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m01-l07-q2",
      kind: "single",
      prompt: {
        es: "¿Cuál de estas dos líneas es segura cuando region vale null?",
        en: "Which of these two lines is safe when region is null?",
      },
      options: [
        {
          es: "region != null && region.length() > 2",
          en: "region != null && region.length() > 2",
        },
        {
          es: "region.length() > 2 && region != null",
          en: "region.length() > 2 && region != null",
        },
        { es: "Las dos son seguras.", en: "Both are safe." },
        { es: "Ninguna es segura.", en: "Neither is safe." },
      ],
      answer: 0,
      explain: {
        es: "&& para en cuanto la primera condición es falsa, así que length() nunca se llega a ejecutar. En la segunda, length() es lo primero que se evalúa y explota antes de llegar a la comprobación.",
        en: "&& stops as soon as the first condition is false, so length() is never reached. In the second, length() is evaluated first and explodes before the check ever happens.",
      },
      tags: ["interleaving", "find-error"],
    },
    {
      id: "m01-l07-q3",
      kind: "single",
      prompt: { es: "¿Cuál es el valor de label?", en: "What is the value of label?" },
      code: {
        es: `String region = '   ';
String label = String.isBlank(region) ? 'Sin región' : region;`,
        en: `String region = '   ';
String label = String.isBlank(region) ? 'No region' : region;`,
      },
      options: [
        { es: "'Sin región'", en: "'No region'" },
        { es: "'   '", en: "'   '" },
        { es: "null", en: "null" },
        { es: "''", en: "''" },
      ],
      answer: 0,
      explain: {
        es: "isBlank() considera en blanco una cadena de solo espacios, así que la condición es verdadera y se toma la rama de la izquierda.",
        en: "isBlank() treats a whitespace-only string as blank, so the condition is true and the left-hand branch is taken.",
      },
      tags: ["predict-output", "interleaving"],
    },
    {
      id: "m01-l07-q4",
      kind: "single",
      prompt: {
        es: "¿Qué está mal aquí?",
        en: "What is wrong here?",
      },
      code: {
        es: `String stage = 'Prospecting';
Boolean isWon = stage = 'Closed Won';`,
        en: `String stage = 'Prospecting';
Boolean isWon = stage = 'Closed Won';`,
      },
      options: [
        {
          es: "Usa un solo igual: está asignando en vez de comparar.",
          en: "It uses a single equals: it assigns instead of comparing.",
        },
        {
          es: "Las comillas deberían ser dobles.",
          en: "The quotes should be double.",
        },
        {
          es: "Falta convertir stage a Boolean.",
          en: "stage needs converting to a Boolean.",
        },
        { es: "Nada, es correcto.", en: "Nothing, it is correct." },
      ],
      answer: 0,
      explain: {
        es: "Con un solo igual estás metiendo 'Closed Won' dentro de stage, no preguntando si son iguales. Para comparar hacen falta dos.",
        en: "With a single equals you are putting 'Closed Won' into stage, not asking whether they match. Comparing needs two.",
      },
      tags: ["find-error"],
    },
    {
      id: "m01-l07-q5",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estas expresiones devuelven un Boolean?",
        en: "Which of these expressions return a Boolean?",
      },
      options: [
        { es: "amount >= 20000", en: "amount >= 20000" },
        { es: "String.isBlank(region)", en: "String.isBlank(region)" },
        { es: "amount * 1.21", en: "amount * 1.21" },
        { es: "name.contains('Corp')", en: "name.contains('Corp')" },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "Comparar, preguntar si está vacío y preguntar si contiene son preguntas de sí o no. Multiplicar devuelve un número.",
        en: "Comparing, asking whether it is blank, and asking whether it contains are all yes/no questions. Multiplying returns a number.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m01-l07-q6",
      kind: "single",
      prompt: {
        es: "Repaso: ¿qué pasa al ejecutar esto si Region__c nunca se asignó?",
        en: "Review: what happens running this if Region__c was never assigned?",
      },
      code: {
        es: `String upper = webLead.Region__c.toUpperCase();`,
        en: `String upper = webLead.Region__c.toUpperCase();`,
      },
      options: [
        {
          es: "Lanza NullPointerException.",
          en: "It throws a NullPointerException.",
        },
        { es: "upper vale null.", en: "upper is null." },
        { es: "upper vale ''.", en: "upper is ''." },
        { es: "No compila.", en: "It does not compile." },
      ],
      answer: 0,
      explain: {
        es: "Llamar a un método sobre null revienta. Con ?. habría devuelto null, y con el operador condicional podrías haber puesto un valor por defecto.",
        en: "Calling a method on null blows up. With ?. it would have returned null, and with the conditional operator you could have supplied a default.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 7 DE 10 · Ayer diagnosticaste el Lead incompleto; hoy hay que resolverlo. Ventas fue clara: «si no sabemos la región, que ponga algo». Así que el panel necesita valores que se puedan mostrar siempre, más un indicador de si el Lead está listo para asignarse. Decide tú qué poner cuando falta el dato.",
      en: "TASK 7 OF 10 · Yesterday you diagnosed the incomplete Lead; today you have to resolve it. Sales was clear: “if we do not know the region, put something”. So the dashboard needs values that can always be displayed, plus a flag for whether the Lead is ready to be assigned. You decide what goes in when a value is missing.",
    },
    brief: [
      {
        es: "displayRegion: la región del Lead, o el texto 'Sin región' si está ausente, vacía o en blanco. Usa el operador condicional.",
        en: "displayRegion: the Lead's region, or the text 'No region' when it is absent, empty or blank. Use the conditional operator.",
      },
      {
        es: "safeEmployees: el número de empleados, o 0 si no tiene valor.",
        en: "safeEmployees: the employee count, or 0 when it has no value.",
      },
      {
        es: "isLargeAccount: verdadero si safeEmployees es 100 o más.",
        en: "isLargeAccount: true when safeEmployees is 100 or more.",
      },
      {
        es: "isAssignable: verdadero solo si la empresa se puede usar Y además tiene región. Combina dos condiciones.",
        en: "isAssignable: true only when the company is usable AND there is a region. Combine two conditions.",
      },
      {
        es: "Ninguna línea puede lanzar NullPointerException con este Lead.",
        en: "No line may throw a NullPointerException with this Lead.",
      },
    ],
    starter: {
      es: `// CASO: campaña de renovaciones · cliente Northwind Trading
// Tarea 7 de 10: el mismo Lead incompleto de ayer, ahora hay que resolverlo.
Lead incompleteLead = new Lead(LastName = 'Ruiz');
incompleteLead.Company = 'Northwind Trading';
// Region__c y NumberOfEmployees se quedan sin asignar: vienen vacíos del formulario.

// Prepara los valores del panel. Que siempre haya algo que mostrar.

`,
      en: `// CASE: renewals campaign · customer Northwind Trading
// Task 7 of 10: yesterday's incomplete Lead, now it has to be resolved.
Lead incompleteLead = new Lead(LastName = 'Ruiz');
incompleteLead.Company = 'Northwind Trading';
// Region__c and NumberOfEmployees are left unassigned: the form sent them empty.

// Prepare the dashboard values. There must always be something to show.

`,
    },
    hints: [
      {
        es: "Yo repasaría el orden dentro de tus condiciones combinadas, como el de las condiciones de entrada de un Flow: ¿alguna usa un dato antes de comprobar que existe?",
        en: "I would go over the order inside your combined conditions, like the entry conditions of a Flow: does any of them use a value before checking it exists?",
      },
      {
        es: "Lo que me ayudó: el operador condicional se escribe condición ? valorSiVerdadero : valorSiFalso; es tu IF() de fórmulas y produce un valor, así que se asigna directamente. Y && evalúa en corto: la condición protectora va siempre primero.",
        en: "What helped me: the conditional operator is written condition ? valueIfTrue : valueIfFalse; it is your formula IF() and produces a value, so you assign it directly. And && short-circuits: the protecting condition always goes first.",
      },
      {
        es: "Te dejo el molde: String displayRegion = String.isBlank(x) ? 'Sin región' : x; e Integer safeEmployees = y == null ? 0 : y;",
        en: "Here is the template: String displayRegion = String.isBlank(x) ? 'No region' : x; and Integer safeEmployees = y == null ? 0 : y;",
      },
    ],
    solution: {
      es: `String displayRegion = String.isBlank(incompleteLead.Region__c)
    ? 'Sin región'
    : incompleteLead.Region__c;

Integer safeEmployees = incompleteLead.NumberOfEmployees == null
    ? 0
    : incompleteLead.NumberOfEmployees;

Boolean isLargeAccount = safeEmployees >= 100;

Boolean isAssignable = String.isNotBlank(incompleteLead.Company)
    && String.isNotBlank(incompleteLead.Region__c);`,
      en: `String displayRegion = String.isBlank(incompleteLead.Region__c)
    ? 'No region'
    : incompleteLead.Region__c;

Integer safeEmployees = incompleteLead.NumberOfEmployees == null
    ? 0
    : incompleteLead.NumberOfEmployees;

Boolean isLargeAccount = safeEmployees >= 100;

Boolean isAssignable = String.isNotBlank(incompleteLead.Company)
    && String.isNotBlank(incompleteLead.Region__c);`,
    },
    checks: [
      {
        id: "l07-c1",
        label: {
          es: "displayRegion usa el operador condicional con un valor por defecto",
          en: "displayRegion uses the conditional operator with a default",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "String\\s+displayRegion\\s*=" },
            { op: "match", pattern: "isBlank\\s*\\(\\s*incompleteLead\\s*\\.\\s*Region__c\\s*\\)" },
            { op: "match", pattern: "\\?[\\s\\S]{0,80}:" },
          ],
        },
        onFail: {
          es: "Necesitas decidir en una expresión: String.isBlank(campo) ? 'Sin región' : campo. Es el IF() de las fórmulas, con otra puntuación.",
          en: "You need to decide inside one expression: String.isBlank(field) ? 'No region' : field. It is the formula IF() with different punctuation.",
        },
        otter: {
          es: "displayRegion es tu IF(ISBLANK(Region__c), 'Sin región', Region__c) de fórmulas, con otra puntuación: String.isBlank(campo) ? 'Sin región' : campo.",
          en: "displayRegion is your formula IF(ISBLANK(Region__c), 'No region', Region__c), with different punctuation: String.isBlank(field) ? 'No region' : field.",
        },
      },
      {
        id: "l07-c2",
        label: {
          es: "safeEmployees sustituye el null por 0",
          en: "safeEmployees replaces the null with 0",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Integer\\s+safeEmployees\\s*=" },
            { op: "match", pattern: "NumberOfEmployees\\s*==\\s*null" },
            { op: "match", pattern: "\\?[\\s\\S]{0,80}:" },
          ],
        },
        onFail: {
          es: "Para un número la comprobación es == null, no isBlank(). Y el valor por defecto tiene que ser 0, no dejar el null: lo siguiente que hagas con él sería una suma.",
          en: "For a number the check is == null, not isBlank(). And the default has to be 0, not the null left in place: the next thing you do with it would be arithmetic.",
        },
        otter: {
          es: "safeEmployees es como BLANKVALUE(NumberOfEmployees, 0): si falta, 0. En Apex, para un número se compara con == null, no con isBlank(). Y el 0 importa: lo siguiente que hagas con él es comparar o sumar.",
          en: "safeEmployees is like BLANKVALUE(NumberOfEmployees, 0): if it is missing, 0. In Apex, for a number you compare with == null, not isBlank(). And the 0 matters: the next thing you do with it is compare or add.",
        },
        onPass: {
          es: "Sustituir el null por 0 antes de operar es lo que evita el NullPointerException tres líneas más abajo.",
          en: "Replacing the null with 0 before any arithmetic is what prevents the NullPointerException three lines later.",
        },
      },
      {
        id: "l07-c3",
        label: {
          es: "isLargeAccount compara con >= 100",
          en: "isLargeAccount compares with >= 100",
        },
        rule: {
          op: "match",
          pattern: "Boolean\\s+isLargeAccount\\s*=\\s*safeEmployees\\s*>=\\s*100",
        },
        onFail: {
          es: "«100 o más» es >=, no >. Y tiene que comparar safeEmployees, no el campo original: ese puede ser null y la comparación fallaría.",
          en: "“100 or more” is >=, not >. And it must compare safeEmployees, not the original field: that one can be null and the comparison would fail.",
        },
        otter: {
          es: "isLargeAccount: «100 o más» es >=, como el operador «mayor o igual que» de un filtro de informe. Y compara safeEmployees, no el campo original, que puede ser null.",
          en: "isLargeAccount: «100 or more» is >=, like the «greater or equal» operator in a report filter. And it compares safeEmployees, not the original field, which can be null.",
        },
      },
      {
        id: "l07-c4",
        label: {
          es: "isAssignable combina las dos condiciones con &&",
          en: "isAssignable combines both conditions with &&",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Boolean\\s+isAssignable\\s*=" },
            { op: "match", pattern: "&&" },
            { op: "count", pattern: "isNotBlank\\s*\\(", min: 2 },
          ],
        },
        onFail: {
          es: "«Y además» es &&, y las dos condiciones tienen que comprobar que el texto sirve de verdad —isNotBlank—, no solo que no sea null.",
          en: "“And also” is &&, and both conditions must check the text is genuinely usable — isNotBlank — not merely non-null.",
        },
        otter: {
          es: "isAssignable es como una vista de lista con dos filtros que tienen que cumplirse a la vez: eso es &&. Y cada condición tiene que comprobar que el texto sirve de verdad (isNotBlank), no solo que no sea null.",
          en: "isAssignable is like a list view with two filters that must both hold: that is &&. And each condition has to check the text is really usable (isNotBlank), not just that it is not null.",
        },
      },
      {
        id: "l07-c5",
        label: {
          es: "Ninguna llamada directa sobre un campo que puede faltar",
          en: "No direct call on a field that may be missing",
        },
        rule: {
          op: "absent",
          pattern:
            "incompleteLead\\s*\\.\\s*Region__c\\s*\\.\\s*(toUpperCase|toLowerCase|trim|length|substring)\\s*\\(",
        },
        onFail: {
          es: "Sigue habiendo un método llamado directamente sobre Region__c, que en este Lead es null. Protégelo con la comprobación o con ?.",
          en: "There is still a method called straight on Region__c, which is null for this Lead. Guard it with the check or with ?.",
        },
        otter: {
          es: "Sigue habiendo un método llamado directamente sobre Region__c, que en este Lead viene vacío: es el error rojo al guardar esperando su momento. Protégelo con la comprobación o con ?.",
          en: "There is still a method called straight on Region__c, which is empty in this Lead: it is the red save error waiting for its moment. Protect it with the check or with ?.",
        },
      },
    ],
    rubric: [
      {
        es: "¿Qué pasaría si mañana hubiera que elegir entre cinco regiones por defecto según el país? El operador condicional deja de ser legible ahí: ese es el trabajo del if/else.",
        en: "What if tomorrow you had to pick between five default regions depending on the country? The conditional operator stops being readable there: that is if/else's job.",
      },
    ],
    outro: {
      es: "Ya decides valores en una línea con el operador condicional y proteges tus condiciones con &&. En la tarea 8 la ficha deja de ser de una sola oportunidad: llegan varias, y con ellas las colecciones.",
      en: "You can now decide values in one line with the conditional operator and protect your conditions with &&. In task 8 the sheet stops being about a single opportunity: several arrive, and collections with them.",
    },
    voice: "otter",
  },
};
