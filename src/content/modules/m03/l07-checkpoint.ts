import type { Lesson } from "@/lib/types";

export const l07Checkpoint: Lesson = {
  id: "m03-l07",
  slug: "checkpoint",
  n: 8,
  kind: "checkpoint",
  minutes: 40,
  title: {
    es: "Checkpoint del Módulo 3",
    en: "Module 3 checkpoint",
  },
  summary: {
    es: "Repaso de todo el módulo, un caso que combina relaciones, enlaces y agregados en dos consultas, y tus primeras consultas contra datos reales en la Developer Org.",
    en: "A review of the whole module, a case that combines relationships, binds and aggregates in two queries, and your first queries against real data in the Developer Org.",
  },
  analogy: {
    es: "Preparar la revisión de cartera que antes montabas con tres informes",
    en: "Preparing the portfolio review you used to build from three reports",
  },
  objectives: [
    {
      es: "Elegir la herramienta de consulta adecuada para cada pregunta de negocio.",
      en: "Pick the right query tool for each business question.",
    },
    {
      es: "Combinar subconsultas, variables de enlace y agregados en un mismo caso sin consultas dentro de bucles.",
      en: "Combine subqueries, bind variables and aggregates in one case without queries inside loops.",
    },
    {
      es: "Ejecutar consultas SOQL en el Query Editor de una Developer Org.",
      en: "Run SOQL queries in a Developer Org's Query Editor.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "En este módulo has pasado de fabricar registros con new a pedírselos a la base de datos, que es lo que hace el 90 % del código Apex real. Antes de escribir, piensa en la pregunta: casi siempre hay una consulta que la responde sola, sin bucles de más.",
        en: "In this module you went from making records with new to asking the database for them, which is what 90% of real Apex code does. Before writing, think about the question: there is almost always a query that answers it on its own, with no extra loops.",
      },
    },
    {
      type: "h",
      text: { es: "Lo que has aprendido, sub-lección a sub-lección", en: "What you learned, sub-lesson by sub-lesson" },
    },
    {
      type: "p",
      text: {
        es: "1 · Anatomía. SELECT son las columnas del informe y FROM su Report Type. La consulta va entre corchetes y devuelve una List. Solo puedes leer los campos que pediste, y asignar a un solo registro falla si no hay filas.",
        en: "1 · Anatomy. SELECT is the report's columns and FROM its Report Type. The query goes in square brackets and returns a List. You can only read the fields you asked for, and assigning to a single record fails if there are no rows.",
      },
    },
    {
      type: "p",
      text: {
        es: "2 · WHERE, ORDER BY, LIMIT. Los filtros, la lógica de filtros y el orden del informe. Texto entre comillas simples, un solo =, LIKE con %, IN para varios valores, literales de fecha como THIS_QUARTER. Las cláusulas van siempre en el mismo orden.",
        en: "2 · WHERE, ORDER BY, LIMIT. The report's filters, filter logic and sort. Text in single quotes, a single =, LIKE with %, IN for several values, date literals such as THIS_QUARTER. The clauses always go in the same order.",
      },
    },
    {
      type: "p",
      text: {
        es: "3 · Relaciones. Hacia el padre con un punto, como en una fórmula entre objetos (Account.Name, Customer__r.Name). Hacia los hijos con una subconsulta sobre el nombre de relación en plural, como una related list. Filtro cruzado con IN (SELECT ...).",
        en: "3 · Relationships. Towards the parent with a dot, like a cross-object formula (Account.Name, Customer__r.Name). Towards the children with a subquery on the plural relationship name, like a related list. Cross filter with IN (SELECT ...).",
      },
    },
    {
      type: "p",
      text: {
        es: "4 · Enlaces y dinámico. :variable mete valores de Apex en la consulta sin riesgo. IN :conjunto filtra por muchos Ids de una vez: el patrón Set → IN → Map. Database.query solo cuando la forma de la consulta cambia, y nunca pegando lo que escribe el usuario.",
        en: "4 · Binds and dynamic. :variable puts Apex values into the query safely. IN :set filters by many Ids at once: the Set → IN → Map pattern. Database.query only when the query's shape changes, and never gluing in what the user types.",
      },
    },
    {
      type: "p",
      text: {
        es: "5 · Agregados. COUNT, SUM, AVG, MIN y MAX con GROUP BY son el informe de resumen. Devuelven AggregateResult, que lees por alias con get() y casting. WHERE filtra filas; HAVING, grupos.",
        en: "5 · Aggregates. COUNT, SUM, AVG, MIN and MAX with GROUP BY are the summary report. They return AggregateResult, read by alias with get() and a cast. WHERE filters rows; HAVING, groups.",
      },
    },
    {
      type: "p",
      text: {
        es: "6 · SOSL. La búsqueda global en código: FIND, IN, RETURNING. Una lista por objeto, en el orden del RETURNING. Para cuando sabes el texto pero no dónde está.",
        en: "6 · SOSL. Global search in code: FIND, IN, RETURNING. One list per object, in the RETURNING's order. For when you know the text but not where it is.",
      },
    },
    {
      type: "diagram",
      id: "m03-cp-choose",
      caption: {
        es: "Antes de escribir, responde estas preguntas en orden: la primera que diga «sí» te da la herramienta.",
        en: "Before writing, answer these questions in order: the first one that says “yes” gives you the tool.",
      },
    },
    {
      type: "h",
      text: { es: "La regla que se lleva el Módulo 4", en: "The rule Module 4 takes with it" },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "Nunca una consulta dentro de un bucle", en: "Never a query inside a loop" },
      text: {
        es: "Cada consulta cuenta: una transacción puede lanzar 100 como máximo. Una consulta dentro de un for que recorre 200 registros son 200 consultas, y la transacción muere en la número 101. Todas las herramientas de este módulo —subconsultas, IN :conjunto, agregados— existen para que una sola consulta responda por todos los registros a la vez. En el Módulo 4 lo llamaremos bulkificación.",
        en: "Every query counts: a transaction can run 100 at most. A query inside a for that walks 200 records is 200 queries, and the transaction dies on number 101. Every tool in this module — subqueries, IN :set, aggregates — exists so that one query answers for all the records at once. In Module 4 we will call it bulkification.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Lo mismo que Flow te avisa", en: "The same thing Flow warns you about" },
      text: {
        es: "Flow Builder marca en amarillo un Get Records metido dentro de un Loop, y la guía de buenas prácticas dice «saca los elementos de datos del bucle». Es exactamente esta regla: el límite de consultas es de la transacción, y Flow y Apex lo comparten.",
        en: "Flow Builder flags a Get Records placed inside a Loop, and the best-practice guidance says “move data elements out of the loop”. It is exactly this rule: the query limit belongs to the transaction, and Flow and Apex share it.",
      },
    },
    {
      type: "h",
      text: { es: "Ahora en tu Developer Org", en: "Now in your Developer Org" },
    },
    {
      type: "p",
      text: {
        es: "Tu Developer Org trae datos de ejemplo: cuentas como Edge Communications o United Oil & Gas, con sus contactos y oportunidades. Vas a consultarlos de verdad.",
        en: "Your Developer Org comes with sample data: accounts such as Edge Communications or United Oil & Gas, with their contacts and opportunities. You are going to query them for real.",
      },
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          es: "Abre la Developer Console (menú del engranaje) y, en la parte de abajo, la pestaña Query Editor.",
          en: "Open the Developer Console (gear menu) and, at the bottom, the Query Editor tab.",
        },
        {
          es: "Pega una consulta sin corchetes, por ejemplo SELECT Name, Industry, (SELECT LastName FROM Contacts) FROM Account ORDER BY Name, y pulsa Execute. Verás una tabla, como un informe.",
          en: "Paste a query without brackets, for example SELECT Name, Industry, (SELECT LastName FROM Contacts) FROM Account ORDER BY Name, and click Execute. You will see a table, like a report.",
        },
        {
          es: "Prueba un agregado: SELECT StageName, COUNT(Id), SUM(Amount) FROM Opportunity GROUP BY StageName. Compara los números con un informe de resumen de Oportunidades por etapa: tienen que coincidir.",
          en: "Try an aggregate: SELECT StageName, COUNT(Id), SUM(Amount) FROM Opportunity GROUP BY StageName. Compare the numbers with an Opportunities summary report by stage: they must match.",
        },
        {
          es: "Escribe mal un campo a propósito (Industy) y ejecuta: lee el error. Ahora ya sabes qué te diría el compilador al guardar una clase.",
          en: "Misspell a field on purpose (Industy) and execute: read the error. Now you know what the compiler would tell you when saving a class.",
        },
        {
          es: "Por último, pega tu solución del ejercicio en Debug → Open Execute Anonymous Window, cambia la región a una que exista en tus datos (por ejemplo 'CA' o 'NY'), marca Open Log y mira el resultado con Debug Only.",
          en: "Finally, paste your exercise solution into Debug → Open Execute Anonymous Window, change the region to one that exists in your data (for example 'CA' or 'NY'), tick Open Log and look at the result with Debug Only.",
        },
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Mira el log con otros ojos", en: "Look at the log with new eyes" },
      text: {
        es: "En el log de ejecución busca la línea SOQL_EXECUTE_BEGIN: aparece una por cada consulta que lanzó tu código. Y al final, en el resumen de límites, verás «Number of SOQL queries: 2 out of 100». Ese contador es la protagonista del Módulo 4.",
        en: "In the execution log look for the SOQL_EXECUTE_BEGIN line: there is one for every query your code ran. And at the end, in the limits summary, you will see “Number of SOQL queries: 2 out of 100”. That counter is the star of Module 4.",
      },
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "Resumen de lo que no traduces de la capa de datos del libro: el driver ODBC y la conexión con usuario y contraseña (en Apex ya estás dentro); SELECT * (pides campo a campo); recorrer la tabla entera para encontrar una fila (usa WHERE); JOIN (recorres relaciones); y concatenar valores en la consulta (usa :variable). Lo que sí se mantiene es la idea de separar la capa de datos del resto: en el Módulo 7 la verás convertida en clases de servicio.",
        en: "A summary of what you do not translate from the book's data layer: the ODBC driver and the connection with user and password (in Apex you are already inside); SELECT * (you ask field by field); walking the whole table to find one row (use WHERE); JOIN (you walk relationships); and concatenating values into the query (use :variable). What does carry over is the idea of keeping the data layer apart from the rest: in Module 7 you will see it turned into service classes.",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l07-q1",
      kind: "single",
      prompt: {
        es: "Pregunta de negocio: «¿cuál es el importe medio de las oportunidades ganadas este año?». ¿Qué herramienta la responde mejor?",
        en: "Business question: “what is the average amount of opportunities won this year?”. Which tool answers it best?",
      },
      options: [
        {
          es: "SOQL con AVG(Amount) y WHERE IsWon = true AND CloseDate = THIS_YEAR",
          en: "SOQL with AVG(Amount) and WHERE IsWon = true AND CloseDate = THIS_YEAR",
        },
        {
          es: "SOSL con FIND 'won'",
          en: "SOSL with FIND 'won'",
        },
        {
          es: "Traer las oportunidades ganadas y calcular la media en un bucle",
          en: "Bring the won opportunities and compute the average in a loop",
        },
      ],
      answer: 0,
      explain: {
        es: "Es un número, no una lista: agregado. La base de datos calcula la media y te llega una fila.",
        en: "It is a number, not a list: aggregate. The database computes the average and one row reaches you.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l07-q2",
      kind: "multi",
      prompt: {
        es: "Esta consulta tiene varios errores. Márcalos.",
        en: "This query has several mistakes. Tick them.",
      },
      code: {
        es: `List<Contact> cs = [
    SELECT LastName, Account.Name
    FROM Contact
    WHERE Account.Industry = "Retail"
    LIMIT 50
    ORDER BY LastName
];`,
        en: `List<Contact> cs = [
    SELECT LastName, Account.Name
    FROM Contact
    WHERE Account.Industry = "Retail"
    LIMIT 50
    ORDER BY LastName
];`,
      },
      options: [
        { es: "Comillas dobles en 'Retail'.", en: "Double quotes around 'Retail'." },
        { es: "ORDER BY va antes de LIMIT.", en: "ORDER BY goes before LIMIT." },
        { es: "No se puede filtrar por un campo del padre.", en: "You cannot filter on a parent field." },
        { es: "Account.Name no se puede pedir desde Contact.", en: "Account.Name cannot be asked for from Contact." },
      ],
      answers: [0, 1],
      explain: {
        es: "Comillas simples y orden fijo de cláusulas. Filtrar y leer campos del padre con un punto es perfectamente válido.",
        en: "Single quotes and a fixed clause order. Filtering on and reading parent fields with a dot is perfectly valid.",
      },
      tags: ["find-error", "interleaving"],
    },
    {
      id: "m03-l07-q3",
      kind: "single",
      prompt: {
        es: "¿Cuántas consultas lanza este código si accounts tiene 150 cuentas?",
        en: "How many queries does this code run if accounts holds 150 accounts?",
      },
      code: {
        es: `for (Account a : accounts) {
    List<Contact> cs = [SELECT Id FROM Contact WHERE AccountId = :a.Id];
}`,
        en: `for (Account a : accounts) {
    List<Contact> cs = [SELECT Id FROM Contact WHERE AccountId = :a.Id];
}`,
      },
      options: [
        {
          es: "Ninguna completa: la transacción falla al llegar a la 101.",
          en: "None to completion: the transaction fails on reaching number 101.",
        },
        { es: "150, sin problema.", en: "150, no problem." },
        { es: "1, porque Apex las agrupa.", en: "1, because Apex groups them." },
      ],
      answer: 0,
      explain: {
        es: "Una consulta por vuelta. Con más de 100 vueltas, System.LimitException, que ni siquiera se puede capturar. La solución: una subconsulta o IN :accountIds, fuera del bucle.",
        en: "One query per iteration. With more than 100 iterations, System.LimitException, which cannot even be caught. The fix: a subquery or IN :accountIds, outside the loop.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M2 L5", en: "Review · M2 L5" },
    },
    {
      id: "m03-l07-q4",
      kind: "single",
      prompt: {
        es: "¿Qué muestra este código si hay 3 casos de prioridad High, 5 de Medium y ninguno de Low?",
        en: "What does this code print if there are 3 High-priority cases, 5 Medium and no Low?",
      },
      code: {
        es: `List<AggregateResult> r = [SELECT Priority, COUNT(Id) n
                           FROM Case GROUP BY Priority];
System.debug(r.size());`,
        en: `List<AggregateResult> r = [SELECT Priority, COUNT(Id) n
                           FROM Case GROUP BY Priority];
System.debug(r.size());`,
      },
      options: [
        { es: "2", en: "2" },
        { es: "3", en: "3" },
        { es: "8", en: "8" },
      ],
      answer: 0,
      explain: {
        es: "Una fila por grupo que existe. Low no tiene casos, así que no forma grupo. 8 sería el número de registros, no de grupos.",
        en: "One row per group that exists. Low has no cases, so it forms no group. 8 would be the number of records, not groups.",
      },
      tags: ["predict-output"],
    },
    {
      id: "m03-l07-q5",
      kind: "single",
      prompt: {
        es: "Desde Opportunity quieres el correo del propietario de la cuenta. ¿Qué escribes en el SELECT?",
        en: "From Opportunity you want the email of the account's owner. What do you write in the SELECT?",
      },
      options: [
        { es: "Account.Owner.Email", en: "Account.Owner.Email" },
        { es: "Owner.Email", en: "Owner.Email" },
        { es: "(SELECT Email FROM Owner)", en: "(SELECT Email FROM Owner)" },
      ],
      answer: 0,
      explain: {
        es: "Owner.Email sería el propietario de la oportunidad, que puede ser otra persona. Para el de la cuenta, primero subes a Account.",
        en: "Owner.Email would be the opportunity's owner, who may be someone else. For the account's, you climb to Account first.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l07-q6",
      kind: "single",
      prompt: {
        es: "Un campo de texto en un buscador de tu aplicación decide por qué campo se ordena la lista. ¿Cuál es la MEJOR forma de construir la consulta?",
        en: "A text field in your app's search screen decides which field the list is sorted by. What is the BEST way to build the query?",
      },
      options: [
        {
          es: "Database.query, comprobando antes que el campo elegido está en una lista de campos permitidos.",
          en: "Database.query, first checking that the chosen field is in a list of allowed fields.",
        },
        {
          es: "Database.query pegando directamente lo que llega del buscador.",
          en: "Database.query gluing in directly whatever comes from the search screen.",
        },
        {
          es: "ORDER BY :sortField en una consulta estática.",
          en: "ORDER BY :sortField in a static query.",
        },
      ],
      answer: 0,
      explain: {
        es: "Un nombre de campo cambia la forma de la consulta, así que no puede ir como enlace: la tercera no compila. Hace falta dinámico, pero validando contra una lista blanca.",
        en: "A field name changes the query's shape, so it cannot go as a bind: the third does not compile. Dynamic is needed, but validated against an allow-list.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l07-q7",
      kind: "single",
      prompt: {
        es: "Tu clase AccountReview tiene un método que devuelve las cuentas de un sector. ¿Cuál es la firma más coherente con lo aprendido?",
        en: "Your AccountReview class has a method that returns the accounts of an industry. Which signature is most consistent with what you learned?",
      },
      options: [
        {
          es: "public static List<Account> byIndustry(String industry) — y dentro WHERE Industry = :industry",
          en: "public static List<Account> byIndustry(String industry) — and inside WHERE Industry = :industry",
        },
        {
          es: "public static void byIndustry() — y dentro WHERE Industry = 'Retail'",
          en: "public static void byIndustry() — and inside WHERE Industry = 'Retail'",
        },
        {
          es: "public static String byIndustry(String industry) — que devuelve el texto de la consulta",
          en: "public static String byIndustry(String industry) — which returns the query text",
        },
      ],
      answer: 0,
      explain: {
        es: "El parámetro entra en la consulta como enlace y el método devuelve la lista. Es la base de la capa de datos que construirás en el Módulo 7.",
        en: "The parameter enters the query as a bind and the method returns the list. It is the foundation of the data layer you will build in Module 7.",
      },
      tags: ["spaced", "interleaving"],
      from: { es: "Repaso · M5 L5", en: "Review · M5 L5" },
    },
    {
      id: "m03-l07-q8",
      kind: "text",
      prompt: {
        es: "En tu Developer Org, ¿qué pestaña de la Developer Console ejecuta una consulta SOQL y la muestra como tabla? (dos palabras)",
        en: "In your Developer Org, which Developer Console tab runs a SOQL query and shows it as a table? (two words)",
      },
      accept: ["^\\s*query\\s*editor\\s*$"],
      placeholder: { es: "pestaña", en: "tab" },
      explain: {
        es: "Query Editor. Allí la consulta va sin corchetes; en Apex, con ellos.",
        en: "Query Editor. There the query goes without brackets; in Apex, with them.",
      },
      tags: ["recall"],
    },
  ],

  exercise: {
    prompt: {
      es: "TAREA 8 DE 8 · La entrega: la revisión trimestral completa de una región, que junta las siete tareas anteriores. Prepara la revisión trimestral de cartera de una región. Para cada cuenta de la región, el equipo quiere: su propietario, cuántas oportunidades abiertas tiene y el importe total de ese pipeline abierto. Antes lo montabas con tres informes; ahora, con dos consultas y ninguna dentro de un bucle.",
      en: "TASK 8 OF 8 · Delivery: the full quarterly review of a region, bringing the previous seven tasks together. Prepare a region's quarterly portfolio review. For each account in the region, the team wants: its owner, how many open opportunities it has and the total amount of that open pipeline. You used to build it from three reports; now, with two queries and none inside a loop.",
    },
    brief: [
      {
        es: "Consulta 1: las cuentas cuyo BillingState es el valor de la variable region (enlazada), con Id, Name, el nombre del propietario y una subconsulta de sus oportunidades abiertas.",
        en: "Query 1: the accounts whose BillingState is the value of the region variable (bound), with Id, Name, the owner's name and a subquery of their open opportunities.",
      },
      {
        es: "Junta los Ids de esas cuentas en un Set<Id> accountIds.",
        en: "Gather those accounts' Ids into a Set<Id> accountIds.",
      },
      {
        es: "Consulta 2: un agregado con el SUM(Amount) de alias total de las oportunidades abiertas de esas cuentas, agrupado por AccountId. Guárdalo en un Map<Id, Decimal> pipelineByAccount.",
        en: "Query 2: an aggregate with SUM(Amount) aliased total of those accounts' open opportunities, grouped by AccountId. Store it in a Map<Id, Decimal> pipelineByAccount.",
      },
      {
        es: "Recorre las cuentas y muestra nombre, propietario, número de oportunidades abiertas y pipeline.",
        en: "Loop the accounts and show name, owner, number of open opportunities and pipeline.",
      },
    ],
    starter: {
      es: `// CASO: la revisión trimestral de cartera del equipo de cuentas
// Tarea 8 de 8: la revisión trimestral de la región.

String region = 'CA';

// 1. Cuentas de la región, con propietario y oportunidades abiertas


// 2. Ids de esas cuentas


// 3. Pipeline abierto por cuenta (agregado) en un mapa


// 4. Informe final
`,
      en: `// CASE: the account team's quarterly portfolio review
// Task 8 of 8: the region's quarterly review.

String region = 'CA';

// 1. Accounts in the region, with owner and open opportunities


// 2. Those accounts' Ids


// 3. Open pipeline per account (aggregate) in a map


// 4. Final report
`,
    },
    hints: [
      {
        es: "Lecciones 3, 4 y 5 juntas: una subconsulta para contar hijos, un Set con IN para la segunda consulta y un agregado para sumar.",
        en: "Lessons 3, 4 and 5 together: a subquery to count children, a Set with IN for the second query and an aggregate to sum.",
      },
      {
        es: "La subconsulta es (SELECT Id FROM Opportunities WHERE IsClosed = false); la cuenta la sabes con a.Opportunities.size(). El agregado lee el Id con (Id) ar.get('AccountId') y el total con (Decimal) ar.get('total').",
        en: "The subquery is (SELECT Id FROM Opportunities WHERE IsClosed = false); you get the count with a.Opportunities.size(). The aggregate reads the Id with (Id) ar.get('AccountId') and the total with (Decimal) ar.get('total').",
      },
      {
        es: "Pseudocódigo: accounts = [SELECT Id, Name, Owner.Name, (SELECT Id FROM Opportunities WHERE IsClosed = false) FROM Account WHERE BillingState = :region]; for → accountIds.add(a.Id); for (AggregateResult ar : [SELECT AccountId, SUM(Amount) total FROM Opportunity WHERE IsClosed = false AND AccountId IN :accountIds GROUP BY AccountId]) pipelineByAccount.put(...); for → System.debug(...)",
        en: "Pseudocode: accounts = [SELECT Id, Name, Owner.Name, (SELECT Id FROM Opportunities WHERE IsClosed = false) FROM Account WHERE BillingState = :region]; for → accountIds.add(a.Id); for (AggregateResult ar : [SELECT AccountId, SUM(Amount) total FROM Opportunity WHERE IsClosed = false AND AccountId IN :accountIds GROUP BY AccountId]) pipelineByAccount.put(...); for → System.debug(...)",
      },
    ],
    solution: {
      es: `String region = 'CA';

// 1. Cuentas de la región, con propietario y oportunidades abiertas
List<Account> accounts = [
    SELECT Id, Name, Owner.Name,
           (SELECT Id FROM Opportunities WHERE IsClosed = false)
    FROM Account
    WHERE BillingState = :region
];

// 2. Ids de esas cuentas
Set<Id> accountIds = new Set<Id>();
for (Account a : accounts) {
    accountIds.add(a.Id);
}

// 3. Pipeline abierto por cuenta (agregado) en un mapa
Map<Id, Decimal> pipelineByAccount = new Map<Id, Decimal>();
for (AggregateResult ar : [
        SELECT AccountId, SUM(Amount) total
        FROM Opportunity
        WHERE IsClosed = false AND AccountId IN :accountIds
        GROUP BY AccountId]) {
    pipelineByAccount.put((Id) ar.get('AccountId'), (Decimal) ar.get('total'));
}

// 4. Informe final
for (Account a : accounts) {
    Decimal pipeline = pipelineByAccount.get(a.Id);
    System.debug(a.Name + ' · ' + a.Owner.Name + ' · '
        + a.Opportunities.size() + ' abiertas · ' + (pipeline ?? 0));
}`,
      en: `String region = 'CA';

// 1. Accounts in the region, with owner and open opportunities
List<Account> accounts = [
    SELECT Id, Name, Owner.Name,
           (SELECT Id FROM Opportunities WHERE IsClosed = false)
    FROM Account
    WHERE BillingState = :region
];

// 2. Those accounts' Ids
Set<Id> accountIds = new Set<Id>();
for (Account a : accounts) {
    accountIds.add(a.Id);
}

// 3. Open pipeline per account (aggregate) in a map
Map<Id, Decimal> pipelineByAccount = new Map<Id, Decimal>();
for (AggregateResult ar : [
        SELECT AccountId, SUM(Amount) total
        FROM Opportunity
        WHERE IsClosed = false AND AccountId IN :accountIds
        GROUP BY AccountId]) {
    pipelineByAccount.put((Id) ar.get('AccountId'), (Decimal) ar.get('total'));
}

// 4. Final report
for (Account a : accounts) {
    Decimal pipeline = pipelineByAccount.get(a.Id);
    System.debug(a.Name + ' · ' + a.Owner.Name + ' · '
        + a.Opportunities.size() + ' open · ' + (pipeline ?? 0));
}`,
    },
    checks: [
      {
        id: "m03-l07-c1",
        label: {
          es: "Consulta 1: cuentas de la región enlazada, con Owner.Name",
          en: "Query 1: accounts in the bound region, with Owner.Name",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "SELECT[^\\]]*\\bOwner\\.Name\\b[^\\]]*FROM\\s+Account\\b" },
            { op: "match", pattern: "FROM\\s+Account\\s+WHERE\\s+BillingState\\s*=\\s*:\\s*region\\b" },
          ],
        },
        onFail: {
          es: "SELECT Id, Name, Owner.Name, ... FROM Account WHERE BillingState = :region",
          en: "SELECT Id, Name, Owner.Name, ... FROM Account WHERE BillingState = :region",
        },
      },
      {
        id: "m03-l07-c2",
        label: {
          es: "Una subconsulta trae las oportunidades abiertas de cada cuenta",
          en: "A subquery brings each account's open opportunities",
        },
        rule: { op: "match", pattern: "\\(\\s*SELECT[^)]*FROM\\s+Opportunities\\s+WHERE\\s+IsClosed\\s*=\\s*false[^)]*\\)" },
        onFail: {
          es: "Dentro del SELECT de cuentas: (SELECT Id FROM Opportunities WHERE IsClosed = false).",
          en: "Inside the accounts SELECT: (SELECT Id FROM Opportunities WHERE IsClosed = false).",
        },
      },
      {
        id: "m03-l07-c3",
        label: {
          es: "Consulta 2: agregado por AccountId filtrado con IN :accountIds",
          en: "Query 2: aggregate by AccountId filtered with IN :accountIds",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Set\\s*<\\s*Id\\s*>\\s+accountIds\\b" },
            { op: "match", pattern: "SUM\\(\\s*Amount\\s*\\)\\s+total\\b[^\\]]*FROM\\s+Opportunity\\b" },
            { op: "match", pattern: "AccountId\\s+IN\\s*:\\s*accountIds\\b" },
            { op: "match", pattern: "GROUP\\s+BY\\s+AccountId\\b" },
          ],
        },
        onFail: {
          es: "SELECT AccountId, SUM(Amount) total FROM Opportunity WHERE IsClosed = false AND AccountId IN :accountIds GROUP BY AccountId",
          en: "SELECT AccountId, SUM(Amount) total FROM Opportunity WHERE IsClosed = false AND AccountId IN :accountIds GROUP BY AccountId",
        },
      },
      {
        id: "m03-l07-c4",
        label: {
          es: "El pipeline se guarda en un Map<Id, Decimal> con casting",
          en: "The pipeline is stored in a Map<Id, Decimal> with casts",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "Map\\s*<\\s*Id\\s*,\\s*Decimal\\s*>\\s+pipelineByAccount\\b" },
            { op: "match", pattern: "pipelineByAccount\\.put\\(\\s*\\(\\s*Id\\s*\\)\\s*\\w+\\.get\\(\\s*'AccountId'\\s*\\)\\s*,\\s*\\(\\s*Decimal\\s*\\)\\s*\\w+\\.get\\(\\s*'total'\\s*\\)\\s*\\)" },
          ],
        },
        onFail: {
          es: "pipelineByAccount.put((Id) ar.get('AccountId'), (Decimal) ar.get('total'));",
          en: "pipelineByAccount.put((Id) ar.get('AccountId'), (Decimal) ar.get('total'));",
        },
      },
      {
        id: "m03-l07-c5",
        label: {
          es: "Dos consultas en total y el informe usa la subconsulta y el mapa",
          en: "Two queries in total, and the report uses the subquery and the map",
        },
        rule: {
          op: "all",
          of: [
            { op: "count", pattern: "\\[\\s*SELECT\\b", min: 2, max: 2 },
            { op: "match", pattern: "\\.Opportunities\\.size\\(\\s*\\)" },
            { op: "match", pattern: "pipelineByAccount\\.get\\(\\s*\\w+\\.Id\\s*\\)" },
          ],
        },
        onFail: {
          es: "Exactamente dos consultas. En el bucle final: a.Opportunities.size() y pipelineByAccount.get(a.Id).",
          en: "Exactly two queries. In the final loop: a.Opportunities.size() and pipelineByAccount.get(a.Id).",
        },
        onPass: {
          es: "Dos consultas, da igual que la región tenga 5 cuentas o 5.000. Esa es la forma de pensar del Módulo 4.",
          en: "Two queries, whether the region has 5 accounts or 5,000. That is Module 4's way of thinking.",
        },
      },
      {
        id: "m03-l07-c6",
        label: {
          es: "Una cuenta sin pipeline no rompe el informe",
          en: "An account with no pipeline does not break the report",
        },
        rule: { op: "match", pattern: "\\?\\?\\s*0|!=\\s*null|==\\s*null" },
        optional: true,
        onFail: {
          es: "Una cuenta sin oportunidades abiertas no aparece en el mapa: get() devuelve null. Usa (pipeline ?? 0).",
          en: "An account with no open opportunities is not in the map: get() returns null. Use (pipeline ?? 0).",
        },
      },
    ],
    rubric: [
      {
        es: "La cuenta de oportunidades abiertas sale de la subconsulta y el importe del agregado. ¿Podrías sacar las dos del agregado? ¿Qué ganarías y qué perderías?",
        en: "The open-opportunity count comes from the subquery and the amount from the aggregate. Could you get both from the aggregate? What would you gain and lose?",
      },
    ],
  },
};
