import type { Lesson } from "@/lib/types";

export const l05Agregados: Lesson = {
  id: "m03-l05",
  slug: "funciones-de-agregacion",
  n: 5,
  kind: "lesson",
  minutes: 25,
  title: {
    es: "Funciones de agregación",
    en: "Aggregate functions",
  },
  summary: {
    es: "Contar, sumar, promediar y agrupar dentro de la base de datos: te llega el total, no las diez mil filas que lo forman.",
    en: "Count, sum, average and group inside the database: you get the total, not the ten thousand rows behind it.",
  },
  analogy: {
    es: "Un informe de resumen agrupado por etapa, o un campo roll-up",
    en: "A summary report grouped by stage, or a roll-up summary field",
  },
  objectives: [
    {
      es: "Contar registros con COUNT() sin traerlos.",
      en: "Count records with COUNT() without bringing them back.",
    },
    {
      es: "Agrupar con GROUP BY y leer SUM, AVG, MIN y MAX desde AggregateResult.",
      en: "Group with GROUP BY and read SUM, AVG, MIN and MAX from AggregateResult.",
    },
    {
      es: "Distinguir WHERE (filtra filas antes de agrupar) de HAVING (filtra grupos después).",
      en: "Tell WHERE (filters rows before grouping) apart from HAVING (filters groups afterwards).",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Muchas preguntas de negocio no piden registros sino números: cuántos casos abiertos hay, cuánto pipeline tiene cada etapa, cuál es el ticket medio. Podrías traer todas las oportunidades y sumarlas en un bucle, pero sería como exportar el informe a Excel para sumar una columna que el propio informe ya sabía sumar.",
        en: "Many business questions do not ask for records but for numbers: how many open cases there are, how much pipeline each stage holds, what the average deal size is. You could bring back every opportunity and add them up in a loop, but it would be like exporting the report to Excel to sum a column the report already knew how to sum.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "Un informe de resumen agrupa filas (Agrupar por: Etapa) y muestra totales por grupo (Suma de Importe, Recuento de registros). Un campo roll-up hace lo mismo en el registro padre: COUNT, SUM, MIN o MAX de sus hijos. SOQL tiene exactamente esas funciones, más AVG, y GROUP BY es tu «Agrupar filas por».",
        en: "A summary report groups rows (Group by: Stage) and shows totals per group (Sum of Amount, Record Count). A roll-up summary field does the same on the parent record: COUNT, SUM, MIN or MAX of its children. SOQL has exactly those functions, plus AVG, and GROUP BY is your “Group rows by”.",
      },
    },
    {
      type: "h",
      text: { es: "Contar: COUNT()", en: "Counting: COUNT()" },
    },
    {
      type: "code",
      code: {
        es: `Integer openCases = [SELECT COUNT() FROM Case WHERE IsClosed = false];
System.debug('Casos abiertos: ' + openCases);`,
        en: `Integer openCases = [SELECT COUNT() FROM Case WHERE IsClosed = false];
System.debug('Open cases: ' + openCases);`,
      },
      caption: {
        es: "COUNT() sin nada dentro es especial: la consulta devuelve directamente un Integer. Es el «Recuento de registros» del informe.",
        en: "COUNT() with nothing inside is special: the query returns an Integer directly. It is the report's “Record Count”.",
      },
    },
    {
      type: "h",
      text: { es: "Agrupar: GROUP BY y AggregateResult", en: "Grouping: GROUP BY and AggregateResult" },
    },
    {
      type: "code",
      code: {
        es: `List<AggregateResult> byStage = [
    SELECT StageName, COUNT(Id) deals, SUM(Amount) total, AVG(Amount) average
    FROM Opportunity
    WHERE IsClosed = false
    GROUP BY StageName
];

for (AggregateResult ar : byStage) {
    String  stage = (String)  ar.get('StageName');
    Integer deals = (Integer) ar.get('deals');
    Decimal total = (Decimal) ar.get('total');
    System.debug(stage + ': ' + deals + ' oportunidades, ' + total);
}`,
        en: `List<AggregateResult> byStage = [
    SELECT StageName, COUNT(Id) deals, SUM(Amount) total, AVG(Amount) average
    FROM Opportunity
    WHERE IsClosed = false
    GROUP BY StageName
];

for (AggregateResult ar : byStage) {
    String  stage = (String)  ar.get('StageName');
    Integer deals = (Integer) ar.get('deals');
    Decimal total = (Decimal) ar.get('total');
    System.debug(stage + ': ' + deals + ' opportunities, ' + total);
}`,
      },
    },
    {
      type: "diagram",
      id: "m03-aggregate",
      caption: {
        es: "Las filas entran en la base de datos; a tu código solo sale una fila por grupo.",
        en: "Rows go into the database; only one row per group comes out to your code.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "Con GROUP BY ya no recibes Opportunity, sino AggregateResult: una fila por grupo, no por registro.",
          en: "With GROUP BY you no longer get Opportunity but AggregateResult: one row per group, not per record.",
        },
        {
          es: "Cada total lleva un alias (deals, total, average) escrito justo detrás de la función. Con ese alias lo lees: ar.get('total'). Sin alias, Salesforce los llama expr0, expr1… y tu código se vuelve ilegible.",
          en: "Each total carries an alias (deals, total, average) written right after the function. You read it with that alias: ar.get('total'). Without an alias, Salesforce calls them expr0, expr1… and your code becomes unreadable.",
        },
        {
          es: "get() devuelve Object, el tipo comodín. Para usarlo como número haces el casting del Módulo 1: (Decimal) ar.get('total').",
          en: "get() returns Object, the catch-all type. To use it as a number you do Module 1's casting: (Decimal) ar.get('total').",
        },
        {
          es: "Todo campo del SELECT tiene que estar agrupado o dentro de una función. Pedir Name aquí no compila: ¿el nombre de cuál de las cuarenta oportunidades del grupo?",
          en: "Every field in the SELECT must be grouped or inside a function. Asking for Name here does not compile: the name of which of the group's forty opportunities?",
        },
      ],
    },
    {
      type: "h",
      text: { es: "WHERE antes, HAVING después", en: "WHERE before, HAVING after" },
    },
    {
      type: "p",
      text: {
        es: "WHERE decide qué filas entran en los grupos. HAVING decide qué grupos salen, mirando sus totales. En un informe de resumen no hay forma sencilla de decir «enséñame solo las etapas con más de 100.000»: lo miras a ojo. HAVING lo hace por ti.",
        en: "WHERE decides which rows go into the groups. HAVING decides which groups come out, looking at their totals. In a summary report there is no simple way to say “show me only stages with more than 100,000”: you eyeball it. HAVING does it for you.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Cuentas con más de 5 casos abiertos: candidatas a revisión de servicio
List<AggregateResult> busy = [
    SELECT AccountId, COUNT(Id) openCases
    FROM Case
    WHERE IsClosed = false            // filas: solo casos abiertos
    GROUP BY AccountId
    HAVING COUNT(Id) > 5              // grupos: solo cuentas con más de 5
    ORDER BY COUNT(Id) DESC
];`,
        en: `// Accounts with more than 5 open cases: service review candidates
List<AggregateResult> busy = [
    SELECT AccountId, COUNT(Id) openCases
    FROM Case
    WHERE IsClosed = false            // rows: only open cases
    GROUP BY AccountId
    HAVING COUNT(Id) > 5              // groups: only accounts with more than 5
    ORDER BY COUNT(Id) DESC
];`,
      },
      caption: {
        es: "En HAVING y ORDER BY repites la función (COUNT(Id)), no el alias. El alias solo sirve para leer el resultado.",
        en: "In HAVING and ORDER BY you repeat the function (COUNT(Id)), not the alias. The alias is only for reading the result.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Función", en: "Function" },
        { es: "Qué calcula", en: "What it calculates" },
        { es: "En el informe o roll-up", en: "In the report or roll-up" },
      ],
      rows: [
        [{ es: "COUNT() / COUNT(Id)", en: "COUNT() / COUNT(Id)" }, { es: "Cuántos registros", en: "How many records" }, { es: "Recuento de registros · roll-up COUNT", en: "Record Count · COUNT roll-up" }],
        [{ es: "COUNT_DISTINCT(campo)", en: "COUNT_DISTINCT(field)" }, { es: "Cuántos valores distintos", en: "How many distinct values" }, { es: "Recuento único", en: "Unique count" }],
        [{ es: "SUM(campo)", en: "SUM(field)" }, { es: "La suma", en: "The sum" }, { es: "Suma · roll-up SUM", en: "Sum · SUM roll-up" }],
        [{ es: "AVG(campo)", en: "AVG(field)" }, { es: "La media", en: "The average" }, { es: "Promedio", en: "Average" }],
        [{ es: "MIN / MAX(campo)", en: "MIN / MAX(field)" }, { es: "El menor / el mayor", en: "The smallest / largest" }, { es: "Mín / Máx · roll-up MIN / MAX", en: "Min / Max · MIN / MAX roll-up" }],
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "En el capítulo de arrays, el libro calcula el mayor, el menor, la suma y el promedio de cinco números con un for que compara y acumula. Es un buen ejercicio para entender los bucles, y en Apex lo harás igual con los datos que ya tienes en memoria. Pero si los números viven en la base de datos, no los traigas para sumarlos: [SELECT MAX(Amount), MIN(Amount), SUM(Amount), AVG(Amount) FROM Opportunity] te devuelve los cuatro de una vez, aunque haya un millón de filas detrás.",
        en: "In the arrays chapter, the book computes the largest, smallest, sum and average of five numbers with a for that compares and accumulates. It is a good exercise for understanding loops, and in Apex you will do the same with data you already have in memory. But if the numbers live in the database, do not bring them back to add them up: [SELECT MAX(Amount), MIN(Amount), SUM(Amount), AVG(Amount) FROM Opportunity] returns all four at once, even with a million rows behind it.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: ¿qué tipo devuelve una consulta con GROUP BY? ¿Cómo lees un SUM con alias total como Decimal? ¿Qué filtra WHERE y qué filtra HAVING?",
        en: "Without looking: what type does a GROUP BY query return? How do you read a SUM aliased total as a Decimal? What does WHERE filter and what does HAVING filter?",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l05-q1",
      kind: "single",
      prompt: {
        es: "Necesitas saber cuántos leads se crearon este mes. ¿Cuál es la MEJOR opción?",
        en: "You need to know how many leads were created this month. Which is the BEST option?",
      },
      options: [
        {
          es: "Integer n = [SELECT COUNT() FROM Lead WHERE CreatedDate = THIS_MONTH];",
          en: "Integer n = [SELECT COUNT() FROM Lead WHERE CreatedDate = THIS_MONTH];",
        },
        {
          es: "Integer n = [SELECT Id FROM Lead WHERE CreatedDate = THIS_MONTH].size();",
          en: "Integer n = [SELECT Id FROM Lead WHERE CreatedDate = THIS_MONTH].size();",
        },
        {
          es: "Recorrer todos los leads y sumar 1 a un contador si son de este mes.",
          en: "Loop through every lead and add 1 to a counter if it is from this month.",
        },
      ],
      answer: 0,
      explain: {
        es: "COUNT() cuenta en la base de datos y te da el número. La segunda da el mismo resultado pero trae todas las filas a memoria; la tercera, además, trae leads de otros meses.",
        en: "COUNT() counts in the database and hands you the number. The second gives the same result but brings every row into memory; the third also brings leads from other months.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l05-q2",
      kind: "single",
      prompt: {
        es: "Esta consulta no compila. ¿Por qué?",
        en: "This query does not compile. Why?",
      },
      code: {
        es: `[SELECT StageName, Name, SUM(Amount) total
 FROM Opportunity
 GROUP BY StageName]`,
        en: `[SELECT StageName, Name, SUM(Amount) total
 FROM Opportunity
 GROUP BY StageName]`,
      },
      options: [
        {
          es: "Name no está agrupado ni dentro de una función.",
          en: "Name is neither grouped nor inside a function.",
        },
        { es: "SUM no admite alias.", en: "SUM does not accept an alias." },
        { es: "Falta un WHERE.", en: "A WHERE is missing." },
      ],
      answer: 0,
      explain: {
        es: "Cada grupo es una etapa con muchas oportunidades: no hay un único Name que mostrar. O lo agrupas, o lo quitas.",
        en: "Each group is a stage with many opportunities: there is no single Name to show. Either group by it, or remove it.",
      },
      tags: ["find-error"],
    },
    {
      id: "m03-l05-q3",
      kind: "single",
      prompt: {
        es: "¿Cómo lees el total como número?",
        en: "How do you read the total as a number?",
      },
      code: {
        es: `for (AggregateResult ar : [SELECT SUM(Amount) total FROM Opportunity]) {
    // ???
}`,
        en: `for (AggregateResult ar : [SELECT SUM(Amount) total FROM Opportunity]) {
    // ???
}`,
      },
      options: [
        { es: "Decimal t = (Decimal) ar.get('total');", en: "Decimal t = (Decimal) ar.get('total');" },
        { es: "Decimal t = ar.total;", en: "Decimal t = ar.total;" },
        { es: "Decimal t = ar.get('total');", en: "Decimal t = ar.get('total');" },
        { es: "Decimal t = ar.Amount;", en: "Decimal t = ar.Amount;" },
      ],
      answer: 0,
      explain: {
        es: "get() devuelve Object; para guardarlo en un Decimal lo conviertes explícitamente. Sin el casting, no compila: es lo que viste en el Módulo 1 con los tipos «hacia abajo».",
        en: "get() returns Object; to store it in a Decimal you convert it explicitly. Without the cast, it does not compile: it is what you saw in Module 1 with “downward” types.",
      },
      tags: ["spaced", "recall"],
      from: { es: "Repaso · M1 L9", en: "Review · M1 L9" },
    },
    {
      id: "m03-l05-q4",
      kind: "single",
      prompt: {
        es: "Quieres las cuentas con más de 10 oportunidades ganadas. ¿Dónde va cada condición?",
        en: "You want the accounts with more than 10 won opportunities. Where does each condition go?",
      },
      options: [
        {
          es: "IsWon = true en WHERE; COUNT(Id) > 10 en HAVING.",
          en: "IsWon = true in WHERE; COUNT(Id) > 10 in HAVING.",
        },
        {
          es: "Las dos en WHERE.",
          en: "Both in WHERE.",
        },
        {
          es: "Las dos en HAVING.",
          en: "Both in HAVING.",
        },
      ],
      answer: 0,
      explain: {
        es: "IsWon es una propiedad de cada fila: se filtra antes de agrupar. «Más de 10» es una propiedad del grupo: solo existe después de contar.",
        en: "IsWon is a property of each row: it is filtered before grouping. “More than 10” is a property of the group: it only exists after counting.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l05-q5",
      kind: "text",
      prompt: {
        es: "¿Qué función cuenta cuántos valores distintos de BillingCountry hay entre tus cuentas? (solo el nombre)",
        en: "Which function counts how many distinct BillingCountry values your accounts have? (just the name)",
      },
      accept: ["^\\s*COUNT_DISTINCT\\s*(\\(.*\\))?\\s*$"],
      placeholder: { es: "función", en: "function" },
      explain: {
        es: "COUNT_DISTINCT(BillingCountry): el «recuento único» de los informes.",
        en: "COUNT_DISTINCT(BillingCountry): the reports' “unique count”.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l05-q6",
      kind: "multi",
      prompt: {
        es: "¿Qué afirmaciones son ciertas sobre una consulta con GROUP BY?",
        en: "Which statements about a GROUP BY query are true?",
      },
      options: [
        { es: "Devuelve una fila por grupo.", en: "It returns one row per group." },
        { es: "Devuelve List<AggregateResult>.", en: "It returns List<AggregateResult>." },
        {
          es: "En HAVING puedes usar el alias en lugar de la función.",
          en: "In HAVING you can use the alias instead of the function.",
        },
        {
          es: "Sin alias, los totales se llaman expr0, expr1…",
          en: "Without an alias, the totals are called expr0, expr1…",
        },
      ],
      answers: [0, 1, 3],
      explain: {
        es: "El alias solo sirve para leer con get(). En HAVING y ORDER BY se repite la función.",
        en: "The alias is only for reading with get(). In HAVING and ORDER BY you repeat the function.",
      },
      tags: ["interleaving"],
    },
  ],

  exercise: {
    prompt: {
      es: "Operaciones de Ventas quiere, para el comité del viernes, el pipeline abierto por etapa: cuántas oportunidades y cuánto importe hay en cada una. Solo interesan las etapas que suman más de 100.000, de mayor a menor.",
      en: "Sales Operations wants, for Friday's committee, the open pipeline by stage: how many opportunities and how much amount each one holds. Only stages totalling over 100,000 matter, largest first.",
    },
    brief: [
      {
        es: "Una List<AggregateResult> llamada byStage, agrupada por StageName, solo con oportunidades abiertas.",
        en: "A List<AggregateResult> called byStage, grouped by StageName, open opportunities only.",
      },
      {
        es: "Con COUNT(Id) de alias deals y SUM(Amount) de alias total.",
        en: "With COUNT(Id) aliased deals and SUM(Amount) aliased total.",
      },
      {
        es: "Solo los grupos cuyo importe total supera 100.000, ordenados de mayor a menor total.",
        en: "Only the groups whose total amount exceeds 100,000, sorted from largest to smallest total.",
      },
      {
        es: "Recorre el resultado leyendo la etapa como String y el total como Decimal, y muéstralos.",
        en: "Loop the result reading the stage as a String and the total as a Decimal, and show them.",
      },
    ],
    starter: {
      es: `// Pipeline abierto por etapa (> 100.000)
List<Opportunity> opps = [SELECT StageName, Amount FROM Opportunity WHERE IsClosed = false];

Decimal total = 0;
for (Opportunity o : opps) {
    total += o.Amount;
}
`,
      en: `// Open pipeline by stage (> 100,000)
List<Opportunity> opps = [SELECT StageName, Amount FROM Opportunity WHERE IsClosed = false];

Decimal total = 0;
for (Opportunity o : opps) {
    total += o.Amount;
}
`,
    },
    hints: [
      {
        es: "El código de partida suma a mano en un bucle y ni siquiera separa por etapa. Tira de funciones de agregación: la base de datos agrupa y suma.",
        en: "The starter code sums by hand in a loop and does not even split by stage. Use aggregate functions: the database groups and sums.",
      },
      {
        es: "SELECT StageName, COUNT(Id) deals, SUM(Amount) total ... GROUP BY StageName. El filtro de «más de 100.000» es sobre el grupo: HAVING, repitiendo la función.",
        en: "SELECT StageName, COUNT(Id) deals, SUM(Amount) total ... GROUP BY StageName. The “over 100,000” filter is on the group: HAVING, repeating the function.",
      },
      {
        es: "Pseudocódigo: ... WHERE IsClosed = false GROUP BY StageName HAVING SUM(Amount) > 100000 ORDER BY SUM(Amount) DESC]; for (AggregateResult ar : byStage) { String stage = (String) ar.get('StageName'); Decimal total = (Decimal) ar.get('total'); ... }",
        en: "Pseudocode: ... WHERE IsClosed = false GROUP BY StageName HAVING SUM(Amount) > 100000 ORDER BY SUM(Amount) DESC]; for (AggregateResult ar : byStage) { String stage = (String) ar.get('StageName'); Decimal total = (Decimal) ar.get('total'); ... }",
      },
    ],
    solution: {
      es: `List<AggregateResult> byStage = [
    SELECT StageName, COUNT(Id) deals, SUM(Amount) total
    FROM Opportunity
    WHERE IsClosed = false
    GROUP BY StageName
    HAVING SUM(Amount) > 100000
    ORDER BY SUM(Amount) DESC
];

for (AggregateResult ar : byStage) {
    String  stage = (String)  ar.get('StageName');
    Integer deals = (Integer) ar.get('deals');
    Decimal total = (Decimal) ar.get('total');
    System.debug(stage + ' · ' + deals + ' oportunidades · ' + total);
}`,
      en: `List<AggregateResult> byStage = [
    SELECT StageName, COUNT(Id) deals, SUM(Amount) total
    FROM Opportunity
    WHERE IsClosed = false
    GROUP BY StageName
    HAVING SUM(Amount) > 100000
    ORDER BY SUM(Amount) DESC
];

for (AggregateResult ar : byStage) {
    String  stage = (String)  ar.get('StageName');
    Integer deals = (Integer) ar.get('deals');
    Decimal total = (Decimal) ar.get('total');
    System.debug(stage + ' · ' + deals + ' opportunities · ' + total);
}`,
    },
    checks: [
      {
        id: "m03-l05-c1",
        label: {
          es: "Una List<AggregateResult> byStage con COUNT(Id) deals y SUM(Amount) total",
          en: "A List<AggregateResult> byStage with COUNT(Id) deals and SUM(Amount) total",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*AggregateResult\\s*>\\s+byStage\\s*=\\s*\\[" },
            { op: "match", pattern: "COUNT\\(\\s*Id\\s*\\)\\s+deals\\b" },
            { op: "match", pattern: "SUM\\(\\s*Amount\\s*\\)\\s+total\\b" },
          ],
        },
        onFail: {
          es: "El resultado es List<AggregateResult>, y cada función lleva su alias detrás: COUNT(Id) deals, SUM(Amount) total.",
          en: "The result is List<AggregateResult>, and each function carries its alias after it: COUNT(Id) deals, SUM(Amount) total.",
        },
      },
      {
        id: "m03-l05-c2",
        label: {
          es: "Abiertas en WHERE, agrupadas por etapa",
          en: "Open ones in WHERE, grouped by stage",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "WHERE\\s+IsClosed\\s*=\\s*false[^\\]]*GROUP\\s+BY\\s+StageName\\b" },
          ],
        },
        onFail: {
          es: "WHERE IsClosed = false y, después, GROUP BY StageName.",
          en: "WHERE IsClosed = false and, after it, GROUP BY StageName.",
        },
      },
      {
        id: "m03-l05-c3",
        label: {
          es: "HAVING filtra los grupos de más de 100.000",
          en: "HAVING filters groups over 100,000",
        },
        rule: { op: "match", pattern: "GROUP\\s+BY\\s+StageName\\s+HAVING\\s+SUM\\(\\s*Amount\\s*\\)\\s*>\\s*100000\\b" },
        onFail: {
          es: "Justo después del GROUP BY: HAVING SUM(Amount) > 100000. Se repite la función, no el alias.",
          en: "Right after the GROUP BY: HAVING SUM(Amount) > 100000. Repeat the function, not the alias.",
        },
      },
      {
        id: "m03-l05-c4",
        label: {
          es: "Ordena por el total de mayor a menor",
          en: "Sorts by total, largest first",
        },
        rule: { op: "match", pattern: "ORDER\\s+BY\\s+SUM\\(\\s*Amount\\s*\\)\\s+DESC\\b" },
        onFail: {
          es: "ORDER BY SUM(Amount) DESC, al final.",
          en: "ORDER BY SUM(Amount) DESC, at the end.",
        },
      },
      {
        id: "m03-l05-c5",
        label: {
          es: "Lee la etapa y el total con casting y ya no suma a mano",
          en: "Reads stage and total with a cast and no longer sums by hand",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "\\(\\s*String\\s*\\)\\s*\\w+\\.get\\(\\s*'StageName'\\s*\\)" },
            { op: "match", pattern: "\\(\\s*Decimal\\s*\\)\\s*\\w+\\.get\\(\\s*'total'\\s*\\)" },
            { op: "absent", pattern: "total\\s*\\+=\\s*\\w+\\.Amount" },
          ],
        },
        onFail: {
          es: "Dentro del for de AggregateResult: (String) ar.get('StageName') y (Decimal) ar.get('total'). Y quita el bucle que sumaba a mano.",
          en: "Inside the AggregateResult for: (String) ar.get('StageName') and (Decimal) ar.get('total'). And remove the loop that summed by hand.",
        },
        onPass: {
          es: "A tu código llegan cuatro o cinco filas, una por etapa, aunque haya miles de oportunidades detrás.",
          en: "Four or five rows reach your code, one per stage, even with thousands of opportunities behind them.",
        },
      },
    ],
    rubric: [
      {
        es: "Si mañana piden además la oportunidad más grande de cada etapa, ¿qué función añades al SELECT?",
        en: "If tomorrow they also want the largest opportunity per stage, which function do you add to the SELECT?",
      },
    ],
  },
};
