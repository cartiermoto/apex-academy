import type { Lesson } from "@/lib/types";

export const l09Practica: Lesson = {
  id: "m03-l09",
  slug: "practica-opcional",
  n: 9,
  kind: "lesson",
  optional: true,
  minutes: 40,
  warmup: {
    title: { es: "Antes de practicar, una rápida", en: "Before you practise, a quick one" },
    prompt: { es: "En el checkpoint, ¿por qué el importe de cada cuenta salía de un agregado y no de una consulta por cuenta dentro del bucle?", en: "In the checkpoint, why did each account's amount come from an aggregate and not from one query per account inside the loop?" },
    options: [
      { es: "Por el límite de consultas de la transacción", en: "Because of the transaction's query limit" },
      { es: "Porque los agregados son más exactos", en: "Because aggregates are more accurate" },
      { es: "Porque SOQL no deja sumar de otra forma", en: "Because SOQL cannot add up any other way" },
    ],
    answer: 0,
    explain: { es: "Una consulta por cuenta dentro del bucle es el Get Records dentro de un Loop: con 200 cuentas choca con el límite de 100 consultas.", en: "One query per account inside the loop is the Get Records inside a Loop: with 200 accounts it hits the 100-query limit." },
  },
  title: { es: "Práctica: cinco encargos de Ventas", en: "Practice: five requests from Sales" },
  summary: {
    es: "Opcional. Cinco peticiones reales de un equipo de Sales Cloud, cada una resuelta con una herramienta distinta del módulo. No hay teoría nueva: solo decidir qué consulta responde a qué pregunta.",
    en: "Optional. Five real requests from a Sales Cloud team, each solved with a different tool from the module. No new theory: just deciding which query answers which question.",
  },
  analogy: {
    es: "La semana de un Admin: cinco informes que te piden por Slack",
    en: "An Admin's week: five reports people ask you for on Slack",
  },
  objectives: [
    {
      es: "Elegir entre SOQL simple, relación, subconsulta, agregado y SOSL a partir de una frase de negocio.",
      en: "Choose between plain SOQL, relationships, subqueries, aggregates and SOSL from a business sentence.",
    },
    {
      es: "Aplicar lo aprendido a campos y valores que el módulo no usó en sus ejemplos.",
      en: "Apply what you learned to fields and values the module's examples never used.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Esta sub-lección no cuenta para completar el módulo: es práctica extra, para cuando quieras comprobar que lo del módulo te sale sin mirar. Son cinco encargos como los que llegan un lunes cualquiera al equipo de Salesforce de una empresa que vende con Sales Cloud. Ninguno se resuelve copiando un ejemplo: todos piden un campo, un valor o una combinación que el módulo no enseñó literalmente.",
        en: "This sub-lesson does not count towards finishing the module: it is extra practice, for when you want to check the module's material comes out without looking. They are five requests like the ones that land on any Monday with the Salesforce team of a company selling with Sales Cloud. None is solved by copying an example: each asks for a field, a value or a combination the module never taught literally.",
      },
    },
    {
      type: "h",
      text: { es: "Calentamiento", en: "Warm-up" },
    },
    {
      type: "p",
      text: {
        es: "Antes de escribir, vuelve un momento al banco de pruebas. Intenta predecir cuántas filas devuelve cada combinación ANTES de elegirla: si aciertas casi siempre, estás listo.",
        en: "Before writing, go back to the test bench for a moment. Try to predict how many rows each combination returns BEFORE you pick it: if you are nearly always right, you are ready.",
      },
    },
    {
      type: "diagram",
      id: "m03-soql-live",
      caption: {
        es: "Predice primero, comprueba después. Es el mismo hábito que te va a pedir el Query Editor en tu Developer Org.",
        en: "Predict first, check afterwards. It is the same habit the Query Editor in your Developer Org will ask of you.",
      },
    },
    {
      type: "h",
      text: { es: "Los cinco encargos", en: "The five requests" },
    },
    {
      type: "table",
      head: [
        { es: "Quién lo pide", en: "Who asks" },
        { es: "Lo que dice", en: "What they say" },
        { es: "Pista: la herramienta", en: "Hint: the tool" },
      ],
      rows: [
        [
          { es: "1 · Jefa de SDRs", en: "1 · SDR lead" },
          { es: "«Los Leads Hot de esta última semana que nadie ha contactado todavía, los más nuevos arriba».", en: "“This last week's Hot Leads nobody has contacted yet, newest on top.”" },
          { es: "SOQL con fecha relativa", en: "SOQL with a relative date" },
        ],
        [
          { es: "2 · Director comercial", en: "2 · Sales director" },
          { es: "«Lo que se cierra en los próximos 30 días, con la cuenta y el comercial de cada una, lo más urgente primero».", en: "“What closes in the next 30 days, with each one's account and rep, most urgent first.”" },
          { es: "Subir al padre con el punto", en: "Up to the parent with the dot" },
        ],
        [
          { es: "3 · Responsable de soporte", en: "3 · Support lead" },
          { es: "«Las cuentas con algún caso abierto de prioridad alta, y de cada una SOLO esos casos».", en: "“Accounts with some open high-priority case, and for each ONLY those cases.”" },
          { es: "Subconsulta + IN", en: "Subquery + IN" },
        ],
        [
          { es: "4 · Marketing", en: "4 · Marketing" },
          { es: "«¿Qué origen de lead nos ha traído más dinero ganado este trimestre?».", en: "“Which lead source brought us the most won money this quarter?”" },
          { es: "Agregado con GROUP BY", en: "Aggregate with GROUP BY" },
        ],
        [
          { es: "5 · Una agente al teléfono", en: "5 · An agent on the phone" },
          { es: "«Me llama alguien de Northwind: búscame cuentas, contactos y casos abiertos que lo mencionen, donde sea».", en: "“Someone from Northwind is calling: find me accounts, contacts and open cases mentioning it, anywhere.”" },
          { es: "SOSL", en: "SOSL" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "Cómo lo harías con clics, para orientarte", en: "How you would do it with clicks, to get your bearings" },
      text: {
        es: "Para orientarme, yo empiezo siempre por cómo lo haría con clics. Los cuatro primeros son informes: uno de Leads con filtro de fecha relativa; uno de Oportunidades con columnas de la cuenta y del propietario; uno con Report Type «Cuentas con Casos» y filtro en el caso; y uno resumido agrupado por Lead Source. El quinto es la búsqueda global de la barra de arriba. Si sabes montar el informe, sabes qué tiene que llevar la consulta: solo cambia la sintaxis.",
        en: "To find my bearings, I always start with how I would do it with clicks. The first four are reports: a Leads one with a relative date filter; an Opportunities one with account and owner columns; one with the «Accounts with Cases» Report Type and a filter on the case; and a summary one grouped by Lead Source. The fifth is the global search at the top. If you know how to build the report, you know what the query needs: only the syntax changes.",
      },
      voice: "otter",
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "Y después, en tu Developer Org", en: "And afterwards, in your Developer Org" },
      text: {
        es: "Cuando el editor te dé el visto bueno, copia cada consulta al Query Editor del Developer Console y ejecútala contra tu org. Los datos de ejemplo que trae una Developer Org nueva tienen Leads, oportunidades y casos de sobra para que salgan filas. Si alguna devuelve cero, antes de pensar que está mal, comprueba en la interfaz si de verdad existe algún registro que la cumpla.",
        en: "Once the editor gives you the green light, copy each query into the Developer Console's Query Editor and run it against your org. The sample data a new Developer Org ships with has plenty of Leads, opportunities and cases for rows to come back. If one returns zero, before assuming it is wrong, check in the UI whether any record really matches it.",
      },
    },
  ],

  quiz: [
    {
      id: "m03-l09-q1",
      kind: "single",
      prompt: {
        es: "«¿Cuántas oportunidades abiertas tiene cada comercial?». ¿Qué herramienta responde a esto con una sola consulta y sin recorrer nada en Apex?",
        en: "“How many open opportunities does each rep have?”. Which tool answers this with one query and no looping in Apex?",
      },
      options: [
        { es: "Un agregado: COUNT(Id) con GROUP BY OwnerId.", en: "An aggregate: COUNT(Id) with GROUP BY OwnerId." },
        { es: "Una subconsulta de oportunidades dentro de User.", en: "An opportunities subquery inside User." },
        { es: "SOSL buscando el nombre de cada comercial.", en: "SOSL searching each rep's name." },
        { es: "Traer todas las oportunidades y contarlas con un Map.", en: "Bring every opportunity and count them with a Map." },
      ],
      answer: 0,
      explain: {
        es: "«Cuántos por cada…» es un informe resumido: COUNT con GROUP BY. Contarlas en un Map funciona, pero trae todas las filas para acabar con un número por comercial; el agregado hace ese trabajo en la base de datos.",
        en: "“How many per each…” is a summary report: COUNT with GROUP BY. Counting in a Map works, but brings every row just to end with one number per rep; the aggregate does that work in the database.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l09-q2",
      kind: "single",
      prompt: {
        es: "¿Qué oportunidades cumplen CloseDate = NEXT_N_DAYS:30?",
        en: "Which opportunities meet CloseDate = NEXT_N_DAYS:30?",
      },
      options: [
        {
          es: "Las que se cierran en los próximos 30 días: un rango entero hacia delante.",
          en: "Those closing in the next 30 days: a whole range going forward.",
        },
        {
          es: "Las que se cerraron en los últimos 30 días.",
          en: "Those that closed in the last 30 days.",
        },
        {
          es: "Solo las que se cierran exactamente el día 30 a partir de hoy.",
          en: "Only those closing exactly on day 30 from today.",
        },
        {
          es: "Las que se cierran este mes natural.",
          en: "Those closing this calendar month.",
        },
      ],
      answer: 0,
      explain: {
        es: "NEXT_N_DAYS:n es un rango que cubre los n días siguientes, como el filtro «próximos 30 días» de un informe; LAST_N_DAYS:n es el mismo rango hacia atrás. Ojo con el borde: si el día de HOY entra o no en el rango depende del literal. Cuando ese día importe —un cierre que vence hoy—, no lo supongas: compruébalo en el Query Editor con un registro que cierre hoy.",
        en: "NEXT_N_DAYS:n is a range covering the next n days, like a report's “next 30 days” filter; LAST_N_DAYS:n is the same range going backwards. Mind the edge: whether TODAY falls inside the range depends on the literal. When that day matters — a close due today — do not assume: check it in the Query Editor with a record closing today.",
      },
      tags: ["recall"],
    },
    {
      id: "m03-l09-q3",
      kind: "single",
      prompt: {
        es: "Una agente tiene un nombre a medias y no sabe si es una cuenta, un contacto o un caso. ¿Qué usas?",
        en: "An agent has half a name and does not know whether it is an account, a contact or a case. What do you use?",
      },
      options: [
        { es: "SOSL: busca un término en varios objetos a la vez.", en: "SOSL: it searches one term across several objects at once." },
        { es: "Tres SOQL con LIKE, una por objeto.", en: "Three SOQL queries with LIKE, one per object." },
        { es: "Una SOQL sobre Account con subconsultas de Contacts y Cases.", en: "One SOQL on Account with Contacts and Cases subqueries." },
        { es: "Un agregado con GROUP BY Name.", en: "An aggregate with GROUP BY Name." },
      ],
      answer: 0,
      explain: {
        es: "Cuando no sabes en qué objeto ni en qué campo está, es la búsqueda global: SOSL. Tres SOQL funcionarían pero gastan tres consultas y solo miran los campos que nombres; la subconsulta solo encontraría hijos de cuentas que ya coinciden.",
        en: "When you do not know which object or which field it is in, that is the global search: SOSL. Three SOQL queries would work but burn three queries and only look at the fields you name; the subquery would only find children of accounts that already match.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m03-l09-q4",
      kind: "single",
      prompt: {
        es: "Para el encargo 3, alguien escribe solo la subconsulta de casos con Priority = 'High' e IsClosed = false, sin ningún IN. ¿Qué recibe soporte?",
        en: "For request 3, someone writes only the cases subquery with Priority = 'High' and IsClosed = false, with no IN. What does support receive?",
      },
      options: [
        {
          es: "Todas las cuentas, y la mayoría con la lista de casos vacía.",
          en: "Every account, most with an empty cases list.",
        },
        {
          es: "Solo las cuentas con casos urgentes: la subconsulta ya filtra.",
          en: "Only accounts with urgent cases: the subquery already filters.",
        },
        {
          es: "Un error: sin IN la subconsulta no compila.",
          en: "An error: without IN the subquery does not compile.",
        },
        {
          es: "Solo los casos, sin las cuentas.",
          en: "Only the cases, without the accounts.",
        },
      ],
      answer: 0,
      explain: {
        es: "El WHERE de dentro elige qué casos viajan, nunca qué cuentas entran. Sin el IN en el WHERE de fuera, soporte recibe la org entera con listas vacías.",
        en: "The inner WHERE picks which cases travel, never which accounts get in. Without the IN in the outer WHERE, support gets the whole org with empty lists.",
      },
      tags: ["spaced"],
      from: { es: "Repaso · M3 Subconsultas", en: "Review · M3 Subqueries" },
    },
  ],

  exercise: {
    prompt: {
      es: "Los cinco encargos de la tabla, en un solo archivo. Cada uno es una consulta, y cada uno se corrige por separado: puedes ir resolviéndolos de uno en uno y pulsar Validar para ver cuáles llevas.",
      en: "The five requests from the table, in one file. Each is one query, and each is marked separately: you can solve them one at a time and press Validate to see which you have.",
    },
    brief: [
      {
        es: "hotLeads (List<Lead>): Leads con Rating 'Hot', Status 'Open - Not Contacted', creados en los últimos 7 días, los más recientes primero.",
        en: "hotLeads (List<Lead>): Leads with Rating 'Hot', Status 'Open - Not Contacted', created in the last 7 days, newest first.",
      },
      {
        es: "closingSoon (List<Opportunity>): oportunidades abiertas que se cierran en los próximos 30 días, con el nombre de su cuenta y de su propietario, la fecha de cierre más cercana primero.",
        en: "closingSoon (List<Opportunity>): open opportunities closing in the next 30 days, with their account's and owner's names, nearest close date first.",
      },
      {
        es: "urgentSupport (List<Account>): solo las cuentas con algún caso abierto de Priority 'High', y cada una con SOLO esos casos (CaseNumber y Subject).",
        en: "urgentSupport (List<Account>): only accounts with some open case of Priority 'High', each with ONLY those cases (CaseNumber and Subject).",
      },
      {
        es: "wonBySource (List<AggregateResult>): el importe ganado por LeadSource este trimestre, de mayor a menor. Ganado es StageName 'Closed Won'.",
        en: "wonBySource (List<AggregateResult>): the amount won per LeadSource this quarter, largest first. Won is StageName 'Closed Won'.",
      },
      {
        es: "found (List<List<SObject>>): SOSL que busca northwind en todos los campos y devuelve Account, Contact y los Case abiertos. Después, openCases: la lista de casos sacada de found.",
        en: "found (List<List<SObject>>): SOSL searching northwind in all fields, returning Account, Contact and open Case records. Then openCases: the list of cases taken out of found.",
      },
      {
        es: "Cinco consultas en total, ni una más.",
        en: "Five queries in total, not one more.",
      },
    ],
    starter: {
      es: `// Práctica opcional · cinco encargos de Ventas
// Resuélvelos en el orden que quieras. Cada uno se corrige por separado.

// 1 · Jefa de SDRs

// 2 · Director comercial

// 3 · Responsable de soporte

// 4 · Marketing

// 5 · Agente al teléfono

`,
      en: `// Optional practice · five requests from Sales
// Solve them in any order. Each one is marked separately.

// 1 · SDR lead

// 2 · Sales director

// 3 · Support lead

// 4 · Marketing

// 5 · Agent on the phone

`,
    },
    hints: [
      {
        es: "Mi truco: antes de escribir cada consulta, di en voz alta qué informe montarías con clics para responderla. El objeto principal del informe es el FROM; sus filtros, el WHERE; sus columnas de objetos relacionados, los puntos o la subconsulta.",
        en: "My trick: before writing each query, say out loud which report you would build with clicks to answer it. The report's main object is the FROM; its filters, the WHERE; its columns from related objects, the dots or the subquery.",
      },
      {
        es: "Lo que me ayudó: los rangos de fechas se escriben igual que los que ya viste cambiando el número: LAST_N_DAYS:7, NEXT_N_DAYS:30. El encargo 3 necesita el mismo filtro dos veces —en la subconsulta y en el IN—. El 4 agrupa por LeadSource. En el 5, los casos son el tercer elemento de found.",
        en: "What helped me: date ranges are written like the ones you already saw, changing the number: LAST_N_DAYS:7, NEXT_N_DAYS:30. Request 3 needs the same filter twice — in the subquery and in the IN. Number 4 groups by LeadSource. In 5, the cases are the third element of found.",
      },
      {
        es: "Te dejo el del 3: [SELECT Name, (SELECT CaseNumber, Subject FROM Cases WHERE IsClosed = false AND Priority = 'High') FROM Account WHERE Id IN (SELECT AccountId FROM Case WHERE IsClosed = false AND Priority = 'High')]. Y del 5: List<Case> openCases = (List<Case>) found[2];",
        en: "Here is number 3: [SELECT Name, (SELECT CaseNumber, Subject FROM Cases WHERE IsClosed = false AND Priority = 'High') FROM Account WHERE Id IN (SELECT AccountId FROM Case WHERE IsClosed = false AND Priority = 'High')]. And number 5: List<Case> openCases = (List<Case>) found[2];",
      },
    ],
    solution: {
      es: `// 1 · Jefa de SDRs
List<Lead> hotLeads = [
    SELECT Id, Name, Company, CreatedDate
    FROM Lead
    WHERE Rating = 'Hot'
      AND Status = 'Open - Not Contacted'
      AND CreatedDate = LAST_N_DAYS:7
    ORDER BY CreatedDate DESC
];

// 2 · Director comercial
List<Opportunity> closingSoon = [
    SELECT Name, Amount, CloseDate, Account.Name, Owner.Name
    FROM Opportunity
    WHERE IsClosed = false
      AND CloseDate = NEXT_N_DAYS:30
    ORDER BY CloseDate ASC
];

// 3 · Responsable de soporte
List<Account> urgentSupport = [
    SELECT Name,
        (SELECT CaseNumber, Subject
         FROM Cases
         WHERE IsClosed = false AND Priority = 'High')
    FROM Account
    WHERE Id IN (SELECT AccountId FROM Case
                 WHERE IsClosed = false AND Priority = 'High')
];

// 4 · Marketing
List<AggregateResult> wonBySource = [
    SELECT LeadSource, SUM(Amount) won
    FROM Opportunity
    WHERE StageName = 'Closed Won'
      AND CloseDate = THIS_QUARTER
    GROUP BY LeadSource
    ORDER BY SUM(Amount) DESC
];

// 5 · Agente al teléfono
List<List<SObject>> found = [
    FIND 'northwind*'
    IN ALL FIELDS
    RETURNING Account(Id, Name),
              Contact(Id, Name, Email),
              Case(Id, CaseNumber, Subject WHERE IsClosed = false)
];
List<Case> openCases = (List<Case>) found[2];`,
      en: `// 1 · SDR lead
List<Lead> hotLeads = [
    SELECT Id, Name, Company, CreatedDate
    FROM Lead
    WHERE Rating = 'Hot'
      AND Status = 'Open - Not Contacted'
      AND CreatedDate = LAST_N_DAYS:7
    ORDER BY CreatedDate DESC
];

// 2 · Sales director
List<Opportunity> closingSoon = [
    SELECT Name, Amount, CloseDate, Account.Name, Owner.Name
    FROM Opportunity
    WHERE IsClosed = false
      AND CloseDate = NEXT_N_DAYS:30
    ORDER BY CloseDate ASC
];

// 3 · Support lead
List<Account> urgentSupport = [
    SELECT Name,
        (SELECT CaseNumber, Subject
         FROM Cases
         WHERE IsClosed = false AND Priority = 'High')
    FROM Account
    WHERE Id IN (SELECT AccountId FROM Case
                 WHERE IsClosed = false AND Priority = 'High')
];

// 4 · Marketing
List<AggregateResult> wonBySource = [
    SELECT LeadSource, SUM(Amount) won
    FROM Opportunity
    WHERE StageName = 'Closed Won'
      AND CloseDate = THIS_QUARTER
    GROUP BY LeadSource
    ORDER BY SUM(Amount) DESC
];

// 5 · Agent on the phone
List<List<SObject>> found = [
    FIND 'northwind*'
    IN ALL FIELDS
    RETURNING Account(Id, Name),
              Contact(Id, Name, Email),
              Case(Id, CaseNumber, Subject WHERE IsClosed = false)
];
List<Case> openCases = (List<Case>) found[2];`,
    },
    checks: [
      {
        id: "l09-c1",
        label: { es: "1 · Leads Hot de la última semana sin contactar", en: "1 · Last week's uncontacted Hot Leads" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Lead\\s*>\\s+hotLeads\\s*=\\s*\\[[^\\]]*FROM\\s+Lead\\b" },
            { op: "match", pattern: "Rating\\s*=\\s*'Hot'" },
            { op: "match", pattern: "Status\\s*=\\s*'Open - Not Contacted'" },
            { op: "match", pattern: "CreatedDate\\s*=\\s*LAST_N_DAYS\\s*:\\s*7\\b" },
            { op: "match", pattern: "ORDER\\s+BY\\s+CreatedDate\\s+DESC" },
          ],
        },
        onFail: {
          es: "Tres filtros con AND (Rating, Status y fecha) y el orden. «Última semana» es LAST_N_DAYS:7: el mismo rango que viste con 30, con otro número. «Los más nuevos arriba» es DESC.",
          en: "Three filters joined with AND (Rating, Status and date) and the order. “Last week” is LAST_N_DAYS:7: the same range you saw with 30, with another number. “Newest on top” is DESC.",
        },
        otter: {
          es: "Es un informe de Leads con tres filtros y un orden: Rating, Status y fecha, unidos con AND. «Última semana» es LAST_N_DAYS:7, el mismo filtro relativo que viste con 30. «Los más nuevos arriba» es DESC.",
          en: "It is a Leads report with three filters and a sort: Rating, Status and date, joined with AND. «Last week» is LAST_N_DAYS:7, the same relative filter you saw with 30. «Newest at the top» is DESC.",
        },
      },
      {
        id: "l09-c2",
        label: { es: "2 · Cierres de los próximos 30 días con cuenta y comercial", en: "2 · Closes in the next 30 days with account and rep" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Opportunity\\s*>\\s+closingSoon\\s*=\\s*\\[" },
            { op: "match", pattern: "Account\\s*\\.\\s*Name" },
            { op: "match", pattern: "Owner\\s*\\.\\s*Name" },
            { op: "match", pattern: "CloseDate\\s*=\\s*NEXT_N_DAYS\\s*:\\s*30\\b" },
            { op: "match", pattern: "ORDER\\s+BY\\s+CloseDate(\\s+ASC)?\\s*\\]" },
          ],
        },
        onFail: {
          es: "La cuenta y el comercial son padres de la oportunidad: Account.Name y Owner.Name. «Próximos 30 días» es NEXT_N_DAYS:30, y abierta es IsClosed = false. «Lo más urgente primero» es la fecha de cierre ascendente: ORDER BY CloseDate (ASC es el orden por defecto).",
          en: "The account and the rep are the opportunity's parents: Account.Name and Owner.Name. “Next 30 days” is NEXT_N_DAYS:30, and open is IsClosed = false. “Most urgent first” is close date ascending: ORDER BY CloseDate (ASC is the default).",
        },
        otter: {
          es: "Un informe de Oportunidades con columnas de la cuenta y del comercial, que son padres: Account.Name y Owner.Name. «Próximos 30 días» es NEXT_N_DAYS:30 y abierta es IsClosed = false. Lo más urgente primero es la fecha de cierre ascendente: ORDER BY CloseDate.",
          en: "An Opportunities report with columns from the account and the sales rep, which are parents: Account.Name and Owner.Name. «Next 30 days» is NEXT_N_DAYS:30 and open is IsClosed = false. Most urgent first is close date ascending: ORDER BY CloseDate.",
        },
      },
      {
        id: "l09-c3",
        label: { es: "3 · Solo cuentas con casos urgentes, con solo esos casos", en: "3 · Only accounts with urgent cases, with only those cases" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*Account\\s*>\\s+urgentSupport\\s*=\\s*\\[" },
            {
              op: "match",
              pattern:
                "\\(\\s*SELECT[^()]*FROM\\s+Cases\\b[^()]*(IsClosed\\s*=\\s*false[^()]*Priority\\s*=\\s*'High'|Priority\\s*=\\s*'High'[^()]*IsClosed\\s*=\\s*false)[^()]*\\)",
            },
            {
              op: "match",
              pattern:
                "\\bId\\s+IN\\s*\\(\\s*SELECT\\s+AccountId\\s+FROM\\s+Case\\s+WHERE[^()]*(IsClosed\\s*=\\s*false[^()]*Priority\\s*=\\s*'High'|Priority\\s*=\\s*'High'[^()]*IsClosed\\s*=\\s*false)[^()]*\\)",
            },
          ],
        },
        onFail: {
          es: "Hacen falta las dos piezas: la subconsulta FROM Cases con el filtro de urgentes (qué casos viajan) y Id IN (SELECT AccountId FROM Case WHERE …) con el mismo filtro (qué cuentas entran). Abierto y prioridad alta, en los dos sitios.",
          en: "Both pieces are needed: the FROM Cases subquery with the urgent filter (which cases travel) and Id IN (SELECT AccountId FROM Case WHERE …) with the same filter (which accounts get in). Open and high priority, in both places.",
        },
        otter: {
          es: "Es tu Report Type «Cuentas con Casos» con filtro en el caso, y hacen falta las dos piezas: la subconsulta FROM Cases con el filtro de urgentes (qué casos viajan) y Id IN (SELECT AccountId FROM Case WHERE …) con el mismo filtro (qué cuentas entran).",
          en: "It is your «Accounts with Cases» Report Type with a filter on the case, and it needs both pieces: the FROM Cases subquery with the urgent filter (which cases travel) and Id IN (SELECT AccountId FROM Case WHERE …) with the same filter (which accounts get in).",
        },
      },
      {
        id: "l09-c4",
        label: { es: "4 · Importe ganado por origen este trimestre", en: "4 · Won amount per source this quarter" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*AggregateResult\\s*>\\s+wonBySource\\s*=\\s*\\[" },
            { op: "match", pattern: "SUM\\s*\\(\\s*Amount\\s*\\)" },
            { op: "match", pattern: "StageName\\s*=\\s*'Closed Won'" },
            { op: "match", pattern: "GROUP\\s+BY\\s+LeadSource\\b" },
            { op: "match", pattern: "ORDER\\s+BY\\s+SUM\\s*\\(\\s*Amount\\s*\\)\\s+DESC" },
          ],
        },
        onFail: {
          es: "«Por cada origen» es GROUP BY LeadSource, y lo que se suma es Amount. Ganado es StageName = 'Closed Won' y este trimestre, THIS_QUARTER. Para el «de mayor a menor» se ordena por el propio agregado: ORDER BY SUM(Amount) DESC.",
          en: "“Per source” is GROUP BY LeadSource, and what gets summed is Amount. Won is StageName = 'Closed Won' and this quarter, THIS_QUARTER. For “largest first” you order by the aggregate itself: ORDER BY SUM(Amount) DESC.",
        },
        otter: {
          es: "Un informe de resumen agrupado por Lead Source: GROUP BY LeadSource, sumando Amount. Ganado es StageName = 'Closed Won', este trimestre es THIS_QUARTER, y de mayor a menor se ordena por el propio total: ORDER BY SUM(Amount) DESC.",
          en: "A summary report grouped by Lead Source: GROUP BY LeadSource, adding up Amount. Won is StageName = 'Closed Won', this quarter is THIS_QUARTER, and highest first is sorting by the total itself: ORDER BY SUM(Amount) DESC.",
        },
      },
      {
        id: "l09-c5",
        label: { es: "5 · Búsqueda global y los casos sacados del resultado", en: "5 · Global search and the cases taken out of the result" },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "List\\s*<\\s*List\\s*<\\s*SObject\\s*>\\s*>\\s+found\\s*=\\s*\\[\\s*FIND\\b" },
            { op: "match", pattern: "FIND\\s*'northwind\\*?'" },
            { op: "match", pattern: "RETURNING[^\\]]*\\bCase\\s*\\([^)]*WHERE\\s+IsClosed\\s*=\\s*false" },
            { op: "match", pattern: "List\\s*<\\s*Case\\s*>\\s+openCases\\s*=\\s*\\(\\s*List\\s*<\\s*Case\\s*>\\s*\\)\\s*found\\s*\\[\\s*2\\s*\\]" },
          ],
        },
        onFail: {
          es: "FIND 'northwind' (con * al final si quieres que también encuentre «Northwind Trading») IN ALL FIELDS RETURNING Account(…), Contact(…), Case(… WHERE IsClosed = false). Los resultados salen en el orden del RETURNING, así que los casos son found[2], convertidos con (List<Case>).",
          en: "FIND 'northwind' (with a trailing * if you also want “Northwind Trading”) IN ALL FIELDS RETURNING Account(…), Contact(…), Case(… WHERE IsClosed = false). Results come back in RETURNING order, so the cases are found[2], converted with (List<Case>).",
        },
        otter: {
          es: "Es la búsqueda global: FIND 'northwind' (con * al final si quieres que encuentre también «Northwind Trading») IN ALL FIELDS RETURNING Account(…), Contact(…), Case(… WHERE IsClosed = false). Los casos son el tercer grupo, found[2], convertido con (List<Case>).",
          en: "It is global search: FIND 'northwind' (with * at the end if you also want it to find «Northwind Trading») IN ALL FIELDS RETURNING Account(…), Contact(…), Case(… WHERE IsClosed = false). The cases are the third group, found[2], converted with (List<Case>).",
        },
      },
      {
        id: "l09-c6",
        label: { es: "Cinco consultas en total", en: "Five queries in total" },
        rule: { op: "count", pattern: "\\[\\s*(SELECT|FIND)\\b", min: 5, max: 5 },
        onFail: {
          es: "Un encargo, una consulta. Si hay más de cinco, alguna sobra —o está repetida, o hay una dentro de un bucle—; si hay menos, falta un encargo.",
          en: "One request, one query. More than five means one is spare — repeated, or inside a loop; fewer means a request is missing.",
        },
        otter: {
          es: "Cinco encargos, cinco consultas, como cinco informes. Si hay más, alguna sobra o está dentro de un bucle; si hay menos, falta un encargo.",
          en: "Five requests, five queries, like five reports. If there are more, one is surplus or sits inside a loop; if there are fewer, a request is missing.",
        },
      },
    ],
    rubric: [
      {
        es: "Cuando las tengas, ejecuta cada una en el Query Editor de tu Developer Org y compara el número de filas con el que te da el informe equivalente montado con clics. Si no coinciden, uno de los dos está mal: averigua cuál.",
        en: "Once you have them, run each one in your Developer Org's Query Editor and compare the row count with the equivalent report built with clicks. If they differ, one of the two is wrong: find out which.",
      },
    ],
    outro: {
      es: "¡Cinco encargos, cinco consultas! Si montas los informes equivalentes en tu Developer Org y comparas el número de filas, verás que SOQL es tu informe de siempre, escrito. En el Módulo 4 pasas de leer datos a escribirlos, con DML.",
      en: "Five requests, five queries! If you build the equivalent reports in your Developer Org and compare the row counts, you will see SOQL is your usual report, written down. In Module 4 you move from reading data to writing it, with DML.",
    },
    voice: "otter",
  },
};
