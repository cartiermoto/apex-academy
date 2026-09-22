import type { Lesson } from "@/lib/types";

export const l02WhereOrderLimit: Lesson = {
  id: "m03-l02",
  slug: "where-order-by-limit",
  n: 2,
  kind: "lesson",
  minutes: 25,
  title: {
    es: "WHERE, ORDER BY, LIMIT",
    en: "WHERE, ORDER BY, LIMIT",
  },
  summary: {
    es: "Filtrar, ordenar y quedarte con los primeros: los tres controles que ya usas en cada informe, ahora dentro de la consulta.",
    en: "Filter, sort and keep the first few: the three controls you already use in every report, now inside the query.",
  },
  analogy: {
    es: "Los filtros, la lógica de filtros y el orden de un informe",
    en: "A report's filters, filter logic and sort order",
  },
  objectives: [
    {
      es: "Traducir un filtro de informe (igual a, contiene, empieza por, fecha relativa) a una cláusula WHERE.",
      en: "Translate a report filter (equals, contains, starts with, relative date) into a WHERE clause.",
    },
    {
      es: "Combinar condiciones con AND, OR y paréntesis, como la lógica de filtros de un informe.",
      en: "Combine conditions with AND, OR and brackets, like a report's filter logic.",
    },
    {
      es: "Ordenar con ORDER BY y limitar con LIMIT para traer solo lo que necesitas.",
      en: "Sort with ORDER BY and cap with LIMIT to bring back only what you need.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Una consulta sin filtro es un informe de «todas las cuentas»: útil una vez, peligroso siempre. En una org con 400.000 cuentas, traerlas todas para quedarte con cinco es lento y además choca con los [[governor-limits|governor limits]]. La regla de oro de SOQL es pedirle a la base de datos exactamente lo que necesitas, y nada más.",
        en: "A query with no filter is an “all accounts” report: useful once, dangerous always. In an org with 400,000 accounts, bringing them all back to keep five is slow and also runs into the [[governor-limits|governor limits]]. SOQL's golden rule is to ask the database for exactly what you need, and nothing more.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "En un informe añades filtros (Sector igual a Tecnología, Fecha de cierre este trimestre), escribes la lógica de filtros (1 AND (2 OR 3)), ordenas por una columna y, si quieres, limitas las filas con «Mostrar las 10 primeras». SOQL tiene exactamente esas cuatro piezas: WHERE, AND/OR con paréntesis, ORDER BY y LIMIT.",
        en: "In a report you add filters (Industry equals Technology, Close Date this quarter), write the filter logic (1 AND (2 OR 3)), sort by a column and, if you want, cap the rows with “Show the top 10”. SOQL has exactly those four pieces: WHERE, AND/OR with brackets, ORDER BY and LIMIT.",
      },
    },
    {
      type: "h",
      text: { es: "WHERE: los filtros", en: "WHERE: the filters" },
    },
    {
      type: "code",
      code: {
        es: `List<Opportunity> opps = [
    SELECT Id, Name, Amount, StageName
    FROM Opportunity
    WHERE Amount > 50000 AND IsClosed = false
];`,
        en: `List<Opportunity> opps = [
    SELECT Id, Name, Amount, StageName
    FROM Opportunity
    WHERE Amount > 50000 AND IsClosed = false
];`,
      },
      caption: {
        es: "Puedes repartir la consulta en varias líneas: Apex la lee igual. Así se leen mejor las consultas largas.",
        en: "You can spread the query over several lines: Apex reads it the same. Long queries read better this way.",
      },
    },
    {
      type: "table",
      head: [
        { es: "Operador del filtro de informe", en: "Report filter operator" },
        { es: "En SOQL", en: "In SOQL" },
      ],
      rows: [
        [{ es: "igual a", en: "equals" }, { es: "Industry = 'Retail'", en: "Industry = 'Retail'" }],
        [{ es: "distinto de", en: "not equal to" }, { es: "StageName != 'Closed Lost'", en: "StageName != 'Closed Lost'" }],
        [{ es: "mayor que / menor o igual", en: "greater than / less or equal" }, { es: "Amount > 50000 · Amount <= 1000", en: "Amount > 50000 · Amount <= 1000" }],
        [{ es: "contiene", en: "contains" }, { es: "Name LIKE '%Global%'", en: "Name LIKE '%Global%'" }],
        [{ es: "empieza por", en: "starts with" }, { es: "Name LIKE 'Acme%'", en: "Name LIKE 'Acme%'" }],
        [{ es: "igual a (varios valores)", en: "equals (several values)" }, { es: "Rating IN ('Hot', 'Warm')", en: "Rating IN ('Hot', 'Warm')" }],
        [{ es: "el campo está vacío", en: "the field is blank" }, { es: "Phone = null", en: "Phone = null" }],
      ],
    },
    {
      type: "list",
      items: [
        {
          es: "Los textos van entre comillas simples, igual que en Apex. Las comillas dobles no existen en SOQL.",
          en: "Text goes in single quotes, as in Apex. Double quotes do not exist in SOQL.",
        },
        {
          es: "En SOQL se compara con un solo =, no con ==. Es un lenguaje distinto dentro de los corchetes.",
          en: "In SOQL you compare with a single =, not ==. It is a different language inside the brackets.",
        },
        {
          es: "Las comparaciones de texto no distinguen mayúsculas: Industry = 'retail' encuentra 'Retail'. Como el buscador de un informe.",
          en: "Text comparisons are case-insensitive: Industry = 'retail' finds 'Retail'. Like a report's search box.",
        },
        {
          es: "En LIKE, % significa «cualquier cosa». '%Global%' es «contiene Global».",
          en: "In LIKE, % means “anything”. '%Global%' is “contains Global”.",
        },
      ],
    },
    {
      type: "h",
      text: { es: "AND, OR y paréntesis: la lógica de filtros", en: "AND, OR and brackets: the filter logic" },
    },
    {
      type: "p",
      text: {
        es: "Cuando un informe tiene tres filtros, Salesforce los une con AND por defecto; si quieres otra cosa, escribes la lógica de filtros: 1 AND (2 OR 3). En SOQL escribes esa misma lógica con las condiciones en lugar de los números. Y los paréntesis importan igual que allí: sin ellos, AND se evalúa antes que OR, como la multiplicación antes que la suma en el Módulo 1.",
        en: "When a report has three filters, Salesforce joins them with AND by default; if you want something else, you write the filter logic: 1 AND (2 OR 3). In SOQL you write that same logic with the conditions in place of the numbers. And the brackets matter just as they do there: without them, AND is evaluated before OR, like multiplication before addition in Module 1.",
      },
    },
    {
      type: "code",
      code: {
        es: `// Lógica de filtros del informe: 1 AND (2 OR 3)
[SELECT Id, Name FROM Account
 WHERE BillingCountry = 'Spain'
   AND (Industry = 'Retail' OR Industry = 'Banking')]

// Lo mismo, más corto, con IN
[SELECT Id, Name FROM Account
 WHERE BillingCountry = 'Spain'
   AND Industry IN ('Retail', 'Banking')]`,
        en: `// Report filter logic: 1 AND (2 OR 3)
[SELECT Id, Name FROM Account
 WHERE BillingCountry = 'Spain'
   AND (Industry = 'Retail' OR Industry = 'Banking')]

// The same, shorter, with IN
[SELECT Id, Name FROM Account
 WHERE BillingCountry = 'Spain'
   AND Industry IN ('Retail', 'Banking')]`,
      },
    },
    {
      type: "h",
      text: { es: "Fechas relativas: las mismas que en tus informes", en: "Relative dates: the same as in your reports" },
    },
    {
      type: "p",
      text: {
        es: "En un informe eliges «Fecha de cierre: este trimestre» o «Últimos 30 días» sin escribir ninguna fecha. SOQL tiene los mismos atajos, llamados literales de fecha. Se escriben sin comillas y se recalculan cada vez que se ejecuta la consulta, así que tu código sigue funcionando el año que viene.",
        en: "In a report you pick “Close Date: this quarter” or “Last 30 days” without typing any date. SOQL has the same shortcuts, called date literals. They are written without quotes and recalculated every time the query runs, so your code keeps working next year.",
      },
    },
    {
      type: "table",
      head: [
        { es: "En el informe", en: "In the report" },
        { es: "Literal de fecha SOQL", en: "SOQL date literal" },
      ],
      rows: [
        [{ es: "Hoy", en: "Today" }, { es: "CloseDate = TODAY", en: "CloseDate = TODAY" }],
        [{ es: "Este trimestre", en: "This quarter" }, { es: "CloseDate = THIS_QUARTER", en: "CloseDate = THIS_QUARTER" }],
        [{ es: "Últimos 30 días", en: "Last 30 days" }, { es: "CreatedDate = LAST_N_DAYS:30", en: "CreatedDate = LAST_N_DAYS:30" }],
        [{ es: "Próximos 7 días", en: "Next 7 days" }, { es: "ActivityDate = NEXT_N_DAYS:7", en: "ActivityDate = NEXT_N_DAYS:7" }],
        [{ es: "Año pasado", en: "Last year" }, { es: "CloseDate = LAST_YEAR", en: "CloseDate = LAST_YEAR" }],
      ],
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Date y Datetime otra vez", en: "Date and Datetime again" },
      text: {
        es: "CloseDate es un Date; CreatedDate es un Datetime. Los literales funcionan con los dos, pero si escribes una fecha a mano el formato cambia: CloseDate = 2026-12-31 (sin comillas) frente a CreatedDate > 2026-01-01T00:00:00Z. Es la misma diferencia de zona horaria que viste en el Módulo 1.",
        en: "CloseDate is a Date; CreatedDate is a Datetime. The literals work with both, but if you type a date by hand the format changes: CloseDate = 2026-12-31 (no quotes) versus CreatedDate > 2026-01-01T00:00:00Z. It is the same time-zone difference you saw in Module 1.",
      },
    },
    {
      type: "h",
      text: { es: "ORDER BY y LIMIT", en: "ORDER BY and LIMIT" },
    },
    {
      type: "code",
      code: {
        es: `// Las 10 oportunidades abiertas más grandes de este trimestre
List<Opportunity> top10 = [
    SELECT Id, Name, Amount
    FROM Opportunity
    WHERE IsClosed = false AND CloseDate = THIS_QUARTER
    ORDER BY Amount DESC NULLS LAST
    LIMIT 10
];`,
        en: `// This quarter's 10 biggest open opportunities
List<Opportunity> top10 = [
    SELECT Id, Name, Amount
    FROM Opportunity
    WHERE IsClosed = false AND CloseDate = THIS_QUARTER
    ORDER BY Amount DESC NULLS LAST
    LIMIT 10
];`,
      },
      caption: {
        es: "El orden de las cláusulas es fijo: SELECT, FROM, WHERE, ORDER BY, LIMIT. Si lo cambias, no compila.",
        en: "The order of the clauses is fixed: SELECT, FROM, WHERE, ORDER BY, LIMIT. Change it and it does not compile.",
      },
    },
    {
      type: "diagram",
      id: "m03-filter-funnel",
      caption: {
        es: "Cada cláusula deja pasar menos registros. Cuanto antes filtres, menos trabajo para todos.",
        en: "Each clause lets fewer records through. The earlier you filter, the less work for everyone.",
      },
    },
    {
      type: "h",
      text: { es: "Pruébalo: la consulta y su resultado, en vivo", en: "Try it: the query and its result, live" },
    },
    {
      type: "p",
      text: {
        es: "Abajo tienes una org de Sales Cloud en miniatura —cinco cuentas con sus contactos— y una consulta que puedes montar por piezas. Cambia el filtro, el orden, el límite y los campos: la consulta se reescribe sola y la tabla de resultados se recalcula al instante. Es el Developer Console sin salir de aquí.",
        en: "Below is a miniature Sales Cloud org — five accounts with their contacts — and a query you can assemble piece by piece. Change the filter, the order, the limit and the fields: the query rewrites itself and the result table recomputes instantly. It is the Developer Console without leaving this page.",
      },
    },
    {
      type: "diagram",
      id: "m03-soql-live",
      caption: {
        es: "Dos cosas que merece la pena probar: poner LIMIT sin ORDER BY (¿qué fila te toca?) y filtrar por 'technology' en minúsculas.",
        en: "Two things worth trying: LIMIT with no ORDER BY (which row do you get?) and filtering by lower-case 'technology'.",
      },
    },
    {
      type: "list",
      items: [
        {
          es: "ASC ordena de menor a mayor (o A→Z) y es el valor por defecto; DESC, al revés.",
          en: "ASC sorts smallest to largest (or A→Z) and is the default; DESC, the other way round.",
        },
        {
          es: "NULLS LAST manda los vacíos al final. Sin él, en orden ascendente los null salen primero.",
          en: "NULLS LAST sends blanks to the end. Without it, in ascending order the nulls come first.",
        },
        {
          es: "Sin ORDER BY, el orden no está garantizado: no des por hecho que llegan por fecha de creación.",
          en: "Without ORDER BY, the order is not guaranteed: do not assume they arrive by creation date.",
        },
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El método buscaCliente del libro recibe un código y hace esto: consulta SELECT * FROM clientes, recorre todas las filas con while(result.next()) y compara cada código con equals() hasta encontrar el suyo. Es buscar un cliente trayendo la agenda completa y leyéndola entera. Con una tabla pequeña no se nota; en Salesforce, con 50.000 filas, te comerías el límite de filas por transacción. La traducción correcta es una sola línea: [SELECT Id, Name FROM Account WHERE AccountNumber = :code LIMIT 1]. El filtro lo hace la base de datos, no tu bucle. (El :code es una variable de Apex dentro de la consulta: lo verás en la lección 4.)",
        en: "The book's buscaCliente method takes a code and does this: runs SELECT * FROM clientes, walks every row with while(result.next()) and compares each code with equals() until it finds its own. It is finding one customer by fetching the whole address book and reading it end to end. With a small table you do not notice; in Salesforce, with 50,000 rows, you would eat the per-transaction row limit. The right translation is a single line: [SELECT Id, Name FROM Account WHERE AccountNumber = :code LIMIT 1]. The database does the filtering, not your loop. (The :code is an Apex variable inside the query: you will see it in lesson 4.)",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar: escribe de memoria el orden de las cinco cláusulas. ¿Cómo se escribe «contiene 'Tech'» en SOQL? ¿Y «últimos 90 días»?",
        en: "Without looking: write the order of the five clauses from memory. How do you write “contains 'Tech'” in SOQL? And “last 90 days”?",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l02-q1",
      kind: "single",
      prompt: {
        es: "Un informe tiene la lógica de filtros 1 AND (2 OR 3), con 1 = País es España, 2 = Sector es Retail, 3 = Sector es Banca. ¿Qué WHERE es equivalente?",
        en: "A report has the filter logic 1 AND (2 OR 3), with 1 = Country is Spain, 2 = Industry is Retail, 3 = Industry is Banking. Which WHERE is equivalent?",
      },
      options: [
        {
          es: "WHERE BillingCountry = 'Spain' AND (Industry = 'Retail' OR Industry = 'Banking')",
          en: "WHERE BillingCountry = 'Spain' AND (Industry = 'Retail' OR Industry = 'Banking')",
        },
        {
          es: "WHERE BillingCountry = 'Spain' AND Industry = 'Retail' OR Industry = 'Banking'",
          en: "WHERE BillingCountry = 'Spain' AND Industry = 'Retail' OR Industry = 'Banking'",
        },
        {
          es: "WHERE (BillingCountry = 'Spain' AND Industry = 'Retail') OR Industry = 'Banking'",
          en: "WHERE (BillingCountry = 'Spain' AND Industry = 'Retail') OR Industry = 'Banking'",
        },
      ],
      answer: 0,
      explain: {
        es: "Sin paréntesis, AND va antes que OR: la segunda opción traería todas las cuentas de Banca del mundo. La tercera es exactamente eso, escrito explícito.",
        en: "Without brackets, AND goes before OR: the second option would bring back every Banking account in the world. The third is exactly that, written out.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l02-q2",
      kind: "single",
      prompt: {
        es: "¿Qué filtro encuentra las cuentas cuyo nombre empieza por «Acme»?",
        en: "Which filter finds the accounts whose name starts with “Acme”?",
      },
      options: [
        { es: "Name LIKE 'Acme%'", en: "Name LIKE 'Acme%'" },
        { es: "Name LIKE '%Acme%'", en: "Name LIKE '%Acme%'" },
        { es: "Name = 'Acme*'", en: "Name = 'Acme*'" },
        { es: "Name.startsWith('Acme')", en: "Name.startsWith('Acme')" },
      ],
      answer: 0,
      explain: {
        es: "% es «cualquier cosa». 'Acme%' es «Acme y después cualquier cosa». '%Acme%' sería «contiene». startsWith es un método de Apex, no de SOQL.",
        en: "% means “anything”. 'Acme%' is “Acme followed by anything”. '%Acme%' would be “contains”. startsWith is an Apex method, not SOQL.",
      },
      tags: ["interleaving", "spaced"],
      from: { es: "Repaso · M1 L3", en: "Review · M1 L3" },
    },
    {
      id: "m03-l02-q3",
      kind: "multi",
      prompt: {
        es: "Esta consulta no compila. ¿Qué está mal? (Marca todo lo que aplique.)",
        en: "This query does not compile. What is wrong? (Tick everything that applies.)",
      },
      code: {
        es: `[SELECT Id, Name FROM Lead
 WHERE Status == "Open"
 LIMIT 20
 ORDER BY CreatedDate DESC]`,
        en: `[SELECT Id, Name FROM Lead
 WHERE Status == "Open"
 LIMIT 20
 ORDER BY CreatedDate DESC]`,
      },
      options: [
        { es: "En SOQL se compara con =, no con ==.", en: "In SOQL you compare with =, not ==." },
        { es: "Los textos van entre comillas simples.", en: "Text goes in single quotes." },
        { es: "ORDER BY tiene que ir antes que LIMIT.", en: "ORDER BY has to come before LIMIT." },
        { es: "Falta pedir el campo Status en el SELECT.", en: "The Status field must be in the SELECT." },
      ],
      answers: [0, 1, 2],
      explain: {
        es: "Tres errores: ==, comillas dobles y el orden de las cláusulas. Filtrar por un campo no obliga a traerlo en el SELECT: solo lo necesitas ahí si vas a leerlo.",
        en: "Three mistakes: ==, double quotes and the clause order. Filtering on a field does not require it in the SELECT: you only need it there if you will read it.",
      },
      tags: ["find-error"],
    },
    {
      id: "m03-l02-q4",
      kind: "text",
      prompt: {
        es: "Escribe el literal de fecha para «los últimos 30 días».",
        en: "Write the date literal for “the last 30 days”.",
      },
      accept: ["^\\s*LAST_N_DAYS\\s*:\\s*30\\s*$"],
      placeholder: { es: "literal de fecha", en: "date literal" },
      explain: {
        es: "LAST_N_DAYS:30, sin comillas. Se recalcula cada vez, igual que la fecha relativa de un informe.",
        en: "LAST_N_DAYS:30, no quotes. It is recalculated every time, just like a report's relative date.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l02-q5",
      kind: "single",
      prompt: {
        es: "Necesitas la oportunidad abierta más reciente de una cuenta. ¿Cuál es la MEJOR consulta?",
        en: "You need an account's most recent open opportunity. Which is the BEST query?",
      },
      options: [
        {
          es: "WHERE AccountId = :accId AND IsClosed = false ORDER BY CreatedDate DESC LIMIT 1",
          en: "WHERE AccountId = :accId AND IsClosed = false ORDER BY CreatedDate DESC LIMIT 1",
        },
        {
          es: "WHERE AccountId = :accId, y luego recorrer la lista en Apex buscando la más reciente abierta",
          en: "WHERE AccountId = :accId, then loop the list in Apex looking for the newest open one",
        },
        {
          es: "WHERE IsClosed = false LIMIT 1",
          en: "WHERE IsClosed = false LIMIT 1",
        },
      ],
      answer: 0,
      explain: {
        es: "Filtra, ordena y limita la base de datos: viaja un solo registro. La segunda funciona, pero trae filas de más y hace a mano lo que SOQL hace gratis. La tercera ni siquiera filtra por cuenta ni ordena.",
        en: "The database filters, sorts and caps: a single record travels. The second works, but brings extra rows and does by hand what SOQL does for free. The third does not even filter by account or sort.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l02-q6",
      kind: "single",
      prompt: {
        es: "¿Qué devuelve una consulta con ORDER BY Amount ASC si algunas oportunidades no tienen importe?",
        en: "What does a query with ORDER BY Amount ASC return if some opportunities have no amount?",
      },
      options: [
        { es: "Las que no tienen importe salen primero.", en: "The ones with no amount come first." },
        { es: "Las que no tienen importe salen al final.", en: "The ones with no amount come last." },
        { es: "Las que no tienen importe no salen.", en: "The ones with no amount are left out." },
      ],
      answer: 0,
      explain: {
        es: "En orden ascendente, los null van delante por defecto. Si los quieres al final, añade NULLS LAST. Recuerda del Módulo 1: null no es cero.",
        en: "In ascending order, nulls go first by default. If you want them at the end, add NULLS LAST. Remember from Module 1: null is not zero.",
      },
      tags: ["spaced", "predict-output"],
      from: { es: "Repaso · M1 L6", en: "Review · M1 L6" },
    },
  ],

  exercise: {
    prompt: {
      es: "La directora de Ventas quiere, cada lunes, las 10 oportunidades abiertas más grandes que cierran este trimestre y superan los 50.000, para revisarlas en la reunión. Escribe la consulta.",
      en: "The Sales director wants, every Monday, the 10 biggest open opportunities closing this quarter and over 50,000, to review them in the meeting. Write the query.",
    },
    brief: [
      {
        es: "Guarda el resultado en una List<Opportunity> llamada bigDeals, con Id, Name, Amount y CloseDate.",
        en: "Store the result in a List<Opportunity> called bigDeals, with Id, Name, Amount and CloseDate.",
      },
      {
        es: "Solo abiertas (IsClosed), con importe mayor que 50.000 y cierre en el trimestre actual, sin escribir ninguna fecha a mano.",
        en: "Only open ones (IsClosed), with an amount over 50,000 and closing in the current quarter, without typing any date by hand.",
      },
      {
        es: "De mayor a menor importe, y como mucho 10.",
        en: "Largest amount first, and at most 10.",
      },
      {
        es: "Recorre bigDeals y muestra nombre e importe de cada una.",
        en: "Loop over bigDeals and show each one's name and amount.",
      },
    ],
    starter: {
      es: `// Las 10 oportunidades abiertas más grandes del trimestre (> 50.000)
List<Opportunity> bigDeals = [
    SELECT Id, Name
    FROM Opportunity
];
`,
      en: `// The quarter's 10 biggest open opportunities (> 50,000)
List<Opportunity> bigDeals = [
    SELECT Id, Name
    FROM Opportunity
];
`,
    },
    hints: [
      {
        es: "Te faltan dos campos en el SELECT y las tres cláusulas que vienen después de FROM, en su orden.",
        en: "You are missing two fields in the SELECT and the three clauses that come after FROM, in their order.",
      },
      {
        es: "Las tres condiciones van unidas con AND. El trimestre actual tiene un literal de fecha, sin comillas. DESC ordena de mayor a menor.",
        en: "The three conditions are joined with AND. The current quarter has a date literal, no quotes. DESC sorts largest first.",
      },
      {
        es: "Pseudocódigo: WHERE IsClosed = false AND Amount > 50000 AND CloseDate = THIS_QUARTER ORDER BY Amount DESC LIMIT 10 — y después un for (Opportunity o : bigDeals) con System.debug.",
        en: "Pseudocode: WHERE IsClosed = false AND Amount > 50000 AND CloseDate = THIS_QUARTER ORDER BY Amount DESC LIMIT 10 — then a for (Opportunity o : bigDeals) with System.debug.",
      },
    ],
    solution: {
      es: `List<Opportunity> bigDeals = [
    SELECT Id, Name, Amount, CloseDate
    FROM Opportunity
    WHERE IsClosed = false
      AND Amount > 50000
      AND CloseDate = THIS_QUARTER
    ORDER BY Amount DESC
    LIMIT 10
];

for (Opportunity o : bigDeals) {
    System.debug(o.Name + ' · ' + o.Amount);
}`,
      en: `List<Opportunity> bigDeals = [
    SELECT Id, Name, Amount, CloseDate
    FROM Opportunity
    WHERE IsClosed = false
      AND Amount > 50000
      AND CloseDate = THIS_QUARTER
    ORDER BY Amount DESC
    LIMIT 10
];

for (Opportunity o : bigDeals) {
    System.debug(o.Name + ' · ' + o.Amount);
}`,
    },
    checks: [
      {
        id: "m03-l02-c1",
        label: {
          es: "El SELECT trae Amount y CloseDate",
          en: "The SELECT brings Amount and CloseDate",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "SELECT[^\\]]*\\bAmount\\b[^\\]]*FROM\\s+Opportunity" },
            { op: "match", pattern: "SELECT[^\\]]*\\bCloseDate\\b[^\\]]*FROM\\s+Opportunity" },
          ],
        },
        onFail: {
          es: "Vas a leer el importe y la fecha: pídelos en el SELECT.",
          en: "You will read the amount and the date: ask for them in the SELECT.",
        },
      },
      {
        id: "m03-l02-c2",
        label: {
          es: "Filtra abiertas, > 50.000 y este trimestre",
          en: "Filters open, > 50,000 and this quarter",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "WHERE[^\\]]*IsClosed\\s*=\\s*false" },
            { op: "match", pattern: "WHERE[^\\]]*Amount\\s*>\\s*50000\\b" },
            { op: "match", pattern: "WHERE[^\\]]*CloseDate\\s*=\\s*THIS_QUARTER\\b" },
          ],
        },
        onFail: {
          es: "Las tres condiciones van en el WHERE unidas con AND: IsClosed = false, Amount > 50000 y CloseDate = THIS_QUARTER.",
          en: "All three conditions go in the WHERE joined with AND: IsClosed = false, Amount > 50000 and CloseDate = THIS_QUARTER.",
        },
      },
      {
        id: "m03-l02-c3",
        label: {
          es: "No escribe fechas a mano",
          en: "No hand-typed dates",
        },
        rule: { op: "absent", pattern: "\\d{4}-\\d{2}-\\d{2}" },
        onFail: {
          es: "Una fecha escrita a mano deja de valer el trimestre que viene. Usa el literal THIS_QUARTER.",
          en: "A hand-typed date stops working next quarter. Use the THIS_QUARTER literal.",
        },
      },
      {
        id: "m03-l02-c4",
        label: {
          es: "Ordena por importe descendente y limita a 10, en ese orden",
          en: "Sorts by amount descending and caps at 10, in that order",
        },
        rule: { op: "match", pattern: "ORDER\\s+BY\\s+Amount\\s+DESC[^\\]]*LIMIT\\s+10\\b" },
        onFail: {
          es: "Después del WHERE: ORDER BY Amount DESC y, al final, LIMIT 10.",
          en: "After the WHERE: ORDER BY Amount DESC and, last, LIMIT 10.",
        },
      },
      {
        id: "m03-l02-c5",
        label: {
          es: "Recorre bigDeals y muestra nombre e importe",
          en: "Loops bigDeals and shows name and amount",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "for\\s*\\(\\s*Opportunity\\s+\\w+\\s*:\\s*bigDeals\\s*\\)" },
            { op: "match", pattern: "System\\.debug\\([^;]*\\.Name\\b[^;]*\\.Amount\\b[^;]*\\)|System\\.debug\\([^;]*\\.Amount\\b[^;]*\\.Name\\b[^;]*\\)" },
          ],
        },
        onFail: {
          es: "for (Opportunity o : bigDeals) { System.debug(o.Name + ' · ' + o.Amount); }",
          en: "for (Opportunity o : bigDeals) { System.debug(o.Name + ' · ' + o.Amount); }",
        },
        onPass: {
          es: "La base de datos filtra, ordena y corta: a tu código solo llegan 10 filas.",
          en: "The database filters, sorts and cuts: only 10 rows reach your code.",
        },
      },
    ],
    rubric: [
      {
        es: "Si la directora pide «también las de más de 50.000 del trimestre que viene», ¿qué cambias y qué queda igual?",
        en: "If the director asks for “also the ones over 50,000 next quarter”, what do you change and what stays the same?",
      },
    ],
  },
};
